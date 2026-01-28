'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Zap,
  Crown,
  ArrowUp,
  ArrowDown,
  BarChart3,
  LineChart,
  PieChart,
  CheckCircle,
  AlertCircle,
  Star,
  Award,
  Calendar,
  Download,
} from 'lucide-react';

interface EfficiencyMetric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon: any;
  color: string;
  description: string;
}

interface ImprovementOpportunity {
  id: string;
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  priority: 'high' | 'medium' | 'low';
  expectedROI: string;
}

// 人效数据
const EFFICIENCY_DATA = {
  // 关键指标
  metrics: {
    revenuePerEmployee: {
      label: '人均产值',
      value: '¥125,000',
      change: 15.2,
      trend: 'up' as const,
      icon: DollarSign,
      color: 'from-green-500 to-teal-600',
      description: '较上月提升15.2%，行业平均¥98,000',
    },
    profitPerEmployee: {
      label: '人均利润',
      value: '¥35,000',
      change: 12.8,
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'from-blue-500 to-indigo-600',
      description: '较上月提升12.8%，行业平均¥28,000',
    },
    turnoverRate: {
      label: '员工流失率',
      value: '3.2%',
      change: -0.8,
      trend: 'down' as const,
      icon: Users,
      color: 'from-purple-500 to-pink-600',
      description: '较上月降低0.8%，行业平均5.5%',
    },
    timeToHire: {
      label: '招聘周期',
      value: '28天',
      change: -18.5,
      trend: 'down' as const,
      icon: Target,
      color: 'from-orange-500 to-red-600',
      description: '较上月缩短18.5%，行业平均35天',
    },
  },

  // 改进机会
  opportunities: [
    {
      id: '1',
      title: '优化招聘流程',
      description: '引入AI简历筛选和智能面试，预计缩短招聘周期40%',
      impact: '显著缩短招聘周期，降低招聘成本',
      effort: 'medium',
      priority: 'high',
      expectedROI: '提升招聘效率40%，年节省成本¥500,000',
    },
    {
      id: '2',
      title: '培训效果提升',
      description: '实施个性化培训推荐，预计培训转化率提升30%',
      impact: '提升培训效果，降低培训成本',
      effort: 'low',
      priority: 'high',
      expectedROI: '提升培训效果30%，年节省成本¥300,000',
    },
    {
      id: '3',
      title: '绩效激励优化',
      description: '实施精准绩效考核，预计员工绩效提升15%',
      impact: '提升员工积极性，提升整体绩效',
      effort: 'medium',
      priority: 'medium',
      expectedROI: '提升整体绩效15%，年增加收入¥2,000,000',
    },
    {
      id: '4',
      title: '流失率预警',
      description: '建立员工流失预警机制，预计降低流失率50%',
      impact: '降低员工流失，减少招聘成本',
      effort: 'high',
      priority: 'medium',
      expectedROI: '降低流失率50%，年节省成本¥800,000',
    },
  ],

  // 部门人效对比
  departmentEfficiency: [
    { name: '技术部', revenuePerEmployee: 180000, profitPerEmployee: 55000, turnoverRate: 2.5 },
    { name: '销售部', revenuePerEmployee: 220000, profitPerEmployee: 65000, turnoverRate: 4.2 },
    { name: '产品部', revenuePerEmployee: 150000, profitPerEmployee: 40000, turnoverRate: 3.0 },
    { name: '市场部', revenuePerEmployee: 140000, profitPerEmployee: 35000, turnoverRate: 3.8 },
    { name: '运营部', revenuePerEmployee: 120000, profitPerEmployee: 30000, turnoverRate: 2.8 },
    { name: '人力资源部', revenuePerEmployee: 80000, profitPerEmployee: 20000, turnoverRate: 1.5 },
  ],

  // 历史趋势
  historicalTrend: {
    revenue: [95000, 98000, 102000, 105000, 108000, 110000, 112000, 115000, 118000, 120000, 123000, 125000],
    profit: [26000, 27000, 28000, 29000, 30000, 31000, 32000, 32500, 33500, 34000, 34500, 35000],
    turnover: [5.5, 5.2, 4.8, 4.5, 4.2, 4.0, 3.8, 3.6, 3.5, 3.4, 3.3, 3.2],
    hire: [42, 40, 38, 36, 35, 34, 33, 32, 31, 30, 29, 28],
  },

  // 行业对比
  industryComparison: {
    revenuePerEmployee: { current: 125000, industry: 98000, top10: 150000 },
    profitPerEmployee: { current: 35000, industry: 28000, top10: 45000 },
    turnoverRate: { current: 3.2, industry: 5.5, top10: 2.5 },
    timeToHire: { current: 28, industry: 35, top10: 22 },
  },
};

