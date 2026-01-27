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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Target,
  Plus,
  Edit,
  CheckCircle,
  Clock,
  TrendingUp,
  Star,
  Calendar,
  User,
  Building2,
  Filter,
  Search,
  Download,
  Trash2,
  Send,
  FileText,
  BarChart3,
  Award,
  MessageSquare,
  Save,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';

// 类型定义
type AssessmentStatus = 'pending' | 'self_review' | 'manager_review' | 'completed';
type Rating = 'excellent' | 'good' | 'satisfactory' | 'needs_improvement';

interface Assessment {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  department: string;
  position: string;
  period: string;
  status: AssessmentStatus;
  selfScore?: number;
  managerScore?: number;
  finalScore?: number;
  selfReview?: string;
  managerReview?: string;
  managerComment?: string;
  createdAt: string;
  completedAt?: string;
}

interface AssessmentCriteria {
  id: string;
  name: string;
  description: string;
  weight: number;
  score?: number;
}

export default function PerformanceAssessmentPage() {
  const [activeTab, setActiveTab] = useState('todo');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

  // 绩效评估数据
  const [assessments] = useState<Assessment[]>([
    {
      id: '1',
      employeeId: '1',
      employeeName: '张三',
      employeeAvatar: '',
      department: '技术部',
      position: '高级工程师',
      period: '2025 Q1',
      status: 'manager_review',
      selfScore: 85,
      managerScore: 90,
      createdAt: '2025-04-01',
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: '李四',
      employeeAvatar: '',
      department: '产品部',
      position: '产品经理',
      period: '2025 Q1',
      status: 'self_review',
      selfScore: 78,
      createdAt: '2025-04-01',
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: '王五',
      employeeAvatar: '',
      department: '销售部',
      position: '销售经理',
      period: '2025 Q1',
      status: 'completed',
      selfScore: 92,
      managerScore: 95,
      finalScore: 94,
      selfReview: '本季度完成了销售目标，团队业绩提升明显',
      managerReview: '业绩突出，团队管理能力强',
      managerComment: '继续保持，可考虑晋升',
      createdAt: '2025-04-01',
      completedAt: '2025-04-15',
    },
    {
      id: '4',
      employeeId: '4',
      employeeName: '赵六',
      employeeAvatar: '',
      department: '市场部',
      position: '市场专员',
      period: '2025 Q1',
      status: 'pending',
      createdAt: '2025-04-01',
    },
  ]);

  // 评估标准
  const [criteria] = useState<AssessmentCriteria[]>([
    { id: '1', name: '工作业绩', description: '完成工作任务的数量和质量', weight: 40 },
    { id: '2', name: '工作能力', description: '专业知识和技能水平', weight: 25 },
    { id: '3', name: '工作态度', description: '责任心、主动性、团队合作', weight: 20 },
    { id: '4', name: '发展潜力', description: '学习能力、创新精神', weight: 15 },
  ]);

  // 映射
  const statusMap: Record<AssessmentStatus, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: '待自评', color: 'bg-gray-100 text-gray-800', icon: <Clock className="h-4 w-4" /> },
    self_review: { label: '自评中', color: 'bg-blue-100 text-blue-800', icon: <Edit className="h-4 w-4" /> },
    manager_review: { label: '待评估', color: 'bg-yellow-100 text-yellow-800', icon: <Star className="h-4 w-4" /> },
    completed: { label: '已完成', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" /> },
  };

  const ratingMap: Record<Rating, { label: string; score: number; color: string }> = {
    excellent: { label: '优秀', score: 95, color: 'bg-green-500' },
    good: { label: '良好', score: 85, color: 'bg-blue-500' },
    satisfactory: { label: '合格', score: 70, color: 'bg-yellow-500' },
    needs_improvement: { label: '需改进', score: 55, color: 'bg-red-500' },
  };

  // 过滤评估
  const filteredAssessments = assessments.filter(assessment => {
    const matchSearch = assessment.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       assessment.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || assessment.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // 统计
  const todoCount = assessments.filter(a => a.status === 'pending' || a.status === 'self_review').length;
  const reviewCount = assessments.filter(a => a.status === 'manager_review').length;
  const completedCount = assessments.filter(a => a.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">绩效评估</h1>
          <p className="text-gray-600 mt-2">
            进行绩效评估，管理评估流程
            <Badge variant="secondary" className="ml-2">COE</Badge>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出报告
          </Button>
          <Button onClick={() => toast.info('评估周期已启动')}>
            <Plus className="mr-2 h-4 w-4" />
            启动评估周期
          </Button>
        </div>
      </div>

      {/* 功能介绍 */}
      <Alert>
        <Target className="h-4 w-4" />
        <AlertDescription>
          支持自评、经理评估、绩效面谈、最终评分等完整评估流程，可自定义评估标准和权重
        </AlertDescription>
      </Alert>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">待处理</CardTitle>
            <Clock className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todoCount}</div>
            <p className="text-xs text-gray-500 mt-1">等待自评</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">待评估</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewCount}</div>
            <p className="text-xs text-gray-500 mt-1">等待经理评估</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">已完成</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-gray-500 mt-1">评估完成</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">完成率</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assessments.length > 0 ? Math.round((completedCount / assessments.length) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-500 mt-1">总体完成率</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todo">待处理 ({todoCount})</TabsTrigger>
          <TabsTrigger value="review">待评估 ({reviewCount})</TabsTrigger>
          <TabsTrigger value="completed">已完成 ({completedCount})</TabsTrigger>
          <TabsTrigger value="criteria">评估标准</TabsTrigger>
        </TabsList>

        {/* 待处理 */}
        <TabsContent value="todo">
          <Card>
            <CardHeader>
              <CardTitle>待处理评估</CardTitle>
              <CardDescription>员工尚未开始自评的评估</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>员工</TableHead>
                    <TableHead>部门</TableHead>
                    <TableHead>职位</TableHead>
                    <TableHead>周期</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.filter(a => a.status === 'pending').map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{assessment.employeeName.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{assessment.employeeName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{assessment.department}</TableCell>
                      <TableCell>{assessment.position}</TableCell>
                      <TableCell>{assessment.period}</TableCell>
                      <TableCell>
                        <Badge className={statusMap[assessment.status].color}>
                          {statusMap[assessment.status].icon}
                          {statusMap[assessment.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{assessment.createdAt}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Send className="h-4 w-4 mr-1" />
                          提醒
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 待评估 */}
        <TabsContent value="review">
          <Card>
            <CardHeader>
              <CardTitle>待评估列表</CardTitle>
              <CardDescription>等待您进行经理评估的员工</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>员工</TableHead>
                    <TableHead>部门</TableHead>
                    <TableHead>职位</TableHead>
                    <TableHead>自评分数</TableHead>
                    <TableHead>周期</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.filter(a => a.status === 'manager_review').map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{assessment.employeeName.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{assessment.employeeName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{assessment.department}</TableCell>
                      <TableCell>{assessment.position}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{assessment.selfScore}</span>
                          <span className="text-sm text-gray-500">分</span>
                        </div>
                      </TableCell>
                      <TableCell>{assessment.period}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            setSelectedAssessment(assessment);
                            setReviewDialogOpen(true);
                          }}
                        >
                          <Star className="h-4 w-4 mr-1" />
                          开始评估
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 已完成 */}
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>已完成评估</CardTitle>
              <CardDescription>查看所有已完成绩效评估</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>员工</TableHead>
                    <TableHead>部门</TableHead>
                    <TableHead>自评</TableHead>
                    <TableHead>经理评</TableHead>
                    <TableHead>最终分</TableHead>
                    <TableHead>周期</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.filter(a => a.status === 'completed').map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{assessment.employeeName.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{assessment.employeeName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{assessment.department}</TableCell>
                      <TableCell>{assessment.selfScore}</TableCell>
                      <TableCell>{assessment.managerScore}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800">
                          <Award className="h-4 w-4 mr-1" />
                          {assessment.finalScore}
                        </Badge>
                      </TableCell>
                      <TableCell>{assessment.period}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          详情
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 评估标准 */}
        <TabsContent value="criteria">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>评估标准</CardTitle>
                  <CardDescription>自定义绩效评估标准和权重</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  添加标准
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criteria.map((criterion) => (
                  <Card key={criterion.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{criterion.name}</h3>
                            <Badge variant="outline">{criterion.weight}%</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{criterion.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
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
      </Tabs>

      {/* 评估弹窗 */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>绩效评估</DialogTitle>
            <DialogDescription>
              {selectedAssessment && `${selectedAssessment.employeeName} - ${selectedAssessment.period}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* 自评信息 */}
            {selectedAssessment?.selfReview && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">员工自评</span>
                </div>
                <p className="text-sm text-gray-700">{selectedAssessment.selfReview}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <span>自评分数:</span>
                  <Badge className="bg-blue-100 text-blue-800">{selectedAssessment.selfScore}分</Badge>
                </div>
              </div>
            )}

            {/* 评分 */}
            <div>
              <Label>经理评分 (0-100)</Label>
              <Input type="number" min="0" max="100" placeholder="输入评分" />
            </div>

            {/* 评价 */}
            <div>
              <Label>评价意见</Label>
              <Textarea
                placeholder="请输入评价意见..."
                rows={4}
              />
            </div>

            {/* 评语 */}
            <div>
              <Label>经理评语</Label>
              <Textarea
                placeholder="请输入对员工的评语和建议..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={() => {
              toast.success('评估已提交！');
              setReviewDialogOpen(false);
            }}>
              <Save className="mr-2 h-4 w-4" />
              提交评估
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
