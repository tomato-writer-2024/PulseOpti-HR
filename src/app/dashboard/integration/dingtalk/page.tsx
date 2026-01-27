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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Link2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  MessageSquare,
  Calendar,
  FileText,
  Users,
  Zap,
  Key,
  Shield,
  Bell,
  Clock,
  AlertCircle,
  Info,
  ExternalLink,
  Copy,
  Eye,
  Edit,
  Trash2,
  Plus,
  MoreVertical,
  Send,
  CalendarDays,
  File,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  Workflow,
} from 'lucide-react';

// 集成状态
type IntegrationStatus = 'disconnected' | 'connected' | 'error';
type SyncStatus = 'idle' | 'syncing' | 'success' | 'failed';
type MessageType = 'text' | 'card' | 'markdown';
type SyncType = 'manual' | 'auto' | 'scheduled';

interface DingTalkConfig {
  appKey: string;
  appSecret: string;
  corpId: string;
  agentId: string;
  enabled: boolean;
}

interface SyncRule {
  id: string;
  name: string;
  type: SyncType;
  module: string;
  direction: 'import' | 'export' | 'bidirectional';
  schedule?: string;
  lastSync?: string;
  status: SyncStatus;
}

interface NotificationRule {
  id: string;
  name: string;
  event: string;
  chatId: string;
  chatName: string;
  template: string;
  enabled: boolean;
}

interface SyncLog {
  id: string;
  type: string;
  module: string;
  recordCount: number;
  status: 'success' | 'failed' | 'partial';
  startTime: string;
  endTime: string;
  duration: number;
  error?: string;
}

interface MessageHistory {
  id: string;
  type: MessageType;
  chatName: string;
  content: string;
  sentAt: string;
  status: 'sent' | 'failed';
  retryCount?: number;
}

