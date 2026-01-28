'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Target,
  TrendingUp,
  Award,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Filter,
  Download,
  FileText,
  Calendar,
  BarChart3,
  User,
  MoreVertical,
  Edit,
  Eye,
  ChevronRight,
  Star,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

// 模拟数据
const performanceData = {
  // 关键指标
  metrics: {
    totalEmployees: 485,
    assessedCount: 420,
    completionRate: 86.6,
    avgScore: 82.5,
    aGradeRate: 35.2,
    pendingApproval: 15,
  },

  // 绩效周期
  cycles: [
    { id: '1', name: '2024 Q4', year: 2024, quarter: 4, status: 'completed' },
    { id: '2', name: '2025 Q1', year: 2025, quarter: 1, status: 'in_progress' },
    { id: '3', name: '2025 Q2', year: 2025, quarter: 2, status: 'pending' },
  ],

  // 绩效记录
  records: [
    {
      id: '1',
      employeeId: 'E001',
      employeeName: '张三',
      department: '技术部',
      position: '高级工程师',
      cycleId: '1',
      cycleName: '2024 Q4',
      kpiScore: 92,
      competenceScore: 88,
      attitudeScore: 90,
      totalScore: 90,
      grade: 'A',
      status: 'confirmed',
      goals: [
        { id: 'g1', name: '项目交付', target: 100, actual: 105, weight: 40 },
        { id: 'g2', name: '代码质量', target: 90, actual: 95, weight: 30 },
        { id: 'g3', name: '团队协作', target: 85, actual: 88, weight: 30 },
      ],
      reviewer: '李经理',
      reviewDate: '2024-12-20',
      comments: '表现优秀，超额完成目标，继续保持',
    },
    {
      id: '2',
      employeeId: 'E002',
      employeeName: '李四',
      department: '销售部',
      position: '销售经理',
      cycleId: '1',
      cycleName: '2024 Q4',
      kpiScore: 95,
      competenceScore: 85,
      attitudeScore: 92,
      totalScore: 91,
      grade: 'A',
      status: 'confirmed',
      goals: [
        { id: 'g1', name: '销售额', target: 1000000, actual: 1200000, weight: 50 },
        { id: 'g2', name: '客户满意度', target: 90, actual: 93, weight: 30 },
        { id: 'g3', name: '新客户开发', target: 20, actual: 25, weight: 20 },
      ],
      reviewer: '王总监',
      reviewDate: '2024-12-21',
      comments: '销售业绩突出，客户关系维护良好',
    },
    {
      id: '3',
      employeeId: 'E003',
      employeeName: '王五',
      department: '市场部',
      position: '市场专员',
      cycleId: '2',
      cycleName: '2025 Q1',
      kpiScore: 78,
      competenceScore: 82,
      attitudeScore: 85,
      totalScore: 81,
      grade: 'B',
      status: 'pending_review',
      goals: [
        { id: 'g1', name: '品牌曝光', target: 1000000, actual: 850000, weight: 40 },
        { id: 'g2', name: '活动策划', target: 10, actual: 8, weight: 30 },
        { id: 'g3', name: '内容创作', target: 50, actual: 45, weight: 30 },
      ],
      reviewer: '赵经理',
      reviewDate: null,
      comments: '',
    },
    {
      id: '4',
      employeeId: 'E004',
      employeeName: '赵六',
      department: '人力资源部',
      position: 'HR专员',
      cycleId: '2',
      cycleName: '2025 Q1',
      kpiScore: 85,
      competenceScore: 88,
      attitudeScore: 90,
      totalScore: 87,
      grade: 'B',
      status: 'draft',
      goals: [
        { id: 'g1', name: '招聘完成率', target: 95, actual: 90, weight: 40 },
        { id: 'g2', name: '培训组织', target: 10, actual: 8, weight: 30 },
        { id: 'g3', name: '员工满意度', target: 85, actual: 88, weight: 30 },
      ],
      reviewer: '孙经理',
      reviewDate: null,
      comments: '',
    },
  ],

  // 部门绩效对比
  departmentStats: [
    { name: '技术部', avgScore: 87.5, completionRate: 95.2, aGradeRate: 42.1 },
    { name: '销售部', avgScore: 89.3, completionRate: 92.8, aGradeRate: 45.5 },
    { name: '市场部', avgScore: 82.1, completionRate: 88.5, aGradeRate: 32.3 },
    { name: '产品部', avgScore: 85.6, completionRate: 90.1, aGradeRate: 38.7 },
    { name: '运营部', avgScore: 84.2, completionRate: 89.3, aGradeRate: 35.8 },
  ],
};

