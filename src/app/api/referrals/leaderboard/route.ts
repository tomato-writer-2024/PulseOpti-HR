import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { invitationRecords, users } from '@/storage/database/shared/schema';
import { sql, eq, and } from 'drizzle-orm';

/**
 * GET /api/referrals/leaderboard
 * 邀请排行榜
 */
export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const period = searchParams.get('period') || 'all'; // all, week, month

    // 计算时间范围
    let startDate: Date | null = null;
    if (period === 'week') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    }

    // 构建条件
    const conditions = [eq(invitationRecords.status, 'completed')];

    // 如果有时间限制，添加时间过滤
    if (startDate) {
      conditions.push(sql`${invitationRecords.createdAt} >= ${startDate}`);
    }

    // 查询邀请排行榜
    const leaderboard = await db
      .select({
        inviterUserId: invitationRecords.inviterUserId,
        userName: users.name,
        userAvatar: users.avatarUrl,
        invitationCount: sql<number>`count(*)`.as('invitation_count'),
        totalReward: sql<number>`sum(${invitationRecords.rewardAmount})`.as('total_reward'),
      })
      .from(invitationRecords)
      .innerJoin(users, eq(invitationRecords.inviterUserId, users.id))
      .where(and(...conditions))
      .groupBy(invitationRecords.inviterUserId, users.name, users.avatarUrl)
      .orderBy(sql`count(*) DESC`)
      .limit(limit);

    // 格式化排行榜数据
    const formattedLeaderboard = leaderboard.map((item, index) => ({
      rank: index + 1,
      userId: item.inviterUserId,
      userName: item.userName || '匿名用户',
      userAvatar: item.userAvatar,
      invitationCount: item.invitationCount,
      totalReward: item.totalReward / 100, // 转换为元
      averageReward: (item.totalReward / 100) / item.invitationCount,
      isTop: index < 3, // 前三名
    }));

    return NextResponse.json({
      success: true,
      period,
      limit,
      leaderboard: formattedLeaderboard,
      summary: {
        total: leaderboard.length,
        topInviter: formattedLeaderboard[0] || null,
      },
    });
  } catch (error) {
    console.error('获取邀请排行榜失败:', error);
    return NextResponse.json(
      { error: '获取邀请排行榜失败' },
      { status: 500 }
    );
  }
}
