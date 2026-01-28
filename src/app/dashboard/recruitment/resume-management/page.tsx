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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  FileText,
  Download,
  Eye,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Calendar,
  Search,
  Filter,
  Star,
  MessageSquare,
  Calendar as CalendarIcon,
  Award,
  ChevronRight,
  User,
  AlertCircle,
  Trash2,
  FileDown,
  ZoomIn,
} from 'lucide-react';
import { toast } from 'sonner';

interface Resume {
  id: string;
  candidateName: string;
  candidateAvatar?: string;
  email: string;
  phone: string;
  location: string;
  age: number;
  gender: 'male' | 'female';
  education: string;
  experience: number;
  currentCompany?: string;
  currentPosition?: string;
  expectedSalary: number;
  expectedSalaryType: 'month' | 'year';
  appliedPosition: string;
  appliedDepartment: string;
  source: string;
  status: 'new' | 'reviewed' | 'interviewing' | 'offered' | 'accepted' | 'rejected' | 'withdrawn';
  applicationDate: string;
  lastUpdate: string;
  tags: string[];
  notes?: string;
  attachments: Attachment[];
  interviews: Interview[];
  evaluation?: Evaluation;
  skills: string[];
  educationDetails: Education[];
  workExperience: Work[];
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

interface Interview {
  id: string;
  type: 'phone' | 'video' | 'onsite' | 'technical';
  scheduledDate: string;
  interviewer: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  feedback?: string;
  rating?: number;
}

interface Education {
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
}

interface Work {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
}

interface Evaluation {
  overallScore: number;
  dimensions: {
    skill: number;
    experience: number;
    communication: number;
    potential: number;
    culture: number;
  };
  comment: string;
}

export default function ResumeManagementPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const [resumes, setResumes] = useState<Resume[]>([
    {
      id: '1',
      candidateName: '张伟',
      email: 'zhangwei@example.com',
      phone: '138-0000-0001',
      location: '北京',
      age: 28,
      gender: 'male',
      education: '本科',
      experience: 5,
      currentCompany: '某科技公司',
      currentPosition: '高级产品经理',
      expectedSalary: 35000,
      expectedSalaryType: 'month',
      appliedPosition: '高级产品经理',
      appliedDepartment: '产品部',
      source: '招聘网站',
      status: 'interviewing',
      applicationDate: '2024-12-01',
      lastUpdate: '2024-12-10',
      tags: ['5年经验', '产品', 'SaaS'],
      notes: '候选人产品经验丰富，特别在B端产品方面有突出表现',
      attachments: [
        {
          id: 'a1',
          name: '张伟_简历.pdf',
          type: 'pdf',
          size: 2048000,
          url: '#',
        },
      ],
      interviews: [
        {
          id: 'i1',
          type: 'phone',
          scheduledDate: '2024-12-05',
          interviewer: '张HR',
          status: 'completed',
          feedback: '电话沟通良好，对产品有深刻理解',
          rating: 4,
        },
        {
          id: 'i2',
          type: 'onsite',
          scheduledDate: '2024-12-15',
          interviewer: '产品总监',
          status: 'scheduled',
        },
      ],
      evaluation: {
        overallScore: 85,
        dimensions: {
          skill: 90,
          experience: 85,
          communication: 85,
          potential: 80,
          culture: 85,
        },
        comment: '综合能力优秀，建议安排面试',
      },
      skills: ['产品设计', '用户研究', '数据分析', '敏捷开发', 'Axure'],
      educationDetails: [
        {
          school: '北京大学',
          degree: '本科',
          major: '计算机科学与技术',
          startDate: '2014-09',
          endDate: '2018-06',
        },
      ],
      workExperience: [
        {
          company: '某科技公司',
          position: '高级产品经理',
          startDate: '2022-01',
          description: '负责公司核心产品线的规划和设计',
        },
        {
          company: '某互联网公司',
          position: '产品经理',
          startDate: '2019-01',
          endDate: '2021-12',
          description: '负责移动端产品的设计和迭代',
        },
      ],
    },
    {
      id: '2',
      candidateName: '李娜',
      email: 'lina@example.com',
      phone: '138-0000-0002',
      location: '上海',
      age: 26,
      gender: 'female',
      education: '硕士',
      experience: 3,
      currentCompany: '某大厂',
      currentPosition: '前端工程师',
      expectedSalary: 40000,
      expectedSalaryType: 'month',
      appliedPosition: '资深前端工程师',
      appliedDepartment: '技术部',
      source: '内部推荐',
      status: 'new',
      applicationDate: '2024-12-10',
      lastUpdate: '2024-12-10',
      tags: ['3年经验', '前端', 'React', '大厂背景'],
      attachments: [
        {
          id: 'a2',
          name: '李娜_简历.pdf',
          type: 'pdf',
          size: 1536000,
          url: '#',
        },
      ],
      interviews: [],
      skills: ['React', 'TypeScript', 'Vue', 'Node.js', 'Webpack'],
      educationDetails: [
        {
          school: '清华大学',
          degree: '硕士',
          major: '软件工程',
          startDate: '2018-09',
          endDate: '2021-06',
        },
      ],
      workExperience: [
        {
          company: '某大厂',
          position: '前端工程师',
          startDate: '2021-07',
          description: '负责电商平台前端开发',
        },
      ],
    },
    {
      id: '3',
      candidateName: '王强',
      email: 'wangqiang@example.com',
      phone: '138-0000-0003',
      location: '北京',
      age: 35,
      gender: 'male',
      education: '本科',
      experience: 10,
      currentCompany: '某知名公司',
      currentPosition: '销售经理',
      expectedSalary: 50000,
      expectedSalaryType: 'month',
      appliedPosition: '销售总监',
      appliedDepartment: '销售部',
      source: '猎头',
      status: 'offered',
      applicationDate: '2024-11-15',
      lastUpdate: '2024-12-08',
      tags: ['10年经验', '销售', '管理', '团队'],
      attachments: [
        {
          id: 'a3',
          name: '王强_简历.docx',
          type: 'docx',
          size: 2560000,
          url: '#',
        },
      ],
      interviews: [
        {
          id: 'i3',
          type: 'onsite',
          scheduledDate: '2024-11-20',
          interviewer: '销售VP',
          status: 'completed',
          feedback: '销售经验丰富，有较强的团队管理能力',
          rating: 5,
        },
        {
          id: 'i4',
          type: 'onsite',
          scheduledDate: '2024-11-25',
          interviewer: 'CEO',
          status: 'completed',
          feedback: '符合公司战略需求，建议录用',
          rating: 5,
        },
      ],
      evaluation: {
        overallScore: 92,
        dimensions: {
          skill: 90,
          experience: 95,
          communication: 90,
          potential: 92,
          culture: 90,
        },
        comment: '优秀人才，强烈推荐录用',
      },
      skills: ['销售管理', '客户开发', '团队管理', '战略规划', '商务谈判'],
      educationDetails: [
        {
          school: '中国人民大学',
          degree: '本科',
          major: '市场营销',
          startDate: '2008-09',
          endDate: '2012-06',
        },
      ],
      workExperience: [
        {
          company: '某知名公司',
          position: '销售经理',
          startDate: '2019-01',
          description: '负责全国销售业务',
        },
        {
          company: '某上市公司',
          position: '销售主管',
          startDate: '2014-01',
          endDate: '2018-12',
          description: '负责华北区域销售',
        },
      ],
    },
  ]);

