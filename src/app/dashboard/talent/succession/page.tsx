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
  AlertTriangle,
  CheckCircle,
  Calendar,
  GraduationCap,
  Award,
  Star,
  Shield,
  Crown,
  Filter,
  Download,
  RefreshCw,
  User,
  Building2,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Clock,
  Heart,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/theme';

interface SuccessionPlan {
  id: string;
  positionId: string;
  positionName: string;
  department: string;
  positionLevel: 'C级' | 'VP级' | '总监级' | '经理级' | '主管级';
  currentHolder?: {
    employeeId: string;
    name: string;
    avatar?: string;
    hireDate: string;
    performanceRating: string;
    tenure: number;
  };
  
  // 继任者信息
  successors: Successor[];
  
  // 计划状态
  status: 'planning' | 'active' | 'completed';
  readinessLevel: 'high' | 'medium' | 'low';
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  
  // 时间计划
  expectedVacancyDate?: string;
  targetTransitionDate?: string;
  
  // 培养计划
  developmentPlan: string[];
  trainingRequired: string[];
  
  // 评估
  lastReviewDate?: string;
  nextReviewDate?: string;
  notes?: string;
  
  createdAt: string;
  updatedAt: string;
}

interface Successor {
  employeeId: string;
  name: string;
  avatar?: string;
  currentPosition: string;
  department: string;
  readiness: 'ready' | '1-2years' | '3-5years' | 'potential';
  readinessScore: number;
  strengths: string[];
  gaps: string[];
  startDate: string;
  priority: number; // 1-3, 1为最高优先级
  
  // 评估数据
  performanceRating: string;
  potentialRating: string;
  engagementScore: number;
  
  // 培养进度
  developmentProgress: number;
  completedTraining: string[];
  pendingTraining: string[];
}

