'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Plus,
  Edit,
  Trash2,
  Clock,
  ShieldAlert,
  Zap,
  Activity,
  Database,
  Server,
  Network,
  Cpu,
  HardDrive,
} from 'lucide-react';

interface AlertData {
  id: string;
  type: 'system' | 'performance' | 'security' | 'business';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  source: string;
  acknowledged: boolean;
  resolved: boolean;
  resolvedAt?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

interface AlertRule {
  id: string;
  name: string;
  type: 'system' | 'performance' | 'security' | 'business';
  condition: string;
  threshold: number;
  enabled: boolean;
  notificationChannels: string[];
  recipients: string[];
  triggeredCount: number;
  lastTriggered?: string;
  createdAt: string;
}

export default function AlertMonitorPage() {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [rules, setRules] = useState<AlertRule[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | AlertData['severity']>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | AlertData['type']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('all');

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));

      setAlerts([
        {
          id: '1',
          type: 'performance',
          severity: 'critical',
          title: '服务器响应时间过长',
          message: 'API响应时间超过5秒，影响用户体验',
          source: 'api-gateway',
          acknowledged: false,
          resolved: false,
          createdAt: '2025-04-18 14:32:15',
          metadata: { endpoint: '/api/users', duration: 5200 },
        },
        {
          id: '2',
          type: 'security',
          severity: 'high',
          title: '检测到异常登录',
          message: '用户张三从异常IP地址登录',
          source: 'auth-service',
          acknowledged: true,
          resolved: false,
          createdAt: '2025-04-18 13:15:42',
          metadata: { userId: 'USER001', ip: '192.168.1.100' },
        },
        {
          id: '3',
          type: 'system',
          severity: 'medium',
          title: '磁盘空间不足',
          message: '服务器磁盘使用率超过80%',
          source: 'server-01',
          acknowledged: false,
          resolved: false,
          createdAt: '2025-04-18 12:00:00',
          metadata: { usage: 85, total: 1024, used: 870 },
        },
        {
          id: '4',
          type: 'business',
          severity: 'low',
          title: '新用户注册数下降',
          message: '今日新用户注册数较昨日下降20%',
          source: 'analytics',
          acknowledged: true,
          resolved: true,
          resolvedAt: '2025-04-18 11:30:00',
          createdAt: '2025-04-18 10:00:00',
          metadata: { today: 45, yesterday: 56, change: -20 },
        },
        {
          id: '5',
          type: 'performance',
          severity: 'medium',
          title: '数据库查询慢',
          message: '数据库查询平均响应时间超过2秒',
          source: 'database',
          acknowledged: false,
          resolved: false,
          createdAt: '2025-04-18 09:45:30',
          metadata: { query: 'SELECT * FROM users', duration: 2300 },
        },
      ]);

