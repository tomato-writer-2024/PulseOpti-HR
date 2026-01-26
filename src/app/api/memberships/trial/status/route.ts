import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { subscriptions, users } from '@/storage/database/shared/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth/middleware';

/**
 * GET /api/memberships/trial/status
 * 查询试用状态
 */
export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const user = authResult as any;

  try {
    const db = await getDb();

    // 查询订阅信息
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id));

    if (!subscription) {
      return NextResponse.json({
        hasTrial: false,
        hasTrialUsed: false,
        isTrialActive: false,
        canStartTrial: true,
        message: '您还没有开始免费试用',
      });
    }

    // 计算剩余天数
    let trialDaysRemaining = 0;
    let isTrialActive = false;

    if (subscription.isTrial && subscription.trialEndsAt) {
      const now = new Date();
      const trialEndsAt = new Date(subscription.trialEndsAt);
      const diffTime = trialEndsAt.getTime() - now.getTime();
      trialDaysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      isTrialActive = trialDaysRemaining > 0;
    }

    // 判断是否可以开始试用
    const canStartTrial = !subscription.hasTrialUsed && subscription.tier === 'free';

    return NextResponse.json({
      hasTrial: subscription.hasTrialUsed,
      hasTrialUsed: subscription.hasTrialUsed,
      isTrialActive,
      isTrial: subscription.isTrial,
      trialEndsAt: subscription.trialEndsAt,
      trialDaysRemaining,
      canStartTrial,
      currentTier: subscription.tier,
      message: isTrialActive
        ? `免费试用剩余 ${trialDaysRemaining} 天`
        : subscription.hasTrialUsed
        ? '已经使用过免费试用'
        : '您还没有开始免费试用',
      trialBenefits: {
        tier: 'professional',
        maxEmployees: 200,
        aiCallsPerMonth: 1000,
        storage: 100, // GB
        features: [
          '完整招聘系统（AI简历筛选）',
          '360度绩效评估',
          '人才盘点九宫格',
          '离职预测分析',
          '自定义报表',
          '工作流引擎',
          '优先技术支持',
        ],
      },
    });
  } catch (error) {
    console.error('查询试用状态失败:', error);
    return NextResponse.json(
      { error: '查询试用状态失败' },
      { status: 500 }
    );
  }
}
