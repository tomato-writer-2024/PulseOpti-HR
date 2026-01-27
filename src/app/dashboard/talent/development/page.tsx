'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Search,
  Plus,
  Edit,
  Eye,
  Users,
  Target,
  TrendingUp,
  CheckCircle,
  Calendar,
  GraduationCap,
  Award,
  Star,
  BookOpen,
  MessageSquare,
  Play,
  Pause,
  RefreshCw,
  Filter,
  Download,
  User,
  Building2,
  Briefcase,
  ArrowRight,
  GitBranch,
  Lightbulb,
  Zap,
  Flag,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/theme';

interface DevelopmentPlan {
  id: string;
  employeeId: string;
  employeeName: string;
  avatar?: string;
  department: string;
  currentPosition: string;
  managerId: string;
  managerName: string;
  
  // 发展目标
  targetPosition: string;
  targetDate: string;
  motivation: string;
  
  // 能力评估
  currentSkills: SkillGap[];
  requiredSkills: SkillGap[];
  developmentNeeds: string[];
  
  // 发展计划
  milestones: Milestone[];
  actionItems: ActionItem[];
  
  // 导师信息
  mentorId?: string;
  mentorName?: string;
  mentorRelationship?: string;
  
  // 进度
  overallProgress: number;
  status: 'draft' | 'active' | 'completed' | 'paused';
  priority: 'high' | 'medium' | 'low';
  
  // 评估
  startDate: string;
  nextReviewDate: string;
  lastReviewDate?: string;
  reviewFeedback?: string;
  
  createdAt: string;
  updatedAt: string;
}

interface SkillGap {
  name: string;
  currentLevel: number; // 1-5
  targetLevel: number; // 1-5
  gap: number;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  completedDate?: string;
  requiredSkills: string[];
}

interface ActionItem {
  id: string;
  title: string;
  description: string;
  type: 'training' | 'project' | 'mentoring' | 'self_study' | 'certification';
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  completedDate?: string;
  resources: string[];
  estimatedHours: number;
  actualHours?: number;
  notes?: string;
}

