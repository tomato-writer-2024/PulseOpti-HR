'use client';

import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { VirtualScroll } from '@/components/performance/virtual-scroll';
import { ResponsiveImage } from '@/components/performance/optimized-image';
import { useForm } from '@/hooks/use-form';
import { useDebounce } from '@/hooks/use-performance';
import {
  Target,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Award,
  Star,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/theme';

// 类型定义
interface PerformanceGoal {
  id: string;
  title: string;
  category: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  assignee: string;
  avatar: string | null;
}

interface Assessment {
  id: string;
  employeeName: string;
  employeeId: string;
  position: string;
  period: string;
  overallScore: number;
  status: 'pending' | 'reviewing' | 'completed';
  assessmentDate: string;
  reviewer: string;
  avatar: string | null;
}

// 模拟数据
const generateMockGoals = (): PerformanceGoal[] =>
  Array.from({ length: 50 }, (_, i) => {
    const categories = ['业务目标', '技能提升', '项目完成', '团队协作'];
    const statuses: Array<'not_started' | 'in_progress' | 'completed' | 'overdue'> =
      ['not_started', 'in_progress', 'in_progress', 'completed', 'overdue'];
    const progress = Math.floor(Math.random() * 101);

    return {
      id: `goal-${i + 1}`,
      title: `绩效目标 ${i + 1} - ${categories[i % categories.length]}`,
      category: categories[i % categories.length],
      targetValue: 100,
      currentValue: progress,
      unit: '分',
      deadline: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      status: statuses[i % statuses.length],
      assignee: `员工${String.fromCharCode(65 + (i % 26))}${i + 1}`,
      avatar: null,
    };
  });

const generateMockAssessments = (): Assessment[] =>
  Array.from({ length: 100 }, (_, i) => {
    const statuses: Array<'pending' | 'reviewing' | 'completed'> =
      ['pending', 'reviewing', 'completed'];
    const score = Math.floor(Math.random() * 41) + 60;

    return {
      id: `assessment-${i + 1}`,
      employeeName: `员工${String.fromCharCode(65 + (i % 26))}${i + 1}`,
      employeeId: `EMP${String(i + 1).padStart(4, '0')}`,
      position: ['工程师', '经理', '主管', '专员'][i % 4],
      period: `2024-Q${(i % 4) + 1}`,
      overallScore: score,
      status: statuses[i % statuses.length],
      assessmentDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      reviewer: i < 5 ? '' : `评估人${i % 3 + 1}`,
      avatar: null,
    };
  });

// 状态映射
const goalStatusMap: Record<string, { label: string; color: string; icon: any }> = {
  not_started: { label: '未开始', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', icon: Clock },
  in_progress: { label: '进行中', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: Target },
  completed: { label: '已完成', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
  overdue: { label: '已逾期', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: XCircle },
};

const assessmentStatusMap: Record<string, { label: string; color: string }> = {
  pending: { label: '待评估', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  reviewing: { label: '评估中', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  completed: { label: '已完成', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
};

export default function PerformancePage() {
  const [activeTab, setActiveTab] = useState('goals');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const [goals] = useState<PerformanceGoal[]>(generateMockGoals());
  const [assessments] = useState<Assessment[]>(generateMockAssessments());

  const categories = Array.from(new Set(goals.map((g) => g.category)));

  const stats = useMemo(() => {
    return {
      totalGoals: goals.length,
      completedGoals: goals.filter((g) => g.status === 'completed').length,
      avgScore: Math.round(
        assessments
          .filter((a) => a.status === 'completed')
          .reduce((sum, a) => sum + a.overallScore, 0) /
          assessments.filter((a) => a.status === 'completed').length || 0
      ),
      pendingAssessments: assessments.filter((a) => a.status === 'pending').length,
    };
  }, [goals, assessments]);

  const goalForm = useForm({
    initialValues: {
      title: '',
      category: '',
      targetValue: '',
      deadline: '',
      assignee: '',
    },
    validationRules: {
      title: { required: true, minLength: 2 },
      category: { required: true },
      targetValue: { required: true },
      deadline: { required: true },
      assignee: { required: true },
    },
    onSubmit: async (values) => {
      console.log('Creating goal:', values);
      setIsCreateDialogOpen(false);
      goalForm.resetForm();
    },
  });

  const filteredGoals = useMemo(() => {
    let filtered = [...goals];
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (g) =>
          g.title.toLowerCase().includes(query) ||
          g.assignee.toLowerCase().includes(query)
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((g) => g.status === statusFilter);
    }
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((g) => g.category === categoryFilter);
    }
    filtered.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
    return filtered;
  }, [goals, debouncedSearch, statusFilter, categoryFilter]);

  const filteredAssessments = useMemo(() => {
    let filtered = [...assessments];
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.employeeName.toLowerCase().includes(query) ||
          a.position.toLowerCase().includes(query)
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }
    filtered.sort((a, b) => b.overallScore - a.overallScore);
    return filtered;
  }, [assessments, debouncedSearch, statusFilter]);

  const GoalItem = useCallback((goal: PerformanceGoal) => {
    const statusInfo = goalStatusMap[goal.status];
    const StatusIcon = statusInfo.icon;
    const progress = (goal.currentValue / goal.targetValue) * 100;

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                {goal.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {goal.assignee}
              </p>
            </div>
            <Badge className={statusInfo.color} variant="secondary">
              <StatusIcon size={12} className="mr-1" />
              {statusInfo.label}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">进度</span>
              <span className="font-medium">
                {goal.currentValue} / {goal.targetValue} {goal.unit}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={cn(
                  'h-2 rounded-full transition-all',
                  progress >= 100
                    ? 'bg-green-500'
                    : progress >= 70
                    ? 'bg-blue-500'
                    : progress >= 30
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                )}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                截止: {goal.deadline}
              </span>
              <span className="flex items-center gap-1">
                <Award size={12} />
                {goal.category}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }, []);

  const AssessmentItem = useCallback((assessment: Assessment) => {
    const statusInfo = assessmentStatusMap[assessment.status];
    const scoreColor =
      assessment.overallScore >= 90
        ? 'text-green-600'
        : assessment.overallScore >= 80
        ? 'text-blue-600'
        : assessment.overallScore >= 70
        ? 'text-yellow-600'
        : 'text-red-600';

    return (
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="shrink-0">
            {assessment.avatar ? (
              <ResponsiveImage src={assessment.avatar} alt={assessment.employeeName} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium text-lg">
                {assessment.employeeName.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 dark:text-white truncate">
              {assessment.employeeName}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {assessment.position} · {assessment.period}
            </p>
          </div>

          <div className="hidden md:flex items-center gap-4 shrink-0">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">综合评分</p>
              <p className={cn('text-2xl font-bold', scoreColor)}>
                {assessment.overallScore}
              </p>
            </div>
          </div>
        </div>

        <Badge className={statusInfo.color} variant="secondary">
          {statusInfo.label}
        </Badge>
      </div>
    );
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">绩效管理</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            目标设定、绩效评估与反馈管理
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            导出报告
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus size={16} className="mr-2" />
                创建目标
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>创建绩效目标</DialogTitle>
              </DialogHeader>
              <form onSubmit={goalForm.handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>目标名称 *</Label>
                  <Input
                    placeholder="输入目标名称"
                    value={goalForm.values.title}
                    onChange={(e) => goalForm.handleChange('title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>目标分类 *</Label>
                  <Input
                    placeholder="例如：业务目标、技能提升"
                    value={goalForm.values.category}
                    onChange={(e) => goalForm.handleChange('category', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>目标值 *</Label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={goalForm.values.targetValue}
                      onChange={(e) => goalForm.handleChange('targetValue', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>截止日期 *</Label>
                    <Input
                      type="date"
                      value={goalForm.values.deadline}
                      onChange={(e) => goalForm.handleChange('deadline', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>负责人 *</Label>
                  <Input
                    placeholder="员工姓名"
                    value={goalForm.values.assignee}
                    onChange={(e) => goalForm.handleChange('assignee', e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    取消
                  </Button>
                  <Button type="submit" disabled={goalForm.submitting}>
                    {goalForm.submitting ? '创建中...' : '创建目标'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              总目标数
            </CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalGoals}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              已完成 {stats.completedGoals} 个
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              完成率
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalGoals > 0 ? Math.round((stats.completedGoals / stats.totalGoals) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">目标达成率</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              平均绩效
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgScore}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">综合评分</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              待评估
            </CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.pendingAssessments}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">需要处理</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <VirtualScroll
            items={activeTab === 'goals' ? filteredGoals : (filteredAssessments as any)}
            itemHeight={activeTab === 'goals' ? 180 : 80}
            renderItem={activeTab === 'goals' ? GoalItem : (AssessmentItem as any)}
            height={600}
            className="h-[600px]"
          />
        </CardContent>
      </Card>
    </div>
  );
}
