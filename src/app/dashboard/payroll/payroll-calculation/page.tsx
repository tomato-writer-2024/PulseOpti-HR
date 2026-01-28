'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DollarSign,
  Wallet,
  TrendingUp,
  CheckCircle,
  Clock,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  Calculator,
  Calendar,
  User,
  Building2,
  ArrowRightLeft,
  AlertCircle,
  Receipt,
  FileText,
  Send,
  Printer,
  FileDown,
} from 'lucide-react';
import { toast } from 'sonner';

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  department: string;
  position: string;
  period: string;
  salaryDate: string;
  status: 'draft' | 'calculating' | 'pending' | 'paid' | 'failed';

  // 基本工资
  baseSalary: number;

  // 加班工资
  overtimePay: number;
  overtimeHours: number;

  // 津贴补贴
  allowance: number;
  allowanceDetails: {
    mealAllowance: number;
    transportAllowance: number;
    housingAllowance: number;
    otherAllowance: number;
  };

  // 奖金
  bonus: number;
  bonusDetails: {
    performanceBonus: number;
    attendanceBonus: number;
    yearEndBonus: number;
    otherBonus: number;
  };

  // 扣款
  deduction: number;
  deductionDetails: {
    socialSecurity: number;
    housingFund: number;
    tax: number;
    lateDeduction: number;
    absenceDeduction: number;
    otherDeduction: number;
  };

  // 实发工资
  netPay: number;

  // 备注
  remarks?: string;
}

