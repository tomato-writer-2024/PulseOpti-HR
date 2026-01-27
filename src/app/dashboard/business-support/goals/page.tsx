'use client';

import { useState, useEffect } from 'react';
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Target,
  Plus,
  Search,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  User,
  Building,
  Eye,
  Edit,
  Download,
  Filter,
  Flag,
} from 'lucide-react';
import { toast } from 'sonner';

type GoalStatus = 'not-started' | 'in-progress' | 'completed' | 'delayed' | 'cancelled';
type GoalPriority = 'critical' | 'high' | 'medium' | 'low';
type GoalPeriod = 'q1' | 'q2' | 'q3' | 'q4' | 'h1' | 'h2' | 'annual';

interface Goal {
  id: string;
  title: string;
  description: string;
  status: GoalStatus;
  priority: GoalPriority;
  period: GoalPeriod;
  year: number;
  category: 'talent' | 'culture' | 'efficiency' | 'cost' | 'service' | 'other';
  owner: string;
  department: string;
  businessUnit: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: string;
  targetDate: string;
  progress: number;
  keyResults: {
    id: string;
    description: string;
    target: number;
    current: number;
    unit: string;
    status: 'not-started' | 'in-progress' | 'completed';
  }[];
  relatedProjects: string[];
  risks: string[];
  metrics: {
    name: string;
    value: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  createdAt: string;
  updatedAt: string;
}

export default function BusinessSupportGoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'other' as Goal['category'],
    period: 'q1' as GoalPeriod,
    year: new Date().getFullYear(),
    owner: '',
    department: '',
    businessUnit: '',
    targetValue: '',
    unit: '',
    startDate: '',
    targetDate: '',
  });

  useEffect(() => {
    // 模拟获取业务支持目标数据
    setTimeout(() => {
      setGoals([
        {
          id: '1',
          title: '核心人才流失率降低至10%以下',
          description: '通过优化激励机制、改善工作环境，降低核心人才的流失率',
          status: 'in-progress',
          priority: 'critical',
          period: 'q1',
          year: 2024,
          category: 'talent',
          owner: '张三 (HR BP)',
          department: '技术部',
          businessUnit: '技术部',
          targetValue: 10,
          currentValue: 15,
          unit: '%',
          startDate: '2024-01-01',
          targetDate: '2024-03-31',
          progress: 50,
          keyResults: [
            { id: '1', description: '完成核心人才盘点', target: 20, current: 20, unit: '人', status: 'completed' },
            { id: '2', description: '优化薪酬方案', target: 1, current: 0.8, unit: '方案', status: 'in-progress' },
            { id: '3', description: '建立职业发展通道', target: 1, current: 0.6, unit: '通道', status: 'in-progress' },
          ],
          relatedProjects: ['HR-2024-001'],
          risks: ['市场薪酬竞争力不足', '竞争对手挖角'],
          metrics: [
            { name: '流失率', value: 15, trend: 'down' },
            { name: '满意度', value: 75, trend: 'up' },
          ],
          createdAt: '2024-01-01T09:00:00',
          updatedAt: '2024-02-28T16:00:00',
        },
        {
          id: '2',
          title: '人均产出提升20%',
          description: '通过流程优化和效率提升工具，实现人均产出增长',
          status: 'in-progress',
          priority: 'high',
          period: 'h1',
          year: 2024,
          category: 'efficiency',
          owner: '李四 (HR BP)',
          department: '全公司',
          businessUnit: '全公司',
          targetValue: 100,
          currentValue: 90,
          unit: '万元',
          startDate: '2024-01-01',
          targetDate: '2024-06-30',
          progress: 60,
          keyResults: [
            { id: '1', description: '优化协作流程', target: 1, current: 0.7, unit: '流程', status: 'in-progress' },
            { id: '2', description: '引入效率工具', target: 3, current: 2, unit: '工具', status: 'in-progress' },
          ],
          relatedProjects: ['HR-2024-002'],
          risks: ['流程变革阻力'],
          metrics: [
            { name: '人均产出', value: 90, trend: 'up' },
          ],
          createdAt: '2024-01-01T10:00:00',
          updatedAt: '2024-02-28T14:30:00',
        },
        {
          id: '3',
          title: '员工满意度达到80分',
          description: '通过改善工作环境、优化福利政策，提升员工整体满意度',
          status: 'in-progress',
          priority: 'high',
          period: 'q1',
          year: 2024,
          category: 'culture',
          owner: '王五 (HR BP)',
          department: '人力资源部',
          businessUnit: '全公司',
          targetValue: 80,
          currentValue: 76,
          unit: '分',
          startDate: '2024-01-01',
          targetDate: '2024-03-31',
          progress: 75,
          keyResults: [
            { id: '1', description: '完成满意度调研', target: 100, current: 100, unit: '%', status: 'completed' },
            { id: '2', description: '实施福利优化', target: 1, current: 0.8, unit: '方案', status: 'in-progress' },
          ],
          relatedProjects: ['HR-2024-003'],
          risks: [],
          metrics: [
            { name: '满意度', value: 76, trend: 'up' },
          ],
          createdAt: '2024-01-01T11:00:00',
          updatedAt: '2024-02-20T10:00:00',
        },
        {
          id: '4',
          title: 'HR服务响应时间缩短30%',
          description: '优化HR服务流程，提高服务响应速度和质量',
          status: 'completed',
          priority: 'medium',
          period: 'q4',
          year: 2023,
          category: 'service',
          owner: '赵六 (SSC)',
          department: '人力资源部',
          businessUnit: '全公司',
          targetValue: 70,
          currentValue: 70,
          unit: '%',
          startDate: '2023-10-01',
          targetDate: '2023-12-31',
          progress: 100,
          keyResults: [
            { id: '1', description: '建立自助服务平台', target: 1, current: 1, unit: '平台', status: 'completed' },
            { id: '2', description: '培训HR团队', target: 100, current: 100, unit: '%', status: 'completed' },
          ],
          relatedProjects: [],
          risks: [],
          metrics: [
            { name: '响应时间', value: 70, trend: 'up' },
          ],
          createdAt: '2023-10-01T09:00:00',
          updatedAt: '2024-01-15T16:00:00',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateGoal = () => {
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      status: 'not-started',
      priority: 'medium',
      period: newGoal.period,
      year: newGoal.year,
      category: newGoal.category,
      owner: newGoal.owner,
      department: newGoal.department,
      businessUnit: newGoal.businessUnit,
      targetValue: parseFloat(newGoal.targetValue) || 0,
      currentValue: 0,
      unit: newGoal.unit,
      startDate: newGoal.startDate,
      targetDate: newGoal.targetDate,
      progress: 0,
      keyResults: [],
      relatedProjects: [],
      risks: [],
      metrics: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setGoals([goal, ...goals]);
    setShowCreateGoal(false);
    toast.success('目标已创建');
    setNewGoal({
      title: '',
      description: '',
      category: 'other',
      period: 'q1',
      year: new Date().getFullYear(),
      owner: '',
      department: '',
      businessUnit: '',
      targetValue: '',
      unit: '',
      startDate: '',
      targetDate: '',
    });
  };

  const filteredGoals = goals.filter((goal) => {
    const matchesSearch =
      goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || goal.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || goal.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const statusConfig: Record<GoalStatus, { label: string; color: string; icon: any }> = {
    'not-started': { label: '未开始', color: 'bg-gray-500', icon: Clock },
    'in-progress': { label: '进行中', color: 'bg-blue-500', icon: TrendingUp },
    completed: { label: '已完成', color: 'bg-green-500', icon: CheckCircle },
    delayed: { label: '延期', color: 'bg-orange-500', icon: Clock },
    cancelled: { label: '已取消', color: 'bg-red-500', icon: Clock },
  };

  const priorityConfig: Record<GoalPriority, { label: string; color: string; level: number }> = {
    critical: { label: '关键', color: 'bg-red-500', level: 4 },
    high: { label: '高', color: 'bg-orange-500', level: 3 },
    medium: { label: '中', color: 'bg-yellow-500', level: 2 },
    low: { label: '低', color: 'bg-blue-500', level: 1 },
  };

  const categoryConfig: Record<Goal['category'], { label: string; color: string; icon: any }> = {
    talent: { label: '人才', color: 'bg-blue-500', icon: User },
    culture: { label: '文化', color: 'bg-purple-500', icon: Target },
    efficiency: { label: '效率', color: 'bg-green-500', icon: TrendingUp },
    cost: { label: '成本', color: 'bg-red-500', icon: Target },
    service: { label: '服务', color: 'bg-orange-500', icon: Target },
    other: { label: '其他', color: 'bg-gray-500', icon: Target },
  };

  const statistics = {
    total: goals.length,
    inProgress: goals.filter((g) => g.status === 'in-progress').length,
    completed: goals.filter((g) => g.status === 'completed').length,
    averageProgress: goals.length > 0
      ? goals.reduce((sum, g) => sum + g.progress, 0) / goals.length
      : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Target className="h-8 w-8 text-green-600" />
              业务支持目标
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              管理HR对业务部门的支持目标
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.info('导出中...')}>
              <Download className="h-4 w-4 mr-2" />
              导出
            </Button>
            <Button onClick={() => setShowCreateGoal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              创建目标
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">总目标数</p>
                  <p className="text-2xl font-bold">{statistics.total}</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">进行中</p>
                  <p className="text-2xl font-bold text-blue-600">{statistics.inProgress}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">平均进度</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {statistics.averageProgress.toFixed(0)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 筛选栏 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索目标名称、描述或负责人..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
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
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分类</SelectItem>
                  {Object.entries(categoryConfig).map(([value, config]) => (
                    <SelectItem key={value} value={value}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 目标列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 flex items-center justify-center h-64">
              <div className="text-gray-600 dark:text-gray-400">加载中...</div>
            </div>
          ) : filteredGoals.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">暂无目标</p>
              <Button className="mt-4" onClick={() => setShowCreateGoal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                创建目标
              </Button>
            </div>
          ) : (
            filteredGoals.map((goal) => {
              const StatusIcon = statusConfig[goal.status].icon;
              const CategoryIcon = categoryConfig[goal.category].icon;
              return (
                <Card key={goal.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Flag className={`h-4 w-4 ${priorityConfig[goal.priority].color.replace('bg-', 'text-')}`} />
                          {goal.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge className={`${statusConfig[goal.status].color} text-white border-0 flex items-center gap-1`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[goal.status].label}
                          </Badge>
                          <Badge className={`${priorityConfig[goal.priority].color} text-white border-0`}>
                            {priorityConfig[goal.priority].label}
                          </Badge>
                          <Badge className={`${categoryConfig[goal.category].color} text-white border-0 flex items-center gap-1`}>
                            <CategoryIcon className="h-3 w-3" />
                            {categoryConfig[goal.category].label}
                          </Badge>
                          <span className="text-sm">{goal.period.toUpperCase()} {goal.year}</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {goal.description}
                      </p>

                      {/* 进度 */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">目标进度</span>
                          <span className="font-medium">{goal.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              goal.progress >= 80 ? 'bg-green-500' :
                              goal.progress >= 50 ? 'bg-blue-500' :
                              'bg-yellow-500'
                            }`}
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* 目标值和当前值 */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">当前值</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {goal.currentValue} {goal.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">目标值</p>
                          <p className="text-2xl font-bold">
                            {goal.targetValue} {goal.unit}
                          </p>
                        </div>
                      </div>

                      {/* 负责人和部门 */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">负责人</span>
                          <p className="font-medium">{goal.owner}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">部门</span>
                          <p className="font-medium">{goal.department}</p>
                        </div>
                      </div>

                      {/* 关键结果 */}
                      {goal.keyResults.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">关键结果</p>
                          <div className="space-y-2">
                            {goal.keyResults.slice(0, 2).map((kr) => (
                              <div key={kr.id} className="flex items-center justify-between text-sm">
                                <span className="truncate">{kr.description}</span>
                                <Badge
                                  variant="outline"
                                  className={
                                    kr.status === 'completed'
                                      ? 'bg-green-50 text-green-600 border-green-200'
                                      : kr.status === 'in-progress'
                                      ? 'bg-blue-50 text-blue-600 border-blue-200'
                                      : 'bg-gray-50 text-gray-600 border-gray-200'
                                  }
                                >
                                  {kr.current}/{kr.target} {kr.unit}
                                </Badge>
                              </div>
                            ))}
                            {goal.keyResults.length > 2 && (
                              <p className="text-xs text-gray-500">
                                还有 {goal.keyResults.length - 2} 个关键结果...
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 操作按钮 */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          查看详情
                        </Button>
                        {goal.status === 'not-started' && (
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-1" />
                            开始
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* 创建目标弹窗 */}
      <Dialog open={showCreateGoal} onOpenChange={setShowCreateGoal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>创建业务支持目标</DialogTitle>
            <DialogDescription>
              创建新的HR对业务部门的支持目标
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>目标标题 *</Label>
              <Input
                placeholder="输入目标标题"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>目标描述</Label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                placeholder="详细描述目标内容..."
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>目标分类 *</Label>
                <Select
                  value={newGoal.category}
                  onValueChange={(v) => setNewGoal({ ...newGoal, category: v as Goal['category'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryConfig).map(([value, config]) => (
                      <SelectItem key={value} value={value}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>周期 *</Label>
                <Select
                  value={newGoal.period}
                  onValueChange={(v) => setNewGoal({ ...newGoal, period: v as GoalPeriod })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="q1">Q1</SelectItem>
                    <SelectItem value="q2">Q2</SelectItem>
                    <SelectItem value="q3">Q3</SelectItem>
                    <SelectItem value="q4">Q4</SelectItem>
                    <SelectItem value="h1">H1</SelectItem>
                    <SelectItem value="h2">H2</SelectItem>
                    <SelectItem value="annual">年度</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>年份 *</Label>
                <Input
                  type="number"
                  value={newGoal.year}
                  onChange={(e) => setNewGoal({ ...newGoal, year: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>负责人 *</Label>
                <Input
                  placeholder="输入负责人"
                  value={newGoal.owner}
                  onChange={(e) => setNewGoal({ ...newGoal, owner: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>部门 *</Label>
                <Input
                  placeholder="输入部门"
                  value={newGoal.department}
                  onChange={(e) => setNewGoal({ ...newGoal, department: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>目标值 *</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="数值"
                    value={newGoal.targetValue}
                    onChange={(e) => setNewGoal({ ...newGoal, targetValue: e.target.value })}
                  />
                  <Input
                    placeholder="单位"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                    className="w-20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>业务单元</Label>
                <Input
                  placeholder="输入业务单元"
                  value={newGoal.businessUnit}
                  onChange={(e) => setNewGoal({ ...newGoal, businessUnit: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>开始日期 *</Label>
                <Input
                  type="date"
                  value={newGoal.startDate}
                  onChange={(e) => setNewGoal({ ...newGoal, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>目标日期 *</Label>
                <Input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateGoal(false)}>
              取消
            </Button>
            <Button onClick={handleCreateGoal}>
              <Plus className="h-4 w-4 mr-2" />
              创建目标
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
