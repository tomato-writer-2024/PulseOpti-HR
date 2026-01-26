import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { invitationCodes, users } from '@/storage/database/shared/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth/middleware';
import crypto from 'crypto';

/**
 * POST /api/referrals/generate-code
 * 生成邀请码
 */
export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const user = authResult as any;

  try {
    const db = await getDb();

    // 检查用户是否已有未使用的邀请码
    const [existingCode] = await db
      .select()
      .from(invitationCodes)
      .where(
        eq(invitationCodes.inviterUserId, user.id)
      );

    if (existingCode && existingCode.status === 'pending' && !existingCode.expiresAt) {
      // 如果有未过期的邀请码，直接返回
      return NextResponse.json({
        success: true,
        code: existingCode.code,
        message: '您已有可用的邀请码',
        inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.aizhixuan.com.cn'}?invite=${existingCode.code}`,
      });
    }

    // 生成新的邀请码（8位随机字符串）
    const code = generateInvitationCode();

    // 验证邀请码是否唯一
    const [codeExists] = await db
      .select()
      .from(invitationCodes)
      .where(eq(invitationCodes.code, code));

    if (codeExists) {
      // 如果邀请码已存在，重新生成
      return POST(request); // 递归调用
    }

    // 创建邀请码记录
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 3); // 3个月后过期

    await db.insert(invitationCodes).values({
      code,
      inviterUserId: user.id,
      inviterCompanyId: user.companyId,
      status: 'pending',
      expiresAt,
      rewardType: 'cash', // 现金奖励
      rewardAmount: 5900, // 59元（分）
      metadata: {
        maxUses: 10, // 最多可邀请10人
        currentUses: 0,
      },
    });

    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.aizhixuan.com.cn'}?invite=${code}`;

    return NextResponse.json({
      success: true,
      code,
      message: '邀请码生成成功',
      inviteUrl,
      reward: {
        amount: 59,
        type: 'cash',
        description: '成功邀请1人奖励59元现金',
      },
      shareInfo: {
        title: '我在使用 PulseOpti HR 脉策聚效，一起来体验吧！',
        description: 'PulseOpti HR 是一款智能人力资源管理 SaaS 平台，内置 AI 面试、离职预测、人才盘点等功能。通过我的邀请链接注册，可获得专业版 7 天免费试用！',
      },
    });
  } catch (error) {
    console.error('生成邀请码失败:', error);
    return NextResponse.json(
      { error: '生成邀请码失败' },
      { status: 500 }
    );
  }
}

/**
 * 生成邀请码
 */
function generateInvitationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 去除易混淆的字符
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
