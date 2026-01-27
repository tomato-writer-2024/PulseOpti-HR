'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Switch } from '@/components/ui/switch';
import {
  Gift,
  Plus,
  Edit,
  CheckCircle,
  Search,
  Download,
  Upload,
  Save,
  Eye,
  Trash2,
  Calendar,
  Users,
  CreditCard,
  Heart,
  Coffee,
  Plane,
  GraduationCap,
  Home,
  Car,
  Award,
  TrendingUp,
  Building2,
  Filter,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';

// 类型定义
type BenefitType = 'insurance' | 'meal' | 'transport' | 'housing' | 'vacation' | 'health' | 'training';
type BenefitStatus = 'active' | 'inactive' | 'draft';

interface Benefit {
  id: string;
  name: string;
  type: BenefitType;
  description: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'yearly' | 'one_time';
  eligibleEmployees: number;
  totalEmployees: number;
  status: BenefitStatus;
  startDate: string;
  endDate?: string;
  coverageRate: number;
}

interface EmployeeBenefit {
  id: string;
  employeeId: string;
  employeeName: string;
  benefitId: string;
  benefitName: string;
  benefitType: BenefitType;
  amount: number;
  status: 'enrolled' | 'pending' | 'declined';
  enrolledAt: string;
}

export default function BenefitsPage() {
  const [activeTab, setActiveTab] = useState('benefits');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);

  // 福利项目
  const [benefits] = useState<Benefit[]>([
    {
      id: '1',
      name: '五险一金',
      type: 'insurance',
      description: '基本社会保险和住房公积金',
      amount: 1500,
      frequency: 'monthly',
      eligibleEmployees: 95,
      totalEmployees: 100,
      status: 'active',
      startDate: '2025-01-01',
      coverageRate: 95,
    },
    {
      id: '2',
      name: '餐费补贴',
      type: 'meal',
      description: '工作日餐费补贴',
      amount: 500,
      frequency: 'monthly',
      eligibleEmployees: 85,
      totalEmployees: 100,
      status: 'active',
      startDate: '2025-01-01',
      coverageRate: 85,
    },
    {
      id: '3',
      name: '交通补贴',
      type: 'transport',
      description: '上下班交通费用补贴',
      amount: 300,
      frequency: 'monthly',
      eligibleEmployees: 70,
      totalEmployees: 100,
      status: 'active',
      startDate: '2025-01-01',
      coverageRate: 70,
    },
    {
      id: '4',
      name: '健康体检',
      type: 'health',
      description: '年度员工健康体检',
      amount: 800,
      frequency: 'yearly',
      eligibleEmployees: 98,
      totalEmployees: 100,
      status: 'active',
      startDate: '2025-03-01',
      coverageRate: 98,
    },
    {
      id: '5',
      name: '培训基金',
      type: 'training',
      description: '员工个人技能培训基金',
      amount: 2000,
      frequency: 'yearly',
      eligibleEmployees: 60,
      totalEmployees: 100,
      status: 'active',
      startDate: '2025-01-01',
      coverageRate: 60,
    },
    {
      id: '6',
      name: '节日福利',
      type: 'vacation',
      description: '传统节日礼品',
      amount: 200,
      frequency: 'one_time',
      eligibleEmployees: 100,
      totalEmployees: 100,
      status: 'active',
      startDate: '2025-01-01',
      coverageRate: 100,
    },
  ]);

  // 员工福利记录
  const [employeeBenefits] = useState<EmployeeBenefit[]>([
    {
      id: '1',
      employeeId: '1',
      employeeName: '张三',
      benefitId: '1',
      benefitName: '五险一金',
      benefitType: 'insurance',
      amount: 1500,
      status: 'enrolled',
      enrolledAt: '2025-01-01',
    },
    {
      id: '2',
      employeeId: '1',
      employeeName: '张三',
      benefitId: '2',
      benefitName: '餐费补贴',
      benefitType: 'meal',
      amount: 500,
      status: 'enrolled',
      enrolledAt: '2025-01-01',
    },
    {
      id: '3',
      employeeId: '1',
      employeeName: '张三',
      benefitId: '3',
      benefitName: '交通补贴',
      benefitType: 'transport',
      amount: 300,
      status: 'enrolled',
      enrolledAt: '2025-01-01',
    },
  ]);

  // 福利统计
  const [benefitStats] = useState({
    totalBenefits: 6,
    activeBenefits: 6,
    totalBudget: 5300,
    avgBenefitPerEmployee: 4200,
    coverageRate: 85,
  });

  const typeMap: Record<BenefitType, { label: string; icon: React.ReactNode; color: string }> = {
    insurance: { label: '保险福利', icon: <Shield className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800' },
    meal: { label: '餐饮福利', icon: <Coffee className="h-4 w-4" />, color: 'bg-orange-100 text-orange-800' },
    transport: { label: '交通福利', icon: <Car className="h-4 w-4" />, color: 'bg-green-100 text-green-800' },
    housing: { label: '住房福利', icon: <Home className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800' },
    vacation: { label: '假期福利', icon: <Plane className="h-4 w-4" />, color: 'bg-pink-100 text-pink-800' },
    health: { label: '健康福利', icon: <Heart className="h-4 w-4" />, color: 'bg-red-100 text-red-800' },
    training: { label: '培训福利', icon: <GraduationCap className="h-4 w-4" />, color: 'bg-indigo-100 text-indigo-800' },
  };

  const frequencyMap: Record<string, { label: string }> = {
    monthly: { label: '月度' },
    quarterly: { label: '季度' },
    yearly: { label: '年度' },
    one_time: { label: '一次性' },
  };

  const filteredBenefits = benefits.filter(benefit => {
    const matchSearch = benefit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       benefit.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || benefit.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">福利管理</h1>
          <p className="text-gray-600 mt-2">
            福利项目管理、员工福利配置
            <Badge variant="secondary" className="ml-2">SSC</Badge>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出报表
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            添加福利
          </Button>
        </div>
      </div>

      {/* 功能介绍 */}
      <Alert>
        <Gift className="h-4 w-4" />
        <AlertDescription>
          支持多种福利类型，灵活配置福利规则，实时跟踪员工福利使用情况
        </AlertDescription>
      </Alert>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">福利项目</CardTitle>
            <Gift className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{benefitStats.totalBenefits}</div>
            <p className="text-xs text-gray-500 mt-1">
              {benefitStats.activeBenefits} 个生效中
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">年度预算</CardTitle>
            <CreditCard className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{benefitStats.totalBudget.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">人均/月</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">人均福利</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{benefitStats.avgBenefitPerEmployee.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">年度/人</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">覆盖率</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{benefitStats.coverageRate}%</div>
            <p className="text-xs text-gray-500 mt-1">平均覆盖率</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="benefits">福利项目</TabsTrigger>
          <TabsTrigger value="employees">员工福利</TabsTrigger>
          <TabsTrigger value="settings">福利设置</TabsTrigger>
        </TabsList>

        {/* 福利项目 */}
        <TabsContent value="benefits" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>所有福利</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="搜索福利..."
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
                      <SelectItem value="active">生效中</SelectItem>
                      <SelectItem value="inactive">已停止</SelectItem>
                      <SelectItem value="draft">草稿</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBenefits.map((benefit) => (
                  <Card key={benefit.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={typeMap[benefit.type].color}>
                          {typeMap[benefit.type].icon}
                          {typeMap[benefit.type].label}
                        </Badge>
                        <Badge
                          variant={benefit.status === 'active' ? 'default' : 'secondary'}
                        >
                          {benefit.status === 'active' ? '生效中' : '已停止'}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{benefit.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {benefit.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">金额</span>
                          <span className="font-bold text-blue-600">
                            ¥{benefit.amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">频率</span>
                          <span>{frequencyMap[benefit.frequency].label}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">覆盖率</span>
                          <span>{benefit.coverageRate}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">参与人数</span>
                          <span>{benefit.eligibleEmployees}/{benefit.totalEmployees}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span>{benefit.startDate} ~ {benefit.endDate || '永久'}</span>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-1" />
                            编辑
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
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

        {/* 员工福利 */}
        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>员工福利配置</CardTitle>
              <CardDescription>查看和管理员工的福利配置</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>员工</TableHead>
                    <TableHead>福利类型</TableHead>
                    <TableHead>福利项目</TableHead>
                    <TableHead>金额</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>加入时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeBenefits.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {record.employeeName}
                      </TableCell>
                      <TableCell>
                        <Badge className={typeMap[record.benefitType].color}>
                          {typeMap[record.benefitType].label}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.benefitName}</TableCell>
                      <TableCell className="font-medium text-blue-600">
                        ¥{record.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={record.status === 'enrolled' ? 'default' : 'secondary'}
                        >
                          {record.status === 'enrolled' && '已参保'}
                          {record.status === 'pending' && '待确认'}
                          {record.status === 'declined' && '已放弃'}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.enrolledAt}</TableCell>
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

        {/* 福利设置 */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>福利政策</CardTitle>
                <CardDescription>配置福利相关政策和规则</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">新员工福利起效</div>
                    <div className="text-sm text-gray-600">试用期后自动生效</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">节假日福利</div>
                    <div className="text-sm text-gray-600">法定节假日自动发放</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">生日福利</div>
                    <div className="text-sm text-gray-600">员工生日当月自动发放</div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">长期服务奖励</div>
                    <div className="text-sm text-gray-600">满5年/10年自动发放</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>福利通知</CardTitle>
                <CardDescription>配置福利相关通知</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">福利发放通知</div>
                    <div className="text-sm text-gray-600">福利发放时通知员工</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">福利变更通知</div>
                    <div className="text-sm text-gray-600">福利规则变更时通知</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">福利提醒</div>
                    <div className="text-sm text-gray-600">员工福利即将到期提醒</div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* 添加福利弹窗 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>添加新福利</DialogTitle>
            <DialogDescription>
              创建新的福利项目
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">福利名称 *</Label>
              <Input id="name" placeholder="输入福利名称" />
            </div>
            <div>
              <Label htmlFor="type">福利类型 *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="insurance">保险福利</SelectItem>
                  <SelectItem value="meal">餐饮福利</SelectItem>
                  <SelectItem value="transport">交通福利</SelectItem>
                  <SelectItem value="housing">住房福利</SelectItem>
                  <SelectItem value="vacation">假期福利</SelectItem>
                  <SelectItem value="health">健康福利</SelectItem>
                  <SelectItem value="training">培训福利</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">描述 *</Label>
              <Textarea
                id="description"
                placeholder="详细描述福利内容"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">金额 (¥) *</Label>
                <Input id="amount" type="number" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="frequency">发放频率 *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择频率" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">月度</SelectItem>
                    <SelectItem value="quarterly">季度</SelectItem>
                    <SelectItem value="yearly">年度</SelectItem>
                    <SelectItem value="one_time">一次性</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">开始日期 *</Label>
                <Input id="startDate" type="date" />
              </div>
              <div>
                <Label htmlFor="endDate">结束日期</Label>
                <Input id="endDate" type="date" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={() => {
              toast.success('福利添加成功！');
              setDialogOpen(false);
            }}>
              <Save className="mr-2 h-4 w-4" />
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
