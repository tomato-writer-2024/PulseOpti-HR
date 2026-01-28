'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader, createProPageHeader } from '@/components/layout/page-header';
import {
  Users,
  Building2,
  UserPlus,
  UserCheck,
  UserX,
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Briefcase,
  Phone,
  MessageSquare,
  Calendar,
  FileText,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Heart,
  Smile,
  Frown,
  Meh,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Plus,
  Filter,
  Search,
  Download,
  Send,
  Mail,
  Lightbulb,
} from 'lucide-react';

// 部门数据
const departments = [
  { id: 1, name: '研发部', manager: '朱二十', employeeCount: 120, avgPerformance: 88.2, satisfaction: 85 },
  { id: 2, name: '销售部', manager: '沈十七', employeeCount: 85, avgPerformance: 87.5, satisfaction: 82 },
  { id: 3, name: '市场部', manager: '杨十九', employeeCount: 45, avgPerformance: 82.7, satisfaction: 80 },
  { id: 4, name: '产品部', manager: '楚十四', employeeCount: 35, avgPerformance: 86.0, satisfaction: 83 },
  { id: 5, name: '运营部', manager: '郑十一', employeeCount: 50, avgPerformance: 84.3, satisfaction: 81 },
  { id: 6, name: '职能部', manager: '韩十八', employeeCount: 150, avgPerformance: 83.5, satisfaction: 84 },
];

// 招聘跟进数据
const recruitmentData = {
  positions: [
    {
      id: 1,
      department: '研发部',
      position: '高级前端工程师',
      headcount: 3,
      hired: 1,
      interviewing: 2,
      status: '招聘中',
      urgency: '高',
      postedDate: '2024-01-15',
    },
    {
      id: 2,
      department: '销售部',
      position: '销售经理',
      headcount: 2,
      hired: 0,
      interviewing: 3,
      status: '招聘中',
      urgency: '高',
      postedDate: '2024-01-20',
    },
    {
      id: 3,
      department: '产品部',
      position: '产品经理',
      headcount: 2,
      hired: 2,
      interviewing: 0,
      status: '已关闭',
      urgency: '中',
      postedDate: '2024-01-10',
    },
  ],
  candidates: [
    {
      id: 1,
      name: '张三',
      position: '高级前端工程师',
      department: '研发部',
      stage: '技术面试',
      appliedDate: '2024-01-25',
      source: '猎头',
      status: '进行中',
      interviews: [
        { type: '初筛', status: 'completed', date: '2024-01-26', interviewer: 'HRBP', rating: 85 },
        { type: '技术', status: 'pending', date: '2024-01-28', interviewer: '技术总监' },
      ],
      notes: '前端框架经验丰富，React项目经历突出',
    },
    {
      id: 2,
      name: '李四',
      position: '销售经理',
      department: '销售部',
      stage: '复试',
      appliedDate: '2024-01-22',
      source: '招聘网站',
      status: '进行中',
      interviews: [
        { type: '初筛', status: 'completed', date: '2024-01-23', interviewer: 'HRBP', rating: 90 },
        { type: '复试', status: 'pending', date: '2024-01-29', interviewer: '销售总监' },
      ],
      notes: '大客户销售经验丰富，团队管理能力强',
    },
    {
      id: 3,
      name: '王五',
      position: '销售经理',
      department: '销售部',
      stage: '终面',
      appliedDate: '2024-01-20',
      source: '内部推荐',
      status: '进行中',
      interviews: [
        { type: '初筛', status: 'completed', date: '2024-01-21', interviewer: 'HRBP', rating: 88 },
        { type: '复试', status: 'completed', date: '2024-01-24', interviewer: '销售总监', rating: 92 },
        { type: '终面', status: 'pending', date: '2024-01-30', interviewer: 'CEO' },
      ],
      notes: '销售业绩突出，领导力强，与团队文化契合度高',
    },
  ],
};

