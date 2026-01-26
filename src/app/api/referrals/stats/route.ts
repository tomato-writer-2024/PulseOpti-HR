import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { invitationCodes, invitationRecords } from '@/storage/database/shared/schema';
import { eq, sql, and, count } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth/middleware';

/**
 * GET /api/referrals/stats
 * 邀请统计
 */
export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const user = authResult as any;

  try {
    const db = await getDb();

    // 查询用户的邀请码
    const [invitationCode] = await db
      .select()
      .from(invitationCodes)
      .where(eq(invitationCodes.inviterUserId, user.id));

    if (!invitationCode) {
      return NextResponse.json({
        success: true,
        hasCode: false,
        stats: {
          totalInvitations: 0,
          completedInvitations: 0,
          pendingInvitations: 0,
          totalReward: 0,
          averageReward: 0,
        },
        rank: null,
        recommendation: '立即生成邀请码，开始邀请好友',
      });
    }

    // 查询邀请统计
    const invitationStats = await db
      .select({
        totalInvitations: count(),
        completedInvitations: sql<number>`count(*) filter (where status = 'completed')`,
        pendingInvitations: sql<number>`count(*) filter (where status = 'pending')`,
        totalReward: sql<number>`sum(reward_amount) filter (where status = 'completed')`,
      })
      .from(invitationRecords)
      .where(eq(invitationRecords.inviterUserId, user.id));

    const stats = invitationStats[0];

    // 计算平均奖励
    const averageReward =
      stats.completedInvitations > 0
        ? stats.totalReward / stats.completedInvitations
        : 0;

    // 查询邀请排名
    const [rankResult] = await db
      .select({
        rank: sql<number>`rank() over (order by count(*) desc)`,
      })
      .from(invitationRecords)
      .where(eq(invitationRecords.status, 'completed'))
      .groupBy(invitationRecords.inviterUserId)
      .orderBy(sql`count(*) DESC`);

    const rank = rankResult ? rankResult.rank : null;

    // 生成推荐信息
    let recommendation = '继续邀请好友，获得更多奖励';
    if (stats.totalInvitations === 0) {
      recommendation = '立即分享邀请链接，邀请好友注册';
    } else if (stats.totalInvitations < 5) {
      recommendation = '再邀请 5 位好友，可以获得额外奖励';
    } else if (stats.totalInvitations < 10) {
      recommendation = '您已经邀请了 ' + stats.totalInvitations + ' 位好友，继续努力冲榜！';
    } else {
      recommendation = '恭喜您成为邀请达人，继续保持！';
    }

    return NextResponse.json({
      success: true,
      hasCode: true,
      code: invitationCode.code,
      codeStatus: invitationCode.status,
      expiresAt: invitationCode.expiresAt,
      inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.aizhixuan.com.cn'}?invite=${invitationCode.code}`,
      stats: {
        totalInvitations: stats.totalInvitations,
        completedInvitations: stats.completedInvitations,
        pendingInvitations: stats.pendingInvitations,
        totalReward: stats.totalReward / 100, // 转换为元
        averageReward: averageReward / 100, // 转换为元
      },
      rank,
      recommendation,
      nextMilestone: getNextMilestone(stats.completedInvitations),
    });
  } catch (error) {
    console.error('获取邀请统计失败:', error);
    return NextResponse.json(
      { error: '获取邀请统计失败' },
      { status: 500 }
    );
  }
}

/**
 * 获取下一个里程碑
 */
function getNextMilestone(currentInvitations: number): {
  invitations: number;
  reward: number;
  description: string;
} | null {
  const milestones = [
    { invitations: 5, reward: 100, description: '邀请5人，获得100元额外奖励' },
    { invitations: 10, reward: 200, description: '邀请10人，获得200元额外奖励' },
    { invitations: 20, reward: 500, description: '邀请20人，获得500元额外奖励' },
    { invitations: 50, reward: 1000, description: '邀请50人，获得1000元额外奖励' },
  ];

  for (const milestone of milestones) {
    if (currentInvitations < milestone.invitations) {
      return milestone;
    }
  }

  return null;
}
