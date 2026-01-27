'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ShoppingBag,
  CreditCard,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Download,
  RefreshCw,
  Filter,
  MoreVertical,
  Eye,
  FileText,
  TrendingUp,
  Users,
  Calendar,
  Zap,
  Star,
  Crown,
  Building2,
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular: boolean;
  users: number;
  storage: string;
  support: string;
  discount?: number;
}

interface Order {
  id: string;
  orderNo: string;
  planName: string;
  planId: string;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  amount: number;
  discount: number;
  finalAmount: number;
  method: 'alipay' | 'wechat' | 'bank';
  createdAt: string;
  paidAt?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  company: string;
  employees: number;
  duration: number;
}

interface Subscription {
  id: string;
  orderId: string;
  orderNo: string;
  planName: string;
  status: 'active' | 'expired' | 'suspended';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  amount: number;
  employees: number;
  features: string[];
  company: string;
}

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');
  const [methodFilter, setMethodFilter] = useState('all');

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const plans: Plan[] = [
    {
      id: 'basic',
      name: '基础版',
      price: 999,
      period: '月',
      features: ['员工管理', '考勤打卡', '基础报表', '3GB存储', '邮件支持'],
      popular: false,
      users: 50,
      storage: '3GB',
      support: '邮件支持',
    },
    {
      id: 'professional',
      name: '专业版',
      price: 1999,
      period: '月',
      features: ['员工管理', '考勤打卡', '绩效评估', '招聘管理', '培训管理', '20GB存储', '电话支持'],
      popular: true,
      users: 200,
      storage: '20GB',
      support: '电话支持',
      discount: 10,
    },
    {
      id: 'enterprise',
      name: '企业版',
      price: 4999,
      period: '月',
      features: ['所有专业版功能', '无限员工数', '无限存储', '专属客服', '定制开发', '数据备份'],
      popular: false,
      users: -1,
      storage: '无限',
      support: '专属客服',
      discount: 15,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));

      setOrders([
        {
          id: '1',
          orderNo: 'ORD202504180001',
          planName: '专业版',
          planId: 'professional',
          status: 'paid',
          amount: 1999,
          discount: 200,
          finalAmount: 1799,
          method: 'alipay',
          createdAt: '2025-04-18',
          paidAt: '2025-04-18',
          userId: 'USER001',
          userName: '张三',
          company: '科技有限公司',
          employees: 100,
          duration: 12,
        },
        {
          id: '2',
          orderNo: 'ORD202504150002',
          planName: '企业版',
          planId: 'enterprise',
          status: 'paid',
          amount: 4999,
          discount: 750,
          finalAmount: 4249,
          method: 'wechat',
          createdAt: '2025-04-15',
          paidAt: '2025-04-15',
          userId: 'USER002',
          userName: '李四',
          company: '互联网集团',
          employees: 500,
          duration: 6,
        },
        {
          id: '3',
          orderNo: 'ORD202504120003',
          planName: '基础版',
          planId: 'basic',
          status: 'pending',
          amount: 999,
          discount: 0,
          finalAmount: 999,
          method: 'alipay',
          createdAt: '2025-04-12',
          userId: 'USER003',
          userName: '王五',
          company: '创业公司',
          employees: 30,
          duration: 3,
        },
      ]);

      setSubscriptions([
        {
          id: '1',
          orderId: '1',
          orderNo: 'ORD202504180001',
          planName: '专业版',
          status: 'active',
          startDate: '2025-04-18',
          endDate: '2026-04-18',
          autoRenew: true,
          amount: 21588,
          employees: 100,
          features: ['员工管理', '考勤打卡', '绩效评估', '招聘管理', '培训管理'],
          company: '科技有限公司',
        },
        {
          id: '2',
          orderId: '2',
          orderNo: 'ORD202504150002',
          planName: '企业版',
          status: 'active',
          startDate: '2025-04-15',
          endDate: '2025-10-15',
          autoRenew: true,
          amount: 29994,
          employees: 500,
          features: ['所有专业版功能', '无限员工数', '无限存储', '专属客服'],
          company: '互联网集团',
        },
      ]);

      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.planName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesMethod = methodFilter === 'all' || order.method === methodFilter;
      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [orders, searchTerm, statusFilter, methodFilter]);

  const stats = useMemo(() => {
    return {
      totalOrders: orders.length,
      paidOrders: orders.filter((o) => o.status === 'paid').length,
      pendingOrders: orders.filter((o) => o.status === 'pending').length,
      totalRevenue: orders.filter((o) => o.status === 'paid').reduce((sum, o) => sum + o.finalAmount, 0),
      totalDiscount: orders.reduce((sum, o) => sum + o.discount, 0),
      activeSubscriptions: subscriptions.filter((s) => s.status === 'active').length,
      totalEmployees: subscriptions.reduce((sum, s) => sum + s.employees, 0),
    };
  }, [orders, subscriptions]);

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-100 text-gray-800',
      refunded: 'bg-red-100 text-red-800',
      active: 'bg-blue-100 text-blue-800',
      expired: 'bg-gray-100 text-gray-800',
      suspended: 'bg-orange-100 text-orange-800',
    };
    const labels: Record<string, string> = {
      pending: '待支付',
      paid: '已支付',
      cancelled: '已取消',
      refunded: '已退款',
      active: '生效中',
      expired: '已过期',
      suspended: '已暂停',
    };
    return <Badge className={colors[status]}>{labels[status]}</Badge>;
  };

  const getMethodBadge = (method: string) => {
    const icons: Record<string, any> = {
      alipay: '支付宝',
      wechat: '微信支付',
      bank: '银行转账',
    };
    return <Badge variant="outline">{icons[method]}</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">订单管理</h1>
          <p className="text-muted-foreground mt-1">管理订阅订单、支付记录和发票</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出数据
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新建订单
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总收入</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              已支付 {stats.paidOrders} 笔
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待支付</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              占比 {((stats.pendingOrders / stats.totalOrders) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">生效订阅</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              服务 {stats.totalEmployees} 名员工
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">优惠总额</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">¥{stats.totalDiscount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              为用户节省成本
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">
            <ShoppingBag className="h-4 w-4 mr-2" />
            订单列表
          </TabsTrigger>
          <TabsTrigger value="subscriptions">
            <CreditCard className="h-4 w-4 mr-2" />
            订阅管理
          </TabsTrigger>
          <TabsTrigger value="plans">
            <Star className="h-4 w-4 mr-2" />
            套餐方案
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>订单列表 ({filteredOrders.length})</CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索订单号、用户、公司..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="paid">已支付</SelectItem>
                      <SelectItem value="pending">待支付</SelectItem>
                      <SelectItem value="cancelled">已取消</SelectItem>
                      <SelectItem value="refunded">已退款</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={methodFilter} onValueChange={setMethodFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="支付方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部方式</SelectItem>
                      <SelectItem value="alipay">支付宝</SelectItem>
                      <SelectItem value="wechat">微信支付</SelectItem>
                      <SelectItem value="bank">银行转账</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  没有找到匹配的订单
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>订单号</TableHead>
                        <TableHead>用户</TableHead>
                        <TableHead>公司</TableHead>
                        <TableHead>套餐</TableHead>
                        <TableHead>员工数</TableHead>
                        <TableHead>原价</TableHead>
                        <TableHead>优惠</TableHead>
                        <TableHead>实付</TableHead>
                        <TableHead>支付方式</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>下单时间</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-sm">{order.orderNo}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{order.userName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{order.userName}</span>
                            </div>
                          </TableCell>
                          <TableCell>{order.company}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{order.planName}</Badge>
                          </TableCell>
                          <TableCell>{order.employees}</TableCell>
                          <TableCell>¥{order.amount.toLocaleString()}</TableCell>
                          <TableCell className="text-red-600">-¥{order.discount.toLocaleString()}</TableCell>
                          <TableCell className="font-semibold">¥{order.finalAmount.toLocaleString()}</TableCell>
                          <TableCell>{getMethodBadge(order.method)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>{order.createdAt}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => { setSelectedOrder(order); setViewDialogOpen(true); }}
                            >
                              查看详情
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>订阅管理 ({subscriptions.length})</CardTitle>
              <CardDescription>查看和管理所有生效中的订阅</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriptions.map((subscription) => (
                  <Card key={subscription.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-3 rounded-lg ${
                            subscription.planName === '企业版' ? 'bg-purple-100' :
                            subscription.planName === '专业版' ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            {subscription.planName === '企业版' && <Building2 className="h-6 w-6 text-purple-600" />}
                            {subscription.planName === '专业版' && <Star className="h-6 w-6 text-blue-600" />}
                            {subscription.planName === '基础版' && <Users className="h-6 w-6 text-gray-600" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">{subscription.planName}</h3>
                              {getStatusBadge(subscription.status)}
                              {subscription.autoRenew && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  自动续费
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{subscription.company}</p>
                            <div className="flex flex-wrap gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{subscription.employees} 名员工</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{subscription.startDate} ~ {subscription.endDate}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                <span>¥{subscription.amount.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4 mr-2" />
                            发票
                          </Button>
                          <Button size="sm" variant="outline">
                            管理订阅
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary">最受欢迎</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-center">{plan.name}</CardTitle>
                  <CardDescription className="text-center">
                    {plan.users === -1 ? '无限员工' : `最多 ${plan.users} 名员工`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">¥{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                    {plan.discount && (
                      <Badge variant="secondary" className="mt-2">
                        <Zap className="h-3 w-3 mr-1" />
                        优惠 {plan.discount}%
                      </Badge>
                    )}
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    选择此套餐
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>订单详情</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6">
                <div className="flex items-start gap-4 pb-4 border-b">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {selectedOrder.userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{selectedOrder.userName}</h3>
                    <p className="text-muted-foreground">{selectedOrder.company}</p>
                  </div>
                  {getStatusBadge(selectedOrder.status)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">订单号</Label>
                    <p className="font-mono">{selectedOrder.orderNo}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">下单时间</Label>
                    <p>{selectedOrder.createdAt}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">支付方式</Label>
                    <p>{getMethodBadge(selectedOrder.method)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">支付时间</Label>
                    <p>{selectedOrder.paidAt || '-'}</p>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">套餐信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">套餐名称</span>
                      <span className="font-medium">{selectedOrder.planName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">员工数量</span>
                      <span>{selectedOrder.employees} 名</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">订阅时长</span>
                      <span>{selectedOrder.duration} 个月</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">费用明细</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">原价</span>
                      <span>¥{selectedOrder.amount.toLocaleString()}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">优惠</span>
                        <span className="text-red-600">-¥{selectedOrder.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-3 border-t">
                      <span>实付金额</span>
                      <span className="text-green-600">¥{selectedOrder.finalAmount.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              关闭
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              下载发票
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
