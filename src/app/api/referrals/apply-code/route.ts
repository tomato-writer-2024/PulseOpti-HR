import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { invitationCodes, invitationRecords, users, companies, subscriptions } from '@/storage/database/shared/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth/middleware';

/**
 * POST /api/referrals/apply-code
 * 使用邀请码
 */
export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const user = authResult as any;

  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: '邀请码不能为空' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // 查询邀请码
    const [invitationCode] = await db
      .select()
      .from(invitationCodes)
      .where(eq(invitationCodes.code, code));

    if (!invitationCode) {
      return NextResponse.json(
        { error: '邀请码不存在', code: 'INVALID_CODE' },
        { status: 404 }
      );
    }

    // 检查邀请码是否已过期
    if (invitationCode.expiresAt && new Date() > new Date(invitationCode.expiresAt)) {
      return NextResponse.json(
        { error: '邀请码已过期', code: 'CODE_EXPIRED' },
        { status: 400 }
      );
    }

    // 检查邀请码是否已被使用
    if (invitationCode.status === 'used') {
      return NextResponse.json(
        { error: '邀请码已被使用', code: 'CODE_USED' },
        { status: 400 }
      );
    }

    // 检查是否自己邀请自己
    if (invitationCode.inviterUserId === user.id) {
      return NextResponse.json(
        { error: '不能使用自己的邀请码', code: 'SELF_INVITE' },
        { status: 400 }
      );
    }

    // 查询邀请人信息
    const [inviter] = await db
      .select()
      .from(users)
      .where(eq(users.id, invitationCode.inviterUserId));

    if (!inviter) {
      return NextResponse.json(
        { error: '邀请人不存在', code: 'INVITER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // 创建邀请记录
    await db.insert(invitationRecords).values({
      inviterUserId: invitationCode.inviterUserId,
      inviterCompanyId: invitationCode.inviterCompanyId,
      inviteeUserId: user.id,
      inviteeCompanyId: user.companyId,
      invitationCode: code,
      status: 'completed',
      rewardStatus: 'pending',
      rewardAmount: invitationCode.rewardAmount,
    });

    // 更新邀请码状态
    await db
      .update(invitationCodes)
      .set({
        status: 'used',
        inviteeUserId: user.id,
        inviteeCompanyId: user.companyId,
        usedAt: new Date(),
        rewardGiven: true,
        rewardGivenAt: new Date(),
      })
      .where(eq(invitationCodes.id, invitationCode.id));

    // 给邀请人发放奖励
    await giveRewardToInviter(invitationCode.inviterUserId, invitationCode.rewardAmount);

    // 给被邀请人发放奖励（7天专业版试用）
    await giveTrialToInvitee(user.id, user.companyId);

    return NextResponse.json({
      success: true,
      message: '邀请码使用成功',
      reward: {
        inviterReward: {
          amount: invitationCode.rewardAmount / 100,
          type: 'cash',
          description: `邀请成功，获得${invitationCode.rewardAmount / 100}元现金奖励`,
        },
        inviteeReward: {
          type: 'trial',
          days: 7,
          tier: 'professional',
          description: '获得专业版 7 天免费试用',
        },
      },
    });
  } catch (error) {
    console.error('使用邀请码失败:', error);
    return NextResponse.json(
      { error: '使用邀请码失败' },
      { status: 500 }
    );
  }
}

/**
 * 给邀请人发放奖励
 */
async function giveRewardToInviter(userId: string, amount: number) {
  const db = await getDb();

  // TODO: 实现奖励发放逻辑
  // 1. 创建奖励记录
  // 2. 增加账户余额或创建优惠券
  console.log(`给用户 ${userId} 发放奖励：${amount / 100}元`);
}

/**
 * 给被邀请人发放试用
 */
async function giveTrialToInvitee(userId: string, companyId: string) {
  const db = await getDb();

  // 计算试用结束时间（7天后）
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 7);

  // 更新或创建订阅记录
  const [currentSubscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId));

  if (currentSubscription) {
    // 更新现有订阅
    await db
      .update(subscriptions)
      .set({
        tier: 'professional',
        trialEndsAt,
        hasTrialUsed: true,
        isTrial: true,
        trialDaysRemaining: 7,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, currentSubscription.id));
  } else {
    // 创建新订阅记录
    await db.insert(subscriptions).values({
      companyId,
      userId,
      tier: 'professional',
      trialEndsAt,
      hasTrialUsed: true,
      isTrial: true,
      trialDaysRemaining: 7,
      status: 'active',
      autoRenew: false,
      metadata: {
        trialStartedAt: new Date(),
        trialDaysTotal: 7,
      },
    });
  }

  // 更新企业信息
  await db
    .update(companies)
    .set({
      maxEmployees: 200,
      subscriptionTier: 'professional',
      subscriptionExpiresAt: trialEndsAt,
      updatedAt: new Date(),
    })
    .where(eq(companies.id, companyId));
}
