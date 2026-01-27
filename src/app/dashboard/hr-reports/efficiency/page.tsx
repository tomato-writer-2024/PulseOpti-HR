'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  Target,
  Activity,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { toast } from 'sonner';

interface EfficiencyMetric {
  name: string;
  value: number;
  change: number;
  unit: string;
  target: number;
}

interface DepartmentEfficiency {
  name: string;
  headcount: number;
  revenue: number;
  revenuePerHead: number;
  costPerHead: number;
  efficiency: number;
  overtimeRate: number;
}

export default function EfficiencyReportPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<EfficiencyMetric[]>([]);
  const [departments, setDepartments] = useState<DepartmentEfficiency[]>([]);

  useEffect(() => {
    // 模拟获取人效数据
    setTimeout(() => {
      setMetrics([
        { name: '人均产值', value: 125000, change: 8.5, unit: '元', target: 130000 },
        { name: '人均成本', value: 18000, change: 3.2, unit: '元', target: 17500 },
        { name: '人效比', value: 6.94, change: 5.1, unit: '', target: 7.5 },
        { name: '加班率', value: 15.8, change: -3.5, unit: '%', target: 12.0 },
        { name: '人均利润', value: 28000, change: 12.3, unit: '元', target: 30000 },
        { name: '员工利用率', value: 78.5, change: 4.8, unit: '%', target: 85.0 },
      ]);

      setDepartments([
        { name: '技术部', headcount: 85, revenue: 12000000, revenuePerHead: 141176, costPerHead: 19000, efficiency: 7.43, overtimeRate: 18.5 },
        { name: '产品部', headcount: 35, revenue: 4200000, revenuePerHead: 120000, costPerHead: 17500, efficiency: 6.86, overtimeRate: 12.3 },
        { name: '销售部', headcount: 45, revenue: 18000000, revenuePerHead: 400000, costPerHead: 16500, efficiency: 24.24, overtimeRate: 22.1 },
        { name: '市场部', headcount: 28, revenue: 3500000, revenuePerHead: 125000, costPerHead: 17000, efficiency: 7.35, overtimeRate: 14.7 },
        { name: '人力资源部', headcount: 15, revenue: 0, revenuePerHead: 0, costPerHead: 16000, efficiency: 0, overtimeRate: 8.5 },
        { name: '财务部', headcount: 18, revenue: 0, revenuePerHead: 0, costPerHead: 15500, efficiency: 0, overtimeRate: 6.2 },
        { name: '运营部', headcount: 30, revenue: 4800000, revenuePerHead: 160000, costPerHead: 16800, efficiency: 9.52, overtimeRate: 16.8 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleExport = () => {
    toast.success('报告导出中，请稍候...');
    setTimeout(() => {
      toast.success('报告已导出');
    }, 2000);
  };

  const getAchievementRate = (value: number, target: number) => {
    return (value / target) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              人效分析
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              分析员工效率和人力投入产出比
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              导出报告
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-gray-600 dark:text-gray-400">加载中...</div>
          </div>
        ) : (
          <>
            {/* 核心指标 */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {metrics.map((metric) => {
                const achievementRate = getAchievementRate(metric.value, metric.target);
                const isGoodMetric = metric.name === '人均产值' || metric.name === '人效比' || metric.name === '人均利润' || metric.name === '员工利用率';
                const isOnTarget = isGoodMetric ? achievementRate >= 100 : achievementRate <= 100;
                return (
                  <Card key={metric.name}>
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center justify-center">
                        <Activity className="h-8 w-8 text-blue-600 mb-2" />
                        <p className="text-2xl font-bold">
                          {metric.value.toLocaleString()}
                          {metric.unit && (
                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                              {metric.unit}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{metric.name}</p>
                        <Badge
                          className={`mt-2 ${isOnTarget ? 'bg-green-500' : 'bg-yellow-500'} text-white border-0`}
                        >
                          {metric.change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                          {Math.abs(metric.change)}%
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          目标: {metric.target.toLocaleString()}{metric.unit}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* 部门人效对比 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  部门人效对比
                </CardTitle>
                <CardDescription>
                  各部门人效指标对比分析
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">部门</th>
                        <th className="text-right py-3 px-4 font-semibold">人数</th>
                        <th className="text-right py-3 px-4 font-semibold">部门营收</th>
                        <th className="text-right py-3 px-4 font-semibold">人均产值</th>
                        <th className="text-right py-3 px-4 font-semibold">人均成本</th>
                        <th className="text-right py-3 px-4 font-semibold">人效比</th>
                        <th className="text-right py-3 px-4 font-semibold">加班率</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.map((dept) => (
                        <tr key={dept.name} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-4 font-medium">{dept.name}</td>
                          <td className="text-right py-3 px-4">{dept.headcount}</td>
                          <td className="text-right py-3 px-4">
                            {dept.revenue > 0 ? `¥${dept.revenue.toLocaleString()}` : '-'}
                          </td>
                          <td className="text-right py-3 px-4">
                            {dept.revenuePerHead > 0 ? `¥${dept.revenuePerHead.toLocaleString()}` : '-'}
                          </td>
                          <td className="text-right py-3 px-4">¥{dept.costPerHead.toLocaleString()}</td>
                          <td className="text-right py-3 px-4">
                            <span className={`font-semibold ${dept.efficiency >= 7 ? 'text-green-600' : dept.efficiency >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {dept.efficiency > 0 ? dept.efficiency.toFixed(2) : '-'}
                            </span>
                          </td>
                          <td className="text-right py-3 px-4">
                            <Badge className={
                              dept.overtimeRate <= 12 ? 'bg-green-500' :
                              dept.overtimeRate <= 18 ? 'bg-yellow-500' :
                              'bg-red-500'
                            } text-white border-0>
                              {dept.overtimeRate}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* 详细分析 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    成本效益分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">人均产值达成率</span>
                        <span className="text-sm font-medium">
                          {getAchievementRate(metrics[0].value, metrics[0].target).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            getAchievementRate(metrics[0].value, metrics[0].target) >= 100 ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${Math.min(100, getAchievementRate(metrics[0].value, metrics[0].target))}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">人均成本控制</span>
                        <span className="text-sm font-medium">
                          {getAchievementRate(metrics[1].value, metrics[1].target).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            getAchievementRate(metrics[1].value, metrics[1].target) <= 100 ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, getAchievementRate(metrics[1].value, metrics[1].target))}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">人效比达成率</span>
                        <span className="text-sm font-medium">
                          {getAchievementRate(metrics[2].value, metrics[2].target).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            getAchievementRate(metrics[2].value, metrics[2].target) >= 100 ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${Math.min(100, getAchievementRate(metrics[2].value, metrics[2].target))}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">加班率控制</span>
                        <span className="text-sm font-medium">
                          {getAchievementRate(metrics[3].value, metrics[3].target).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            getAchievementRate(metrics[3].value, metrics[3].target) <= 100 ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, getAchievementRate(metrics[3].value, metrics[3].target))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    员工利用率分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <p className="text-5xl font-bold text-blue-600 mb-2">
                        {metrics[5].value}%
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">平均员工利用率</p>
                      <Badge
                        className={`mt-4 ${getAchievementRate(metrics[5].value, metrics[5].target) >= 100 ? 'bg-green-500' : 'bg-yellow-500'} text-white border-0`}
                      >
                        {metrics[5].change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                        {Math.abs(metrics[5].change)}%
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {[
                        { name: '技术部', rate: 82.5 },
                        { name: '产品部', rate: 76.8 },
                        { name: '销售部', rate: 85.2 },
                        { name: '市场部', rate: 74.5 },
                        { name: '运营部', rate: 73.5 },
                      ].map((item) => (
                        <div key={item.name}>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-sm">{item.rate}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                item.rate >= 80 ? 'bg-green-500' :
                                item.rate >= 70 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${item.rate}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 趋势分析 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  季度人效趋势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: '人均产值趋势', data: [95000, 105000, 115000, 125000], unit: '元' },
                    { name: '人均成本趋势', data: [16500, 17000, 17500, 18000], unit: '元' },
                    { name: '人效比趋势', data: [5.76, 6.18, 6.57, 6.94], unit: '' },
                  ].map((item) => (
                    <div key={item.name} className="space-y-2">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <div className="flex items-end justify-between h-24 gap-1">
                        {item.data.map((value, index) => (
                          <div
                            key={index}
                            className="flex-1 bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                            style={{ height: `${(value / Math.max(...item.data)) * 80}px` }}
                            title={`${item.name}: ${value}${item.unit}`}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>Q1</span>
                        <span>Q2</span>
                        <span>Q3</span>
                        <span>Q4</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
