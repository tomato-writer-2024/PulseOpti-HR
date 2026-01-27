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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Calendar,
  Target,
  Users,
  CheckCircle,
  Clock,
  PlayCircle,
  PauseCircle,
  Plus,
  Edit,
  Trash2,
  Filter,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';

type TrainingStatus = 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
type TrainingCategory = 'onboarding' | 'skills' | 'leadership' | 'compliance' | 'custom';

interface TrainingPlan {
  id: string;
  name: string;
  category: TrainingCategory;
  description: string;
  startDate: string;
  endDate: string;
  targetAudience: string;
  maxParticipants: number;
  currentParticipants: number;
  budget: number;
  status: TrainingStatus;
  creator: string;
  createdAt: string;
}

export default function TrainingPlansPage() {
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const [newPlan, setNewPlan] = useState({
    name: '',
    category: 'skills' as TrainingCategory,
    description: '',
    startDate: '',
    endDate: '',
    targetAudience: '',
    maxParticipants: '',
    budget: '',
  });

  useEffect(() => {
    // 模拟获取培训计划数据
    setTimeout(() => {
      setPlans([
        {
          id: '1',
          name: '2024年新员工入职培训',
          category: 'onboarding',
          description: '为新入职员工提供全面的入职培训，包括公司文化、规章制度、业务知识等',
          startDate: '2024-02-01',
          endDate: '2024-02-15',
          targetAudience: '新入职员工',
          maxParticipants: 50,
          currentParticipants: 42,
          budget: 50000,
          status: 'ongoing',
          creator: 'HR Manager',
          createdAt: '2024-01-20T10:00:00',
        },
        {
          id: '2',
          name: '中层管理能力提升培训',
          category: 'leadership',
          description: '提升中层管理者的管理能力和领导力',
          startDate: '2024-03-01',
          endDate: '2024-03-31',
          targetAudience: '中层管理者',
          maxParticipants: 30,
          currentParticipants: 28,
          budget: 120000,
          status: 'published',
          creator: 'HR Director',
          createdAt: '2024-02-15T14:30:00',
        },
        {
          id: '3',
          name: '技术技能培训-前端开发',
          category: 'skills',
          description: '提升前端开发人员的专业技能',
          startDate: '2024-01-15',
          endDate: '2024-01-31',
          targetAudience: '前端开发人员',
          maxParticipants: 20,
          currentParticipants: 18,
          budget: 30000,
          status: 'completed',
          creator: 'Tech Lead',
          createdAt: '2024-01-05T09:00:00',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddPlan = () => {
    const plan: TrainingPlan = {
      id: Date.now().toString(),
      name: newPlan.name,
      category: newPlan.category,
      description: newPlan.description,
      startDate: newPlan.startDate,
      endDate: newPlan.endDate,
      targetAudience: newPlan.targetAudience,
      maxParticipants: parseInt(newPlan.maxParticipants),
      currentParticipants: 0,
      budget: parseFloat(newPlan.budget),
      status: 'draft',
      creator: '当前用户',
      createdAt: new Date().toISOString(),
    };
    setPlans([plan, ...plans]);
    setShowAddPlan(false);
    toast.success('培训计划已创建');
    setNewPlan({
      name: '',
      category: 'skills',
      description: '',
      startDate: '',
      endDate: '',
      targetAudience: '',
      maxParticipants: '',
      budget: '',
    });
  };

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || plan.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categoryConfig: Record<TrainingCategory, { label: string; color: string }> = {
    onboarding: { label: '入职培训', color: 'bg-blue-500' },
    skills: { label: '技能培训', color: 'bg-green-500' },
    leadership: { label: '领导力培训', color: 'bg-purple-500' },
    compliance: { label: '合规培训', color: 'bg-red-500' },
    custom: { label: '自定义', color: 'bg-gray-500' },
  };

  const statusConfig: Record<TrainingStatus, { label: string; color: string; icon: any }> = {
    draft: { label: '草稿', color: 'bg-gray-500', icon: Clock },
    published: { label: '已发布', color: 'bg-blue-500', icon: CheckCircle },
    ongoing: { label: '进行中', color: 'bg-green-500', icon: PlayCircle },
    completed: { label: '已完成', color: 'bg-purple-500', icon: CheckCircle },
    cancelled: { label: '已取消', color: 'bg-red-500', icon: PauseCircle },
  };

  const statistics = {
    total: plans.length,
    ongoing: plans.filter(p => p.status === 'ongoing').length,
    upcoming: plans.filter(p => p.status === 'published').length,
    completed: plans.filter(p => p.status === 'completed').length,
    totalBudget: plans.reduce((sum, p) => sum + p.budget, 0),
    totalParticipants: plans.reduce((sum, p) => sum + p.currentParticipants, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              培训计划
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              规划和管理企业培训计划
            </p>
          </div>
          <Button onClick={() => setShowAddPlan(true)}>
            <Plus className="h-4 w-4 mr-2" />
            创建计划
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">总计划</p>
                  <p className="text-2xl font-bold">{statistics.total}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">进行中</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.ongoing}</p>
                </div>
                <PlayCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">待开始</p>
                  <p className="text-2xl font-bold text-blue-600">{statistics.upcoming}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">已完成</p>
                  <p className="text-2xl font-bold text-purple-600">{statistics.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">总预算</p>
                  <p className="text-2xl font-bold text-green-600">
                    ¥{statistics.totalBudget.toLocaleString()}
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 筛选栏 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="搜索培训计划..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
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

        {/* 培训计划列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center h-64">
              <div className="text-gray-600 dark:text-gray-400">加载中...</div>
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">暂无培训计划</p>
              <Button className="mt-4" onClick={() => setShowAddPlan(true)}>
                <Plus className="h-4 w-4 mr-2" />
                创建计划
              </Button>
            </div>
          ) : (
            filteredPlans.map((plan) => {
              const statusIcon = statusConfig[plan.status].icon;
              const StatusIcon = statusIcon;
              const progress = plan.maxParticipants > 0
                ? (plan.currentParticipants / plan.maxParticipants) * 100
                : 0;
              return (
                <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">{plan.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge className={`${categoryConfig[plan.category].color} text-white border-0`}>
                            {categoryConfig[plan.category].label}
                          </Badge>
                          <Badge className={`${statusConfig[plan.status].color} text-white border-0 flex items-center gap-1`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[plan.status].label}
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {plan.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">开始日期</span>
                          <p className="font-medium">{plan.startDate}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">结束日期</span>
                          <p className="font-medium">{plan.endDate}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">报名进度</span>
                          <span className="font-medium">
                            {plan.currentParticipants}/{plan.maxParticipants}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              progress >= 90 ? 'bg-red-500' :
                              progress >= 70 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">预算</span>
                        <span className="font-semibold text-green-600">
                          ¥{plan.budget.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          编辑
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Users className="h-4 w-4 mr-1" />
                          学员
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* 创建计划弹窗 */}
      <Dialog open={showAddPlan} onOpenChange={setShowAddPlan}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>创建培训计划</DialogTitle>
            <DialogDescription>
              创建新的企业培训计划
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>计划名称 *</Label>
              <Input
                placeholder="输入培训计划名称"
                value={newPlan.name}
                onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>培训分类 *</Label>
              <Select
                value={newPlan.category}
                onValueChange={(v) => setNewPlan({ ...newPlan, category: v as TrainingCategory })}
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
              <Label>培训描述</Label>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                placeholder="描述培训的目的、内容等..."
                value={newPlan.description}
                onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>开始日期 *</Label>
                <Input
                  type="date"
                  value={newPlan.startDate}
                  onChange={(e) => setNewPlan({ ...newPlan, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>结束日期 *</Label>
                <Input
                  type="date"
                  value={newPlan.endDate}
                  onChange={(e) => setNewPlan({ ...newPlan, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>目标对象 *</Label>
              <Input
                placeholder="例如：全体员工、中层管理者、新员工等"
                value={newPlan.targetAudience}
                onChange={(e) => setNewPlan({ ...newPlan, targetAudience: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>最大人数 *</Label>
                <Input
                  type="number"
                  placeholder="输入最大参与人数"
                  value={newPlan.maxParticipants}
                  onChange={(e) => setNewPlan({ ...newPlan, maxParticipants: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>预算 (元) *</Label>
                <Input
                  type="number"
                  placeholder="输入培训预算"
                  value={newPlan.budget}
                  onChange={(e) => setNewPlan({ ...newPlan, budget: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPlan(false)}>
              取消
            </Button>
            <Button onClick={handleAddPlan}>
              <Plus className="h-4 w-4 mr-2" />
              创建计划
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
