'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader, createProPageHeader } from '@/components/layout/page-header';
import {
  Target,
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Plus,
  Download,
  FileText,
  BarChart3,
  PieChart,
  LineChart,
  Calculator,
  Lightbulb,
  Rocket,
  Search,
  Filter,
  RefreshCw,
  Brain,
  Award,
  Building2,
} from 'lucide-react';

// 业务目标数据
const businessGoals = [
  {
    id: 1,
    name: '2024年Q1业绩目标',
    department: '销售部',
    type: 'OKR',
    status: '进行中',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    objectives: [
      {
        title: '实现营收目标',
        target: '2000万',
        current: '1200万',
        progress: 60,
      },
      {
        title: '拓展新客户',
        target: '100个',
        current: '45个',
        progress: 45,
      },
    ],
  },
  {
    id: 2,
    name: '产品上线计划',
    department: '产品部',
    type: 'OKR',
    status: '进行中',
    startDate: '2024-01-15',
    endDate: '2024-04-15',
    objectives: [
      {
        title: '完成核心功能开发',
        target: '10个',
        current: '7个',
        progress: 70,
      },
      {
        title: '用户测试',
        target: '100人',
        current: '30人',
        progress: 30,
      },
    ],
  },
];

// 人力匹配分析
const workforceMatchData = {
  current: {
    total: 485,
    byDepartment: [
      { name: '研发部', count: 120, percentage: 24.7 },
      { name: '销售部', count: 85, percentage: 17.5 },
      { name: '市场部', count: 45, percentage: 9.3 },
      { name: '产品部', count: 35, percentage: 7.2 },
      { name: '运营部', count: 50, percentage: 10.3 },
      { name: '职能部', count: 150, percentage: 30.9 },
    ],
  },
  required: {
    total: 520,
    byDepartment: [
      { name: '研发部', count: 130, percentage: 25.0 },
      { name: '销售部', count: 95, percentage: 18.3 },
      { name: '市场部', count: 50, percentage: 9.6 },
      { name: '产品部', count: 40, percentage: 7.7 },
      { name: '运营部', count: 55, percentage: 10.6 },
      { name: '职能部', count: 150, percentage: 28.8 },
    ],
  },
  gap: {
    total: -35,
    byDepartment: [
      { name: '研发部', gap: -10, status: 'high' },
      { name: '销售部', gap: -10, status: 'high' },
      { name: '市场部', gap: -5, status: 'medium' },
      { name: '产品部', gap: -5, status: 'medium' },
      { name: '运营部', gap: -5, status: 'medium' },
      { name: '职能部', gap: 0, status: 'good' },
    ],
  },
};

// 资源缺口评估
const resourceGapData = [
  {
    category: '人员数量',
    current: 485,
    required: 520,
    gap: -35,
    gapRate: -6.7,
    urgency: 'high',
    action: '立即招聘35人',
  },
  {
    category: '技术能力',
    current: 75,
    required: 85,
    gap: -10,
    gapRate: -11.8,
    urgency: 'high',
    action: '开展技术培训，引进技术专家',
  },
  {
    category: '销售能力',
    current: 80,
    required: 90,
    gap: -10,
    gapRate: -11.1,
    urgency: 'high',
    action: '加强销售培训，优化激励机制',
  },
  {
    category: '管理能力',
    current: 82,
    required: 85,
    gap: -3,
    gapRate: -3.5,
    urgency: 'medium',
    action: '管理培训，提拔潜力人才',
  },
  {
    category: '预算',
    current: 2000,
    required: 2200,
    gap: -200,
    gapRate: -9.1,
    urgency: 'medium',
    action: '优化预算分配，争取更多资源',
  },
];

