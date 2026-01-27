import { NextRequest, NextResponse } from 'next/server';

// 支付方式类型
type PaymentMethod = 'alipay' | 'wechat' | 'bank';

// 创建支付订单接口
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, paymentMethod, autoRenew, invoiceNeeded, invoiceTitle, invoiceType } = body;

    // 验证参数
    if (!orderId || !paymentMethod) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 验证支付方式
    const validMethods: PaymentMethod[] = ['alipay', 'wechat', 'bank'];
    if (!validMethods.includes(paymentMethod as PaymentMethod)) {
      return NextResponse.json(
        { error: '不支持的支付方式' },
        { status: 400 }
      );
    }

    // TODO: 实际项目中应该：
    // 1. 验证订单是否存在且状态为待支付
    // 2. 根据支付方式调用对应的支付API
    // 3. 生成支付二维码或支付链接
    // 4. 返回支付信息

    // 模拟支付宝支付
    if (paymentMethod === 'alipay') {
      const paymentInfo = {
        orderId,
        tradeNo: `ALI${Date.now()}`,
        qrCode: 'https://qr.alipay.com/baxxxx', // 实际应该是支付宝返回的二维码链接
        paymentUrl: `https://qr.alipay.com/baxxxx`,
        expiredAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      };

      return NextResponse.json({
        success: true,
        data: paymentInfo,
      });
    }

    // 模拟微信支付
    if (paymentMethod === 'wechat') {
      const paymentInfo = {
        orderId,
        tradeNo: `WX${Date.now()}`,
        qrCode: 'weixin://wxpay/bizpayurl?pr=xxxxx', // 实际应该是微信返回的二维码链接
        codeUrl: 'weixin://wxpay/bizpayurl?pr=xxxxx',
        expiredAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      };

      return NextResponse.json({
        success: true,
        data: paymentInfo,
      });
    }

    // 模拟银行转账
    if (paymentMethod === 'bank') {
      const paymentInfo = {
        orderId,
        tradeNo: `BANK${Date.now()}`,
        bankInfo: {
          bankName: '中国工商银行',
          accountName: 'PulseOpti科技有限公司',
          accountNo: '6222 0211 1234 5678 901',
          bankBranch: '北京市朝阳区支行',
        },
        expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };

      return NextResponse.json({
        success: true,
        data: paymentInfo,
      });
    }

    return NextResponse.json(
      { error: '创建支付订单失败' },
      { status: 500 }
    );
  } catch (error) {
    console.error('创建支付订单错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
