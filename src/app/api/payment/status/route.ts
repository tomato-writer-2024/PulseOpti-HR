import { NextRequest, NextResponse } from 'next/server';

// 查询支付状态接口
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: '缺少订单ID' },
        { status: 400 }
      );
    }

    // TODO: 实际项目中应该：
    // 1. 查询数据库中的订单状态
    // 2. 如果订单未支付，调用支付平台接口查询最新状态
    // 3. 返回最新的支付状态

    // 模拟订单状态
    const mockOrders: Record<string, any> = {
      '1': {
        id: '1',
        orderNo: 'ORD202504180001',
        status: 'paid',
        paidAt: new Date().toISOString(),
        method: 'alipay',
      },
      '2': {
        id: '2',
        orderNo: 'ORD202504150002',
        status: 'paid',
        paidAt: new Date().toISOString(),
        method: 'wechat',
      },
      '3': {
        id: '3',
        orderNo: 'ORD202504100003',
        status: 'pending',
        paidAt: null,
        method: 'alipay',
      },
    };

    const order = mockOrders[orderId];

    if (!order) {
      return NextResponse.json(
        { error: '订单不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderNo: order.orderNo,
        status: order.status,
        paidAt: order.paidAt,
        method: order.method,
      },
    });
  } catch (error) {
    console.error('查询支付状态错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