export default function DingTalkIntegrationPage() {
  const [activeTab, setActiveTab] = useState('config');
  const [connectionStatus, setConnectionStatus] = useState<IntegrationStatus>('disconnected');
  const [isConnecting, setIsConnecting] = useState(false);

  // 钉钉配置
  const [config, setConfig] = useState<DingTalkConfig>({
    appKey: '',
    appSecret: '',
    corpId: '',
    agentId: '',
    enabled: true,
  });

  // 同步规则
  const [syncRules] = useState<SyncRule[]>([
    {
      id: '1',
      name: '员工信息同步',
      type: 'scheduled',
      module: 'employee',
      direction: 'bidirectional',
      schedule: '每天 02:00',
      lastSync: '2025-04-18 02:00:00',
      status: 'idle',
    },
    {
      id: '2',
      name: '组织架构同步',
      type: 'scheduled',
      module: 'department',
      direction: 'import',
      schedule: '每天 02:30',
      lastSync: '2025-04-18 02:30:00',
      status: 'idle',
    },
    {
      id: '3',
      name: '考勤数据导入',
      type: 'auto',
      module: 'attendance',
      direction: 'import',
      schedule: '实时',
      lastSync: '2025-04-18 10:15:00',
      status: 'idle',
    },
  ]);

  // 通知规则
  const [notificationRules] = useState<NotificationRule[]>([
    {
      id: '1',
      name: '入职通知',
      event: 'employee.onboarding',
      chatId: 'group_123',
      chatName: 'HR工作群',
      template: '新员工入职通知模板',
      enabled: true,
    },
    {
      id: '2',
      name: '离职通知',
      event: 'employee.offboarding',
      chatId: 'group_123',
      chatName: 'HR工作群',
      template: '员工离职通知模板',
      enabled: true,
    },
    {
      id: '3',
      name: '考勤异常提醒',
      event: 'attendance.exception',
      chatId: 'group_456',
      chatName: '考勤管理群',
      template: '考勤异常提醒模板',
      enabled: true,
    },
  ]);

  // 同步日志
  const [syncLogs] = useState<SyncLog[]>([
    {
      id: '1',
      type: '员工信息同步',
      module: 'employee',
      recordCount: 156,
      status: 'success',
      startTime: '2025-04-18 02:00:00',
      endTime: '2025-04-18 02:00:15',
      duration: 15,
    },
    {
      id: '2',
      type: '组织架构同步',
      module: 'department',
      recordCount: 12,
      status: 'success',
      startTime: '2025-04-18 02:30:00',
      endTime: '2025-04-18 02:30:08',
      duration: 8,
    },
    {
      id: '3',
      type: '考勤数据导入',
      module: 'attendance',
      recordCount: 22,
      status: 'partial',
      startTime: '2025-04-18 10:15:00',
      endTime: '2025-04-18 10:15:20',
      duration: 20,
      error: '部分员工考勤数据获取失败',
    },
  ]);

  // 消息历史
  const [messageHistory] = useState<MessageHistory[]>([
    {
      id: '1',
      type: 'card',
      chatName: 'HR工作群',
      content: '新员工入职通知：张三已成功入职技术部，担任前端开发工程师',
      sentAt: '2025-04-18 09:30:00',
      status: 'sent',
    },
    {
      id: '2',
      type: 'card',
      chatName: '考勤管理群',
      content: '考勤异常提醒：李四今日未打卡，请及时处理',
      sentAt: '2025-04-18 09:00:00',
      status: 'sent',
    },
    {
      id: '3',
      type: 'text',
      chatName: 'HR工作群',
      content: '系统维护通知：系统将于今晚22:00进行维护，预计耗时2小时',
      sentAt: '2025-04-17 15:00:00',
      status: 'sent',
    },
  ]);

  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);

  // 连接状态映射
  const statusMap: Record<IntegrationStatus, { icon: React.ReactNode; label: string; color: string; bgColor: string }> = {
    disconnected: {
      icon: <XCircle className="h-5 w-5" />,
      label: '未连接',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
    connected: {
      icon: <CheckCircle className="h-5 w-5" />,
      label: '已连接',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    error: {
      icon: <AlertCircle className="h-5 w-5" />,
      label: '连接错误',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  };

  // 同步状态映射
  const syncStatusMap: Record<SyncStatus, { icon: React.ReactNode; label: string }> = {
    idle: { icon: <Clock className="h-4 w-4" />, label: '等待中' },
    syncing: { icon: <RefreshCw className="h-4 w-4 animate-spin" />, label: '同步中' },
    success: { icon: <CheckCircle className="h-4 w-4" />, label: '同步成功' },
    failed: { icon: <XCircle className="h-4 w-4" />, label: '同步失败' },
  };

  // 处理连接
  const handleConnect = () => {
    setIsConnecting(true);
    // 模拟连接过程
    setTimeout(() => {
      setConnectionStatus('connected');
      setIsConnecting(false);
    }, 2000);
  };

  // 处理断开连接
  const handleDisconnect = () => {
    setConnectionStatus('disconnected');
  };

  // 处理同步
  const handleSync = (ruleId: string) => {
    // 实际项目中应该调用同步API
    console.log('Syncing rule:', ruleId);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">钉钉集成</h1>
          <p className="text-gray-600 mt-2">
            集成钉钉企业应用，实现数据同步和消息通知
            <Badge variant="secondary" className="ml-2">企业协作</Badge>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setConfigDialogOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            配置
          </Button>
          {connectionStatus === 'connected' ? (
            <Button variant="destructive" onClick={handleDisconnect}>
              <XCircle className="mr-2 h-4 w-4" />
              断开连接
            </Button>
          ) : (
            <Button onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  连接中...
                </>
              ) : (
                <>
                  <Link2 className="mr-2 h-4 w-4" />
                  连接钉钉
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* 连接状态 */}
      <Card>
        <CardContent className="pt-6">
          <div className={`flex items-center gap-4 p-4 rounded-lg ${statusMap[connectionStatus].bgColor}`}>
            <div className={statusMap[connectionStatus].color}>
              {statusMap[connectionStatus].icon}
            </div>
            <div className="flex-1">
              <div className="font-medium">{statusMap[connectionStatus].label}</div>
              <div className="text-sm text-gray-600">
                {connectionStatus === 'connected' && '钉钉集成已正常工作，可以进行数据同步和消息通知'}
                {connectionStatus === 'disconnected' && '请先配置钉钉应用信息，然后点击"连接钉钉"按钮'}
                {connectionStatus === 'error' && '连接失败，请检查配置信息是否正确'}
              </div>
            </div>
            {connectionStatus === 'connected' && (
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500">已连接</Badge>
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 功能介绍 */}
      {connectionStatus === 'connected' && (
        <Alert>
          <Zap className="h-4 w-4" />
          <AlertDescription>
            钉钉集成支持员工信息同步、组织架构同步、考勤数据导入、智能消息通知等功能，实现HR系统与钉钉的无缝对接。
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="config">配置</TabsTrigger>
          <TabsTrigger value="sync">数据同步</TabsTrigger>
          <TabsTrigger value="notification">消息通知</TabsTrigger>
          <TabsTrigger value="logs">同步日志</TabsTrigger>
          <TabsTrigger value="messages">消息历史</TabsTrigger>
        </TabsList>

        {/* 配置Tab */}
        <TabsContent value="config" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 应用配置 */}
            <Card>
              <CardHeader>
                <CardTitle>应用配置</CardTitle>
                <CardDescription>钉钉企业应用的基本配置信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="appKey">App Key</Label>
                  <Input
                    id="appKey"
                    value={config.appKey}
                    onChange={(e) => setConfig({ ...config, appKey: e.target.value })}
                    placeholder="请输入钉钉App Key"
                    disabled={connectionStatus === 'connected'}
                  />
                </div>
                <div>
                  <Label htmlFor="appSecret">App Secret</Label>
                  <Input
                    id="appSecret"
                    type="password"
                    value={config.appSecret}
                    onChange={(e) => setConfig({ ...config, appSecret: e.target.value })}
                    placeholder="请输入钉钉App Secret"
                    disabled={connectionStatus === 'connected'}
                  />
                </div>
                <div>
                  <Label htmlFor="corpId">企业ID (CorpId)</Label>
                  <Input
                    id="corpId"
                    value={config.corpId}
                    onChange={(e) => setConfig({ ...config, corpId: e.target.value })}
                    placeholder="请输入企业ID"
                    disabled={connectionStatus === 'connected'}
                  />
                </div>
                <div>
                  <Label htmlFor="agentId">应用ID (AgentId)</Label>
                  <Input
                    id="agentId"
                    value={config.agentId}
                    onChange={(e) => setConfig({ ...config, agentId: e.target.value })}
                    placeholder="请输入应用ID"
                    disabled={connectionStatus === 'connected'}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 功能配置 */}
            <Card>
              <CardHeader>
                <CardTitle>功能配置</CardTitle>
                <CardDescription>配置钉钉集成的各项功能</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">启用集成</div>
                    <div className="text-sm text-gray-600">启用或禁用钉钉集成功能</div>
                  </div>
                  <Switch
                    checked={config.enabled}
                    onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
                    disabled={connectionStatus !== 'connected'}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">员工信息同步</div>
                    <div className="text-sm text-gray-600">自动同步员工信息</div>
                  </div>
                  <Switch defaultChecked disabled={connectionStatus !== 'connected'} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">组织架构同步</div>
                    <div className="text-sm text-gray-600">自动同步组织架构</div>
                  </div>
                  <Switch defaultChecked disabled={connectionStatus !== 'connected'} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">考勤数据导入</div>
                    <div className="text-sm text-gray-600">自动导入考勤数据</div>
                  </div>
                  <Switch defaultChecked disabled={connectionStatus !== 'connected'} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">智能消息通知</div>
                    <div className="text-sm text-gray-600">发送钉钉消息通知</div>
                  </div>
                  <Switch defaultChecked disabled={connectionStatus !== 'connected'} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 帮助文档 */}
          <Card>
            <CardHeader>
              <CardTitle>帮助文档</CardTitle>
              <CardDescription>如何获取钉钉应用配置信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  请在钉钉开放平台创建企业应用，获取应用配置信息。具体步骤请参考
                  <Button variant="link" className="h-auto p-0 ml-1">
                    钉钉开放平台文档
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </AlertDescription>
              </Alert>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs flex-shrink-0">1</div>
                  <div>登录钉钉开放平台（https://open.dingtalk.com/）</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs flex-shrink-0">2</div>
                  <div>进入{"应用开发 -> 企业内部开发 -> 创建应用"}</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs flex-shrink-0">3</div>
                  <div>创建应用后，在应用详情中获取 AppKey、AppSecret、AgentId</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs flex-shrink-0">4</div>
                  <div>在"企业信息"中获取企业ID (CorpId)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 数据同步Tab */}
        <TabsContent value="sync" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>同步规则</CardTitle>
                  <CardDescription>配置和管理数据同步规则</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  新建规则
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>规则名称</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>模块</TableHead>
                    <TableHead>同步方向</TableHead>
                    <TableHead>计划</TableHead>
                    <TableHead>上次同步</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {syncRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800">{rule.module}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            rule.direction === 'bidirectional'
                              ? 'bg-purple-100 text-purple-800'
                              : rule.direction === 'import'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-orange-100 text-orange-800'
                          }
                        >
                          {rule.direction === 'bidirectional'
                            ? '双向'
                            : rule.direction === 'import'
                            ? '导入'
                            : '导出'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{rule.schedule}</TableCell>
                      <TableCell className="text-sm">{rule.lastSync || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {syncStatusMap[rule.status].icon}
                          <span className="text-sm">{syncStatusMap[rule.status].label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleSync(rule.id)}>
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 消息通知Tab */}
        <TabsContent value="notification" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>通知规则</CardTitle>
                  <CardDescription>配置钉钉消息通知规则</CardDescription>
                </div>
                <Button onClick={() => setMessageDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  新建规则
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>规则名称</TableHead>
                    <TableHead>事件</TableHead>
                    <TableHead>目标群组</TableHead>
                    <TableHead>模板</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notificationRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>
                        <Badge className="bg-purple-100 text-purple-800">{rule.event}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                          <span>{rule.chatName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{rule.template}</TableCell>
                      <TableCell>
                        <Switch checked={rule.enabled} />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 同步日志Tab */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>同步日志</CardTitle>
              <CardDescription>查看数据同步的历史记录</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>同步类型</TableHead>
                    <TableHead>模块</TableHead>
                    <TableHead>记录数</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>开始时间</TableHead>
                    <TableHead>结束时间</TableHead>
                    <TableHead>耗时</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {syncLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.type}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800">{log.module}</Badge>
                      </TableCell>
                      <TableCell>{log.recordCount} 条</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {log.status === 'success' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : log.status === 'failed' ? (
                            <XCircle className="h-4 w-4 text-red-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          )}
                          <span className="text-sm capitalize">{log.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{log.startTime}</TableCell>
                      <TableCell className="text-sm">{log.endTime}</TableCell>
                      <TableCell className="text-sm">{log.duration}s</TableCell>
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

        {/* 消息历史Tab */}
        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>消息历史</CardTitle>
              <CardDescription>查看发送到钉钉的消息历史</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>消息类型</TableHead>
                    <TableHead>目标群组</TableHead>
                    <TableHead>内容</TableHead>
                    <TableHead>发送时间</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messageHistory.map((msg) => (
                    <TableRow key={msg.id}>
                      <TableCell>
                        <Badge variant="outline">{msg.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                          <span>{msg.chatName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="truncate">{msg.content}</div>
                      </TableCell>
                      <TableCell className="text-sm">{msg.sentAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {msg.status === 'sent' ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm capitalize">{msg.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {msg.status === 'failed' && (
                            <Button variant="ghost" size="sm">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 配置弹窗 */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>钉钉应用配置</DialogTitle>
            <DialogDescription>
              请填写钉钉企业应用的配置信息
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="dialogAppKey">App Key *</Label>
              <Input
                id="dialogAppKey"
                placeholder="请输入钉钉App Key"
              />
            </div>
            <div>
              <Label htmlFor="dialogAppSecret">App Secret *</Label>
              <Input
                id="dialogAppSecret"
                type="password"
                placeholder="请输入钉钉App Secret"
              />
            </div>
            <div>
              <Label htmlFor="dialogCorpId">企业ID (CorpId) *</Label>
              <Input
                id="dialogCorpId"
                placeholder="请输入企业ID"
              />
            </div>
            <div>
              <Label htmlFor="dialogAgentId">应用ID (AgentId) *</Label>
              <Input
                id="dialogAgentId"
                placeholder="请输入应用ID"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={() => {
              setConfigDialogOpen(false);
              // 保存配置
            }}>
              保存配置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 发送消息弹窗 */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>发送消息</DialogTitle>
            <DialogDescription>
              发送消息到钉钉群
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="chatSelect">目标群组 *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择目标群组" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="group_123">HR工作群</SelectItem>
                  <SelectItem value="group_456">考勤管理群</SelectItem>
                  <SelectItem value="group_789">管理层群</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="messageType">消息类型 *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择消息类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">文本消息</SelectItem>
                  <SelectItem value="card">卡片消息</SelectItem>
                  <SelectItem value="markdown">Markdown消息</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="messageContent">消息内容 *</Label>
              <Textarea
                id="messageContent"
                placeholder="请输入消息内容"
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>
              取消
            </Button>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              发送消息
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