      setRules([
        {
          id: '1',
          name: 'API响应时间监控',
          type: 'performance',
          condition: 'response_time > 5000',
          threshold: 5000,
          enabled: true,
          notificationChannels: ['email', 'slack'],
          recipients: ['admin@example.com'],
          triggeredCount: 5,
          lastTriggered: '2025-04-18 14:32:15',
          createdAt: '2025-01-01',
        },
        {
          id: '2',
          name: '异常登录检测',
          type: 'security',
          condition: 'login_from_new_ip',
          threshold: 0,
          enabled: true,
          notificationChannels: ['email', 'sms'],
          recipients: ['security@example.com'],
          triggeredCount: 3,
          lastTriggered: '2025-04-18 13:15:42',
          createdAt: '2025-01-15',
        },
        {
          id: '3',
          name: '磁盘空间监控',
          type: 'system',
          condition: 'disk_usage > 80',
          threshold: 80,
          enabled: true,
          notificationChannels: ['email'],
          recipients: ['ops@example.com'],
          triggeredCount: 2,
          lastTriggered: '2025-04-18 12:00:00',
          createdAt: '2025-02-01',
        },
        {
          id: '4',
          name: '用户注册趋势',
          type: 'business',
          condition: 'registration_drop > 20',
          threshold: 20,
          enabled: false,
          notificationChannels: ['slack'],
          recipients: ['product@example.com'],
          triggeredCount: 1,
          createdAt: '2025-03-01',
        },
      ]);

      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesSearch =
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.source.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
      const matchesType = typeFilter === 'all' || alert.type === typeFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && !alert.resolved) ||
        (statusFilter === 'resolved' && alert.resolved);
      return matchesSearch && matchesSeverity && matchesType && matchesStatus;
    });
  }, [alerts, searchTerm, severityFilter, typeFilter, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: alerts.length,
      critical: alerts.filter((a) => a.severity === 'critical' && !a.resolved).length,
      high: alerts.filter((a) => a.severity === 'high' && !a.resolved).length,
      medium: alerts.filter((a) => a.severity === 'medium' && !a.resolved).length,
      low: alerts.filter((a) => a.severity === 'low' && !a.resolved).length,
      resolved: alerts.filter((a) => a.resolved).length,
      acknowledged: alerts.filter((a) => a.acknowledged).length,
      activeRules: rules.filter((r) => r.enabled).length,
    };
  }, [alerts, rules]);

  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    };
    const labels: Record<string, string> = {
      low: '低',
      medium: '中',
      high: '高',
      critical: '紧急',
    };
    return <Badge className={colors[severity]}>{labels[severity]}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      system: Server,
      performance: Activity,
      security: ShieldAlert,
      business: Zap,
    };
    return icons[type] || Bell;
  };

  const getTypeBadge = (type: string) => {
    const icons: Record<string, any> = {
      system: Server,
      performance: Activity,
      security: ShieldAlert,
      business: Zap,
    };
    const Icon = icons[type] || Bell;
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {type}
      </Badge>
    );
  };

  const handleAcknowledge = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  };

  const handleResolve = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, resolved: true, resolvedAt: new Date().toLocaleString() }
          : a
      )
    );
  };

  const handleToggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">告警监控</h1>
          <p className="text-muted-foreground mt-1">实时监控和告警管理</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新建规则
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总告警</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">已处理 {stats.resolved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">紧急</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
            <p className="text-xs text-muted-foreground mt-1">需立即处理</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">高优先级</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.high}</div>
            <p className="text-xs text-muted-foreground mt-1">
              中 + 低 {stats.medium + stats.low}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已确认</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.acknowledged}</div>
            <p className="text-xs text-muted-foreground mt-1">
              占比 {((stats.acknowledged / stats.total) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃规则</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeRules}</div>
            <p className="text-xs text-muted-foreground mt-1">
              总规则 {rules.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts">
        <TabsList>
          <TabsTrigger value="alerts">
            <Bell className="h-4 w-4 mr-2" />
            告警列表
          </TabsTrigger>
          <TabsTrigger value="rules">
            <Activity className="h-4 w-4 mr-2" />
            告警规则
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>告警列表 ({filteredAlerts.length})</CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索告警..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as any)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="严重级别" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部级别</SelectItem>
                      <SelectItem value="critical">紧急</SelectItem>
                      <SelectItem value="high">高</SelectItem>
                      <SelectItem value="medium">中</SelectItem>
                      <SelectItem value="low">低</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="system">系统</SelectItem>
                      <SelectItem value="performance">性能</SelectItem>
                      <SelectItem value="security">安全</SelectItem>
                      <SelectItem value="business">业务</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="active">未解决</SelectItem>
                      <SelectItem value="resolved">已解决</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  没有找到匹配的告警
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAlerts.map((alert) => {
                    const TypeIcon = getTypeIcon(alert.type);
                    return (
                      <Card key={alert.id} className={`hover:shadow-md transition-all ${
                        alert.resolved ? 'opacity-60' : ''
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`p-2 rounded-lg ${
                                alert.severity === 'critical' ? 'bg-red-100' :
                                alert.severity === 'high' ? 'bg-orange-100' :
                                alert.severity === 'medium' ? 'bg-yellow-100' : 'bg-gray-100'
                              }`}>
                                <TypeIcon className={`h-5 w-5 ${
                                  alert.severity === 'critical' ? 'text-red-600' :
                                  alert.severity === 'high' ? 'text-orange-600' :
                                  alert.severity === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                  <h3 className="font-semibold">{alert.title}</h3>
                                  {getSeverityBadge(alert.severity)}
                                  {getTypeBadge(alert.type)}
                                  {alert.acknowledged && (
                                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                                      已确认
                                    </Badge>
                                  )}
                                  {alert.resolved && (
                                    <Badge variant="outline" className="text-green-600 border-green-600">
                                      已解决
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>来源: {alert.source}</span>
                                  <span>·</span>
                                  <span>时间: {alert.createdAt}</span>
                                  {alert.resolvedAt && (
                                    <>
                                      <span>·</span>
                                      <span>解决时间: {alert.resolvedAt}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => { setSelectedAlert(alert); setViewDialogOpen(true); }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {!alert.acknowledged && !alert.resolved && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAcknowledge(alert.id)}
                                >
                                  确认
                                </Button>
                              )}
                              {!alert.resolved && (
                                <Button
                                  size="sm"
                                  onClick={() => handleResolve(alert.id)}
                                >
                                  解决
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>告警规则 ({rules.length})</CardTitle>
              <CardDescription>配置和管理告警触发规则</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rules.map((rule) => {
                  const TypeIcon = getTypeIcon(rule.type);
                  return (
                    <Card key={rule.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <TypeIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold">{rule.name}</h3>
                                {getTypeBadge(rule.type)}
                                {rule.enabled && (
                                  <Badge variant="outline" className="text-green-600 border-green-600">
                                    已启用
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                条件: {rule.condition}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>触发次数: {rule.triggeredCount}</span>
                                <span>·</span>
                                <span>
                                  最后触发: {rule.lastTriggered || '从未触发'}
                                </span>
                                <span>·</span>
                                <span>
                                  通知渠道: {rule.notificationChannels.join(', ')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={rule.enabled}
                              onCheckedChange={() => handleToggleRule(rule.id)}
                            />
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>告警详情</DialogTitle>
          </DialogHeader>
          {selectedAlert && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b">
                  <div className={`p-3 rounded-lg ${
                    selectedAlert.severity === 'critical' ? 'bg-red-100' :
                    selectedAlert.severity === 'high' ? 'bg-orange-100' :
                    selectedAlert.severity === 'medium' ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    {(() => {
                      const Icon = getTypeIcon(selectedAlert.type);
                      return <Icon className={`h-6 w-6 ${
                        selectedAlert.severity === 'critical' ? 'text-red-600' :
                        selectedAlert.severity === 'high' ? 'text-orange-600' :
                        selectedAlert.severity === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                      }`} />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{selectedAlert.title}</h3>
                      {getSeverityBadge(selectedAlert.severity)}
                      {getTypeBadge(selectedAlert.type)}
                    </div>
                    <p className="text-muted-foreground">{selectedAlert.message}</p>
                  </div>
                  {selectedAlert.resolved && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      已解决
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">来源</p>
                    <p className="font-medium">{selectedAlert.source}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">创建时间</p>
                    <p className="font-medium">{selectedAlert.createdAt}</p>
                  </div>
                  {selectedAlert.resolvedAt && (
                    <div>
                      <p className="text-sm text-muted-foreground">解决时间</p>
                      <p className="font-medium">{selectedAlert.resolvedAt}</p>
                    </div>
                  )}
                </div>

                {selectedAlert.metadata && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">详细信息</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(selectedAlert.metadata).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-muted-foreground capitalize">{key}</span>
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              关闭
            </Button>
            {!selectedAlert?.resolved && (
              <Button onClick={() => { if (selectedAlert) { handleResolve(selectedAlert.id); setViewDialogOpen(false); } }}>
                解决告警
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