export default function EmployeeDevelopmentPage() {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<DevelopmentPlan[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | DevelopmentPlan['status']>('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | DevelopmentPlan['priority']>('all');
  const [activeTab, setActiveTab] = useState<'plans' | 'templates' | 'analytics'>('plans');
  
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<DevelopmentPlan | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockPlans: DevelopmentPlan[] = [
        {
          id: '1',
          employeeId: 'EMP001',
          employeeName: '王小明',
          avatar: '',
          department: '技术部',
          currentPosition: '前端开发工程师',
          managerId: 'MGR001',
          managerName: '张经理',
          targetPosition: '高级前端开发工程师',
          targetDate: '2025-12-31',
          motivation: '希望在技术深度和团队管理方面进一步提升，为未来晋升打下基础',
          currentSkills: [
            { name: '前端框架', currentLevel: 4, targetLevel: 5, gap: 1 },
            { name: 'TypeScript', currentLevel: 3, targetLevel: 4, gap: 1 },
            { name: '性能优化', currentLevel: 3, targetLevel: 4, gap: 1 },
            { name: '团队协作', currentLevel: 4, targetLevel: 5, gap: 1 },
            { name: '架构设计', currentLevel: 2, targetLevel: 4, gap: 2 },
          ],
          requiredSkills: [
            { name: '前端框架', currentLevel: 4, targetLevel: 5, gap: 1 },
            { name: 'TypeScript', currentLevel: 3, targetLevel: 4, gap: 1 },
            { name: '性能优化', currentLevel: 3, targetLevel: 4, gap: 1 },
            { name: '团队协作', currentLevel: 4, targetLevel: 5, gap: 1 },
            { name: '架构设计', currentLevel: 2, targetLevel: 4, gap: 2 },
          ],
          developmentNeeds: [
            '提升架构设计能力',
            '增强技术深度',
            '积累项目管理经验',
          ],
          milestones: [
            {
              id: '1-1',
              title: '完成架构设计培训',
              description: '完成系统架构设计专项培训课程',
              dueDate: '2025-03-31',
              status: 'completed',
              completedDate: '2025-03-28',
              requiredSkills: ['架构设计'],
            },
            {
              id: '1-2',
              title: '主导中型项目',
              description: '独立负责一个中型前端项目的设计和开发',
              dueDate: '2025-06-30',
              status: 'in_progress',
              requiredSkills: ['架构设计', '团队协作'],
            },
            {
              id: '1-3',
              title: '技术分享',
              description: '在团队内进行3次技术分享',
              dueDate: '2025-09-30',
              status: 'pending',
              requiredSkills: ['前端框架', '团队协作'],
            },
            {
              id: '1-4',
              title: '晋升评审准备',
              description: '完成晋升所需的各项准备',
              dueDate: '2025-12-31',
              status: 'pending',
              requiredSkills: ['架构设计', '性能优化', '团队协作'],
            },
          ],
          actionItems: [
            {
              id: '1-1',
              title: '学习系统架构设计',
              description: '完成《系统架构设计》在线课程',
              type: 'training',
              dueDate: '2025-03-31',
              status: 'completed',
              completedDate: '2025-03-28',
              resources: ['《系统架构设计》课程'],
              estimatedHours: 20,
              actualHours: 18,
            },
            {
              id: '1-2',
              title: '设计项目架构',
              description: '负责XX项目的整体架构设计',
              type: 'project',
              dueDate: '2025-06-30',
              status: 'in_progress',
              resources: ['项目文档', '设计工具'],
              estimatedHours: 40,
            },
            {
              id: '1-3',
              title: '学习TypeScript高级特性',
              description: '深入学习TypeScript泛型、装饰器等高级特性',
              type: 'self_study',
              dueDate: '2025-05-31',
              status: 'in_progress',
              resources: ['TypeScript官方文档', '实战项目'],
              estimatedHours: 15,
            },
            {
              id: '1-4',
              title: '技术分享 - 性能优化实践',
              description: '分享前端性能优化的实践经验和技巧',
              type: 'mentoring',
              dueDate: '2025-08-31',
              status: 'pending',
              resources: ['PPT模板', '案例文档'],
              estimatedHours: 8,
            },
          ],
          mentorId: 'MGR001',
          mentorName: '张经理',
          mentorRelationship: '一对一指导',
          overallProgress: 45,
          status: 'active',
          priority: 'high',
          startDate: '2025-01-01',
          nextReviewDate: '2025-06-30',
          lastReviewDate: '2025-03-31',
          reviewFeedback: '小明在架构设计方面有明显进步，建议继续加强技术深度',
          createdAt: '2024-12-01',
          updatedAt: '2025-04-10',
        },
        {
          id: '2',
          employeeId: 'EMP002',
          employeeName: '李小红',
          avatar: '',
          department: '产品部',
          currentPosition: '产品经理',
          managerId: 'MGR002',
          managerName: '李总监',
          targetPosition: '高级产品经理',
          targetDate: '2025-12-31',
          motivation: '希望提升产品战略思维和数据分析能力，承担更大责任',
          currentSkills: [
            { name: '产品规划', currentLevel: 4, targetLevel: 5, gap: 1 },
            { name: '用户研究', currentLevel: 3, targetLevel: 4, gap: 1 },
            { name: '数据分析', currentLevel: 3, targetLevel: 4, gap: 1 },
            { name: '跨部门协作', currentLevel: 4, targetLevel: 5, gap: 1 },
            { name: '战略思维', currentLevel: 2, targetLevel: 4, gap: 2 },
          ],
          requiredSkills: [
            { name: '产品规划', currentLevel: 4, targetLevel: 5, gap: 1 },
            { name: '用户研究', currentLevel: 3, targetLevel: 4, gap: 1 },
            { name: '数据分析', currentLevel: 3, targetLevel: 4, gap: 1 },
            { name: '跨部门协作', currentLevel: 4, targetLevel: 5, gap: 1 },
            { name: '战略思维', currentLevel: 2, targetLevel: 4, gap: 2 },
          ],
          developmentNeeds: [
            '提升数据分析能力',
            '增强战略思维',
            '积累产品管理经验',
          ],
          milestones: [
            {
              id: '2-1',
              title: '完成数据分析培训',
              description: '完成数据分析专项培训课程',
              dueDate: '2025-04-30',
              status: 'in_progress',
              requiredSkills: ['数据分析'],
            },
            {
              id: '2-2',
              title: '主导产品线',
              description: '独立负责一条产品线的规划和管理',
              dueDate: '2025-09-30',
              status: 'pending',
              requiredSkills: ['产品规划', '战略思维'],
            },
          ],
          actionItems: [
            {
              id: '2-1',
              title: '学习数据分析师课程',
              description: '完成数据分析专项课程学习',
              type: 'training',
              dueDate: '2025-04-30',
              status: 'in_progress',
              resources: ['数据分析课程'],
              estimatedHours: 25,
            },
            {
              id: '2-2',
              title: '产品战略规划',
              description: '负责XX产品线的战略规划',
              type: 'project',
              dueDate: '2025-09-30',
              status: 'pending',
              resources: ['战略模板', '市场数据'],
              estimatedHours: 50,
            },
          ],
          mentorId: 'MGR002',
          mentorName: '李总监',
          mentorRelationship: '一对一指导',
          overallProgress: 30,
          status: 'active',
          priority: 'high',
          startDate: '2025-02-01',
          nextReviewDate: '2025-08-31',
          createdAt: '2025-01-15',
          updatedAt: '2025-04-05',
        },
        {
          id: '3',
          employeeId: 'EMP003',
          employeeName: '陈伟',
          avatar: '',
          department: '销售部',
          currentPosition: '销售代表',
          managerId: 'MGR003',
          managerName: '王经理',
          targetPosition: '销售经理',
          targetDate: '2026-06-30',
          motivation: '希望提升销售管理能力，向管理岗位发展',
          currentSkills: [
            { name: '销售技巧', currentLevel: 4, targetLevel: 5, gap: 1 },
            { name: '客户管理', currentLevel: 4, targetLevel: 5, gap: 1 },
            { name: '团队管理', currentLevel: 2, targetLevel: 4, gap: 2 },
            { name: '业绩分析', currentLevel: 3, targetLevel: 4, gap: 1 },
            { name: '战略规划', currentLevel: 2, targetLevel: 3, gap: 1 },
          ],
          requiredSkills: [
            { name: '销售技巧', currentLevel: 4, targetLevel: 5, gap: 1 },
            { name: '客户管理', currentLevel: 4, targetLevel: 5, gap: 1 },
            { name: '团队管理', currentLevel: 2, targetLevel: 4, gap: 2 },
            { name: '业绩分析', currentLevel: 3, targetLevel: 4, gap: 1 },
            { name: '战略规划', currentLevel: 2, targetLevel: 3, gap: 1 },
          ],
          developmentNeeds: [
            '提升团队管理能力',
            '增强业绩分析能力',
            '积累销售管理经验',
          ],
          milestones: [
            {
              id: '3-1',
              title: '完成管理培训',
              description: '完成销售管理专项培训',
              dueDate: '2025-08-31',
              status: 'pending',
              requiredSkills: ['团队管理'],
            },
            {
              id: '3-2',
              title: '临时带团队',
              description: '临时负责一个小型销售团队',
              dueDate: '2026-02-28',
              status: 'pending',
              requiredSkills: ['团队管理', '业绩分析'],
            },
          ],
          actionItems: [
            {
              id: '3-1',
              title: '学习销售管理课程',
              description: '完成销售管理专项课程',
              type: 'training',
              dueDate: '2025-08-31',
              status: 'pending',
              resources: ['管理培训课程'],
              estimatedHours: 20,
            },
            {
              id: '3-2',
              title: '参与团队管理',
              description: '协助经理进行团队管理',
              type: 'project',
              dueDate: '2026-02-28',
              status: 'pending',
              resources: ['管理工具', '团队数据'],
              estimatedHours: 100,
            },
          ],
          overallProgress: 10,
          status: 'active',
          priority: 'medium',
          startDate: '2025-04-01',
          nextReviewDate: '2025-10-31',
          createdAt: '2025-03-20',
          updatedAt: '2025-04-01',
        },
      ];
      
      setPlans(mockPlans);
    } catch (error) {
      console.error('Failed to fetch development plans:', error);
      toast.error('加载员工发展计划数据失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const filteredPlans = useMemo(() => {
    return plans.filter(plan => {
      const matchesSearch = plan.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           plan.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           plan.currentPosition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           plan.targetPosition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
      const matchesDepartment = departmentFilter === 'all' || plan.department === departmentFilter;
      const matchesPriority = priorityFilter === 'all' || plan.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesDepartment && matchesPriority;
    });
  }, [plans, searchTerm, statusFilter, departmentFilter, priorityFilter]);

  const departments = useMemo(() => {
    return Array.from(new Set(plans.map(p => p.department)));
  }, [plans]);

  const getStatusBadge = (status: DevelopmentPlan['status']) => {
    const statusMap = {
      draft: { label: '草稿', color: 'bg-gray-100 text-gray-800' },
      active: { label: '进行中', color: 'bg-blue-100 text-blue-800' },
      completed: { label: '已完成', color: 'bg-green-100 text-green-800' },
      paused: { label: '已暂停', color: 'bg-yellow-100 text-yellow-800' },
    };
    const { label, color } = statusMap[status];
    return <Badge className={color}>{label}</Badge>;
  };

  const getPriorityBadge = (priority: DevelopmentPlan['priority']) => {
    const priorityMap = {
      high: { label: '高优先级', color: 'bg-red-100 text-red-800' },
      medium: { label: '中优先级', color: 'bg-yellow-100 text-yellow-800' },
      low: { label: '低优先级', color: 'bg-green-100 text-green-800' },
    };
    const { label, color } = priorityMap[priority];
    return <Badge className={color}>{label}</Badge>;
  };

  const getMilestoneStatusBadge = (status: Milestone['status']) => {
    const statusMap = {
      pending: { label: '待开始', color: 'bg-gray-100 text-gray-800' },
      in_progress: { label: '进行中', color: 'bg-blue-100 text-blue-800' },
      completed: { label: '已完成', color: 'bg-green-100 text-green-800' },
    };
    const { label, color } = statusMap[status];
    return <Badge className={color}>{label}</Badge>;
  };

  const getActionItemTypeBadge = (type: ActionItem['type']) => {
    const typeMap = {
      training: { label: '培训', color: 'bg-blue-100 text-blue-800' },
      project: { label: '项目', color: 'bg-purple-100 text-purple-800' },
      mentoring: { label: '辅导', color: 'bg-green-100 text-green-800' },
      self_study: { label: '自学', color: 'bg-yellow-100 text-yellow-800' },
      certification: { label: '认证', color: 'bg-red-100 text-red-800' },
    };
    const { label, color } = typeMap[type];
    return <Badge className={color}>{label}</Badge>;
  };

  const stats = useMemo(() => {
    return {
      totalPlans: plans.length,
      activePlans: plans.filter(p => p.status === 'active').length,
      completedPlans: plans.filter(p => p.status === 'completed').length,
      avgProgress: plans.length > 0 
        ? Math.round(plans.reduce((sum, p) => sum + p.overallProgress, 0) / plans.length)
        : 0,
      totalMilestones: plans.reduce((sum, p) => sum + p.milestones.length, 0),
      completedMilestones: plans.reduce((sum, p) => sum + p.milestones.filter(m => m.status === 'completed').length, 0),
      totalActionItems: plans.reduce((sum, p) => sum + p.actionItems.length, 0),
      completedActionItems: plans.reduce((sum, p) => sum + p.actionItems.filter(a => a.status === 'completed').length, 0),
    };
  }, [plans]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">员工发展计划</h1>
          <p className="text-muted-foreground mt-1">
            规划员工职业发展路径，制定个性化培养方案
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchPlans}>
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            创建发展计划
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>计划总数</CardDescription>
            <CardTitle className="text-2xl">{stats.totalPlans}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>进行中</CardDescription>
            <CardTitle className="text-2xl text-blue-600">{stats.activePlans}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>已完成</CardDescription>
            <CardTitle className="text-2xl text-green-600">{stats.completedPlans}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>平均进度</CardDescription>
            <CardTitle className="text-2xl">{stats.avgProgress}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>里程碑</CardDescription>
            <CardTitle className="text-2xl">{stats.completedMilestones}/{stats.totalMilestones}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>行动项</CardDescription>
            <CardTitle className="text-2xl">{stats.completedActionItems}/{stats.totalActionItems}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>高优先级</CardDescription>
            <CardTitle className="text-2xl text-red-600">{plans.filter(p => p.priority === 'high').length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
        <TabsList>
          <TabsTrigger value="plans">发展计划</TabsTrigger>
          <TabsTrigger value="templates">计划模板</TabsTrigger>
          <TabsTrigger value="analytics">统计分析</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>员工发展计划列表</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索员工、职位..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="active">进行中</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                      <SelectItem value="paused">已暂停</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={(v: any) => setPriorityFilter(v)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部优先级</SelectItem>
                      <SelectItem value="high">高优先级</SelectItem>
                      <SelectItem value="medium">中优先级</SelectItem>
                      <SelectItem value="low">低优先级</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={departmentFilter} onValueChange={(v: any) => setDepartmentFilter(v)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部部门</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>员工信息</TableHead>
                    <TableHead>职业路径</TableHead>
                    <TableHead>目标日期</TableHead>
                    <TableHead>进度</TableHead>
                    <TableHead>里程碑</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>优先级</TableHead>
                    <TableHead>导师</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.map((plan) => {
                    const completedMilestones = plan.milestones.filter(m => m.status === 'completed').length;
                    return (
                      <TableRow key={plan.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{plan.employeeName.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{plan.employeeName}</div>
                              <div className="text-sm text-muted-foreground">{plan.currentPosition}</div>
                              <div className="text-xs text-muted-foreground">{plan.department}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium">{plan.currentPosition}</span>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium text-primary">{plan.targetPosition}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {plan.targetDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-32">
                            <Progress value={plan.overallProgress} />
                            <div className="text-xs text-muted-foreground mt-1">
                              {plan.overallProgress}%
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{completedMilestones}/{plan.milestones.length}</div>
                            <div className="text-muted-foreground">里程碑完成</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(plan.status)}</TableCell>
                        <TableCell>{getPriorityBadge(plan.priority)}</TableCell>
                        <TableCell>
                          {plan.mentorName ? (
                            <div className="text-sm">{plan.mentorName}</div>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedPlan(plan)}>
                            <Eye className="h-4 w-4 mr-1" />
                            查看
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>发展计划模板</CardTitle>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  新建模板
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">技术专家路径</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      针对技术岗位的晋升发展模板，注重技术深度和创新能力
                    </p>
                    <Button variant="outline" className="w-full">使用模板</Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <CardTitle className="text-lg">管理岗位路径</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      针对管理岗位的晋升发展模板，注重领导力和团队管理能力
                    </p>
                    <Button variant="outline" className="w-full">使用模板</Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Target className="h-5 w-5 text-green-600" />
                      </div>
                      <CardTitle className="text-lg">销售晋升路径</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      针对销售岗位的晋升发展模板，注重业绩和客户管理能力
                    </p>
                    <Button variant="outline" className="w-full">使用模板</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>计划状态分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['draft', 'active', 'completed', 'paused'].map((status) => {
                    const count = plans.filter(p => p.status === status).length;
                    const percentage = plans.length > 0 ? (count / plans.length) * 100 : 0;
                    const labelMap = {
                      draft: '草稿',
                      active: '进行中',
                      completed: '已完成',
                      paused: '已暂停',
                    };
                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{labelMap[status as keyof typeof labelMap]}</span>
                          <span className="text-sm text-muted-foreground">{count}个计划 ({percentage.toFixed(1)}%)</span>
                        </div>
                        <Progress value={percentage} />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>部门发展计划分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.map((dept) => {
                    const deptPlans = plans.filter(p => p.department === dept);
                    const count = deptPlans.length;
                    const percentage = plans.length > 0 ? (count / plans.length) * 100 : 0;
                    const avgProgress = deptPlans.length > 0 
                      ? Math.round(deptPlans.reduce((sum, p) => sum + p.overallProgress, 0) / deptPlans.length)
                      : 0;
                    return (
                      <div key={dept}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{dept}</span>
                          <span className="text-sm text-muted-foreground">{count}个计划 (平均{avgProgress}%)</span>
                        </div>
                        <Progress value={avgProgress} />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* View Dialog */}
      <Dialog open={!!selectedPlan} onOpenChange={(open) => !open && setSelectedPlan(null)}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          {selectedPlan && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPlan.employeeName} - 发展计划详情</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* 基本信息 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>员工姓名</Label>
                    <div className="mt-1 font-medium">{selectedPlan.employeeName}</div>
                  </div>
                  <div>
                    <Label>部门</Label>
                    <div className="mt-1">{selectedPlan.department}</div>
                  </div>
                  <div>
                    <Label>当前职位</Label>
                    <div className="mt-1">{selectedPlan.currentPosition}</div>
                  </div>
                  <div>
                    <Label>目标职位</Label>
                    <div className="mt-1">{selectedPlan.targetPosition}</div>
                  </div>
                  <div>
                    <Label>直接主管</Label>
                    <div className="mt-1">{selectedPlan.managerName}</div>
                  </div>
                  <div>
                    <Label>导师</Label>
                    <div className="mt-1">{selectedPlan.mentorName || '-'}</div>
                  </div>
                  <div>
                    <Label>目标日期</Label>
                    <div className="mt-1">{selectedPlan.targetDate}</div>
                  </div>
                  <div>
                    <Label>状态</Label>
                    <div className="mt-1">{getStatusBadge(selectedPlan.status)}</div>
                  </div>
                </div>

                {/* 职业路径 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <GitBranch className="h-5 w-5" />
                      职业发展路径
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="text-xl">{selectedPlan.employeeName.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-lg font-bold">{selectedPlan.currentPosition}</div>
                          <div className="text-sm text-muted-foreground">当前职位</div>
                        </div>
                      </div>
                      <ArrowRight className="h-8 w-8 text-muted-foreground" />
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-primary/10 rounded-lg">
                          <Award className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <div className="text-lg font-bold">{selectedPlan.targetPosition}</div>
                          <div className="text-sm text-muted-foreground">目标职位</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>发展动机</Label>
                      <p className="mt-2 text-sm">{selectedPlan.motivation}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* 能力差距分析 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      能力差距分析
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedPlan.currentSkills.map((skill, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{skill.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">当前: {skill.currentLevel}/5</span>
                              <ArrowRight className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-primary">目标: {skill.targetLevel}/5</span>
                              <Badge variant={skill.gap <= 1 ? 'secondary' : 'destructive'}>
                                差距: {skill.gap}
                              </Badge>
                            </div>
                          </div>
                          <Progress value={(skill.currentLevel / skill.targetLevel) * 100} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 里程碑 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Flag className="h-5 w-5" />
                      发展里程碑 ({selectedPlan.milestones.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedPlan.milestones.map((milestone, idx) => (
                        <div key={milestone.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <Flag className="h-4 w-4 text-blue-600" />
                                </div>
                                <h4 className="font-medium">{milestone.title}</h4>
                                {getMilestoneStatusBadge(milestone.status)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>截止: {milestone.dueDate}</span>
                              </div>
                            </div>
                            {milestone.completedDate && (
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground">完成日期</div>
                                <div className="font-medium">{milestone.completedDate}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 行动项 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      行动计划 ({selectedPlan.actionItems.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedPlan.actionItems.map((action, idx) => (
                        <div key={action.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-100 rounded-lg">
                                  <Play className="h-4 w-4 text-green-600" />
                                </div>
                                <h4 className="font-medium">{action.title}</h4>
                                {getActionItemTypeBadge(action.type)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>预计 {action.estimatedHours} 小时</span>
                                </div>
                                {action.completedDate && (
                                  <div className="flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>实际 {action.actualHours} 小时</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-xs text-muted-foreground">截止日期</div>
                              <div className="font-medium">{action.dueDate}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 评估信息 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>上次评估</Label>
                    <div className="mt-1">{selectedPlan.lastReviewDate || '-'}</div>
                  </div>
                  <div>
                    <Label>下次评估</Label>
                    <div className="mt-1">{selectedPlan.nextReviewDate}</div>
                  </div>
                </div>
                
                {selectedPlan.reviewFeedback && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">评估反馈</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{selectedPlan.reviewFeedback}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  编辑计划
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  导出报告
                </Button>
                {selectedPlan.status === 'active' && (
                  <Button variant="secondary">
                    <Pause className="mr-2 h-4 w-4" />
                    暂停计划
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