const GRADE_CONFIG = {
  A: { label: 'A - 优秀', color: 'bg-green-100 text-green-600 border-green-200', icon: Star },
  B: { label: 'B - 良好', color: 'bg-blue-100 text-blue-600 border-blue-200', icon: CheckCircle },
  C: { label: 'C - 合格', color: 'bg-yellow-100 text-yellow-600 border-yellow-200', icon: Clock },
  D: { label: 'D - 需改进', color: 'bg-red-100 text-red-600 border-red-200', icon: AlertCircle },
};

const STATUS_CONFIG = {
  draft: { label: '草稿', color: 'bg-gray-100 text-gray-600' },
  pending_review: { label: '待审核', color: 'bg-orange-100 text-orange-600' },
  reviewed: { label: '已审核', color: 'bg-blue-100 text-blue-600' },
  confirmed: { label: '已确认', color: 'bg-green-100 text-green-600' },
};

export default function PerformancePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCycle, setSelectedCycle] = useState('2');
  const [searchText, setSearchText] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<typeof performanceData.records[0] | null>(null);

  // 过滤绩效记录
  const filteredRecords = useMemo(() => {
    return performanceData.records.filter(record => {
      const matchCycle = selectedCycle ? record.cycleId === selectedCycle : true;
      const matchSearch = searchText ? record.employeeName.includes(searchText) : true;
      const matchDepartment = selectedDepartment ? record.department === selectedDepartment : true;
      const matchStatus = selectedStatus ? record.status === selectedStatus : true;
      return matchCycle && matchSearch && matchDepartment && matchStatus;
    });
  }, [performanceData.records, selectedCycle, searchText, selectedDepartment, selectedStatus]);

  const handleViewDetail = useCallback((record: typeof performanceData.records[0]) => {
    setSelectedRecord(record);
    setDetailDialogOpen(true);
  }, []);

  const avgScoreTrend = 5.2; // 较上月提升
  const completionTrend = 3.8; // 较上月提升

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            绩效管理
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            目标设定、绩效评估、结果分析
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出报表
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Plus className="h-4 w-4 mr-2" />
            创建评估
          </Button>
        </div>
      </div>

      {/* 关键指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>员工总数</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white">
                <User className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-3xl">{performanceData.metrics.totalEmployees}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>已评估</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-3xl">{performanceData.metrics.assessedCount}</CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <Badge className="bg-green-100 text-green-600">
                {performanceData.metrics.completionRate}%
              </Badge>
              <span className="text-gray-600 dark:text-gray-400">完成率</span>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>平均分数</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white">
                <Star className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-3xl">{performanceData.metrics.avgScore}</CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span className="text-green-600">+{avgScoreTrend}%</span>
              <span className="text-gray-600 dark:text-gray-400">较上周期</span>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>A级占比</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-white">
                <Award className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-3xl">{performanceData.metrics.aGradeRate}%</CardTitle>
            <Progress value={performanceData.metrics.aGradeRate} className="mt-2" />
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>待审核</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-3xl">{performanceData.metrics.pendingApproval}</CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <Badge className="bg-orange-100 text-orange-600">
                需要处理
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>完成率</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-3xl">{performanceData.metrics.completionRate}%</CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span className="text-green-600">+{completionTrend}%</span>
              <span className="text-gray-600 dark:text-gray-400">较上周期</span>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* 主要内容 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            总览
          </TabsTrigger>
          <TabsTrigger value="records">
            <FileText className="h-4 w-4 mr-2" />
            绩效记录
          </TabsTrigger>
          <TabsTrigger value="goals">
            <Target className="h-4 w-4 mr-2" />
            目标设定
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <TrendingUp className="h-4 w-4 mr-2" />
            分析报告
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 部门绩效对比 */}
            <Card>
              <CardHeader>
                <CardTitle>部门绩效对比</CardTitle>
                <CardDescription>各部门平均得分与完成率</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceData.departmentStats.map((dept, index) => (
                    <div key={dept.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {dept.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {dept.avgScore}分
                          </span>
                          <Badge className="bg-blue-100 text-blue-600 text-xs">
                            完成{dept.completionRate}%
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Progress value={dept.avgScore} className="flex-1" />
                        <div className="flex gap-1">
                          {[dept.aGradeRate].map((rate, i) => (
                            <div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-yellow-500"
                              style={{ width: `${rate}%` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 绩效周期概览 */}
            <Card>
              <CardHeader>
                <CardTitle>绩效周期概览</CardTitle>
                <CardDescription>各周期评估进展</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceData.cycles.map((cycle) => {
                    const StatusIcon = cycle.status === 'completed' ? CheckCircle :
                                      cycle.status === 'in_progress' ? Clock : AlertCircle;
                    const statusColor = cycle.status === 'completed' ? 'text-green-600' :
                                       cycle.status === 'in_progress' ? 'text-blue-600' : 'text-gray-600';

                    return (
                      <div
                        key={cycle.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedCycle(cycle.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg ${selectedCycle === cycle.id ? 'bg-purple-100 dark:bg-purple-900' : 'bg-gray-100 dark:bg-gray-800'} flex items-center justify-center`}>
                            <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {cycle.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {cycle.year}年 第{cycle.quarter}季度
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusIcon className={`h-5 w-5 ${statusColor}`} />
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="records" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>绩效记录</CardTitle>
                  <CardDescription>查看和管理员工绩效评估记录</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Plus className="h-4 w-4 mr-2" />
                  新增评估
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* 筛选栏 */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="搜索员工姓名..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCycle} onValueChange={setSelectedCycle}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="选择周期" />
                  </SelectTrigger>
                  <SelectContent>
                    {performanceData.cycles.map((cycle) => (
                      <SelectItem key={cycle.id} value={cycle.id}>
                        {cycle.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="选择部门" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部部门</SelectItem>
                    {performanceData.departmentStats.map((dept) => (
                      <SelectItem key={dept.name} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部状态</SelectItem>
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 数据表格 */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>员工</TableHead>
                      <TableHead>部门</TableHead>
                      <TableHead>岗位</TableHead>
                      <TableHead>KPI</TableHead>
                      <TableHead>能力</TableHead>
                      <TableHead>态度</TableHead>
                      <TableHead>总分</TableHead>
                      <TableHead>等级</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => {
                      const gradeConfig = GRADE_CONFIG[record.grade];
                      const statusConfig = STATUS_CONFIG[record.status];
                      const GradeIcon = gradeConfig.icon;

                      return (
                        <TableRow key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableCell>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {record.employeeName}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {record.employeeId}
                            </div>
                          </TableCell>
                          <TableCell>{record.department}</TableCell>
                          <TableCell>{record.position}</TableCell>
                          <TableCell>{record.kpiScore}</TableCell>
                          <TableCell>{record.competenceScore}</TableCell>
                          <TableCell>{record.attitudeScore}</TableCell>
                          <TableCell className="font-bold">{record.totalScore}</TableCell>
                          <TableCell>
                            <Badge className={gradeConfig.color}>
                              <GradeIcon className="h-3 w-3 mr-1" />
                              {record.grade}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusConfig.color}>
                              {statusConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetail(record)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>目标设定</CardTitle>
                  <CardDescription>设定和管理员工绩效目标</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Plus className="h-4 w-4 mr-2" />
                  新增目标
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Target className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  目标设定功能
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  支持OKR/KPI目标制定，权重分配，进度跟踪
                </p>
                <Button variant="outline">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  开始设定
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>分析报告</CardTitle>
              <CardDescription>绩效数据分析与洞察</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  绩效分析报告
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  多维度数据分析，趋势洞察，改进建议
                </p>
                <Button variant="outline">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  查看报告
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 绩效详情弹窗 */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>绩效详情</DialogTitle>
            <DialogDescription>
              查看员工绩效评估详细信息
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">员工姓名</Label>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {selectedRecord.employeeName}
                  </div>
                </div>
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">部门/岗位</Label>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {selectedRecord.department} / {selectedRecord.position}
                  </div>
                </div>
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">评估周期</Label>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {selectedRecord.cycleName}
                  </div>
                </div>
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">状态</Label>
                  <Badge className={STATUS_CONFIG[selectedRecord.status].color}>
                    {STATUS_CONFIG[selectedRecord.status].label}
                  </Badge>
                </div>
              </div>

              {/* 评分详情 */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">KPI得分</div>
                  <div className="text-3xl font-bold text-purple-600">
                    {selectedRecord.kpiScore}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">能力得分</div>
                  <div className="text-3xl font-bold text-blue-600">
                    {selectedRecord.competenceScore}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">态度得分</div>
                  <div className="text-3xl font-bold text-green-600">
                    {selectedRecord.attitudeScore}
                  </div>
                </div>
              </div>

              {/* 目标达成情况 */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">目标达成情况</h4>
                <div className="space-y-3">
                  {selectedRecord.goals.map((goal) => (
                    <div key={goal.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {goal.name}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            权重: {goal.weight}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            目标: {goal.target}
                          </span>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold text-green-600">
                            {goal.actual}
                          </span>
                        </div>
                        <Progress value={(goal.actual / goal.target) * 100} className="mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 评价意见 */}
              <div>
                <Label className="text-gray-600 dark:text-gray-400">评价意见</Label>
                <Textarea
                  value={selectedRecord.comments}
                  readOnly
                  className="mt-1 min-h-[100px]"
                />
              </div>

              {/* 审核信息 */}
              {selectedRecord.status !== 'draft' && (
                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="mr-4">审核人: {selectedRecord.reviewer}</span>
                    <span>审核日期: {selectedRecord.reviewDate || '-'}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
