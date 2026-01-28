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
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Star,
  Crown,
  Award,
  Shield,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
  Grid3x3,
  UserCheck,
  UserX,
  UserCog,
  Building2,
  Briefcase,
  Flame,
  IceCream,
  Rocket,
  Download,
  Lightbulb,
} from 'lucide-react';

// 九宫格数据
const nineBoxData = {
  boxes: [
    {
      position: [0, 0],
      title: '问题员工',
      description: '绩效低、潜力低',
      color: 'bg-red-100 dark:bg-red-950/30 border-red-200 dark:border-red-900',
      textColor: 'text-red-800 dark:text-red-200',
      employees: [
        { id: 1, name: '张三', position: '销售专员', dept: '销售部', score: 58, potential: 2 },
        { id: 2, name: '李四', position: '测试工程师', dept: '研发部', score: 55, potential: 3 },
      ],
      count: 2,
    },
    {
      position: [0, 1],
      title: '需要培养',
      description: '绩效低、潜力中',
      color: 'bg-orange-100 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900',
      textColor: 'text-orange-800 dark:text-orange-200',
      employees: [
        { id: 3, name: '王五', position: '产品专员', dept: '产品部', score: 62, potential: 6 },
        { id: 4, name: '赵六', position: 'UI设计师', dept: '研发部', score: 60, potential: 7 },
      ],
      count: 2,
    },
    {
      position: [0, 2],
      title: '高潜力员工',
      description: '绩效低、潜力高',
      color: 'bg-yellow-100 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900',
      textColor: 'text-yellow-800 dark:text-yellow-200',
      employees: [
        { id: 5, name: '钱七', position: '前端工程师', dept: '研发部', score: 68, potential: 8 },
      ],
      count: 1,
    },
    {
      position: [1, 0],
      title: '中坚力量',
      description: '绩效中、潜力低',
      color: 'bg-blue-100 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900',
      textColor: 'text-blue-800 dark:text-blue-200',
      employees: [
        { id: 6, name: '孙八', position: '销售经理', dept: '销售部', score: 75, potential: 3 },
        { id: 7, name: '周九', position: '运营专员', dept: '运营部', score: 72, potential: 4 },
      ],
      count: 2,
    },
    {
      position: [1, 1],
      title: '骨干员工',
      description: '绩效中、潜力中',
      color: 'bg-green-100 dark:bg-green-950/30 border-green-200 dark:border-green-900',
      textColor: 'text-green-800 dark:text-green-200',
      employees: [
        { id: 8, name: '吴十', position: '后端工程师', dept: '研发部', score: 78, potential: 6 },
        { id: 9, name: '郑十一', position: '市场专员', dept: '市场部', score: 76, potential: 7 },
        { id: 10, name: '冯十二', position: '客服专员', dept: '客服部', score: 74, potential: 5 },
      ],
      count: 3,
    },
    {
      position: [1, 2],
      title: '核心人才',
      description: '绩效中、潜力高',
      color: 'bg-purple-100 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900',
      textColor: 'text-purple-800 dark:text-purple-200',
      employees: [
        { id: 11, name: '陈十三', position: '算法工程师', dept: '研发部', score: 82, potential: 8 },
        { id: 12, name: '楚十四', position: '产品经理', dept: '产品部', score: 80, potential: 9 },
      ],
      count: 2,
    },
    {
      position: [2, 0],
      title: '资深员工',
      description: '绩效高、潜力低',
      color: 'bg-cyan-100 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-900',
      textColor: 'text-cyan-800 dark:text-cyan-200',
      employees: [
        { id: 13, name: '卫十五', position: '资深销售', dept: '销售部', score: 88, potential: 3 },
        { id: 14, name: '蒋十六', position: '架构师', dept: '研发部', score: 90, potential: 4 },
      ],
      count: 2,
    },
    {
      position: [2, 1],
      title: '优秀员工',
      description: '绩效高、潜力中',
      color: 'bg-indigo-100 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900',
      textColor: 'text-indigo-800 dark:text-indigo-200',
      employees: [
        { id: 15, name: '沈十七', position: '销售总监', dept: '销售部', score: 92, potential: 6 },
        { id: 16, name: '韩十八', position: '技术经理', dept: '研发部', score: 91, potential: 7 },
        { id: 17, name: '杨十九', position: '市场总监', dept: '市场部', score: 89, potential: 6 },
      ],
      count: 3,
    },
    {
      position: [2, 2],
      title: '超级明星',
      description: '绩效高、潜力高',
      color: 'bg-pink-100 dark:bg-pink-950/30 border-pink-200 dark:border-pink-900',
      textColor: 'text-pink-800 dark:text-pink-200',
      employees: [
        { id: 18, name: '朱二十', position: 'CTO', dept: '研发部', score: 95, potential: 9 },
        { id: 19, name: '秦二十一', position: 'CEO', dept: '总办', score: 98, potential: 10 },
      ],
      count: 2,
    },
  ],
};

