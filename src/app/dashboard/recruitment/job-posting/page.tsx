'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Briefcase,
  Plus,
  Edit,
  Eye,
  Trash2,
  Send,
  Globe,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Search,
  Filter,
  Download,
  Share2,
  Copy,
  ExternalLink,
  Star,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

interface JobPost {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  salaryMin: number;
  salaryMax: number;
  salaryType: 'month' | 'year' | 'hour';
  experience: string;
  education: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  description: string;
  positions: number;
  filledPositions: number;
  status: 'draft' | 'published' | 'paused' | 'closed';
  publishDate?: string;
  deadline?: string;
  postedChannels: string[];
  views: number;
  applicants: number;
  recruiter: string;
  tags: string[];
}

export default function JobPostingPage() {
  const [activeTab, setActiveTab] = useState('active');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [jobPosts, setJobPosts] = useState<JobPost[]>([
    {
      id: '1',
      title: '高级产品经理',
      department: '产品部',
      location: '北京',
      type: 'full-time',
      level: 'senior',
      salaryMin: 25000,
      salaryMax: 40000,
      salaryType: 'month',
      experience: '5-10年',
      education: '本科及以上',
      requirements: [
        '5年以上产品经理经验',
        '有B端产品经验优先',
        '熟悉产品设计和用户体验',
        '良好的沟通协调能力',
        '英语读写能力良好',
      ],
      responsibilities: [
        '负责产品规划和设计',
        '调研用户需求',
        '撰写产品文档',
        '协调开发团队',
        '监控产品数据',
      ],
      benefits: [
        '五险一金',
        '年终奖金',
        '带薪年假',
        '弹性工作',
        '节日福利',
        '定期团建',
      ],
      description: '我们正在寻找一位经验丰富的产品经理，负责公司核心产品线的规划和设计。你需要深入了解用户需求，制定产品策略，推动产品从概念到上线。',
      positions: 2,
      filledPositions: 0,
      status: 'published',
      publishDate: '2024-12-01',
      deadline: '2025-01-31',
      postedChannels: ['公司官网', '招聘网站', '社交媒体'],
      views: 1250,
      applicants: 45,
      recruiter: '张HR',
      tags: ['产品', 'SaaS', 'B端'],
    },
    {
      id: '2',
      title: '资深前端工程师',
      department: '技术部',
      location: '上海',
      type: 'full-time',
      level: 'senior',
      salaryMin: 30000,
      salaryMax: 50000,
      salaryType: 'month',
      experience: '5年以上',
      education: '本科及以上',
      requirements: [
        '精通React/Vue等前端框架',
        '熟悉TypeScript',
        '有大型项目经验',
        '熟悉前端工程化',
        '良好的代码规范',
      ],
      responsibilities: [
        '负责前端架构设计',
        '开发核心功能模块',
        '优化前端性能',
        '编写技术文档',
        '指导初级工程师',
      ],
      benefits: [
        '五险一金',
        '年终奖金',
        '股票期权',
        '弹性工作',
        '技术培训',
      ],
      description: '我们正在寻找一位资深前端工程师加入我们的技术团队，负责公司产品的前端架构设计和核心功能开发。',
      positions: 3,
      filledPositions: 1,
      status: 'published',
      publishDate: '2024-11-20',
      deadline: '2025-02-28',
      postedChannels: ['公司官网', 'GitHub', '技术社区'],
      views: 2100,
      applicants: 68,
      recruiter: '李HR',
      tags: ['前端', 'React', 'TypeScript'],
    },
    {
      id: '3',
      title: '销售总监',
      department: '销售部',
      location: '北京',
      type: 'full-time',
      level: 'lead',
      salaryMin: 40000,
      salaryMax: 60000,
      salaryType: 'month',
      experience: '8年以上',
      education: '本科及以上',
      requirements: [
        '8年以上销售经验',
        '团队管理经验',
        'B端销售经验优先',
        '出色的沟通能力',
        '抗压能力强',
      ],
      responsibilities: [
        '制定销售策略',
        '带领销售团队',
        '拓展客户资源',
        '完成销售目标',
        '培养销售人才',
      ],
      benefits: [
        '五险一金',
        '高额提成',
        '年终奖金',
        '股票期权',
        '年度体检',
      ],
      description: '我们正在寻找一位销售总监，负责公司销售团队的管理和业务拓展。',
      positions: 1,
      filledPositions: 0,
      status: 'published',
      publishDate: '2024-11-15',
      deadline: '2025-01-15',
      postedChannels: ['招聘网站', '猎头', '行业论坛'],
      views: 890,
      applicants: 23,
      recruiter: '王HR',
      tags: ['销售', '管理', 'B端'],
    },
    {
      id: '4',
      title: 'UI设计师',
      department: '设计部',
      location: '杭州',
      type: 'full-time',
      level: 'mid',
      salaryMin: 15000,
      salaryMax: 25000,
      salaryType: 'month',
      experience: '3-5年',
      education: '本科及以上',
      requirements: [
        '精通Figma/Sketch',
        '良好的审美能力',
        '有产品经验优先',
        '了解前端开发',
      ],
      responsibilities: [
        '负责产品界面设计',
        '设计规范制定',
        '视觉设计',
        '交互设计',
      ],
      benefits: [
        '五险一金',
        '年终奖金',
        '弹性工作',
        '设备补贴',
      ],
      description: '我们正在寻找一位UI设计师加入我们的设计团队。',
      positions: 2,
      filledPositions: 2,
      status: 'closed',
      publishDate: '2024-10-01',
      deadline: '2024-11-30',
      postedChannels: ['设计网站', '社交媒体'],
      views: 1560,
      applicants: 89,
      recruiter: '刘HR',
      tags: ['设计', 'UI', 'Figma'],
    },
  ]);

  const [jobFormData, setJobFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'full-time',
    level: 'mid',
    salaryMin: '',
    salaryMax: '',
    experience: '',
    education: '',
    positions: '',
    description: '',
    deadline: '',
  });

  const stats = {
    totalJobs: jobPosts.length,
    publishedJobs: jobPosts.filter(j => j.status === 'published').length,
    draftJobs: jobPosts.filter(j => j.status === 'draft').length,
    totalPositions: jobPosts.reduce((sum, j) => sum + j.positions, 0),
    filledPositions: jobPosts.reduce((sum, j) => sum + j.filledPositions, 0),
    totalApplicants: jobPosts.reduce((sum, j) => sum + j.applicants, 0),
    totalViews: jobPosts.reduce((sum, j) => sum + j.views, 0),
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      draft: { label: '草稿', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
      published: { label: '发布中', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      paused: { label: '暂停', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      closed: { label: '已关闭', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    };
    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getJobTypeBadge = (type: string) => {
    const variants: Record<string, any> = {
      'full-time': { label: '全职', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      'part-time': { label: '兼职', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
      'contract': { label: '合同工', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
      'internship': { label: '实习', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    };
    const variant = variants[type];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const filteredJobs = jobPosts.filter(job => {
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus;
    return matchesDepartment && matchesStatus;
  });

  const handleCreateJob = () => {
    if (!jobFormData.title || !jobFormData.department) {
      toast.error('请填写完整的职位信息');
      return;
    }

    const newJob: JobPost = {
      id: Date.now().toString(),
      title: jobFormData.title,
      department: jobFormData.department,
      location: jobFormData.location,
      type: jobFormData.type as any,
      level: jobFormData.level as any,
      salaryMin: Number(jobFormData.salaryMin) || 0,
      salaryMax: Number(jobFormData.salaryMax) || 0,
      salaryType: 'month',
      experience: jobFormData.experience,
      education: jobFormData.education,
      requirements: [],
      responsibilities: [],
      benefits: [],
      description: jobFormData.description,
      positions: Number(jobFormData.positions) || 1,
      filledPositions: 0,
      status: 'draft',
      deadline: jobFormData.deadline,
      postedChannels: [],
      views: 0,
      applicants: 0,
      recruiter: '当前用户',
      tags: [],
    };

    setJobPosts([...jobPosts, newJob]);
    setShowCreateDialog(false);
    setJobFormData({
      title: '',
      department: '',
      location: '',
      type: 'full-time',
      level: 'mid',
      salaryMin: '',
      salaryMax: '',
      experience: '',
      education: '',
      positions: '',
      description: '',
      deadline: '',
    });
    toast.success('职位创建成功');
  };

  const handleViewJob = (job: JobPost) => {
    setSelectedJob(job);
    setShowViewDialog(true);
  };

  const formatMoney = (amount: number) => {
    return `¥${amount.toLocaleString('zh-CN')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <Briefcase className="h-7 w-7 text-white" />
              </div>
              岗位发布
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              多渠道发布招聘职位，快速找到合适人才
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出职位
            </Button>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  发布职位
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>发布新职位</DialogTitle>
                  <DialogDescription>
                    填写职位信息，创建新的招聘职位
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">职位名称 *</Label>
                      <Input
                        id="title"
                        value={jobFormData.title}
                        onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                        placeholder="例如：高级产品经理"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">所属部门 *</Label>
                      <Select
                        value={jobFormData.department}
                        onValueChange={(v) => setJobFormData({ ...jobFormData, department: v })}
                      >
                        <SelectTrigger id="department">
                          <SelectValue placeholder="选择部门" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="产品部">产品部</SelectItem>
                          <SelectItem value="技术部">技术部</SelectItem>
                          <SelectItem value="销售部">销售部</SelectItem>
                          <SelectItem value="市场部">市场部</SelectItem>
                          <SelectItem value="设计部">设计部</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">工作地点</Label>
                      <Input
                        id="location"
                        value={jobFormData.location}
                        onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
                        placeholder="例如：北京"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">职位类型</Label>
                      <Select
                        value={jobFormData.type}
                        onValueChange={(v) => setJobFormData({ ...jobFormData, type: v })}
                      >
                        <SelectTrigger id="type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">全职</SelectItem>
                          <SelectItem value="part-time">兼职</SelectItem>
                          <SelectItem value="contract">合同工</SelectItem>
                          <SelectItem value="internship">实习</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="level">职位级别</Label>
                      <Select
                        value={jobFormData.level}
                        onValueChange={(v) => setJobFormData({ ...jobFormData, level: v })}
                      >
                        <SelectTrigger id="level">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">初级</SelectItem>
                          <SelectItem value="mid">中级</SelectItem>
                          <SelectItem value="senior">高级</SelectItem>
                          <SelectItem value="lead">主管</SelectItem>
                          <SelectItem value="executive">高管</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="positions">招聘人数</Label>
                      <Input
                        id="positions"
                        type="number"
                        value={jobFormData.positions}
                        onChange={(e) => setJobFormData({ ...jobFormData, positions: e.target.value })}
                        placeholder="1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salaryMin">最低薪资</Label>
                      <Input
                        id="salaryMin"
                        type="number"
                        value={jobFormData.salaryMin}
                        onChange={(e) => setJobFormData({ ...jobFormData, salaryMin: e.target.value })}
                        placeholder="例如：20000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salaryMax">最高薪资</Label>
                      <Input
                        id="salaryMax"
                        type="number"
                        value={jobFormData.salaryMax}
                        onChange={(e) => setJobFormData({ ...jobFormData, salaryMax: e.target.value })}
                        placeholder="例如：30000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience">工作年限</Label>
                      <Input
                        id="experience"
                        value={jobFormData.experience}
                        onChange={(e) => setJobFormData({ ...jobFormData, experience: e.target.value })}
                        placeholder="例如：3-5年"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="education">学历要求</Label>
                      <Input
                        id="education"
                        value={jobFormData.education}
                        onChange={(e) => setJobFormData({ ...jobFormData, education: e.target.value })}
                        placeholder="例如：本科及以上"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">截止日期</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={jobFormData.deadline}
                      onChange={(e) => setJobFormData({ ...jobFormData, deadline: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">职位描述</Label>
                    <Textarea
                      id="description"
                      value={jobFormData.description}
                      onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                      placeholder="详细描述职位职责和要求..."
                      rows={5}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>取消</Button>
                  <Button onClick={handleCreateJob}>创建职位</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">职位总数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalJobs}</div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                <Briefcase className="h-3 w-3 mr-1" />
                个
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">发布中</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.publishedJobs}</div>
              <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                个
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">草稿</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.draftJobs}</div>
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                <FileText className="h-3 w-3 mr-1" />
                个
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">招聘人数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalPositions}</div>
              <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mt-1">
                <Users className="h-3 w-3 mr-1" />
                人
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">已入职</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.filledPositions}</div>
              <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                人
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">累计投递</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.totalApplicants}
              </div>
              <div className="flex items-center text-xs text-purple-600 dark:text-purple-400 mt-1">
                <Users className="h-3 w-3 mr-1" />
                人
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 功能Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              在招职位
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              全部职位
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              数据分析
            </TabsTrigger>
          </TabsList>

          {/* 在招职位 */}
          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>正在招聘的职位</CardTitle>
                    <CardDescription>管理所有发布中的职位</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部部门</SelectItem>
                        <SelectItem value="产品部">产品部</SelectItem>
                        <SelectItem value="技术部">技术部</SelectItem>
                        <SelectItem value="销售部">销售部</SelectItem>
                        <SelectItem value="设计部">设计部</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredJobs.filter(j => j.status === 'published').map((job) => (
                    <Card key={job.id} className="hover:shadow-md transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {job.title}
                              </h3>
                              {getJobTypeBadge(job.type)}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Badge variant="outline">{job.department}</Badge>
                              <Badge variant="outline">{job.location}</Badge>
                            </div>
                          </div>
                          {getStatusBadge(job.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                              <DollarSign className="h-4 w-4" />
                              <span className="font-medium text-gray-900 dark:text-white">
                                {formatMoney(job.salaryMin)} - {formatMoney(job.salaryMax)}/{job.salaryType === 'month' ? '月' : '年'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                              <Users className="h-4 w-4" />
                              <span>{job.positions - job.filledPositions}/{job.positions} 人</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>{job.experience}</span>
                            <span>·</span>
                            <span>{job.education}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {job.tags.map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t dark:border-gray-700">
                          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{job.views}次浏览</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{job.applicants}人投递</span>
                            </div>
                            {job.deadline && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{job.deadline}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleViewJob(job)}>
                              <Eye className="h-4 w-4 mr-1" />
                              查看
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              编辑
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4 mr-1" />
                              分享
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 全部职位 */}
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>所有职位</CardTitle>
                    <CardDescription>查看和管理所有职位</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部部门</SelectItem>
                        <SelectItem value="产品部">产品部</SelectItem>
                        <SelectItem value="技术部">技术部</SelectItem>
                        <SelectItem value="销售部">销售部</SelectItem>
                        <SelectItem value="设计部">设计部</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="published">发布中</SelectItem>
                        <SelectItem value="draft">草稿</SelectItem>
                        <SelectItem value="paused">暂停</SelectItem>
                        <SelectItem value="closed">已关闭</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredJobs.map((job) => (
                    <Card key={job.id} className="hover:shadow-md transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Badge variant="outline" className="text-xs">{job.department}</Badge>
                            </div>
                          </div>
                          {getStatusBadge(job.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-3">
                          <div className="text-sm">
                            <span className="text-gray-600 dark:text-gray-400">薪资：</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {formatMoney(job.salaryMin)} - {formatMoney(job.salaryMax)}/{job.salaryType === 'month' ? '月' : '年'}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600 dark:text-gray-400">招聘：</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {job.positions - job.filledPositions}/{job.positions} 人
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t dark:border-gray-700">
                          <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                            <span>{job.applicants}人投递</span>
                            <span>{job.views}次浏览</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleViewJob(job)}>
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 数据分析 */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>职位浏览量排行</CardTitle>
                  <CardDescription>最受欢迎的职位</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobPosts.sort((a, b) => b.views - a.views).slice(0, 5).map((job, idx) => (
                      <div key={job.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full text-xs font-medium text-blue-600 dark:text-blue-400">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{job.title}</div>
                            <div className="text-xs text-gray-500">{job.department}</div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          {job.views}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>投递量排行</CardTitle>
                  <CardDescription>投递人数最多的职位</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobPosts.sort((a, b) => b.applicants - a.applicants).slice(0, 5).map((job, idx) => (
                      <div key={job.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full text-xs font-medium text-green-600 dark:text-green-400">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{job.title}</div>
                            <div className="text-xs text-gray-500">{job.department}</div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          {job.applicants}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* 查看职位详情对话框 */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedJob?.title}</DialogTitle>
              <DialogDescription>
                {selectedJob?.department} · {selectedJob?.location}
              </DialogDescription>
            </DialogHeader>
            {selectedJob && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  {getStatusBadge(selectedJob.status)}
                  {getJobTypeBadge(selectedJob.type)}
                  <Badge variant="outline">{selectedJob.location}</Badge>
                  <Badge variant="outline">{selectedJob.experience}</Badge>
                  <Badge variant="outline">{selectedJob.education}</Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">薪资范围</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatMoney(selectedJob.salaryMin)} - {formatMoney(selectedJob.salaryMax)}/{selectedJob.salaryType === 'month' ? '月' : '年'}
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">招聘进度</div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {selectedJob.filledPositions}/{selectedJob.positions} 人
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">职位描述</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedJob.description}</p>
                </div>

                {selectedJob.responsibilities.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">岗位职责</h3>
                    <ul className="space-y-2">
                      {selectedJob.responsibilities.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedJob.requirements.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">任职要求</h3>
                    <ul className="space-y-2">
                      {selectedJob.requirements.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedJob.benefits.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">福利待遇</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.benefits.map((item, idx) => (
                        <Badge key={idx} variant="secondary" className="text-sm">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{selectedJob.views} 次浏览</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{selectedJob.applicants} 人投递</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline">
                      <Copy className="h-4 w-4 mr-2" />
                      复制链接
                    </Button>
                    <Button variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      预览
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