export default function PayrollCalculationPage() {
  const [activeTab, setActiveTab] = useState('payroll');
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('2024-12');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: '张三',
      department: '产品部',
      position: '产品经理',
      period: '2024-12',
      salaryDate: '2024-12-31',
      status: 'paid',
      baseSalary: 20000,
      overtimePay: 3000,
      overtimeHours: 20,
      allowance: 2500,
      allowanceDetails: {
        mealAllowance: 800,
        transportAllowance: 500,
        housingAllowance: 1000,
        otherAllowance: 200,
      },
      bonus: 5000,
      bonusDetails: {
        performanceBonus: 3000,
        attendanceBonus: 1000,
        yearEndBonus: 0,
        otherBonus: 1000,
      },
      deduction: 4500,
      deductionDetails: {
        socialSecurity: 2000,
        housingFund: 1500,
        tax: 800,
        lateDeduction: 100,
        absenceDeduction: 0,
        otherDeduction: 100,
      },
      netPay: 26000,
      remarks: '绩效优秀，发放奖金',
    },
    {
      id: '2',
      employeeId: 'EMP002',
      employeeName: '李四',
      department: '销售部',
      position: '销售经理',
      period: '2024-12',
      salaryDate: '2024-12-31',
      status: 'paid',
      baseSalary: 18000,
      overtimePay: 2000,
      overtimeHours: 15,
      allowance: 2200,
      allowanceDetails: {
        mealAllowance: 600,
        transportAllowance: 400,
        housingAllowance: 1000,
        otherAllowance: 200,
      },
      bonus: 8000,
      bonusDetails: {
        performanceBonus: 5000,
        attendanceBonus: 500,
        yearEndBonus: 2000,
        otherBonus: 500,
      },
      deduction: 4000,
      deductionDetails: {
        socialSecurity: 1800,
        housingFund: 1200,
        tax: 750,
        lateDeduction: 50,
        absenceDeduction: 0,
        otherDeduction: 200,
      },
      netPay: 26200,
      remarks: '销售冠军，业绩突出',
    },
    {
      id: '3',
      employeeId: 'EMP003',
      employeeName: '王五',
      department: '技术部',
      position: '高级工程师',
      period: '2024-12',
      salaryDate: '2024-12-31',
      status: 'pending',
      baseSalary: 22000,
      overtimePay: 4000,
      overtimeHours: 25,
      allowance: 3000,
      allowanceDetails: {
        mealAllowance: 1000,
        transportAllowance: 600,
        housingAllowance: 1200,
        otherAllowance: 200,
      },
      bonus: 4000,
      bonusDetails: {
        performanceBonus: 3000,
        attendanceBonus: 500,
        yearEndBonus: 0,
        otherBonus: 500,
      },
      deduction: 5000,
      deductionDetails: {
        socialSecurity: 2200,
        housingFund: 1600,
        tax: 900,
        lateDeduction: 0,
        absenceDeduction: 200,
        otherDeduction: 100,
      },
      netPay: 28000,
    },
    {
      id: '4',
      employeeId: 'EMP004',
      employeeName: '赵六',
      department: '市场部',
      position: '市场专员',
      period: '2024-12',
      salaryDate: '2024-12-31',
      status: 'calculating',
      baseSalary: 12000,
      overtimePay: 0,
      overtimeHours: 0,
      allowance: 1500,
      allowanceDetails: {
        mealAllowance: 500,
        transportAllowance: 300,
        housingAllowance: 500,
        otherAllowance: 200,
      },
      bonus: 1000,
      bonusDetails: {
        performanceBonus: 800,
        attendanceBonus: 200,
        yearEndBonus: 0,
        otherBonus: 0,
      },
      deduction: 2500,
      deductionDetails: {
        socialSecurity: 1200,
        housingFund: 800,
        tax: 400,
        lateDeduction: 50,
        absenceDeduction: 0,
        otherDeduction: 50,
      },
      netPay: 12000,
    },
  ]);

  const stats = {
    totalEmployees: payrollRecords.length,
    totalPayroll: payrollRecords.reduce((sum, p) => sum + p.netPay, 0),
    paidCount: payrollRecords.filter(p => p.status === 'paid').length,
    pendingCount: payrollRecords.filter(p => p.status === 'pending' || p.status === 'calculating').length,
    avgPayroll: payrollRecords.length > 0
      ? payrollRecords.reduce((sum, p) => sum + p.netPay, 0) / payrollRecords.length
      : 0,
    totalOvertimePay: payrollRecords.reduce((sum, p) => sum + p.overtimePay, 0),
    totalBonus: payrollRecords.reduce((sum, p) => sum + p.bonus, 0),
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      draft: { label: '草稿', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
      calculating: { label: '计算中', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      pending: { label: '待支付', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      paid: { label: '已支付', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      failed: { label: '失败', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    };
    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const filteredRecords = payrollRecords.filter(record => {
    const matchesDepartment = selectedDepartment === 'all' || record.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    return matchesDepartment && matchesStatus;
  });

  const handleViewDetail = (record: PayrollRecord) => {
    setSelectedPayroll(record);
    setShowDetailDialog(true);
  };

  const formatMoney = (amount: number) => {
    return `¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <Calculator className="h-7 w-7 text-white" />
              </div>
              工资核算
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              精确、高效的工资核算与发放管理
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出工资单
            </Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              打印工资单
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Calculator className="h-4 w-4 mr-2" />
              计算工资
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">发薪人数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalEmployees}</div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                <User className="h-3 w-3 mr-1" />
                人
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">工资总额</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatMoney(stats.totalPayroll)}
              </div>
              <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
                <Wallet className="h-3 w-3 mr-1" />
                本月
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">已支付</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.paidCount}</div>
              <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                人
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">待支付</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendingCount}</div>
              <div className="flex items-center text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                <Clock className="h-3 w-3 mr-1" />
                人
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">平均工资</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatMoney(stats.avgPayroll)}
              </div>
              <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                人均
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">加班费</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatMoney(stats.totalOvertimePay)}
              </div>
              <div className="flex items-center text-xs text-purple-600 dark:text-purple-400 mt-1">
                <Clock className="h-3 w-3 mr-1" />
                本月
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 功能Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="payroll" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              工资表
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              工资汇总
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              历史记录
            </TabsTrigger>
          </TabsList>

          {/* 工资表 */}
          <TabsContent value="payroll" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>工资明细表</CardTitle>
                    <CardDescription>{selectedPeriod}月工资明细</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-12">2024-12</SelectItem>
                        <SelectItem value="2024-11">2024-11</SelectItem>
                        <SelectItem value="2024-10">2024-10</SelectItem>
                        <SelectItem value="2024-09">2024-09</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部部门</SelectItem>
                        <SelectItem value="产品部">产品部</SelectItem>
                        <SelectItem value="销售部">销售部</SelectItem>
                        <SelectItem value="技术部">技术部</SelectItem>
                        <SelectItem value="市场部">市场部</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="paid">已支付</SelectItem>
                        <SelectItem value="pending">待支付</SelectItem>
                        <SelectItem value="calculating">计算中</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border dark:border-gray-700">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>员工</TableHead>
                        <TableHead>部门</TableHead>
                        <TableHead>基本工资</TableHead>
                        <TableHead>加班费</TableHead>
                        <TableHead>津贴</TableHead>
                        <TableHead>奖金</TableHead>
                        <TableHead>扣款</TableHead>
                        <TableHead>实发工资</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs">
                                  {record.employeeName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">{record.employeeName}</div>
                                <div className="text-xs text-gray-500">{record.position}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{record.department}</TableCell>
                          <TableCell>{formatMoney(record.baseSalary)}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {formatMoney(record.overtimePay)}
                              <div className="text-xs text-gray-500">{record.overtimeHours}小时</div>
                            </div>
                          </TableCell>
                          <TableCell>{formatMoney(record.allowance)}</TableCell>
                          <TableCell>{formatMoney(record.bonus)}</TableCell>
                          <TableCell className="text-red-600 dark:text-red-400">
                            {formatMoney(record.deduction)}
                          </TableCell>
                          <TableCell className="font-bold text-green-600 dark:text-green-400">
                            {formatMoney(record.netPay)}
                          </TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetail(record)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {record.status === 'pending' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700"
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 工资汇总 */}
          <TabsContent value="summary" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    部门工资汇总
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['产品部', '销售部', '技术部', '市场部'].map((dept) => {
                      const deptRecords = payrollRecords.filter(p => p.department === dept);
                      const deptTotal = deptRecords.reduce((sum, p) => sum + p.netPay, 0);
                      return (
                        <div key={dept} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <span className="font-medium">{dept}</span>
                          <span className="font-bold text-green-600 dark:text-green-400">
                            {formatMoney(deptTotal)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    奖金统计
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">绩效奖金</div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatMoney(payrollRecords.reduce((sum, p) => sum + p.bonusDetails.performanceBonus, 0))}
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">全勤奖金</div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatMoney(payrollRecords.reduce((sum, p) => sum + p.bonusDetails.attendanceBonus, 0))}
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">年终奖金</div>
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {formatMoney(payrollRecords.reduce((sum, p) => sum + p.bonusDetails.yearEndBonus, 0))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRightLeft className="h-5 w-5 text-red-600" />
                    扣款统计
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">社保</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatMoney(payrollRecords.reduce((sum, p) => sum + p.deductionDetails.socialSecurity, 0))}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">公积金</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatMoney(payrollRecords.reduce((sum, p) => sum + p.deductionDetails.housingFund, 0))}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">个税</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatMoney(payrollRecords.reduce((sum, p) => sum + p.deductionDetails.tax, 0))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 历史记录 */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>历史工资记录</CardTitle>
                <CardDescription>查看历史月份的工资数据</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    选择月份查看历史记录
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    请从上方选择对应的月份查看详细工资数据
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 工资明细对话框 */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">工资单详情</DialogTitle>
              <DialogDescription>
                {selectedPayroll?.employeeName} - {selectedPayroll?.period}
              </DialogDescription>
            </DialogHeader>
            {selectedPayroll && (
              <div className="space-y-6">
                {/* 员工信息 */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xl">
                      {selectedPayroll.employeeName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedPayroll.employeeName}
                      </h3>
                      {getStatusBadge(selectedPayroll.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{selectedPayroll.department}</span>
                      <span>·</span>
                      <span>{selectedPayroll.position}</span>
                      <span>·</span>
                      <span>发薪日: {selectedPayroll.salaryDate}</span>
                    </div>
                  </div>
                </div>

                {/* 工资详情 */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* 应发 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      应发工资
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
                        <span className="text-gray-600 dark:text-gray-400">基本工资</span>
                        <span className="font-medium">{formatMoney(selectedPayroll.baseSalary)}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
                        <span className="text-gray-600 dark:text-gray-400">加班费</span>
                        <span className="font-medium">{formatMoney(selectedPayroll.overtimePay)}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
                        <span className="text-gray-600 dark:text-gray-400">津贴补贴</span>
                        <span className="font-medium">{formatMoney(selectedPayroll.allowance)}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
                        <span className="text-gray-600 dark:text-gray-400">奖金</span>
                        <span className="font-medium">{formatMoney(selectedPayroll.bonus)}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                        <span className="font-bold text-gray-900 dark:text-white">小计</span>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {formatMoney(
                            selectedPayroll.baseSalary +
                            selectedPayroll.overtimePay +
                            selectedPayroll.allowance +
                            selectedPayroll.bonus
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 扣款 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                      <ArrowRightLeft className="h-5 w-5 text-red-600" />
                      扣款明细
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
                        <span className="text-gray-600 dark:text-gray-400">社保</span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          -{formatMoney(selectedPayroll.deductionDetails.socialSecurity)}
                        </span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
                        <span className="text-gray-600 dark:text-gray-400">公积金</span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          -{formatMoney(selectedPayroll.deductionDetails.housingFund)}
                        </span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
                        <span className="text-gray-600 dark:text-gray-400">个税</span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          -{formatMoney(selectedPayroll.deductionDetails.tax)}
                        </span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
                        <span className="text-gray-600 dark:text-gray-400">其他扣款</span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          -{formatMoney(
                            selectedPayroll.deductionDetails.lateDeduction +
                            selectedPayroll.deductionDetails.absenceDeduction +
                            selectedPayroll.deductionDetails.otherDeduction
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900">
                        <span className="font-bold text-gray-900 dark:text-white">小计</span>
                        <span className="font-bold text-red-600 dark:text-red-400">
                          -{formatMoney(selectedPayroll.deduction)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 实发工资 */}
                <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 rounded-xl border border-green-200 dark:border-green-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">实发工资</div>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {formatMoney(selectedPayroll.netPay)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <FileDown className="h-4 w-4 mr-2" />
                        下载工资单
                      </Button>
                      {selectedPayroll.status === 'pending' && (
                        <Button className="bg-green-600 hover:bg-green-700">
                          <Send className="h-4 w-4 mr-2" />
                          发放工资
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 备注 */}
                {selectedPayroll.remarks && (
                  <div>
                    <Label>备注</Label>
                    <Textarea
                      value={selectedPayroll.remarks}
                      readOnly
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
