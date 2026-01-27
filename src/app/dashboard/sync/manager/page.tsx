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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
  RefreshCw,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Settings,
  FileText,
  Calendar,
  BarChart3,
  Database,
  Server,
  Network,
  Filter,
  Search,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Activity,
  Zap,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface SyncTask {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'manual';
  source: string;
  target: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  progress: number;
  recordsProcessed: number;
  totalRecords: number;
  errorCount: number;
  retryCount: number;
  lastRun?: string;
  nextRun?: string;
  enabled: boolean;
  schedule: string;
  createdAt: string;
  updatedAt: string;
}

interface SyncLog {
  id: string;
  taskId: string;
  taskName: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

export default function DataSyncManager() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<SyncTask[]>([]);
  const [logs, setLogs] = useState<SyncLog[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SyncTask['status']>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | SyncTask['type']>('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<SyncTask | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));

      setTasks([
        {
          id: '1',
          name: '员工数据同步',
          type: 'incremental',
          source: 'HR系统',
          target: '主数据库',
          status: 'running',
          priority: 'high',
          progress: 75,
          recordsProcessed: 750,
          totalRecords: 1000,
          errorCount: 0,
          retryCount: 0,
          lastRun: '2025-04-17 10:00:00',
          nextRun: '2025-04-18 10:00:00',
          enabled: true,
          schedule: '0 10 * * *',
          createdAt: '2025-01-01',
          updatedAt: '2025-04-18',
        },
        {
          id: '2',
          name: '考勤数据同步',
          type: 'incremental',
          source: '考勤机',
          target: '数据库',
          status: 'completed',
          priority: 'medium',
          progress: 100,
          recordsProcessed: 500,
          totalRecords: 500,
          errorCount: 0,
          retryCount: 0,
          lastRun: '2025-04-18 08:00:00',
          nextRun: '2025-04-19 08:00:00',
          enabled: true,
          schedule: '0 8 * * *',
          createdAt: '2025-01-15',
          updatedAt: '2025-04-18',
        },
        {
          id: '3',
          name: '薪资数据同步',
          type: 'full',
          source: '财务系统',
          target: '主数据库',
          status: 'failed',
          priority: 'high',
          progress: 45,
          recordsProcessed: 450,
          totalRecords: 1000,
          errorCount: 3,
          retryCount: 1,
          lastRun: '2025-04-18 09:00:00',
          nextRun: '2025-04-18 12:00:00',
          enabled: true,
          schedule: '0 */4 * * *',
          createdAt: '2025-02-01',
          updatedAt: '2025-04-18',
        },
        {
          id: '4',
          name: '组织架构同步',
          type: 'full',
          source: 'OA系统',
          target: '主数据库',
          status: 'pending',
          priority: 'low',
          progress: 0,
          recordsProcessed: 0,
          totalRecords: 200,
          errorCount: 0,
          retryCount: 0,
          lastRun: '2025-04-17 18:00:00',
          nextRun: '2025-04-18 18:00:00',
          enabled: true,
          schedule: '0 18 * * *',
          createdAt: '2025-03-01',
          updatedAt: '2025-04-17',
        },
      ]);

      setLogs([
        { id: '1', taskId: '1', taskName: '员工数据同步', level: 'info', message: '同步任务开始执行', timestamp: '2025-04-18 10:30:00' },
        { id: '2', taskId: '1', taskName: '员工数据同步', level: 'info', message: '已处理 750/1000 条记录', timestamp: '2025-04-18 10:35:00' },
        { id: '3', taskId: '3', taskName: '薪资数据同步', level: 'error', message: '连接财务系统失败', timestamp: '2025-04-18 09:05:00' },
        { id: '4', taskId: '3', taskName: '薪资数据同步', level: 'warning', message: '第 1 次重试中', timestamp: '2025-04-18 09:10:00' },
        { id: '5', taskId: '2', taskName: '考勤数据同步', level: 'info', message: '同步任务完成', timestamp: '2025-04-18 08:15:00' },
      ]);

      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.target.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesType = typeFilter === 'all' || task.type === typeFilter;
      const matchesSource = sourceFilter === 'all' || task.source === sourceFilter;
      return matchesSearch && matchesStatus && matchesType && matchesSource;
    });
  }, [tasks, searchTerm, statusFilter, typeFilter, sourceFilter]);

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      running: tasks.filter((t) => t.status === 'running').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
      failed: tasks.filter((t) => t.status === 'failed').length,
      enabled: tasks.filter((t) => t.enabled).length,
      totalRecords: tasks.reduce((sum, t) => sum + t.recordsProcessed, 0),
      errorCount: tasks.reduce((sum, t) => sum + t.errorCount, 0),
    };
  }, [tasks]);

  const getStatusBadge = (status: SyncTask['status']) => {
    const colors: Record<string, string> = {
      pending: 'bg-gray-100 text-gray-800',
      running: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    const labels: Record<string, string> = {
      pending: '等待中',
      running: '运行中',
      completed: '已完成',
      failed: '失败',
      cancelled: '已取消',
    };
    return <Badge className={colors[status]}>{labels[status]}</Badge>;
  };

  const getPriorityBadge = (priority: SyncTask['priority']) => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800',
    };
    const labels: Record<string, string> = {
      high: '高',
      medium: '中',
      low: '低',
    };
    return <Badge className={colors[priority]}>{labels[priority]}</Badge>;
  };

  const getTypeBadge = (type: SyncTask['type']) => {
    const labels: Record<string, string> = {
      full: '全量',
      incremental: '增量',
      manual: '手动',
    };
    return <Badge variant="outline">{labels[type]}</Badge>;
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const handleRunTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: 'running', progress: 0 } : t
      )
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
          <h1 className="text-3xl font-bold tracking-tight">数据同步</h1>
          <p className="text-muted-foreground mt-1">管理和监控系统数据同步任务</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新建任务
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总任务</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">已启用 {stats.enabled}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">运行中</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.running}</div>
            <p className="text-xs text-muted-foreground mt-1">
              正在执行
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已处理</CardTitle>
            <Database className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalRecords.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              条记录
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">失败数</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <p className="text-xs text-muted-foreground mt-1">
              错误记录 {stats.errorCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">成功率</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {((stats.completed / stats.total) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.completed} / {stats.total}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>同步任务 ({filteredTasks.length})</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索任务..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="pending">等待中</SelectItem>
                    <SelectItem value="running">运行中</SelectItem>
                    <SelectItem value="completed">已完成</SelectItem>
                    <SelectItem value="failed">失败</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                没有找到匹配的同步任务
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <Card key={task.id} className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-lg ${
                            task.status === 'running' ? 'bg-blue-100' :
                            task.status === 'completed' ? 'bg-green-100' :
                            task.status === 'failed' ? 'bg-red-100' : 'bg-gray-100'
                          }`}>
                            {task.status === 'running' && <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />}
                            {task.status === 'completed' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                            {task.status === 'failed' && <XCircle className="h-5 w-5 text-red-600" />}
                            {task.status === 'pending' && <Clock className="h-5 w-5 text-gray-600" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h3 className="font-semibold">{task.name}</h3>
                              {getStatusBadge(task.status)}
                              {getPriorityBadge(task.priority)}
                              {getTypeBadge(task.type)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <span>{task.source}</span>
                              <ArrowUp className="h-4 w-4" />
                              <span>{task.target}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>计划: {task.schedule}</span>
                              <span>·</span>
                              <span>上次运行: {task.lastRun}</span>
                              {task.nextRun && (
                                <>
                                  <span>·</span>
                                  <span>下次运行: {task.nextRun}</span>
                                </>
                              )}
                            </div>
                            {task.status === 'running' && (
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span>进度</span>
                                  <span className="font-medium">{task.progress}%</span>
                                </div>
                                <Progress value={task.progress} />
                                <div className="text-xs text-muted-foreground">
                                  {task.recordsProcessed.toLocaleString()} / {task.totalRecords.toLocaleString()} 条记录
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={task.enabled}
                            onCheckedChange={() => handleToggleTask(task.id)}
                          />
                          {task.status === 'pending' && task.enabled && (
                            <Button size="sm" onClick={() => handleRunTask(task.id)}>
                              <Play className="h-4 w-4 mr-1" />
                              运行
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => { setSelectedTask(task); setViewDialogOpen(true); }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              同步日志
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="p-3 border rounded-lg">
                    <div className="flex items-start gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className={
                          log.level === 'error' ? 'border-red-500 text-red-500' :
                          log.level === 'warning' ? 'border-yellow-500 text-yellow-500' :
                          'border-blue-500 text-blue-500'
                        }
                      >
                        {log.level}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                    </div>
                    <p className="text-sm">{log.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{log.taskName}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
