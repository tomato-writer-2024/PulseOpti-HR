'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  UserMinus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  FileText,
  Calendar,
  Building2,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  ClipboardCheck,
  Check,
  X,
  Upload,
  TrendingDown,
  MessageSquare,
  Users,
  BarChart3,
  Target,
  PieChart,
  LineChart,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';
import { cn } from '@/lib/theme';

interface OffboardingTask {
  id: string;
  title: string;
  description: string;
  category: 'hr' | 'it' | 'admin' | 'manager';
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  assignedTo?: string;
  completedAt?: string;
}

interface OffboardingPlan {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  lastDate: string;
  tasks: OffboardingTask[];
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  reason: string;
  exitInterview: {
    status: 'pending' | 'scheduled' | 'completed';
    date?: string;
    interviewer?: string;
    notes?: string;
  };
}

interface ExitSurvey {
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  lastDate: string;
  reasonCategory: string;
  reasonDetail: string;
  satisfaction: number;
  wouldRecommend: boolean;
  managementRating: number;
  cultureRating: number;
  compensationRating: number;
  growthRating: number;
  workLifeBalance: number;
  suggestions: string;
  submittedAt: string;
}

interface OffboardingRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  level: string;
  joinDate: string;
  lastDate: string;
  status: 'pending' | 'processing' | 'completed';
  reason: string;
  reasonCategory: 'career' | 'compensation' | 'management' | 'worklife' | 'other';
  avatar?: string;
  location: string;
  manager: string;
  offboardingProgress: number;
  tasksCompleted: number;
  totalTasks: number;
  handover: {
    documents: boolean;
    assets: boolean;
    accounts: boolean;
    knowledge: boolean;
  };
  exitInterview: {
    status: 'pending' | 'scheduled' | 'completed';
    date?: string;
  };
  clearance: {
    equipment: boolean;
    idCard: boolean;
    accessCard: boolean;
    email: boolean;
  };
}

