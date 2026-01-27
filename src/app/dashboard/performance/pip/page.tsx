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
import { Skeleton } from '@/components/ui/skeleton';
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
import { ScrollArea } from '@/components/ui/scroll-area';
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
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  RefreshCw,
  Target,
  User,
  Building2,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/theme';

interface PIPTask {
  id: string;
  title: string;
  description: string;
  category: 'performance' | 'behavior' | 'skill' | 'other';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  completedDate?: string;
  evidence?: string;
  feedback?: string;
}

interface PIP {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  avatar?: string;
  
  // PIP基本信息
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'completed' | 'terminated' | 'extended';
  progress: number;
  
  // 问题说明
  issueDescription: string;
  expectedStandards: string;
  performanceGap: string;
  
  // 改进任务
  tasks: PIPTask[];
  
  // 支持措施
  supportMeasures: string[];
  resourcesNeeded: string[];
  
  // 评估
  midReviewDate?: string;
  midReviewScore?: number;
  midReviewComment?: string;
  finalReviewDate?: string;
  finalReviewScore?: number;
  finalReviewComment?: string;
  
  // 结果
  result?: 'pass' | 'fail' | 'pending';
  resultReason?: string;
  
  // 审批
  managerId: string;
  managerName: string;
  hrId?: string;
  hrName?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function PIPManagementPage() {
  const [loading, setLoading] = useState(true);
  const [pips, setPips] = useState<PIP[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PIP['status']>('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'list' | 'templates' | 'statistics'>('list');
  
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedPIP, setSelectedPIP] = useState<PIP | null>(null);

  const fetchPIPs = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockPIPs: PIP[] = [
        {
          id: '1',
          employeeId: 'EMP001',
          employeeName: '王小明',
          department: '技术部',
          position: '前端开发工程师',
          startDate: '2025-03-01',
          endDate: '2025-05-31',
          status: 'active',
          progress: 65,
          issueDescription: '近期代码质量下降，提交的代码bug率较高，多次影响线上系统稳定性',
          expectedStandards: '代码bug率低于2%，按时完成开发任务，代码审查通过率达到90%',
          performanceGap: '当前代码bug率为8%，代码审查通过率为65%，未能按时完成开发任务',
          tasks: [
            {
              id: '1-1',
              title: '提升代码质量',
              description: '每周代码bug率降低至5%以下',
              category: 'performance',
              priority: 'high',
              dueDate: '2025-03-31',
              status: 'completed',
              completedDate: '2025-03-30',
              evidence: '3月bug率降至4.5%',
              feedback: '表现良好，继续保持',
            },
            {
              id: '1-2',
              title: '按时完成任务',
              description: '按时完成所有分配的开发任务',
              category: 'performance',
              priority: 'high',
              dueDate: '2025-04-30',
              status: 'in_progress',
            },
            {
              id: '1-3',
              title: '代码审查通过率',
              description: '代码审查通过率提升至80%',
              category: 'performance',
              priority: 'medium',
              dueDate: '2025-05-15',
              status: 'pending',
            },
          ],
          supportMeasures: [
            '安排资深工程师进行代码指导',
            '每周代码审查会议',
            '提供代码质量培训',
          ],
          resourcesNeeded: [
            '代码审查工具授权',
            '技术文档访问权限',
          ],
          midReviewDate: '2025-04-15',
          midReviewScore: 75,
          midReviewComment: '中期评估良好，代码质量有明显提升，但按时完成任务方面仍有改进空间',
          managerId: 'MGR001',
          managerName: '张经理',
          hrId: 'HR001',
          hrName: '李HR',
          approvedAt: '2025-02-28',
          createdAt: '2025-02-25',
          updatedAt: '2025-04-16',
        },
        {
          id: '2',
          employeeId: 'EMP002',
          employeeName: '李小红',
          department: '产品部',
          position: '产品经理',
          startDate: '2025-02-01',
          endDate: '2025-04-30',
          status: 'completed',
          progress: 100,
          issueDescription: '需求文档质量不高，与开发团队沟通不畅，导致项目延期',
          expectedStandards: '需求文档清晰完整，有效沟通协调，项目按时交付',
          performanceGap: '需求文档不完整，经常需要返工，沟通效率低，项目延期率达30%',
          tasks: [
            {
              id: '2-1',
              title: '提升需求文档质量',
              description: '按照标准模板编写需求文档，确保信息完整清晰',
              category: 'performance',
              priority: 'high',
              dueDate: '2025-03-15',
              status: 'completed',
              completedDate: '2025-03-14',
              evidence: '3月需求文档评审通过率100%',
              feedback: '文档质量显著提升',
            },
            {
              id: '2-2',
              title: '改善沟通协调',
              description: '建立有效的沟通机制，提升与开发团队的协作效率',
              category: 'behavior',
              priority: 'high',
              dueDate: '2025-04-15',
              status: 'completed',
              completedDate: '2025-04-14',
              evidence: '沟通会议时间缩短40%',
              feedback: '沟通能力有较大提升',
            },
          ],
          supportMeasures: [
            '安排资深产品经理指导',
            '提供沟通技巧培训',
            '参与项目管理培训',
          ],
          resourcesNeeded: [
            '项目管理工具授权',
            '需求管理工具升级',
          ],
          midReviewDate: '2025-03-15',
          midReviewScore: 70,
          midReviewComment: '中期评估一般，文档质量有所提升，但沟通能力仍需加强',
          finalReviewDate: '2025-04-28',
          finalReviewScore: 85,
          finalReviewComment: '最终评估良好，各项指标均达到要求，建议终止PIP',
          result: 'pass',
          resultReason: '员工在PIP期间表现良好，各项指标均达到预期标准',
          managerId: 'MGR002',
          managerName: '李总监',
          hrId: 'HR001',
          hrName: '李HR',
          approvedAt: '2025-01-30',
          createdAt: '2025-01-25',
          updatedAt: '2025-04-29',
        },
        {
          id: '3',
          employeeId: 'EMP003',
          employeeName: '陈伟',
          department: '销售部',
          position: '销售代表',
          startDate: '2025-03-15',
          endDate: '2025-06-15',
          status: 'active',
          progress: 30,
          issueDescription: '销售业绩持续不达标，客户开发能力不足，客户满意度低',
          expectedStandards: '月度销售目标完成率80%以上，新客户开发数量达标，客户满意度85分以上',
          performanceGap: '月度销售目标完成率仅45%，新客户开发数量不足，客户满意度72分',
          tasks: [
            {
              id: '3-1',
              title: '提升销售业绩',
              description: '月度销售目标完成率达到80%',
              category: 'performance',
              priority: 'high',
              dueDate: '2025-04-30',
              status: 'in_progress',
            },
            {
              id: '3-2',
              title: '开发新客户',
              description: '每月开发5个新客户',
              category: 'performance',
              priority: 'high',
              dueDate: '2025-06-15',
              status: 'pending',
            },
            {
              id: '3-3',
              title: '提升客户满意度',
              description: '客户满意度达到85分以上',
              category: 'performance',
              priority: 'medium',
              dueDate: '2025-06-15',
              status: 'pending',
            },
          ],
          supportMeasures: [
            '安排销售冠军一对一指导',
            '提供销售技巧培训',
            '参加客户关系管理培训',
          ],
          resourcesNeeded: [
            '客户管理工具授权',
            '销售培训预算',
          ],
          managerId: 'MGR003',
          managerName: '王经理',
          hrId: 'HR001',
          hrName: '李HR',
          approvedAt: '2025-03-10',
          createdAt: '2025-03-05',
          updatedAt: '2025-04-20',
        },
      ];
      
      setPips(mockPIPs);
    } catch (error) {
      console.error('Failed to fetch PIPs:', error);
      toast.error('加载绩效改进计划数据失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPIPs();
  }, [fetchPIPs]);

  const filteredPIPs = useMemo(() => {
    return pips.filter(pip => {
      const matchesSearch = pip.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pip.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pip.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || pip.status === statusFilter;
      const matchesDepartment = departmentFilter === 'all' || pip.department === departmentFilter;
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [pips, searchTerm, statusFilter, departmentFilter]);

  const departments = useMemo(() => {
    return Array.from(new Set(pips.map(p => p.department)));
  }, [pips]);

  const getStatusBadge = (status: PIP['status']) => {
    const statusMap = {
      draft: { label: '草稿', color: 'bg-gray-100 text-gray-800' },
      active: { label: '进行中', color: 'bg-blue-100 text-blue-800' },
      completed: { label: '已完成', color: 'bg-green-100 text-green-800' },
      terminated: { label: '已终止', color: 'bg-red-100 text-red-800' },
      extended: { label: '已延长', color: 'bg-orange-100 text-orange-800' },
    };
    const { label, color } = statusMap[status];
    return <Badge className={color}>{label}</Badge>;
  };

  const getResultBadge = (result?: PIP['result']) => {
    if (!result) return <Badge variant="outline">待评估</Badge>;
    
    const resultMap = {
      pass: { label: '通过', color: 'bg-green-100 text-green-800' },
      fail: { label: '未通过', color: 'bg-red-100 text-red-800' },
      pending: { label: '待定', color: 'bg-yellow-100 text-yellow-800' },
    };
    const { label, color } = resultMap[result];
    return <Badge className={color}>{label}</Badge>;
  };

  const stats = useMemo(() => {
    return {
      total: pips.length,
      active: pips.filter(p => p.status === 'active').length,
      completed: pips.filter(p => p.status === 'completed').length,
      pass: pips.filter(p => p.result === 'pass').length,
      passRate: pips.filter(p => p.result !== undefined).length > 0 
        ? Math.round((pips.filter(p => p.result === 'pass').length / pips.filter(p => p.result !== undefined).length) * 100)
        : 0,
      avgDuration: pips.length > 0 
        ? Math.round(pips.reduce((sum, p) => {
            const start = new Date(p.startDate);
            const end = new Date(p.endDate);
            const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            return sum + days;
          }, 0) / pips.length)
        : 0,
    };
  }, [pips]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">绩效改进计划（PIP）</h1>
          <p className="text-muted-foreground mt-1">
            管理员工绩效改进计划，帮助员工提升绩效
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchPIPs}>
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            创建PIP
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>总计划数</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>进行中</CardDescription>
            <CardTitle className="text-2xl text-blue-600">{stats.active}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>已完成</CardDescription>
            <CardTitle className="text-2xl text-green-600">{stats.completed}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>通过率</CardDescription>
            <CardTitle className="text-2xl">{stats.passRate}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>平均周期</CardDescription>
            <CardTitle className="text-2xl">{stats.avgDuration}天</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
        <TabsList>
          <TabsTrigger value="list">PIP列表</TabsTrigger>
          <TabsTrigger value="templates">PIP模板</TabsTrigger>
          <TabsTrigger value="statistics">统计分析</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>绩效改进计划列表</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索员工姓名、职位..."
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
                      <SelectItem value="draft">草稿</SelectItem>
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
                    <TableHead>部门/职位</TableHead>
                    <TableHead>PIP周期</TableHead>
                    <TableHead>进度</TableHead>
                    <TableHead>任务完成</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>结果</TableHead>
                    <TableHead>评估人</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPIPs.map((pip) => {
                    const completedTasks = pip.tasks.filter(t => t.status === 'completed').length;
                    return (
                      <TableRow key={pip.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{pip.employeeName.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{pip.employeeName}</div>
                              <div className="text-sm text-muted-foreground">{pip.employeeId}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{pip.position}</div>
                            <div className="text-sm text-muted-foreground">{pip.department}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {pip.startDate} ~ {pip.endDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-24">
                            <Progress value={pip.progress} />
                            <div className="text-xs text-muted-foreground mt-1">
                              {pip.progress}%
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{completedTasks}/{pip.tasks.length}</div>
                            <div className="text-muted-foreground">任务完成</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(pip.status)}</TableCell>
                        <TableCell>{getResultBadge(pip.result)}</TableCell>
                        <TableCell>{pip.managerName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedPIP(pip)}>
                              <Eye className="h-4 w-4 mr-1" />
                              查看
                            </Button>
                            {pip.status === 'active' ? (
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                更新
                              </Button>
                            ) : null}
                          </div>
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
                <CardTitle>PIP模板</CardTitle>
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
                        <Target className="h-5 w-5 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">绩效不达标</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      针对工作绩效不达标的员工，制定具体的改进计划和目标
                    </p>
                    <Button variant="outline" className="w-full">使用模板</Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                      </div>
                      <CardTitle className="text-lg">行为问题</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      针对工作态度、团队协作等行为问题的员工进行改进指导
                    </p>
                    <Button variant="outline" className="w-full">使用模板</Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Zap className="h-5 w-5 text-purple-600" />
                      </div>
                      <CardTitle className="text-lg">技能提升</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      针对专业技能不足的员工，制定培训和能力提升计划
                    </p>
                    <Button variant="outline" className="w-full">使用模板</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>PIP结果分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['pass', 'fail', 'pending'].map((result) => {
                    const count = pips.filter(p => p.result === result).length;
                    const total = pips.filter(p => p.result !== undefined).length;
                    const percentage = total > 0 ? (count / total) * 100 : 0;
                    const labelMap = {
                      pass: '通过',
                      fail: '未通过',
                      pending: '待定',
                    };
                    return (
                      <div key={result}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{labelMap[result as keyof typeof labelMap]}</span>
                          <span className="text-sm text-muted-foreground">{count}个 ({percentage.toFixed(1)}%)</span>
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
                <CardTitle>部门PIP分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.map((dept) => {
                    const count = pips.filter(p => p.department === dept).length;
                    const percentage = pips.length > 0 ? (count / pips.length) * 100 : 0;
                    return (
                      <div key={dept}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{dept}</span>
                          <span className="text-sm text-muted-foreground">{count}个 ({percentage.toFixed(1)}%)</span>
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
      <Dialog open={!!selectedPIP} onOpenChange={(open) => !open && setSelectedPIP(null)}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          {selectedPIP && (
            <>
              <DialogHeader>
                <DialogTitle>绩效改进计划详情</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* 基本信息 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>员工姓名</Label>
                    <div className="mt-1 font-medium">{selectedPIP.employeeName}</div>
                  </div>
                  <div>
                    <Label>员工编号</Label>
                    <div className="mt-1 font-mono">{selectedPIP.employeeId}</div>
                  </div>
                  <div>
                    <Label>部门</Label>
                    <div className="mt-1">{selectedPIP.department}</div>
                  </div>
                  <div>
                    <Label>职位</Label>
                    <div className="mt-1">{selectedPIP.position}</div>
                  </div>
                  <div>
                    <Label>PIP周期</Label>
                    <div className="mt-1">{selectedPIP.startDate} ~ {selectedPIP.endDate}</div>
                  </div>
                  <div>
                    <Label>状态</Label>
                    <div className="mt-1">{getStatusBadge(selectedPIP.status)}</div>
                  </div>
                  <div>
                    <Label>进度</Label>
                    <div className="mt-1">{selectedPIP.progress}%</div>
                  </div>
                  <div>
                    <Label>评估人</Label>
                    <div className="mt-1">{selectedPIP.managerName}</div>
                  </div>
                </div>

                {/* 问题说明 */}
                <div>
                  <Label className="text-base font-semibold">问题说明</Label>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>问题描述</Label>
                      <p className="mt-1 p-3 bg-muted rounded-lg text-sm">{selectedPIP.issueDescription}</p>
                    </div>
                    <div>
                      <Label>期望标准</Label>
                      <p className="mt-1 p-3 bg-muted rounded-lg text-sm">{selectedPIP.expectedStandards}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Label>绩效差距</Label>
                    <p className="mt-1 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm">
                      {selectedPIP.performanceGap}
                    </p>
                  </div>
                </div>

                {/* 改进任务 */}
                <div>
                  <Label className="text-base font-semibold">改进任务 ({selectedPIP.tasks.filter(t => t.status === 'completed').length}/{selectedPIP.tasks.length})</Label>
                  <div className="mt-3 space-y-3">
                    {selectedPIP.tasks.map((task) => (
                      <div key={task.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant={task.status === 'completed' ? 'default' : 'outline'}>
                                {task.status === 'completed' ? '已完成' : task.status === 'in_progress' ? '进行中' : '待开始'}
                              </Badge>
                              <h4 className="font-medium">{task.title}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                            {task.evidence && (
                              <div className="text-sm p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <span className="font-medium">完成证明：</span>{task.evidence}
                              </div>
                            )}
                            {task.feedback && (
                              <div className="text-sm p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg mt-2">
                                <span className="font-medium">反馈：</span>{task.feedback}
                              </div>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-sm text-muted-foreground">截止日期</div>
                            <div className="font-medium">{task.dueDate}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 支持措施 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>支持措施</Label>
                    <ul className="mt-2 space-y-2">
                      {selectedPIP.supportMeasures.map((measure, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                          <span>{measure}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <Label>所需资源</Label>
                    <ul className="mt-2 space-y-2">
                      {selectedPIP.resourcesNeeded.map((resource, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Zap className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                          <span>{resource}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 评估结果 */}
                {selectedPIP.midReviewScore && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">中期评估</div>
                      <div className="text-2xl font-bold mt-1">{selectedPIP.midReviewScore}分</div>
                      {selectedPIP.midReviewComment && (
                        <p className="text-sm mt-2">{selectedPIP.midReviewComment}</p>
                      )}
                    </div>
                    {selectedPIP.finalReviewScore && (
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">最终评估</div>
                        <div className="text-2xl font-bold mt-1">{selectedPIP.finalReviewScore}分</div>
                        {selectedPIP.finalReviewComment && (
                          <p className="text-sm mt-2">{selectedPIP.finalReviewComment}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 结果 */}
                {selectedPIP.result && (
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>评估结果</Label>
                        <div className="mt-1">{getResultBadge(selectedPIP.result)}</div>
                      </div>
                      {selectedPIP.resultReason && (
                        <div className="text-sm text-right">
                          <span className="text-muted-foreground">原因：</span>
                          {selectedPIP.resultReason}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
