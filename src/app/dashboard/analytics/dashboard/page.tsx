'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Briefcase,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  GraduationCap,
  Target,
  Award,
  Calendar,
  RefreshCw,
  Download,
  Settings,
  Fullscreen,
  Crown,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Building,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react';
import { toast } from 'sonner';

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'stable';
  icon: any;
  color: string;
  description: string;
}

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export default function AnalyticsDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');

  const metrics: MetricCard[] = [
    {
      title: '员工总数',
      value: 156,
      change: 12,
      changeType: 'increase',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      description: '在职员工数量'
    },
    {
      title: '本月入职',
      value: 8,
      change: 3,
      changeType: 'increase',
      icon: Briefcase,
      color: 'from-green-500 to-green-600',
      description: '本月新入职员工'
    },
    {
      title: '本月离职',
      value: 3,
      change: -2,
      changeType: 'decrease',
      icon: ArrowDown,
      color: 'from-red-500 to-red-600',
      description: '本月离职员工'
    },
    {
      title: '离职率',
      value: '1.92%',
      change: -0.5,
      changeType: 'decrease',
      icon: TrendingDown,
      color: 'from-orange-500 to-orange-600',
      description: '月度离职率'
    },
    {
      title: '平均考勤率',
      value: '98.5%',
      change: 0.2,
      changeType: 'increase',
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      description: '员工平均出勤率'
    },
    {
      title: '培训覆盖率',
      value: '85.3%',
      change: 5.2,
      changeType: 'increase',
      icon: GraduationCap,
      color: 'from-pink-500 to-pink-600',
      description: '完成培训的员工占比'
    },
    {
      title: '人均产值',
      value: '¥85,000',
      change: 8.5,
      changeType: 'increase',
      icon: DollarSign,
      color: 'from-teal-500 to-teal-600',
      description: '员工月均创造价值'
    },
    {
      title: '人效指数',
      value: '92.3',
      change: 3.1,
      changeType: 'increase',
      icon: Target,
      color: 'from-indigo-500 to-indigo-600',
      description: '人力资源效能指数'
    },
  ];

  const departmentDistribution: ChartData[] = [
    { name: '技术部', value: 42, color: '#3B82F6' },
    { name: '销售部', value: 35, color: '#10B981' },
    { name: '市场部', value: 28, color: '#F59E0B' },
    { name: '人力资源部', value: 18, color: '#8B5CF6' },
    { name: '财务部', value: 15, color: '#EF4444' },
    { name: '运营部', value: 12, color: '#06B6D4' },
    { name: '其他', value: 6, color: '#6B7280' },
  ];

  const performanceDistribution: ChartData[] = [
    { name: 'S级 (卓越)', value: 12, color: '#8B5CF6' },
    { name: 'A级 (优秀)', value: 35, color: '#3B82F6' },
    { name: 'B级 (良好)', value: 68, color: '#10B981' },
    { name: 'C级 (合格)', value: 32, color: '#F59E0B' },
    { name: 'D级 (待改进)', value: 9, color: '#EF4444' },
  ];

  const talentPool: ChartData[] = [
    { name: '明星员工', value: 15, color: '#8B5CF6' },
    { name: '业务专家', value: 25, color: '#3B82F6' },
    { name: '潜力人才', value: 28, color: '#10B981' },
    { name: '核心贡献者', value: 42, color: '#06B6D4' },
    { name: '稳定骨干', value: 32, color: '#F59E0B' },
    { name: '需要改进', value: 14, color: '#EF4444' },
  ];

  const recruitmentProgress = [
    { stage: '岗位发布', completed: 45, total: 45 },
    { stage: '简历筛选', completed: 120, total: 200 },
    { stage: '面试安排', completed: 35, total: 80 },
    { stage: 'Offer发放', completed: 15, total: 25 },
  ];

  useEffect(() => {
    // 模拟加载动画
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
    toast.success('数据已刷新');
  };

  const handleExport = () => {
    toast.success('数据导出成功');
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const renderChangeIcon = (changeType: string, change: number) => {
    if (changeType === 'increase') {
      return <ArrowUp className="h-3 w-3 text-green-600" />;
    } else if (changeType === 'decrease') {
      return <ArrowDown className="h-3 w-3 text-red-600" />;
    } else {
      return <Minus className="h-3 w-3 text-gray-600" />;
    }
  };

  const renderChangeText = (changeType: string, change: number) => {
    if (changeType === 'increase') {
      return <span className="text-green-600 text-sm">+{change}%</span>;
    } else if (changeType === 'decrease') {
      return <span className="text-red-600 text-sm">{change}%</span>;
    } else {
      return <span className="text-gray-600 text-sm">{change}%</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-400" />
            企业人力资源数据大屏
          </h1>
          <p className="text-slate-400 mt-1">实时监控关键人力资源指标</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24小时</SelectItem>
              <SelectItem value="7d">近7天</SelectItem>
              <SelectItem value="30d">近30天</SelectItem>
              <SelectItem value="90d">近90天</SelectItem>
              <SelectItem value="1y">近1年</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
          >
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleFullscreen}
            className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
          >
            <Fullscreen className="h-4 w-4 mr-2" />
            全屏
          </Button>
        </div>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="bg-slate-800/50 backdrop-blur border-slate-700 hover:bg-slate-800/70 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-slate-400 text-sm mb-1">{metric.title}</div>
                    <div className="text-2xl font-bold text-white mb-2">{metric.value}</div>
                    <div className="flex items-center gap-2">
                      {renderChangeIcon(metric.changeType, metric.change)}
                      {renderChangeText(metric.changeType, metric.change)}
                      <span className="text-slate-500 text-xs">{metric.description}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 主图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* 人员结构分析 */}
        <Card className="bg-slate-800/50 backdrop-blur border-slate-700 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-400" />
              人员结构分析
            </CardTitle>
            <CardDescription className="text-slate-400">各部门人员分布</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {departmentDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-sm truncate">{item.name}</span>
                      <span className="text-slate-400 text-xs">{item.value}人</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${(item.value / 156) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 绩效分布 */}
        <Card className="bg-slate-800/50 backdrop-blur border-slate-700 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-green-400" />
              绩效分布
            </CardTitle>
            <CardDescription className="text-slate-400">员工绩效考核结果分布</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performanceDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-sm truncate">{item.name}</span>
                      <span className="text-slate-400 text-xs">{item.value}人</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${(item.value / 156) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 人才盘点 */}
        <Card className="bg-slate-800/50 backdrop-blur border-slate-700 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-400" />
              人才盘点
            </CardTitle>
            <CardDescription className="text-slate-400">人才九宫格分布</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {talentPool.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-sm truncate">{item.name}</span>
                      <span className="text-slate-400 text-xs">{item.value}人</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${(item.value / 156) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 招聘进度和关键趋势 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 招聘进度 */}
        <Card className="bg-slate-800/50 backdrop-blur border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-orange-400" />
              招聘进度
            </CardTitle>
            <CardDescription className="text-slate-400">当前招聘项目进展情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recruitmentProgress.map((item, index) => {
                const percentage = Math.round((item.completed / item.total) * 100);
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">{item.stage}</span>
                      <span className="text-slate-400 text-xs">
                        {item.completed}/{item.total} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 关键趋势 */}
        <Card className="bg-slate-800/50 backdrop-blur border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyan-400" />
              关键趋势
            </CardTitle>
            <CardDescription className="text-slate-400">人力资源关键指标趋势</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: '员工增长率', value: 8.3, trend: 'up', color: 'text-green-400' },
                { label: '人效提升率', value: 12.5, trend: 'up', color: 'text-green-400' },
                { label: '培训完成率', value: 85.3, trend: 'up', color: 'text-green-400' },
                { label: '满意度指数', value: 78.6, trend: 'up', color: 'text-green-400' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {item.trend === 'up' ? (
                      <TrendingUp className={`h-5 w-5 ${item.color}`} />
                    ) : (
                      <TrendingDown className={`h-5 w-5 ${item.color}`} />
                    )}
                    <span className="text-white text-sm">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${item.color}`}>{item.value}</span>
                    <span className="text-slate-400 text-xs">%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 底部提醒 */}
      <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Crown className="h-5 w-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">
                数据大屏完整功能
              </h3>
              <p className="text-slate-400 text-sm">
                升级企业版可解锁更多数据大屏功能，包括自定义指标配置、历史数据对比、异常告警、多维度分析等
              </p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              立即升级
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
