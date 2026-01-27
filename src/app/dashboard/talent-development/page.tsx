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
  TrendingUp,
  Plus,
  Edit,
  Play,
  CheckCircle,
  Clock,
  Users,
  Target,
  Award,
  BookOpen,
  Search,
  Download,
  Save,
  Eye,
  Trash2,
  Calendar,
  Filter,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';

// 类型定义
type DevelopmentStatus = 'planning' | 'in_progress' | 'completed' | 'paused';
type DevelopmentType = 'training' | 'mentoring' | 'rotation' | 'promotion' | 'special_project';

interface TalentPlan {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  currentPosition: string;
  targetPosition: string;
  type: DevelopmentType;
  status: DevelopmentStatus;
  priority: 'high' | 'medium' | 'low';
  startDate: string;
  endDate: string;
  progress: number;
  mentor?: string;
  description: string;
  currentSkills: string[];
  requiredSkills: string[];
}

interface TalentReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewerId: string;
  reviewerName: string;
  period: string;
  performanceScore: number;
  potentialScore: number;
  readiness: 'ready' | 'need_development' | 'not_ready';
  strengths: string[];
  improvements: string[];
  nextSteps: string;
  reviewDate: string;
}

export default function TalentDevelopmentPage() {
  const [activeTab, setActiveTab] = useState('plans');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planDialogOpen, setPlanDialogOpen] = useState(false);

  // 人才发展计划
  const [talentPlans] = useState<TalentPlan[]>([
    {
      id: '1',
      employeeId: '1',
      employeeName: '张三',
      department: '技术部',
      currentPosition: '高级工程师',
      targetPosition: '技术主管',
      type: 'mentoring',
      status: 'in_progress',
      priority: 'high',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      progress: 45,
      mentor: '李四',
      description: '通过导师辅导和项目实践，培养团队管理能力',
      currentSkills: ['JavaScript', 'React', 'Node.js', 'Python'],
      requiredSkills: ['团队管理', '项目规划', '技术架构', '人员培养'],
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: '李四',
      department: '技术部',
      currentPosition: '技术主管',
      targetPosition: '技术总监',
      type: 'special_project',
      status: 'planning',
      priority: 'high',
      startDate: '2025-04-01',
      endDate: '2026-03-31',
      progress: 0,
      description: '负责核心技术架构重构项目',
      currentSkills: ['架构设计', '团队管理', '技术选型'],
      requiredSkills: ['战略规划', '预算管理', '跨部门协作', '技术前瞻'],
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: '王五',
      department: '销售部',
      currentPosition: '销售代表',
      targetPosition: '销售经理',
      type: 'training',
      status: 'in_progress',
      priority: 'medium',
      startDate: '2025-02-01',
      endDate: '2025-08-31',
      progress: 70,
      mentor: '赵六',
      description: '参加管理培训课程，学习团队管理技巧',
      currentSkills: ['客户开发', '谈判技巧', '产品知识'],
      requiredSkills: ['团队管理', '销售策略', '数据分析', '客户关系维护'],
    },
    {
      id: '4',
      employeeId: '4',
      employeeName: '赵六',
      department: '销售部',
      currentPosition: '销售经理',
      targetPosition: '销售总监',
      type: 'rotation',
      status: 'completed',
      priority: 'medium',
      startDate: '2024-06-01',
      endDate: '2024-12-31',
      progress: 100,
      description: '跨部门轮岗，了解市场营销策略',
      currentSkills: ['团队管理', '销售策略', '客户关系维护'],
      requiredSkills: ['战略规划', '市场分析', '资源协调', '预算管理'],
    },
  ]);

  // 人才评估记录
  const [talentReviews] = useState<TalentReview[]>([
    {
      id: '1',
      employeeId: '1',
      employeeName: '张三',
      reviewerId: '2',
      reviewerName: '李四',
      period: '2025-Q1',
      performanceScore: 4.5,
      potentialScore: 4.2,
      readiness: 'ready',
      strengths: ['技术能力强', '学习能力强', '责任心强'],
      improvements: ['团队管理经验不足', '沟通技巧需要提升'],
      nextSteps: '继续加强团队管理能力的培养',
      reviewDate: '2025-03-31',
    },
    {
      id: '2',
      employeeId: '3',
      employeeName: '王五',
      reviewerId: '4',
      reviewerName: '赵六',
      period: '2025-Q1',
      performanceScore: 4.0,
      potentialScore: 3.8,
      readiness: 'need_development',
      strengths: ['销售能力强', '客户关系好', '执行力强'],
      improvements: ['数据分析能力需要提升', '战略思维需要培养'],
      nextSteps: '参加数据分析培训，加强战略规划学习',
      reviewDate: '2025-03-31',
    },
  ]);

  // 统计数据
  const [stats] = useState({
    totalPlans: 4,
    inProgress: 2,
    completed: 1,
    highPotential: 2,
    avgProgress: 54,
  });

  const typeMap: Record<DevelopmentType, { label: string; icon: React.ReactNode; color: string }> = {
    training: { label: '培训', icon: <BookOpen className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800' },
    mentoring: { label: '导师制', icon: <Users className="h-4 w-4" />, color: 'bg-green-100 text-green-800' },
    rotation: { label: '轮岗', icon: <ArrowUpRight className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800' },
    promotion: { label: '晋升', icon: <TrendingUp className="h-4 w-4" />, color: 'bg-orange-100 text-orange-800' },
    special_project: { label: '专项项目', icon: <Target className="h-4 w-4" />, color: 'bg-pink-100 text-pink-800' },
  };

  const statusMap: Record<DevelopmentStatus, { label: string; color: string }> = {
    planning: { label: '计划中', color: 'bg-gray-100 text-gray-800' },
    in_progress: { label: '进行中', color: 'bg-blue-100 text-blue-800' },
    completed: { label: '已完成', color: 'bg-green-100 text-green-800' },
    paused: { label: '已暂停', color: 'bg-yellow-100 text-yellow-800' },
  };

  const readinessMap: Record<string, { label: string; color: string }> = {
    ready: { label: '就绪', color: 'bg-green-100 text-green-800' },
    need_development: { label: '需发展', color: 'bg-yellow-100 text-yellow-800' },
    not_ready: { label: '未就绪', color: 'bg-red-100 text-red-800' },
  };

  const filteredPlans = talentPlans.filter(plan => {
    const matchSearch = plan.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       plan.currentPosition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || plan.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">人才发展</h1>
          <p className="text-gray-600 mt-2">
            人才梯队建设、发展计划、人才评估
            <Badge variant="secondary" className="ml-2">HRBP</Badge>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出报告
          </Button>
          <Button onClick={() => setPlanDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            创建计划
          </Button>
        </div>
      </div>

      {/* 功能介绍 */}
      <Alert>
        <TrendingUp className="h-4 w-4" />
        <AlertDescription>
          支持人才梯队建设、发展路径规划、导师制培养、轮岗历练等
        </AlertDescription>
      </Alert>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">发展计划</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPlans}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.inProgress} 个进行中
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">高潜人才</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highPotential}</div>
            <p className="text-xs text-gray-500 mt-1">重点培养</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">平均进度</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgProgress}%</div>
            <p className="text-xs text-gray-500 mt-1">整体进度</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">完成计划</CardTitle>
            <CheckCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-gray-500 mt-1">已达标</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="plans">发展计划</TabsTrigger>
          <TabsTrigger value="reviews">人才评估</TabsTrigger>
          <TabsTrigger value="analytics">人才分析</TabsTrigger>
        </TabsList>

        {/* 发展计划 */}
        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>人才发展计划</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="搜索员工或职位"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="planning">计划中</SelectItem>
                      <SelectItem value="in_progress">进行中</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                      <SelectItem value="paused">已暂停</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>员工</TableHead>
                    <TableHead>当前职位</TableHead>
                    <TableHead>目标职位</TableHead>
                    <TableHead>发展方式</TableHead>
                    <TableHead>导师</TableHead>
                    <TableHead>周期</TableHead>
                    <TableHead>进度</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.employeeName}</TableCell>
                      <TableCell>{plan.currentPosition}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                        {plan.targetPosition}
                      </TableCell>
                      <TableCell>
                        <Badge className={typeMap[plan.type].color}>
                          {typeMap[plan.type].icon}
                          {typeMap[plan.type].label}
                        </Badge>
                      </TableCell>
                      <TableCell>{plan.mentor || '-'}</TableCell>
                      <TableCell className="text-sm">
                        {plan.startDate} ~ {plan.endDate}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={plan.progress} className="w-20 h-2" />
                          <span className="text-sm">{plan.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusMap[plan.status].color}>
                          {statusMap[plan.status].label}
                        </Badge>
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

        {/* 人才评估 */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>人才评估</CardTitle>
              <CardDescription>季度人才评估记录</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>员工</TableHead>
                    <TableHead>评估人</TableHead>
                    <TableHead>周期</TableHead>
                    <TableHead>绩效</TableHead>
                    <TableHead>潜力</TableHead>
                    <TableHead>就绪度</TableHead>
                    <TableHead>评估日期</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {talentReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">{review.employeeName}</TableCell>
                      <TableCell>{review.reviewerName}</TableCell>
                      <TableCell>{review.period}</TableCell>
                      <TableCell className="font-bold text-blue-600">
                        {review.performanceScore.toFixed(1)}
                      </TableCell>
                      <TableCell className="font-bold text-purple-600">
                        {review.potentialScore.toFixed(1)}
                      </TableCell>
                      <TableCell>
                        <Badge className={readinessMap[review.readiness].color}>
                          {readinessMap[review.readiness].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{review.reviewDate}</TableCell>
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

        {/* 人才分析 */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>九宫格分析</CardTitle>
                <CardDescription>人才分布矩阵</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>绩效-潜力九宫格分析</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>流失风险分析</CardTitle>
                <CardDescription>关键人才流失风险预测</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>流失风险模型分析</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* 创建发展计划弹窗 */}
      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>创建人才发展计划</DialogTitle>
            <DialogDescription>
              为员工制定个人发展路径
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="employee">选择员工 *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择员工" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">张三 - 高级工程师</SelectItem>
                  <SelectItem value="2">李四 - 技术主管</SelectItem>
                  <SelectItem value="3">王五 - 销售代表</SelectItem>
                  <SelectItem value="4">赵六 - 销售经理</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="targetPosition">目标职位 *</Label>
              <Input id="targetPosition" placeholder="输入目标职位" />
            </div>
            <div>
              <Label htmlFor="type">发展方式 *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="training">培训</SelectItem>
                  <SelectItem value="mentoring">导师制</SelectItem>
                  <SelectItem value="rotation">轮岗</SelectItem>
                  <SelectItem value="promotion">晋升</SelectItem>
                  <SelectItem value="special_project">专项项目</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">开始日期 *</Label>
                <Input id="startDate" type="date" />
              </div>
              <div>
                <Label htmlFor="endDate">结束日期 *</Label>
                <Input id="endDate" type="date" />
              </div>
            </div>
            <div>
              <Label htmlFor="description">发展目标 *</Label>
              <Textarea
                id="description"
                placeholder="描述发展目标和期望"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlanDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={() => {
              toast.success('发展计划创建成功！');
              setPlanDialogOpen(false);
            }}>
              <Save className="mr-2 h-4 w-4" />
              创建计划
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
