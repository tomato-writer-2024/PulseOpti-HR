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
  Star,
  User,
  Building2,
  Target,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/theme';

interface ProbationAssessment {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  avatar?: string;
  startDate: string;
  endDate: string;
  assessmentDate: string;
  status: 'pending' | 'ongoing' | 'completed' | 'extended' | 'terminated';
  progress: number;
  daysLeft: number;
  
  // 评估指标
  workQuality: number;      // 工作质量
  workEfficiency: number;   // 工作效率
  teamCollaboration: number;// 团队协作
  learningAbility: number;  // 学习能力
  attitude: number;         // 工作态度
  
  totalScore: number;
  scoreLevel: 'S' | 'A' | 'B' | 'C' | 'D';
  
  // 评估结果
  result: 'pass' | 'extend' | 'fail' | 'pending';
  resultComment: string;
  improvementItems: string[];
  strengths: string[];
  
  assessor: string;
  assessorId: string;
  approvedBy?: string;
  approvedAt?: string;
}

interface ProbationAssessmentCriteria {
  id: string;
  category: string;
  criteria: string;
  weight: number;
  maxScore: number;
  description: string;
}

export default function ProbationManagementPage() {
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<ProbationAssessment[]>([]);
  const [criteria, setCriteria] = useState<ProbationAssessmentCriteria[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProbationAssessment['status']>('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState<'all' | ProbationAssessment['result']>('all');
  const [activeTab, setActiveTab] = useState<'list' | 'assess' | 'criteria' | 'statistics'>('list');
  
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [assessDialogOpen, setAssessDialogOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<ProbationAssessment | null>(null);

  const fetchAssessments = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockAssessments: ProbationAssessment[] = [
        {
          id: '1',
          employeeId: 'EMP001',
          employeeName: '王小明',
          department: '技术部',
          position: '前端开发工程师',
          startDate: '2025-01-15',
          endDate: '2025-04-15',
          assessmentDate: '2025-04-10',
          status: 'ongoing',
          progress: 75,
          daysLeft: 5,
          workQuality: 85,
          workEfficiency: 90,
          teamCollaboration: 88,
          learningAbility: 92,
          attitude: 87,
          totalScore: 88.4,
          scoreLevel: 'A',
          result: 'pending',
          resultComment: '',
          improvementItems: [],
          strengths: ['学习能力强', '工作态度积极'],
          assessor: '张经理',
          assessorId: 'MGR001',
        },
        {
          id: '2',
          employeeId: 'EMP002',
          employeeName: '李小红',
          department: '产品部',
          position: '产品经理',
          startDate: '2025-02-01',
          endDate: '2025-05-01',
          assessmentDate: '2025-04-25',
          status: 'pending',
          progress: 50,
          daysLeft: 20,
          workQuality: 80,
          workEfficiency: 85,
          teamCollaboration: 82,
          learningAbility: 78,
          attitude: 90,
          totalScore: 83.0,
          scoreLevel: 'B',
          result: 'pending',
          resultComment: '',
          improvementItems: [],
          strengths: ['沟通能力强'],
          assessor: '李总监',
          assessorId: 'MGR002',
        },
        {
          id: '3',
          employeeId: 'EMP003',
          employeeName: '陈伟',
          department: '销售部',
          position: '销售代表',
          startDate: '2024-12-01',
          endDate: '2025-03-01',
          assessmentDate: '2025-02-25',
          status: 'completed',
          progress: 100,
          daysLeft: 0,
          workQuality: 92,
          workEfficiency: 95,
          teamCollaboration: 90,
          learningAbility: 88,
          attitude: 94,
          totalScore: 91.8,
          scoreLevel: 'A',
          result: 'pass',
          resultComment: '工作表现优秀，能够快速适应岗位要求，建议按期转正',
          improvementItems: ['加强市场调研能力'],
          strengths: ['销售能力强', '客户关系维护好', '学习能力强'],
          assessor: '王经理',
          assessorId: 'MGR003',
          approvedBy: '张总监',
          approvedAt: '2025-02-28',
        },
        {
          id: '4',
          employeeId: 'EMP004',
          employeeName: '赵丽',
          department: '技术部',
          position: '后端开发工程师',
          startDate: '2025-01-01',
          endDate: '2025-04-01',
          assessmentDate: '2025-03-25',
          status: 'extended',
          progress: 100,
          daysLeft: 0,
          workQuality: 70,
          workEfficiency: 72,
          teamCollaboration: 68,
          learningAbility: 65,
          attitude: 75,
          totalScore: 70.0,
          scoreLevel: 'C',
          result: 'extend',
          resultComment: '技术能力有待提升，建议延长试用期1-2个月，重点培养后端开发能力',
          improvementItems: ['提升数据库设计能力', '优化代码性能'],
          strengths: ['工作认真负责'],
          assessor: '张经理',
          assessorId: 'MGR001',
          approvedBy: '李CTO',
          approvedAt: '2025-03-28',
        },
      ];
      
      setAssessments(mockAssessments);
      
      const mockCriteria: ProbationAssessmentCriteria[] = [
        {
          id: '1',
          category: '工作能力',
          criteria: '工作质量',
          weight: 30,
          maxScore: 100,
          description: '工作成果的质量、准确性和完整性',
        },
        {
          id: '2',
          category: '工作能力',
          criteria: '工作效率',
          weight: 25,
          maxScore: 100,
          description: '完成任务的速度和效率',
        },
        {
          id: '3',
          category: '团队协作',
          criteria: '团队协作',
          weight: 20,
          maxScore: 100,
          description: '与团队成员的合作能力和沟通能力',
        },
        {
          id: '4',
          category: '个人发展',
          criteria: '学习能力',
          weight: 15,
          maxScore: 100,
          description: '学习新知识和新技能的能力',
        },
        {
          id: '5',
          category: '职业素养',
          criteria: '工作态度',
          weight: 10,
          maxScore: 100,
          description: '工作的积极性、责任心和主动性',
        },
      ];
      
      setCriteria(mockCriteria);
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
      toast.error('加载试用期评估数据失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  const filteredAssessments = useMemo(() => {
    return assessments.filter(assessment => {
      const matchesSearch = assessment.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assessment.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assessment.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || assessment.status === statusFilter;
      const matchesDepartment = departmentFilter === 'all' || assessment.department === departmentFilter;
      const matchesResult = resultFilter === 'all' || assessment.result === resultFilter;
      return matchesSearch && matchesStatus && matchesDepartment && matchesResult;
    });
  }, [assessments, searchTerm, statusFilter, departmentFilter, resultFilter]);

  const departments = useMemo(() => {
    return Array.from(new Set(assessments.map(a => a.department)));
  }, [assessments]);

  const getStatusBadge = (status: ProbationAssessment['status']) => {
    const statusMap = {
      pending: { label: '待评估', color: 'bg-yellow-100 text-yellow-800' },
      ongoing: { label: '评估中', color: 'bg-blue-100 text-blue-800' },
      completed: { label: '已完成', color: 'bg-green-100 text-green-800' },
      extended: { label: '已延长', color: 'bg-orange-100 text-orange-800' },
      terminated: { label: '已终止', color: 'bg-red-100 text-red-800' },
    };
    const { label, color } = statusMap[status];
    return <Badge className={color}>{label}</Badge>;
  };

  const getResultBadge = (result: ProbationAssessment['result']) => {
    if (result === 'pending') return <Badge variant="outline">待定</Badge>;
    
    const resultMap = {
      pass: { label: '通过', color: 'bg-green-100 text-green-800' },
      extend: { label: '延长', color: 'bg-orange-100 text-orange-800' },
      fail: { label: '不合格', color: 'bg-red-100 text-red-800' },
    };
    const { label, color } = resultMap[result];
    return <Badge className={color}>{label}</Badge>;
  };

  const getScoreLevelBadge = (level: string) => {
    const levelMap = {
      S: { label: 'S-卓越', color: 'bg-amber-100 text-amber-800' },
      A: { label: 'A-优秀', color: 'bg-green-100 text-green-800' },
      B: { label: 'B-良好', color: 'bg-blue-100 text-blue-800' },
      C: { label: 'C-合格', color: 'bg-yellow-100 text-yellow-800' },
      D: { label: 'D-不合格', color: 'bg-red-100 text-red-800' },
    };
    const config = levelMap[level as keyof typeof levelMap] || levelMap.B;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const stats = useMemo(() => {
    return {
      total: assessments.length,
      pending: assessments.filter(a => a.status === 'pending').length,
      ongoing: assessments.filter(a => a.status === 'ongoing').length,
      completed: assessments.filter(a => a.status === 'completed').length,
      pass: assessments.filter(a => a.result === 'pass').length,
      passRate: assessments.length > 0 
        ? Math.round((assessments.filter(a => a.result === 'pass').length / assessments.length) * 100)
        : 0,
      avgScore: assessments.length > 0
        ? Math.round(assessments.reduce((sum, a) => sum + a.totalScore, 0) / assessments.length)
        : 0,
    };
  }, [assessments]);

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
          <h1 className="text-3xl font-bold tracking-tight">试用期管理</h1>
          <p className="text-muted-foreground mt-1">
            管理新员工试用期评估，确保人才质量
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchAssessments}>
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            创建评估
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>总评估数</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>待评估</CardDescription>
            <CardTitle className="text-2xl text-yellow-600">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>评估中</CardDescription>
            <CardTitle className="text-2xl text-blue-600">{stats.ongoing}</CardTitle>
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
            <CardDescription>平均得分</CardDescription>
            <CardTitle className="text-2xl">{stats.avgScore}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
        <TabsList>
          <TabsTrigger value="list">评估列表</TabsTrigger>
          <TabsTrigger value="criteria">评估标准</TabsTrigger>
          <TabsTrigger value="statistics">统计分析</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>试用期评估列表</CardTitle>
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
                      <SelectItem value="pending">待评估</SelectItem>
                      <SelectItem value="ongoing">评估中</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                      <SelectItem value="extended">已延长</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={resultFilter} onValueChange={(v: any) => setResultFilter(v)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部结果</SelectItem>
                      <SelectItem value="pending">待定</SelectItem>
                      <SelectItem value="pass">通过</SelectItem>
                      <SelectItem value="extend">延长</SelectItem>
                      <SelectItem value="fail">不合格</SelectItem>
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
                    <TableHead>试用期</TableHead>
                    <TableHead>评估进度</TableHead>
                    <TableHead>评估得分</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>评估结果</TableHead>
                    <TableHead>评估人</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{assessment.employeeName.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{assessment.employeeName}</div>
                            <div className="text-sm text-muted-foreground">{assessment.employeeId}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{assessment.position}</div>
                          <div className="text-sm text-muted-foreground">{assessment.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div>{assessment.startDate} ~ {assessment.endDate}</div>
                            {assessment.daysLeft > 0 && (
                              <div className="text-muted-foreground">剩余 {assessment.daysLeft} 天</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-32">
                          <Progress value={assessment.progress} />
                          <div className="text-xs text-muted-foreground mt-1">
                            {assessment.progress}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-lg font-bold">{assessment.totalScore.toFixed(1)}</div>
                          {getScoreLevelBadge(assessment.scoreLevel)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(assessment.status)}</TableCell>
                      <TableCell>{getResultBadge(assessment.result)}</TableCell>
                      <TableCell>{assessment.assessor}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedAssessment(assessment)}>
                            <Eye className="h-4 w-4 mr-1" />
                            查看
                          </Button>
                          {assessment.status === 'pending' || assessment.status === 'ongoing' ? (
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              评估
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="criteria" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>试用期评估标准</CardTitle>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  编辑标准
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criteria.map((criterion) => (
                  <div key={criterion.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge>{criterion.category}</Badge>
                        <h3 className="font-medium">{criterion.criteria}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{criterion.description}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">权重</div>
                        <div className="text-lg font-bold">{criterion.weight}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">满分</div>
                        <div className="text-lg font-bold">{criterion.maxScore}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>评估结果分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(['pass', 'extend', 'fail', 'pending'] as const).map((result) => {
                    const count = assessments.filter(a => a.result === result).length;
                    const percentage = assessments.length > 0 ? (count / assessments.length) * 100 : 0;
                    const labelMap = {
                      pass: '通过',
                      extend: '延长',
                      fail: '不合格',
                      pending: '待定',
                    };
                    return (
                      <div key={result}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{labelMap[result]}</span>
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
                <CardTitle>评分等级分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(['S', 'A', 'B', 'C', 'D'] as const).map((level) => {
                    const count = assessments.filter(a => a.scoreLevel === level).length;
                    const percentage = assessments.length > 0 ? (count / assessments.length) * 100 : 0;
                    return (
                      <div key={level}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getScoreLevelBadge(level)}
                          </div>
                          <span className="text-sm text-muted-foreground">{count}人 ({percentage.toFixed(1)}%)</span>
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
      <Dialog open={!!selectedAssessment} onOpenChange={(open) => !open && setSelectedAssessment(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedAssessment && (
            <>
              <DialogHeader>
                <DialogTitle>试用期评估详情</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* 基本信息 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>员工姓名</Label>
                    <div className="mt-1 font-medium">{selectedAssessment.employeeName}</div>
                  </div>
                  <div>
                    <Label>员工编号</Label>
                    <div className="mt-1 font-mono">{selectedAssessment.employeeId}</div>
                  </div>
                  <div>
                    <Label>部门</Label>
                    <div className="mt-1">{selectedAssessment.department}</div>
                  </div>
                  <div>
                    <Label>职位</Label>
                    <div className="mt-1">{selectedAssessment.position}</div>
                  </div>
                  <div>
                    <Label>试用期</Label>
                    <div className="mt-1">{selectedAssessment.startDate} ~ {selectedAssessment.endDate}</div>
                  </div>
                  <div>
                    <Label>评估日期</Label>
                    <div className="mt-1">{selectedAssessment.assessmentDate}</div>
                  </div>
                </div>

                {/* 评估得分 */}
                <div>
                  <Label className="text-base font-semibold">评估得分</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3">
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <div className="text-sm text-muted-foreground">工作质量</div>
                      <div className="text-2xl font-bold mt-1">{selectedAssessment.workQuality}</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <div className="text-sm text-muted-foreground">工作效率</div>
                      <div className="text-2xl font-bold mt-1">{selectedAssessment.workEfficiency}</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <div className="text-sm text-muted-foreground">团队协作</div>
                      <div className="text-2xl font-bold mt-1">{selectedAssessment.teamCollaboration}</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <div className="text-sm text-muted-foreground">学习能力</div>
                      <div className="text-2xl font-bold mt-1">{selectedAssessment.learningAbility}</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <div className="text-sm text-muted-foreground">工作态度</div>
                      <div className="text-2xl font-bold mt-1">{selectedAssessment.attitude}</div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-primary/10 rounded-lg text-center">
                    <div className="text-sm text-muted-foreground">综合得分</div>
                    <div className="text-4xl font-bold mt-1">{selectedAssessment.totalScore.toFixed(1)}</div>
                    <div className="mt-1">{getScoreLevelBadge(selectedAssessment.scoreLevel)}</div>
                  </div>
                </div>

                {/* 优缺点 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>优势</Label>
                    <div className="mt-2 space-y-2">
                      {selectedAssessment.strengths.map((strength, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>改进项</Label>
                    <div className="mt-2 space-y-2">
                      {selectedAssessment.improvementItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 评估结果 */}
                {selectedAssessment.resultComment && (
                  <div>
                    <Label>评估意见</Label>
                    <p className="mt-2 p-3 bg-muted rounded-lg">{selectedAssessment.resultComment}</p>
                  </div>
                )}

                {/* 审批信息 */}
                {selectedAssessment.approvedBy && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>评估人</Label>
                      <div className="mt-1">{selectedAssessment.assessor}</div>
                    </div>
                    <div>
                      <Label>审批人</Label>
                      <div className="mt-1">{selectedAssessment.approvedBy}</div>
                    </div>
                    <div>
                      <Label>审批时间</Label>
                      <div className="mt-1">{selectedAssessment.approvedAt}</div>
                    </div>
                    <div>
                      <Label>评估结果</Label>
                      <div className="mt-1">{getResultBadge(selectedAssessment.result)}</div>
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
