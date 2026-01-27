'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Eye,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

type OrderStatus = 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled' | 'refunded';
type OrderType = 'subscription' | 'add-on' | 'upgrade' | 'custom';

interface Order {
  id: string;
  orderNo: string;
  type: OrderType;
  plan: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  createdAt: string;
  paidAt?: string;
  cycle: 'monthly' | 'yearly';
  userId?: string;
  userName?: string;
  companyName?: string;
}

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  pending: { label: '待支付', color: 'bg-yellow-500', icon: Clock },
  paid: { label: '已支付', color: 'bg-blue-500', icon: CheckCircle },
  processing: { label: '处理中', color: 'bg-purple-500', icon: RefreshCw },
  completed: { label: '已完成', color: 'bg-green-500', icon: CheckCircle },
  cancelled: { label: '已取消', color: 'bg-gray-500', icon: XCircle },
  refunded: { label: '已退款', color: 'bg-red-500', icon: XCircle },
};

const typeConfig: Record<OrderType, { label: string }> = {
  subscription: { label: '订阅' },
  'add-on': { label: '增值服务' },
  upgrade: { label: '升级' },
  custom: { label: '定制' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    // 模拟获取订单数据
    setTimeout(() => {
      setOrders([
        {
          id: '1',
          orderNo: 'ORD20240115001',
          type: 'subscription',
          plan: '专业版',
          amount: 899,
          currency: 'CNY',
          status: 'completed',
          createdAt: '2024-01-15T10:30:00',
          paidAt: '2024-01-15T10:32:00',
          cycle: 'monthly',
          companyName: '科技创新有限公司',
        },
        {
          id: '2',
          orderNo: 'ORD20240110002',
          type: 'upgrade',
          plan: '基础版 -> 专业版',
          amount: 600,
          currency: 'CNY',
          status: 'processing',
          createdAt: '2024-01-10T14:20:00',
          paidAt: '2024-01-10T14:21:00',
          cycle: 'monthly',
          companyName: '发展科技有限公司',
        },
        {
          id: '3',
          orderNo: 'ORD20240105003',
          type: 'add-on',
          plan: '数据导出功能',
          amount: 299,
          currency: 'CNY',
          status: 'pending',
          createdAt: '2024-01-05T09:15:00',
          cycle: 'yearly',
          companyName: '未来科技有限公司',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesType = typeFilter === 'all' || order.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleExportOrders = () => {
    toast.success('订单导出中，请稍候...');
    // 实际场景中会调用导出API
    setTimeout(() => {
      toast.success('订单数据已导出');
    }, 2000);
  };

  const handleRefresh = () => {
    setLoading(true);
    toast.info('正在刷新订单数据...');
    setTimeout(() => {
      setLoading(false);
      toast.success('订单数据已更新');
    }, 1000);
  };

  const getStatusBadge = (status: OrderStatus) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={`${config.color} text-white border-0`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const statistics = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    totalRevenue: orders
      .filter(o => ['completed', 'paid'].includes(o.status))
      .reduce((sum, o) => sum + o.amount, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              订单管理
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              查看和管理所有订阅订单
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              刷新
            </Button>
            <Button variant="outline" onClick={handleExportOrders}>
              <Download className="h-4 w-4 mr-2" />
              导出数据
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">总订单</p>
                  <p className="text-2xl font-bold">{statistics.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">待支付</p>
                  <p className="text-2xl font-bold text-yellow-600">{statistics.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">处理中</p>
                  <p className="text-2xl font-bold text-purple-600">{statistics.processing}</p>
                </div>
                <RefreshCw className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">已完成</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">总收入</p>
                  <p className="text-2xl font-bold">
                    ¥{statistics.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 筛选栏 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="搜索订单号、方案名称、企业名..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  {Object.entries(statusConfig).map(([value, config]) => (
                    <SelectItem key={value} value={value}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  {Object.entries(typeConfig).map(([value, config]) => (
                    <SelectItem key={value} value={value}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 订单表格 */}
        <Card>
          <CardHeader>
            <CardTitle>订单列表</CardTitle>
            <CardDescription>
              共 {filteredOrders.length} 条订单记录
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">暂无订单记录</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>订单号</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>方案</TableHead>
                    <TableHead>金额</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>企业</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.orderNo}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{typeConfig[order.type].label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.plan}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {order.cycle === 'yearly' ? '年付' : '月付'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatAmount(order.amount, order.currency)}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{order.companyName}</TableCell>
                      <TableCell className="text-sm">{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          查看
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 订单详情弹窗 */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  订单详情 - {selectedOrder.orderNo}
                </DialogTitle>
                <DialogDescription>
                  查看订单的完整信息
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="info">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">基本信息</TabsTrigger>
                  <TabsTrigger value="timeline">订单时间线</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">订单状态</label>
                      <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">订单类型</label>
                      <div className="mt-1">
                        <Badge variant="outline">{typeConfig[selectedOrder.type].label}</Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">订单方案</label>
                      <div className="mt-1 font-medium">{selectedOrder.plan}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">计费周期</label>
                      <div className="mt-1">{selectedOrder.cycle === 'yearly' ? '年付' : '月付'}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">订单金额</label>
                      <div className="mt-1 text-xl font-bold text-blue-600">
                        {formatAmount(selectedOrder.amount, selectedOrder.currency)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">创建时间</label>
                      <div className="mt-1">{formatDate(selectedOrder.createdAt)}</div>
                    </div>
                    {selectedOrder.paidAt && (
                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-400">支付时间</label>
                        <div className="mt-1">{formatDate(selectedOrder.paidAt)}</div>
                      </div>
                    )}
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">企业名称</label>
                      <div className="mt-1">{selectedOrder.companyName}</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                      <div>
                        <div className="font-medium">订单创建</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(selectedOrder.createdAt)}
                        </div>
                      </div>
                    </div>
                    {selectedOrder.paidAt && (
                      <div className="flex gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
                        <div>
                          <div className="font-medium">订单支付</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(selectedOrder.paidAt)}
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedOrder.status === 'processing' && (
                      <div className="flex gap-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 animate-pulse" />
                        <div>
                          <div className="font-medium">订单处理中</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            正在为您开通服务...
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedOrder.status === 'completed' && (
                      <div className="flex gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
                        <div>
                          <div className="font-medium">服务已开通</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            您的订单已完成，服务已生效
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                  关闭
                </Button>
                {selectedOrder.status === 'pending' && (
                  <Button asChild>
                    <a href={`/dashboard/billing/payment?order=${selectedOrder.id}`}>
                      去支付
                    </a>
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
