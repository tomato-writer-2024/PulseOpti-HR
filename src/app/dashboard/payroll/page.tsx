'use client';

import { useState } from 'react';
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
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@//components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Wallet,
  Plus,
  Send,
  CheckCircle,
  Clock,
  Search,
  Download,
  Eye,
  FileText,
  Calendar,
  Users,
  TrendingUp,
  DollarSign,
  Banknote,
  CreditCard,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';

// 类型定义
type PayrollStatus = 'draft' | 'pending' | 'approved' | 'paid' | 'rejected';
type PaymentMethod = 'bank' | 'cash' | 'alipay' | 'wechat';

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  period: string;
  basicSalary: number;
  performanceBonus: number;
  subsidy: number;
  deductions: number;
  socialInsurance: number;
  tax: number;
  netPay: number;
  status: PayrollStatus;
  paymentMethod: PaymentMethod;
  accountNo: string;
  createdAt: string;
  paidAt?: string;
}

interface BenefitRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  benefitType: string;
  amount: number;
  period: string;
  status: 'active' | 'inactive';
  startDate: string;
  endDate?: string;
}

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState('payroll');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [payDialogOpen, setPayDialogOpen] = useState(false);

  // 薪资发放记录
  const [payrollRecords] = useState<PayrollRecord[]>([
    {
      id: '1',
      employeeId: '1',
      employeeName: '张三',
      department: '技术部',
      position: '高级工程师',
      period: '2025-04',
      basicSalary: 15000,
      performanceBonus: 3000,
      subsidy: 500,
      deductions: 200,
      socialInsurance: 1500,
      tax: 800,
      netPay: 16000,
      status: 'approved',
      paymentMethod: 'bank',
      accountNo: '****1234',
      createdAt: '2025-04-15',
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: '李四',
      department: '市场部',
      position: '市场经理',
      period: '2025-04',
      basicSalary: 12000,
      performanceBonus: 5000,
      subsidy: 800,
      deductions: 0,
      socialInsurance: 1200,
      tax: 900,
      netPay: 15700,
      status: 'pending',
      paymentMethod: 'bank',
      accountNo: '****5678',
      createdAt: '2025-04-15',
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: '王五',
      department: '销售部',
      position: '销售代表',
      period: '2025-04',
      basicSalary: 8000,
      performanceBonus: 7000,
      subsidy: 300,
      deductions: 150,
      socialInsurance: 800,
      tax: 600,
      netPay: 13750,
      status: 'paid',
      paymentMethod: 'bank',
      accountNo: '****9012',
      createdAt: '2025-04-10',
      paidAt: '2025-04-25',
    },
  ]);

  // 福利记录
  const [benefitRecords] = useState<BenefitRecord[]>([
    {
      id: '1',
      employeeId: '1',
      employeeName: '张三',
      benefitType: '五险一金',
      amount: 1500,
      period: '2025-04',
      status: 'active',
      startDate: '2025-01-01',
    },
    {
      id: '2',
      employeeId: '1',
      employeeName: '张三',
      benefitType: '餐补',
      amount: 500,
      period: '2025-04',
      status: 'active',
      startDate: '2025-01-01',
    },
    {
      id: '3',
      employeeId: '2',
      employeeName: '李四',
      benefitType: '交通补',
      amount: 300,
      period: '2025-04',
      status: 'active',
      startDate: '2025-01-01',
    },
  ]);

  // 薪资统计
  const [payrollStats] = useState({
    totalPayroll: 45450,
    totalEmployees: 3,
    avgSalary: 15150,
    paidCount: 1,
    pendingCount: 1,
    approvedCount: 1,
  });

  const statusMap: Record<PayrollStatus, { label: string; color: string }> = {
    draft: { label: '草稿', color: 'bg-gray-100 text-gray-800' },
    pending: { label: '待审批', color: 'bg-yellow-100 text-yellow-800' },
    approved: { label: '已批准', color: 'bg-blue-100 text-blue-800' },
    paid: { label: '已发放', color: 'bg-green-100 text-green-800' },
    rejected: { label: '已拒绝', color: 'bg-red-100 text-red-800' },
  };

  const paymentMethodMap: Record<PaymentMethod, { label: string; icon: React.ReactNode }> = {
    bank: { label: '银行转账', icon: <Banknote className="h-4 w-4" /> },
    cash: { label: '现金', icon: <DollarSign className="h-4 w-4" /> },
    alipay: { label: '支付宝', icon: <CreditCard className="h-4 w-4" /> },
    wechat: { label: '微信', icon: <CreditCard className="h-4 w-4" /> },
  };

  const filteredRecords = payrollRecords.filter(record => {
    const matchSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       record.period.includes(searchTerm);
    const matchStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">薪酬发放</h1>
          <p className="text-gray-600 mt-2">
            薪资发放、福利管理、薪资报表
            <Badge variant="secondary" className="ml-2">SSC</Badge>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出报表
          </Button>
          <Button onClick={() => setPayDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            发放薪资
          </Button>
        </div>
      </div>

      {/* 功能介绍 */}
      <Alert>
        <Wallet className="h-4 w-4" />
        <AlertDescription>
          自动计算薪资，支持多银行批量发放，一键生成工资条
        </AlertDescription>
      </Alert>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">本月应发</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{payrollStats.totalPayroll.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {payrollStats.totalEmployees} 人
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">平均薪资</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{payrollStats.avgSalary.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">人均</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">已发放</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payrollStats.paidCount}</div>
            <p className="text-xs text-gray-500 mt-1">已完成发放</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">待处理</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payrollStats.pendingCount}</div>
            <p className="text-xs text-gray-500 mt-1">待审批/发放</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="payroll">薪资发放</TabsTrigger>
          <TabsTrigger value="benefits">福利管理</TabsTrigger>
          <TabsTrigger value="history">发放历史</TabsTrigger>
        </TabsList>

        {/* 薪资发放 */}
        <TabsContent value="payroll" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>薪资发放记录</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="搜索员工或周期"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="draft">草稿</SelectItem>
                      <SelectItem value="pending">待审批</SelectItem>
                      <SelectItem value="approved">已批准</SelectItem>
                      <SelectItem value="paid">已发放</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>员工</TableHead>
                    <TableHead>部门/职位</TableHead>
                    <TableHead>周期</TableHead>
                    <TableHead>基本工资</TableHead>
                    <TableHead>绩效奖金</TableHead>
                    <TableHead>社保</TableHead>
                    <TableHead>个税</TableHead>
                    <TableHead>实发</TableHead>
                    <TableHead>发放方式</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {record.employeeName}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{record.department}</div>
                          <div className="text-gray-600">{record.position}</div>
                        </div>
                      </TableCell>
                      <TableCell>{record.period}</TableCell>
                      <TableCell>¥{record.basicSalary.toLocaleString()}</TableCell>
                      <TableCell className="text-green-600">
                        +¥{record.performanceBonus.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-red-600">
                        -¥{record.socialInsurance.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-red-600">
                        -¥{record.tax.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-bold text-blue-600">
                        ¥{record.netPay.toLocaleString()}
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        {paymentMethodMap[record.paymentMethod].icon}
                        <span className="text-sm">
                          {paymentMethodMap[record.paymentMethod].label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusMap[record.status].color}>
                          {statusMap[record.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {record.status === 'approved' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toast.success('发放成功')}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 福利管理 */}
        <TabsContent value="benefits">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>福利管理</CardTitle>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  添加福利
                </Button>
              </div>
              <CardDescription>管理员工福利和补贴</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>员工</TableHead>
                    <TableHead>福利类型</TableHead>
                    <TableHead>金额</TableHead>
                    <TableHead>周期</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>开始日期</TableHead>
                    <TableHead>结束日期</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {benefitRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {record.employeeName}
                      </TableCell>
                      <TableCell>{record.benefitType}</TableCell>
                      <TableCell className="font-medium text-blue-600">
                        ¥{record.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{record.period}</TableCell>
                      <TableCell>
                        <Badge
                          variant={record.status === 'active' ? 'default' : 'secondary'}
                        >
                          {record.status === 'active' ? '生效中' : '已停止'}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.startDate}</TableCell>
                      <TableCell>{record.endDate || '-'}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 发放历史 */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>发放历史</CardTitle>
              <CardDescription>查看历史发放记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>按周期查看历史发放记录</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 发放薪资弹窗 */}
      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>发放薪资</DialogTitle>
            <DialogDescription>
              选择员工并确认薪资发放
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="period">发放周期 *</Label>
              <Input id="period" type="month" defaultValue="2025-04" />
            </div>
            <div>
              <Label htmlFor="employees">选择员工 *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择员工" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部员工</SelectItem>
                  <SelectItem value="tech">技术部</SelectItem>
                  <SelectItem value="sales">销售部</SelectItem>
                  <SelectItem value="marketing">市场部</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paymentMethod">发放方式 *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">银行转账</SelectItem>
                    <SelectItem value="alipay">支付宝</SelectItem>
                    <SelectItem value="wechat">微信支付</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="payDate">发放日期 *</Label>
                <Input id="payDate" type="date" defaultValue="2025-04-25" />
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span>预计发放人数：</span>
                <span className="font-medium">{payrollStats.totalEmployees} 人</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span>预计发放总额：</span>
                <span className="font-bold text-blue-600">
                  ¥{payrollStats.totalPayroll.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={() => {
              toast.success('薪资发放成功！');
              setPayDialogOpen(false);
            }}>
              <Send className="mr-2 h-4 w-4" />
              确认发放
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
