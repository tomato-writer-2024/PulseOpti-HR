'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DollarSign,
  Calculator,
  TrendingUp,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Shield,
  Building2,
  Calendar,
  PieChart,
  RefreshCw,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MoreVertical,
} from 'lucide-react';

// 模拟数据
const compensationData = {
  // 关键指标
  metrics: {
    totalEmployees: 485,
    totalBudget: 15000000,
    usedBudget: 11775000,
    avgSalary: 25800,
    socialInsuranceTotal: 2850000,
    pendingCount: 12,
  },

  // 薪资发放记录
  payrollHistory: [
    {
      id: '1',
      month: '2025-01',
      totalCount: 485,
      totalAmount: 12500000,
      status: 'paid',
      payDate: '2025-01-15',
      avgSalary: 25773,
    },
    {
      id: '2',
      month: '2024-12',
      totalCount: 483,
      totalAmount: 12450000,
      status: 'paid',
      payDate: '2024-12-15',
      avgSalary: 25776,
    },
    {
      id: '3',
      month: '2024-11',
      totalCount: 480,
      totalAmount: 12380000,
      status: 'paid',
      payDate: '2024-11-15',
      avgSalary: 25791,
    },
  ],

  // 薪资结构
  salaryStructure: [
    {
      type: '基本工资',
      description: '固定薪资部分',
      percentage: 50,
      amount: 12900,
      color: 'from-blue-500 to-blue-600',
    },
    {
      type: '绩效奖金',
      description: '根据绩效考核结果发放',
      percentage: 25,
      amount: 6450,
      color: 'from-purple-500 to-purple-600',
    },
    {
      type: '岗位津贴',
      description: '岗位特定补贴',
      percentage: 10,
      amount: 2580,
      color: 'from-green-500 to-green-600',
    },
    {
      type: '其他补贴',
      description: '交通、餐饮、通讯等补贴',
      percentage: 15,
      amount: 3870,
      color: 'from-orange-500 to-orange-600',
    },
  ],

  // 社保公积金
  socialInsurance: [
    {
      type: '养老保险',
      companyRate: 16,
      personalRate: 8,
      baseAmount: 15000,
      companyAmount: 2400,
      personalAmount: 1200,
      color: 'from-blue-500 to-blue-600',
    },
    {
      type: '医疗保险',
      companyRate: 6,
      personalRate: 2,
      baseAmount: 15000,
      companyAmount: 900,
      personalAmount: 300,
      color: 'from-green-500 to-green-600',
    },
    {
      type: '失业保险',
      companyRate: 0.5,
      personalRate: 0.5,
      baseAmount: 15000,
      companyAmount: 75,
      personalAmount: 75,
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      type: '工伤保险',
      companyRate: 0.2,
      personalRate: 0,
      baseAmount: 15000,
      companyAmount: 30,
      personalAmount: 0,
      color: 'from-orange-500 to-orange-600',
    },
    {
      type: '生育保险',
      companyRate: 0.8,
      personalRate: 0,
      baseAmount: 15000,
      companyAmount: 120,
      personalAmount: 0,
      color: 'from-pink-500 to-pink-600',
    },
    {
      type: '住房公积金',
      companyRate: 12,
      personalRate: 12,
      baseAmount: 15000,
      companyAmount: 1800,
      personalAmount: 1800,
      color: 'from-indigo-500 to-indigo-600',
    },
  ],

  // 员工薪资明细
  payrollDetails: [
    {
      id: '1',
      employeeId: 'E001',
      employeeName: '张三',
      department: '技术部',
      position: '高级工程师',
      baseSalary: 20000,
      performanceBonus: 5000,
      allowance: 3000,
      overtimePay: 1000,
      grossPay: 29000,
      socialInsurance: 3525,
      tax: 1125,
      deduction: 4650,
      netPay: 24350,
      month: '2025-01',
      status: 'paid',
    },
    {
      id: '2',
      employeeId: 'E002',
      employeeName: '李四',
      department: '销售部',
      position: '销售经理',
      baseSalary: 25000,
      performanceBonus: 8000,
      allowance: 2000,
      overtimePay: 500,
      grossPay: 35500,
      socialInsurance: 3525,
      tax: 1475,
      deduction: 5000,
      netPay: 30500,
      month: '2025-01',
      status: 'paid',
    },
    {
      id: '3',
      employeeId: 'E003',
      employeeName: '王五',
      department: '市场部',
      position: '市场专员',
      baseSalary: 15000,
      performanceBonus: 3000,
      allowance: 2000,
      overtimePay: 0,
      grossPay: 20000,
      socialInsurance: 3525,
      tax: 475,
      deduction: 4000,
      netPay: 16000,
      month: '2025-01',
      status: 'pending',
    },
  ],
};

