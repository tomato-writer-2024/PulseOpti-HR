'use client';

import { useState, useEffect } from 'react';
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
  Eye,
  Edit,
  Send,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Calendar,
  User,
  Building,
} from 'lucide-react';
import { toast } from 'sonner';

type OfferStatus = 'draft' | 'pending' | 'approved' | 'sent' | 'accepted' | 'rejected' | 'expired';
type OfferType = 'full-time' | 'part-time' | 'contract' | 'internship';

interface Offer {
  id: string;
  offerNo: string;
  candidateName: string;
  position: string;
  department: string;
  type: OfferType;
  status: OfferStatus;
  salary: number;
  salaryCurrency: string;
  startDate: string;
  expiryDate: string;
  createdBy: string;
  createdAt: string;
  sentAt?: string;
  respondedAt?: string;
}

export default function OfferManagementPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateOffer, setShowCreateOffer] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [newOffer, setNewOffer] = useState({
    candidateName: '',
    position: '',
    department: '',
    type: 'full-time' as OfferType,
    salary: '',
    startDate: '',
    expiryDate: '',
  });

  useEffect(() => {
    // 模拟获取Offer数据
    setTimeout(() => {
      setOffers([
        {
          id: '1',
          offerNo: 'OF2024010001',
          candidateName: '张伟',
          position: '高级前端工程师',
          department: '技术部',
          type: 'full-time',
          status: 'pending',
          salary: 25000,
          salaryCurrency: 'CNY',
          startDate: '2024-02-15',
          expiryDate: '2024-02-10',
          createdBy: 'HR Manager',
          createdAt: '2024-01-28T10:00:00',
        },
        {
          id: '2',
          offerNo: 'OF2024010002',
          candidateName: '李娜',
          position: '产品经理',
          department: '产品部',
          type: 'full-time',
          status: 'sent',
          salary: 22000,
          salaryCurrency: 'CNY',
          startDate: '2024-02-20',
          expiryDate: '2024-02-05',
          createdBy: 'HR Manager',
          createdAt: '2024-01-26T14:30:00',
          sentAt: '2024-01-27T10:00:00',
        },
        {
          id: '3',
          offerNo: 'OF2024010003',
          candidateName: '王明',
          position: '销售主管',
          department: '销售部',
          type: 'full-time',
          status: 'accepted',
          salary: 18000,
          salaryCurrency: 'CNY',
          startDate: '2024-02-01',
          expiryDate: '2024-01-25',
          createdBy: 'HR BP',
          createdAt: '2024-01-20T09:15:00',
          sentAt: '2024-01-21T10:00:00',
          respondedAt: '2024-01-23T15:30:00',
        },
        {
          id: '4',
          offerNo: 'OF2024010004',
          candidateName: '赵敏',
          position: 'UI设计师',
          department: '产品部',
          type: 'full-time',
          status: 'rejected',
          salary: 20000,
          salaryCurrency: 'CNY',
          startDate: '2024-02-18',
          expiryDate: '2024-01-28',
          createdBy: 'HR Manager',
          createdAt: '2024-01-22T11:00:00',
          sentAt: '2024-01-23T10:00:00',
          respondedAt: '2024-01-26T14:00:00',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateOffer = () => {
    const offer: Offer = {
      id: Date.now().toString(),
      offerNo: `OF${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${(offers.length + 1).toString().padStart(4, '0')}`,
      candidateName: newOffer.candidateName,
      position: newOffer.position,
      department: newOffer.department,
      type: newOffer.type,
      status: 'draft',
      salary: parseFloat(newOffer.salary),
      salaryCurrency: 'CNY',
      startDate: newOffer.startDate,
      expiryDate: newOffer.expiryDate,
      createdBy: '当前用户',
      createdAt: new Date().toISOString(),
    };
    setOffers([offer, ...offers]);
    setShowCreateOffer(false);
    toast.success('Offer已创建');
    setNewOffer({
      candidateName: '',
      position: '',
      department: '',
      type: 'full-time',
      salary: '',
      startDate: '',
      expiryDate: '',
    });
  };

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.offerNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || offer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const typeConfig: Record<OfferType, { label: string }> = {
    'full-time': { label: '全职' },
    'part-time': { label: '兼职' },
    'contract': { label: '合同' },
    'internship': { label: '实习' },
  };

  const statusConfig: Record<OfferStatus, { label: string; color: string; icon: any }> = {
    draft: { label: '草稿', color: 'bg-gray-500', icon: FileText },
    pending: { label: '待审批', color: 'bg-yellow-500', icon: Clock },
    approved: { label: '已批准', color: 'bg-blue-500', icon: CheckCircle },
    sent: { label: '已发送', color: 'bg-purple-500', icon: Send },
    accepted: { label: '已接受', color: 'bg-green-500', icon: CheckCircle },
    rejected: { label: '已拒绝', color: 'bg-red-500', icon: XCircle },
    expired: { label: '已过期', color: 'bg-gray-600', icon: Clock },
  };

  const statistics = {
    total: offers.length,
    pending: offers.filter(o => o.status === 'pending').length,
    sent: offers.filter(o => o.status === 'sent').length,
    accepted: offers.filter(o => o.status === 'accepted').length,
    rejected: offers.filter(o => o.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              Offer管理
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              管理招聘Offer和候选人录用
            </p>
          </div>
          <Button onClick={() => setShowCreateOffer(true)}>
            <Plus className="h-4 w-4 mr-2" />
            创建Offer
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">总Offer数</p>
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">待审批</p>
                  <p className="text-2xl font-bold text-yellow-600">{statistics.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">已发送</p>
                  <p className="text-2xl font-bold text-purple-600">{statistics.sent}</p>
                </div>
                <Send className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">已接受</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.accepted}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">已拒绝</p>
                  <p className="text-2xl font-bold text-red-600">{statistics.rejected}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 筛选栏 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索Offer编号、候选人或职位..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
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
            </div>
          </CardContent>
        </Card>

        {/* Offer列表 */}
        <Card>
          <CardHeader>
            <CardTitle>Offer列表</CardTitle>
            <CardDescription>
              共 {filteredOffers.length} 份Offer
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-600 dark:text-gray-400">加载中...</div>
              </div>
            ) : filteredOffers.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">暂无Offer记录</p>
                <Button className="mt-4" onClick={() => setShowCreateOffer(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  创建Offer
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Offer编号</TableHead>
                    <TableHead>候选人</TableHead>
                    <TableHead>职位</TableHead>
                    <TableHead>部门</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>薪资</TableHead>
                    <TableHead>入职日期</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOffers.map((offer) => {
                    const statusIcon = statusConfig[offer.status].icon;
                    const StatusIcon = statusIcon;
                    return (
                      <TableRow key={offer.id}>
                        <TableCell className="font-mono text-sm">{offer.offerNo}</TableCell>
                        <TableCell className="font-medium flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          {offer.candidateName}
                        </TableCell>
                        <TableCell>{offer.position}</TableCell>
                        <TableCell>{offer.department}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{typeConfig[offer.type].label}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ¥{offer.salary.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            {offer.startDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusConfig[offer.status].color} text-white border-0 flex items-center gap-1 w-fit`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[offer.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(offer.createdAt).toLocaleDateString('zh-CN')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedOffer(offer)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {offer.status === 'draft' && (
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {offer.status === 'approved' && (
                              <Button variant="ghost" size="sm" onClick={() => toast.success('Offer已发送')}>
                                <Send className="h-4 w-4" />
                              </Button>
                            )}
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

      {/* 创建Offer弹窗 */}
      <Dialog open={showCreateOffer} onOpenChange={setShowCreateOffer}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>创建Offer</DialogTitle>
            <DialogDescription>
              为候选人创建录用Offer
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">候选人姓名 *</label>
                <Input
                  placeholder="输入候选人姓名"
                  value={newOffer.candidateName}
                  onChange={(e) => setNewOffer({ ...newOffer, candidateName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">职位 *</label>
                <Input
                  placeholder="输入职位名称"
                  value={newOffer.position}
                  onChange={(e) => setNewOffer({ ...newOffer, position: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">部门 *</label>
                <Input
                  placeholder="输入部门名称"
                  value={newOffer.department}
                  onChange={(e) => setNewOffer({ ...newOffer, department: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">职位类型 *</label>
                <Select
                  value={newOffer.type}
                  onValueChange={(v) => setNewOffer({ ...newOffer, type: v as OfferType })}
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">月薪 (元) *</label>
                <Input
                  type="number"
                  placeholder="输入月薪"
                  value={newOffer.salary}
                  onChange={(e) => setNewOffer({ ...newOffer, salary: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">入职日期 *</label>
                <Input
                  type="date"
                  value={newOffer.startDate}
                  onChange={(e) => setNewOffer({ ...newOffer, startDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Offer有效期 *</label>
              <Input
                type="date"
                value={newOffer.expiryDate}
                onChange={(e) => setNewOffer({ ...newOffer, expiryDate: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateOffer(false)}>
              取消
            </Button>
            <Button onClick={handleCreateOffer}>
              <Plus className="h-4 w-4 mr-2" />
              创建Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
