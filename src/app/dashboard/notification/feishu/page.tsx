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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
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
  AtSign,
  Hash,
  Image as ImageIcon,
  FileText,
  Link2,
  MessageCircle,
  Bot,
  User,
  Check,
  X,
  Paperclip,
  TrendingUp,
} from 'lucide-react';

interface FeishuMessage {
  id: string;
  msgType: 'text' | 'post' | 'image' | 'file' | 'interactive' | 'card';
  content: any;
  receiveId: string;
  receiveIdType: 'user_id' | 'union_id' | 'open_id' | 'email' | 'chat_id';
  status: 'sent' | 'failed' | 'pending';
  msgId?: string;
  sendAt: string;
  errorMsg?: string;
}

interface FeishuTemplate {
  id: string;
  name: string;
  type: 'text' | 'post' | 'card';
  content: any;
  category: 'attendance' | 'leave' | 'interview' | 'performance' | 'training' | 'system' | 'approval';
  status: 'active' | 'inactive';
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface FeishuConfig {
  appId: string;
  appSecret: string;
  encryptKey: string;
  verificationToken: string;
  enabled: boolean;
}

export default function FeishuNotificationPage() {
  const [activeTab, setActiveTab] = useState('messages');
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // 消息类型选择
  const [msgType, setMsgType] = useState<'text' | 'post' | 'card'>('text');
  const [textContent, setTextContent] = useState('');
  const [receiveId, setReceiveId] = useState('');
  const [receiveIdType, setReceiveIdType] = useState<'user_id' | 'union_id' | 'open_id' | 'email' | 'chat_id'>('user_id');

  // 飞书消息数据
  const [messages, setMessages] = useState<FeishuMessage[]>([
    {
      id: '1',
      msgType: 'text',
      content: { text: '您有一条新的请假申请需要审批' },
      receiveId: 'ou_xxxxxxxxx',
      receiveIdType: 'user_id',
      status: 'sent',
      msgId: 'om_xxxxxxxxx',
      sendAt: '2025-04-18 10:30:15',
    },
    {
      id: '2',
      msgType: 'card',
      content: { title: '面试提醒', content: '您有一个面试安排在明天14:00' },
      receiveId: 'ou_xxxxxxxxx',
      receiveIdType: 'user_id',
      status: 'sent',
      msgId: 'om_xxxxxxxxx',
      sendAt: '2025-04-18 09:15:30',
    },
    {
      id: '3',
      msgType: 'post',
      content: { zh_cn: { title: '绩效评估通知', content: [{ tag: 'text', text: '您的Q1绩效评估已完成' }] } },
      receiveId: 'oc_xxxxxxxxx',
      receiveIdType: 'chat_id',
      status: 'sent',
      msgId: 'om_xxxxxxxxx',
      sendAt: '2025-04-17 16:00:20',
    },
    {
      id: '4',
      msgType: 'text',
      content: { text: '您的密码重置请求已通过' },
      receiveId: 'ou_xxxxxxxxx',
      receiveIdType: 'user_id',
      status: 'failed',
      sendAt: '2025-04-17 14:20:10',
      errorMsg: '用户不存在或已被禁用',
    },
  ]);

  // 飞书模板数据
  const [templates, setTemplates] = useState<FeishuTemplate[]>([
    {
      id: '1',
      name: '请假审批通知',
      type: 'card',
      content: {
        config: { wide_screen_mode: true },
        header: { title: { tag: 'plain_text', content: '请假审批通知' } },
        elements: [
          { tag: 'div', text: { tag: 'lark_md', content: '您有新的请假申请待审批' } },
          { tag: 'action', actions: [{ tag: 'button', text: { tag: 'plain_text', content: '同意' }, type: 'primary' }, { tag: 'button', text: { tag: 'plain_text', content: '拒绝' } }] },
        ],
      },
      category: 'approval',
      status: 'active',
      usageCount: 234,
      createdAt: '2025-01-15',
      updatedAt: '2025-04-01',
    },
    {
      id: '2',
      name: '面试邀请',
      type: 'card',
      content: {
        config: { wide_screen_mode: true },
        header: { title: { tag: 'plain_text', content: '面试邀请' }, template: 'blue' },
        elements: [
          { tag: 'div', text: { tag: 'lark_md', content: '诚挚邀请您参加面试' } },
        ],
      },
      category: 'interview',
      status: 'active',
      usageCount: 156,
      createdAt: '2025-02-01',
      updatedAt: '2025-04-10',
    },
    {
      id: '3',
      name: '打卡成功通知',
      type: 'text',
      content: { text: '您的打卡已成功，时间：{clockTime}' },
      category: 'attendance',
      status: 'active',
      usageCount: 892,
      createdAt: '2025-01-10',
      updatedAt: '2025-03-20',
    },
  ]);

  // 飞书配置
  const [config, setConfig] = useState<FeishuConfig>({
    appId: '',
    appSecret: '',
    encryptKey: '',
    verificationToken: '',
    enabled: true,
  });

  // 分类映射
  const categoryMap: Record<string, string> = {
    attendance: '考勤',
    leave: '请假',
    interview: '面试',
    performance: '绩效',
    training: '培训',
    system: '系统',
    approval: '审批',
  };

  // 消息类型映射
  const msgTypeMap: Record<string, string> = {
    text: '文本消息',
    post: '富文本消息',
    image: '图片消息',
    file: '文件消息',
    interactive: '卡片消息',
    card: '卡片消息',
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

  // 获取消息类型图标
  const getMsgTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      text: <MessageSquare className="h-4 w-4" />,
      post: <FileText className="h-4 w-4" />,
      image: <ImageIcon className="h-4 w-4" />,
      file: <Paperclip className="h-4 w-4" />,
      card: <MessageSquare className="h-4 w-4" />,
      interactive: <Bot className="h-4 w-4" />,
    };
    return icons[type] || <MessageSquare className="h-4 w-4" />;
  };

