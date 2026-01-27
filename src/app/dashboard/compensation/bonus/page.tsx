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
import {
  Gift,
  TrendingUp,
  DollarSign,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Filter,
  Search,
  Save,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';

type BonusType = 'performance' | 'year-end' | 'project' | 'referral' | 'custom';
type BonusStatus = 'pending' | 'approved' | 'paid' | 'rejected';

interface BonusRule {
  id: string;
  name: string;
  type: BonusType;
  amount: number;
  unit: 'fixed' | 'percentage';
  condition: string;
  status: 'active' | 'inactive';
  description: string;
}

interface BonusRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: BonusType;
  amount: number;
  reason: string;
  status: BonusStatus;
  createdAt: string;
  paidAt?: string;
}

export default function BonusPage() {
  const [bonusRules, setBonusRules] = useState<BonusRule[]>([]);
  const [bonusRecords, setBonusRecords] = useState<BonusRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddRule, setShowAddRule] = useState(false);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [activeTab, setActiveTab] = useState<'rules' | 'records'>('rules');

  // 新增规则表单
  const [newRule, setNewRule] = useState({
    name: '',
    type: 'performance' as BonusType,
    amount: '',
    unit: 'fixed' as 'fixed' | 'percentage',
    condition: '',
    description: '',
  });

  // 新增记录表单
  const [newRecord, setNewRecord] = useState({
    employeeName: '',
    department: '',
    type: 'performance' as BonusType,
    amount: '',
    reason: '',
  });

  useEffect(() => {
    // 模拟获取奖金数据
    setTimeout(() => {
      setBonusRules([
        {
          id: '1',
          name: '绩效奖金-A级',
          type: 'performance',
          amount: 2000,
          unit: 'fixed',
          condition: '绩效评级A',
          status: 'active',
          description: '季度绩效考核评级为A的员工发放',
        },
        {
          id: '2',
          name: '年终奖',
          type: 'year-end',
          amount: 10,
          unit: 'percentage',
          condition: '年度表现优秀',
          status: 'active',
          description: '基于年度绩效评估结果发放',
        },
        {
          id: '3',
          name: '项目奖金',
          type: 'project',
          amount: 5000,
          unit: 'fixed',
          condition: '项目成功上线',
          status: 'active',
          description: '重大项目成功上线发放',
        },
        {
          id: '4',
          name: '内推奖金',
          type: 'referral',
          amount: 3000,
          unit: 'fixed',
          condition: '成功推荐候选人入职',
          status: 'active',
          description: '员工成功推荐新员工入职',
        },
      ]);

      setBonusRecords([
        {
          id: '1',
          employeeId: 'E001',
          employeeName: '张三',
          department: '技术部',
          type: 'performance',
          amount: 2000,
          reason: '2024年第一季度绩效评级A',
          status: 'paid',
          createdAt: '2024-04-01T10:00:00',
          paidAt: '2024-04-05T15:30:00',
        },
        {
          id: '2',
          employeeId: 'E002',
          employeeName: '李四',
          department: '销售部',
          type: 'performance',
          amount: 3000,
          reason: '2024年第一季度绩效评级A+',
          status: 'approved',
          createdAt: '2024-04-01T11:00:00',
        },
        {
          id: '3',
          employeeId: 'E003',
          employeeName: '王五',
          department: '技术部',
          type: 'project',
          amount: 5000,
          reason: 'ERP系统项目成功上线',
          status: 'pending',
          createdAt: '2024-04-02T14:30:00',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddRule = () => {
    const rule: BonusRule = {
      id: Date.now().toString(),
      name: newRule.name,
      type: newRule.type,
      amount: parseFloat(newRule.amount),
      unit: newRule.unit,
      condition: newRule.condition,
      status: 'active',
      description: newRule.description,
    };
    setBonusRules([...bonusRules, rule]);
    setShowAddRule(false);
    toast.success('奖金规则已添加');
    setNewRule({
      name: '',
      type: 'performance',
      amount: '',
      unit: 'fixed',
      condition: '',
      description: '',
    });
  };

  const handleAddRecord = () => {
    const record: BonusRecord = {
      id: Date.now().toString(),
      employeeId: 'E' + Date.now().toString().slice(-4),
      employeeName: newRecord.employeeName,
      department: newRecord.department,
      type: newRecord.type,
      amount: parseFloat(newRecord.amount),
      reason: newRecord.reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setBonusRecords([record, ...bonusRecords]);
    setShowAddRecord(false);
    toast.success('奖金记录已添加');
    setNewRecord({
      employeeName: '',
      department: '',
      type: 'performance',
      amount: '',
      reason: '',
    });
  };

  const typeConfig: Record<BonusType, { label: string; color: string; icon: any }> = {
    performance: { label: '绩效奖金', color: 'bg-blue-500', icon: TrendingUp },
    'year-end': { label: '年终奖', color: 'bg-green-500', icon: Gift },
    project: { label: '项目奖金', color: 'bg-purple-500', icon: Calendar },
    referral: { label: '内推奖金', color: 'bg-orange-500', icon: Users },
    custom: { label: '自定义', color: 'bg-gray-500', icon: DollarSign },
  };

  const statusConfig: Record<BonusStatus, { label: string; color: string; icon: any }> = {
    pending: { label: '待审批', color: 'bg-yellow-500', icon: Clock },
    approved: { label: '已通过', color: 'bg-blue-500', icon: CheckCircle },
    paid: { label: '已发放', color: 'bg-green-500', icon: CheckCircle },
    rejected: { label: '已拒绝', color: 'bg-red-500', icon: XCircle },
  };

  const statistics = {
    totalRules: bonusRules.length,
    activeRules: bonusRules.filter(r => r.status === 'active').length,
    pendingRecords: bonusRecords.filter(r => r.status === 'pending').length,
    totalPaid: bonusRecords
      .filter(r => r.status === 'paid')
      .reduce((sum, r) => sum + r.amount, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Gift className="h-8 w-8 text-blue-600" />
              奖金管理
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              管理奖金规则和发放记录
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowAddRecord(true)}>
              <Plus className="h-4 w-4 mr-2" />
              发放奖金
            </Button>
            <Button onClick={() => setShowAddRule(true)}>
              <Plus className="h-4 w-4 mr-2" />
              新增规则
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">奖金规则</p>
                  <p className="text-2xl font-bold">{statistics.totalRules}</p>
                </div>
                <Gift className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">生效规则</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.activeRules}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">待审批</p>
                  <p className="text-2xl font-bold text-yellow-600">{statistics.pendingRecords}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">已发放总额</p>
                  <p className="text-2xl font-bold text-green-600">
                    ¥{statistics.totalPaid.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主要内容 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>奖金管理</CardTitle>
                <CardDescription>
                  管理奖金规则和发放记录
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'rules' | 'records')}>
              <TabsList>
                <TabsTrigger value="rules">奖金规则</TabsTrigger>
                <TabsTrigger value="records">发放记录</TabsTrigger>
              </TabsList>

              <TabsContent value="rules" className="mt-6">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-gray-600 dark:text-gray-400">加载中...</div>
                  </div>
                ) : bonusRules.length === 0 ? (
                  <div className="text-center py-12">
                    <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">暂无奖金规则</p>
                    <Button className="mt-4" onClick={() => setShowAddRule(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      添加规则
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bonusRules.map((rule) => {
                      const Icon = typeConfig[rule.type].icon;
                      return (
                        <Card key={rule.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${typeConfig[rule.type].color}`}>
                                  <Icon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{rule.name}</CardTitle>
                                  <CardDescription className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline">{typeConfig[rule.type].label}</Badge>
                                    <Badge
                                      variant={rule.status === 'active' ? 'default' : 'secondary'}
                                      className={rule.status === 'active' ? 'bg-green-600' : ''}
                                    >
                                      {rule.status === 'active' ? '生效中' : '已停用'}
                                    </Badge>
                                  </CardDescription>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">金额/比例</span>
                                <span className="font-semibold">
                                  {rule.unit === 'percentage' ? rule.amount + '%' : '¥' + rule.amount.toLocaleString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">发放条件</span>
                                <p className="font-medium mt-1">{rule.condition}</p>
                              </div>
                              {rule.description && (
                                <div>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">说明</span>
                                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                    {rule.description}
                                  </p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="records" className="mt-6">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-gray-600 dark:text-gray-400">加载中...</div>
                  </div>
                ) : bonusRecords.length === 0 ? (
                  <div className="text-center py-12">
                    <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">暂无发放记录</p>
                    <Button className="mt-4" onClick={() => setShowAddRecord(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      发放奖金
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input placeholder="搜索员工姓名或部门..." className="pl-10" />
                      </div>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        导出
                      </Button>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>员工</TableHead>
                          <TableHead>部门</TableHead>
                          <TableHead>奖金类型</TableHead>
                          <TableHead>金额</TableHead>
                          <TableHead>原因</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>创建时间</TableHead>
                          <TableHead>操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bonusRecords.map((record) => {
                          const statusIcon = statusConfig[record.status].icon;
                          const StatusIcon = statusIcon;
                          return (
                            <TableRow key={record.id}>
                              <TableCell className="font-medium">{record.employeeName}</TableCell>
                              <TableCell>{record.department}</TableCell>
                              <TableCell>
                                <Badge className={`${typeConfig[record.type].color} text-white border-0`}>
                                  {typeConfig[record.type].label}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-semibold text-green-600">
                                ¥{record.amount.toLocaleString()}
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate" title={record.reason}>
                                {record.reason}
                              </TableCell>
                              <TableCell>
                                <Badge className={`${statusConfig[record.status].color} text-white border-0 flex items-center gap-1 w-fit`}>
                                  <StatusIcon className="h-3 w-3" />
                                  {statusConfig[record.status].label}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">
                                {new Date(record.createdAt).toLocaleDateString('zh-CN')}
                              </TableCell>
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
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* 新增规则弹窗 */}
      <Dialog open={showAddRule} onOpenChange={setShowAddRule}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增奖金规则</DialogTitle>
            <DialogDescription>
              创建新的奖金发放规则
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>规则名称</Label>
              <Input
                placeholder="例如：绩效奖金-A级"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>奖金类型</Label>
                <Select
                  value={newRule.type}
                  onValueChange={(v) => setNewRule({ ...newRule, type: v as BonusType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeConfig).map(([value, config]) => (
                      <SelectItem key={value} value={value}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>金额单位</Label>
                <Select
                  value={newRule.unit}
                  onValueChange={(v) => setNewRule({ ...newRule, unit: v as 'fixed' | 'percentage' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">固定金额</SelectItem>
                    <SelectItem value="percentage">百分比</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>金额</Label>
              <Input
                type="number"
                placeholder={newRule.unit === 'percentage' ? '例如：10' : '例如：2000'}
                value={newRule.amount}
                onChange={(e) => setNewRule({ ...newRule, amount: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>发放条件</Label>
              <Input
                placeholder="例如：绩效评级为A"
                value={newRule.condition}
                onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>说明</Label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                placeholder="奖金规则的详细说明..."
                value={newRule.description}
                onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRule(false)}>
              取消
            </Button>
            <Button onClick={handleAddRule}>
              <Save className="h-4 w-4 mr-2" />
              保存规则
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 新增记录弹窗 */}
      <Dialog open={showAddRecord} onOpenChange={setShowAddRecord}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>发放奖金</DialogTitle>
            <DialogDescription>
              为员工发放奖金
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>员工姓名</Label>
                <Input
                  placeholder="输入员工姓名"
                  value={newRecord.employeeName}
                  onChange={(e) => setNewRecord({ ...newRecord, employeeName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>部门</Label>
                <Input
                  placeholder="选择部门"
                  value={newRecord.department}
                  onChange={(e) => setNewRecord({ ...newRecord, department: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>奖金类型</Label>
                <Select
                  value={newRecord.type}
                  onValueChange={(v) => setNewRecord({ ...newRecord, type: v as BonusType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeConfig).map(([value, config]) => (
                      <SelectItem key={value} value={value}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>金额</Label>
                <Input
                  type="number"
                  placeholder="输入金额"
                  value={newRecord.amount}
                  onChange={(e) => setNewRecord({ ...newRecord, amount: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>发放原因</Label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                placeholder="详细说明发放原因..."
                value={newRecord.reason}
                onChange={(e) => setNewRecord({ ...newRecord, reason: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRecord(false)}>
              取消
            </Button>
            <Button onClick={handleAddRecord}>
              <Save className="h-4 w-4 mr-2" />
              提交审批
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
