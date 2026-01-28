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
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Sparkles,
  Zap,
  Calendar,
  Briefcase,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  FileText,
  Crown,
  Lightbulb,
  Award,
  PieChart,
  LineChart,
  Activity,
  Building2,
} from 'lucide-react';
import { toast } from 'sonner';

// 模拟人力规划数据
const planningData = {
  // 当前人员状况
  currentStatus: {
    totalEmployees: 485,
    departments: 8,
    avgTenure: 3.2,
    turnoverRate: 8.3,
    efficiencyScore: 92.5,
  },

  // 预测数据
  forecast: {
    sixMonthGrowth: '+15%',
    twelveMonthGrowth: '+25%',
    budgetImpact: '+¥3,200,000',
    headcountNeed: '+72',
  },

  // 部门人员规划建议
  departmentPlanning: [
    {
      department: '研发部',
      currentHeadcount: 120,
      recommendedHeadcount: 145,
      reason: '业务扩张需求',
      priority: 'high',
      budgetImpact: '¥1,250,000',
      timeline: 'Q1-Q2',
      skillsNeeded: ['高级工程师', '架构师', 'AI算法'],
    },
    {
      department: '销售部',
      currentHeadcount: 85,
      recommendedHeadcount: 100,
      reason: '市场拓展需求',
      priority: 'high',
      budgetImpact: '¥900,000',
      timeline: 'Q2-Q3',
      skillsNeeded: ['销售经理', '客户经理', 'BD'],
    },
    {
      department: '产品部',
      currentHeadcount: 35,
      recommendedHeadcount: 42,
      reason: '产品线增加',
      priority: 'medium',
      budgetImpact: '¥560,000',
      timeline: 'Q3',
      skillsNeeded: ['产品经理', '产品运营', '数据分析'],
    },
    {
      department: '市场部',
      currentHeadcount: 45,
      recommendedHeadcount: 50,
      reason: '品牌建设需求',
      priority: 'medium',
      budgetImpact: '¥350,000',
      timeline: 'Q4',
      skillsNeeded: ['品牌策划', '新媒体运营', '内容创作'],
    },
  ],

  // 人才结构优化建议
  structureOptimization: [
    {
      category: '管理层',
      current: 35,
      recommended: 40,
      ratio: '8.2%',
      recommendation: '增加5名中层管理者，提升组织效率',
      impact: '预计提升管理效率15%',
    },
    {
      category: '核心技术人员',
      current: 150,
      recommended: 180,
      ratio: '37%',
      recommendation: '重点招聘高级技术人才，提升技术竞争力',
      impact: '预计提升产品开发速度20%',
    },
    {
      category: '业务人员',
      current: 200,
      recommended: 220,
      ratio: '41.2%',
      recommendation: '加强销售和运营团队，支持业务扩张',
      impact: '预计提升业绩25%',
    },
    {
      category: '职能人员',
      current: 100,
      recommended: 85,
      ratio: '17.5%',
      recommendation: '优化职能人员结构，提高人均效能',
      impact: '预计降低人力成本10%',
    },
  ],

  // 成本效益分析
  costBenefit: {
    totalCost: '¥4,850,000',
    expectedRevenue: '¥24,250,000',
    roi: '500%',
    paybackPeriod: '6个月',
    riskLevel: 'low',
  },

  // 风险提示
  risks: [
    {
      type: '招聘周期',
      level: 'medium',
      description: '高级技术人才招聘周期较长，可能影响项目进度',
      mitigation: '提前3个月启动招聘，建立人才储备',
    },
    {
      type: '培训成本',
      level: 'low',
      description: '新员工培训需要投入额外成本和时间',
      mitigation: '完善新人培训体系，缩短培训周期',
    },
    {
      type: '文化融合',
      level: 'low',
      description: '大量新员工加入可能影响团队文化',
      mitigation: '加强企业文化宣导，建立导师制度',
    },
  ],

  // 实施建议
  implementationPlan: [
    {
      phase: '第一阶段',
      timeline: 'Q1',
      actions: [
        '启动研发部和销售部招聘',
        '完善招聘流程和标准',
        '建立人才储备库',
      ],
      budget: '¥2,150,000',
      headcount: 45,
    },
    {
      phase: '第二阶段',
      timeline: 'Q2',
      actions: [
        '继续招聘核心岗位',
        '优化薪酬体系',
        '加强员工培训',
      ],
      budget: '¥1,700,000',
      headcount: 20,
    },
    {
      phase: '第三阶段',
      timeline: 'Q3',
      actions: [
        '完成所有招聘计划',
        '评估人员配置效果',
        '调整后续规划',
      ],
      budget: '¥1,000,000',
      headcount: 7,
    },
  ],
};

