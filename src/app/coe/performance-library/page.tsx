'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PageHeader, createProPageHeader } from '@/components/layout/page-header';
import {
  Target,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Plus,
  Copy,
  Edit,
  Trash2,
  Eye,
  Download,
  Zap,
  FileText,
  CheckCircle,
  Clock,
  Users,
  Award,
  PieChart,
  LineChart,
  Briefcase,
  Code,
  Megaphone,
  Settings,
  Lightbulb,
  Star,
} from 'lucide-react';

// KPI方案模板
const kpiTemplates = [
  {
    id: 1,
    name: '销售工程师KPI',
    department: '销售部',
    type: 'KPI',
    indicators: [
      { name: '销售额', weight: 40, target: '500万/季度', unit: '万元' },
      { name: '新客户数', weight: 25, target: '20个/季度', unit: '个' },
      { name: '客户满意度', weight: 20, target: '90分/季度', unit: '分' },
      { name: '回款率', weight: 15, target: '95%/季度', unit: '%' },
    ],
    cycle: '季度',
    usageCount: 125,
    avgScore: 85.5,
    isPopular: true,
  },
  {
    id: 2,
    name: '软件工程师KPI',
    department: '研发部',
    type: 'KPI',
    indicators: [
      { name: '代码质量', weight: 30, target: 'Bug率<5%', unit: '%' },
      { name: '项目交付', weight: 35, target: '准时率100%', unit: '%' },
      { name: '技术文档', weight: 20, target: '完整度90%', unit: '%' },
      { name: '团队协作', weight: 15, target: '满意度85分', unit: '分' },
    ],
    cycle: '季度',
    usageCount: 98,
    avgScore: 88.2,
    isPopular: true,
  },
  {
    id: 3,
    name: '市场专员KPI',
    department: '市场部',
    type: 'KPI',
    indicators: [
      { name: '线索转化', weight: 35, target: '转化率15%', unit: '%' },
      { name: '活动执行', weight: 30, target: '完成率100%', unit: '%' },
      { name: '品牌曝光', weight: 20, target: '增长50%', unit: '%' },
      { name: '预算控制', weight: 15, target: '偏差<5%', unit: '%' },
    ],
    cycle: '月度',
    usageCount: 67,
    avgScore: 82.7,
    isPopular: false,
  },
  {
    id: 4,
    name: '产品经理KPI',
    department: '产品部',
    type: 'KPI',
    indicators: [
      { name: '产品上线', weight: 30, target: '准时率100%', unit: '%' },
      { name: '用户增长', weight: 25, target: '增长20%', unit: '%' },
      { name: '需求响应', weight: 25, target: '响应时间<2天', unit: '天' },
      { name: '产品满意度', weight: 20, target: 'NPS>50', unit: '分' },
    ],
    cycle: '季度',
    usageCount: 89,
    avgScore: 86.0,
    isPopular: true,
  },
];

// OKR方案模板
const okrTemplates = [
  {
    id: 1,
    name: '研发部Q4 OKR',
    department: '研发部',
    type: 'OKR',
    objectives: [
      {
        title: '提升产品稳定性和性能',
        keyResults: [
          { target: '降低线上Bug率至<2%', progress: 75 },
          { target: '核心接口响应时间<200ms', progress: 60 },
          { target: '系统可用性达到99.9%', progress: 85 },
        ],
      },
      {
        title: '完成核心功能开发',
        keyResults: [
          { target: '完成5个新功能开发', progress: 80 },
          { target: '代码测试覆盖率>80%', progress: 70 },
        ],
      },
    ],
    cycle: '季度',
    usageCount: 45,
    completionRate: 72.5,
  },
  {
    id: 2,
    name: '销售部Q4 OKR',
    department: '销售部',
    type: 'OKR',
    objectives: [
      {
        title: '实现销售目标增长',
        keyResults: [
          { target: '季度销售额达到2000万', progress: 85 },
          { target: '新客户增长30%', progress: 65 },
          { target: '老客户续费率达到85%', progress: 90 },
        ],
      },
      {
        title: '提升团队销售能力',
        keyResults: [
          { target: '完成销售培训20场', progress: 100 },
          { target: '销售技能评估平均分>85', progress: 70 },
        ],
      },
    ],
    cycle: '季度',
    usageCount: 52,
    completionRate: 78.3,
  },
];

