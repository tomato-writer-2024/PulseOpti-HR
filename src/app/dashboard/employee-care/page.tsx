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
  Heart,
  Plus,
  MessageSquare,
  Gift,
  Calendar,
  Coffee,
  Search,
  Download,
  Save,
  Eye,
  Mail,
  Phone,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';

// 类型定义
type CareType = 'birthday' | 'wedding' | 'sick' | 'childbirth' | 'family_bereavement' | 'onboarding' | 'resignation';
type CareStatus = 'pending' | 'in_progress' | 'completed';

interface CareRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: CareType;
  status: CareStatus;
  priority: 'high' | 'medium' | 'low';
  date: string;
  description: string;
  actionTaken: string;
  note: string;
  followUpDate?: string;
  creatorId: string;
  creatorName: string;
}

interface Feedback {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  category: 'suggestion' | 'complaint' | 'praise' | 'question';
  content: string;
  status: 'pending' | 'processing' | 'resolved';
  submittedAt: string;
  response?: string;
  respondedAt?: string;
}

export default function EmployeeCarePage() {
  const [activeTab, setActiveTab] = useState('care');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);

  // 员工关怀记录
  const [careRecords] = useState<CareRecord[]>([
    {
      id: '1',
      employeeId: '1',
      employeeName: '张三',
      department: '技术部',
      type: 'birthday',
      status: 'completed',
      priority: 'medium',
      date: '2025-04-15',
      description: '员工生日祝福',
      actionTaken: '发送生日贺卡和礼品',
      note: '员工表示感谢',
      creatorId: '2',
      creatorName: '李四',
    },
    {
      id: '2',
      employeeId: '3',
      employeeName: '王五',
      department: '销售部',
      type: 'sick',
      status: 'in_progress',
      priority: 'high',
      date: '2025-04-17',
      description: '员工生病住院',
      actionTaken: '已安排同事探望',
      note: '病情稳定，恢复中',
      followUpDate: '2025-04-20',
      creatorId: '4',
      creatorName: '赵六',
    },
    {
      id: '3',
      employeeId: '5',
      employeeName: '钱七',
      department: '市场部',
      type: 'onboarding',
      status: 'completed',
      priority: 'high',
      date: '2025-04-10',
      description: '新员工入职关怀',
      actionTaken: '安排入职培训和导师',
      note: '员工已熟悉基本流程',
      creatorId: '2',
      creatorName: '李四',
    },
    {
      id: '4',
      employeeId: '6',
      employeeName: '孙八',
      department: '市场部',
      type: 'wedding',
      status: 'pending',
      priority: 'medium',
      date: '2025-05-01',
      description: '员工结婚祝福',
      actionTaken: '',
      note: '',
      creatorId: '2',
      creatorName: '李四',
    },
  ]);

  // 员工反馈
  const [feedbacks] = useState<Feedback[]>([
    {
      id: '1',
      employeeId: '1',
      employeeName: '张三',
      department: '技术部',
      category: 'suggestion',
      content: '建议增加技术分享会频率',
      status: 'processing',
      submittedAt: '2025-04-16',
    },
    {
      id: '2',
      employeeId: '3',
      employeeName: '王五',
      department: '销售部',
      category: 'complaint',
      content: '销售系统经常卡顿，影响工作',
      status: 'resolved',
      submittedAt: '2025-04-14',
      response: '已安排技术部门进行优化',
      respondedAt: '2025-04-15',
    },
  ]);

  // 关怀统计
  const [careStats] = useState({
    totalRecords: 4,
    pending: 1,
    inProgress: 1,
    completed: 2,
    highPriority: 1,
  });

  // 反馈统计
  const [feedbackStats] = useState({
    totalFeedback: 2,
    pending: 0,
    processing: 1,
    resolved: 1,
  });

  const typeMap: Record<CareType, { label: string; icon: React.ReactNode; color: string }> = {
    birthday: { label: '生日关怀', icon: <Gift className="h-4 w-4" />, color: 'bg-pink-100 text-pink-800' },
    wedding: { label: '结婚祝福', icon: <Heart className="h-4 w-4" />, color: 'bg-red-100 text-red-800' },
    sick: { label: '生病探望', icon: <Coffee className="h-4 w-4" />, color: 'bg-orange-100 text-orange-800' },
    childbirth: { label: '生育慰问', icon: <Gift className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800' },
    family_bereavement: { label: '家庭丧事', icon: <Heart className="h-4 w-4" />, color: 'bg-gray-100 text-gray-800' },
    onboarding: { label: '入职关怀', icon: <Users className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800' },
    resignation: { label: '离职关怀', icon: <Heart className="h-4 w-4" />, color: 'bg-yellow-100 text-yellow-800' },
  };

  const statusMap: Record<CareStatus, { label: string; color: string }> = {
    pending: { label: '待处理', color: 'bg-gray-100 text-gray-800' },
    in_progress: { label: '进行中', color: 'bg-blue-100 text-blue-800' },
    completed: { label: '已完成', color: 'bg-green-100 text-green-800' },
  };

  const categoryMap: Record<string, { label: string; color: string }> = {
    suggestion: { label: '建议', color: 'bg-blue-100 text-blue-800' },
    complaint: { label: '投诉', color: 'bg-red-100 text-red-800' },
    praise: { label: '表扬', color: 'bg-green-100 text-green-800' },
    question: { label: '咨询', color: 'bg-yellow-100 text-yellow-800' },
  };

  const filteredRecords = careRecords.filter(record => {
    const matchSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       record.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">员工关怀</h1>
          <p className="text-gray-600 mt-2">
            关怀记录、员工反馈、慰问管理
            <Badge variant="secondary" className="ml-2">HRBP</Badge>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出报告
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            新增关怀
          </Button>
        </div>
      </div>

      {/* 功能介绍 */}
      <Alert>
        <Heart className="h-4 w-4" />
        <AlertDescription>
          全周期员工关怀管理，包括生日、入职、生病、离职等关键时刻
        </AlertDescription>
      </Alert>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">关怀记录</CardTitle>
            <Heart className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{careStats.totalRecords}</div>
            <p className="text-xs text-gray-500 mt-1">
              {careStats.highPriority} 个高优先级
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">待处理</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{careStats.pending}</div>
            <p className="text-xs text-gray-500 mt-1">需立即处理</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">进行中</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{careStats.inProgress}</div>
            <p className="text-xs text-gray-500 mt-1">处理中</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">员工反馈</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbackStats.totalFeedback}</div>
            <p className="text-xs text-gray-500 mt-1">
              {feedbackStats.pending} 待回复
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="care">关怀记录</TabsTrigger>
          <TabsTrigger value="feedback">员工反馈</TabsTrigger>
          <TabsTrigger value="calendar">关怀日历</TabsTrigger>
        </TabsList>

        {/* 关怀记录 */}
        <TabsContent value="care" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>关怀记录</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="搜索员工或描述"
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
                      <SelectItem value="pending">待处理</SelectItem>
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
                    <TableHead>日期</TableHead>
                    <TableHead>员工</TableHead>
                    <TableHead>关怀类型</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead>处理措施</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="text-sm">{record.date}</TableCell>
                      <TableCell className="font-medium">
                        <div>
                          <div>{record.employeeName}</div>
                          <div className="text-xs text-gray-600">{record.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={typeMap[record.type].color}>
                          {typeMap[record.type].icon}
                          {typeMap[record.type].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {record.description}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {record.actionTaken || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusMap[record.status].color}>
                          {statusMap[record.status].label}
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

        {/* 员工反馈 */}
        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>员工反馈</CardTitle>
              <CardDescription>收集和处理员工意见建议</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>员工</TableHead>
                    <TableHead>类别</TableHead>
                    <TableHead>内容</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>提交时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbacks.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{feedback.employeeName}</div>
                          <div className="text-xs text-gray-600">{feedback.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={categoryMap[feedback.category].color}>
                          {categoryMap[feedback.category].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        {feedback.content}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            feedback.status === 'resolved' ? 'default' : 'secondary'
                          }
                        >
                          {feedback.status === 'pending' && '待处理'}
                          {feedback.status === 'processing' && '处理中'}
                          {feedback.status === 'resolved' && '已解决'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{feedback.submittedAt}</TableCell>
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

        {/* 关怀日历 */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>关怀日历</CardTitle>
              <CardDescription>查看即将到来的关怀事件</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-pink-600" />
                    <span className="font-medium">即将到来的生日</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    本月有 3 位员工生日
                  </div>
                </div>
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-5 w-5 text-red-600" />
                    <span className="font-medium">即将到来的婚礼</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    钱七 - 5月1日
                  </div>
                </div>
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">即将到来的生育</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    暂无
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 新增关怀弹窗 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新增关怀记录</DialogTitle>
            <DialogDescription>
              记录员工关怀信息
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="employee">选择员工 *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择员工" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">张三 - 技术部</SelectItem>
                  <SelectItem value="2">李四 - 技术部</SelectItem>
                  <SelectItem value="3">王五 - 销售部</SelectItem>
                  <SelectItem value="4">赵六 - 销售部</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">关怀类型 *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="birthday">生日关怀</SelectItem>
                  <SelectItem value="wedding">结婚祝福</SelectItem>
                  <SelectItem value="sick">生病探望</SelectItem>
                  <SelectItem value="childbirth">生育慰问</SelectItem>
                  <SelectItem value="family_bereavement">家庭丧事</SelectItem>
                  <SelectItem value="onboarding">入职关怀</SelectItem>
                  <SelectItem value="resignation">离职关怀</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">日期 *</Label>
                <Input id="date" type="date" />
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
            <div>
              <Label htmlFor="description">描述 *</Label>
              <Textarea
                id="description"
                placeholder="描述关怀事项"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="action">处理措施</Label>
              <Textarea
                id="action"
                placeholder="记录已采取或计划采取的措施"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={() => {
              toast.success('关怀记录已添加！');
              setDialogOpen(false);
            }}>
              <Save className="mr-2 h-4 w-4" />
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
