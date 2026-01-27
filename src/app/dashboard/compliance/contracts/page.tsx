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
  FileText,
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  User,
  Building,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';

type ContractType = 'employment' | 'internship' | 'consultant' | 'nda' | 'custom';
type ContractStatus = 'draft' | 'active' | 'expiring' | 'expired' | 'terminated';

interface Contract {
  id: string;
  contractNo: string;
  type: ContractType;
  employeeId: string;
  employeeName: string;
  department: string;
  title: string;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  value?: number;
  description?: string;
  createdAt: string;
  createdBy: string;
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddContract, setShowAddContract] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const [newContract, setNewContract] = useState({
    type: 'employment' as ContractType,
    employeeName: '',
    department: '',
    title: '',
    startDate: '',
    endDate: '',
    value: '',
    description: '',
  });

  useEffect(() => {
    // 模拟获取合同数据
    setTimeout(() => {
      setContracts([
        {
          id: '1',
          contractNo: 'CT2024010001',
          type: 'employment',
          employeeId: 'E001',
          employeeName: '张三',
          department: '技术部',
          title: '劳动合同',
          startDate: '2023-01-15',
          endDate: '2024-01-14',
          status: 'expiring',
          value: 360000,
          description: '标准劳动合同',
          createdAt: '2023-01-10T10:00:00',
          createdBy: 'HR Manager',
        },
        {
          id: '2',
          contractNo: 'CT2024020002',
          type: 'employment',
          employeeId: 'E002',
          employeeName: '李四',
          department: '销售部',
          title: '劳动合同',
          startDate: '2023-03-01',
          endDate: '2025-02-28',
          status: 'active',
          value: 480000,
          description: '销售岗位劳动合同',
          createdAt: '2023-02-25T14:30:00',
          createdBy: 'HR Manager',
        },
        {
          id: '3',
          contractNo: 'CT2024030003',
          type: 'nda',
          employeeId: 'E003',
          employeeName: '王五',
          department: '产品部',
          title: '保密协议',
          startDate: '2023-06-01',
          endDate: '2026-05-31',
          status: 'active',
          description: '核心员工保密协议',
          createdAt: '2023-05-28T09:15:00',
          createdBy: 'HR Director',
        },
        {
          id: '4',
          contractNo: 'CT2023040004',
          type: 'internship',
          employeeId: 'I001',
          employeeName: '赵六',
          department: '市场部',
          title: '实习协议',
          startDate: '2024-01-10',
          endDate: '2024-04-10',
          status: 'active',
          value: 12000,
          description: '实习生协议',
          createdAt: '2024-01-05T16:00:00',
          createdBy: 'HR Manager',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddContract = () => {
    const contract: Contract = {
      id: Date.now().toString(),
      contractNo: `CT${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${(contracts.length + 1).toString().padStart(4, '0')}`,
      type: newContract.type,
      employeeId: 'E' + Date.now().toString().slice(-4),
      employeeName: newContract.employeeName,
      department: newContract.department,
      title: newContract.title,
      startDate: newContract.startDate,
      endDate: newContract.endDate,
      status: 'draft',
      value: parseFloat(newContract.value) || undefined,
      description: newContract.description,
      createdAt: new Date().toISOString(),
      createdBy: '当前用户',
    };
    setContracts([contract, ...contracts]);
    setShowAddContract(false);
    toast.success('合同已创建');
    setNewContract({
      type: 'employment',
      employeeName: '',
      department: '',
      title: '',
      startDate: '',
      endDate: '',
      value: '',
      description: '',
    });
  };

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.contractNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesType = typeFilter === 'all' || contract.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const typeConfig: Record<ContractType, { label: string; color: string; icon: any }> = {
    employment: { label: '劳动合同', color: 'bg-blue-500', icon: FileText },
    internship: { label: '实习协议', color: 'bg-green-500', icon: FileText },
    consultant: { label: '顾问协议', color: 'bg-purple-500', icon: FileText },
    nda: { label: '保密协议', color: 'bg-red-500', icon: FileText },
    custom: { label: '其他', color: 'bg-gray-500', icon: FileText },
  };

  const statusConfig: Record<ContractStatus, { label: string; color: string; icon: any }> = {
    draft: { label: '草稿', color: 'bg-gray-500', icon: FileText },
    active: { label: '生效中', color: 'bg-green-500', icon: CheckCircle },
    expiring: { label: '即将到期', color: 'bg-yellow-500', icon: AlertTriangle },
    expired: { label: '已过期', color: 'bg-red-500', icon: Clock },
    terminated: { label: '已终止', color: 'bg-gray-600', icon: FileText },
  };

  const statistics = {
    total: contracts.length,
    active: contracts.filter(c => c.status === 'active').length,
    expiring: contracts.filter(c => c.status === 'expiring').length,
    expired: contracts.filter(c => c.status === 'expired').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              合同管理
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              管理员工合同和协议
            </p>
          </div>
          <Button onClick={() => setShowAddContract(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新建合同
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">总合同数</p>
                  <p className="text-2xl font-bold">{statistics.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">生效中</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.active}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">即将到期</p>
                  <p className="text-2xl font-bold text-yellow-600">{statistics.expiring}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">已过期</p>
                  <p className="text-2xl font-bold text-red-600">{statistics.expired}</p>
                </div>
                <Clock className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 筛选栏 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="搜索合同号、员工姓名或标题..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
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
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  {Object.entries(typeConfig).map(([value, config]) => (
                    <SelectItem key={value} value={value}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 合同列表 */}
        <Card>
          <CardHeader>
            <CardTitle>合同列表</CardTitle>
            <CardDescription>
              共 {filteredContracts.length} 份合同
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-600 dark:text-gray-400">加载中...</div>
              </div>
            ) : filteredContracts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">暂无合同记录</p>
                <Button className="mt-4" onClick={() => setShowAddContract(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  新建合同
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>合同号</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>员工</TableHead>
                    <TableHead>部门</TableHead>
                    <TableHead>标题</TableHead>
                    <TableHead>开始日期</TableHead>
                    <TableHead>结束日期</TableHead>
                    <TableHead>价值</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract) => {
                    const statusIcon = statusConfig[contract.status].icon;
                    const StatusIcon = statusIcon;
                    return (
                      <TableRow key={contract.id}>
                        <TableCell className="font-mono text-sm">{contract.contractNo}</TableCell>
                        <TableCell>
                          <Badge className={`${typeConfig[contract.type].color} text-white border-0`}>
                            {typeConfig[contract.type].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{contract.employeeName}</TableCell>
                        <TableCell>{contract.department}</TableCell>
                        <TableCell>{contract.title}</TableCell>
                        <TableCell className="text-sm">{contract.startDate}</TableCell>
                        <TableCell className="text-sm">{contract.endDate}</TableCell>
                        <TableCell>
                          {contract.value ? `¥${contract.value.toLocaleString()}` : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusConfig[contract.status].color} text-white border-0 flex items-center gap-1 w-fit`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[contract.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 新建合同弹窗 */}
      <Dialog open={showAddContract} onOpenChange={setShowAddContract}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新建合同</DialogTitle>
            <DialogDescription>
              创建新的员工合同或协议
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>合同类型 *</Label>
                <Select
                  value={newContract.type}
                  onValueChange={(v) => setNewContract({ ...newContract, type: v as ContractType })}
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
                <Label>合同标题 *</Label>
                <Input
                  placeholder="输入合同标题"
                  value={newContract.title}
                  onChange={(e) => setNewContract({ ...newContract, title: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>员工姓名 *</Label>
                <Input
                  placeholder="输入员工姓名"
                  value={newContract.employeeName}
                  onChange={(e) => setNewContract({ ...newContract, employeeName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>所属部门 *</Label>
                <Input
                  placeholder="输入部门"
                  value={newContract.department}
                  onChange={(e) => setNewContract({ ...newContract, department: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>开始日期 *</Label>
                <Input
                  type="date"
                  value={newContract.startDate}
                  onChange={(e) => setNewContract({ ...newContract, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>结束日期 *</Label>
                <Input
                  type="date"
                  value={newContract.endDate}
                  onChange={(e) => setNewContract({ ...newContract, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>合同价值 (元)</Label>
              <Input
                type="number"
                placeholder="输入合同价值"
                value={newContract.value}
                onChange={(e) => setNewContract({ ...newContract, value: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>合同描述</Label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                placeholder="输入合同描述..."
                value={newContract.description}
                onChange={(e) => setNewContract({ ...newContract, description: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddContract(false)}>
              取消
            </Button>
            <Button onClick={handleAddContract}>
              <Plus className="h-4 w-4 mr-2" />
              创建合同
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