  // 渲染消息内容预览
  const renderContentPreview = (message: FeishuMessage) => {
    if (message.msgType === 'text') {
      return <div className="truncate text-sm">{message.content.text}</div>;
    } else if (message.msgType === 'card' || message.msgType === 'interactive') {
      return <div className="truncate text-sm text-blue-600">{message.content.title || '卡片消息'}</div>;
    } else if (message.msgType === 'post') {
      const title = message.content.zh_cn?.title;
      return <div className="truncate text-sm">{title || '富文本消息'}</div>;
    }
    return <div className="text-sm text-gray-500">不支持的消息类型</div>;
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">飞书通知</h1>
          <p className="text-gray-600 mt-2">通过飞书发送通知和消息，提升协作效率</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            飞书配置
          </Button>
          <Button onClick={() => setSendDialogOpen(true)}>
            <Send className="mr-2 h-4 w-4" />
            发送消息
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="messages">发送记录</TabsTrigger>
          <TabsTrigger value="templates">消息模板</TabsTrigger>
          <TabsTrigger value="stats">统计分析</TabsTrigger>
          <TabsTrigger value="config">配置管理</TabsTrigger>
        </TabsList>

        {/* 发送记录Tab */}
        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>发送记录</CardTitle>
              <CardDescription>查看所有飞书消息发送历史</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>发送时间</TableHead>
                    <TableHead>接收人</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>内容</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>消息ID</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell className="text-sm">{message.sendAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>
                              <User className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{message.receiveId.slice(0, 8)}...</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getMsgTypeIcon(message.msgType)}
                          <Badge variant="outline">{msgTypeMap[message.msgType]}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        {renderContentPreview(message)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(message.status)}
                        {message.errorMsg && (
                          <div className="text-xs text-red-600 mt-1">{message.errorMsg}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-gray-500">{message.msgId ? message.msgId.slice(0, 8) : '-'}</span>
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

        {/* 消息模板Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索模板名称"
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
            </div>
            <Button onClick={() => setTemplateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              新增模板
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">{msgTypeMap[template.type]}</CardDescription>
                    </div>
                    {getStatusBadge(template.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{categoryMap[template.category]}</Badge>
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 line-clamp-3">
                    {template.type === 'text' ? template.content.text : '卡片消息模板'}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>使用次数：{template.usageCount}</span>
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

        {/* 统计分析Tab */}
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">总发送量</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{messages.length}</div>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +15.2%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">成功率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {((messages.filter(m => m.status === 'sent').length / messages.length) * 100).toFixed(1)}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">模板总数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{templates.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">活跃模板</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{templates.filter(t => t.status === 'active').length}</div>
              </CardContent>
            </Card>
          </div>

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
        </TabsContent>

        {/* 配置管理Tab */}
        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>飞书应用配置</CardTitle>
              <CardDescription>配置飞书开放平台应用信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  请确保在飞书开放平台创建应用并获取App ID和App Secret。
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">启用飞书通知</Label>
                  <Switch checked={config.enabled} onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>App ID</Label>
                      <Input
                        placeholder="cli_xxxxxxxxx"
                        value={config.appId}
                        onChange={(e) => setConfig({ ...config, appId: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>App Secret</Label>
                      <Input
                        type="password"
                        placeholder="请输入App Secret"
                        value={config.appSecret}
                        onChange={(e) => setConfig({ ...config, appSecret: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Encrypt Key（事件加密）</Label>
                      <Input
                        type="password"
                        placeholder="请输入Encrypt Key"
                        value={config.encryptKey}
                        onChange={(e) => setConfig({ ...config, encryptKey: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Verification Token（验证令牌）</Label>
                      <Input
                        placeholder="请输入Verification Token"
                        value={config.verificationToken}
                        onChange={(e) => setConfig({ ...config, verificationToken: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">配置说明</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>1. 登录飞书开放平台（open.feishu.cn）</li>
                    <li>2. 创建自建应用或企业自建应用</li>
                    <li>3. 在应用详情页获取App ID和App Secret</li>
                    <li>4. 配置事件订阅，设置Encrypt Key和Verification Token</li>
                    <li>5. 开启所需的权限（消息通知、用户信息等）</li>
                  </ul>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button>保存配置</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 发送消息弹窗 */}
      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>发送飞书消息</DialogTitle>
            <DialogDescription>
              选择消息类型并填写接收人信息
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>消息类型</Label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <Button
                  variant={msgType === 'text' ? 'default' : 'outline'}
                  onClick={() => setMsgType('text')}
                  className="h-20 flex flex-col gap-2"
                >
                  <MessageSquare className="h-6 w-6" />
                  <span>文本消息</span>
                </Button>
                <Button
                  variant={msgType === 'post' ? 'default' : 'outline'}
                  onClick={() => setMsgType('post')}
                  className="h-20 flex flex-col gap-2"
                >
                  <FileText className="h-6 w-6" />
                  <span>富文本消息</span>
                </Button>
                <Button
                  variant={msgType === 'card' ? 'default' : 'outline'}
                  onClick={() => setMsgType('card')}
                  className="h-20 flex flex-col gap-2"
                >
                  <MessageSquare className="h-6 w-6" />
                  <span>卡片消息</span>
                </Button>
              </div>
            </div>

            <div>
              <Label>接收人ID</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="请输入接收人ID"
                  value={receiveId}
                  onChange={(e) => setReceiveId(e.target.value)}
                />
                <Select value={receiveIdType} onValueChange={(value: any) => setReceiveIdType(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user_id">user_id</SelectItem>
                    <SelectItem value="union_id">union_id</SelectItem>
                    <SelectItem value="open_id">open_id</SelectItem>
                    <SelectItem value="email">email</SelectItem>
                    <SelectItem value="chat_id">chat_id</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {msgType === 'text' && (
              <div>
                <Label>消息内容</Label>
                <Textarea
                  placeholder="请输入消息内容"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="mt-2"
                  rows={6}
                />
              </div>
            )}

            {msgType === 'card' && (
              <Alert>
                <Bot className="h-4 w-4" />
                <AlertDescription>
                  卡片消息需要在模板管理中创建模板，选择模板后发送。
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={() => {
              // TODO: 实际发送逻辑
              setSendDialogOpen(false);
            }}>
              发送
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