// 继任者计划数据
const successionPlanData = [
  {
    position: '技术总监',
    department: '研发部',
    incumbent: { name: '朱二十', tenure: '3年', performance: 95 },
    successors: [
      { name: '蒋十六', position: '架构师', readiness: '90%', gap: '领导力', timeToReady: '6个月' },
      { name: '沈十七', position: '技术经理', readiness: '85%', gap: '战略思维', timeToReady: '9个月' },
    ],
    risk: '低',
  },
  {
    position: '销售总监',
    department: '销售部',
    incumbent: { name: '沈十七', tenure: '5年', performance: 92 },
    successors: [
      { name: '孙八', position: '销售经理', readiness: '75%', gap: '团队管理', timeToReady: '12个月' },
      { name: '卫十五', position: '资深销售', readiness: '70%', gap: '战略规划', timeToReady: '18个月' },
    ],
    risk: '中',
  },
  {
    position: '产品总监',
    department: '产品部',
    incumbent: { name: '楚十四', tenure: '2年', performance: 88 },
    successors: [
      { name: '吴十', position: '后端工程师', readiness: '65%', gap: '产品思维', timeToReady: '24个月' },
    ],
    risk: '高',
  },
];

// 人才流失预警
const attritionRiskData = [
  {
    id: 1,
    name: '张三',
    position: '销售专员',
    department: '销售部',
    tenure: '8个月',
    performance: 58,
    riskLevel: 'high',
    riskFactors: ['绩效低', '薪资竞争力不足', '晋升受阻'],
    lastPromotion: '无',
    marketMatch: '30%',
    retentionAction: '绩效改进计划',
  },
  {
    id: 2,
    name: '李四',
    position: '测试工程师',
    department: '研发部',
    tenure: '1.5年',
    performance: 55,
    riskLevel: 'high',
    riskFactors: ['职业发展受限', '技能提升需求', '团队氛围'],
    lastPromotion: '无',
    marketMatch: '25%',
    retentionAction: '技能培训',
  },
  {
    id: 3,
    name: '王五',
    position: '产品专员',
    department: '产品部',
    tenure: '2年',
    performance: 62,
    riskLevel: 'medium',
    riskFactors: ['薪资竞争力', '工作负荷'],
    lastPromotion: '无',
    marketMatch: '40%',
    retentionAction: '薪资调整',
  },
  {
    id: 4,
    name: '陈十三',
    position: '算法工程师',
    department: '研发部',
    tenure: '3年',
    performance: 82,
    riskLevel: 'medium',
    riskFactors: ['晋升机会', '技术挑战'],
    lastPromotion: '1年前',
    marketMatch: '70%',
    retentionAction: '晋升通道',
  },
];

// 关键人才画像
const keyTalentData = [
  {
    id: 1,
    name: '朱二十',
    position: 'CTO',
    department: '研发部',
    tier: 'S',
    skills: ['架构设计', '技术战略', '团队管理', '创新思维'],
    strengths: ['技术专长', '领导力', '战略眼光', '影响力'],
    developmentAreas: ['商业思维', '外部关系'],
    careerPath: '技术副总',
    potentialScore: 9,
  },
  {
    id: 2,
    name: '秦二十一',
    position: 'CEO',
    department: '总办',
    tier: 'S',
    skills: ['战略规划', '团队建设', '融资能力', '创新决策'],
    strengths: ['战略思维', '执行力', '沟通能力', '领导力'],
    developmentAreas: ['细节管理'],
    careerPath: '行业领袖',
    potentialScore: 10,
  },
  {
    id: 3,
    name: '沈十七',
    position: '销售总监',
    department: '销售部',
    tier: 'A',
    skills: ['销售管理', '团队激励', '客户关系', '业绩达成'],
    strengths: ['业绩导向', '团队领导', '市场洞察'],
    developmentAreas: ['战略思维', '数字化转型'],
    careerPath: '事业部总经理',
    potentialScore: 8,
  },
];

