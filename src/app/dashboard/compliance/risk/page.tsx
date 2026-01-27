'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  FileText,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';

type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
type RiskStatus = 'open' | 'monitoring' | 'mitigated' | 'closed';
type RiskCategory = 'legal' | 'operational' | 'financial' | 'reputational' | 'data-security';

interface Risk {
  id: string;
  name: string;
  category: RiskCategory;
  level: RiskLevel;
  status: RiskStatus;
  description: string;
  likelihood: number;
  impact: number;
  owner: string;
  department: string;
  identifiedDate: string;
  lastReviewed: string;
}

interface RiskMetric {
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  target: number;
}

export default function ComplianceRiskPage() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [metrics, setMetrics] = useState<RiskMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddRisk, setShowAddRisk] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'risks' | 'metrics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [newRisk, setNewRisk] = useState({
    name: '',
    category: 'legal' as RiskCategory,
    level: 'medium' as RiskLevel,
    description: '',
    likelihood: '50',
    impact: '50',
    owner: '',
    department: '',
  });

  useEffect(() => {
    // 模拟获取风险数据
    setTimeout(() => {
      setRisks([
        {
          id: '1',
          name: '劳动合同到期未续签风险',
          category: 'legal',
          level: 'high',
          status: 'open',
          description: '部分员工合同即将到期，存在未及时续签的风险',
          likelihood: 80,
          impact: 75,
          owner: 'HR Manager',
          department: '人力资源部',
          identifiedDate: '2024-01-15',
          lastReviewed: '2024-01-20',
        },
        {
          id: '2',
          name: '员工加班时长超标',
          category: 'operational',
          level: 'medium',
          status: 'monitoring',
          description: '部分部门员工加班时长超过法定标准',
          likelihood: 65,
          impact: 60,
          owner: 'HR BP',
          department: '技术部',
          identifiedDate: '2024-01-10',
          lastReviewed: '2024-01-22',
        },
        {
          id: '3',
          name: '数据安全合规性',
          category: 'data-security',
          level: 'critical',
          status: 'open',
          description: '员工个人信息保护措施需要加强',
          likelihood: 40,
          impact: 95,
          owner: 'CISO',
          department: '信息安全部',
          identifiedDate: '2024-01-05',
          lastReviewed: '2024-01-25',
        },
      ]);

      setMetrics([
        { name: '开放风险数', value: 5, trend: 'down', target: 3 },
        { name: '高风险项目', value: 2, trend: 'stable', target: 0 },
        { name: '风险缓解率', value: 75, trend: 'up', target: 90 },
        { name: '合规评分', value: 85, trend: 'up', target: 95 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddRisk = () => {
    const risk: Risk = {
      id: Date.now().toString(),
      name: newRisk.name,
      category: newRisk.category,
      level: newRisk.level,
      status: 'open',
      description: newRisk.description,
      likelihood: parseInt(newRisk.likelihood),
      impact: parseInt(newRisk.impact),
      owner: newRisk.owner,
      department: newRisk.department,
      identifiedDate: new Date().toISOString().split('T')[0],
      lastReviewed: new Date().toISOString().split('T')[0],
    };
    setRisks([risk, ...risks]);
    setShowAddRisk(false);
    toast.success('风险已添加');
    setNewRisk({
      name: '',
      category: 'legal',
      level: 'medium',
      description: '',
      likelihood: '50',
      impact: '50',
      owner: '',
      department: '',
    });
  };

  const filteredRisks = risks.filter((risk) => {
    const matchesSearch =
      risk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || risk.level === levelFilter;
    const matchesStatus = statusFilter === 'all' || risk.status === statusFilter;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const categoryConfig: Record<RiskCategory, { label: string; color: string }> = {
    legal: { label: '法律风险', color: 'bg-red-500' },
    operational: { label: '运营风险', color: 'bg-orange-500' },
    financial: { label: '财务风险', color: 'bg-yellow-500' },
    reputational: { label: '声誉风险', color: 'bg-purple-500' },
    'data-security': { label: '数据安全', color: 'bg-blue-500' },
  };

  const levelConfig: Record<RiskLevel, { label: string; color: string; icon: any }> = {
    low: { label: '低风险', color: 'bg-green-500', icon: CheckCircle },
    medium: { label: '中风险', color: 'bg-yellow-500', icon: AlertTriangle },
    high: { label: '高风险', color: 'bg-orange-500', icon: AlertTriangle },
    critical: { label: '严重风险', color: 'bg-red-500', icon: AlertTriangle },
  };

  const statusConfig: Record<RiskStatus, { label: string; color: string }> = {
    open: { label: '开放', color: 'bg-red-500' },
    monitoring: { label: '监控中', color: 'bg-yellow-500' },
    mitigated: { label: '已缓解', color: 'bg-blue-500' },
    closed: { label: '已关闭', color: 'bg-green-500' },
  };

  const statistics = {
    totalRisks: risks.length,
    openRisks: risks.filter(r => r.status === 'open').length,
    highRisks: risks.filter(r => ['high', 'critical'].includes(r.level)).length,
    mitigatedRisks: risks.filter(r => r.status === 'mitigated').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              风险管理
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              识别、评估和管理企业合规风险
            </p>
          </div>
          <Button onClick={() => setShowAddRisk(true)}>
            <Plus className="h-4 w-4 mr-2" />
            添加风险
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">总风险数</p>
                  <p className="text-2xl font-bold">{statistics.totalRisks}</p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">开放风险</p>
                  <p className="text-2xl font-bold text-red-600">{statistics.openRisks}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">高风险</p>
                  <p className="text-2xl font-bold text-orange-600">{statistics.highRisks}</p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">已缓解</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.mitigatedRisks}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主要内容 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>风险管理</CardTitle>
                <CardDescription>
                  查看和管理企业风险
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList>
                <TabsTrigger value="overview">概览</TabsTrigger>
                <TabsTrigger value="risks">风险列表</TabsTrigger>
                <TabsTrigger value="metrics">指标监控</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>风险等级分布</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(levelConfig).map(([level, config]) => {
                          const count = risks.filter(r => r.level === level).length;
                          const percentage = risks.length > 0 ? (count / risks.length) * 100 : 0;
                          const Icon = config.icon;
                          return (
                            <div key={level} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4 text-white" />
                                  <span className="font-medium">{config.label}</span>
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {count} ({percentage.toFixed(0)}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${config.color}`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>风险趋势</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {metrics.map((metric) => {
                          const TrendIcon = metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? TrendingDown : Activity;
                          const trendColor = metric.trend === 'up' ? 'text-red-500' : metric.trend === 'down' ? 'text-green-500' : 'text-gray-500';
                          const isGood = (metric.trend === 'down' && metric.name.includes('开放')) ||
                                        (metric.trend === 'up' && metric.name.includes('缓解率'));
                          return (
                            <div key={metric.name} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Activity className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{metric.name}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <p className="font-semibold">{metric.value}</p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    目标: {metric.target}
                                  </p>
                                </div>
                                <TrendIcon className={`h-4 w-4 ${trendColor}`} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="risks" className="mt-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="搜索风险..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={levelFilter} onValueChange={setLevelFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="风险等级" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部等级</SelectItem>
                        {Object.entries(levelConfig).map(([value, config]) => (
                          <SelectItem key={value} value={value}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        {Object.entries(statusConfig).map(([value, config]) => (
                          <SelectItem key={value} value={value}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-gray-600 dark:text-gray-400">加载中...</div>
                    </div>
                  ) : filteredRisks.length === 0 ? (
                    <div className="text-center py-12">
                      <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">暂无风险记录</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>风险名称</TableHead>
                          <TableHead>类别</TableHead>
                          <TableHead>等级</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>可能性</TableHead>
                          <TableHead>影响</TableHead>
                          <TableHead>负责人</TableHead>
                          <TableHead>识别日期</TableHead>
                          <TableHead>操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRisks.map((risk) => {
                          const levelIcon = levelConfig[risk.level].icon;
                          const LevelIcon = levelIcon;
                          const riskScore = Math.round((risk.likelihood + risk.impact) / 2);
                          return (
                            <TableRow key={risk.id}>
                              <TableCell className="font-medium">{risk.name}</TableCell>
                              <TableCell>
                                <Badge className={`${categoryConfig[risk.category].color} text-white border-0`}>
                                  {categoryConfig[risk.category].label}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={`${levelConfig[risk.level].color} text-white border-0 flex items-center gap-1 w-fit`}>
                                  <LevelIcon className="h-3 w-3" />
                                  {levelConfig[risk.level].label}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={`${statusConfig[risk.status].color} text-white border-0`}>
                                  {statusConfig[risk.status].label}
                                </Badge>
                              </TableCell>
                              <TableCell>{risk.likelihood}%</TableCell>
                              <TableCell>{risk.impact}%</TableCell>
                              <TableCell>{risk.owner}</TableCell>
                              <TableCell className="text-sm">{risk.identifiedDate}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  查看
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {metrics.map((metric) => {
                    const TrendIcon = metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? TrendingDown : Activity;
                    const trendColor = metric.trend === 'up' ? 'text-red-500' : metric.trend === 'down' ? 'text-green-500' : 'text-gray-500';
                    const progress = Math.min(100, (metric.value / metric.target) * 100);
                    return (
                      <Card key={metric.name}>
                        <CardHeader>
                          <CardTitle className="text-lg">{metric.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-end justify-between">
                              <div>
                                <p className="text-4xl font-bold">{metric.value}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  目标值: {metric.target}
                                </p>
                              </div>
                              <div className={`flex items-center gap-1 ${trendColor}`}>
                                <TrendIcon className="h-5 w-5" />
                                <span className="text-sm font-medium">
                                  {metric.trend === 'up' ? '上升' : metric.trend === 'down' ? '下降' : '稳定'}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>达成率</span>
                                <span>{progress.toFixed(0)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all ${
                                    progress >= 90 ? 'bg-green-500' :
                                    progress >= 70 ? 'bg-blue-500' :
                                    'bg-yellow-500'
                                  }`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* 添加风险弹窗 */}
      <Dialog open={showAddRisk} onOpenChange={setShowAddRisk}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>添加风险</DialogTitle>
            <DialogDescription>
              识别和记录新的合规风险
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>风险名称 *</Label>
              <Input
                placeholder="输入风险名称"
                value={newRisk.name}
                onChange={(e) => setNewRisk({ ...newRisk, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>风险类别 *</Label>
                <Select
                  value={newRisk.category}
                  onValueChange={(v) => setNewRisk({ ...newRisk, category: v as RiskCategory })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryConfig).map(([value, config]) => (
                      <SelectItem key={value} value={value}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>风险等级 *</Label>
                <Select
                  value={newRisk.level}
                  onValueChange={(v) => setNewRisk({ ...newRisk, level: v as RiskLevel })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(levelConfig).map(([value, config]) => (
                      <SelectItem key={value} value={value}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>风险描述 *</Label>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                placeholder="详细描述风险内容和影响..."
                value={newRisk.description}
                onChange={(e) => setNewRisk({ ...newRisk, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>可能性 (0-100)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="50"
                  value={newRisk.likelihood}
                  onChange={(e) => setNewRisk({ ...newRisk, likelihood: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>影响程度 (0-100)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="50"
                  value={newRisk.impact}
                  onChange={(e) => setNewRisk({ ...newRisk, impact: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>负责人 *</Label>
                <Input
                  placeholder="输入负责人"
                  value={newRisk.owner}
                  onChange={(e) => setNewRisk({ ...newRisk, owner: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>所属部门 *</Label>
                <Input
                  placeholder="输入部门"
                  value={newRisk.department}
                  onChange={(e) => setNewRisk({ ...newRisk, department: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRisk(false)}>
              取消
            </Button>
            <Button onClick={handleAddRisk}>
              <Plus className="h-4 w-4 mr-2" />
              添加风险
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
