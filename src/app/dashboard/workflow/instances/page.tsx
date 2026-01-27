'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Play, Pause, Clock, CheckCircle, AlertCircle, User, FileText, Eye } from 'lucide-react';

interface WorkflowInstance {
  id: string;
  workflowName: string;
  initiator: string;
  status: 'running' | 'completed' | 'failed' | 'suspended' | 'cancelled';
  currentNode: string;
  progress: number;
  startedAt: string;
  completedAt?: string;
  duration: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  steps: Array<{
    name: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    completedAt?: string;
  }>;
}

export default function WorkflowInstancesPage() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [instances, setInstances] = useState<WorkflowInstance[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setInstances([
        {
          id: '1',
          workflowName: '请假审批流程',
          initiator: '张三',
          status: 'running',
          currentNode: '部门经理审批',
          progress: 40,
          startedAt: '2024-04-18 09:30',
          duration: '2小时',
          priority: 'medium',
          steps: [
            { name: '提交申请', status: 'completed', completedAt: '2024-04-18 09:30' },
            { name: '部门经理审批', status: 'in_progress' },
            { name: 'HR审核', status: 'pending' },
            { name: '归档', status: 'pending' },
          ],
        },
        {
          id: '2',
          workflowName: '费用报销流程',
          initiator: '李四',
          status: 'completed',
          currentNode: '完成',
          progress: 100,
          startedAt: '2024-04-17 14:20',
          completedAt: '2024-04-18 10:15',
          duration: '20小时',
          priority: 'high',
          steps: [
            { name: '提交报销', status: 'completed', completedAt: '2024-04-17 14:20' },
            { name: '主管审批', status: 'completed', completedAt: '2024-04-17 16:45' },
            { name: '财务审核', status: 'completed', completedAt: '2024-04-18 09:00' },
            { name: '打款', status: 'completed', completedAt: '2024-04-18 10:15' },
          ],
        },
        {
          id: '3',
          workflowName: '招聘审批流程',
          initiator: '王HR',
          status: 'running',
          currentNode: '技术面试',
          progress: 60,
          startedAt: '2024-04-15 10:00',
          duration: '3天',
          priority: 'urgent',
          steps: [
            { name: '简历筛选', status: 'completed', completedAt: '2024-04-15 10:00' },
            { name: '初试', status: 'completed', completedAt: '2024-04-16 14:00' },
            { name: '技术面试', status: 'in_progress' },
            { name: 'HR面试', status: 'pending' },
            { name: 'Offer发放', status: 'pending' },
          ],
        },
        {
          id: '4',
          workflowName: '绩效考核流程',
          initiator: '赵经理',
          status: 'suspended',
          currentNode: '员工自评',
          progress: 20,
          startedAt: '2024-04-10 09:00',
          duration: '8天',
          priority: 'medium',
          steps: [
            { name: '设定目标', status: 'completed', completedAt: '2024-04-10 09:00' },
            { name: '员工自评', status: 'in_progress' },
            { name: '经理评估', status: 'pending' },
            { name: '绩效面谈', status: 'pending' },
            { name: '结果确认', status: 'pending' },
          ],
        },
        {
          id: '5',
          workflowName: '转正审批流程',
          initiator: '陈HR',
          status: 'failed',
          currentNode: '系统错误',
          progress: 75,
          startedAt: '2024-04-16 11:00',
          duration: '5小时',
          priority: 'medium',
          steps: [
            { name: '提交评估', status: 'completed', completedAt: '2024-04-16 11:00' },
            { name: '部门审批', status: 'completed', completedAt: '2024-04-16 15:00' },
            { name: 'HR审批', status: 'failed' },
            { name: '归档', status: 'pending' },
          ],
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredInstances = useMemo(() => {
    return instances.filter(instance => {
      const matchesSearch =
        instance.workflowName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instance.initiator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instance.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || instance.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [instances, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = instances.length;
    const running = instances.filter(i => i.status === 'running').length;
    const completed = instances.filter(i => i.status === 'completed').length;
    const failed = instances.filter(i => i.status === 'failed').length;
    return { total, running, completed, failed };
  }, [instances]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-blue-600">运行中</Badge>;
      case 'completed':
        return <Badge className="bg-green-600">已完成</Badge>;
      case 'failed':
        return <Badge variant="destructive">失败</Badge>;
      case 'suspended':
        return <Badge variant="secondary">暂停</Badge>;
      case 'cancelled':
        return <Badge variant="outline">已取消</Badge>;
      default:
        return <Badge>未知</Badge>;
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Play className="h-4 w-4 text-blue-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (loading) {
    return <div className="space-y-6"><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">工作流实例</h1>
          <p className="text-muted-foreground mt-1">查看和管理运行中的工作流实例</p>
        </div>
        <Button variant="outline">导出数据</Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              实例总数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">所有实例</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Play className="h-4 w-4" />
              运行中
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.running}</div>
            <p className="text-xs text-muted-foreground mt-1">正在执行</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              已完成
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground mt-1">成功完成</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              失败
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.failed}</div>
            <p className="text-xs text-muted-foreground mt-1">需要处理</p>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索工作流、发起人或实例ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="running">运行中</SelectItem>
            <SelectItem value="completed">已完成</SelectItem>
            <SelectItem value="failed">失败</SelectItem>
            <SelectItem value="suspended">暂停</SelectItem>
            <SelectItem value="cancelled">已取消</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 实例列表 */}
      <Card>
        <CardHeader>
          <CardTitle>工作流实例列表</CardTitle>
          <CardDescription>查看所有工作流的运行状态</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInstances.map((instance) => (
              <div key={instance.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{instance.workflowName}</h3>
                      {getStatusBadge(instance.status)}
                      <Badge variant="outline">{instance.id}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {instance.initiator}
                      </span>
                      <span>开始: {instance.startedAt}</span>
                      {instance.completedAt && <span>完成: {instance.completedAt}</span>}
                      <span>耗时: {instance.duration}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {instance.status === 'running' && (
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}
                    {instance.status === 'suspended' && (
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {instance.progress > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">当前节点: {instance.currentNode}</span>
                      <span>{instance.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${instance.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium mb-2">执行步骤</p>
                  <div className="space-y-1">
                    {instance.steps.map((step, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-muted/30">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                          {index + 1}
                        </div>
                        {getStepStatusIcon(step.status)}
                        <span className="flex-1">{step.name}</span>
                        {step.completedAt && (
                          <span className="text-xs text-muted-foreground">{step.completedAt}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {filteredInstances.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                没有找到匹配的工作流实例
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