  const [interviewFormData, setInterviewFormData] = useState({
    type: 'onsite',
    scheduledDate: '',
    interviewer: '',
    notes: '',
  });

  const stats = {
    totalResumes: resumes.length,
    newResumes: resumes.filter(r => r.status === 'new').length,
    interviewing: resumes.filter(r => r.status === 'interviewing').length,
    offered: resumes.filter(r => r.status === 'offered' || r.status === 'accepted').length,
    rejected: resumes.filter(r => r.status === 'rejected').length,
    avgExperience: Math.round(
      resumes.reduce((sum, r) => sum + r.experience, 0) / resumes.length
    ),
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      new: { label: '新投递', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      reviewed: { label: '已筛选', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
      interviewing: { label: '面试中', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      offered: { label: '已发offer', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      accepted: { label: '已接受', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' },
      rejected: { label: '已拒绝', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
      withdrawn: { label: '已撤回', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
    };
    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getInterviewTypeBadge = (type: string) => {
    const variants: Record<string, any> = {
      phone: { label: '电话', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      video: { label: '视频', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
      onsite: { label: '现场', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      technical: { label: '技术', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
    };
    const variant = variants[type];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const filteredResumes = resumes.filter(resume => {
    const matchesStatus = selectedStatus === 'all' || resume.status === selectedStatus;
    const matchesDepartment = selectedDepartment === 'all' || resume.appliedDepartment === selectedDepartment;
    return matchesStatus && matchesDepartment;
  });

  const handleViewResume = (resume: Resume) => {
    setSelectedResume(resume);
    setShowDetailDialog(true);
  };

  const handleScheduleInterview = () => {
    if (!interviewFormData.scheduledDate || !interviewFormData.interviewer) {
      toast.error('请填写完整的面试信息');
      return;
    }

    if (selectedResume) {
      const newInterview: Interview = {
        id: Date.now().toString(),
        type: interviewFormData.type as any,
        scheduledDate: interviewFormData.scheduledDate,
        interviewer: interviewFormData.interviewer,
        status: 'scheduled',
      };

      const updatedResumes = resumes.map(r =>
        r.id === selectedResume.id
          ? { ...r, interviews: [...r.interviews, newInterview] }
          : r
      );
      setResumes(updatedResumes);
      setSelectedResume({ ...selectedResume, interviews: [...selectedResume.interviews, newInterview] });
      setShowInterviewDialog(false);
      setInterviewFormData({
        type: 'onsite',
        scheduledDate: '',
        interviewer: '',
        notes: '',
      });
      toast.success('面试安排成功');
    }
  };

  const formatMoney = (amount: number) => {
    return `¥${amount.toLocaleString('zh-CN')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <FileText className="h-7 w-7 text-white" />
              </div>
              简历管理
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              高效管理候选人简历，加速招聘流程
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出简历
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">简历总数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalResumes}</div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                <FileText className="h-3 w-3 mr-1" />
                份
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">新投递</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.newResumes}</div>
              <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mt-1">
                <Clock className="h-3 w-3 mr-1" />
                待处理
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">面试中</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.interviewing}</div>
              <div className="flex items-center text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                <MessageSquare className="h-3 w-3 mr-1" />
                人
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">已发offer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.offered}</div>
              <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                人
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">已拒绝</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</div>
              <div className="flex items-center text-xs text-red-600 dark:text-red-400 mt-1">
                <XCircle className="h-3 w-3 mr-1" />
                人
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">平均经验</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.avgExperience}</div>
              <div className="flex items-center text-xs text-purple-600 dark:text-purple-400 mt-1">
                <Briefcase className="h-3 w-3 mr-1" />
                年
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 功能Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              全部简历
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              新投递
            </TabsTrigger>
            <TabsTrigger value="interviewing" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              面试中
            </TabsTrigger>
            <TabsTrigger value="offered" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              已发offer
            </TabsTrigger>
          </TabsList>

          {/* 简历列表 */}
          <TabsContent value={activeTab} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>简历列表</CardTitle>
                    <CardDescription>查看和管理所有候选人简历</CardDescription>
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
                        <SelectItem value="new">新投递</SelectItem>
                        <SelectItem value="interviewing">面试中</SelectItem>
                        <SelectItem value="offered">已发offer</SelectItem>
                        <SelectItem value="rejected">已拒绝</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border dark:border-gray-700">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>候选人</TableHead>
                        <TableHead>应聘职位</TableHead>
                        <TableHead>经验</TableHead>
                        <TableHead>期望薪资</TableHead>
                        <TableHead>投递来源</TableHead>
                        <TableHead>投递日期</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResumes
                        .filter(r => activeTab === 'all' || r.status === activeTab)
                        .map((resume) => (
                        <TableRow key={resume.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                                  {resume.candidateName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{resume.candidateName}</div>
                                <div className="text-xs text-gray-500">{resume.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{resume.appliedPosition}</div>
                              <div className="text-xs text-gray-500">{resume.appliedDepartment}</div>
                            </div>
                          </TableCell>
                          <TableCell>{resume.experience}年</TableCell>
                          <TableCell>{formatMoney(resume.expectedSalary)}/{resume.expectedSalaryType === 'month' ? '月' : '年'}</TableCell>
                          <TableCell>{resume.source}</TableCell>
                          <TableCell>{resume.applicationDate}</TableCell>
                          <TableCell>{getStatusBadge(resume.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewResume(resume)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {resume.status === 'new' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <Send className="h-4 w-4" />
                                </Button>
                              )}
                              {resume.status === 'interviewing' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 简历详情对话框 */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">候选人详情</DialogTitle>
              <DialogDescription>
                {selectedResume?.candidateName} - {selectedResume?.appliedPosition}
              </DialogDescription>
            </DialogHeader>
            {selectedResume && (
              <div className="space-y-6">
                {/* 基本信息 */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xl">
                      {selectedResume.candidateName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedResume.candidateName}
                      </h3>
                      {getStatusBadge(selectedResume.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>{selectedResume.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{selectedResume.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedResume.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{selectedResume.age}岁</span>
                      </div>
                    </div>
                    {selectedResume.currentCompany && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        当前: {selectedResume.currentCompany} · {selectedResume.currentPosition}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">期望薪资</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatMoney(selectedResume.expectedSalary)}/{selectedResume.expectedSalaryType === 'month' ? '月' : '年'}
                    </div>
                  </div>
                </div>

                {/* 关键信息 */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-2">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">学历</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedResume.education}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Briefcase className="h-5 w-5 text-green-600" />
                        <span className="font-medium">工作经验</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedResume.experience}年
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-2">
                        <CalendarIcon className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">投递时间</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedResume.applicationDate}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 技能标签 */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">技能</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedResume.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 工作经历 */}
                {selectedResume.workExperience.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">工作经历</h3>
                    <div className="space-y-3">
                      {selectedResume.workExperience.map((work, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{work.position}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{work.company}</div>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {work.startDate} - {work.endDate || '至今'}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{work.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 教育经历 */}
                {selectedResume.educationDetails.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">教育经历</h3>
                    <div className="space-y-3">
                      {selectedResume.educationDetails.map((edu, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{edu.school}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{edu.degree} · {edu.major}</div>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {edu.startDate} - {edu.endDate}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 面试记录 */}
                {selectedResume.interviews.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">面试记录</h3>
                    <div className="space-y-3">
                      {selectedResume.interviews.map((interview, idx) => (
                        <div key={interview.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              {getInterviewTypeBadge(interview.type)}
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {interview.scheduledDate}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  面试官: {interview.interviewer}
                                </div>
                              </div>
                            </div>
                            <Badge
                              className={
                                interview.status === 'completed'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }
                            >
                              {interview.status === 'completed' ? '已完成' : '已安排'}
                            </Badge>
                          </div>
                          {interview.feedback && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{interview.feedback}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 附件 */}
                {selectedResume.attachments.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">附件</h3>
                    <div className="space-y-2">
                      {selectedResume.attachments.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <div className="font-medium text-sm">{file.name}</div>
                              <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 评分 */}
                {selectedResume.evaluation && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">综合评分</h3>
                    <div className="grid grid-cols-5 gap-3">
                      {Object.entries(selectedResume.evaluation.dimensions).map(([key, value]) => (
                        <Card key={key}>
                          <CardContent className="pt-4 text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">{key}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    {selectedResume.evaluation.comment && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {selectedResume.evaluation.comment}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Button variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      发送邮件
                    </Button>
                    <Button variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      留言
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog open={showInterviewDialog} onOpenChange={setShowInterviewDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          安排面试
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>安排面试</DialogTitle>
                          <DialogDescription>
                            为 {selectedResume.candidateName} 安排面试
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>面试类型</Label>
                            <Select
                              value={interviewFormData.type}
                              onValueChange={(v) => setInterviewFormData({ ...interviewFormData, type: v })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="phone">电话面试</SelectItem>
                                <SelectItem value="video">视频面试</SelectItem>
                                <SelectItem value="onsite">现场面试</SelectItem>
                                <SelectItem value="technical">技术面试</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>面试日期</Label>
                            <Input
                              type="date"
                              value={interviewFormData.scheduledDate}
                              onChange={(e) => setInterviewFormData({ ...interviewFormData, scheduledDate: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>面试官</Label>
                            <Input
                              value={interviewFormData.interviewer}
                              onChange={(e) => setInterviewFormData({ ...interviewFormData, interviewer: e.target.value })}
                              placeholder="选择面试官"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>备注</Label>
                            <Textarea
                              value={interviewFormData.notes}
                              onChange={(e) => setInterviewFormData({ ...interviewFormData, notes: e.target.value })}
                              placeholder="面试备注信息..."
                              rows={3}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowInterviewDialog(false)}>取消</Button>
                          <Button onClick={handleScheduleInterview}>确认安排</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" className="text-green-600 hover:text-green-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      通过
                    </Button>
                    <Button variant="outline" className="text-red-600 hover:text-red-700">
                      <XCircle className="h-4 w-4 mr-2" />
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
