'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Briefcase,
  GraduationCap,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  Award,
  Zap,
  Activity,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  Maximize2,
  Settings,
  Filter,
  AlertCircle,
  CheckCircle,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon: any;
  description: string;
  color: string;
}

interface ChartData {
  name: string;
  value: number;
  change?: number;
}

export default function DataDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // 每30秒更新一次

    return () => clearInterval(interval);
  }, []);

  const metrics: MetricCard[] = [
    {
      title: '员工总数',
      value: 286,
      change: 12,
      trend: 'up',
      icon: Users,
      description: '较上月',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: '本月入职',
      value: 8,
      change: 20,
      trend: 'up',
      icon: Briefcase,
      description: '较上月',
      color: 'from-green-500 to-green-600',
    },
    {
      title: '离职率',
      value: '3.2%',
      change: -0.5,
      trend: 'down',
      icon: Activity,
      description: '较上月',
      color: 'from-red-500 to-red-600',
    },
    {
      title: '人效比',
      value: '1.85',
      change: 8,
      trend: 'up',
      icon: Target,
      description: '较上月',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: '薪酬总额',
      value: '¥1.25M',
      change: 15,
      trend: 'up',
      icon: DollarSign,
      description: '较上月',
      color: 'from-yellow-500 to-orange-600',
    },
    {
      title: '培训完成率',
      value: '92%',
      change: 5,
      trend: 'up',
      icon: GraduationCap,
      description: '较上月',
      color: 'from-pink-500 to-pink-600',
    },
  ];

  const recruitmentData: ChartData[] = [
    { name: '1月', value: 45 },
    { name: '2月', value: 52 },
    { name: '3月', value: 38 },
    { name: '4月', value: 65 },
    { name: '5月', value: 72 },
    { name: '6月', value: 58 },
    { name: '7月', value: 81 },
    { name: '8月', value: 94 },
    { name: '9月', value: 78 },
    { name: '10月', value: 86 },
    { name: '11月', value: 102 },
    { name: '12月', value: 115 },
  ];

  const performanceData: ChartData[] = [
    { name: '优秀(S)', value: 45, change: 8 },
    { name: '良好(A)', value: 128, change: -5 },
    { name: '合格(B)', value: 85, change: -3 },
    { name: '需改进(C)', value: 25, change: 0 },
    { name: '不合格(D)', value: 3, change: 0 },
  ];

  const departmentData: ChartData[] = [
    { name: '产品部', value: 42, change: 5 },
    { name: '技术部', value: 68, change: 12 },
    { name: '销售部', value: 55, change: -3 },
    { name: '市场部', value: 38, change: 8 },
    { name: '财务部', value: 25, change: 2 },
    { name: '人力资源部', value: 18, change: 0 },
    { name: '行政部', value: 22, change: 4 },
    { name: '运营部', value: 18, change: 6 },
  ];

  const efficiencyData: ChartData[] = [
    { name: '周一', value: 92 },
    { name: '周二', value: 95 },
    { name: '周三', value: 88 },
    { name: '周四', value: 91 },
    { name: '周五', value: 94 },
    { name: '周六', value: 45 },
    { name: '周日', value: 12 },
  ];

  const alerts = [
    { type: 'warning', message: '销售部本月离职率超过5%，请关注', time: '10分钟前' },
    { type: 'success', message: '技术部本月绩效目标达成率120%', time: '1小时前' },
    { type: 'info', message: '新员工入职培训将于下周一开班', time: '2小时前' },
    { type: 'warning', message: '产品部本月培训完成率仅75%', time: '3小时前' },
  ];

  const topPerformers = [
    { name: '张三', department: '产品部', score: 95, avatar: '张' },
    { name: '李四', department: '销售部', score: 94, avatar: '李' },
    { name: '王五', department: '技术部', score: 93, avatar: '王' },
    { name: '赵六', department: '市场部', score: 92, avatar: '赵' },
    { name: '钱七', department: '运营部', score: 91, avatar: '钱' },
  ];

  const renderMetricCard = (metric: MetricCard) => {
    const Icon = metric.icon;
    return (
      <Card key={metric.title} className="hover:shadow-lg transition-all">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {metric.title}
            </CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-br ${metric.color}`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {metric.value}
              </div>
              <div className="text-xs text-gray-500 mt-1">{metric.description}</div>
            </div>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {metric.trend === 'up' ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              <span>{Math.abs(metric.change)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderChart = (data: ChartData[], title: string, color: string) => {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>
            最后更新: {lastUpdated.toLocaleTimeString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.value}
                    </span>
                    {item.change !== undefined && (
                      <span
                        className={`text-xs ${
                          item.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {item.change >= 0 ? '+' : ''}
                        {item.change}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${color}`}
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPieChart = (data: ChartData[], title: string) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-yellow-500 to-yellow-600',
      'from-red-500 to-red-600',
      'from-purple-500 to-purple-600',
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>分布情况</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full bg-gradient-to-br ${colors[index % colors.length]}`}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.value}人
                  </span>
                  {item.change !== undefined && (
                    <span
                      className={`text-xs ${
                        item.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {item.change >= 0 ? '+' : ''}
                      {item.change}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-950 p-6 transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 overflow-auto' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                <BarChart3 className="h-7 w-7 text-white" />
              </div>
              数据大屏
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              实时数据可视化，关键指标一目了然
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white border-0">
              <Zap className="h-3 w-3 mr-1" />
              PRO功能
            </Badge>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">今日</SelectItem>
                <SelectItem value="week">本周</SelectItem>
                <SelectItem value="month">本月</SelectItem>
                <SelectItem value="quarter">本季度</SelectItem>
                <SelectItem value="year">本年</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setIsFullscreen(!isFullscreen)}>
              <Maximize2 className="h-4 w-4 mr-2" />
              {isFullscreen ? '退出全屏' : '全屏显示'}
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              刷新
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出
            </Button>
          </div>
        </div>

        {/* 核心指标卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metrics.map(renderMetricCard)}
        </div>

        {/* 功能Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              总览
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              绩效
            </TabsTrigger>
            <TabsTrigger value="recruitment" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              招聘
            </TabsTrigger>
            <TabsTrigger value="efficiency" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              人效
            </TabsTrigger>
          </TabsList>

          {/* 总览 */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderChart(departmentData, '部门人数分布', 'bg-blue-500')}
              {renderPieChart(performanceData, '绩效等级分布')}
              {renderChart(recruitmentData, '年度招聘趋势', 'bg-green-500')}
            </div>

            {/* 实时预警 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  实时预警
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        alert.type === 'warning'
                          ? 'bg-yellow-50 dark:bg-yellow-950/30'
                          : alert.type === 'success'
                          ? 'bg-green-50 dark:bg-green-950/30'
                          : 'bg-blue-50 dark:bg-blue-950/30'
                      }`}
                    >
                      {alert.type === 'warning' && (
                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      )}
                      {alert.type === 'success' && (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      )}
                      {alert.type === 'info' && (
                        <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 优秀员工 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  优秀员工
                </CardTitle>
                <CardDescription>本月绩效排名前5</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-5 gap-4">
                  {topPerformers.map((employee, index) => (
                    <Card key={index} className="text-center">
                      <CardContent className="pt-6">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">
                            {employee.avatar}
                          </span>
                        </div>
                        <div className="mb-2">
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            <Star className="h-3 w-3 mr-1" />
                            第{index + 1}名
                          </Badge>
                        </div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {employee.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">{employee.department}</p>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {employee.score}
                        </div>
                        <div className="text-xs text-gray-500">绩效评分</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 绩效 */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {renderPieChart(performanceData, '绩效等级分布')}
              {renderChart(departmentData, '部门绩效对比', 'bg-purple-500')}
            </div>
          </TabsContent>

          {/* 招聘 */}
          <TabsContent value="recruitment" className="space-y-6">
            {renderChart(recruitmentData, '年度招聘趋势', 'bg-blue-500')}
          </TabsContent>

          {/* 人效 */}
          <TabsContent value="efficiency" className="space-y-6">
            {renderChart(efficiencyData, '工作日人效趋势', 'bg-green-500')}
          </TabsContent>
        </Tabs>

        {/* 底部信息 */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>数据来源: PulseOpti HR 系统</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>最后更新: {lastUpdated.toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>自动刷新中</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
