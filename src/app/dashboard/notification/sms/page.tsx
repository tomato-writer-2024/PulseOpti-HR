'use client';

import { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Smartphone,
  Send,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings,
  BarChart3,
  FileText,
  Users,
  Calendar,
  Bell,
  RefreshCw,
  Search,
  Filter,
  MoreVertical,
  Play,
  Pause,
  MessageSquare,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface SmsTemplate {
  id: string;
  name: string;
  code: string;
  content: string;
  category: 'attendance' | 'leave' | 'interview' | 'performance' | 'training' | 'system';
  variables: string[];
  status: 'active' | 'inactive';
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface SmsRecord {
  id: string;
  templateId: string;
  templateName: string;
  recipient: string;
  recipientName: string;
  content: string;
  status: 'sent' | 'failed' | 'pending';
  channel: 'aliyun' | 'tencent';
  cost: number;
  sentAt: string;
  operator?: string;
  errorCode?: string;
  errorMsg?: string;
}

interface SmsStats {
  totalSent: number;
  successRate: number;
  totalCost: number;
  avgCost: number;
  todaySent: number;
  monthSent: number;
}

export default function SmsNotificationPage() {
  const [activeTab, setActiveTab] = useState('templates');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<SmsTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // 短信模板数据
  const [templates, setTemplates] = useState<SmsTemplate[]>([
    {
      id: '1',
      name: '打卡成功通知',
      code: 'CLOCK_SUCCESS',
      content: '【PulseOpti HR】尊敬的{employeeName}，您于{clockTime}打卡成功，地点：{location}。',
      category: 'attendance',
      variables: ['employeeName', 'clockTime', 'location'],
      status: 'active',
      usageCount: 1280,
      createdAt: '2025-01-15',
      updatedAt: '2025-04-01',
    },
    {
      id: '2',
      name: '请假审批通知',
      code: 'LEAVE_APPROVAL',
      content: '【PulseOpti HR】尊敬的{employeeName}，您的{leaveType}申请已{status}，时间：{startDate}至{endDate}。',
      category: 'leave',
      variables: ['employeeName', 'leaveType', 'status', 'startDate', 'endDate'],
      status: 'active',
      usageCount: 856,
      createdAt: '2025-01-15',
      updatedAt: '2025-03-20',
    },
    {
      id: '3',
      name: '面试邀请通知',
      code: 'INTERVIEW_INVITE',
      content: '【PulseOpti HR】尊敬的{candidateName}，我们诚挚邀请您参加面试，时间：{interviewTime}，地点：{location}，请准时参加。',
      category: 'interview',
      variables: ['candidateName', 'interviewTime', 'location'],
      status: 'active',
      usageCount: 234,
      createdAt: '2025-02-01',
      updatedAt: '2025-04-10',
    },
    {
      id: '4',
      name: '绩效评估通知',
      code: 'PERFORMANCE_REVIEW',
      content: '【PulseOpti HR】尊敬的{employeeName}，您的{quarter}绩效评估已完成，得分：{score}，请登录系统查看详情。',
      category: 'performance',
      variables: ['employeeName', 'quarter', 'score'],
      status: 'active',
      usageCount: 420,
      createdAt: '2025-01-20',
      updatedAt: '2025-03-15',
    },
    {
      id: '5',
      name: '培训提醒通知',
      code: 'TRAINING_REMINDER',
      content: '【PulseOpti HR】尊敬的{employeeName}，您报名的培训"{courseName}"将于{startTime}开始，请做好准备。',
      category: 'training',
      variables: ['employeeName', 'courseName', 'startTime'],
      status: 'active',
      usageCount: 312,
      createdAt: '2025-02-15',
      updatedAt: '2025-04-05',
    },
    {
      id: '6',
      name: '密码重置通知',
      code: 'PASSWORD_RESET',
      content: '【PulseOpti HR】您的账号正在重置密码，验证码：{code}，5分钟内有效。如非本人操作，请忽略。',
      category: 'system',
      variables: ['code'],
      status: 'active',
      usageCount: 89,
      createdAt: '2025-01-10',
      updatedAt: '2025-01-10',
    },
  ]);

  // 短信记录数据
  const [records, setRecords] = useState<SmsRecord[]>([
    {
      id: '1',
      templateId: '1',
      templateName: '打卡成功通知',
      recipient: '13800138000',
      recipientName: '张三',
      content: '【PulseOpti HR】尊敬的张三，您于09:00打卡成功，地点：科技园A座。',
      status: 'sent',
      channel: 'aliyun',
      cost: 0.045,
      sentAt: '2025-04-18 09:00:15',
      operator: '移动',
    },
    {
      id: '2',
      templateId: '3',
      templateName: '面试邀请通知',
      recipient: '13900139000',
      recipientName: '李四',
      content: '【PulseOpti HR】尊敬的李四，我们诚挚邀请您参加面试，时间：2025-04-20 14:00，地点：科技园B座3楼。',
      status: 'sent',
      channel: 'tencent',
      cost: 0.055,
      sentAt: '2025-04-18 10:30:22',
      operator: '联通',
    },
    {
      id: '3',
      templateId: '2',
      templateName: '请假审批通知',
      recipient: '13700137000',
      recipientName: '王五',
      content: '【PulseOpti HR】尊敬的王五，您的病假申请已通过，时间：2025-04-19至2025-04-20。',
      status: 'failed',
      channel: 'aliyun',
      cost: 0,
      sentAt: '2025-04-18 14:15:30',
      operator: '移动',
      errorCode: 'ERROR_001',
      errorMsg: '号码状态异常',
    },
    {
      id: '4',
      templateId: '4',
      templateName: '绩效评估通知',
      recipient: '13600136000',
      recipientName: '赵六',
      content: '【PulseOpti HR】尊敬的赵六，您的2025Q1绩效评估已完成，得分：92，请登录系统查看详情。',
      status: 'sent',
      channel: 'aliyun',
      cost: 0.055,
      sentAt: '2025-04-17 16:00:10',
      operator: '电信',
    },
  ]);

  // 统计数据
  const [stats, setStats] = useState<SmsStats>({
    totalSent: 3191,
    successRate: 97.5,
    totalCost: 156.32,
    avgCost: 0.049,
    todaySent: 124,
    monthSent: 856,
  });

  // 分类映射
  const categoryMap: Record<string, string> = {
    attendance: '考勤',
    leave: '请假',
    interview: '面试',
    performance: '绩效',
    training: '培训',
    system: '系统',
  };

  // 渠道映射
  const channelMap: Record<string, string> = {
    aliyun: '阿里云',
    tencent: '腾讯云',
  };

  // 状态徽章
  const getStatusBadge = (status: string) => {
    const badges: Record<string, { variant: 'default' | 'secondary' | 'destructive'; text: string; icon: React.ReactNode }> = {
      sent: { variant: 'default', text: '已发送', icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      active: { variant: 'default', text: '已启用', icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      failed: { variant: 'destructive', text: '发送失败', icon: <AlertCircle className="h-3 w-3 mr-1" /> },
      inactive: { variant: 'secondary', text: '已停用', icon: <Pause className="h-3 w-3 mr-1" /> },
      pending: { variant: 'secondary', text: '待发送', icon: <Clock className="h-3 w-3 mr-1" /> },
    };
    const badge = badges[status] || { variant: 'secondary', text: status, icon: null };
    return (
      <Badge variant={badge.variant}>
        {badge.icon}
        {badge.text}
      </Badge>
    );
  };

  // 过滤模板
  const filteredTemplates = templates.filter(template => {
    const matchSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       template.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === 'all' || template.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || template.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">短信通知</h1>
          <p className="text-gray-600 mt-2">管理短信模板、发送记录和统计分析</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            短信配置
          </Button>
          <Button onClick={() => {
            setSelectedTemplate(null);
            setSendDialogOpen(true);
          }}>
            <Send className="mr-2 h-4 w-4" />
            发送短信
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates">短信模板</TabsTrigger>
          <TabsTrigger value="records">发送记录</TabsTrigger>
          <TabsTrigger value="stats">统计分析</TabsTrigger>
          <TabsTrigger value="config">通道配置</TabsTrigger>
        </TabsList>

        {/* 短信模板Tab */}
        <TabsContent value="templates" className="space-y-6">
          {/* 筛选栏 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索模板名称或编码"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分类</SelectItem>
                  {Object.entries(categoryMap).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="active">已启用</SelectItem>
                  <SelectItem value="inactive">已停用</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => {
              setSelectedTemplate(null);
              setTemplateDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              新增模板
            </Button>
          </div>

          {/* 模板列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">{template.code}</CardDescription>
                    </div>
                    {getStatusBadge(template.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{categoryMap[template.category]}</Badge>
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 line-clamp-3">
                    {template.content}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>使用次数：{template.usageCount}</span>
                    <span>变量：{template.variables.length}个</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        编辑
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4 mr-1" />
                        复制
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 发送记录Tab */}
        <TabsContent value="records" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>发送记录</CardTitle>
              <CardDescription>查看所有短信发送历史记录</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>时间</TableHead>
                    <TableHead>接收人</TableHead>
                    <TableHead>模板</TableHead>
                    <TableHead>内容</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>渠道</TableHead>
                    <TableHead>费用</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="text-sm">{record.sentAt}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{record.recipientName}</div>
                          <div className="text-xs text-gray-600">{record.recipient}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.templateName}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate text-sm">{record.content}</div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(record.status)}
                        {record.errorMsg && (
                          <div className="text-xs text-red-600 mt-1">{record.errorMsg}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{channelMap[record.channel]}</Badge>
                      </TableCell>
                      <TableCell>¥{record.cost.toFixed(3)}</TableCell>
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

        {/* 统计分析Tab */}
        <TabsContent value="stats" className="space-y-6">
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">总发送量</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{stats.totalSent.toLocaleString()}</div>
                  <div className="flex items-center text-green-600 text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +12.5%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">成功率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-green-600">{stats.successRate}%</div>
                  <div className="flex items-center text-green-600 text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +0.5%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">总费用</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">¥{stats.totalCost.toFixed(2)}</div>
                  <div className="flex items-center text-red-600 text-sm">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    -5.2%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 详细统计 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>发送趋势</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <BarChart3 className="h-16 w-16 mb-4" />
                  <p className="text-sm">图表区域（实际项目可集成图表库）</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>分类统计</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(categoryMap).map(([key, label]) => {
                    const count = templates.filter(t => t.category === key).reduce((sum, t) => sum + t.usageCount, 0);
                    const percentage = stats.totalSent > 0 ? (count / stats.totalSent * 100).toFixed(1) : 0;
                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{label}</span>
                          <span className="text-gray-600">{count} 条 ({percentage}%)</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 通道配置Tab */}
        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>短信通道配置</CardTitle>
              <CardDescription>配置短信服务提供商和API密钥</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  请确保配置正确的短信服务提供商信息，否则无法正常发送短信。
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label>默认通道</Label>
                  <Select defaultValue="aliyun">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aliyun">阿里云短信</SelectItem>
                      <SelectItem value="tencent">腾讯云短信</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold">阿里云短信</h3>
                    <div>
                      <Label>AccessKey ID</Label>
                      <Input placeholder="请输入AccessKey ID" className="mt-2" />
                    </div>
                    <div>
                      <Label>AccessKey Secret</Label>
                      <Input type="password" placeholder="请输入AccessKey Secret" className="mt-2" />
                    </div>
                    <div>
                      <Label>SignName（短信签名）</Label>
                      <Input placeholder="请输入短信签名" className="mt-2" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="aliyun-active" defaultChecked />
                      <Label htmlFor="aliyun-active">启用</Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold">腾讯云短信</h3>
                    <div>
                      <Label>Secret ID</Label>
                      <Input placeholder="请输入Secret ID" className="mt-2" />
                    </div>
                    <div>
                      <Label>Secret Key</Label>
                      <Input type="password" placeholder="请输入Secret Key" className="mt-2" />
                    </div>
                    <div>
                      <Label>SDKAppID</Label>
                      <Input placeholder="请输入SDKAppID" className="mt-2" />
                    </div>
                    <div>
                      <Label>SignName（短信签名）</Label>
                      <Input placeholder="请输入短信签名" className="mt-2" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="tencent-active" />
                      <Label htmlFor="tencent-active">启用</Label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button>保存配置</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