const EFFORT_CONFIG = {
  low: { label: '低', color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' },
  medium: { label: '中', color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400' },
  high: { label: '高', color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' },
};

const PRIORITY_CONFIG = {
  high: { label: '高', color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' },
  medium: { label: '中', color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400' },
  low: { label: '低', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
};

// 类型守卫函数
const isValidPriority = (value: string): value is keyof typeof PRIORITY_CONFIG => {
  return value in PRIORITY_CONFIG;
};

const isValidEffort = (value: string): value is keyof typeof EFFORT_CONFIG => {
  return value in EFFORT_CONFIG;
};

export default function EfficiencyAnalysisPage() {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              核心分析
            </Badge>
            <span className="text-sm text-gray-500">
              数据实时更新 · 上次更新: {new Date().toLocaleString('zh-CN')}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            人效分析
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            全面分析企业人力资源效率，提升组织竞争力
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="时间范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">本周</SelectItem>
              <SelectItem value="month">本月</SelectItem>
              <SelectItem value="quarter">本季度</SelectItem>
              <SelectItem value="year">本年</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            导出报告
          </Button>
        </div>
      </div>

      {/* PRO功能提示 */}
      <Alert className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
        <Crown className="h-4 w-4 text-purple-600" />
        <AlertTitle className="flex items-center gap-2">
          <span>升级PRO，解锁高级人效分析功能</span>
          <Badge className="bg-purple-600 text-white">PRO</Badge>
        </AlertTitle>
        <AlertDescription className="mt-2">
          PRO版本提供AI智能分析、行业基准对比、自动优化建议等高级功能，帮助企业持续提升人效。
          <Button variant="link" className="p-0 h-auto text-purple-600 dark:text-purple-400">
            立即升级 →
          </Button>
        </AlertDescription>
      </Alert>

      {/* 关键指标 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(EFFICIENCY_DATA.metrics).map(([key, metric]) => {
          const Icon = metric.icon;
          return (
            <Card key={key} className="border-2 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${metric.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${
                      metric.trend === 'up'
                        ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                        : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                    }`}
                  >
                    {metric.trend === 'up' ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(metric.change)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {metric.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {metric.description}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 改进机会 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            人效提升机会
          </CardTitle>
          <CardDescription>
            基于数据分析，为您提供可执行的人效提升建议
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {EFFICIENCY_DATA.opportunities.map((opportunity) => {
              const priorityConfig = isValidPriority(opportunity.priority)
                ? PRIORITY_CONFIG[opportunity.priority]
                : PRIORITY_CONFIG.medium;
              const effortConfig = isValidEffort(opportunity.effort)
                ? EFFORT_CONFIG[opportunity.effort]
                : EFFORT_CONFIG.medium;

              return (
                <div
                  key={opportunity.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {opportunity.title}
                        </h4>
                        <Badge className={priorityConfig.color}>
                          {priorityConfig.label}优先级
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {opportunity.description}
                      </p>
                      <div className="flex items-center gap-3">
                        <Badge className={effortConfig.color}>
                          实施难度: {effortConfig.label}
                        </Badge>
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                          {opportunity.expectedROI}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <Button variant="outline" size="sm">
                        查看详情
                      </Button>
                      <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                        立即实施
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 部门人效对比 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              部门人均产值对比
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {EFFICIENCY_DATA.departmentEfficiency.map((dept) => (
                <div key={dept.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {dept.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ¥{dept.revenuePerEmployee.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={(dept.revenuePerEmployee / 220000) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-green-600" />
              部门流失率对比
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {EFFICIENCY_DATA.departmentEfficiency.map((dept) => (
                <div key={dept.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {dept.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {dept.turnoverRate}%
                    </span>
                  </div>
                  <Progress
                    value={(dept.turnoverRate / 5.5) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 行业对比 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            行业基准对比
          </CardTitle>
          <CardDescription>
            您的企业在行业中的表现对比
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(EFFICIENCY_DATA.industryComparison).map(([key, data]) => (
              <div key={key} className="border rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {key === 'revenuePerEmployee' && '人均产值'}
                  {key === 'profitPerEmployee' && '人均利润'}
                  {key === 'turnoverRate' && '流失率'}
                  {key === 'timeToHire' && '招聘周期'}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">当前</span>
                    <span className="text-sm font-semibold text-blue-600">
                      {key === 'turnoverRate' || key === 'timeToHire' ? data.current : '¥' + data.current.toLocaleString()}
                      {key === 'turnoverRate' && '%'}
                      {key === 'timeToHire' && '天'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">行业平均</span>
                    <span className="text-sm text-gray-600">
                      {key === 'turnoverRate' || key === 'timeToHire' ? data.industry : '¥' + data.industry.toLocaleString()}
                      {key === 'turnoverRate' && '%'}
                      {key === 'timeToHire' && '天'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">行业前10%</span>
                    <span className="text-sm text-green-600 font-semibold">
                      {key === 'turnoverRate' || key === 'timeToHire' ? data.top10 : '¥' + data.top10.toLocaleString()}
                      {key === 'turnoverRate' && '%'}
                      {key === 'timeToHire' && '天'}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t">
                  {data.current > data.industry ? (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle className="h-4 w-4" />
                      <span>高于行业平均</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-orange-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>低于行业平均</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
