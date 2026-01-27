'use client';

import { useState } from 'react';
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
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Handshake,
  Plus,
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  Users,
  Search,
  Download,
  Save,
  Eye,
  Edit,
  Trash2,
  Filter,
  AlertTriangle,
  BarChart3,
  Calendar,
  Building2,
} from 'lucide-react';
import { toast } from 'sonner';

// 类型定义
type SupportType = 'recruiting' | 'training' | 'organizational' | 'policy' | 'culture';
type SupportStatus = 'pending' | 'in_progress' | 'completed';

interface BusinessSupport {
  id: string;
  businessUnit: string;
  businessOwner: string;
  hrOwner: string;
  type: SupportType;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: SupportStatus;
  startDate: string;
  endDate?: string;
  progress: number;
  outcomes?: string;
  metrics?: string;
}

interface BusinessGoal {
  id: string;
  businessUnit: string;
  goal: string;
  hrContribution: string;
  status: 'on_track' | 'at_risk' | 'behind';
  progress: number;
  targetDate: string;
}

interface MeetingRecord {
  id: string;
  businessUnit: string;
  businessOwner: string;
  hrOwner: string;
  date: string;
  agenda: string;
  outcomes: string;
  nextSteps: string;
}

export default function BusinessSupportPage() {
  const [activeTab, setActiveTab] = useState('supports');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);

  // 业务支持项目
  const [businessSupports] = useState<BusinessSupport[]>([
    {
      id: '1',
      businessUnit: '技术部',
      businessOwner: '李四',
      hrOwner: '王五',
      type: 'recruiting',
      title: '技术团队扩招',
      description: '为技术部招聘20名工程师',
      priority: 'high',
      status: 'in_progress',
      startDate: '2025-03-01',
      endDate: '2025-06-30',
      progress: 65,
      metrics: '已入职 13/20 人',
    },
    {
      id: '2',
      businessUnit: '销售部',
      businessOwner: '赵六',
      hrOwner: '钱七',
      type: 'training',
      title: '销售技能提升培训',
      description: '开展销售团队技能培训课程',
      priority: 'medium',
      status: 'in_progress',
      startDate: '2025-04-01',
      endDate: '2025-05-30',
      progress: 40,
      metrics: '已完成 40% 课程',
    },
    {
      id: '3',
      businessUnit: '市场部',
      businessOwner: '孙八',
      hrOwner: '周九',
      type: 'organizational',
      title: '市场部组织架构优化',
      description: '优化市场部组织架构，提升协作效率',
      priority: 'high',
      status: 'completed',
      startDate: '2025-02-01',
      endDate: '2025-03-31',
      progress: 100,
      outcomes: '已完成架构调整，效率提升20%',
      metrics: '协作效率提升 20%',
    },
  ]);

  // 业务目标
  const [businessGoals] = useState<BusinessGoal[]>([
    {
      id: '1',
      businessUnit: '技术部',
      goal: '团队规模达到 50 人',
      hrContribution: '负责招聘和人才引进',
      status: 'on_track',
      progress: 78,
      targetDate: '2025-06-30',
    },
    {
      id: '2',
      businessUnit: '销售部',
      goal: '销售业绩增长 30%',
      hrContribution: '销售培训、激励方案设计',
      status: 'at_risk',
      progress: 55,
      targetDate: '2025-06-30',
    },
    {
      id: '3',
      businessUnit: '市场部',
      goal: '品牌知名度提升',
      hrContribution: '市场团队建设、人才保留',
      status: 'on_track',
      progress: 70,
      targetDate: '2025-06-30',
    },
  ]);

  // 会议记录
  const [meetingRecords] = useState<MeetingRecord[]>([
    {
      id: '1',
      businessUnit: '技术部',
      businessOwner: '李四',
      hrOwner: '王五',
      date: '2025-04-15',
      agenda: '1. 招聘进度汇报 2. 人才保留方案讨论',
      outcomes: '招聘进度良好，计划加强技术培训',
      nextSteps: '完成下月招聘计划',
    },
    {
      id: '2',
      businessUnit: '销售部',
      businessOwner: '赵六',
      hrOwner: '钱七',
      date: '2025-04-18',
      agenda: '1. 销售培训安排 2. 激励方案调整',
      outcomes: '培训计划已确定，激励方案待审批',
      nextSteps: '提交激励方案审批',
    },
  ]);

  // 统计
  const [stats] = useState({
    totalSupports: 3,
    inProgress: 2,
    completed: 1,
    highPriority: 1,
  });

  const typeMap: Record<SupportType, { label: string; icon: React.ReactNode; color: string }> = {
    recruiting: { label: '招聘支持', icon: <Users className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800' },
    training: { label: '培训支持', icon: <Target className="h-4 w-4" />, color: 'bg-green-100 text-green-800' },
    organizational: { label: '组织支持', icon: <Building2 className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800' },
    policy: { label: '政策支持', icon: <CheckCircle className="h-4 w-4" />, color: 'bg-orange-100 text-orange-800' },
    culture: { label: '文化支持', icon: <Handshake className="h-4 w-4" />, color: 'bg-pink-100 text-pink-800' },
  };

  const statusMap: Record<SupportStatus, { label: string; color: string }> = {
    pending: { label: '待开始', color: 'bg-gray-100 text-gray-800' },
    in_progress: { label: '进行中', color: 'bg-blue-100 text-blue-800' },
    completed: { label: '已完成', color: 'bg-green-100 text-green-800' },
  };

  const goalStatusMap: Record<string, { label: string; color: string }> = {
    on_track: { label: '正常', color: 'bg-green-100 text-green-800' },
    at_risk: { label: '有风险', color: 'bg-yellow-100 text-yellow-800' },
    behind: { label: '滞后', color: 'bg-red-100 text-red-800' },
  };

  const filteredSupports = businessSupports.filter(support => {
    const matchSearch = support.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       support.businessUnit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || support.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">业务支持</h1>
          <p className="text-gray-600 mt-2">
            业务伙伴支持、目标跟踪、会议管理
            <Badge variant="secondary" className="ml-2">HRBP</Badge>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出报告
          </Button>
          <Button onClick={() => setSupportDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            新建支持
          </Button>
        </div>
      </div>

      {/* 功能介绍 */}
      <Alert>
        <Handshake className="h-4 w-4" />
        <AlertDescription>
          与业务部门紧密合作，提供人力资源支持，推动业务目标达成
        </AlertDescription>
      </Alert>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">支持项目</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSupports}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.inProgress} 个进行中
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">进行中</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-gray-500 mt-1">活跃项目</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">已完成</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-gray-500 mt-1">已交付</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">高优先级</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highPriority}</div>
            <p className="text-xs text-gray-500 mt-1">需重点关注</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="supports">支持项目</TabsTrigger>
          <TabsTrigger value="goals">业务目标</TabsTrigger>
          <TabsTrigger value="meetings">会议记录</TabsTrigger>
        </TabsList>

        {/* 支持项目 */}
        <TabsContent value="supports" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>业务支持项目</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="搜索项目"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="pending">待开始</SelectItem>
                      <SelectItem value="in_progress">进行中</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>业务单元</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>项目标题</TableHead>
                    <TableHead>负责人</TableHead>
                    <TableHead>周期</TableHead>
                    <TableHead>进度</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSupports.map((support) => (
                    <TableRow key={support.id}>
                      <TableCell className="font-medium">
                        {support.businessUnit}
                      </TableCell>
                      <TableCell>
                        <Badge className={typeMap[support.type].color}>
                          {typeMap[support.type].icon}
                          {typeMap[support.type].label}
                        </Badge>
                      </TableCell>
                      <TableCell>{support.title}</TableCell>
                      <TableCell className="text-sm">
                        <div>{support.businessOwner}</div>
                        <div className="text-gray-600">{support.hrOwner} (HR)</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {support.startDate} ~ {support.endDate || '进行中'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={support.progress} className="w-20 h-2" />
                          <span className="text-sm">{support.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusMap[support.status].color}>
                          {statusMap[support.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 业务目标 */}
        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>业务目标跟踪</CardTitle>
              <CardDescription>跟踪各业务单元的关键目标</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>业务单元</TableHead>
                    <TableHead>目标</TableHead>
                    <TableHead>HR 贡献</TableHead>
                    <TableHead>进度</TableHead>
                    <TableHead>目标日期</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {businessGoals.map((goal) => (
                    <TableRow key={goal.id}>
                      <TableCell className="font-medium">
                        {goal.businessUnit}
                      </TableCell>
                      <TableCell>{goal.goal}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {goal.hrContribution}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={goal.progress} className="w-20 h-2" />
                          <span className="text-sm">{goal.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{goal.targetDate}</TableCell>
                      <TableCell>
                        <Badge className={goalStatusMap[goal.status].color}>
                          {goalStatusMap[goal.status].label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 会议记录 */}
        <TabsContent value="meetings">
          <Card>
            <CardHeader>
              <CardTitle>会议记录</CardTitle>
              <CardDescription>HRBP与业务部门的沟通记录</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>日期</TableHead>
                    <TableHead>业务单元</TableHead>
                    <TableHead>参与人</TableHead>
                    <TableHead>议题</TableHead>
                    <TableHead>成果</TableHead>
                    <TableHead>下一步</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meetingRecords.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell className="text-sm">{meeting.date}</TableCell>
                      <TableCell className="font-medium">
                        {meeting.businessUnit}
                      </TableCell>
                      <TableCell className="text-sm">
                        {meeting.businessOwner} / {meeting.hrOwner}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {meeting.agenda}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {meeting.outcomes}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {meeting.nextSteps}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 新建支持弹窗 */}
      <Dialog open={supportDialogOpen} onOpenChange={setSupportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新建业务支持</DialogTitle>
            <DialogDescription>
              创建新的业务支持项目
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessUnit">业务单元 *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择业务单元" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">技术部</SelectItem>
                  <SelectItem value="sales">销售部</SelectItem>
                  <SelectItem value="marketing">市场部</SelectItem>
                  <SelectItem value="hr">人力资源部</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">支持类型 *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recruiting">招聘支持</SelectItem>
                  <SelectItem value="training">培训支持</SelectItem>
                  <SelectItem value="organizational">组织支持</SelectItem>
                  <SelectItem value="policy">政策支持</SelectItem>
                  <SelectItem value="culture">文化支持</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="title">项目标题 *</Label>
              <Input id="title" placeholder="输入项目标题" />
            </div>
            <div>
              <Label htmlFor="description">描述 *</Label>
              <Textarea
                id="description"
                placeholder="详细描述支持内容"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">开始日期 *</Label>
                <Input id="startDate" type="date" />
              </div>
              <div>
                <Label htmlFor="endDate">结束日期</Label>
                <Input id="endDate" type="date" />
              </div>
            </div>
            <div>
              <Label htmlFor="priority">优先级 *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择优先级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">高</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="low">低</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSupportDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={() => {
              toast.success('支持项目已创建！');
              setSupportDialogOpen(false);
            }}>
              <Save className="mr-2 h-4 w-4" />
              创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
