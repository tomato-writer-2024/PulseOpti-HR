'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Shield,
  Zap,
  Copy,
  RefreshCw,
  QrCode,
  Download,
  FileText,
  ArrowLeft,
  Wallet,
  Smartphone as PhoneIcon,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  popular: boolean;
}

interface OrderDetail {
  id: string;
  orderNo: string;
  planName: string;
  originalAmount: number;
  discount: number;
  finalAmount: number;
  duration: number;
  employees: number;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  createdAt: string;
  expiredAt: string;
}

interface PaymentInfo {
  qrCode?: string;
  paymentUrl?: string;
  tradeNo?: string;
  expiredAt: string;
}

export default function PaymentPage() {
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<string>('alipay');
  const [paymentStep, setPaymentStep] = useState<'select' | 'processing' | 'success' | 'failed'>('select');
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [countdown, setCountdown] = useState(1800); // 30分钟倒计时
  const [autoRenew, setAutoRenew] = useState(false);
  const [invoiceNeeded, setInvoiceNeeded] = useState(false);
  const [invoiceTitle, setInvoiceTitle] = useState('');
  const [invoiceType, setInvoiceType] = useState<'personal' | 'company'>('company');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'alipay',
      name: '支付宝',
      icon: <Smartphone className="h-6 w-6 text-blue-500" />,
      description: '支持余额、银行卡、花呗支付',
      popular: true,
    },
    {
      id: 'wechat',
      name: '微信支付',
      icon: <PhoneIcon className="h-6 w-6 text-green-500" />,
      description: '支持微信余额、银行卡支付',
      popular: false,
    },
    {
      id: 'bank',
      name: '银行转账',
      icon: <Building2 className="h-6 w-6 text-gray-600" />,
      description: '企业账户对公转账',
      popular: false,
    },
  ];

  useEffect(() => {
    // 模拟获取订单详情
    const fetchOrderDetail = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));

      // 获取URL中的订单ID
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get('orderId') || '1';

      setOrderDetail({
        id: orderId,
        orderNo: `ORD${Date.now()}`,
        planName: '专业版',
        originalAmount: 1999,
        discount: 200,
        finalAmount: 1799,
        duration: 12,
        employees: 100,
        status: 'pending',
        createdAt: new Date().toISOString(),
        expiredAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      });

      setLoading(false);
    };

    fetchOrderDetail();
  }, []);

  // 倒计时
  useEffect(() => {
    if (countdown > 0 && paymentStep === 'processing') {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown, paymentStep]);

  // 格式化倒计时
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 模拟发起支付
  const handlePayment = async () => {
    setPaymentStep('processing');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 模拟支付信息
    setPaymentInfo({
      qrCode: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwIiB5PSIxMDAiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiPuaQrOacieeQhzxvdT5uZy88L3RleHQ+PC9zdmc+',
      tradeNo: `TRADE${Date.now()}`,
      expiredAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    });
  };

  // 模拟支付成功
  const handlePaymentSuccess = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPaymentStep('success');
  };

  // 复制订单号
  const copyOrderNo = () => {
    if (orderDetail?.orderNo) {
      navigator.clipboard.writeText(orderDetail.orderNo);
    }
  };

  // 返回订单列表
  const backToOrders = () => {
    window.location.href = '/dashboard/billing';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px] mt-2" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-[400px]" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-[300px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
        <p className="text-gray-600 mb-4">订单信息加载失败</p>
        <Button onClick={backToOrders}>返回订单列表</Button>
      </div>
    );
  }

  if (paymentStep === 'success') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-12">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl mb-2">支付成功！</CardTitle>
          <CardDescription className="text-base mb-6">
            您的订单已支付成功，系统正在为您开通服务
          </CardDescription>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">订单编号</span>
              <span className="font-medium">{orderDetail.orderNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">套餐名称</span>
              <span className="font-medium">{orderDetail.planName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">支付金额</span>
              <span className="font-medium text-red-600">¥{orderDetail.finalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">支付方式</span>
              <span className="font-medium">
                {selectedMethod === 'alipay' ? '支付宝' : selectedMethod === 'wechat' ? '微信支付' : '银行转账'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">支付时间</span>
              <span className="font-medium">{new Date().toLocaleString('zh-CN')}</span>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={backToOrders}>
              查看订单
            </Button>
            <Button onClick={() => window.location.href = '/dashboard/overview'}>
              进入系统
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (paymentStep === 'failed') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-12">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl mb-2">支付失败</CardTitle>
          <CardDescription className="text-base mb-6">
            支付过程中出现错误，请重试或选择其他支付方式
          </CardDescription>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={backToOrders}>
              返回订单列表
            </Button>
            <Button onClick={() => setPaymentStep('select')}>
              重新支付
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={backToOrders}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回订单
        </Button>
        <h1 className="text-3xl font-bold">在线支付</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：支付方式选择 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 支付步骤 */}
          <Card>
            <CardHeader>
              <CardTitle>支付流程</CardTitle>
              <CardDescription>选择支付方式并完成支付</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${paymentStep === 'select' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                    {(paymentStep as string) === 'select' ? '1' : (paymentStep as string) === 'success' ? <CheckCircle className="h-5 w-5" /> : '1'}
                  </div>
                  <span className={(paymentStep as string) === 'select' ? 'font-medium' : 'text-green-600'}>选择支付方式</span>
                </div>
                <div className="h-0.5 flex-1 bg-gray-200 mx-4" />
                <div className="flex items-center gap-4">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${(paymentStep as string) === 'processing' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {(paymentStep as string) === 'processing' ? '2' : (paymentStep as string) === 'success' ? <CheckCircle className="h-5 w-5" /> : '2'}
                  </div>
                  <span className={(paymentStep as string) === 'processing' ? 'font-medium' : (paymentStep as string) === 'success' ? 'text-green-600' : 'text-gray-600'}>扫码支付</span>
                </div>
                <div className="h-0.5 flex-1 bg-gray-200 mx-4" />
                <div className="flex items-center gap-4">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${(paymentStep as string) === 'success' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {(paymentStep as string) === 'success' ? <CheckCircle className="h-5 w-5" /> : '3'}
                  </div>
                  <span className={(paymentStep as string) === 'success' ? 'font-medium' : 'text-gray-600'}>支付完成</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {paymentStep === 'select' ? (
            /* 选择支付方式 */
            <Card>
              <CardHeader>
                <CardTitle>选择支付方式</CardTitle>
                <CardDescription>请选择您偏好的支付方式</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="relative">
                        <div
                          className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedMethod === method.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => setSelectedMethod(method.id)}
                        >
                          <div className="flex items-center gap-4">
                            <RadioGroupItem value={method.id} id={method.id} />
                            <div className="flex items-center gap-3">
                              {method.icon}
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{method.name}</span>
                                  {method.popular && <Badge variant="secondary" className="bg-orange-100 text-orange-700">推荐</Badge>}
                                </div>
                                <p className="text-sm text-gray-600">{method.description}</p>
                              </div>
                            </div>
                          </div>
                          {selectedMethod === method.id && <CheckCircle className="h-5 w-5 text-blue-600" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                {/* 发票选项 */}
                <div className="mt-6 pt-6 border-t space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="invoice"
                      checked={invoiceNeeded}
                      onCheckedChange={(checked) => setInvoiceNeeded(checked as boolean)}
                    />
                    <Label htmlFor="invoice" className="cursor-pointer">
                      需要开具发票（电子发票）
                    </Label>
                  </div>

                  {invoiceNeeded && (
                    <div className="ml-6 space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="personal"
                            checked={invoiceType === 'personal'}
                            onCheckedChange={() => setInvoiceType('personal')}
                          />
                          <Label htmlFor="personal" className="cursor-pointer">个人</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="company"
                            checked={invoiceType === 'company'}
                            onCheckedChange={() => setInvoiceType('company')}
                          />
                          <Label htmlFor="company" className="cursor-pointer">企业</Label>
                        </div>
                      </div>
                      {invoiceType === 'company' && (
                        <div className="space-y-2">
                          <Label htmlFor="invoiceTitle">发票抬头</Label>
                          <Input
                            id="invoiceTitle"
                            placeholder="请输入企业全称"
                            value={invoiceTitle}
                            onChange={(e) => setInvoiceTitle(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 自动续费 */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">自动续费</div>
                        <div className="text-sm text-gray-600">订阅到期前自动续费，避免服务中断</div>
                      </div>
                    </div>
                    <Switch checked={autoRenew} onCheckedChange={setAutoRenew} />
                  </div>
                </div>

                {/* 提交按钮 */}
                <div className="mt-6 flex gap-4">
                  <Button variant="outline" onClick={backToOrders}>
                    取消
                  </Button>
                  <Button className="flex-1" size="lg" onClick={handlePayment}>
                    确认支付
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* 支付处理中 */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  请扫码支付
                </CardTitle>
                <CardDescription>
                  请在 <span className="text-red-600 font-bold">{formatCountdown(countdown)}</span> 内完成支付，超时将自动取消
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8">
                  {/* 二维码 */}
                  <div className="flex-1 flex flex-col items-center">
                    <div className="bg-white p-4 rounded-lg border shadow-inner">
                      <div className="w-48 h-48 bg-gray-100 rounded flex items-center justify-center">
                        <QrCode className="h-32 w-32 text-gray-400" />
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-600 text-center">
                      请使用{selectedMethod === 'alipay' ? '支付宝' : '微信'}扫描二维码完成支付
                    </p>
                  </div>

                  {/* 支付信息 */}
                  <div className="flex-1 space-y-4">
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        支付完成后，系统将自动跳转，请勿关闭页面
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">订单编号</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{orderDetail.orderNo}</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={copyOrderNo}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">交易单号</span>
                        <span className="font-medium text-xs">{paymentInfo?.tradeNo}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">支付方式</span>
                        <span className="font-medium">
                          {selectedMethod === 'alipay' ? '支付宝' : selectedMethod === 'wechat' ? '微信支付' : '银行转账'}
                        </span>
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">应付金额</span>
                          <span className="text-2xl font-bold text-red-600">
                            ¥{orderDetail.finalAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 支付方式说明 */}
                    <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                      <p className="font-medium">支付说明：</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• 请在支付页面选择对应的支付方式</li>
                        <li>• 支付成功后，系统将自动为您开通服务</li>
                        <li>• 如遇支付问题，请联系客服：400-888-8888</li>
                        <li>• 支持发票开具，开票周期为3-5个工作日</li>
                      </ul>
                    </div>

                    {/* 刷新按钮 */}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSelectedMethod(selectedMethod);
                        handlePayment();
                      }}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      刷新支付方式
                    </Button>
                  </div>
                </div>

                {/* 返回按钮 */}
                <div className="mt-6 pt-6 border-t">
                  <Button variant="ghost" onClick={() => setPaymentStep('select')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    返回选择其他支付方式
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 右侧：订单信息 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">订单信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">订单编号</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{orderDetail.orderNo}</p>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={copyOrderNo}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">套餐名称</p>
                <p className="font-medium">{orderDetail.planName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">订阅时长</p>
                <p className="font-medium">{orderDetail.duration} 个月</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">员工人数</p>
                <p className="font-medium">
                  {orderDetail.employees === -1 ? '不限人数' : `${orderDetail.employees} 人`}
                </p>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">原价</span>
                  <span>¥{orderDetail.originalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">优惠</span>
                  <span className="text-green-600">-¥{orderDetail.discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-3 border-t">
                  <span>应付金额</span>
                  <span className="text-red-600">¥{orderDetail.finalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-xs text-gray-500 pt-4 border-t">
                <p>下单时间：{new Date(orderDetail.createdAt).toLocaleString('zh-CN')}</p>
                <p>过期时间：{new Date(orderDetail.expiredAt).toLocaleString('zh-CN')}</p>
              </div>
            </CardContent>
          </Card>

          {/* 安全提示 */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-blue-900">安全保障</p>
                  <p className="text-blue-700">
                    • 支付采用SSL加密传输<br />
                    • 官方认证支付通道<br />
                    • 7天无理由退款<br />
                    • 专属客服支持
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