// 绩效数据分析
const performanceAnalysis = {
  scoreDistribution: [
    { range: '90-100分', count: 45, percentage: 9.3 },
    { range: '80-89分', count: 156, percentage: 32.2 },
    { range: '70-79分', count: 198, percentage: 40.8 },
    { range: '60-69分', count: 72, percentage: 14.9 },
    { range: '60分以下', count: 14, percentage: 2.9 },
  ],
  departmentComparison: [
    { department: '销售部', avgScore: 87.5, trend: 'up', change: 3.2 },
    { department: '研发部', avgScore: 88.2, trend: 'up', change: 2.1 },
    { department: '市场部', avgScore: 82.7, trend: 'down', change: -1.5 },
    { department: '产品部', avgScore: 86.0, trend: 'up', change: 1.8 },
    { department: '运营部', avgScore: 84.3, trend: 'stable', change: 0.0 },
    { department: '职能部', avgScore: 83.5, trend: 'up', change: 0.8 },
  ],
  monthlyTrend: [
    { month: '1月', avgScore: 84.2 },
    { month: '2月', avgScore: 84.8 },
    { month: '3月', avgScore: 85.3 },
    { month: '4月', avgScore: 85.0 },
    { month: '5月', avgScore: 85.8 },
    { month: '6月', avgScore: 86.2 },
  ],
};