// 优化建议
const optimizationSuggestions = [
  {
    id: 1,
    category: '人员调整',
    priority: '高',
    suggestions: [
      '研发部新增10名工程师，重点招聘前端和算法工程师',
      '销售部新增10名销售经理，加强大客户拓展能力',
      '市场部新增5名市场专员，提升品牌推广力度',
    ],
    impact: '预计提升产能20%',
    timeline: '1-2个月',
  },
  {
    id: 2,
    category: '能力提升',
    priority: '高',
    suggestions: [
      '为研发部开展AI/ML技术培训，提升技术竞争力',
      '为销售部开展大客户销售培训，提升成单率',
      '为产品部开展用户体验培训，提升产品设计能力',
    ],
    impact: '预计提升人均绩效15%',
    timeline: '2-3个月',
  },
  {
    id: 3,
    category: '组织优化',
    priority: '中',
    suggestions: [
      '优化团队结构，推行扁平化管理',
      '建立跨部门协作机制，提升协同效率',
      '完善绩效考核体系，激励高绩效员工',
    ],
    impact: '预计提升组织效率25%',
    timeline: '3-6个月',
  },
  {
    id: 4,
    category: '激励优化',
    priority: '中',
    suggestions: [
      '调整薪酬结构，提高市场竞争力',
      '完善股权激励方案，留住核心人才',
      '建立晋升通道，激励员工成长',
    ],
    impact: '预计降低流失率30%',
    timeline: '1-3个月',
  },
];

// 复盘报告
const reviewReport = {
  title: '2024年Q1业务复盘报告',
  date: '2024-01-31',
  author: 'HRBP团队',
  summary: `
    本季度公司整体业绩良好，营收达成率60%，新客户拓展达成率45%。
    主要亮点：产品开发进度良好，团队协作能力提升。
    主要问题：销售人员不足，技术能力存在缺口，部分项目进度延迟。
    改进建议：加大招聘力度，加强技能培训，优化资源配置。
  `,
  highlights: [
    '产品功能开发进度70%，超出预期',
    '团队满意度提升至85%，同比+5%',
    '员工流失率控制在8.5%，低于行业平均水平',
  ],
  issues: [
    '销售部人员缺口10人，影响业绩达成',
    '研发部AI技术能力不足，影响产品创新',
    '跨部门协作效率有待提升',
  ],
  nextSteps: [
    '2月底前完成15人招聘',
    '3月开展技术培训计划',
    '建立跨部门协作机制',
  ],
};