export default function PlanningSuggestionPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('12-month');

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <PageHeader {...createProPageHeader({
        icon: Lightbulb,
        title: '人力规划建议',
        description: 'AI智能分析企业人力资源状况，一键生成人力规划方案，助力企业降本增效',
        badge: { text: 'AI', color: 'from-purple-600 to-pink-600' },
        extraActions: (
          <div className="flex items-center gap-2">
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6-month">未来6个月</SelectItem>
                <SelectItem value="12-month">未来12个月</SelectItem>
                <SelectItem value="18-month">未来18个月</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出报告
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Sparkles className="h-4 w-4 mr-2" />
              AI重新生成
            </Button>
          </div>
        )
      })} />

      {/* 核心指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>当前员工数</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-3xl">{planningData.currentStatus.totalEmployees}</CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <Badge className="bg-purple-100 text-purple-600">8个部门</Badge>
              <span className="text-gray-600 dark:text-gray-400">平均司龄{planningData.currentStatus.avgTenure}年</span>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>建议新增人员</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-3xl">+{planningData.forecast.headcountNeed}</CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600">{planningData.forecast.twelveMonthGrowth} 增长</span>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>预算影响</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-3xl">{planningData.forecast.budgetImpact}</CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600 dark:text-gray-400">年度新增成本</span>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>投资回报率</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white">
                <Award className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-3xl">{planningData.costBenefit.roi}</CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <Badge className="bg-green-100 text-green-600">
                回收期{planningData.costBenefit.paybackPeriod}
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Tab导航 */}
      <Tabs defaultValue="departments" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="departments">部门规划</TabsTrigger>
          <TabsTrigger value="structure">结构优化</TabsTrigger>
          <TabsTrigger value="cost-benefit">成本效益</TabsTrigger>
          <TabsTrigger value="risks">风险提示</TabsTrigger>
          <TabsTrigger value="implementation">实施计划</TabsTrigger>
        </TabsList>

        {/* 部门规划 */}
        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                部门人员规划建议
              </CardTitle>
              <CardDescription>
                基于业务发展需求，各部门人员配置建议
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {planningData.departmentPlanning.map((dept, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">{dept.department}</h4>
                            <Badge className={dept.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}>
                              {dept.priority === 'high' ? '高优先级' : '中优先级'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {dept.reason}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-blue-600" />
                              <span>当前: {dept.currentHeadcount}人</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ArrowUpRight className="h-4 w-4 text-green-600" />
                              <span>建议: {dept.recommendedHeadcount}人</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-purple-600" />
                              <span>{dept.timeline}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-orange-600">
                            {dept.budgetImpact}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            预算影响
                          </p>
                        </div>
                      </div>

                      {/* 技能需求 */}
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <p className="text-sm font-medium mb-2">急需技能:</p>
                        <div className="flex flex-wrap gap-2">
                          {dept.skillsNeeded.map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* 进度 */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">完成进度</span>
                          <span className="text-sm font-medium">15%</span>
                        </div>
                        <Progress value={15} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 结构优化 */}
        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-green-600" />
                人才结构优化建议
              </CardTitle>
              <CardDescription>
                优化人员结构，提升组织效能
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {planningData.structureOptimization.map((item, index) => (
                  <Card key={index} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{item.category}</h4>
                        <Badge variant="outline">{item.ratio}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">当前人数</p>
                          <p className="text-2xl font-bold">{item.current}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">建议人数</p>
                          <p className="text-2xl font-bold text-green-600">{item.recommended}</p>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg mb-3">
                        <p className="text-sm">
                          <span className="font-medium">建议:</span> {item.recommendation}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                        <span className="text-green-600 font-medium">{item.impact}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 成本效益 */}
        <TabsContent value="cost-benefit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-600" />
                成本效益分析
              </CardTitle>
              <CardDescription>
                人力规划的投资回报分析
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-blue-50 dark:bg-blue-950/20">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">总投入成本</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {planningData.costBenefit.totalCost}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">年度成本</p>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 dark:bg-green-950/20">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">预期收入增长</p>
                    <p className="text-2xl font-bold text-green-600">
                      {planningData.costBenefit.expectedRevenue}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">年度收入</p>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 dark:bg-purple-950/20">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">投资回报率</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {planningData.costBenefit.roi}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">ROI</p>
                  </CardContent>
                </Card>

                <Card className="bg-orange-50 dark:bg-orange-950/20">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">回收周期</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {planningData.costBenefit.paybackPeriod}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">预计回收时间</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <h4 className="text-lg font-semibold">投资建议</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">风险等级: {planningData.costBenefit.riskLevel === 'low' ? '低风险' : '中风险'}</p>
                  </div>
                </div>
                <p className="text-gray-900 dark:text-white">
                  基于当前数据分析，建议按照规划实施人力扩张。该投资具有较高的回报率和相对较短的投资回收期，
                  能够有效支持企业业务扩张和提升整体竞争力。
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 风险提示 */}
        <TabsContent value="risks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                风险提示与应对
              </CardTitle>
              <CardDescription>
                实施人力规划可能面临的风险及应对措施
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {planningData.risks.map((risk, index) => (
                  <Card key={index} className={
                    risk.level === 'high' ? 'border-red-200 dark:border-red-800' :
                    risk.level === 'medium' ? 'border-yellow-200 dark:border-yellow-800' :
                    'border-green-200 dark:border-green-800'
                  }>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          risk.level === 'high' ? 'bg-red-100 dark:bg-red-900' :
                          risk.level === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900' :
                          'bg-green-100 dark:bg-green-900'
                        }`}>
                          <AlertCircle className={`h-5 w-5 ${
                            risk.level === 'high' ? 'text-red-600' :
                            risk.level === 'medium' ? 'text-yellow-600' :
                            'text-green-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{risk.type}</h4>
                            <Badge className={
                              risk.level === 'high' ? 'bg-red-100 text-red-600' :
                              risk.level === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-green-100 text-green-600'
                            }>
                              {risk.level === 'high' ? '高风险' : risk.level === 'medium' ? '中风险' : '低风险'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {risk.description}
                          </p>
                          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                            <p className="text-sm">
                              <span className="font-medium text-blue-600">应对措施:</span> {risk.mitigation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 实施计划 */}
        <TabsContent value="implementation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-purple-600" />
                分阶段实施计划
              </CardTitle>
              <CardDescription>
                按阶段推进人力规划实施
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {planningData.implementationPlan.map((phase, index) => (
                  <div key={index} className="relative">
                    {/* 阶段标题 */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold">{phase.phase}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{phase.timeline}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">预算</p>
                          <p className="font-bold text-orange-600">{phase.budget}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">新增人员</p>
                          <p className="font-bold text-green-600">{phase.headcount}人</p>
                        </div>
                      </div>
                    </div>

                    {/* 阶段内容 */}
                    <div className="ml-16 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-sm font-medium mb-2">主要行动:</p>
                      <ul className="space-y-2">
                        {phase.actions.map((action, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 连接线 */}
                    {index < planningData.implementationPlan.length - 1 && (
                      <div className="absolute left-[23px] top-20 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="h-8 w-8 text-purple-600" />
                  <div>
                    <h4 className="text-lg font-semibold">立即开始实施</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">启动第一阶段招聘计划</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Sparkles className="h-4 w-4 mr-2" />
                    开始实施
                  </Button>
                  <Button variant="outline" onClick={() => toast.success('方案已保存')}>
                    <FileText className="h-4 w-4 mr-2" />
                    保存方案
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