export default function PerformanceLibraryPage() {
  const [activeTab, setActiveTab] = useState('kpi');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);

  // 过滤模板
  const filteredKpiTemplates = useMemo(() => {
    if (selectedDepartment === 'all') return kpiTemplates;
    return kpiTemplates.filter((template) => template.department === selectedDepartment);
  }, [selectedDepartment]);

  const filteredOkrTemplates = useMemo(() => {
    if (selectedDepartment === 'all') return okrTemplates;
    return okrTemplates.filter((template) => template.department === selectedDepartment);
  }, [selectedDepartment]);

  const getDepartmentIcon = (department: string) => {
    const icons: Record<string, any> = {
      '销售部': Briefcase,
      '研发部': Code,
      '市场部': Megaphone,
      '产品部': Target,
      '运营部': Settings,
      '职能部': Users,
    };
    return icons[department] || Users;
  };

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      '销售部': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      '研发部': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      '市场部': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      '产品部': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      '运营部': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      '职能部': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };
    return colors[department] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <PageHeader {...createProPageHeader({
        icon: Target,
        title: '绩效方案库',
        description: 'KPI/OKR模板库，快速创建绩效方案，数据分析驱动管理决策',
        extraActions: (
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出方案
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="h-4 w-4 mr-2" />
              创建新方案
            </Button>
          </div>
        )
      })} />

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>KPI方案</CardDescription>
            <CardTitle className="text-3xl">{kpiTemplates.length}</CardTitle>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Target className="h-3 w-3 mr-1" />
              个模板
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>OKR方案</CardDescription>
            <CardTitle className="text-3xl">{okrTemplates.length}</CardTitle>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Target className="h-3 w-3 mr-1" />
              个模板
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>方案使用</CardDescription>
            <CardTitle className="text-3xl">{kpiTemplates.reduce((sum, t) => sum + t.usageCount, 0) + okrTemplates.reduce((sum, t) => sum + t.usageCount, 0)}</CardTitle>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Users className="h-3 w-3 mr-1" />
              次使用
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>平均绩效</CardDescription>
            <CardTitle className="text-3xl">85.6</CardTitle>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              同比 +2.3%
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Tab导航 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="kpi">KPI方案库</TabsTrigger>
            <TabsTrigger value="okr">OKR方案库</TabsTrigger>
            <TabsTrigger value="analysis">绩效数据分析</TabsTrigger>
          </TabsList>

          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[180px]">
              <Users className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部部门</SelectItem>
              <SelectItem value="销售部">销售部</SelectItem>
              <SelectItem value="研发部">研发部</SelectItem>
              <SelectItem value="市场部">市场部</SelectItem>
              <SelectItem value="产品部">产品部</SelectItem>
              <SelectItem value="运营部">运营部</SelectItem>
              <SelectItem value="职能部">职能部</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI方案库 */}
        <TabsContent value="kpi" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {filteredKpiTemplates.map((template) => {
              const DeptIcon = getDepartmentIcon(template.department);
              return (
                <Card key={template.id} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${getDepartmentColor(template.department)}`}>
                          <DeptIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {template.cycle}
                            </Badge>
                            {template.isPopular && (
                              <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                热门
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {template.indicators.map((indicator, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium">{indicator.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 dark:text-gray-400">{indicator.target}</span>
                              <Badge variant="secondary" className="text-xs">
                                {indicator.weight}%
                              </Badge>
                            </div>
                          </div>
                          <Progress value={indicator.weight} className="h-1.5" />
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{template.usageCount}次使用</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          <span>均分{template.avgScore}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedTemplate(template);
                            setShowPreviewDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* OKR方案库 */}
        <TabsContent value="okr" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOkrTemplates.map((template) => {
              const DeptIcon = getDepartmentIcon(template.department);
              return (
                <Card key={template.id} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${getDepartmentColor(template.department)}`}>
                          <DeptIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {template.cycle}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{template.completionRate}%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          完成率
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {template.objectives.map((objective, objIndex) => (
                        <div key={objIndex} className="space-y-2">
                          <div className="font-medium text-sm flex items-center gap-2">
                            <Target className="h-4 w-4 text-blue-600" />
                            <span>目标 {objIndex + 1}: {objective.title}</span>
                          </div>
                          <div className="space-y-2 pl-6">
                            {objective.keyResults.map((kr, krIndex) => (
                              <div key={krIndex} className="space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    KR {krIndex + 1}: {kr.target}
                                  </span>
                                  <span className="font-medium">{kr.progress}%</span>
                                </div>
                                <Progress value={kr.progress} className="h-1.5" />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{template.usageCount}次使用</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* 绩效数据分析 */}
        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 绩效得分分布 */}
            <Card>
              <CardHeader>
                <CardTitle>绩效得分分布</CardTitle>
                <CardDescription>员工绩效得分区间分布情况</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {performanceAnalysis.scoreDistribution.map((item) => (
                    <div key={item.range}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{item.range}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.count} 人
                          </span>
                          <span className="text-sm font-bold">{item.percentage}%</span>
                        </div>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 部门对比 */}
            <Card>
              <CardHeader>
                <CardTitle>部门绩效对比</CardTitle>
                <CardDescription>各部门平均绩效得分对比</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {performanceAnalysis.departmentComparison.map((dept) => (
                    <div key={dept.department}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{dept.department}</span>
                        <div className="flex items-center gap-3">
                          {dept.trend === 'up' && (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          )}
                          {dept.trend === 'down' && (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          {dept.trend === 'stable' && (
                            <CheckCircle className="h-4 w-4 text-gray-600" />
                          )}
                          <span className="text-sm font-bold">{dept.avgScore}分</span>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              dept.change > 0
                                ? 'bg-green-100 text-green-800'
                                : dept.change < 0
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {dept.change > 0 ? '+' : ''}
                            {dept.change}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={dept.avgScore} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 月度趋势 */}
          <Card>
            <CardHeader>
              <CardTitle>绩效趋势分析</CardTitle>
              <CardDescription>近6个月平均绩效得分变化趋势</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {performanceAnalysis.monthlyTrend.map((data) => (
                  <div key={data.month} className="flex items-center gap-4">
                    <span className="w-16 text-sm font-medium">{data.month}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">平均绩效</span>
                        <span className="text-sm font-bold">{data.avgScore}分</span>
                      </div>
                      <Progress value={(data.avgScore / 100) * 100} className="h-2" />
                    </div>
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
                绩效改善建议
              </CardTitle>
              <CardDescription>基于数据分析的改进建议</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">目标管理</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    建议为各部门制定更明确的绩效目标，提高目标达成率
                  </p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="font-medium">培训赋能</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    针对低分员工开展专项培训，提升整体绩效水平
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">激励机制</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    优化绩效激励方案，激发员工积极性和创造力
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 预览对话框 */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              方案详情预览
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">部门</div>
                  <div className="font-medium">{selectedTemplate.department}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">考核周期</div>
                  <div className="font-medium">{selectedTemplate.cycle}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">使用次数</div>
                  <div className="font-medium">{selectedTemplate.usageCount}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">平均得分</div>
                  <div className="font-medium">{selectedTemplate.avgScore}</div>
                </div>
              </div>

              {selectedTemplate.indicators && (
                <div>
                  <h3 className="font-medium mb-3">KPI指标</h3>
                  <div className="space-y-3">
                    {selectedTemplate.indicators.map((indicator: any, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{indicator.name}</span>
                          <Badge variant="secondary">{indicator.weight}%</Badge>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          目标：{indicator.target}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTemplate.objectives && (
                <div>
                  <h3 className="font-medium mb-3">OKR目标</h3>
                  <div className="space-y-4">
                    {selectedTemplate.objectives.map((objective: any, objIndex: number) => (
                      <div key={objIndex} className="space-y-2">
                        <div className="font-medium">目标 {objIndex + 1}: {objective.title}</div>
                        <div className="space-y-2 pl-4">
                          {objective.keyResults.map((kr: any, krIndex: number) => (
                            <div key={krIndex} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                KR {krIndex + 1}: {kr.target}
                              </span>
                              <span className="font-medium">{kr.progress}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
                  关闭
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Copy className="h-4 w-4 mr-2" />
                  复制此方案
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
