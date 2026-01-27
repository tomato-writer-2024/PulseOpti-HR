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
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  GraduationCap,
  Plus,
  Edit,
  Play,
  Pause,
  CheckCircle,
  Clock,
  Users,
  BookOpen,
  Video,
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Calendar,
  Award,
  TrendingUp,
  MoreVertical,
  Save,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';

// 类型定义
type CourseType = 'online' | 'offline' | 'hybrid';
type CourseStatus = 'draft' | 'published' | 'in_progress' | 'completed';
type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';

interface Course {
  id: string;
  title: string;
  description: string;
  type: CourseType;
  status: CourseStatus;
  difficulty: CourseDifficulty;
  duration: number; // 小时
  instructor: string;
  category: string;
  enrolledCount: number;
  maxParticipants: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  startDate?: string;
  endDate?: string;
}

interface LearningRecord {
  id: string;
  courseId: string;
  courseTitle: string;
  employeeId: string;
  employeeName: string;
  progress: number;
  status: 'in_progress' | 'completed' | 'dropped';
  score?: number;
  completedAt?: string;
}

export default function CourseManagementPage() {
  const [activeTab, setActiveTab] = useState('courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);

  // 课程数据
  const [courses] = useState<Course[]>([
    {
      id: '1',
      title: '新员工入职培训',
      description: '帮助新员工快速了解公司文化、规章制度和业务流程',
      type: 'hybrid',
      status: 'published',
      difficulty: 'beginner',
      duration: 8,
      instructor: '张三',
      category: '入职培训',
      enrolledCount: 45,
      maxParticipants: 50,
      rating: 4.8,
      reviewCount: 32,
      createdAt: '2025-04-01',
      startDate: '2025-04-15',
      endDate: '2025-04-30',
    },
    {
      id: '2',
      title: '领导力提升课程',
      description: '提升管理者的领导能力和团队管理技巧',
      type: 'offline',
      status: 'in_progress',
      difficulty: 'advanced',
      duration: 16,
      instructor: '李四',
      category: '管理培训',
      enrolledCount: 15,
      maxParticipants: 20,
      rating: 4.9,
      reviewCount: 18,
      createdAt: '2025-03-15',
      startDate: '2025-04-10',
      endDate: '2025-05-10',
    },
    {
      id: '3',
      title: 'Excel高级应用',
      description: '掌握Excel高级函数和数据分析技巧',
      type: 'online',
      status: 'published',
      difficulty: 'intermediate',
      duration: 12,
      instructor: '王五',
      category: '技能培训',
      enrolledCount: 28,
      maxParticipants: 100,
      rating: 4.7,
      reviewCount: 45,
      createdAt: '2025-04-05',
    },
    {
      id: '4',
      title: '项目管理实战',
      description: '学习项目管理理论并在实践中应用',
      type: 'hybrid',
      status: 'draft',
      difficulty: 'intermediate',
      duration: 20,
      instructor: '赵六',
      category: '技能培训',
      enrolledCount: 0,
      maxParticipants: 30,
      rating: 0,
      reviewCount: 0,
      createdAt: '2025-04-18',
    },
  ]);

  // 学习记录数据
  const [learningRecords] = useState<LearningRecord[]>([
    { id: '1', courseId: '1', courseTitle: '新员工入职培训', employeeId: '1', employeeName: '张三', progress: 100, status: 'completed', score: 95, completedAt: '2025-04-20' },
    { id: '2', courseId: '1', courseTitle: '新员工入职培训', employeeId: '2', employeeName: '李四', progress: 75, status: 'in_progress' },
    { id: '3', courseId: '2', courseTitle: '领导力提升课程', employeeId: '3', employeeName: '王五', progress: 60, status: 'in_progress' },
    { id: '4', courseId: '3', courseTitle: 'Excel高级应用', employeeId: '4', employeeName: '赵六', progress: 100, status: 'completed', score: 88, completedAt: '2025-04-25' },
  ]);

  // 映射
  const typeMap: Record<CourseType, { label: string; icon: React.ReactNode; color: string }> = {
    online: { label: '在线', icon: <Video className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800' },
    offline: { label: '线下', icon: <BookOpen className="h-4 w-4" />, color: 'bg-green-100 text-green-800' },
    hybrid: { label: '混合', icon: <Users className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800' },
  };

  const statusMap: Record<CourseStatus, { label: string; icon: React.ReactNode; color: string }> = {
    draft: { label: '草稿', icon: <FileText className="h-4 w-4" />, color: 'bg-gray-100 text-gray-800' },
    published: { label: '已发布', icon: <CheckCircle className="h-4 w-4" />, color: 'bg-green-100 text-green-800' },
    in_progress: { label: '进行中', icon: <Play className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800' },
    completed: { label: '已完成', icon: <Award className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800' },
  };

  const difficultyMap: Record<CourseDifficulty, { label: string; color: string }> = {
    beginner: { label: '初级', color: 'bg-green-100 text-green-800' },
    intermediate: { label: '中级', color: 'bg-yellow-100 text-yellow-800' },
    advanced: { label: '高级', color: 'bg-red-100 text-red-800' },
  };

  // 过滤课程
  const filteredCourses = courses.filter(course => {
    const matchSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // 统计
  const totalCourses = courses.length;
  const publishedCourses = courses.filter(c => c.status === 'published' || c.status === 'in_progress').length;
  const totalEnrolled = courses.reduce((sum, course) => sum + course.enrolledCount, 0);
  const avgRating = courses.filter(c => c.rating > 0).reduce((sum, course) => sum + course.rating, 0) / (courses.filter(c => c.rating > 0).length || 1);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">课程管理</h1>
          <p className="text-gray-600 mt-2">
            管理培训课程，跟踪学习进度
            <Badge variant="secondary" className="ml-2">COE</Badge>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出报告
          </Button>
          <Button onClick={() => setCourseDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            创建课程
          </Button>
        </div>
      </div>

      {/* 功能介绍 */}
      <Alert>
        <GraduationCap className="h-4 w-4" />
        <AlertDescription>
          支持在线、线下、混合等多种培训形式，可创建课程、管理学员、跟踪学习进度
        </AlertDescription>
      </Alert>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">总课程</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-gray-500 mt-1">全部课程</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">进行中</CardTitle>
            <Play className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedCourses}</div>
            <p className="text-xs text-gray-500 mt-1">已发布/进行中</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">总学员</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrolled}</div>
            <p className="text-xs text-gray-500 mt-1">累计报名</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">平均评分</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
            <p className="text-xs text-gray-500 mt-1">课程平均分</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">课程列表</TabsTrigger>
          <TabsTrigger value="learning">学习记录</TabsTrigger>
          <TabsTrigger value="analytics">数据分析</TabsTrigger>
        </TabsList>

        {/* 课程列表 */}
        <TabsContent value="courses" className="space-y-6">
          {/* 筛选栏 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>所有课程</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="搜索课程..."
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
                      <SelectItem value="draft">草稿</SelectItem>
                      <SelectItem value="published">已发布</SelectItem>
                      <SelectItem value="in_progress">进行中</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={typeMap[course.type].color}>
                          {typeMap[course.type].icon}
                          {typeMap[course.type].label}
                        </Badge>
                        <Badge className={statusMap[course.status].color}>
                          {statusMap[course.status].label}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">讲师</span>
                          <span className="font-medium">{course.instructor}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">难度</span>
                          <Badge className={difficultyMap[course.difficulty].color}>
                            {difficultyMap[course.difficulty].label}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">时长</span>
                          <span>{course.duration} 小时</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">报名</span>
                          <span>{course.enrolledCount}/{course.maxParticipants}</span>
                        </div>
                        {course.rating > 0 && (
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(course.rating)
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">
                              {course.rating} ({course.reviewCount})
                            </span>
                          </div>
                        )}
                        {course.startDate && course.endDate && (
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>{course.startDate} ~ {course.endDate}</span>
                          </div>
                        )}
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-1" />
                            编辑
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
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

        {/* 学习记录 */}
        <TabsContent value="learning">
          <Card>
            <CardHeader>
              <CardTitle>学习记录</CardTitle>
              <CardDescription>查看员工学习进度</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>员工</TableHead>
                    <TableHead>课程</TableHead>
                    <TableHead>进度</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>分数</TableHead>
                    <TableHead>完成时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {learningRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.employeeName}</TableCell>
                      <TableCell>{record.courseTitle}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={record.progress} className="w-24 h-2" />
                          <span className="text-sm">{record.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={record.status === 'completed' ? 'default' : 'secondary'}
                        >
                          {record.status === 'completed' && '已完成'}
                          {record.status === 'in_progress' && '进行中'}
                          {record.status === 'dropped' && '已放弃'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {record.score !== undefined ? (
                          <Badge className="bg-green-100 text-green-800">
                            {record.score}分
                          </Badge>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {record.completedAt || '-'}
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

        {/* 数据分析 */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>培训数据分析</CardTitle>
              <CardDescription>培训效果分析和统计</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>学习趋势分析</p>
                </div>
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>学员活跃度分析</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 创建课程弹窗 */}
      <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>创建新课程</DialogTitle>
            <DialogDescription>
              填写课程信息，创建新的培训课程
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">课程标题 *</Label>
              <Input id="title" placeholder="输入课程标题" />
            </div>
            <div>
              <Label htmlFor="description">课程描述 *</Label>
              <Textarea
                id="description"
                placeholder="详细描述课程内容"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">培训方式 *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">在线</SelectItem>
                    <SelectItem value="offline">线下</SelectItem>
                    <SelectItem value="hybrid">混合</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="difficulty">难度等级 *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择难度" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">初级</SelectItem>
                    <SelectItem value="intermediate">中级</SelectItem>
                    <SelectItem value="advanced">高级</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">课程时长 (小时) *</Label>
                <Input id="duration" type="number" placeholder="8" />
              </div>
              <div>
                <Label htmlFor="maxParticipants">最大人数 *</Label>
                <Input id="maxParticipants" type="number" placeholder="50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="instructor">讲师 *</Label>
                <Input id="instructor" placeholder="讲师姓名" />
              </div>
              <div>
                <Label htmlFor="category">课程分类 *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onboarding">入职培训</SelectItem>
                    <SelectItem value="management">管理培训</SelectItem>
                    <SelectItem value="skill">技能培训</SelectItem>
                    <SelectItem value="compliance">合规培训</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCourseDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={() => {
              toast.success('课程创建成功！');
              setCourseDialogOpen(false);
            }}>
              <Save className="mr-2 h-4 w-4" />
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
