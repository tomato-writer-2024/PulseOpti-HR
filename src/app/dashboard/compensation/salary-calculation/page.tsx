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
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DollarSign,
  Plus,
  Edit,
  CheckCircle,
  Clock,
  Send,
  Filter,
  Search,
  Download,
  FileText,
  Printer,
  Eye,
  Calculator,
  Calendar,
  User,
  Building2,
  MoreVertical,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';

// 类型定义
type SalaryStatus = 'draft' | 'calculating' | 'reviewing' | 'completed' | 'paid';

interface SalaryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  department: string;
  position: string;
  period: string;
  basicSalary: number;
  performanceBonus: number;
  overtimePay: number;
  allowance: number;
  deduction: number;
  tax: number;
  netSalary: number;
  status: SalaryStatus;
  createdAt: string;
  completedAt?: string;
}

interface SalaryStructure {
  id: string;
  name: string;
  basicSalary: number;
  performanceRatio: number;
  allowanceRatio: number;
  totalPackage: number;
}

export default function SalaryCalculationPage() {
  const [activeTab, setActiveTab] = useState('current');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);

  // 工资记录数据
  const [salaryRecords] = useState<SalaryRecord[]>([
    {
      id: '1',
      employeeId: '1',
      employeeName: '张三',
      employeeAvatar: '',
      department: '技术部',
      position: '高级工程师',
      period: '2025-04',
      basicSalary: 15000,
      performanceBonus: 3000,
      overtimePay: 1200,
      allowance: 2000,
      deduction: 500,
      tax: 1425,
      netSalary: 19275,
      status: 'completed',
      createdAt: '2025-04-25',
      completedAt: '2025-04-26',
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: '李四',
      employeeAvatar: '',
      department: '产品部',
      position: '产品经理',
      period: '2025-04',
      basicSalary: 12000,
      performanceBonus: 2500,
      overtimePay: 800,
      allowance: 1800,
      deduction: 300,
      tax: 1020,
      netSalary: 15780,
      status: 'completed',
      createdAt: '2025-04-25',
      completedAt: '2025-04-26',
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: '王五',
      employeeAvatar: '',
      department: '销售部',
      position: '销售经理',
      period: '2025-04',
      basicSalary: 10000,
      performanceBonus: 5000,
      overtimePay: 600,
      allowance: 1500,
      deduction: 200,
      tax: 1030,
      netSalary: 15870,
      status: 'reviewing',
      createdAt: '2025-04-25',
    },
    {
      id: '4',
      employeeId: '4',
      employeeName: '赵六',
      employeeAvatar: '',
      department: '市场部',
      position: '市场专员',
      period: '2025-04',
      basicSalary: 8000,
      performanceBonus: 1500,
      overtimePay: 400,
      allowance: 1200,
      deduction: 150,
      tax: 765,
      netSalary: 10185,
      status: 'calculating',
      createdAt: '2025-04-25',
    },
  ]);

  // 薪酬结构数据
  const [structures] = useState<SalaryStructure[]>([
    { id: '1', name: '技术岗', basicSalary: 15000, performanceRatio: 20, allowanceRatio: 13, totalPackage: 20000 },
    { id: '2', name: '产品岗', basicSalary: 12000, performanceRatio: 21, allowanceRatio: 15, totalPackage: 16800 },
    { id: '3', name: '销售岗', basicSalary: 10000, performanceRatio: 50, allowanceRatio: 15, totalPackage: 21500 },
    { id: '4', name: '市场岗', basicSalary: 8000, performanceRatio: 19, allowanceRatio: 15, totalPackage: 13200 },
  ]);

  // 映射
  const statusMap: Record<SalaryStatus, { label: string; color: string; icon: React.ReactNode }> = {
    draft: { label: '草稿', color: 'bg-gray-100 text-gray-800', icon: <FileText className="h-4 w-4" /> },
    calculating: { label: '计算中', color: 'bg-blue-100 text-blue-800', icon: <Calculator className="h-4 w-4" /> },
    reviewing: { label: '审核中', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-4 w-4" /> },
    completed: { label: '已完成', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" /> },
    paid: { label: '已发放', color: 'bg-purple-100 text-purple-800', icon: <DollarSign className="h-4 w-4" /> },
  };

  // 过滤工资记录
  const filteredRecords = salaryRecords.filter(record => {
    const matchSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       record.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // 统计
  const totalAmount = salaryRecords.reduce((sum, record) => sum + record.netSalary, 0);
  const paidCount = salaryRecords.filter(r => r.status === 'completed' || r.status === 'paid').length;
  const reviewingCount = salaryRecords.filter(r => r.status === 'reviewing').length;

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">工资核算</h1>
          <p className="text-gray-600 mt-2">
            计算和管理员工工资发放
            <Badge variant="secondary" className="ml-2">COE</Badge>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            打印
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            创建工资周期
          </Button>
        </div>
      </div>

      {/* 功能介绍 */}
      <Alert>
        <Calculator className="h-4 w-4" />
        <AlertDescription>
          自动计算工资，支持基本工资、绩效奖金、加班费、补贴、扣款、个税等完整薪酬结构
        </AlertDescription>
      </Alert>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">总金额</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{totalAmount.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">本月工资总额</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">员工数</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salaryRecords.length}</div>
            <p className="text-xs text-gray-500 mt-1">本月发放员工</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">已发放</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidCount}</div>
            <p className="text-xs text-gray-500 mt-1">已完成核算</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">待审核</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewingCount}</div>
            <p className="text-xs text-gray-500 mt-1">等待审核</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">当前周期</TabsTrigger>
          <TabsTrigger value="history">历史记录</TabsTrigger>
          <TabsTrigger value="structure">薪酬结构</TabsTrigger>
          <TabsTrigger value="settings">设置</TabsTrigger>
        </TabsList>

        {/* 当前周期 */}
        <TabsContent value="current" className="space-y-6">
          {/* 筛选栏 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>2025年4月工资明细</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="搜索员工..."
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
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="draft">草稿</SelectItem>
                      <SelectItem value="calculating">计算中</SelectItem>
                      <SelectItem value="reviewing">审核中</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
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
                    <TableHead>部门</TableHead>
                    <TableHead>基本工资</TableHead>
                    <TableHead>绩效奖金</TableHead>
                    <TableHead>加班费</TableHead>
                    <TableHead>补贴</TableHead>
                    <TableHead>扣款</TableHead>
                    <TableHead>个税</TableHead>
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
                            <AvatarFallback>{record.employeeName.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{record.employeeName}</div>
                            <div className="text-xs text-gray-500">{record.position}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{record.department}</TableCell>
                      <TableCell>¥{record.basicSalary.toLocaleString()}</TableCell>
                      <TableCell>¥{record.performanceBonus.toLocaleString()}</TableCell>
                      <TableCell>¥{record.overtimePay.toLocaleString()}</TableCell>
                      <TableCell>¥{record.allowance.toLocaleString()}</TableCell>
                      <TableCell className="text-red-600">-¥{record.deduction.toLocaleString()}</TableCell>
                      <TableCell>¥{record.tax.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className="font-bold text-green-600">
                          ¥{record.netSalary.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusMap[record.status].color}>
                          {statusMap[record.status].icon}
                          {statusMap[record.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {record.status === 'reviewing' && (
                            <Button variant="ghost" size="sm">
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

          {/* 批量操作 */}
          <Card>
            <CardHeader>
              <CardTitle>批量操作</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Calculator className="mr-2 h-4 w-4" />
                  批量计算
                </Button>
                <Button variant="outline">
                  <Send className="mr-2 h-4 w-4" />
                  批量发放
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  导出工资条
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 历史记录 */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>历史工资记录</CardTitle>
              <CardDescription>查看历史工资发放记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>历史记录功能开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 薪酬结构 */}
        <TabsContent value="structure">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>薪酬结构</CardTitle>
                  <CardDescription>管理不同岗位的薪酬结构</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  新建结构
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {structures.map((structure) => (
                  <Card key={structure.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <h3 className="text-lg font-semibold">{structure.name}</h3>
                            <Badge variant="outline">总包: ¥{structure.totalPackage.toLocaleString()}</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <div className="text-sm text-gray-600 mb-1">基本工资</div>
                              <div className="text-xl font-bold">¥{structure.basicSalary.toLocaleString()}</div>
                              <div className="text-xs text-gray-500">
                                {Math.round((structure.basicSalary / structure.totalPackage) * 100)}%
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600 mb-1">绩效奖金</div>
                              <div className="text-xl font-bold text-green-600">
                                ¥{(structure.totalPackage * structure.performanceRatio / 100).toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">{structure.performanceRatio}%</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600 mb-1">补贴福利</div>
                              <div className="text-xl font-bold text-blue-600">
                                ¥{(structure.totalPackage * structure.allowanceRatio / 100).toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">{structure.allowanceRatio}%</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
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

        {/* 设置 */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>工资设置</CardTitle>
              <CardDescription>配置工资计算相关参数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-12 text-gray-500">
                  <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>设置功能开发中...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 创建工资周期弹窗 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>创建工资周期</DialogTitle>
            <DialogDescription>
              创建新的工资核算周期
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="period">周期 *</Label>
              <Input id="period" type="month" />
            </div>
            <div>
              <Label htmlFor="department">部门</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择部门" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部部门</SelectItem>
                  <SelectItem value="tech">技术部</SelectItem>
                  <SelectItem value="product">产品部</SelectItem>
                  <SelectItem value="sales">销售部</SelectItem>
                  <SelectItem value="marketing">市场部</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={() => {
              toast.success('工资周期已创建！');
              setDialogOpen(false);
            }}>
              <Save className="mr-2 h-4 w-4" />
              创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
