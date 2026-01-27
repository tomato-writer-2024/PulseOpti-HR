import { NextRequest, NextResponse } from 'next/server';

// 发送短信接口
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { templateId, recipient, variables, channel } = body;

    // 验证参数
    if (!templateId || !recipient || !variables) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // TODO: 实际项目中应该：
    // 1. 验证模板是否存在且已启用
    // 2. 验证手机号格式
    // 3. 替换模板中的变量
    // 4. 调用短信服务提供商API发送短信
    // 5. 记录发送日志
    // 6. 返回发送结果

    // 模拟短信发送
    const channels = ['aliyun', 'tencent'];
    const selectedChannel = channel || 'aliyun';

    if (!channels.includes(selectedChannel)) {
      return NextResponse.json(
        { error: '不支持的短信通道' },
        { status: 400 }
      );
    }

    // 模拟发送成功
    const result = {
      id: `SMS${Date.now()}`,
      templateId,
      recipient,
      content: `【PulseOpti HR】您的验证码是${variables.code}，5分钟内有效。`,
      status: 'sent',
      channel: selectedChannel,
      cost: selectedChannel === 'aliyun' ? 0.045 : 0.055,
      sentAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('发送短信错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
