import { NextRequest, NextResponse } from 'next/server';

// 模拟数据
const mockPointsData = {
  balance: 12500,
  totalEarned: 25000,
  totalSpent: 12500,
  level: 'Gold',
  nextLevelPoints: 25000,
  rules: [
    {
      id: '1',
      name: '每日签到',
      points: 10,
      description: '每天签到可获得10积分',
      icon: 'calendar',
      enabled: true,
      dailyLimit: 1,
    },
    {
      id: '2',
      name: '完成绩效考核',
      points: 100,
      description: '按时完成绩效考核可获得100积分',
      icon: 'target',
      enabled: true,
      dailyLimit: 0,
    },
    {
      id: '3',
      name: '推荐新员工',
      points: 500,
      description: '成功推荐一名新员工入职可获得500积分',
      icon: 'users',
      enabled: true,
      dailyLimit: 0,
    },
    {
      id: '4',
      name: '参与培训',
      points: 50,
      description: '完成培训课程可获得50积分',
      icon: 'graduation-cap',
      enabled: true,
      dailyLimit: 5,
    },
  ],
  records: [
    {
      id: '1',
      userId: 'user1',
      userName: '张三',
      type: 'earn',
      points: 10,
      reason: '每日签到',
      createdAt: new Date('2024-01-27'),
    },
    {
      id: '2',
      userId: 'user1',
      userName: '张三',
      type: 'earn',
      points: 100,
      reason: '完成绩效考核',
      createdAt: new Date('2024-01-26'),
    },
    {
      id: '3',
      userId: 'user1',
      userName: '张三',
      type: 'spend',
      points: -50,
      reason: '兑换咖啡券',
      createdAt: new Date('2024-01-25'),
    },
    {
      id: '4',
      userId: 'user1',
      userName: '张三',
      type: 'earn',
      points: 50,
      reason: '参与培训',
      createdAt: new Date('2024-01-24'),
    },
  ],
  shopItems: [
    {
      id: '1',
      name: '咖啡券',
      points: 50,
      description: '兑换一杯咖啡',
      image: '/coffee.jpg',
      stock: 100,
    },
    {
      id: '2',
      name: '电影票',
      points: 200,
      description: '兑换电影票一张',
      image: '/movie.jpg',
      stock: 50,
    },
    {
      id: '3',
      name: '健身卡',
      points: 500,
      description: '兑换健身月卡',
      image: '/gym.jpg',
      stock: 20,
    },
  ],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'balance') {
    return NextResponse.json({
      success: true,
      data: {
        balance: mockPointsData.balance,
        totalEarned: mockPointsData.totalEarned,
        totalSpent: mockPointsData.totalSpent,
        level: mockPointsData.level,
        nextLevelPoints: mockPointsData.nextLevelPoints,
      },
    });
  }

  if (action === 'rules') {
    return NextResponse.json({
      success: true,
      data: mockPointsData.rules,
    });
  }

  if (action === 'records') {
    return NextResponse.json({
      success: true,
      data: mockPointsData.records,
    });
  }

  if (action === 'shop') {
    return NextResponse.json({
      success: true,
      data: mockPointsData.shopItems,
    });
  }

  // 默认返回所有数据
  return NextResponse.json({
    success: true,
    data: mockPointsData,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, points, reason, itemId } = body;

    if (action === 'earn') {
      // 获取积分
      return NextResponse.json({
        success: true,
        data: {
          balance: mockPointsData.balance + points,
          record: {
            id: Date.now().toString(),
            userId,
            userName: '张三',
            type: 'earn',
            points,
            reason,
            createdAt: new Date(),
          },
        },
      });
    }

    if (action === 'spend') {
      // 消费积分
      const item = mockPointsData.shopItems.find(i => i.id === itemId);
      if (!item) {
        return NextResponse.json({
          success: false,
          error: '商品不存在',
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: {
          balance: mockPointsData.balance - points,
          record: {
            id: Date.now().toString(),
            userId,
            userName: '张三',
            type: 'spend',
            points: -points,
            reason: `兑换${item.name}`,
            createdAt: new Date(),
          },
        },
      });
    }

    return NextResponse.json({
      success: false,
      error: '未知操作',
    }, { status: 400 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '请求格式错误',
    }, { status: 400 });
  }
}