export default function SuccessionPlanningPage() {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<SuccessionPlan[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SuccessionPlan['status']>('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState<'all' | SuccessionPlan['riskLevel']>('all');
  const [activeTab, setActiveTab] = useState<'positions' | 'successors' | 'analytics'>('positions');
  
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SuccessionPlan | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockPlans: SuccessionPlan[] = [
        {
          id: '1',
          positionId: 'POS001',
          positionName: '技术总监',
          department: '技术部',
          positionLevel: 'VP级',
          currentHolder: {
            employeeId: 'EMP001',
            name: '张总',
            avatar: '',
            hireDate: '2018-03-15',
            performanceRating: 'A',
            tenure: 6,
          },
          successors: [
            {
              employeeId: 'EMP002',
              name: '李副总',
              avatar: '',
              currentPosition: '高级技术经理',
              department: '技术部',
              readiness: '1-2years',
              readinessScore: 85,
              strengths: ['技术能力强', '团队管理经验丰富', '战略思维'],
              gaps: ['跨部门协作能力', '商业洞察力'],
              startDate: '2024-01-01',
              priority: 1,
              performanceRating: 'A',
              potentialRating: '高潜',
              engagementScore: 92,
              developmentProgress: 75,
              completedTraining: ['领导力培训', '战略管理课程'],
              pendingTraining: ['商业分析', '财务管理'],
            },
            {
              employeeId: 'EMP003',
              name: '王经理',
              avatar: '',
              currentPosition: '技术经理',
              department: '技术部',
              readiness: '3-5years',
              readinessScore: 65,
              strengths: ['技术深度', '执行力强'],
              gaps: ['管理经验', '战略规划'],
              startDate: '2024-06-01',
              priority: 2,
              performanceRating: 'B+',
              potentialRating: '中潜',
              engagementScore: 85,
              developmentProgress: 40,
              completedTraining: ['基础管理培训'],
              pendingTraining: ['高级管理培训', '团队建设', '战略规划'],
            },
          ],
          status: 'active',
          readinessLevel: 'medium',
          riskLevel: 'medium',
          expectedVacancyDate: '2026-06-01',
          targetTransitionDate: '2026-01-01',
          developmentPlan: [
            '安排跨部门轮岗经验',
            '参与公司战略决策会议',
            '主导重大项目',
            '商业培训',
          ],
          trainingRequired: [
            '高级领导力培训',
            '战略管理课程',
            '商业分析',
            '财务管理',
          ],
          lastReviewDate: '2024-12-15',
          nextReviewDate: '2025-03-15',
          notes: '李副总表现优异，按计划推进培养。王经理需要加强管理经验。',
          createdAt: '2023-12-01',
          updatedAt: '2024-12-20',
        },
        {
          id: '2',
          positionId: 'POS002',
          positionName: '销售总监',
          department: '销售部',
          positionLevel: 'VP级',
          currentHolder: {
            employeeId: 'EMP004',
            name: '刘总',
            avatar: '',
            hireDate: '2019-05-20',
            performanceRating: 'A+',
            tenure: 5,
          },
          successors: [
            {
              employeeId: 'EMP005',
              name: '陈副总',
              avatar: '',
              currentPosition: '销售副总',
              department: '销售部',
              readiness: 'ready',
              readinessScore: 95,
              strengths: ['销售业绩优秀', '团队管理经验', '客户资源丰富'],
              gaps: ['战略规划', '新业务拓展'],
              startDate: '2023-06-01',
              priority: 1,
              performanceRating: 'A+',
              potentialRating: '高潜',
              engagementScore: 95,
              developmentProgress: 90,
              completedTraining: ['战略管理', '新业务拓展'],
              pendingTraining: [],
            },
            {
              employeeId: 'EMP006',
              name: '赵经理',
              avatar: '',
              currentPosition: '区域销售经理',
              department: '销售部',
              readiness: '1-2years',
              readinessScore: 78,
              strengths: ['销售能力强', '市场敏感度高'],
              gaps: ['团队管理', '战略思维'],
              startDate: '2024-01-01',
              priority: 2,
              performanceRating: 'A',
              potentialRating: '高潜',
              engagementScore: 88,
              developmentProgress: 60,
              completedTraining: ['团队管理'],
              pendingTraining: ['战略规划', '领导力提升'],
            },
          ],
          status: 'active',
          readinessLevel: 'high',
          riskLevel: 'low',
          expectedVacancyDate: '2027-05-01',
          targetTransitionDate: '2027-01-01',
          developmentPlan: [
            '陈副总已基本就位，主要提升战略规划能力',
            '赵经理加强团队管理和战略思维',
          ],
          trainingRequired: [],
          lastReviewDate: '2024-12-10',
          nextReviewDate: '2025-06-10',
          notes: '陈副总准备充分，可随时接任。赵经理发展潜力大。',
          createdAt: '2023-06-01',
          updatedAt: '2024-12-15',
        },
        {
          id: '3',
          positionId: 'POS003',
          positionName: '产品总监',
          department: '产品部',
          positionLevel: 'VP级',
          currentHolder: {
            employeeId: 'EMP007',
            name: '周总',
            avatar: '',
            hireDate: '2020-01-10',
            performanceRating: 'A',
            tenure: 4,
          },
          successors: [
            {
              employeeId: 'EMP008',
              name: '吴经理',
              avatar: '',
              currentPosition: '高级产品经理',
              department: '产品部',
              readiness: '3-5years',
              readinessScore: 55,
              strengths: ['产品思维强', '用户体验敏感'],
              gaps: ['团队管理', '商业洞察', '技术理解'],
              startDate: '2024-09-01',
              priority: 1,
              performanceRating: 'B+',
              potentialRating: '中潜',
              engagementScore: 80,
              developmentProgress: 30,
              completedTraining: ['产品管理进阶'],
              pendingTraining: ['团队管理', '商业分析', '技术基础'],
            },
          ],
          status: 'planning',
          readinessLevel: 'low',
          riskLevel: 'high',
          expectedVacancyDate: '2028-01-01',
          targetTransitionDate: '2027-06-01',
          developmentPlan: [
            '需要识别和培养更多候选人',
            '加强内部选拔',
            '考虑外部引进',
          ],
          trainingRequired: [
            '领导力培训',
            '商业分析',
            '项目管理',
          ],
          lastReviewDate: '2024-11-20',
          nextReviewDate: '2025-02-20',
          notes: '继任者准备不足，需要加快人才培养速度',
          createdAt: '2024-09-01',
          updatedAt: '2024-12-10',
        },
        {
          id: '4',
          positionId: 'POS004',
          positionName: '人力资源总监',
          department: '人力资源部',
          positionLevel: 'VP级',
          currentHolder: {
            employeeId: 'EMP009',
            name: '郑总',
            avatar: '',
            hireDate: '2019-08-15',
            performanceRating: 'A+',
            tenure: 5,
          },
          successors: [
            {
              employeeId: 'EMP010',
              name: '孙经理',
              avatar: '',
              currentPosition: '人力资源经理',
              department: '人力资源部',
              readiness: '1-2years',
              readinessScore: 82,
              strengths: ['HR专业知识', '员工关系处理', '薪酬管理'],
              gaps: ['战略HR', '组织发展'],
              startDate: '2024-03-01',
              priority: 1,
              performanceRating: 'A',
              potentialRating: '高潜',
              engagementScore: 90,
              developmentProgress: 70,
              completedTraining: ['组织发展', '战略HR'],
              pendingTraining: ['人才发展', '变革管理'],
            },
            {
              employeeId: 'EMP011',
              name: '李专员',
              avatar: '',
              currentPosition: '人力资源专员',
              department: '人力资源部',
              readiness: '3-5years',
              readinessScore: 60,
              strengths: ['招聘能力', '培训组织'],
              gaps: ['全面HR管理', '战略思维'],
              startDate: '2024-06-01',
              priority: 2,
              performanceRating: 'B',
              potentialRating: '中潜',
              engagementScore: 82,
              developmentProgress: 35,
              completedTraining: ['HR综合培训'],
              pendingTraining: ['HRBP培训', '组织发展', '薪酬设计'],
            },
          ],
          status: 'active',
          readinessLevel: 'medium',
          riskLevel: 'medium',
          expectedVacancyDate: '2026-08-01',
          targetTransitionDate: '2026-01-01',
          developmentPlan: [
            '孙经理已具备较强基础，重点提升战略HR能力',
            '李专员全面发展，多岗位轮岗',
          ],
          trainingRequired: [
            'HRBP培训',
            '人才发展',
            '变革管理',
          ],
          lastReviewDate: '2024-12-05',
          nextReviewDate: '2025-06-05',
          notes: '继任计划执行良好，持续跟踪培养效果',
          createdAt: '2024-01-01',
          updatedAt: '2024-12-15',
        },
      ];
      
      setPlans(mockPlans);
    } catch (error) {
      console.error('Failed to fetch succession plans:', error);
      toast.error('加载继任计划数据失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const filteredPlans = useMemo(() => {
    return plans.filter(plan => {
      const matchesSearch = plan.positionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           plan.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           plan.currentHolder?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
      const matchesDepartment = departmentFilter === 'all' || plan.department === departmentFilter;
      const matchesRisk = riskFilter === 'all' || plan.riskLevel === riskFilter;
      return matchesSearch && matchesStatus && matchesDepartment && matchesRisk;
    });
  }, [plans, searchTerm, statusFilter, departmentFilter, riskFilter]);

  const departments = useMemo(() => {
    return Array.from(new Set(plans.map(p => p.department)));
  }, [plans]);

  const getStatusBadge = (status: SuccessionPlan['status']) => {
    const statusMap = {
      planning: { label: '规划中', color: 'bg-gray-100 text-gray-800' },
      active: { label: '进行中', color: 'bg-blue-100 text-blue-800' },
      completed: { label: '已完成', color: 'bg-green-100 text-green-800' },
    };
    const { label, color } = statusMap[status];
    return <Badge className={color}>{label}</Badge>;
  };

  const getReadinessBadge = (level: SuccessionPlan['readinessLevel']) => {
    const levelMap = {
      high: { label: '高', color: 'bg-green-100 text-green-800' },
      medium: { label: '中', color: 'bg-yellow-100 text-yellow-800' },
      low: { label: '低', color: 'bg-red-100 text-red-800' },
    };
    const { label, color } = levelMap[level];
    return <Badge className={color}>{label}</Badge>;
  };

  const getRiskBadge = (risk: SuccessionPlan['riskLevel']) => {
    const riskMap = {
      critical: { label: '严重', color: 'bg-red-600 text-white' },
      high: { label: '高', color: 'bg-red-100 text-red-800' },
      medium: { label: '中', color: 'bg-yellow-100 text-yellow-800' },
      low: { label: '低', color: 'bg-green-100 text-green-800' },
    };
    const { label, color } = riskMap[risk];
    return <Badge className={color}>{label}</Badge>;
  };

  const getSuccessorReadinessBadge = (readiness: Successor['readiness']) => {
    const readinessMap = {
      ready: { label: '即位', color: 'bg-green-600 text-white' },
      '1-2years': { label: '1-2年', color: 'bg-blue-100 text-blue-800' },
      '3-5years': { label: '3-5年', color: 'bg-yellow-100 text-yellow-800' },
      potential: { label: '潜力', color: 'bg-purple-100 text-purple-800' },
    };
    const { label, color } = readinessMap[readiness];
    return <Badge className={color}>{label}</Badge>;
  };

  const stats = useMemo(() => {
    return {
      totalPlans: plans.length,
      activePlans: plans.filter(p => p.status === 'active').length,
      totalSuccessors: plans.reduce((sum, p) => sum + p.successors.length, 0),
      readySuccessors: plans.reduce((sum, p) => sum + p.successors.filter(s => s.readiness === 'ready').length, 0),
      highRiskPositions: plans.filter(p => p.riskLevel === 'critical' || p.riskLevel === 'high').length,
      avgReadiness: plans.length > 0 
        ? Math.round(plans.reduce((sum, p) => {
            const avg = p.successors.length > 0 
              ? p.successors.reduce((s, succ) => s + succ.readinessScore, 0) / p.successors.length
              : 0;
            return sum + avg;
          }, 0) / plans.length)
        : 0,
    };
  }, [plans]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">继任计划管理</h1>
          <p className="text-muted-foreground mt-1">
            管理关键岗位继任计划，降低人才流失风险，确保业务连续性
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchPlans}>
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            创建继任计划
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>继任计划数</CardDescription>
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
            <CardDescription>继任者总数</CardDescription>
            <CardTitle className="text-2xl">{stats.totalSuccessors}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>即位</CardDescription>
            <CardTitle className="text-2xl text-green-600">{stats.readySuccessors}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>高风险岗位</CardDescription>
            <CardTitle className="text-2xl text-red-600">{stats.highRiskPositions}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>平均就绪度</CardDescription>
            <CardTitle className="text-2xl">{stats.avgReadiness}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
        <TabsList>
          <TabsTrigger value="positions">关键岗位</TabsTrigger>
          <TabsTrigger value="successors">继任者池</TabsTrigger>
          <TabsTrigger value="analytics">分析报告</TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>关键岗位继任计划</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索岗位、部门、现任..."
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
                      <SelectItem value="planning">规划中</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={riskFilter} onValueChange={(v: any) => setRiskFilter(v)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部风险</SelectItem>
                      <SelectItem value="critical">严重</SelectItem>
                      <SelectItem value="high">高</SelectItem>
                      <SelectItem value="medium">中</SelectItem>
                      <SelectItem value="low">低</SelectItem>
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
                    <TableHead>岗位信息</TableHead>
                    <TableHead>现任</TableHead>
                    <TableHead>继任者</TableHead>
                    <TableHead>就绪度</TableHead>
                    <TableHead>风险等级</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>预计交接</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{plan.positionName}</div>
                          <div className="text-sm text-muted-foreground">{plan.department}</div>
                          <Badge variant="outline" className="mt-1">{plan.positionLevel}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {plan.currentHolder && (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{plan.currentHolder.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium">{plan.currentHolder.name}</div>
                              <div className="text-xs text-muted-foreground">{plan.currentHolder.tenure}年工龄</div>
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex -space-x-2">
                          {plan.successors.slice(0, 3).map((successor, idx) => (
                            <Avatar key={successor.employeeId} className="h-8 w-8 border-2 border-background" title={successor.name}>
                              <AvatarFallback className={cn(
                                'text-xs',
                                successor.priority === 1 && 'bg-green-100 text-green-800',
                                successor.priority === 2 && 'bg-blue-100 text-blue-800',
                                successor.priority === 3 && 'bg-gray-100 text-gray-800'
                              )}>
                                {successor.name.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {plan.successors.length > 3 && (
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                              +{plan.successors.length - 3}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getReadinessBadge(plan.readinessLevel)}</TableCell>
                      <TableCell>{getRiskBadge(plan.riskLevel)}</TableCell>
                      <TableCell>{getStatusBadge(plan.status)}</TableCell>
                      <TableCell>
                        {plan.targetTransitionDate ? (
                          <div className="text-sm">
                            {plan.targetTransitionDate}
                          </div>
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="successors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>继任者池</CardTitle>
              <CardDescription>所有列入继任计划的员工信息</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plans.map((plan) => (
                  <div key={plan.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Crown className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{plan.positionName}</h3>
                          <p className="text-sm text-muted-foreground">{plan.department}</p>
                        </div>
                      </div>
                      {getRiskBadge(plan.riskLevel)}
                    </div>
                    
                    <div className="space-y-3">
                      {plan.successors.map((successor, idx) => (
                        <div key={successor.employeeId} className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                          <div className="relative">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback>{successor.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                              {successor.priority}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="font-medium">{successor.name}</div>
                                <div className="text-sm text-muted-foreground">{successor.currentPosition}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getSuccessorReadinessBadge(successor.readiness)}
                                <div className="text-right">
                                  <div className="text-lg font-bold">{successor.readinessScore}%</div>
                                  <div className="text-xs text-muted-foreground">就绪度</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>培养进度</span>
                                <span>{successor.developmentProgress}%</span>
                              </div>
                              <Progress value={successor.developmentProgress} />
                            </div>
                            
                            <div className="mt-3 grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">优势</div>
                                <div className="flex flex-wrap gap-1">
                                  {successor.strengths.slice(0, 3).map((strength, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {strength}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">待提升</div>
                                <div className="flex flex-wrap gap-1">
                                  {successor.gaps.slice(0, 3).map((gap, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {gap}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>风险分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(['critical', 'high', 'medium', 'low'] as const).map((risk) => {
                    const count = plans.filter(p => p.riskLevel === risk).length;
                    const percentage = plans.length > 0 ? (count / plans.length) * 100 : 0;
                    const labelMap = {
                      critical: '严重风险',
                      high: '高风险',
                      medium: '中等风险',
                      low: '低风险',
                    };
                    return (
                      <div key={risk}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{labelMap[risk]}</span>
                          <span className="text-sm text-muted-foreground">{count}个岗位 ({percentage.toFixed(1)}%)</span>
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
                <CardTitle>就绪度分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(['high', 'medium', 'low'] as const).map((level) => {
                    const count = plans.filter(p => p.readinessLevel === level).length;
                    const percentage = plans.length > 0 ? (count / plans.length) * 100 : 0;
                    const labelMap = {
                      high: '高就绪度',
                      medium: '中等就绪度',
                      low: '低就绪度',
                    };
                    return (
                      <div key={level}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{labelMap[level]}</span>
                          <span className="text-sm text-muted-foreground">{count}个岗位 ({percentage.toFixed(1)}%)</span>
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
                <CardTitle>继任者就绪状态</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(['ready', '1-2years', '3-5years', 'potential'] as const).map((readiness) => {
                    const count = plans.reduce((sum, p) => sum + p.successors.filter(s => s.readiness === readiness).length, 0);
                    const total = stats.totalSuccessors;
                    const percentage = total > 0 ? (count / total) * 100 : 0;
                    const labelMap = {
                      ready: '即位',
                      '1-2years': '1-2年',
                      '3-5years': '3-5年',
                      potential: '潜力人才',
                    };
                    return (
                      <div key={readiness}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{labelMap[readiness]}</span>
                          <span className="text-sm text-muted-foreground">{count}人 ({percentage.toFixed(1)}%)</span>
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
                <CardTitle>部门继任覆盖</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.map((dept) => {
                    const deptPlans = plans.filter(p => p.department === dept);
                    const count = deptPlans.length;
                    const percentage = plans.length > 0 ? (count / plans.length) * 100 : 0;
                    return (
                      <div key={dept}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{dept}</span>
                          <span className="text-sm text-muted-foreground">{count}个岗位 ({percentage.toFixed(1)}%)</span>
                        </div>
                        <Progress value={percentage} />
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
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          {selectedPlan && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPlan.positionName} - 继任计划详情</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* 基本信息 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>部门</Label>
                    <div className="mt-1">{selectedPlan.department}</div>
                  </div>
                  <div>
                    <Label>岗位级别</Label>
                    <div className="mt-1">{selectedPlan.positionLevel}</div>
                  </div>
                  <div>
                    <Label>状态</Label>
                    <div className="mt-1">{getStatusBadge(selectedPlan.status)}</div>
                  </div>
                  <div>
                    <Label>风险等级</Label>
                    <div className="mt-1">{getRiskBadge(selectedPlan.riskLevel)}</div>
                  </div>
                </div>

                {/* 现任者信息 */}
                {selectedPlan.currentHolder && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">现任者</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="text-xl">{selectedPlan.currentHolder.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-xl font-bold">{selectedPlan.currentHolder.name}</div>
                          <div className="text-sm text-muted-foreground">
                            入职时间: {selectedPlan.currentHolder.hireDate}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            工龄: {selectedPlan.currentHolder.tenure}年
                          </div>
                          <div className="mt-2">
                            <Badge>绩效: {selectedPlan.currentHolder.performanceRating}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 时间计划 */}
                {selectedPlan.expectedVacancyDate && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">时间计划</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>预计空缺日期</Label>
                          <div className="mt-1">{selectedPlan.expectedVacancyDate}</div>
                        </div>
                        <div>
                          <Label>目标交接日期</Label>
                          <div className="mt-1">{selectedPlan.targetTransitionDate}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 继任者信息 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">继任者 ({selectedPlan.successors.length}人)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedPlan.successors.map((successor, idx) => (
                        <div key={successor.employeeId} className="p-4 border rounded-lg">
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <Avatar className="h-14 w-14">
                                <AvatarFallback className="text-lg">{successor.name.slice(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                                {successor.priority}
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="text-lg font-bold">{successor.name}</div>
                                  <div className="text-sm text-muted-foreground">{successor.currentPosition}</div>
                                  <div className="text-sm text-muted-foreground">{successor.department}</div>
                                </div>
                                {getSuccessorReadinessBadge(successor.readiness)}
                              </div>
                              
                              <div className="mt-3 grid grid-cols-4 gap-4">
                                <div>
                                  <Label className="text-xs">就绪度</Label>
                                  <div className="text-lg font-bold">{successor.readinessScore}%</div>
                                </div>
                                <div>
                                  <Label className="text-xs">绩效</Label>
                                  <div className="font-medium">{successor.performanceRating}</div>
                                </div>
                                <div>
                                  <Label className="text-xs">潜力</Label>
                                  <div className="font-medium">{successor.potentialRating}</div>
                                </div>
                                <div>
                                  <Label className="text-xs">敬业度</Label>
                                  <div className="font-medium">{successor.engagementScore}%</div>
                                </div>
                              </div>
                              
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span>培养进度</span>
                                  <span>{successor.developmentProgress}%</span>
                                </div>
                                <Progress value={successor.developmentProgress} />
                              </div>
                              
                              <div className="mt-3 grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm">优势</Label>
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {successor.strengths.map((strength, i) => (
                                      <Badge key={i} variant="outline" className="text-xs">
                                        {strength}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm">待提升</Label>
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {successor.gaps.map((gap, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs">
                                        {gap}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 培养计划 */}
                {selectedPlan.developmentPlan.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">培养计划</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedPlan.developmentPlan.map((plan, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                            <span>{plan}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* 备注 */}
                {selectedPlan.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">备注</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{selectedPlan.notes}</p>
                    </CardContent>
                  </Card>
                )}

                {/* 审核信息 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>上次审核</Label>
                    <div className="mt-1">{selectedPlan.lastReviewDate || '-'}</div>
                  </div>
                  <div>
                    <Label>下次审核</Label>
                    <div className="mt-1">{selectedPlan.nextReviewDate || '-'}</div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  编辑计划
                </Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  导出报告
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