export default function OffboardingPage() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<OffboardingRecord[]>([]);
  const [exitSurveys, setExitSurveys] = useState<ExitSurvey[]>([]);
  const [offboardingPlans, setOffboardingPlans] = useState<OffboardingPlan[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OffboardingRecord['status']>('all');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'records' | 'surveys' | 'analytics'>('records');
  
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<OffboardingRecord | null>(null);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockRecords: OffboardingRecord[] = [
        {
          id: '1',
          employeeId: 'EMP001',
          employeeName: '张三',
          email: 'zhangsan@example.com',
          phone: '138****1234',
          department: '技术部',
          position: '高级前端工程师',
          level: 'P6',
          joinDate: '2022-01-15',
          lastDate: '2025-04-30',
          status: 'processing',
          reason: '更好的职业发展机会',
          reasonCategory: 'career',
          location: '北京',
          manager: '李四',
          offboardingProgress: 60,
          tasksCompleted: 12,
          totalTasks: 20,
          handover: {
            documents: true,
            assets: true,
            accounts: false,
            knowledge: true,
          },
          exitInterview: {
            status: 'scheduled',
            date: '2025-04-28',
          },
          clearance: {
            equipment: false,
            idCard: false,
            accessCard: false,
            email: false,
          },
        },
        {
          id: '2',
          employeeId: 'EMP002',
          employeeName: '王五',
          email: 'wangwu@example.com',
          phone: '139****5678',
          department: '产品部',
          position: '产品经理',
          level: 'P5',
          joinDate: '2021-06-01',
          lastDate: '2025-05-15',
          status: 'pending',
          reason: '薪酬待遇不满足期望',
          reasonCategory: 'compensation',
          location: '上海',
          manager: '赵六',
          offboardingProgress: 0,
          tasksCompleted: 0,
          totalTasks: 20,
          handover: {
            documents: false,
            assets: false,
            accounts: false,
            knowledge: false,
          },
          exitInterview: {
            status: 'pending',
          },
          clearance: {
            equipment: false,
            idCard: false,
            accessCard: false,
            email: false,
          },
        },
        {
          id: '3',
          employeeId: 'EMP003',
          employeeName: '李六',
          email: 'liliu@example.com',
          phone: '137****9012',
          department: '销售部',
          position: '销售代表',
          level: 'P4',
          joinDate: '2023-03-10',
          lastDate: '2025-04-10',
          status: 'completed',
          reason: '个人原因，需要搬迁到其他城市',
          reasonCategory: 'other',
          location: '深圳',
          manager: '孙七',
          offboardingProgress: 100,
          tasksCompleted: 20,
          totalTasks: 20,
          handover: {
            documents: true,
            assets: true,
            accounts: true,
            knowledge: true,
          },
          exitInterview: {
            status: 'completed',
            date: '2025-04-08',
          },
          clearance: {
            equipment: true,
            idCard: true,
            accessCard: true,
            email: true,
          },
        },
      ];
      
      setRecords(mockRecords);
      
      const mockSurveys: ExitSurvey[] = [
        {
          employeeId: 'EMP003',
          employeeName: '李六',
          department: '销售部',
          position: '销售代表',
          lastDate: '2025-04-10',
          reasonCategory: 'other',
          reasonDetail: '因家庭原因需要搬迁到其他城市',
          satisfaction: 7,
          wouldRecommend: true,
          managementRating: 8,
          cultureRating: 7,
          compensationRating: 6,
          growthRating: 7,
          workLifeBalance: 8,
          suggestions: '建议加强员工关怀，提供更灵活的工作安排',
          submittedAt: '2025-04-08',
        },
      ];
      
      setExitSurveys(mockSurveys);
    } catch (error) {
      console.error('Failed to fetch offboarding records:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
      const matchesReason = reasonFilter === 'all' || record.reasonCategory === reasonFilter;
      const matchesDepartment = departmentFilter === 'all' || record.department === departmentFilter;
      return matchesSearch && matchesStatus && matchesReason && matchesDepartment;
    });
  }, [records, searchTerm, statusFilter, reasonFilter, departmentFilter]);

  const departments = useMemo(() => {
    return Array.from(new Set(records.map(r => r.department)));
  }, [records]);

  const getStatusBadge = (status: OffboardingRecord['status']) => {
    const statusMap = {
      pending: { label: '待处理', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      processing: { label: '处理中', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      completed: { label: '已完成', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    };
    const { label, color } = statusMap[status];
    return <Badge className={color}>{label}</Badge>;
  };

  const getReasonCategoryBadge = (category: OffboardingRecord['reasonCategory']) => {
    const categoryMap = {
      career: { label: '职业发展', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
      compensation: { label: '薪酬待遇', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
      management: { label: '管理问题', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
      worklife: { label: '工作生活平衡', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' },
      other: { label: '其他原因', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
    };
    const { label, color } = categoryMap[category];
    return <Badge className={color}>{label}</Badge>;
  };

  const stats = useMemo(() => {
    return {
      total: records.length,
      pending: records.filter(r => r.status === 'pending').length,
      processing: records.filter(r => r.status === 'processing').length,
      completed: records.filter(r => r.status === 'completed').length,
      avgProgress: Math.round(records.reduce((sum, r) => sum + r.offboardingProgress, 0) / records.length) || 0,
    };
  }, [records]);

  const analytics = useMemo(() => {
    const reasonCounts = records.reduce((acc, r) => {
      acc[r.reasonCategory] = (acc[r.reasonCategory] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const departmentCounts = records.reduce((acc, r) => {
      acc[r.department] = (acc[r.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      reasonCounts,
      departmentCounts,
      avgTenure: records.length > 0 
        ? Math.round(records.reduce((sum, r) => {
            const join = new Date(r.joinDate);
            const leave = new Date(r.lastDate);
            const months = (leave.getFullYear() - join.getFullYear()) * 12 + leave.getMonth() - join.getMonth();
            return sum + months;
          }, 0) / records.length / 12)
        : 0,
    };
  }, [records]);

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
          <h1 className="text-3xl font-bold tracking-tight">离职管理</h1>
          <p className="text-muted-foreground mt-1">
            管理员工离职流程和数据分析
          </p>
        </div>
        <Button>
          <UserMinus className="mr-2 h-4 w-4" />
          发起离职流程
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>总离职人数</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>待处理</CardDescription>
            <CardTitle className="text-2xl text-yellow-600">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>处理中</CardDescription>
            <CardTitle className="text-2xl text-blue-600">{stats.processing}</CardTitle>
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
            <CardDescription>平均在职时长</CardDescription>
            <CardTitle className="text-2xl">{analytics.avgTenure}年</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
        <TabsList>
          <TabsTrigger value="records">离职记录</TabsTrigger>
          <TabsTrigger value="surveys">离职调查</TabsTrigger>
          <TabsTrigger value="analytics">数据分析</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>离职人员列表</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索姓名、邮箱、职位..."
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
                      <SelectItem value="pending">待处理</SelectItem>
                      <SelectItem value="processing">处理中</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={reasonFilter} onValueChange={(v: any) => setReasonFilter(v)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部原因</SelectItem>
                      <SelectItem value="career">职业发展</SelectItem>
                      <SelectItem value="compensation">薪酬待遇</SelectItem>
                      <SelectItem value="management">管理问题</SelectItem>
                      <SelectItem value="worklife">工作生活平衡</SelectItem>
                      <SelectItem value="other">其他原因</SelectItem>
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
                    <RefreshCw className="h-4 w-4" />
                  </Button>
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
                    <TableHead>最后工作日</TableHead>
                    <TableHead>离职原因</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>离职进度</TableHead>
                    <TableHead>离职面谈</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{record.employeeName.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{record.employeeName}</div>
                            <div className="text-sm text-muted-foreground">{record.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{record.position}</div>
                          <div className="text-sm text-muted-foreground">{record.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {record.lastDate}
                        </div>
                      </TableCell>
                      <TableCell>{getReasonCategoryBadge(record.reasonCategory)}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>
                        <div className="w-32">
                          <Progress value={record.offboardingProgress} />
                          <div className="text-xs text-muted-foreground mt-1">
                            {record.tasksCompleted}/{record.totalTasks} 任务
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          record.exitInterview.status === 'completed' ? 'default' :
                          record.exitInterview.status === 'scheduled' ? 'secondary' : 'outline'
                        }>
                          {record.exitInterview.status === 'completed' ? '已完成' :
                           record.exitInterview.status === 'scheduled' ? '已安排' : '待安排'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
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

        <TabsContent value="surveys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>离职调查问卷</CardTitle>
              <CardDescription>
                共收集 {exitSurveys.length} 份调查问卷
              </CardDescription>
            </CardHeader>
            <CardContent>
              {exitSurveys.length > 0 ? (
                <div className="space-y-6">
                  {exitSurveys.map((survey) => (
                    <Card key={survey.employeeId}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{survey.employeeName}</CardTitle>
                            <CardDescription>
                              {survey.department} · {survey.position}
                            </CardDescription>
                          </div>
                          <Badge>{survey.lastDate}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>离职原因</Label>
                          <p className="text-sm mt-1">{survey.reasonDetail}</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <Label>整体满意度</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={survey.satisfaction * 10} />
                              <span className="text-sm font-medium">{survey.satisfaction}/10</span>
                            </div>
                          </div>
                          <div>
                            <Label>管理评价</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={survey.managementRating * 10} />
                              <span className="text-sm font-medium">{survey.managementRating}/10</span>
                            </div>
                          </div>
                          <div>
                            <Label>企业文化</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={survey.cultureRating * 10} />
                              <span className="text-sm font-medium">{survey.cultureRating}/10</span>
                            </div>
                          </div>
                          <div>
                            <Label>薪酬待遇</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={survey.compensationRating * 10} />
                              <span className="text-sm font-medium">{survey.compensationRating}/10</span>
                            </div>
                          </div>
                          <div>
                            <Label>发展机会</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={survey.growthRating * 10} />
                              <span className="text-sm font-medium">{survey.growthRating}/10</span>
                            </div>
                          </div>
                          <div>
                            <Label>工作生活平衡</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={survey.workLifeBalance * 10} />
                              <span className="text-sm font-medium">{survey.workLifeBalance}/10</span>
                            </div>
                          </div>
                        </div>
                        {survey.suggestions && (
                          <div>
                            <Label>改进建议</Label>
                            <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{survey.suggestions}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Label>是否推荐公司</Label>
                          <Badge variant={survey.wouldRecommend ? 'default' : 'outline'}>
                            {survey.wouldRecommend ? '是' : '否'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">暂无离职调查数据</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>离职原因分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.reasonCounts).map(([reason, count]) => (
                    <div key={reason}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {reason === 'career' && '职业发展'}
                          {reason === 'compensation' && '薪酬待遇'}
                          {reason === 'management' && '管理问题'}
                          {reason === 'worklife' && '工作生活平衡'}
                          {reason === 'other' && '其他原因'}
                        </span>
                        <span className="text-sm text-muted-foreground">{count}人</span>
                      </div>
                      <Progress value={(count / stats.total) * 100} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>部门离职分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.departmentCounts).map(([dept, count]) => (
                    <div key={dept}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{dept}</span>
                        <span className="text-sm text-muted-foreground">{count}人</span>
                      </div>
                      <Progress value={(count / stats.total) * 100} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>离职预警分析</CardTitle>
              <CardDescription>基于数据分析的潜在离职风险提示</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>主要风险因素：</strong>根据离职调查数据，薪酬待遇（33%）和职业发展（33%）是员工离职的主要原因。建议重点关注这两个方面的改进措施。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
