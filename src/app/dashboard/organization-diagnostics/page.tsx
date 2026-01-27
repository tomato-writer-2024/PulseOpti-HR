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
  Building2,
  Plus,
  Users,
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  Search,
  Download,
  Save,
  Eye,
  Edit,
  Trash2,
  Filter,
  AlertTriangle,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { toast } from 'sonner';

// 类型定义
type OrgMetricType = 'turnover' | 'engagement' | 'performance' | 'diversity' | 'cost';
type OrgHealthStatus = 'healthy' | 'warning' | 'critical';

interface OrgMetric {
  id: string;
  name: string;
  type: OrgMetricType;
  value: number;
  target: number;
  unit: string;
  status: OrgHealthStatus;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

interface OrgIssue {
  id: string;
  department: string;
  issue: string;
  severity: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'resolved';
  discoveredAt: string;
  description: string;
  solution?: string;
}

interface OrgRecommendation {
  id: string;
  department: string;
  category: 'structure' | 'process' | 'culture' | 'talent';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  expectedImpact: string;
  createdAt: string;
}

export default function OrganizationDiagnosticsPage() {
  const [activeTab, setActiveTab] = useState('metrics');
  const [dialogOpen, setDialogOpen] = useState(false);

  // 组织健康指标
  const [orgMetrics] = useState<OrgMetric[]>([
    {
      id: '1',
      name: '员工流失率',
      type: 'turnover',
      value: 8.5,
      target: 10,
      unit: '%',
      status: 'healthy',
      trend: 'down',
      lastUpdated: '2025-04-18',
    },
    {
      id: '2',
      name: '员工满意度',
      type: 'engagement',
      value: 78,
      target: 85,
      unit: '%',
      status: 'warning',
      trend: 'up',
      lastUpdated: '2025-04-15',
    },
    {
      id: '3',
      name: '绩效达标率',
      type: 'performance',
      value: 82,
      target: 90,
      unit: '%',
      status: 'warning',
      trend: 'stable',
      lastUpdated: '2025-04-10',
    },
    {
      id: '4',
      name: '人均成本',
      type: 'cost',
      value: 15000,
      target: 14000,
      unit: '元/月',
      status: 'critical',
      trend: 'up',
      lastUpdated: '2025-04-18',
    },
    {
      id: '5',
      name: '多样性指数',
      type: 'diversity',
      value: 65,
      target: 70,
      unit: '%',
      status: 'warning',
      trend: 'up',
      lastUpdated: '2025-04-01',
    },
  ]);

  // 组织问题
  const [orgIssues] = useState<OrgIssue[]>([
    {
      id: '1',
      department: '技术部',
      issue: '团队规模不足',
      severity: 'high',
      status: 'in_progress',
      discoveredAt: '2025-04-01',
      description: '技术部当前人数无法支撑业务发展需求',
      solution: '启动紧急招聘计划',
    },
    {
      id: '2',
      department: '销售部',
      issue: '员工绩效偏低',
      severity: 'medium',
      status: 'pending',
      discoveredAt: '2025-04-10',
      description: '销售部整体绩效未达标',
    },
    {
      id: '3',
      department: '市场部',
      issue: '跨部门协作效率低',
      severity: 'medium',
      status: 'in_progress',
      discoveredAt: '2025-04-05',
      description: '市场部与技术部协作流程不畅',
      solution: '建立定期沟通机制',
    },
  ]);

  // 组织优化建议
  const [orgRecommendations] = useState<OrgRecommendation[]>([
    {
      id: '1',
      department: '技术部',
      category: 'structure',
      priority: 'high',
      title: '调整团队组织架构',
      description: '建议将技术部拆分为前端、后端、测试三个小组，提高专业分工',
      expectedImpact: '提升团队效率 20%',
      createdAt: '2025-04-15',
    },
    {
      id: '2',
      department: '销售部',
      category: 'talent',
      priority: 'high',
      title: '加强销售团队培训',
      description: '定期组织销售技能培训，提升团队整体能力',
      expectedImpact: '提升销售业绩 15%',
      createdAt: '2025-04-10',
    },
    {
      id: '3',
      department: '全公司',
      category: 'culture',
      priority: 'medium',
      title: '优化绩效考核体系',
      description: '完善绩效考核指标，提高考核公平性',
      expectedImpact: '提升员工满意度',
      createdAt: '2025-04-05',
    },
  ]);

  const statusMap: Record<OrgHealthStatus, { label: string; color: string }> = {
    healthy: { label: '健康', color: 'bg-green-100 text-green-800' },
    warning: { label: '警告', color: 'bg-yellow-100 text-yellow-800' },
    critical: { label: '严重', color: 'bg-red-100 text-red-800' },
  };

  const severityMap: Record<string, { label: string; color: string }> = {
    high: { label: '高', color: 'bg-red-100 text-red-800' },
    medium: { label: '中', color: 'bg-yellow-100 text-yellow-800' },
    low: { label: '低', color: 'bg-green-100 text-green-800' },
  };

  const categoryMap: Record<string, { label: string; color: string }> = {
    structure: { label: '组织结构', color: 'bg-blue-100 text-blue-800' },
    process: { label: '业务流程', color: 'bg-purple-100 text-purple-800' },
    culture: { label: '企业文化', color: 'bg-pink-100 text-pink-800' },
    talent: { label: '人才发展', color: 'bg-orange-100 text-orange-800' },
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">组织诊断</h1>
          <p className="text-gray-600 mt-2">
            组织健康监测、问题诊断、优化建议
            <Badge variant="secondary" className="ml-2">HRBP</Badge>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出报告
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新增指标
          </Button>
        </div>
      </div>

      {/* 功能介绍 */}
      <Alert>
        <Building2 className="h-4 w-4" />
        <AlertDescription>
          全方位组织健康监测，通过数据分析识别组织问题，提供优化建议
        </AlertDescription>
      </Alert>

      {/* 组织健康概览 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {orgMetrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-gray-600">
                {metric.name}
              </CardTitle>
              <Badge className={statusMap[metric.status].color}>
                {statusMap[metric.status].label}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.value} {metric.unit}
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs text-gray-500">目标: {metric.target}{metric.unit}</span>
                {metric.trend === 'up' && (
                  <TrendingUp className="h-3 w-3 text-red-600" />
                )}
                {metric.trend === 'down' && (
                  <TrendingUp className="h-3 w-3 text-green-600 rotate-180" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">健康指标</TabsTrigger>
          <TabsTrigger value="issues">问题诊断</TabsTrigger>
          <TabsTrigger value="recommendations">优化建议</TabsTrigger>
          <TabsTrigger value="analysis">深度分析</TabsTrigger>
        </TabsList>

        {/* 健康指标 */}
        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>组织健康指标</CardTitle>
              <CardDescription>持续监测组织关键指标</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>指标名称</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>当前值</TableHead>
                    <TableHead>目标值</TableHead>
                    <TableHead>趋势</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>更新时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orgMetrics.map((metric) => (
                    <TableRow key={metric.id}>
                      <TableCell className="font-medium">{metric.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{metric.type}</Badge>
                      </TableCell>
                      <TableCell className="font-bold text-blue-600">
                        {metric.value} {metric.unit}
                      </TableCell>
                      <TableCell>
                        {metric.target} {metric.unit}
                      </TableCell>
                      <TableCell>
                        {metric.trend === 'up' && (
                          <TrendingUp className="h-4 w-4 text-red-600" />
                        )}
                        {metric.trend === 'down' && (
                          <TrendingUp className="h-4 w-4 text-green-600 rotate-180" />
                        )}
                        {metric.trend === 'stable' && (
                          <Target className="h-4 w-4 text-gray-600" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusMap[metric.status].color}>
                          {statusMap[metric.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {metric.lastUpdated}
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

        {/* 问题诊断 */}
        <TabsContent value="issues">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>问题诊断</CardTitle>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  新增问题
                </Button>
              </div>
              <CardDescription>发现并记录组织问题</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>部门</TableHead>
                    <TableHead>问题</TableHead>
                    <TableHead>严重程度</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>发现时间</TableHead>
                    <TableHead>解决方案</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orgIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell className="font-medium">
                        {issue.department}
                      </TableCell>
                      <TableCell>{issue.issue}</TableCell>
                      <TableCell>
                        <Badge className={severityMap[issue.severity].color}>
                          {severityMap[issue.severity].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            issue.status === 'resolved' ? 'default' : 'secondary'
                          }
                        >
                          {issue.status === 'pending' && '待处理'}
                          {issue.status === 'in_progress' && '处理中'}
                          {issue.status === 'resolved' && '已解决'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {issue.discoveredAt}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {issue.solution || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {issue.status !== 'resolved' && (
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
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

        {/* 优化建议 */}
        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>优化建议</CardTitle>
              <CardDescription>基于数据分析的改进建议</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orgRecommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={categoryMap[rec.category].color}>
                          {categoryMap[rec.category].label}
                        </Badge>
                        <Badge
                          variant={rec.priority === 'high' ? 'default' : 'secondary'}
                        >
                          {rec.priority === 'high' && '高优先级'}
                          {rec.priority === 'medium' && '中优先级'}
                          {rec.priority === 'low' && '低优先级'}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500">{rec.createdAt}</span>
                    </div>
                    <h3 className="font-semibold mb-2">{rec.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">
                        预期影响: {rec.expectedImpact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 深度分析 */}
        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>组织结构分析</CardTitle>
                <CardDescription>组织架构和层级分析</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <PieChart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>组织结构可视化分析</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>人才流动分析</CardTitle>
                <CardDescription>员工流动趋势分析</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>人才流动趋势图表</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* 新增问题弹窗 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新增组织问题</DialogTitle>
            <DialogDescription>
              记录新发现的组织问题
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="department">部门 *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择部门" />
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
              <Label htmlFor="issue">问题描述 *</Label>
              <Textarea
                id="issue"
                placeholder="详细描述发现的问题"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="severity">严重程度 *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择严重程度" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="low">低</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">状态 *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">待处理</SelectItem>
                    <SelectItem value="in_progress">处理中</SelectItem>
                    <SelectItem value="resolved">已解决</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="solution">解决方案</Label>
              <Textarea
                id="solution"
                placeholder="记录或计划采取的解决措施"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={() => {
              toast.success('问题已记录！');
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