export default function TalentDiagnosisPage() {
  const [activeTab, setActiveTab] = useState('ninebox');
  const [selectedBox, setSelectedBox] = useState<any>(null);
  const [showEmployeeDetail, setShowEmployeeDetail] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState<any>(null);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'high':
        return '高风险';
      case 'medium':
        return '中风险';
      case 'low':
        return '低风险';
      default:
        return '未知';
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <PageHeader {...createProPageHeader({
        icon: Users,
        title: '组织人才诊断',
        description: '九宫格人才盘点、继任者计划、流失预警，全方位诊断组织人才状况',
        extraActions: (
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出报告
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Zap className="h-4 w-4 mr-2" />
              AI智能诊断
            </Button>
          </div>
        )
      })} />

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>员工总数</CardDescription>
            <CardTitle className="text-3xl">485</CardTitle>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              较上季度 +12人
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>核心人才</CardDescription>
            <CardTitle className="text-3xl">42</CardTitle>
            <div className="flex items-center text-xs text-purple-600 mt-1">
              <Star className="h-3 w-3 mr-1" />
              占比 8.7%
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>高风险员工</CardDescription>
            <CardTitle className="text-3xl text-red-600">{attritionRiskData.length}</CardTitle>
            <div className="flex items-center text-xs text-red-600 mt-1">
              <AlertTriangle className="h-3 w-3 mr-1" />
              需要关注
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>继任者覆盖</CardDescription>
            <CardTitle className="text-3xl text-blue-600">75%</CardTitle>
            <div className="flex items-center text-xs text-blue-600 mt-1">
              <Shield className="h-3 w-3 mr-1" />
              关键岗位
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Tab导航 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full max-w-lg grid-cols-4">
          <TabsTrigger value="ninebox">九宫格盘点</TabsTrigger>
          <TabsTrigger value="succession">继任者计划</TabsTrigger>
          <TabsTrigger value="attrition">流失预警</TabsTrigger>
          <TabsTrigger value="keytalent">关键人才</TabsTrigger>
        </TabsList>

        {/* 九宫格人才盘点 */}
        <TabsContent value="ninebox" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid3x3 className="h-5 w-5" />
                九宫格人才盘点
              </CardTitle>
              <CardDescription>
                按绩效（Y轴）和潜力（X轴）将员工分为9个区域，点击区域查看详细员工列表
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {nineBoxData.boxes.map((box, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedBox(box);
                      setShowEmployeeDetail(true);
                    }}
                    className={`p-4 rounded-lg border-2 cursor-pointer hover:shadow-lg transition-all ${box.color}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-bold text-lg ${box.textColor}`}>{box.title}</h3>
                      <Badge className={box.textColor}>{box.count}人</Badge>
                    </div>
                    <p className={`text-sm ${box.textColor} opacity-80 mb-2`}>{box.description}</p>
                    {box.employees.length > 0 && (
                      <div className="flex items-center gap-2 text-xs opacity-70">
                        <Users className="h-3 w-3" />
                        <span>点击查看详情</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 图例说明 */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">坐标轴说明</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                    <span>
                      <strong>Y轴（绩效）</strong>：从下到上绩效逐渐提高，基于最近一次绩效评估得分
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                    <span>
                      <strong>X轴（潜力）</strong>：从左到右潜力逐渐提高，基于能力模型评估
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 员工详情对话框 */}
          {showEmployeeDetail && selectedBox && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {selectedBox.title} - 员工列表
                    </CardTitle>
                    <CardDescription>{selectedBox.description}</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEmployeeDetail(false)}
                  >
                    关闭
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedBox.employees.map((employee: any) => (
                    <div
                      key={employee.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                          {employee.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {employee.position} · {employee.dept}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-sm text-gray-600 dark:text-gray-400">绩效</div>
                          <div className="font-bold">{employee.score}分</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600 dark:text-gray-400">潜力</div>
                          <div className="font-bold">{employee.potential}分</div>
                        </div>
                        <Button variant="ghost" size="sm">
                          查看详情
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 针对性建议 */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                    针对该群体的管理建议
                  </h4>
                  {selectedBox.title === '超级明星' && (
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• 重点保留，提供更具竞争力的薪酬和晋升通道</li>
                      <li>• 提供更多的挑战性项目和发展机会</li>
                      <li>• 考虑股权激励等长期激励措施</li>
                    </ul>
                  )}
                  {selectedBox.title === '问题员工' && (
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• 制定绩效改进计划（PIP），明确改进目标和期限</li>
                      <li>• 提供针对性的培训和辅导</li>
                      <li>• 评估是否适合转岗或需要淘汰</li>
                    </ul>
                  )}
                  {selectedBox.title === '高潜力员工' && (
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• 关注绩效提升，分析绩效未达标的原因</li>
                      <li>• 提供导师指导和经验分享</li>
                      <li>• 给予更多实践机会和试错空间</li>
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 继任者计划 */}
        <TabsContent value="succession" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {successionPlanData.map((plan, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-yellow-600" />
                        {plan.position}
                      </CardTitle>
                      <CardDescription>{plan.department}</CardDescription>
                    </div>
                    <Badge className={
                      plan.risk === '高'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-200'
                        : plan.risk === '中'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-200'
                    }>
                      {plan.risk === '高' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {plan.risk === '中' && <Clock className="h-3 w-3 mr-1" />}
                      {plan.risk === '低' && <Shield className="h-3 w-3 mr-1" />}
                      {plan.risk}风险
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* 现任者 */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                          {plan.incumbent.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{plan.incumbent.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            现任者 · 在职 {plan.incumbent.tenure}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-400">绩效得分</div>
                        <div className="text-2xl font-bold">{plan.incumbent.performance}</div>
                      </div>
                    </div>
                  </div>

                  {/* 继任者 */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      继任者计划
                    </h4>
                    <div className="space-y-3">
                      {plan.successors.map((successor, sIndex) => (
                        <div
                          key={sIndex}
                          className="p-4 border rounded-lg hover:shadow-md transition-all"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold">
                                {successor.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium">{successor.name}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {successor.position}
                                </div>
                              </div>
                            </div>
                            <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                              就绪度 {successor.readiness}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <div className="text-gray-600 dark:text-gray-400">能力差距</div>
                              <div className="font-medium">{successor.gap}</div>
                            </div>
                            <div>
                              <div className="text-gray-600 dark:text-gray-400">预计就绪</div>
                              <div className="font-medium">{successor.timeToReady}</div>
                            </div>
                          </div>

                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">就绪度</span>
                              <span className="text-sm font-bold">{successor.readiness}</span>
                            </div>
                            <Progress value={parseInt(successor.readiness)} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 人才流失预警 */}
        <TabsContent value="attrition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                人才流失预警
              </CardTitle>
              <CardDescription>基于绩效、市场匹配度、晋升机会等多维度分析的高风险员工</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attritionRiskData.map((employee) => (
                  <div
                    key={employee.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-white font-bold">
                          {employee.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {employee.position} · {employee.department} · 在职{employee.tenure}
                          </div>
                        </div>
                      </div>
                      <Badge className={getRiskColor(employee.riskLevel)}>
                        {employee.riskLevel === 'high' && <Flame className="h-3 w-3 mr-1" />}
                        {employee.riskLevel === 'medium' && <Clock className="h-3 w-3 mr-1" />}
                        {getRiskLabel(employee.riskLevel)}
                      </Badge>
                    </div>

                    {/* 风险因素 */}
                    <div className="mb-3">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">风险因素</div>
                      <div className="flex flex-wrap gap-2">
                        {employee.riskFactors.map((factor, index) => (
                          <Badge key={index} variant="outline">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* 数据详情 */}
                    <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                      <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">
                        <div className="text-gray-600 dark:text-gray-400">绩效</div>
                        <div className={`font-bold ${employee.performance < 60 ? 'text-red-600' : ''}`}>
                          {employee.performance}分
                        </div>
                      </div>
                      <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">
                        <div className="text-gray-600 dark:text-gray-400">市场匹配</div>
                        <div className={`font-bold ${Number(employee.marketMatch) < 40 ? 'text-red-600' : ''}`}>
                          {employee.marketMatch}
                        </div>
                      </div>
                      <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">
                        <div className="text-gray-600 dark:text-gray-400">上次晋升</div>
                        <div className="font-bold">{employee.lastPromotion}</div>
                      </div>
                    </div>

                    {/* 挽留措施 */}
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Shield className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">建议措施：</span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {employee.retentionAction}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">
                          查看详情
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 关键人才 */}
        <TabsContent value="keytalent" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keyTalentData.map((talent) => (
              <Card key={talent.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                        {talent.name.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {talent.name}
                          {talent.tier === 'S' && (
                            <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
                              <Star className="h-3 w-3 mr-1" />
                              S级人才
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {talent.position} · {talent.department}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      潜力 {talent.potentialScore}/10
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* 技能 */}
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">核心技能</div>
                    <div className="flex flex-wrap gap-2">
                      {talent.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 优势 */}
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">核心优势</div>
                    <div className="flex flex-wrap gap-2">
                      {talent.strengths.map((strength, index) => (
                        <Badge key={index} className="bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 发展领域 */}
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">发展领域</div>
                    <div className="flex flex-wrap gap-2">
                      {talent.developmentAreas.map((area, index) => (
                        <Badge key={index} variant="outline">
                          <ArrowRight className="h-3 w-3 mr-1" />
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 职业路径 */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Rocket className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">目标路径：</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {talent.careerPath}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">
                        查看详情
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
