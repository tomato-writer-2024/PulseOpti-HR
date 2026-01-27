'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Search,
  Plus,
  Edit,
  Eye,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  RefreshCw,
  Upload,
  User,
  Building2,
  Printer,
  Share2,
  Archive,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/theme';

interface Contract {
  id: string;
  contractNo: string;
  contractType: 'labor' | 'intern' | 'outsourcing' | 'consulting' | 'nda' | 'other';
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  avatar?: string;
  
  // 合同信息
  startDate: string;
  endDate: string;
  signDate: string;
  status: 'draft' | 'active' | 'expired' | 'terminated' | 'renewed';
  
  // 合同条款
  contractTerm: number; // 合同期限（月）
  probationPeriod: number; // 试用期（月）
  salary: number;
  salaryPeriod: 'month' | 'year';
  
  // 附件
  attachmentUrl?: string;
  attachmentName?: string;
  
  // 审批
  approvedBy?: string;
  approvedAt?: string;
  
  // 提醒
  remindDays?: number;
  
  // 备注
  remark?: string;
  
  createdAt: string;
  updatedAt: string;
}

interface ContractTemplate {
  id: string;
  name: string;
  type: Contract['contractType'];
  description: string;
  content: string;
  isDefault: boolean;
}

export default function ContractsPage() {
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Contract['status']>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | Contract['contractType']>('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'contracts' | 'templates' | 'reminders'>('contracts');
  
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockContracts: Contract[] = [
        {
          id: '1',
          contractNo: 'CON202501001',
          contractType: 'labor',
          employeeId: 'EMP001',
          employeeName: '王小明',
          department: '技术部',
          position: '前端开发工程师',
          startDate: '2024-01-15',
          endDate: '2026-01-14',
          signDate: '2024-01-10',
          status: 'active',
          contractTerm: 24,
          probationPeriod: 3,
          salary: 35000,
          salaryPeriod: 'month',
          attachmentUrl: '/contracts/CON202501001.pdf',
          attachmentName: '劳动合同_王小明.pdf',
          approvedBy: '张总',
          approvedAt: '2024-01-12',
          remindDays: 30,
          remark: '高级工程师岗位',
          createdAt: '2024-01-05',
          updatedAt: '2024-01-12',
        },
        {
          id: '2',
          contractNo: 'CON202502001',
          contractType: 'labor',
          employeeId: 'EMP002',
          employeeName: '李小红',
          department: '产品部',
          position: '产品经理',
          startDate: '2024-03-01',
          endDate: '2026-02-28',
          signDate: '2024-02-28',
          status: 'active',
          contractTerm: 24,
          probationPeriod: 6,
          salary: 30000,
          salaryPeriod: 'month',
          attachmentUrl: '/contracts/CON202502001.pdf',
          attachmentName: '劳动合同_李小红.pdf',
          approvedBy: '张总',
          approvedAt: '2024-02-29',
          remindDays: 60,
          remark: '产品经理岗位',
          createdAt: '2024-02-20',
          updatedAt: '2024-02-29',
        },
        {
          id: '3',
          contractNo: 'CON202503001',
          contractType: 'intern',
          employeeId: 'EMP003',
          employeeName: '陈伟',
          department: '销售部',
          position: '销售实习生',
          startDate: '2024-06-01',
          endDate: '2024-08-31',
          signDate: '2024-05-28',
          status: 'expired',
          contractTerm: 3,
          probationPeriod: 0,
          salary: 4000,
          salaryPeriod: 'month',
          attachmentUrl: '/contracts/CON202503001.pdf',
          attachmentName: '实习协议_陈伟.pdf',
          approvedBy: '王经理',
          approvedAt: '2024-05-30',
          remark: '暑期实习',
          createdAt: '2024-05-20',
          updatedAt: '2024-05-30',
        },
        {
          id: '4',
          contractNo: 'CON202504001',
          contractType: 'labor',
          employeeId: 'EMP004',
          employeeName: '赵丽',
          department: '技术部',
          position: '后端开发工程师',
          startDate: '2023-04-01',
          endDate: '2025-03-31',
          signDate: '2023-03-28',
          status: 'active',
          contractTerm: 24,
          probationPeriod: 3,
          salary: 32000,
          salaryPeriod: 'month',
          attachmentUrl: '/contracts/CON202504001.pdf',
          attachmentName: '劳动合同_赵丽.pdf',
          approvedBy: '李CTO',
          approvedAt: '2023-03-30',
          remindDays: 90,
          createdAt: '2023-03-20',
          updatedAt: '2023-03-30',
        },
        {
          id: '5',
          contractNo: 'CON202505001',
          contractType: 'nda',
          employeeId: 'EMP005',
          employeeName: '刘洋',
          department: '技术部',
          position: '技术总监',
          startDate: '2023-01-01',
          endDate: '2026-12-31',
          signDate: '2023-01-05',
          status: 'active',
          contractTerm: 48,
          probationPeriod: 6,
          salary: 80000,
          salaryPeriod: 'month',
          attachmentUrl: '/contracts/CON202505001.pdf',
          attachmentName: '保密协议_刘洋.pdf',
          approvedBy: '张总',
          approvedAt: '2023-01-07',
          remindDays: 60,
          remark: '高管岗位',
          createdAt: '2022-12-20',
          updatedAt: '2023-01-07',
        },
      ];
      
      setContracts(mockContracts);
      
      const mockTemplates: ContractTemplate[] = [
        {
          id: '1',
          name: '标准劳动合同模板',
          type: 'labor',
          description: '适用于全职员工的标准化劳动合同',
          content: '劳动合同模板内容...',
          isDefault: true,
        },
        {
          id: '2',
          name: '实习协议模板',
          type: 'intern',
          description: '适用于实习生或兼职人员的协议模板',
          content: '实习协议模板内容...',
          isDefault: false,
        },
        {
          id: '3',
          name: '保密协议模板',
          type: 'nda',
          description: '适用于接触敏感信息的员工',
          content: '保密协议模板内容...',
          isDefault: false,
        },
      ];
      
      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
      toast.error('加载合同数据失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      const matchesSearch = contract.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contract.contractNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contract.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
      const matchesType = typeFilter === 'all' || contract.contractType === typeFilter;
      const matchesDepartment = departmentFilter === 'all' || contract.department === departmentFilter;
      return matchesSearch && matchesStatus && matchesType && matchesDepartment;
    });
  }, [contracts, searchTerm, statusFilter, typeFilter, departmentFilter]);

  const departments = useMemo(() => {
    return Array.from(new Set(contracts.map(c => c.department)));
  }, [contracts]);

  const getStatusBadge = (status: Contract['status']) => {
    const statusMap = {
      draft: { label: '草稿', color: 'bg-gray-100 text-gray-800' },
      active: { label: '生效中', color: 'bg-green-100 text-green-800' },
      expired: { label: '已过期', color: 'bg-red-100 text-red-800' },
      terminated: { label: '已终止', color: 'bg-red-100 text-red-800' },
      renewed: { label: '已续签', color: 'bg-blue-100 text-blue-800' },
    };
    const { label, color } = statusMap[status];
    return <Badge className={color}>{label}</Badge>;
  };

  const getTypeBadge = (type: Contract['contractType']) => {
    const typeMap = {
      labor: { label: '劳动合同', color: 'bg-blue-100 text-blue-800' },
      intern: { label: '实习协议', color: 'bg-purple-100 text-purple-800' },
      outsourcing: { label: '外包合同', color: 'bg-orange-100 text-orange-800' },
      consulting: { label: '咨询协议', color: 'bg-teal-100 text-teal-800' },
      nda: { label: '保密协议', color: 'bg-red-100 text-red-800' },
      other: { label: '其他', color: 'bg-gray-100 text-gray-800' },
    };
    const { label, color } = typeMap[type];
    return <Badge className={color}>{label}</Badge>;
  };

  const stats = useMemo(() => {
    const today = new Date();
    const expiringIn30Days = contracts.filter(c => {
      const endDate = new Date(c.endDate);
      const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return c.status === 'active' && daysLeft <= 30 && daysLeft > 0;
    }).length;
    
    const expiringIn90Days = contracts.filter(c => {
      const endDate = new Date(c.endDate);
      const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return c.status === 'active' && daysLeft <= 90 && daysLeft > 30;
    }).length;
    
    return {
      total: contracts.length,
      active: contracts.filter(c => c.status === 'active').length,
      expired: contracts.filter(c => c.status === 'expired').length,
      expiringIn30Days,
      expiringIn90Days,
      draft: contracts.filter(c => c.status === 'draft').length,
    };
  }, [contracts]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">合同管理</h1>
          <p className="text-muted-foreground mt-1">
            管理员工劳动合同，确保合规性
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchContracts}>
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新建合同
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>合同总数</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>生效中</CardDescription>
            <CardTitle className="text-2xl text-green-600">{stats.active}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>已过期</CardDescription>
            <CardTitle className="text-2xl text-red-600">{stats.expired}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>30天内到期</CardDescription>
            <CardTitle className="text-2xl text-orange-600">{stats.expiringIn30Days}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>90天内到期</CardDescription>
            <CardTitle className="text-2xl text-yellow-600">{stats.expiringIn90Days}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>草稿</CardDescription>
            <CardTitle className="text-2xl text-gray-600">{stats.draft}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Alerts */}
      {stats.expiringIn30Days > 0 && (
        <Alert className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            有 <strong>{stats.expiringIn30Days}</strong> 份合同将在30天内到期，请及时处理续签或终止事宜
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
        <TabsList>
          <TabsTrigger value="contracts">合同列表</TabsTrigger>
          <TabsTrigger value="templates">合同模板</TabsTrigger>
          <TabsTrigger value="reminders">到期提醒</TabsTrigger>
        </TabsList>

        <TabsContent value="contracts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>合同列表</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索员工姓名、合同编号..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="active">生效中</SelectItem>
                      <SelectItem value="expired">已过期</SelectItem>
                      <SelectItem value="draft">草稿</SelectItem>
                      <SelectItem value="terminated">已终止</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="labor">劳动合同</SelectItem>
                      <SelectItem value="intern">实习协议</SelectItem>
                      <SelectItem value="nda">保密协议</SelectItem>
                      <SelectItem value="outsourcing">外包合同</SelectItem>
                      <SelectItem value="consulting">咨询协议</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={departmentFilter} onValueChange={(v: any) => setDepartmentFilter(v)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部部门</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>合同编号</TableHead>
                    <TableHead>员工信息</TableHead>
                    <TableHead>部门/职位</TableHead>
                    <TableHead>合同类型</TableHead>
                    <TableHead>合同期限</TableHead>
                    <TableHead>薪资</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>附件</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract) => {
                    const today = new Date();
                    const endDate = new Date(contract.endDate);
                    const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    const isExpiringSoon = contract.status === 'active' && daysLeft <= 30 && daysLeft > 0;
                    
                    return (
                      <TableRow key={contract.id} className={isExpiringSoon ? 'bg-orange-50 dark:bg-orange-900/10' : ''}>
                        <TableCell className="font-mono text-sm">{contract.contractNo}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{contract.employeeName.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{contract.employeeName}</div>
                              <div className="text-xs text-muted-foreground">{contract.employeeId}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm">{contract.position}</div>
                            <div className="text-xs text-muted-foreground">{contract.department}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(contract.contractType)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{contract.startDate} ~ {contract.endDate}</div>
                            {contract.status === 'active' && daysLeft > 0 && (
                              <div className={cn(
                                'text-xs font-medium mt-1',
                                daysLeft <= 30 ? 'text-orange-600' : daysLeft <= 90 ? 'text-yellow-600' : 'text-muted-foreground'
                              )}>
                                剩余 {daysLeft} 天
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">¥{contract.salary.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">
                              /{contract.salaryPeriod === 'month' ? '月' : '年'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(contract.status)}</TableCell>
                        <TableCell>
                          {contract.attachmentName && (
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground truncate max-w-32">
                                {contract.attachmentName}
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedContract(contract)}>
                              <Eye className="h-4 w-4 mr-1" />
                              查看
                            </Button>
                            {contract.status === 'active' && daysLeft <= 90 && (
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                续签
                              </Button>
                            )}
                            {contract.attachmentUrl && (
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>合同模板</CardTitle>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  新建模板
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{template.name}</CardTitle>
                            {template.isDefault && (
                              <Badge className="mt-1">默认模板</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          <Edit className="mr-2 h-4 w-4" />
                          编辑
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Share2 className="mr-2 h-4 w-4" />
                          使用
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>到期提醒</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contracts
                  .filter(c => {
                    const endDate = new Date(c.endDate);
                    const daysLeft = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return c.status === 'active' && daysLeft > 0;
                  })
                  .sort((a, b) => {
                    const daysA = Math.ceil((new Date(a.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    const daysB = Math.ceil((new Date(b.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return daysA - daysB;
                  })
                  .map((contract) => {
                    const daysLeft = Math.ceil((new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    const urgencyColor = daysLeft <= 30 ? 'border-orange-500 bg-orange-50' : daysLeft <= 90 ? 'border-yellow-500 bg-yellow-50' : 'border-blue-500 bg-blue-50';
                    const urgencyText = daysLeft <= 30 ? '紧急' : daysLeft <= 90 ? '即将到期' : '正常';
                    
                    return (
                      <div key={contract.id} className={cn('flex items-center justify-between p-4 border rounded-lg', urgencyColor)}>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>{contract.employeeName.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{contract.employeeName}</div>
                            <div className="text-sm text-muted-foreground">{contract.department} · {contract.position}</div>
                            <div className="text-sm font-mono mt-1">{contract.contractNo}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{daysLeft}天后到期</div>
                          <div className="text-sm text-muted-foreground">{contract.endDate}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{urgencyText}</Badge>
                          <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            续签
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            下载
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Dialog */}
      <Dialog open={!!selectedContract} onOpenChange={(open) => !open && setSelectedContract(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedContract && (
            <>
              <DialogHeader>
                <DialogTitle>合同详情</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* 基本信息 */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label>合同编号</Label>
                    <div className="mt-1 font-mono text-sm">{selectedContract.contractNo}</div>
                  </div>
                  <div>
                    <Label>合同类型</Label>
                    <div className="mt-1">{getTypeBadge(selectedContract.contractType)}</div>
                  </div>
                  <div>
                    <Label>合同状态</Label>
                    <div className="mt-1">{getStatusBadge(selectedContract.status)}</div>
                  </div>
                  <div>
                    <Label>员工姓名</Label>
                    <div className="mt-1 font-medium">{selectedContract.employeeName}</div>
                  </div>
                  <div>
                    <Label>员工编号</Label>
                    <div className="mt-1 font-mono text-sm">{selectedContract.employeeId}</div>
                  </div>
                  <div>
                    <Label>部门</Label>
                    <div className="mt-1">{selectedContract.department}</div>
                  </div>
                  <div>
                    <Label>职位</Label>
                    <div className="mt-1">{selectedContract.position}</div>
                  </div>
                  <div>
                    <Label>签订日期</Label>
                    <div className="mt-1">{selectedContract.signDate}</div>
                  </div>
                  <div>
                    <Label>合同期限</Label>
                    <div className="mt-1">{selectedContract.contractTerm}个月</div>
                  </div>
                </div>

                {/* 合同期限 */}
                <div>
                  <Label>合同期限</Label>
                  <div className="mt-2 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">开始日期</div>
                        <div className="text-lg font-medium">{selectedContract.startDate}</div>
                      </div>
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">结束日期</div>
                        <div className="text-lg font-medium">{selectedContract.endDate}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 薪资信息 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>薪资</Label>
                    <div className="mt-1">
                      <span className="text-2xl font-bold">¥{selectedContract.salary.toLocaleString()}</span>
                      <span className="text-muted-foreground ml-1">/{selectedContract.salaryPeriod === 'month' ? '月' : '年'}</span>
                    </div>
                  </div>
                  <div>
                    <Label>试用期</Label>
                    <div className="mt-1 text-2xl font-bold">{selectedContract.probationPeriod}个月</div>
                  </div>
                </div>

                {/* 附件 */}
                {selectedContract.attachmentUrl && (
                  <div>
                    <Label>合同附件</Label>
                    <div className="mt-2">
                      <Button variant="outline" className="w-full">
                        <FileText className="mr-2 h-4 w-4" />
                        {selectedContract.attachmentName}
                        <Download className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* 备注 */}
                {selectedContract.remark && (
                  <div>
                    <Label>备注</Label>
                    <p className="mt-1 p-3 bg-muted rounded-lg text-sm">{selectedContract.remark}</p>
                  </div>
                )}

                {/* 审批信息 */}
                {selectedContract.approvedBy && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>审批人</Label>
                      <div className="mt-1">{selectedContract.approvedBy}</div>
                    </div>
                    <div>
                      <Label>审批时间</Label>
                      <div className="mt-1">{selectedContract.approvedAt}</div>
                    </div>
                  </div>
                )}

                {/* 操作 */}
                <DialogFooter>
                  <Button variant="outline">
                    <Printer className="mr-2 h-4 w-4" />
                    打印
                  </Button>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    下载
                  </Button>
                  {selectedContract.status === 'active' && (
                    <Button>
                      <Edit className="mr-2 h-4 w-4" />
                      续签合同
                    </Button>
                  )}
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
