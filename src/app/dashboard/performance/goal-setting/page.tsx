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
  DialogTrigger,
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
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Target,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Award,
  Star,
  Calendar,
  User,
  Building2,
  Filter,
  Search,
  Download,
  FileText,
  BarChart3,
  LineChart,
  PieChart,
  MoreVertical,
  Save,
  Send,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';

// 类型定义
type GoalType = 'okr' | 'kpi' | 'smart';
type GoalStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';
type GoalPeriod = 'monthly' | 'quarterly' | 'yearly';

interface Goal {
  id: string;
  title: string;
  description: string;
  type: GoalType;
  status: GoalStatus;
  period: GoalPeriod;
  owner: string;
  ownerAvatar?: string;
  department: string;
  progress: number;
  weight: number;
  dueDate: string;
  createdAt: string;
  children?: Goal[];
}

interface GoalMetric {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export default function GoalSettingPage() {
  const [activeTab, setActiveTab] = useState('my-goals');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);

  // 目标数据
  const [goals] = useState<Goal[]>([
    {
      id: '1',
      title: '完成Q3招聘计划',
      description: '完成10名技术岗位招聘，包括3名高级工程师',
      type: 'okr',
      status: 'in_progress',
      period: 'quarterly',
      owner: '张三',
      ownerAvatar: '',
      department: '技术部',
      progress: 70,
      weight: 30,
      dueDate: '2025-06-30',
      createdAt: '2025-04-01',
    },
    {
      id: '2',
      title: '提升产品用户满意度',
      description: '用户满意度从85%提升到90%',
      type: 'kpi',
      status: 'in_progress',
      period: 'quarterly',
      owner: '李四',
      ownerAvatar: '',
      department: '产品部',
      progress: 45,
      weight: 25,
      dueDate: '2025-06-30',
      createdAt: '2025-04-01',
    },
    {
      id: '3',
      title: '完成新员工培训',
      description: '确保所有新入职员工完成入职培训并达到考核要求',
      type: 'smart',
      status: 'completed',
      period: 'monthly',
      owner: '王五',
      ownerAvatar: '',
      department: 'HR部',
      progress: 100,
      weight: 15,
      dueDate: '2025-04-30',
      createdAt: '2025-04-01',
    },
    {
      id: '4',
      title: '优化招聘流程',
      description: '将招聘周期从45天缩短到30天',
      type: 'smart',
      status: 'pending',
      period: 'quarterly',
      owner: '赵六',
      ownerAvatar: '',
      department: 'HR部',
      progress: 0,
      weight: 20,
      dueDate: '2025-06-30',
      createdAt: '2025-04-01',
    },
  ]);

  // 目标指标数据
  const [metrics] = useState<GoalMetric[]>([
    { id: '1', name: '招聘完成率', target: 100, current: 70, unit: '%', trend: 'up' },
    { id: '2', name: '用户满意度', target: 90, current: 87, unit: '%', trend: 'up' },
    { id: '3', name: '培训完成率', target: 100, current: 100, unit: '%', trend: 'stable' },
    { id: '4', name: '招聘周期', target: 30, current: 42, unit: '天', trend: 'down' },
  ]);

  // 映射
  const typeMap: Record<GoalType, { label: string; color: string; icon: React.ReactNode }> = {
    okr: { label: 'OKR', color: 'bg-blue-100 text-blue-800', icon: <Target className="h-4 w-4" /> },
    kpi: { label: 'KPI', color: 'bg-green-100 text-green-800', icon: <BarChart3 className="h-4 w-4" /> },
    smart: { label: 'SMART', color: 'bg-purple-100 text-purple-800', icon: <Star className="h-4 w-4" /> },
  };

