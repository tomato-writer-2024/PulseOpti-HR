'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { VirtualScroll } from '@/components/performance/virtual-scroll';
import { ResponsiveImage } from '@/components/performance/optimized-image';
import { useForm } from '@/hooks/use-form';
import { useDebounce } from '@/hooks/use-performance';
import {
  Building2,
  Briefcase,
  Calendar,
  Filter,
  Plus,
  Download,
  Search,
  Edit,
  Trash2,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/theme';

// 类型定义
interface Position {
  id: string;
  title: string;
  department: string;
  location: string;
  salary: string;
  status: 'active' | 'paused' | 'closed';
  createdAt: string;
  applicants: number;
  requirements: string[];
  responsibilities: string[];
}

interface Candidate {
  id: string;
  name: string;
  position: string;
  status: 'pending' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  experience: string;
  phone: string;
  email: string;
  appliedDate: string;
  avatar: string | null;
  education: string;
  university: string;
  resumeUrl?: string;
  notes?: string;
}

// 模拟数据生成
const generateMockPositions = (): Position[] => [
  {
    id: '1',
    title: '高级前端工程师',
    department: '技术部',
    location: '北京',
    salary: '25-40K',
    status: 'active',
    createdAt: '2024-01-15',
    applicants: 45,
    requirements: ['5年以上前端开发经验', '精通React/Vue', '熟悉Node.js', '有大型项目经验'],
    responsibilities: ['负责公司核心产品开发', '优化前端性能', '技术方案设计', '团队技术指导'],
  },
  {
    id: '2',
    title: '产品经理',
    department: '产品部',
    location: '上海',
    salary: '20-35K',
    status: 'active',
    createdAt: '2024-01-10',
    applicants: 32,
    requirements: ['3年以上产品经验', '有B端产品经验', '优秀的沟通能力', '数据分析能力强'],
    responsibilities: ['需求调研与分析', '产品规划与设计', '跨团队协作', '产品迭代优化'],
  },
  {
    id: '3',
    title: '数据分析师',
    department: '数据部',
    location: '深圳',
    salary: '18-30K',
    status: 'paused',
    createdAt: '2024-01-05',
    applicants: 28,
    requirements: ['熟练使用SQL', '有数据挖掘经验', '熟悉Python', '统计学背景优先'],
    responsibilities: ['数据报表开发', '业务数据分析', '数据模型设计', '数据驱动决策支持'],
  },
  {
    id: '4',
    title: 'UI设计师',
    department: '设计部',
    location: '北京',
    salary: '15-25K',
    status: 'active',
    createdAt: '2024-01-20',
    applicants: 18,
    requirements: ['3年以上UI设计经验', '熟悉Figma/Sketch', '良好的审美', '有动效设计经验优先'],
    responsibilities: ['产品界面设计', '设计规范维护', '设计评审', '交互优化'],
  },
  {
    id: '5',
    title: '后端开发工程师',
    department: '技术部',
    location: '杭州',
    salary: '20-35K',
    status: 'active',
    createdAt: '2024-01-18',
    applicants: 52,
    requirements: ['3年以上后端开发经验', '熟悉Java/Go/Python', '熟悉微服务架构', '有高并发经验'],
    responsibilities: ['后端服务开发', '系统架构设计', '性能优化', '技术文档编写'],
  },
];

const generateMockCandidates = (): Candidate[] =>
  Array.from({ length: 100 }, (_, i) => {
    const positions = ['高级前端工程师', '产品经理', '数据分析师', 'UI设计师', '后端开发工程师'];
    const statuses: Array<'pending' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'> =
      ['pending', 'screening', 'interview', 'offer', 'hired', 'rejected'];

    return {
      id: `cand-${i + 1}`,
      name: `候选人${String.fromCharCode(65 + (i % 26))}${i + 1}`,
      position: positions[i % positions.length],
      status: statuses[i % statuses.length],
      experience: `${(i % 10) + 1}年`,
      phone: `138${String(i).padStart(8, '0')}`,
      email: `candidate${i + 1}@example.com`,
      appliedDate: `2024-01-${String((i % 30) + 1).padStart(2, '0')}`,
      avatar: null,
      education: i % 3 === 0 ? '硕士' : '本科',
      university: ['清华大学', '北京大学', '复旦大学', '上海交大', '浙江大学', '南京大学'][i % 6],
      resumeUrl: `/resumes/resume-${i + 1}.pdf`,
      notes: i % 5 === 0 ? '候选人经验丰富，重点关注' : undefined,
    };
  });

// 状态映射
const statusMap: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: '待筛选', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Clock },
  screening: { label: '筛选中', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: Search },
  interview: { label: '面试中', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: Briefcase },
  offer: { label: '已发Offer', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200', icon: CheckCircle },
  hired: { label: '已录用', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
  rejected: { label: '已拒绝', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: XCircle },
};

const positionStatusMap: Record<string, { label: string; color: string }> = {
  active: { label: '招聘中', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  paused: { label: '暂停招聘', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  closed: { label: '已关闭', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
};

export default function RecruitingPage() {
  const [activeTab, setActiveTab] = useState('positions');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCandidateDetailOpen, setIsCandidateDetailOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [expandedPositions, setExpandedPositions] = useState<Set<string>>(new Set());

  const debouncedSearch = useDebounce(searchQuery, 300);

  // 模拟数据
  const [positions] = useState<Position[]>(generateMockPositions());
  const [candidates] = useState<Candidate[]>(generateMockCandidates());

  // 职位表单
  const positionForm = useForm({
    initialValues: {
      title: '',
      department: '',
      location: '',
      salary: '',
      requirements: '',
      responsibilities: '',
    },
    validationRules: {
      title: { required: true, minLength: 2 },
      department: { required: true },
      location: { required: true },
      salary: { required: true },
      requirements: { required: true },
      responsibilities: { required: true },
    },
    onSubmit: async (values) => {
      console.log('Creating position:', values);
      setIsCreateDialogOpen(false);
      positionForm.resetForm();
    },
  });

  // 筛选候选人
  const filteredCandidates = useMemo(() => {
    let filtered = [...candidates];

    // 搜索过滤
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (cand) =>
          cand.name.toLowerCase().includes(query) ||
          cand.position.toLowerCase().includes(query) ||
          cand.university.toLowerCase().includes(query) ||
          cand.email.toLowerCase().includes(query)
      );
    }

    // 状态过滤
    if (statusFilter !== 'all') {
      filtered = filtered.filter((cand) => cand.status === statusFilter);
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
        case 'date-asc':
          return new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name, 'zh');
        case 'name-desc':
          return b.name.localeCompare(a.name, 'zh');
        default:
          return 0;
      }
    });

    return filtered;
  }, [candidates, debouncedSearch, statusFilter, sortBy]);

  // 筛选职位
  const filteredPositions = useMemo(() => {
    if (!debouncedSearch) return positions;

    const query = debouncedSearch.toLowerCase();
    return positions.filter(
      (pos) =>
        pos.title.toLowerCase().includes(query) ||
        pos.department.toLowerCase().includes(query) ||
        pos.location.toLowerCase().includes(query)
    );
  }, [positions, debouncedSearch]);

  // 统计数据
  const stats = useMemo(() => {
    const totalPositions = positions.length;
    const activePositions = positions.filter((p) => p.status === 'active').length;
    const totalCandidates = candidates.length;
    const newCandidatesThisWeek = candidates.filter(
      (c) => {
        const appliedDate = new Date(c.appliedDate);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return appliedDate >= weekAgo;
      }
    ).length;

    return { totalPositions, activePositions, totalCandidates, newCandidatesThisWeek };
  }, [positions, candidates]);

  // 切换职位展开状态
  const togglePositionExpand = useCallback((positionId: string) => {
    setExpandedPositions((prev) => {
      const next = new Set(prev);
      if (next.has(positionId)) {
        next.delete(positionId);
      } else {
        next.add(positionId);
      }
      return next;
    });
  }, []);

  // 查看候选人详情
  const viewCandidateDetail = useCallback((candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsCandidateDetailOpen(true);
  }, []);

  // 更新候选人状态
  const updateCandidateStatus = useCallback((candidateId: string, newStatus: Candidate['status']) => {
    console.log('Updating candidate status:', candidateId, newStatus);
    // TODO: 调用API更新状态
  }, []);

  // 职位卡片
  const PositionCard = useCallback((position: Position) => {
    const isExpanded = expandedPositions.has(position.id);
    const statusInfo = positionStatusMap[position.status];

    return (
      <Card key={position.id} className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-lg truncate">{position.title}</CardTitle>
                <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
              </div>
              <CardDescription className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Building2 size={14} />
                  {position.department}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {position.location}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign size={14} />
                  {position.salary}
                </span>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => togglePositionExpand(position.id)}>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </Button>
              <Button variant="ghost" size="icon">
                <Edit size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">应聘人数</span>
              <Badge variant="secondary">{position.applicants}人</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">发布日期</span>
              <span>{position.createdAt}</span>
            </div>
            {isExpanded && (
              <div className="pt-3 border-t space-y-2">
                <div>
                  <Label className="text-sm font-medium">任职要求</Label>
                  <ul className="mt-1 space-y-1">
                    {position.requirements.map((req, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Label className="text-sm font-medium">岗位职责</Label>
                  <ul className="mt-1 space-y-1">
                    {position.responsibilities.map((resp, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }, [expandedPositions, togglePositionExpand]);

  // 候选人列表项
  const CandidateItem = useCallback((candidate: Candidate) => {
    const statusInfo = statusMap[candidate.status];
    const StatusIcon = statusInfo.icon;

    return (
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="shrink-0 relative">
            {candidate.avatar ? (
              <ResponsiveImage
                src={candidate.avatar}
                alt={candidate.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-lg">
                {candidate.name.charAt(0)}
              </div>
            )}
            {candidate.notes && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white dark:border-gray-800" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-gray-900 dark:text-white truncate">
                {candidate.name}
              </h4>
              {candidate.notes && (
                <Badge variant="outline" className="text-xs">备注</Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {candidate.position}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {candidate.university} · {candidate.education} · {candidate.experience}经验
            </p>
          </div>

          <div className="hidden md:flex items-center gap-4 shrink-0">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p className="flex items-center gap-1">
                <Mail size={12} />
                {candidate.email}
              </p>
              <p className="flex items-center gap-1 mt-1">
                <Phone size={12} />
                {candidate.phone}
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p className="flex items-center gap-1">
                <Calendar size={12} />
                {candidate.appliedDate}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-4">
          <Badge className={statusInfo.color} variant="secondary">
            <StatusIcon size={12} className="mr-1" />
            {statusInfo.label}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => viewCandidateDetail(candidate)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Eye size={16} />
          </Button>
        </div>
      </div>
    );
  }, [viewCandidateDetail]);

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">招聘管理</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            管理职位发布、候选人筛选和面试安排
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            导出数据
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus size={16} className="mr-2" />
                发布职位
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>发布新职位</DialogTitle>
                <DialogDescription>
                  填写职位信息，发布后即可接收候选人投递
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={positionForm.handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">职位名称 *</Label>
                    <Input
                      id="title"
                      placeholder="例如：高级前端工程师"
                      value={positionForm.values.title}
                      onChange={(e) => positionForm.handleChange('title', e.target.value)}
                      onBlur={() => positionForm.handleBlur('title')}
                      className={positionForm.errors.title ? 'border-red-500' : ''}
                    />
                    {positionForm.errors.title && (
                      <p className="text-sm text-red-500">{positionForm.errors.title}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">所属部门 *</Label>
                    <Select
                      value={positionForm.values.department}
                      onValueChange={(value) => positionForm.handleChange('department', value)}
                    >
                      <SelectTrigger className={positionForm.errors.department ? 'border-red-500' : ''}>
                        <SelectValue placeholder="选择部门" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="技术部">技术部</SelectItem>
                        <SelectItem value="产品部">产品部</SelectItem>
                        <SelectItem value="设计部">设计部</SelectItem>
                        <SelectItem value="市场部">市场部</SelectItem>
                        <SelectItem value="运营部">运营部</SelectItem>
                      </SelectContent>
                    </Select>
                    {positionForm.errors.department && (
                      <p className="text-sm text-red-500">{positionForm.errors.department}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">工作地点 *</Label>
                    <Input
                      id="location"
                      placeholder="例如：北京"
                      value={positionForm.values.location}
                      onChange={(e) => positionForm.handleChange('location', e.target.value)}
                      onBlur={() => positionForm.handleBlur('location')}
                      className={positionForm.errors.location ? 'border-red-500' : ''}
                    />
                    {positionForm.errors.location && (
                      <p className="text-sm text-red-500">{positionForm.errors.location}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">薪资范围 *</Label>
                    <Input
                      id="salary"
                      placeholder="例如：25-40K"
                      value={positionForm.values.salary}
                      onChange={(e) => positionForm.handleChange('salary', e.target.value)}
                      onBlur={() => positionForm.handleBlur('salary')}
                      className={positionForm.errors.salary ? 'border-red-500' : ''}
                    />
                    {positionForm.errors.salary && (
                      <p className="text-sm text-red-500">{positionForm.errors.salary}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requirements">任职要求 *</Label>
                  <Textarea
                    id="requirements"
                    placeholder="每行一条要求"
                    value={positionForm.values.requirements}
                    onChange={(e) => positionForm.handleChange('requirements', e.target.value)}
                    onBlur={() => positionForm.handleBlur('requirements')}
                    rows={4}
                    className={positionForm.errors.requirements ? 'border-red-500' : ''}
                  />
                  {positionForm.errors.requirements && (
                    <p className="text-sm text-red-500">{positionForm.errors.requirements}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsibilities">岗位职责 *</Label>
                  <Textarea
                    id="responsibilities"
                    placeholder="每行一条职责"
                    value={positionForm.values.responsibilities}
                    onChange={(e) => positionForm.handleChange('responsibilities', e.target.value)}
                    onBlur={() => positionForm.handleBlur('responsibilities')}
                    rows={4}
                    className={positionForm.errors.responsibilities ? 'border-red-500' : ''}
                  />
                  {positionForm.errors.responsibilities && (
                    <p className="text-sm text-red-500">{positionForm.errors.responsibilities}</p>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      positionForm.resetForm();
                    }}
                  >
                    取消
                  </Button>
                  <Button type="submit" disabled={positionForm.submitting}>
                    {positionForm.submitting ? '发布中...' : '发布职位'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              在招职位
            </CardTitle>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.activePositions}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              共 {stats.totalPositions} 个职位
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              候选人总数
            </CardTitle>
            <UserPlus className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalCandidates}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              本周新增 {stats.newCandidatesThisWeek} 人
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              待筛选
            </CardTitle>
            <Filter className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {candidates.filter((c) => c.status === 'pending').length}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              需要尽快处理
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              面试中
            </CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {candidates.filter((c) => c.status === 'interview').length}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              需要安排面试
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 主内容区域 */}
      <Tabs defaultValue="positions" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="positions">职位管理</TabsTrigger>
            <TabsTrigger value="candidates">候选人池</TabsTrigger>
          </TabsList>
        </div>

        {/* 职位管理 */}
        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="搜索职位名称、部门或地点..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPositions.map(PositionCard)}
              </div>
              {filteredPositions.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  暂无职位数据
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 候选人池 */}
        <TabsContent value="candidates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative flex-1 max-w-md w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="搜索候选人姓名、职位、学校或邮箱..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="状态筛选" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="pending">待筛选</SelectItem>
                      <SelectItem value="screening">筛选中</SelectItem>
                      <SelectItem value="interview">面试中</SelectItem>
                      <SelectItem value="offer">已发Offer</SelectItem>
                      <SelectItem value="hired">已录用</SelectItem>
                      <SelectItem value="rejected">已拒绝</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="排序方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">最新优先</SelectItem>
                      <SelectItem value="date-asc">最早优先</SelectItem>
                      <SelectItem value="name-asc">姓名升序</SelectItem>
                      <SelectItem value="name-desc">姓名降序</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <VirtualScroll
                items={filteredCandidates}
                itemHeight={100}
                height={600}
                renderItem={CandidateItem}
                className="h-[600px]"
              />
              {filteredCandidates.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  暂无候选人数据
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 候选人详情对话框 */}
      <Dialog open={isCandidateDetailOpen} onOpenChange={setIsCandidateDetailOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>候选人详情</DialogTitle>
          </DialogHeader>
          {selectedCandidate && (
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {selectedCandidate.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedCandidate.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {selectedCandidate.position}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {selectedCandidate.university}
                    </span>
                    <span>·</span>
                    <span>{selectedCandidate.education}</span>
                    <span>·</span>
                    <span>{selectedCandidate.experience}经验</span>
                  </div>
                </div>
                <Badge className={statusMap[selectedCandidate.status].color} variant="secondary">
                  {statusMap[selectedCandidate.status].label}
                </Badge>
              </div>

              {/* 联系方式 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Mail size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">邮箱</p>
                    <p className="text-sm font-medium">{selectedCandidate.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Phone size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">电话</p>
                    <p className="text-sm font-medium">{selectedCandidate.phone}</p>
                  </div>
                </div>
              </div>

              {/* 状态更新 */}
              <div>
                <Label>更新状态</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {Object.entries(statusMap).map(([key, value]) => (
                    <Button
                      key={key}
                      variant={selectedCandidate.status === key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateCandidateStatus(selectedCandidate.id, key as any)}
                      className="justify-start"
                    >
                      <value.icon size={14} className="mr-2" />
                      {value.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 备注 */}
              {selectedCandidate.notes && (
                <div>
                  <Label>备注</Label>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    {selectedCandidate.notes}
                  </p>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsCandidateDetailOpen(false)}>
                  关闭
                </Button>
                <Button>安排面试</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
