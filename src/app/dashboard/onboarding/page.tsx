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
import {
  UserPlus,
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
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/theme';

interface OnboardingTask {
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

interface OnboardingPlan {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  startDate: string;
  tasks: OnboardingTask[];
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  manager: string;
  buddy?: string;
}

interface NewHire {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  level: string;
  startDate: string;
  status: 'pending' | 'onboarding' | 'active';
  avatar?: string;
  location: string;
  education: string;
  experience: number;
  salary: number;
  manager: string;
  onboardingProgress: number;
  tasksCompleted: number;
  totalTasks: number;
  documents: {
    contract: boolean;
    nda: boolean;
    taxForm: boolean;
    idCard: boolean;
    degreeCertificate: boolean;
  };
}

export default function OnboardingPage() {
  const [loading, setLoading] = useState(true);
  const [newHires, setNewHires] = useState<NewHire[]>([]);
  const [onboardingPlans, setOnboardingPlans] = useState<OnboardingPlan[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | NewHire['status']>('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'hires' | 'plans' | 'tasks'>('hires');
  
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedHire, setSelectedHire] = useState<NewHire | null>(null);

  const fetchNewHires = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockHires: NewHire[] = [
        {
          id: '1',
          name: '王小明',
          email: 'wangxiaoming@example.com',
          phone: '138****5678',
          department: '技术部',
          position: '高级前端工程师',
          level: 'P6',
          startDate: '2025-04-20',
          status: 'onboarding',
          location: '北京',
          education: '本科',
          experience: 5,
          salary: 35000,
          manager: '张三',
          onboardingProgress: 65,
          tasksCompleted: 13,
          totalTasks: 20,
          documents: {
            contract: true,
            nda: true,
            taxForm: true,
            idCard: true,
            degreeCertificate: true,
          },
        },
        {
          id: '2',
          name: '李小红',
          email: 'lixiaohong@example.com',
          phone: '139****8765',
          department: '产品部',
          position: '产品经理',
          level: 'P5',
          startDate: '2025-04-25',
          status: 'pending',
          location: '上海',
          education: '硕士',
          experience: 3,
          salary: 30000,
          manager: '李四',
          onboardingProgress: 0,
          tasksCompleted: 0,
          totalTasks: 20,
          documents: {
            contract: false,
            nda: false,
            taxForm: false,
            idCard: false,
            degreeCertificate: false,
          },
        },
        {
          id: '3',
          name: '陈伟',
          email: 'chenwei@example.com',
          phone: '137****4321',
          department: '销售部',
          position: '销售经理',
          level: 'P5',
          startDate: '2025-04-15',
          status: 'active',
          location: '深圳',
          education: '本科',
          experience: 6,
          salary: 28000,
          manager: '王五',
          onboardingProgress: 100,
          tasksCompleted: 20,
          totalTasks: 20,
          documents: {
            contract: true,
            nda: true,
            taxForm: true,
            idCard: true,
            degreeCertificate: true,
          },
        },
      ];
      
      setNewHires(mockHires);
    } catch (error) {
      console.error('Failed to fetch new hires:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewHires();
  }, [fetchNewHires]);

  const filteredHires = useMemo(() => {
    return newHires.filter(hire => {
      const matchesSearch = hire.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hire.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hire.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || hire.status === statusFilter;
      const matchesDepartment = departmentFilter === 'all' || hire.department === departmentFilter;
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [newHires, searchTerm, statusFilter, departmentFilter]);

  const departments = useMemo(() => {
    return Array.from(new Set(newHires.map(h => h.department)));
  }, [newHires]);

  const getStatusBadge = (status: NewHire['status']) => {
    const statusMap = {
      pending: { label: '待入职', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      onboarding: { label: '入职中', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      active: { label: '已入职', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    };
    const { label, color } = statusMap[status];
    return <Badge className={color}>{label}</Badge>;
  };

  const stats = useMemo(() => {
    return {
      total: newHires.length,
      pending: newHires.filter(h => h.status === 'pending').length,
      onboarding: newHires.filter(h => h.status === 'onboarding').length,
      active: newHires.filter(h => h.status === 'active').length,
      avgProgress: Math.round(newHires.reduce((sum, h) => sum + h.onboardingProgress, 0) / newHires.length) || 0,
    };
  }, [newHires]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">入职管理</h1>
          <p className="text-muted-foreground mt-1">
            管理新员工入职流程和任务
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          新建入职流程
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>总入职人数</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>待入职</CardDescription>
            <CardTitle className="text-2xl text-yellow-600">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>入职中</CardDescription>
            <CardTitle className="text-2xl text-blue-600">{stats.onboarding}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>已完成入职</CardDescription>
            <CardTitle className="text-2xl text-green-600">{stats.active}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>平均完成度</CardDescription>
            <CardTitle className="text-2xl">{stats.avgProgress}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>新员工列表</CardTitle>
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
                  <SelectItem value="pending">待入职</SelectItem>
                  <SelectItem value="onboarding">入职中</SelectItem>
                  <SelectItem value="active">已入职</SelectItem>
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
                <TableHead>入职日期</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>入职进度</TableHead>
                <TableHead>直属经理</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHires.map((hire) => (
                <TableRow key={hire.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{hire.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{hire.name}</div>
                        <div className="text-sm text-muted-foreground">{hire.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{hire.position}</div>
                      <div className="text-sm text-muted-foreground">{hire.department}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {hire.startDate}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(hire.status)}</TableCell>
                  <TableCell>
                    <div className="w-32">
                      <Progress value={hire.onboardingProgress} />
                      <div className="text-xs text-muted-foreground mt-1">
                        {hire.tasksCompleted}/{hire.totalTasks} 任务
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{hire.manager}</TableCell>
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
    </div>
  );
}
