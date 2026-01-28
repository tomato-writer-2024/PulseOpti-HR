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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Edit,
  Eye,
  Calendar,
  User,
  Award,
  BarChart3,
  Download,
  Filter,
  Search,
  Star,
  Flag,
} from 'lucide-react';
import { toast } from 'sonner';

interface OKRGoal {
  id: string;
  objective: string;
  keyResults: KeyResult[];
  ownerId: string;
  ownerName: string;
  ownerDepartment: string;
  period: string;
  type: 'individual' | 'department' | 'company';
  priority: 'high' | 'medium' | 'low';
  status: 'draft' | 'active' | 'completed' | 'delayed' | 'cancelled';
  progress: number;
  startDate: string;
  endDate: string;
  alignsWith: string[];
  milestones: Milestone[];
  weight: number;
  category: string;
}

interface KeyResult {
  id: string;
  title: string;
  description: string;
  type: 'metric' | 'milestone' | 'binary';
  targetValue: number;
  currentValue: number;
  unit: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'off-track' | 'completed';
  dueDate: string;
}

interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  status: 'pending' | 'completed' | 'delayed';
}

export default function GoalSettingPage() {
  const [activeTab, setActiveTab] = useState('okr');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('2024-Q4');

  const [okrGoals, setOkrGoals] = useState<OKRGoal[]>([
    {
      id: '1',
      objective: '提升产品用户体验，增加用户粘性',
      keyResults: [
        {
          id: 'kr1',
          title: '日活跃用户数（DAU）提升30%',
          description: '从当前的10万DAU提升到13万',
          type: 'metric',
          targetValue: 130000,
          currentValue: 115000,
          unit: '用户',
          progress: 50,
          status: 'on-track',
          dueDate: '2024-12-31',
        },
        {
          id: 'kr2',
          title: '用户留存率提升至40%',
          description: '30天留存率从35%提升到40%',
          type: 'metric',
          targetValue: 40,
          currentValue: 37,
          unit: '%',
          progress: 60,
          status: 'on-track',
          dueDate: '2024-12-31',
        },
        {
          id: 'kr3',
          title: '上线新的智能推荐功能',
          description: '完成AI推荐算法开发和上线',
          type: 'milestone',
          targetValue: 1,
          currentValue: 0,
          unit: '',
          progress: 80,
          status: 'on-track',
          dueDate: '2024-12-15',
        },
      ],
      ownerId: 'EMP001',
      ownerName: '张三',
      ownerDepartment: '产品部',
      period: '2024-Q4',
      type: 'individual',
      priority: 'high',
      status: 'active',
      progress: 63,
      startDate: '2024-10-01',
      endDate: '2024-12-31',
      alignsWith: ['提升产品竞争力', '增加市场份额'],
      milestones: [
        { id: 'm1', title: '完成用户调研', targetDate: '2024-10-15', status: 'completed' },
        { id: 'm2', title: '上线功能原型', targetDate: '2024-11-15', status: 'completed' },
        { id: 'm3', title: '正式上线', targetDate: '2024-12-15', status: 'pending' },
      ],
      weight: 30,
      category: '产品创新',
    },
    {
      id: '2',
      objective: '扩大市场覆盖，提升品牌影响力',
      keyResults: [
        {
          id: 'kr4',
          title: '新增500家企业客户',
          description: '拓展B端客户群体',
          type: 'metric',
          targetValue: 500,
          currentValue: 320,
          unit: '家',
          progress: 64,
          status: 'on-track',
          dueDate: '2024-12-31',
        },
        {
          id: 'kr5',
          title: '市场覆盖率提升至60%',
          description: '覆盖全国主要一二线城市',
          type: 'metric',
          targetValue: 60,
          currentValue: 45,
          unit: '%',
          progress: 75,
          status: 'on-track',
          dueDate: '2024-12-31',
        },
      ],
      ownerId: 'EMP002',
      ownerName: '李四',
      ownerDepartment: '销售部',
      period: '2024-Q4',
      type: 'department',
      priority: 'high',
      status: 'active',
      progress: 70,
      startDate: '2024-10-01',
      endDate: '2024-12-31',
      alignsWith: ['业务增长', '市场扩张'],
      milestones: [
        { id: 'm4', title: '制定市场拓展计划', targetDate: '2024-10-31', status: 'completed' },
        { id: 'm5', title: '完成团队培训', targetDate: '2024-11-30', status: 'completed' },
      ],
      weight: 25,
      category: '市场增长',
    },
  ]);

  const [goalFormData, setGoalFormData] = useState({
    objective: '',
    type: 'individual',
    owner: '',
    period: '2024-Q4',
    priority: 'medium',
    category: '',
    weight: '',
  });

  const stats = {
    totalGoals: okrGoals.length,
    activeGoals: okrGoals.filter(g => g.status === 'active').length,
    completedGoals: okrGoals.filter(g => g.status === 'completed').length,
    avgProgress: Math.round(
      okrGoals.reduce((sum, g) => sum + g.progress, 0) / okrGoals.length
    ),
    onTrack: okrGoals.reduce((sum, g) => sum + g.keyResults.filter(kr => kr.status === 'on-track').length, 0),
    atRisk: okrGoals.reduce((sum, g) => sum + g.keyResults.filter(kr => kr.status === 'at-risk').length, 0),
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      draft: { label: '草稿', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
      active: { label: '进行中', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      completed: { label: '已完成', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      delayed: { label: '延期', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      cancelled: { label: '已取消', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
      'on-track': { label: '正常', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      'at-risk': { label: '风险', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      'off-track': { label: '偏离', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    };
    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, any> = {
      high: { label: '高', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
      medium: { label: '中', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      low: { label: '低', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    };
    const variant = variants[priority];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const handleCreateGoal = () => {
    if (!goalFormData.objective || !goalFormData.owner) {
      toast.error('请填写完整的OKR信息');
      return;
    }

    const newGoal: OKRGoal = {
      id: Date.now().toString(),
      objective: goalFormData.objective,
      keyResults: [],
      ownerId: goalFormData.owner,
      ownerName: '新员工',
      ownerDepartment: '',
      period: goalFormData.period,
      type: goalFormData.type as any,
      priority: goalFormData.priority as any,
      status: 'draft',
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      alignsWith: [],
      milestones: [],
      weight: Number(goalFormData.weight) || 0,
      category: goalFormData.category,
    };

    setOkrGoals([...okrGoals, newGoal]);
    setShowCreateDialog(false);
    setGoalFormData({
      objective: '',
      type: 'individual',
      owner: '',
      period: '2024-Q4',
      priority: 'medium',
      category: '',
      weight: '',
    });
    toast.success('OKR创建成功');
  };

  const filteredGoals = okrGoals.filter(goal => {
    const matchesDepartment = selectedDepartment === 'all' || goal.ownerDepartment === selectedDepartment;
    const matchesPeriod = selectedPeriod === 'all' || goal.period === selectedPeriod;
    return matchesDepartment && matchesPeriod;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <Target className="h-7 w-7 text-white" />
              </div>
              目标设定（OKR/KPI）
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              科学的目标管理体系，助力团队高效达成目标
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出报告
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              创建OKR
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">OKR总数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalGoals}</div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                <Target className="h-3 w-3 mr-1" />
                个
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">进行中</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.activeGoals}</div>
              <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mt-1">
                <Clock className="h-3 w-3 mr-1" />
                个
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">已完成</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completedGoals}</div>
              <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                个
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">平均进度</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.avgProgress}%</div>
              <div className="flex items-center text-xs text-purple-600 dark:text-purple-400 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                整体进度
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">正常</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.onTrack}</div>
              <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                KR
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">风险</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.atRisk}</div>
              <div className="flex items-center text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                KR
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 功能Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="okr" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              OKR管理
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              进度跟踪
            </TabsTrigger>
            <TabsTrigger value="alignment" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              目标对齐
            </TabsTrigger>
          </TabsList>

          {/* OKR管理 */}
          <TabsContent value="okr" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>OKR列表</CardTitle>
                    <CardDescription>查看和管理所有目标</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
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
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-Q4">2024 Q4</SelectItem>
                        <SelectItem value="2024-Q3">2024 Q3</SelectItem>
                        <SelectItem value="2024-Q2">2024 Q2</SelectItem>
                        <SelectItem value="2024-Q1">2024 Q1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredGoals.map((goal) => (
                    <Card key={goal.id} className="hover:shadow-md transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {goal.objective}
                              </h3>
                              {getStatusBadge(goal.status)}
                              {getPriorityBadge(goal.priority)}
                              <Badge variant="outline">{goal.period}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{goal.ownerName}</span>
                                <span>·</span>
                                <span>{goal.ownerDepartment}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Flag className="h-4 w-4" />
                                <span>{goal.category}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{goal.endDate}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              查看
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              编辑
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">总体进度</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{goal.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                goal.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${goal.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">关键结果（KR）</h4>
                          <div className="space-y-2">
                            {goal.keyResults.map((kr, idx) => (
                              <div key={kr.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-medium text-gray-900 dark:text-white">{kr.title}</span>
                                      {getStatusBadge(kr.status)}
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{kr.description}</p>
                                  </div>
                                  <div className="text-right">
                                    <div className={`text-lg font-bold ${
                                      (kr.currentValue / kr.targetValue) >= 1 ? 'text-green-600 dark:text-green-400' :
                                      (kr.currentValue / kr.targetValue) >= 0.8 ? 'text-blue-600 dark:text-blue-400' :
                                      'text-yellow-600 dark:text-yellow-400'
                                    }`}>
                                      {kr.currentValue} / {kr.targetValue} {kr.unit}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{kr.progress}%</div>
                                  </div>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      kr.status === 'on-track' ? 'bg-green-500' :
                                      kr.status === 'at-risk' ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${kr.progress}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {goal.alignsWith.length > 0 && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                            <div className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-2">对齐目标</div>
                            <div className="flex flex-wrap gap-1">
                              {goal.alignsWith.map((item, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 进度跟踪 */}
          <TabsContent value="tracking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>进度跟踪概览</CardTitle>
                <CardDescription>所有KR的实时进度和状态</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border dark:border-gray-700">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>目标</TableHead>
                        <TableHead>负责人</TableHead>
                        <TableHead>关键结果</TableHead>
                        <TableHead>当前值</TableHead>
                        <TableHead>目标值</TableHead>
                        <TableHead>进度</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>截止日期</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGoals.flatMap(goal =>
                        goal.keyResults.map(kr => ({
                          ...kr,
                          objective: goal.objective,
                          ownerName: goal.ownerName,
                          ownerDepartment: goal.ownerDepartment,
                        }))
                      ).map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="max-w-xs">
                            <div className="truncate font-medium">{item.objective}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs">
                                  {item.ownerName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{item.ownerName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-md">
                            <div className="text-sm">{item.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.currentValue} {item.unit}
                          </TableCell>
                          <TableCell className="font-medium text-gray-600 dark:text-gray-400">
                            {item.targetValue} {item.unit}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    item.progress >= 80 ? 'bg-green-500' :
                                    item.progress >= 50 ? 'bg-blue-500' :
                                    'bg-yellow-500'
                                  }`}
                                  style={{ width: `${item.progress}%` }}
                                />
                              </div>
                              <span className="text-sm">{item.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell>{item.dueDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 目标对齐 */}
          <TabsContent value="alignment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>目标对齐视图</CardTitle>
                <CardDescription>查看公司目标如何向下分解和对齐</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-900">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">公司战略目标</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">2024年实现营收翻倍，用户数突破200万</p>
                        <div className="flex items-center gap-4">
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">公司级</Badge>
                          <span className="text-sm text-gray-600 dark:text-gray-400">权重: 100%</span>
                          <span className="text-sm text-green-600 dark:text-green-400">进度: 85%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {filteredGoals.map((goal) => (
                    <Card key={goal.id} className="ml-8">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <Flag className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white">{goal.objective}</h4>
                              <Badge variant="outline">{goal.ownerDepartment}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              负责人: {goal.ownerName} | 权重: {goal.weight}%
                            </p>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-blue-500"
                                style={{ width: `${goal.progress}%` }}
                              />
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
        </Tabs>

        {/* 创建OKR对话框 */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>创建新的OKR</DialogTitle>
              <DialogDescription>
                设定清晰的目标和可衡量的关键结果
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="objective">目标（Objective） *</Label>
                <Textarea
                  id="objective"
                  value={goalFormData.objective}
                  onChange={(e) => setGoalFormData({ ...goalFormData, objective: e.target.value })}
                  placeholder="例如：提升产品用户体验，增加用户粘性"
                  rows={2}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  目标应该是定性、鼓舞人心、有时间限制的
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">OKR类型</Label>
                <Select value={goalFormData.type} onValueChange={(v) => setGoalFormData({ ...goalFormData, type: v })}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">个人OKR</SelectItem>
                    <SelectItem value="department">部门OKR</SelectItem>
                    <SelectItem value="company">公司OKR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner">负责人 *</Label>
                <Input
                  id="owner"
                  value={goalFormData.owner}
                  onChange={(e) => setGoalFormData({ ...goalFormData, owner: e.target.value })}
                  placeholder="选择负责人"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="period">周期</Label>
                <Select value={goalFormData.period} onValueChange={(v) => setGoalFormData({ ...goalFormData, period: v })}>
                  <SelectTrigger id="period">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-Q4">2024 Q4</SelectItem>
                    <SelectItem value="2025-Q1">2025 Q1</SelectItem>
                    <SelectItem value="2025-Q2">2025 Q2</SelectItem>
                    <SelectItem value="2025-Q3">2025 Q3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">优先级</Label>
                <Select value={goalFormData.priority} onValueChange={(v) => setGoalFormData({ ...goalFormData, priority: v })}>
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="low">低</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">目标类别</Label>
                <Input
                  id="category"
                  value={goalFormData.category}
                  onChange={(e) => setGoalFormData({ ...goalFormData, category: e.target.value })}
                  placeholder="例如：产品创新、市场增长"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">权重（%）</Label>
                <Input
                  id="weight"
                  type="number"
                  value={goalFormData.weight}
                  onChange={(e) => setGoalFormData({ ...goalFormData, weight: e.target.value })}
                  placeholder="0-100"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>取消</Button>
              <Button onClick={handleCreateGoal}>创建OKR</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