// 绩效追踪数据
const performanceData = {
  departmentStats: {
    total: 120,
    excellent: 25,
    good: 65,
    average: 25,
    belowAverage: 5,
  },
  employeePerformance: [
    {
      id: 1,
      name: '朱二十',
      position: 'CTO',
      department: '研发部',
      score: 95,
      trend: 'up',
      change: 3.2,
      goals: [
        { name: '系统稳定性', target: '99.9%', current: '99.95%', status: 'exceeded' },
        { name: '技术团队建设', target: '15人', current: '12人', status: 'ontrack' },
      ],
    },
    {
      id: 2,
      name: '蒋十六',
      position: '架构师',
      department: '研发部',
      score: 90,
      trend: 'up',
      change: 2.5,
      goals: [
        { name: '架构优化', target: '完成', current: '80%', status: 'ontrack' },
        { name: '技术分享', target: '4次/季度', current: '3次', status: 'ontrack' },
      ],
    },
    {
      id: 3,
      name: '陈十三',
      position: '算法工程师',
      department: '研发部',
      score: 82,
      trend: 'down',
      change: -1.5,
      goals: [
        { name: '算法优化', target: '性能提升30%', current: '15%', status: 'delayed' },
        { name: '模型训练', target: '3个模型', current: '1个', status: 'delayed' },
      ],
    },
  ],
};

// 团队健康度
const teamHealthData = {
  satisfactionScore: 85,
  engagementScore: 82,
  turnoverRate: 8.5,
  absenceRate: 3.2,
  feedback: [
    {
      id: 1,
      category: '工作环境',
      score: 88,
      trend: 'up',
      change: 2.0,
    },
    {
      id: 2,
      category: '薪酬福利',
      score: 82,
      trend: 'up',
      change: 1.5,
    },
    {
      id: 3,
      category: '职业发展',
      score: 78,
      trend: 'down',
      change: -1.0,
    },
    {
      id: 4,
      category: '团队氛围',
      score: 90,
      trend: 'stable',
      change: 0.0,
    },
    {
      id: 5,
      category: '领导管理',
      score: 86,
      trend: 'up',
      change: 1.8,
    },
  ],
};