export default function BusinessReviewPage() {
  const [activeTab, setActiveTab] = useState('goals');
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const getGapStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'high': 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-200',
      'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-200',
      'low': 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-200',
      'good': 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getGapStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'high': '严重不足',
      'medium': '略有不足',
      'low': '基本匹配',
      'good': '匹配良好',
    };
    return labels[status] || status;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      '高': 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-200',
      '中': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-200',
      '低': 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-200',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <PageHeader {...createProPageHeader({
        icon: BarChart3,
        title: '业务复盘助手',
        description: '业务目标设定、人力匹配分析、资源缺口评估、优化建议，助力业务目标达成',
        extraActions: (
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              更新数据
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出报告
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
              <Brain className="h-4 w-4 mr-2" />
              AI智能分析
            </Button>
          </div>
        )
      })} />

      {/* Tab导航 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full max-w-lg grid-cols-4">
          <TabsTrigger value="goals">业务目标</TabsTrigger>
          <TabsTrigger value="workforce">人力匹配</TabsTrigger>
          <TabsTrigger value="resource">资源缺口</TabsTrigger>
          <TabsTrigger value="optimization">优化建议</TabsTrigger>
        </TabsList>

        {/* 业务目标 */}
        <TabsContent value="goals" className="space-y-4">
          {/* 目标统计 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>目标数量</CardDescription>
                <CardTitle className="text-3xl">{businessGoals.length}</CardTitle>
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <Target className="h-3 w-3 mr-1" />
                  个业务目标
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>进行中</CardDescription>
                <CardTitle className="text-3xl text-blue-600">
                  {businessGoals.filter(g => g.status === '进行中').length}
                </CardTitle>
                <div className="flex items-center text-xs text-blue-600 mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  个目标
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>平均进度</CardDescription>
                <CardTitle className="text-3xl">51%</CardTitle>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  整体进度良好
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>需要关注</CardDescription>
                <CardTitle className="text-3xl text-red-600">1</CardTitle>
                <div className="flex items-center text-xs text-red-600 mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  个目标延期
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* 目标列表 */}
          <div className="grid grid-cols-1 gap-4">
            {businessGoals.map((goal) => (
              <Card key={goal.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
                        <Target className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {goal.name}
                          <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                            {goal.type}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {goal.department} · {goal.startDate} 至 {goal.endDate}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {goal.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {goal.objectives.map((objective, index) => (
                      <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{objective.title}</span>
                          <Badge variant="outline">{objective.progress}%</Badge>
                        </div>
                        <div className="flex items-center justify-between mb-2 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            目标：{objective.target}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            当前：{objective.current}
                          </span>
                        </div>
                        <Progress value={objective.progress} className="h-2" />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end mt-4 pt-4 border-t">
                    <Button variant="ghost" size="sm">
                      查看详情
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 创建目标 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                创建新目标
              </CardTitle>
              <CardDescription>为业务部门设定新的OKR或KPI目标</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>目标名称</Label>
                    <Input placeholder="输入目标名称" />
                  </div>
                  <div className="space-y-2">
                    <Label>部门</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择部门" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">销售部</SelectItem>
                        <SelectItem value="rd">研发部</SelectItem>
                        <SelectItem value="product">产品部</SelectItem>
                        <SelectItem value="marketing">市场部</SelectItem>
                        <SelectItem value="operations">运营部</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>目标类型</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="okr">OKR</SelectItem>
                        <SelectItem value="kpi">KPI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>开始时间</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>结束时间</Label>
                      <Input type="date" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>目标描述</Label>
                  <Textarea placeholder="详细描述目标和期望" rows={3} />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">取消</Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                    创建目标
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 人力匹配 */}
        <TabsContent value="workforce" className="space-y-4">
          {/* 统计概览 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>当前人数</CardDescription>
                <CardTitle className="text-3xl">{workforceMatchData.current.total}</CardTitle>
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <Users className="h-3 w-3 mr-1" />
                  总人数
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>目标人数</CardDescription>
                <CardTitle className="text-3xl">{workforceMatchData.required.total}</CardTitle>
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <Target className="h-3 w-3 mr-1" />
                  目标配置
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>人员缺口</CardDescription>
                <CardTitle className={`text-3xl ${workforceMatchData.gap.total < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {workforceMatchData.gap.total}
                </CardTitle>
                <div className="flex items-center text-xs text-red-600 mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  需要补充人员
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* 部门对比 */}
          <Card>
            <CardHeader>
              <CardTitle>各部门人员匹配情况</CardTitle>
              <CardDescription>当前配置 vs 目标配置</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workforceMatchData.current.byDepartment.map((dept, index) => {
                  const requiredDept = workforceMatchData.required.byDepartment.find(
                    d => d.name === dept.name
                  )!;
                  const gap = workforceMatchData.gap.byDepartment.find(
                    g => g.name === dept.name
                  )!;

                  return (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">{dept.name}</span>
                          <Badge className={getGapStatusColor(gap.status)}>
                            {getGapStatusLabel(gap.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {gap.gap !== 0 && (
                            <Badge className={
                              gap.gap < 0
                                ? 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-200'
                                : 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-200'
                            }>
                              {gap.gap < 0 ? '-' : '+'}{Math.abs(gap.gap)}人
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">当前人数</span>
                            <span className="font-medium">{dept.count}人 ({dept.percentage}%)</span>
                          </div>
                          <Progress value={dept.percentage} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">目标人数</span>
                            <span className="font-medium">{requiredDept.count}人 ({requiredDept.percentage}%)</span>
                          </div>
                          <Progress value={requiredDept.percentage} className="h-2" />
                        </div>
                      </div>

                      {gap.gap !== 0 && (
                        <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded text-sm flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {gap.gap < 0
                              ? `需要新增${Math.abs(gap.gap)}人，建议优先招聘`
                              : `人员过剩${gap.gap}人，建议优化调配`}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 资源缺口 */}
        <TabsContent value="resource" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>资源缺口评估</CardTitle>
              <CardDescription>分析当前资源配置与目标的差距</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resourceGapData.map((resource, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white">
                          {index === 0 && <Users className="h-5 w-5" />}
                          {index === 1 && <Brain className="h-5 w-5" />}
                          {index === 2 && <Briefcase className="h-5 w-5" />}
                          {index === 3 && <Award className="h-5 w-5" />}
                          {index === 4 && <Calculator className="h-5 w-5" />}
                        </div>
                        <div>
                          <h3 className="font-medium">{resource.category}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={
                              resource.gapRate < -10
                                ? 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-200'
                                : resource.gapRate < 0
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-200'
                                : 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-200'
                            }>
                              {resource.gapRate}%
                            </Badge>
                            <Badge className={getPriorityColor(resource.urgency)}>
                              {resource.urgency === 'high' && <AlertTriangle className="h-3 w-3 mr-1" />}
                              {resource.urgency === 'high' ? '紧急' : resource.urgency === 'medium' ? '中等' : '一般'}优先级
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-400">缺口</div>
                        <div className={`text-2xl font-bold ${resource.gap < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {resource.gap < 0 ? '-' : '+'}{Math.abs(resource.gap)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">
                        <div className="text-sm text-gray-600 dark:text-gray-400">当前配置</div>
                        <div className="font-bold">{resource.current}</div>
                      </div>
                      <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">
                        <div className="text-sm text-gray-600 dark:text-gray-400">目标配置</div>
                        <div className="font-bold">{resource.required}</div>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">建议措施：</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {resource.action}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 优化建议 */}
        <TabsContent value="optimization" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {optimizationSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {suggestion.category === '人员调整' && <Users className="h-5 w-5 text-blue-600" />}
                        {suggestion.category === '能力提升' && <Brain className="h-5 w-5 text-purple-600" />}
                        {suggestion.category === '组织优化' && <Building2 className="h-5 w-5 text-green-600" />}
                        {suggestion.category === '激励优化' && <Zap className="h-5 w-5 text-orange-600" />}
                        {suggestion.category}
                      </CardTitle>
                      <Badge className={`${getPriorityColor(suggestion.priority)} mt-1`}>
                        {suggestion.priority}优先级
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">具体措施</h4>
                      <ul className="space-y-2">
                        {suggestion.suggestions.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                      <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <div className="text-sm text-gray-600 dark:text-gray-400">预期效果</div>
                        <div className="font-bold text-green-700 dark:text-green-300">
                          {suggestion.impact}
                        </div>
                      </div>
                      <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <div className="text-sm text-gray-600 dark:text-gray-400">实施周期</div>
                        <div className="font-bold text-blue-700 dark:text-blue-300">
                          {suggestion.timeline}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 复盘报告 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                复盘报告
              </CardTitle>
              <CardDescription>
                {reviewReport.date} · {reviewReport.author}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* 总结 */}
                <div>
                  <h4 className="font-medium mb-2">总结</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {reviewReport.summary}
                  </p>
                </div>

                {/* 亮点 */}
                <div>
                  <h4 className="font-medium mb-2">主要亮点</h4>
                  <ul className="space-y-2">
                    {reviewReport.highlights.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 问题 */}
                <div>
                  <h4 className="font-medium mb-2">主要问题</h4>
                  <ul className="space-y-2">
                    {reviewReport.issues.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 下一步 */}
                <div>
                  <h4 className="font-medium mb-2">下一步计划</h4>
                  <ul className="space-y-2">
                    {reviewReport.nextSteps.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <ArrowRight className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <Button variant="outline" onClick={() => setActiveTab('goals')}>
                  编辑报告
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  <Download className="h-4 w-4 mr-2" />
                  导出PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
