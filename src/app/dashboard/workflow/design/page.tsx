'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Workflow, Plus, Edit, Trash2, Copy, Play, Layers } from 'lucide-react';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'recruitment' | 'leave' | 'expense' | 'approval' | 'custom';
  status: 'active' | 'draft' | 'archived';
  nodes: number;
  version: string;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  executionCount: number;
}

export default function WorkflowDesignPage() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [workflows, setWorkflows] = useState<WorkflowTemplate[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setWorkflows([
        {
          id: '1',
          name: '招聘审批流程',
          description: '从简历筛选到Offer发放的完整招聘流程',
          category: 'recruitment',
          status: 'active',
          nodes: 8,
          version: '1.2.0',
          createdBy: '系统管理员',
          createdAt: '2024-01-10',
          lastModified: '2024-04-15',
          executionCount: 156,
        },
        {
          id: '2',
          name: '请假审批流程',
          description: '员工请假申请的多级审批流程',
          category: 'leave',
          status: 'active',
          nodes: 5,
          version: '2.1.0',
          createdBy: '李HR',
          createdAt: '2024-02-20',
          lastModified: '2024-04-10',
          executionCount: 234,
        },
        {
          id: '3',
          name: '费用报销流程',
          description: '员工费用报销申请和审批流程',
          category: 'expense',
          status: 'active',
          nodes: 6,
          version: '1.5.0',
          createdBy: '财务部',
          createdAt: '2024-03-05',
          lastModified: '2024-04-12',
          executionCount: 89,
        },
        {
          id: '4',
          name: '绩效考核流程',
          description: '年度绩效考核和评估流程',
          category: 'approval',
          status: 'draft',
          nodes: 7,
          version: '1.0.0',
          createdBy: 'HR经理',
          createdAt: '2024-04-01',
          lastModified: '2024-04-18',
          executionCount: 0,
        },
        {
          id: '5',
          name: '转正审批流程',
          description: '员工试用期转正评估和审批',
          category: 'approval',
          status: 'active',
          nodes: 4,
          version: '1.3.0',
          createdBy: '系统管理员',
          createdAt: '2024-02-15',
          lastModified: '2024-03-20',
          executionCount: 67,
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredWorkflows = useMemo(() => {
    return workflows.filter(workflow => {
      const matchesSearch =
        workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || workflow.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [workflows, searchTerm, categoryFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = workflows.length;
    const active = workflows.filter(w => w.status === 'active').length;
    const totalExecutions = workflows.reduce((sum, w) => sum + w.executionCount, 0);
    return { total, active, totalExecutions };
  }, [workflows]);

  const getCategoryName = (category: string) => {
    const map: Record<string, string> = {
      recruitment: '招聘',
      leave: '请假',
      expense: '报销',
      approval: '审批',
      custom: '自定义',
    };
    return map[category] || category;
  };

  if (loading) {
    return <div className="space-y-6"><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">工作流设计</h1>
          <p className="text-muted-foreground mt-1">可视化设计和管理业务流程</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />创建工作流</Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              工作流总数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">所有流程</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Play className="h-4 w-4" />
              活跃流程
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground mt-1">正在使用</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Layers className="h-4 w-4" />
              总节点数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{workflows.reduce((sum, w) => sum + w.nodes, 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">流程节点</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              执行次数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalExecutions}</div>
            <p className="text-xs text-muted-foreground mt-1">累计运行</p>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索工作流名称或描述..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部分类</SelectItem>
            <SelectItem value="recruitment">招聘</SelectItem>
            <SelectItem value="leave">请假</SelectItem>
            <SelectItem value="expense">报销</SelectItem>
            <SelectItem value="approval">审批</SelectItem>
            <SelectItem value="custom">自定义</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="active">活跃</SelectItem>
            <SelectItem value="draft">草稿</SelectItem>
            <SelectItem value="archived">已归档</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 工作流列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{workflow.name}</CardTitle>
                  <CardDescription className="mt-1">{workflow.description}</CardDescription>
                </div>
                <Badge variant={workflow.status === 'active' ? 'default' : workflow.status === 'draft' ? 'secondary' : 'outline'}>
                  {workflow.status === 'active' ? '活跃' : workflow.status === 'draft' ? '草稿' : '已归档'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">分类</span>
                  <Badge variant="outline">{getCategoryName(workflow.category)}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">节点数</span>
                  <span className="font-medium">{workflow.nodes}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">版本</span>
                  <span className="font-medium">{workflow.version}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">执行次数</span>
                  <span className="font-medium">{workflow.executionCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>创建: {workflow.createdAt}</span>
                  <span>更新: {workflow.lastModified}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  设计
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredWorkflows.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Workflow className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">没有找到匹配的工作流</p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                创建新工作流
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
