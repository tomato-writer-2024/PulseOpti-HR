import { NextRequest, NextResponse } from 'next/server';

// 支付回调接口
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, paymentMethod, tradeNo, status, signature } = body;

    // 验证签名
    // TODO: 实际项目中应该验证支付宝/微信的签名

    if (!orderId || !paymentMethod || !tradeNo || !status) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // TODO: 实际项目中应该：
    // 1. 验证回调签名
    // 2. 查询订单状态，避免重复处理
    // 3. 更新订单状态
    // 4. 开通服务权限
    // 5. 发送通知（邮件、短信）
    // 6. 记录支付日志

    if (status === 'success') {
      // 支付成功
      return NextResponse.json({
        success: true,
        message: '支付成功',
        data: {
          orderId,
          paidAt: new Date().toISOString(),
        },
      });
    } else if (status === 'failed') {
      // 支付失败
      return NextResponse.json({
        success: false,
        message: '支付失败',
        data: {
          orderId,
          error: '支付被拒绝',
        },
      });
    } else if (status === 'pending') {
      // 支付处理中
      return NextResponse.json({
        success: false,
        message: '支付处理中',
        data: {
          orderId,
          status: 'pending',
        },
      });
    }

    return NextResponse.json(
      { error: '未知的支付状态' },
      { status: 400 }
    );
  } catch (error) {
    console.error('支付回调错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