const STATUS_CONFIG = {
  pending: { label: '待发放', color: 'bg-orange-100 text-orange-600' },
  paid: { label: '已发放', color: 'bg-green-100 text-green-600' },
  failed: { label: '发放失败', color: 'bg-red-100 text-red-600' },
};

export default function CompensationPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMonth, setSelectedMonth] = useState('2025-01');
  const [searchText, setSearchText] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [calculateDialogOpen, setCalculateDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<typeof compensationData.payrollDetails[0] | null>(null);

  const budgetUsage = (compensationData.metrics.usedBudget / compensationData.metrics.totalBudget) * 100;
  const salaryTrend = 2.3; // 较上月增长

  // 过滤薪资明细
  const filteredPayroll = useMemo(() => {
    return compensationData.payrollDetails.filter(record => {
      const matchMonth = selectedMonth ? record.month === selectedMonth : true;
      const matchSearch = searchText ? record.employeeName.includes(searchText) : true;
      const matchDepartment = selectedDepartment ? record.department === selectedDepartment : true;
      return matchMonth && matchSearch && matchDepartment;
    });
  }, [compensationData.payrollDetails, selectedMonth, searchText, selectedDepartment]);

  const handleViewDetail = (record: typeof compensationData.payrollDetails[0]) => {
    setSelectedDetail(record);
    setDetailDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            薪酬管理
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            工资核算、薪酬结构、社保公积金
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            导入数据
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出报表
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Calculator className="h-4 w-4 mr-2" />
            计算薪资
          </Button>
        </div>
      </div>

      {/* 关键指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>员工总数</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-3xl">{compensationData.metrics.totalEmployees}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>年度预算</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-2xl">{formatCurrency(compensationData.metrics.totalBudget)}</CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <Progress value={budgetUsage} className="flex-1 mt-1" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {budgetUsage.toFixed(1)}%
              </span>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>平均薪资</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-3xl">{formatCurrency(compensationData.metrics.avgSalary)}</CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span className="text-green-600">+{salaryTrend}%</span>
              <span className="text-gray-600 dark:text-gray-400">较上月</span>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>社保总额</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white">
                <Shield className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-2xl">{formatCurrency(compensationData.metrics.socialInsuranceTotal)}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>待发放</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-3xl">{compensationData.metrics.pendingCount}</CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <Badge className="bg-orange-100 text-orange-600">
                需要处理
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>本月发放</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-3xl">{formatCurrency(12500000)}</CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <Badge className="bg-green-100 text-green-600">
                485人
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* 主要内容 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">
            <PieChart className="h-4 w-4 mr-2" />
            总览
          </TabsTrigger>
          <TabsTrigger value="salary">
            <Calculator className="h-4 w-4 mr-2" />
            工资核算
          </TabsTrigger>
          <TabsTrigger value="structure">
            <Building2 className="h-4 w-4 mr-2" />
            薪酬结构
          </TabsTrigger>
          <TabsTrigger value="social">
            <Shield className="h-4 w-4 mr-2" />
            社保公积金
          </TabsTrigger>
          <TabsTrigger value="history">
            <Calendar className="h-4 w-4 mr-2" />
            发放记录
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 薪资结构 */}
            <Card>
              <CardHeader>
                <CardTitle>薪资构成</CardTitle>
                <CardDescription>平均薪资结构分析</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {compensationData.salaryStructure.map((item) => (
                    <div key={item.type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color}`} />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatCurrency(item.amount)}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {item.percentage}%
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={item.percentage} className="flex-1" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {item.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 社保公积金概览 */}
            <Card>
              <CardHeader>
                <CardTitle>社保公积金</CardTitle>
                <CardDescription>企业承担费用概览</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {compensationData.socialInsurance.map((item) => (
                    <div
                      key={item.type}
                      className="flex items-center justify-between p-3 rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center text-white`}>
                          <Shield className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {item.type}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            企业{item.companyRate}% / 个人{item.personalRate}%
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 dark:text-white">
                          {formatCurrency(item.companyAmount)}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          基数: {formatCurrency(item.baseAmount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="salary" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>工资核算</CardTitle>
                  <CardDescription>查看和管理员工工资明细</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Calculator className="h-4 w-4 mr-2" />
                  批量计算
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* 筛选栏 */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="搜索员工姓名..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="选择月份" />
                  </SelectTrigger>
                  <SelectContent>
                    {compensationData.payrollHistory.map((record) => (
                      <SelectItem key={record.id} value={record.month}>
                        {record.month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 数据表格 */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>员工</TableHead>
                      <TableHead>部门</TableHead>
                      <TableHead>岗位</TableHead>
                      <TableHead className="text-right">基本工资</TableHead>
                      <TableHead className="text-right">绩效奖金</TableHead>
                      <TableHead className="text-right">津贴</TableHead>
                      <TableHead className="text-right">加班</TableHead>
                      <TableHead className="text-right">应发</TableHead>
                      <TableHead className="text-right">扣除</TableHead>
                      <TableHead className="text-right">实发</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayroll.map((record) => {
                      const statusConfig = STATUS_CONFIG[record.status as keyof typeof STATUS_CONFIG];

                      return (
                        <TableRow key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableCell>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {record.employeeName}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {record.employeeId}
                            </div>
                          </TableCell>
                          <TableCell>{record.department}</TableCell>
                          <TableCell>{record.position}</TableCell>
                          <TableCell className="text-right">{formatCurrency(record.baseSalary)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(record.performanceBonus)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(record.allowance)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(record.overtimePay)}</TableCell>
                          <TableCell className="text-right font-semibold">{formatCurrency(record.grossPay)}</TableCell>
                          <TableCell className="text-right text-red-600">-{formatCurrency(record.deduction)}</TableCell>
                          <TableCell className="text-right font-bold text-green-600">{formatCurrency(record.netPay)}</TableCell>
                          <TableCell>
                            <Badge className={statusConfig.color}>
                              {statusConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetail(record)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>薪酬结构管理</CardTitle>
              <CardDescription>设计和管理企业薪酬体系</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  薪酬结构设计
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  支持职级体系、宽带薪酬、薪酬带宽设置
                </p>
                <Button variant="outline">
                  进入设计
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>社保公积金管理</CardTitle>
              <CardDescription>管理社保公积金缴纳基数和比例</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {compensationData.socialInsurance.map((item) => (
                  <Card key={item.type}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{item.type}</CardTitle>
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center text-white`}>
                          <Shield className="h-4 w-4" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">企业比例</div>
                          <div className="font-bold text-lg text-blue-600">
                            {item.companyRate}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">个人比例</div>
                          <div className="font-bold text-lg text-green-600">
                            {item.personalRate}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">缴费基数</div>
                          <div className="font-semibold text-sm">
                            {formatCurrency(item.baseAmount)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">企业承担</div>
                          <div className="font-semibold text-sm">
                            {formatCurrency(item.companyAmount)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>发放记录</CardTitle>
              <CardDescription>历史薪资发放记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {compensationData.payrollHistory.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {record.month}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          发放日期: {record.payDate}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          人数
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {record.totalCount}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          总金额
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {formatCurrency(record.totalAmount)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          平均
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {formatCurrency(record.avgSalary)}
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-600">
                        {record.status === 'paid' ? '已发放' : record.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 薪资详情弹窗 */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>工资明细</DialogTitle>
            <DialogDescription>
              查看员工工资发放详细信息
            </DialogDescription>
          </DialogHeader>
          {selectedDetail && (
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">员工姓名</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {selectedDetail.employeeName}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">部门/岗位</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {selectedDetail.department} / {selectedDetail.position}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">月份</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {selectedDetail.month}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">状态</div>
                  <Badge className={STATUS_CONFIG[selectedDetail.status as keyof typeof STATUS_CONFIG].color}>
                    {STATUS_CONFIG[selectedDetail.status as keyof typeof STATUS_CONFIG].label}
                  </Badge>
                </div>
              </div>

              {/* 收入明细 */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="font-semibold text-gray-900 dark:text-white mb-3">
                  收入明细
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">基本工资</span>
                    <span className="font-semibold text-green-600">+{formatCurrency(selectedDetail.baseSalary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">绩效奖金</span>
                    <span className="font-semibold text-green-600">+{formatCurrency(selectedDetail.performanceBonus)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">津贴</span>
                    <span className="font-semibold text-green-600">+{formatCurrency(selectedDetail.allowance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">加班费</span>
                    <span className="font-semibold text-green-600">+{formatCurrency(selectedDetail.overtimePay)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-green-200 dark:border-green-800">
                    <span className="font-semibold text-gray-900 dark:text-white">应发工资</span>
                    <span className="font-bold text-xl text-green-600">{formatCurrency(selectedDetail.grossPay)}</span>
                  </div>
                </div>
              </div>

              {/* 扣除明细 */}
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="font-semibold text-gray-900 dark:text-white mb-3">
                  扣除明细
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">社保公积金</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(selectedDetail.socialInsurance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">个人所得税</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(selectedDetail.tax)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-red-200 dark:border-red-800">
                    <span className="font-semibold text-gray-900 dark:text-white">合计扣除</span>
                    <span className="font-bold text-xl text-red-600">{formatCurrency(selectedDetail.deduction)}</span>
                  </div>
                </div>
              </div>

              {/* 实发工资 */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">实发工资</span>
                  <span className="text-3xl font-bold text-blue-600">{formatCurrency(selectedDetail.netPay)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