export default function DepartmentTalentBoardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDepartment, setSelectedDepartment] = useState('研发部');
  const [showCandidateDetail, setShowCandidateDetail] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  const getDepartmentData = (deptName: string) => {
    return departments.find(d => d.name === deptName) || departments[0];
  };

  const currentDept = getDepartmentData(selectedDepartment);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      '招聘中': 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-200',
      '已关闭': 'bg-gray-100 text-gray-800 dark:bg-gray-950/30 dark:text-gray-200',
      '进行中': 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-200',
      '待定': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-200',
      '已录用': 'bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-200',
      '已淘汰': 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getUrgencyColor = (urgency: string) => {
    const colors: Record<string, string> = {
      '高': 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-200',
      '中': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-200',
      '低': 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-200',
    };
    return colors[urgency] || 'bg-gray-100 text-gray-800';
  };

  const getGoalStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'exceeded': 'text-green-600',
      'ontrack': 'text-blue-600',
      'delayed': 'text-red-600',
    };
    return colors[status] || 'text-gray-600';
  };

  const getGoalStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'exceeded': '超额完成',
      'ontrack': '正常推进',
      'delayed': '延期风险',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <PageHeader {...createProPageHeader({
        icon: Building2,
        title: '部门人才看板',
        description: '部门人员概览、招聘跟进、绩效追踪、团队健康度，全方位支持业务部门',
        extraActions: (
          <div className="flex items-center gap-2">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[180px]">
                <Building2 className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出报告
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
              <Plus className="h-4 w-4 mr-2" />
              添加招聘需求
            </Button>
          </div>
        )
      })} />

      {/* Tab导航 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full max-w-lg grid-cols-4">
          <TabsTrigger value="overview">人员概览</TabsTrigger>
          <TabsTrigger value="recruitment">招聘跟进</TabsTrigger>
          <TabsTrigger value="performance">绩效追踪</TabsTrigger>
          <TabsTrigger value="health">团队健康度</TabsTrigger>
        </TabsList>

        {/* 人员概览 */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>部门人数</CardDescription>
                <CardTitle className="text-3xl">{currentDept.employeeCount}</CardTitle>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  较上月 +5人
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>平均绩效</CardDescription>
                <CardTitle className="text-3xl">{currentDept.avgPerformance}</CardTitle>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  同比 +2.3%
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>满意度</CardDescription>
                <CardTitle className="text-3xl">{currentDept.satisfaction}</CardTitle>
                <div className="flex items-center text-xs text-blue-600 mt-1">
                  <Heart className="h-3 w-3 mr-1" />
                  团队氛围好
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>部门负责人</CardDescription>
                <CardTitle className="text-xl">{currentDept.manager}</CardTitle>
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <Briefcase className="h-3 w-3 mr-1" />
                  在任 3年
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* 人员结构 */}
          <Card>
            <CardHeader>
              <CardTitle>人员结构分析</CardTitle>
              <CardDescription>按职级和年限分析部门人员结构</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 职级分布 */}
                <div>
                  <h3 className="font-medium mb-4">职级分布</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">总监/VP</span>
                        <span className="text-sm font-bold">5人 (4.2%)</span>
                      </div>
                      <Progress value={4.2} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">经理/主管</span>
                        <span className="text-sm font-bold">15人 (12.5%)</span>
                      </div>
                      <Progress value={12.5} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">高级工程师</span>
                        <span className="text-sm font-bold">35人 (29.2%)</span>
                      </div>
                      <Progress value={29.2} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">工程师</span>
                        <span className="text-sm font-bold">65人 (54.1%)</span>
                      </div>
                      <Progress value={54.1} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* 工龄分布 */}
                <div>
                  <h3 className="font-medium mb-4">工龄分布</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">1年以内</span>
                        <span className="text-sm font-bold">25人 (20.8%)</span>
                      </div>
                      <Progress value={20.8} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">1-3年</span>
                        <span className="text-sm font-bold">55人 (45.8%)</span>
                      </div>
                      <Progress value={45.8} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">3-5年</span>
                        <span className="text-sm font-bold">30人 (25.0%)</span>
                      </div>
                      <Progress value={25.0} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">5年以上</span>
                        <span className="text-sm font-bold">10人 (8.3%)</span>
                      </div>
                      <Progress value={8.3} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 招聘跟进 */}
        <TabsContent value="recruitment" className="space-y-4">
          {/* 招聘需求 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                招聘需求
              </CardTitle>
              <CardDescription>当前部门正在进行的招聘岗位</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recruitmentData.positions.map((position) => (
                  <div key={position.id} className="p-4 border rounded-lg hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{position.position}</h3>
                          <Badge className={getUrgencyColor(position.urgency)}>
                            {position.urgency === '高' && <AlertTriangle className="h-3 w-3 mr-1" />}
                            {position.urgency}优先级
                          </Badge>
                          <Badge className={getStatusColor(position.status)}>
                            {position.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {position.department} · 发布于 {position.postedDate}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                      <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">
                        <div className="text-gray-600 dark:text-gray-400">招聘人数</div>
                        <div className="font-bold">{position.headcount}人</div>
                      </div>
                      <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">
                        <div className="text-gray-600 dark:text-gray-400">已录用</div>
                        <div className="font-bold text-green-600">{position.hired}人</div>
                      </div>
                      <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">
                        <div className="text-gray-600 dark:text-gray-400">面试中</div>
                        <div className="font-bold text-blue-600">{position.interviewing}人</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">招聘进度</span>
                          <span className="text-sm font-bold">{Math.round((position.hired / position.headcount) * 100)}%</span>
                        </div>
                        <Progress value={(position.hired / position.headcount) * 100} className="h-2" />
                      </div>
                      <Button variant="ghost" size="sm">
                        查看详情
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 候选人列表 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    候选人跟进
                  </CardTitle>
                  <CardDescription>候选人面试流程跟踪</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  筛选
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recruitmentData.candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    onClick={() => {
                      setSelectedCandidate(candidate);
                      setShowCandidateDetail(true);
                    }}
                    className="p-4 border rounded-lg hover:shadow-md cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold">
                          {candidate.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{candidate.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {candidate.position} · {candidate.department}
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(candidate.status)}>
                        {candidate.status === '进行中' && <Clock className="h-3 w-3 mr-1" />}
                        {candidate.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        <span>{candidate.stage}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        <span>{candidate.appliedDate} 应聘</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        <span>{candidate.source}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        备注：{candidate.notes}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4 mr-1" />
                          联系
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Send className="h-4 w-4 mr-1" />
                          安排面试
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 绩效追踪 */}
        <TabsContent value="performance" className="space-y-4">
          {/* 部门绩效分布 */}
          <Card>
            <CardHeader>
              <CardTitle>部门绩效分布</CardTitle>
              <CardDescription>员工绩效得分分布情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {performanceData.departmentStats.excellent}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    优秀 (90+)
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {Math.round((performanceData.departmentStats.excellent / performanceData.departmentStats.total) * 100)}%
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {performanceData.departmentStats.good}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    良好 (80-89)
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {Math.round((performanceData.departmentStats.good / performanceData.departmentStats.total) * 100)}%
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {performanceData.departmentStats.average}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    一般 (70-79)
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {Math.round((performanceData.departmentStats.average / performanceData.departmentStats.total) * 100)}%
                  </div>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {performanceData.departmentStats.belowAverage}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    待改进 (&lt;70)
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {Math.round((performanceData.departmentStats.belowAverage / performanceData.departmentStats.total) * 100)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 员工绩效详情 */}
          <Card>
            <CardHeader>
              <CardTitle>员工绩效追踪</CardTitle>
              <CardDescription>重点员工绩效表现和目标达成情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.employeePerformance.map((employee) => (
                  <div key={employee.id} className="p-4 border rounded-lg hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                          {employee.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {employee.position} · {employee.department}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{employee.score}分</div>
                        <div className={`flex items-center justify-end gap-1 text-sm ${
                          employee.trend === 'up' ? 'text-green-600' : employee.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {employee.trend === 'up' && <ArrowUpRight className="h-4 w-4" />}
                          {employee.trend === 'down' && <ArrowDownRight className="h-4 w-4" />}
                          {employee.change > 0 ? '+' : ''}{employee.change}%
                        </div>
                      </div>
                    </div>

                    {/* 目标追踪 */}
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-2">目标达成</h4>
                      <div className="space-y-2">
                        {employee.goals.map((goal, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2">
                              <Target className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              {goal.name}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="text-gray-600 dark:text-gray-400">
                                {goal.current} / {goal.target}
                              </span>
                              <Badge className={getGoalStatusColor(goal.status)}>
                                {getGoalStatusLabel(goal.status)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end mt-3 pt-3 border-t">
                      <Button variant="ghost" size="sm">
                        查看详情
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 团队健康度 */}
        <TabsContent value="health" className="space-y-4">
          {/* 核心指标 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>满意度</CardDescription>
                <CardTitle className="text-3xl text-blue-600">{teamHealthData.satisfactionScore}</CardTitle>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  同比 +5.2%
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>敬业度</CardDescription>
                <CardTitle className="text-3xl text-purple-600">{teamHealthData.engagementScore}</CardTitle>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  同比 +3.8%
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>流失率</CardDescription>
                <CardTitle className="text-3xl text-red-600">{teamHealthData.turnoverRate}%</CardTitle>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  同比 -2.1%
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>缺勤率</CardDescription>
                <CardTitle className="text-3xl text-orange-600">{teamHealthData.absenceRate}%</CardTitle>
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  正常范围
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* 反馈分析 */}
          <Card>
            <CardHeader>
              <CardTitle>满意度反馈分析</CardTitle>
              <CardDescription>各维度满意度得分和趋势</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamHealthData.feedback.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.category}</span>
                        <Badge variant="outline">{item.score}分</Badge>
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        item.trend === 'up' ? 'text-green-600' : item.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {item.trend === 'up' && <ArrowUpRight className="h-4 w-4" />}
                        {item.trend === 'down' && <ArrowDownRight className="h-4 w-4" />}
                        {item.change > 0 ? '+' : ''}{item.change}%
                      </div>
                    </div>
                    <Progress value={item.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 改进建议 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                改进建议
              </CardTitle>
              <CardDescription>基于数据分析的改进措施</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">职业发展</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    建议为员工制定更清晰的职业发展路径，提供晋升通道和技能培训
                  </p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4 text-green-600" />
                    <span className="font-medium">团队建设</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    继续保持良好的团队氛围，定期组织团队活动和分享会
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">激励机制</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    优化绩效激励方案，将个人目标与部门目标紧密结合
                  </p>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">沟通机制</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    建立定期的员工反馈机制，及时了解员工诉求和问题
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
