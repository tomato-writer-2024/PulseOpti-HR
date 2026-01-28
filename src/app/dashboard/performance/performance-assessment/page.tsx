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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Edit,
  Eye,
  Calendar,
  User,
  Star,
  MessageSquare,
  Send,
  Download,
  Filter,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';

interface PerformanceAssessment {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  department: string;
  position: string;
  assessorId: string;
  assessorName: string;
  period: string;
  type: 'self' | 'manager' | 'peer' | '360';
  status: 'pending' | 'in-progress' | 'submitted' | 'reviewing' | 'completed';
  submissionDate?: string;
  score?: number;
  rating?: 'S' | 'A' | 'B' | 'C' | 'D';
  categories: AssessmentCategory[];
  feedback: string;
  goals: AssessmentGoal[];
}

interface AssessmentCategory {
  id: string;
  name: string;
  weight: number;
  score: number;
  maxScore: number;
  items: AssessmentItem[];
}

interface AssessmentItem {
  id: string;
  title: string;
  description: string;
  score: number;
  maxScore: number;
  comment?: string;
}

interface AssessmentGoal {
  id: string;
  title: string;
  targetScore: number;
  actualScore: number;
  completionRate: number;
  weight: number;
}

export default function PerformanceAssessmentPage() {
  const [activeTab, setActiveTab] = useState('assessments');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [assessments, setAssessments] = useState<PerformanceAssessment[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: '张三',
      department: '产品部',
      position: '产品经理',
      assessorId: 'M001',
      assessorName: '李总',
      period: '2024-Q4',
      type: 'manager',
      status: 'in-progress',
      score: 85,
      rating: 'A',
      categories: [
        {
          id: 'c1',
          name: '工作业绩',
          weight: 40,
          score: 90,
          maxScore: 100,
          items: [
            { id: 'i1', title: '目标达成', description: '季度目标的完成情况', score: 95, maxScore: 100 },
            { id: 'i2', title: '工作质量', description: '工作成果的质量和准确性', score: 88, maxScore: 100 },
            { id: 'i3', title: '工作效率', description: '工作效率和资源利用', score: 87, maxScore: 100 },
          ],
        },
        {
          id: 'c2',
          name: '能力素质',
          weight: 30,
          score: 82,
          maxScore: 100,
          items: [
            { id: 'i4', title: '专业能力', description: '专业知识和技能水平', score: 85, maxScore: 100 },
            { id: 'i5', title: '学习能力', description: '学习新知识的能力', score: 80, maxScore: 100 },
            { id: 'i6', title: '创新能力', description: '创新思维和解决问题能力', score: 81, maxScore: 100 },
          ],
        },
        {
          id: 'c3',
          name: '工作态度',
          weight: 20,
          score: 88,
          maxScore: 100,
          items: [
            { id: 'i7', title: '责任心', description: '对工作的责任心', score: 90, maxScore: 100 },
            { id: 'i8', title: '主动性', description: '工作的主动性和积极性', score: 86, maxScore: 100 },
          ],
        },
        {
          id: 'c4',
          name: '团队协作',
          weight: 10,
          score: 85,
          maxScore: 100,
          items: [
            { id: 'i9', title: '沟通协作', description: '团队沟通和协作能力', score: 85, maxScore: 100 },
          ],
        },
      ],
      feedback: '本季度工作表现优秀，特别是在产品创新方面有突出表现。建议进一步提升项目管理能力。',
      goals: [
        {
          id: 'g1',
          title: '完成新功能开发',
          targetScore: 100,
          actualScore: 95,
          completionRate: 95,
          weight: 50,
        },
        {
          id: 'g2',
          title: '提升用户满意度',
          targetScore: 90,
          actualScore: 88,
          completionRate: 98,
          weight: 30,
        },
        {
          id: 'g3',
          title: '完成团队培训',
          targetScore: 80,
          actualScore: 85,
          completionRate: 106,
          weight: 20,
        },
      ],
    },
    {
      id: '2',
      employeeId: 'EMP002',
      employeeName: '李四',
      department: '销售部',
      position: '销售经理',
      assessorId: 'M002',
      assessorName: '王总',
      period: '2024-Q4',
      type: 'manager',
      status: 'completed',
      submissionDate: '2024-12-15',
      score: 92,
      rating: 'S',
      categories: [
        {
          id: 'c5',
          name: '工作业绩',
          weight: 40,
          score: 95,
          maxScore: 100,
          items: [
            { id: 'i10', title: '销售业绩', description: '销售目标和业绩完成', score: 98, maxScore: 100 },
            { id: 'i11', title: '客户开发', description: '新客户开发数量', score: 92, maxScore: 100 },
          ],
        },
        {
          id: 'c6',
          name: '能力素质',
          weight: 30,
          score: 90,
          maxScore: 100,
          items: [
            { id: 'i12', title: '销售技巧', description: '销售技巧和谈判能力', score: 92, maxScore: 100 },
            { id: 'i13', title: '客户关系', description: '客户关系维护能力', score: 88, maxScore: 100 },
          ],
        },
        {
          id: 'c7',
          name: '工作态度',
          weight: 20,
          score: 88,
          maxScore: 100,
          items: [
            { id: 'i14', title: '积极性', description: '工作积极性和主动性', score: 90, maxScore: 100 },
            { id: 'i15', title: '抗压能力', description: '应对压力的能力', score: 86, maxScore: 100 },
          ],
        },
        {
          id: 'c8',
          name: '团队协作',
          weight: 10,
          score: 90,
          maxScore: 100,
          items: [
            { id: 'i16', title: '团队协作', description: '团队合作精神', score: 90, maxScore: 100 },
          ],
        },
      ],
      feedback: '业绩突出，超额完成销售目标。建议在战略思维方面进一步锻炼。',
      goals: [
        {
          id: 'g4',
          title: '完成销售目标',
          targetScore: 100,
          actualScore: 110,
          completionRate: 110,
          weight: 60,
        },
        {
          id: 'g5',
          title: '拓展客户数量',
          targetScore: 80,
          actualScore: 85,
          completionRate: 106,
          weight: 40,
        },
      ],
    },
    {
      id: '3',
      employeeId: 'EMP003',
      employeeName: '王五',
      department: '技术部',
      position: '高级工程师',
      assessorId: 'M003',
      assessorName: '张总',
      period: '2024-Q4',
      type: 'self',
      status: 'pending',
      score: undefined,
      categories: [],
      feedback: '',
      goals: [],
    },
  ]);

  const stats = {
    totalAssessments: assessments.length,
    pending: assessments.filter(a => a.status === 'pending').length,
    inProgress: assessments.filter(a => a.status === 'in-progress').length,
    completed: assessments.filter(a => a.status === 'completed').length,
    avgScore: (() => {
      const scoredAssessments = assessments.filter(a => a.score !== undefined);
      return scoredAssessments.length > 0
        ? scoredAssessments.reduce((sum, a) => sum + (a.score || 0), 0) / scoredAssessments.length
        : 0;
    })(),
    highPerformers: assessments.filter(a => a.rating === 'S' || a.rating === 'A').length,
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { label: '待开始', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
      'in-progress': { label: '进行中', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      submitted: { label: '已提交', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      reviewing: { label: '审核中', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
      completed: { label: '已完成', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    };
    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getRatingBadge = (rating?: string) => {
    if (!rating) return <span className="text-gray-400">-</span>;
    const variants: Record<string, any> = {
      S: { label: 'S', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
      A: { label: 'A', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      B: { label: 'B', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      C: { label: 'C', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      D: { label: 'D', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
    };
    const variant = variants[rating];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-green-600 dark:text-green-400';
    if (percentage >= 80) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesDepartment = selectedDepartment === 'all' || assessment.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || assessment.status === selectedStatus;
    return matchesDepartment && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <Target className="h-7 w-7 text-white" />
              </div>
              绩效评估
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              360度绩效评估，全面客观评价员工表现
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出报告
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              创建评估
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">评估总数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalAssessments}</div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                <Target className="h-3 w-3 mr-1" />
                份
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">待开始</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.pending}</div>
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                <Clock className="h-3 w-3 mr-1" />
                份
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">进行中</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgress}</div>
              <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                份
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">已完成</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
              <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                份
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">平均分</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.avgScore.toFixed(1)}
              </div>
              <div className="flex items-center text-xs text-purple-600 dark:text-purple-400 mt-1">
                <Star className="h-3 w-3 mr-1" />
                分
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">优秀</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.highPerformers}</div>
              <div className="flex items-center text-xs text-orange-600 dark:text-orange-400 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                人
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 功能Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="assessments" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              评估列表
            </TabsTrigger>
            <TabsTrigger value="my-assessments" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              我的评估
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              分析报告
            </TabsTrigger>
          </TabsList>

          {/* 评估列表 */}
          <TabsContent value="assessments" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>绩效评估列表</CardTitle>
                    <CardDescription>查看和管理所有员工绩效评估</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部部门</SelectItem>
                        <SelectItem value="产品部">产品部</SelectItem>
                        <SelectItem value="销售部">销售部</SelectItem>
                        <SelectItem value="技术部">技术部</SelectItem>
                        <SelectItem value="市场部">市场部</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="pending">待开始</SelectItem>
                        <SelectItem value="in-progress">进行中</SelectItem>
                        <SelectItem value="completed">已完成</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAssessments.map((assessment) => (
                    <Card key={assessment.id} className="hover:shadow-md transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                                {assessment.employeeName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {assessment.employeeName}
                                </h3>
                                {getStatusBadge(assessment.status)}
                                {getRatingBadge(assessment.rating)}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span>{assessment.department}</span>
                                <span>·</span>
                                <span>{assessment.position}</span>
                                <span>·</span>
                                <span>{assessment.period}</span>
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                评估人: {assessment.assessorName}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              查看
                            </Button>
                            {assessment.status === 'pending' || assessment.status === 'in-progress' ? (
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Edit className="h-4 w-4 mr-1" />
                                开始评估
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                反馈
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      {assessment.categories.length > 0 && (
                        <CardContent>
                          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            {assessment.categories.map((category) => (
                              <div key={category.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                  {category.name} ({category.weight}%)
                                </div>
                                <div className={`text-lg font-bold ${getScoreColor(category.score, category.maxScore)}`}>
                                  {category.score} / {category.maxScore}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            {assessment.score !== undefined && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">综合评分:</span>
                                <span className={`text-2xl font-bold ${getScoreColor(assessment.score, 100)}`}>
                                  {assessment.score}
                                </span>
                              </div>
                            )}
                            {assessment.submissionDate && (
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                提交日期: {assessment.submissionDate}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 我的评估 */}
          <TabsContent value="my-assessments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>我的评估</CardTitle>
                <CardDescription>查看我的绩效评估情况</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Target className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    当前没有待处理的评估
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    当有新的绩效评估时，会在这里显示
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 分析报告 */}
          <TabsContent value="analysis" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>部门绩效对比</CardTitle>
                  <CardDescription>各部门平均绩效评分对比</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['产品部', '销售部', '技术部', '市场部'].map((dept, idx) => {
                      const deptAssessments = assessments.filter(a => a.department === dept && a.score !== undefined);
                      const avgScore = deptAssessments.length > 0
                        ? deptAssessments.reduce((sum, a) => sum + (a.score || 0), 0) / deptAssessments.length
                        : 0;
                      return (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{dept}</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {avgScore.toFixed(1)}分
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                avgScore >= 90 ? 'bg-green-500' :
                                avgScore >= 80 ? 'bg-blue-500' :
                                avgScore >= 70 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${avgScore}%` }}
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
                  <CardTitle>等级分布</CardTitle>
                  <CardDescription>绩效评估等级统计</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['S', 'A', 'B', 'C', 'D'].map((rating) => {
                      const count = assessments.filter(a => a.rating === rating).length;
                      const percentage = assessments.length > 0 ? (count / assessments.length) * 100 : 0;
                      return (
                        <div key={rating} className="flex items-center gap-3">
                          <Badge className="w-8 flex justify-center bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {rating}
                          </Badge>
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-blue-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                            {count}人
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