  const statusMap: Record<GoalStatus, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: '待开始', color: 'bg-gray-100 text-gray-800', icon: <Clock className="h-4 w-4" /> },
    in_progress: { label: '进行中', color: 'bg-blue-100 text-blue-800', icon: <TrendingUp className="h-4 w-4" /> },
    completed: { label: '已完成', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" /> },
    overdue: { label: '已逾期', color: 'bg-red-100 text-red-800', icon: <XCircle className="h-4 w-4" /> },
  };

  const periodMap: Record<GoalPeriod, string> = {
    monthly: '月度',
    quarterly: '季度',
    yearly: '年度',
  };

  // 过滤目标
  const filteredGoals = goals.filter(goal => {
    const matchSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || goal.status === statusFilter;
    const matchType = typeFilter === 'all' || goal.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  // 计算总体进度
  const totalProgress = goals.length > 0
    ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
    : 0;

  // 计算完成率
  const completedCount = goals.filter(g => g.status === 'completed').length;
  const completionRate = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">目标设定</h1>
          <p className="text-gray-600 mt-2">
            制定和管理团队目标，跟踪进度
            <Badge variant="secondary" className="ml-2">COE</Badge>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            创建目标
          </Button>
        </div>
      </div>

      {/* 功能介绍 */}
      <Alert>
        <Target className="h-4 w-4" />
        <AlertDescription>
          支持OKR、KPI、SMART等多种目标设定方法，实现目标对齐、进度跟踪和绩效评估
        </AlertDescription>
      </Alert>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">总体进度</CardTitle>
            <Progress className="w-12 h-2" value={totalProgress} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProgress}%</div>
            <p className="text-xs text-gray-500 mt-1">全部目标平均完成度</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">目标总数</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.length}</div>
            <p className="text-xs text-gray-500 mt-1">本周期设定目标</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">已完成</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-gray-500 mt-1">{completionRate}% 完成率</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">进行中</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.filter(g => g.status === 'in_progress').length}</div>
            <p className="text-xs text-gray-500 mt-1">正在推进中</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="my-goals">我的目标</TabsTrigger>
          <TabsTrigger value="team-goals">团队目标</TabsTrigger>
          <TabsTrigger value="metrics">指标追踪</TabsTrigger>
          <TabsTrigger value="analysis">数据分析</TabsTrigger>
        </TabsList>

        {/* 我的目标 */}
        <TabsContent value="my-goals" className="space-y-6">
          {/* 筛选栏 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>目标列表</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="搜索目标..."
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
                      <SelectItem value="pending">待开始</SelectItem>
                      <SelectItem value="in_progress">进行中</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                      <SelectItem value="overdue">已逾期</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="okr">OKR</SelectItem>
                      <SelectItem value="kpi">KPI</SelectItem>
                      <SelectItem value="smart">SMART</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredGoals.map((goal) => (
                  <Card key={goal.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{goal.title}</h3>
                            <Badge className={typeMap[goal.type].color}>
                              {typeMap[goal.type].label}
                            </Badge>
                            <Badge className={statusMap[goal.status].color}>
                              {statusMap[goal.status].icon}
                              {statusMap[goal.status].label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{goal.owner}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              <span>{goal.department}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{periodMap[goal.period]}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>截止: {goal.dueDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold mb-1">{goal.progress}%</div>
                          <div className="text-sm text-gray-500">权重: {goal.weight}%</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">进度</span>
                          <span className="font-medium">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            编辑
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            详情
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => toast.success('目标进度已更新')}
                        >
                          更新进度
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 团队目标 */}
        <TabsContent value="team-goals">
          <Card>
            <CardHeader>
              <CardTitle>团队目标</CardTitle>
              <CardDescription>查看和管理团队目标</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>团队目标功能开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 指标追踪 */}
        <TabsContent value="metrics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>关键指标追踪</CardTitle>
              <CardDescription>实时监控目标关键指标</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metrics.map((metric) => (
                  <Card key={metric.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{metric.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            目标: {metric.target} {metric.unit}
                          </div>
                        </div>
                        {metric.trend === 'up' && (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        )}
                        {metric.trend === 'down' && (
                          <TrendingDown className="h-5 w-5 text-red-600" />
                        )}
                        {metric.trend === 'stable' && (
                          <LineChart className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">当前值</span>
                          <span className="text-2xl font-bold">
                            {metric.current} <span className="text-sm font-normal">{metric.unit}</span>
                          </span>
                        </div>
                        <Progress
                          value={(metric.current / metric.target) * 100}
                          className="h-2"
                        />
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>0</span>
                          <span>进度: {Math.round((metric.current / metric.target) * 100)}%</span>
                          <span>{metric.target}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 数据分析 */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>目标数据分析</CardTitle>
              <CardDescription>目标完成情况和趋势分析</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>数据分析功能开发中...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 创建目标弹窗 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>创建新目标</DialogTitle>
            <DialogDescription>
              填写目标信息，设定关键指标
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">目标标题 *</Label>
              <Input id="title" placeholder="输入目标标题" />
            </div>
            <div>
              <Label htmlFor="description">目标描述 *</Label>
              <Textarea
                id="description"
                placeholder="详细描述目标内容"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">目标类型 *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="okr">OKR</SelectItem>
                    <SelectItem value="kpi">KPI</SelectItem>
                    <SelectItem value="smart">SMART</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="period">周期 *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择周期" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">月度</SelectItem>
                    <SelectItem value="quarterly">季度</SelectItem>
                    <SelectItem value="yearly">年度</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">权重 (%)</Label>
                <Input id="weight" type="number" placeholder="100" />
              </div>
              <div>
                <Label htmlFor="dueDate">截止日期 *</Label>
                <Input id="dueDate" type="date" />
              </div>
            </div>
            <div>
              <Label htmlFor="owner">负责人 *</Label>
              <Input id="owner" placeholder="选择负责人" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={() => {
              toast.success('目标创建成功！');
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
