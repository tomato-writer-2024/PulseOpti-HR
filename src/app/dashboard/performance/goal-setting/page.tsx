'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Target,
  Plus,
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  TrendingUp,
  Award,
  Filter,
  Edit3,
  Trash2,
  BarChart3,
  Eye,
  Sparkles,
  User,
  Flag,
  Star,
  FileText,
  Download,
  RefreshCw,
} from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: 'draft' | 'active' | 'review' | 'completed' | 'delayed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: 'personal' | 'team' | 'department' | 'company';
  deadline: string;
  startDate: string;
  owner: string;
  ownerAvatar?: string;
  ownerDepartment: string;
  keyResults: KeyResult[];
  weight: number;
  score: number;
  comments: number;
  attachments: number;
  createdAt: string;
  updatedAt: string;
}

interface KeyResult {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
}

export default function GoalSettingPage() {
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Goal['status']>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Goal['priority']>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | Goal['type']>('all');

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    type: 'personal' as Goal['type'],
    priority: 'medium' as Goal['priority'],
    deadline: '',
    weight: 100,
  });

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      setGoals([
        {
          id: '1',
          title: '完成Q1季度销售目标',
          description: '达成1000万销售额，新客户增长30%，客户满意度95%以上',
          progress: 75,
          status: 'active',
          priority: 'critical',
          type: 'team',
          deadline: '2025-03-31',
          startDate: '2025-01-01',
          owner: '张三',
          ownerDepartment: '销售部',
          keyResults: [
            { id: '1', title: '销售额', targetValue: 1000, currentValue: 750, unit: '万', progress: 75, status: 'in-progress' },
            { id: '2', title: '新客户数', targetValue: 50, currentValue: 40, unit: '个', progress: 80, status: 'in-progress' },
            { id: '3', title: '客户满意度', targetValue: 95, currentValue: 94, unit: '%', progress: 98, status: 'in-progress' },
          ],
          weight: 100,
          score: 85,
          comments: 12,
          attachments: 5,
          createdAt: '2025-01-01',
          updatedAt: '2025-02-15',
        },
        {
          id: '2',
          title: '提升团队技术水平',
          description: '组织技术培训，提升团队整体技能水平',
          progress: 60,
          status: 'active',
          priority: 'high',
          type: 'department',
          deadline: '2025-06-30',
          startDate: '2025-01-01',
          owner: '李四',
          ownerDepartment: '技术部',
          keyResults: [
            { id: '1', title: '培训次数', targetValue: 6, currentValue: 3, unit: '次', progress: 50, status: 'in-progress' },
            { id: '2', title: '团队认证', targetValue: 80, currentValue: 45, unit: '%', progress: 56, status: 'in-progress' },
          ],
          weight: 80,
          score: 70,
          comments: 8,
          attachments: 3,
          createdAt: '2025-01-01',
          updatedAt: '2025-02-10',
        },
        {
          id: '3',
          title: '产品体验优化',
          description: '优化用户界面和交互体验，提升用户留存率',
          progress: 45,
          status: 'active',
          priority: 'high',
          type: 'team',
          deadline: '2025-04-30',
          startDate: '2025-01-15',
          owner: '王五',
          ownerDepartment: '产品部',
          keyResults: [
            { id: '1', title: '功能完成度', targetValue: 100, currentValue: 45, unit: '%', progress: 45, status: 'in-progress' },
            { id: '2', title: '用户反馈', targetValue: 50, currentValue: 25, unit: '条', progress: 50, status: 'in-progress' },
          ],
          weight: 90,
          score: 65,
          comments: 15,
          attachments: 8,
          createdAt: '2025-01-15',
          updatedAt: '2025-02-20',
        },
        {
          id: '4',
          title: '年度人才培养计划',
          description: '建立完整的人才培养体系，提升组织能力',
          progress: 30,
          status: 'delayed',
          priority: 'critical',
          type: 'company',
          deadline: '2025-12-31',
          startDate: '2025-01-01',
          owner: '赵六',
          ownerDepartment: '人力资源部',
          keyResults: [
            { id: '1', title: '培养计划数', targetValue: 10, currentValue: 3, unit: '个', progress: 30, status: 'in-progress' },
            { id: '2', title: '培训覆盖率', targetValue: 100, currentValue: 60, unit: '%', progress: 60, status: 'in-progress' },
          ],
          weight: 100,
          score: 50,
          comments: 6,
          attachments: 2,
          createdAt: '2025-01-01',
          updatedAt: '2025-02-05',
        },
        {
          id: '5',
          title: '系统稳定性提升',
          description: '提升系统可用性和性能，降低故障率',
          progress: 100,
          status: 'completed',
          priority: 'critical',
          type: 'department',
          deadline: '2025-02-28',
          startDate: '2025-01-01',
          owner: '孙七',
          ownerDepartment: '运维部',
          keyResults: [
            { id: '1', title: '可用性', targetValue: 99.9, currentValue: 99.95, unit: '%', progress: 100, status: 'completed' },
            { id: '2', title: '响应时间', targetValue: 100, currentValue: 85, unit: 'ms', progress: 100, status: 'completed' },
          ],
          weight: 95,
          score: 95,
          comments: 20,
          attachments: 10,
          createdAt: '2025-01-01',
          updatedAt: '2025-02-25',
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const filteredGoals = useMemo(() => {
    return goals.filter((goal) => {
      const matchesSearch =
        goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        goal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        goal.owner.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || goal.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || goal.priority === priorityFilter;
      const matchesType = typeFilter === 'all' || goal.type === typeFilter;
      return matchesSearch && matchesStatus && matchesPriority && matchesType;
    });
  }, [goals, searchTerm, statusFilter, priorityFilter, typeFilter]);

  const stats = useMemo(() => {
    return {
      total: goals.length,
      active: goals.filter((g) => g.status === 'active').length,
      completed: goals.filter((g) => g.status === 'completed').length,
      delayed: goals.filter((g) => g.status === 'delayed').length,
      avgProgress: goals.length > 0 ? goals.reduce((sum, g) => sum + g.progress, 0) / goals.length : 0,
      avgScore: goals.length > 0 ? goals.reduce((sum, g) => sum + g.score, 0) / goals.length : 0,
      criticalGoals: goals.filter((g) => g.priority === 'critical' && g.status !== 'completed').length,
    };
  }, [goals]);

  const getStatusBadge = (status: Goal['status']) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-blue-100 text-blue-800',
      review: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      delayed: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    const labels: Record<string, string> = {
      draft: '草稿',
      active: '进行中',
      review: '审核中',
      completed: '已完成',
      delayed: '已延期',
      cancelled: '已取消',
    };
    return <Badge className={colors[status]}>{labels[status]}</Badge>;
  };

  const getPriorityBadge = (priority: Goal['priority']) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    };
    const labels: Record<string, string> = {
      low: '低',
      medium: '中',
      high: '高',
      critical: '紧急',
    };
    return <Badge className={colors[priority]}>{labels[priority]}</Badge>;
  };

  const getTypeBadge = (type: Goal['type']) => {
    const labels: Record<string, string> = {
      personal: '个人',
      team: '团队',
      department: '部门',
      company: '公司',
    };
    return <Badge variant="outline">{labels[type]}</Badge>;
  };

  const handleCreateGoal = async () => {
    try {
      const newGoalData: Goal = {
        id: Date.now().toString(),
        ...newGoal,
        progress: 0,
        status: 'draft',
        startDate: new Date().toISOString().split('T')[0],
        owner: '当前用户',
        ownerDepartment: '技术部',
        keyResults: [],
        score: 0,
        comments: 0,
        attachments: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setGoals([newGoalData, ...goals]);
      setCreateDialogOpen(false);
      setNewGoal({ title: '', description: '', type: 'personal', priority: 'medium', deadline: '', weight: 100 });
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">目标设定</h1>
          <p className="text-muted-foreground mt-1">设定和管理团队及个人目标（OKR）</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                新建目标
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>新建目标</DialogTitle>
                <DialogDescription>创建一个新的OKR目标</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>目标标题</Label>
                  <Input
                    placeholder="请输入目标标题"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>目标描述</Label>
                  <Input
                    placeholder="请输入目标描述"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>目标类型</Label>
                    <Select value={newGoal.type} onValueChange={(v: Goal['type']) => setNewGoal({ ...newGoal, type: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">个人目标</SelectItem>
                        <SelectItem value="team">团队目标</SelectItem>
                        <SelectItem value="department">部门目标</SelectItem>
                        <SelectItem value="company">公司目标</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>优先级</Label>
                    <Select value={newGoal.priority} onValueChange={(v: Goal['priority']) => setNewGoal({ ...newGoal, priority: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">低</SelectItem>
                        <SelectItem value="medium">中</SelectItem>
                        <SelectItem value="high">高</SelectItem>
                        <SelectItem value="critical">紧急</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>截止日期</Label>
                    <Input
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>权重 (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={newGoal.weight}
                      onChange={(e) => setNewGoal({ ...newGoal, weight: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleCreateGoal}>
                  创建目标
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">目标总数</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">进行中 {stats.active} 个</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已完成</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground mt-1">
              完成率 {((stats.completed / stats.total) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均进度</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.avgProgress.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">平均得分 {stats.avgScore.toFixed(1)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待处理</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.delayed}</div>
            <p className="text-xs text-muted-foreground mt-1">
              紧急目标 {stats.criticalGoals} 个
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>目标列表 ({filteredGoals.length})</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索目标、描述、负责人..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="draft">草稿</SelectItem>
                  <SelectItem value="active">进行中</SelectItem>
                  <SelectItem value="review">审核中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="delayed">已延期</SelectItem>
                  <SelectItem value="cancelled">已取消</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="优先级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部优先级</SelectItem>
                  <SelectItem value="low">低</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="high">高</SelectItem>
                  <SelectItem value="critical">紧急</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="personal">个人</SelectItem>
                  <SelectItem value="team">团队</SelectItem>
                  <SelectItem value="department">部门</SelectItem>
                  <SelectItem value="company">公司</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredGoals.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              没有找到匹配的目标
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGoals.map((goal) => (
                <Card key={goal.id} className="hover:shadow-md transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {goal.owner.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-lg font-semibold">{goal.title}</h3>
                            {getStatusBadge(goal.status)}
                            {getPriorityBadge(goal.priority)}
                            {getTypeBadge(goal.type)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {goal.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{goal.owner}</span>
                              <span>·</span>
                              <span>{goal.ownerDepartment}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{goal.startDate} ~ {goal.deadline}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="h-4 w-4" />
                              <span>权重 {goal.weight}% · 得分 {goal.score}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedGoal(goal); setViewDialogOpen(true); }}>
                            <Eye className="h-4 w-4 mr-2" />
                            查看详情
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit3 className="h-4 w-4 mr-2" />
                            编辑目标
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Plus className="h-4 w-4 mr-2" />
                            添加关键结果
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Star className="h-4 w-4 mr-2" />
                            添加里程碑
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            导出报告
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            删除目标
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>总进度</span>
                          <span className="font-semibold">{goal.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              goal.status === 'completed'
                                ? 'bg-green-500'
                                : goal.status === 'delayed'
                                ? 'bg-yellow-500'
                                : 'bg-blue-500'
                            }`}
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>

                      {goal.keyResults.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="font-medium">关键结果（KR）</span>
                            <span className="text-muted-foreground">
                              {goal.keyResults.filter((kr) => kr.status === 'completed').length} / {goal.keyResults.length}
                            </span>
                          </div>
                          <div className="space-y-2">
                            {goal.keyResults.map((kr) => (
                              <div key={kr.id} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                                <div className="flex items-center gap-2">
                                  <Flag className="h-4 w-4 text-muted-foreground" />
                                  <span>{kr.title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">
                                    {kr.currentValue} / {kr.targetValue} {kr.unit}
                                  </span>
                                  <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className={`h-full ${
                                        kr.status === 'completed'
                                          ? 'bg-green-500'
                                          : kr.status === 'blocked'
                                          ? 'bg-red-500'
                                          : 'bg-blue-500'
                                      }`}
                                      style={{ width: `${kr.progress}%` }}
                                    />
                                  </div>
                                  <span className="w-10 text-right font-medium">{kr.progress}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>{goal.comments} 条评论</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5" />
                          <span>{goal.attachments} 个附件</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>更新于 {goal.updatedAt}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>目标详情</DialogTitle>
          </DialogHeader>
          {selectedGoal && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {selectedGoal.owner.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-2xl font-bold">{selectedGoal.title}</h3>
                      {getStatusBadge(selectedGoal.status)}
                      {getPriorityBadge(selectedGoal.priority)}
                      {getTypeBadge(selectedGoal.type)}
                    </div>
                    <p className="text-muted-foreground mb-3">{selectedGoal.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-medium">{selectedGoal.owner}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">{selectedGoal.ownerDepartment}</span>
                    </div>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">进度概览</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>总进度</span>
                          <span className="font-semibold text-lg">{selectedGoal.progress}%</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              selectedGoal.status === 'completed'
                                ? 'bg-green-500'
                                : selectedGoal.status === 'delayed'
                                ? 'bg-yellow-500'
                                : 'bg-blue-500'
                            }`}
                            style={{ width: `${selectedGoal.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 pt-2">
                        <div className="text-center p-3 bg-muted/50 rounded">
                          <p className="text-2xl font-bold">{selectedGoal.weight}%</p>
                          <p className="text-xs text-muted-foreground">权重</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded">
                          <p className="text-2xl font-bold">{selectedGoal.score}</p>
                          <p className="text-xs text-muted-foreground">得分</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded">
                          <p className="text-2xl font-bold">
                            {selectedGoal.keyResults.filter((kr) => kr.status === 'completed').length}
                          </p>
                          <p className="text-xs text-muted-foreground">KR完成</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {selectedGoal.keyResults.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">关键结果（KR）</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedGoal.keyResults.map((kr) => (
                          <div key={kr.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Flag className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">{kr.title}</span>
                              </div>
                              <Badge variant="outline">{kr.status}</Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>进度</span>
                                <span className="font-semibold">{kr.progress}%</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    kr.status === 'completed'
                                      ? 'bg-green-500'
                                      : kr.status === 'blocked'
                                      ? 'bg-red-500'
                                      : 'bg-blue-500'
                                  }`}
                                  style={{ width: `${kr.progress}%` }}
                                />
                              </div>
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>当前值</span>
                                <span>
                                  {kr.currentValue} / {kr.targetValue} {kr.unit}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>开始日期</Label>
                    <p className="text-sm">{selectedGoal.startDate}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>截止日期</Label>
                    <p className="text-sm">{selectedGoal.deadline}</p>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground pt-4 border-t">
                  <p>创建时间: {selectedGoal.createdAt}</p>
                  <p>更新时间: {selectedGoal.updatedAt}</p>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              关闭
            </Button>
            <Button>
              <Edit3 className="h-4 w-4 mr-2" />
              编辑目标
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MessageSquare(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
