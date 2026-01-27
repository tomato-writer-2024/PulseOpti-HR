'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingDown,
  Users,
  Calendar,
  ArrowUp,
  ArrowDown,
  PieChart,
  Target,
} from 'lucide-react';
import { toast } from 'sonner';

type TurnoverReason = 'salary' | 'career' | 'culture' | 'work-life' | 'other';

interface TurnoverMetric {
  name: string;
  value: number;
  change: number;
  unit: string;
  target: number;
}

interface TurnoverByReason {
  reason: TurnoverReason;
  name: string;
  count: number;
  percentage: number;
}

interface TurnoverByDepartment {
  department: string;
  total: number;
  turnover: number;
  rate: number;
}

export default function TurnoverReportPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<TurnoverMetric[]>([]);
  const [byReason, setByReason] = useState<TurnoverByReason[]>([]);
  const [byDepartment, setByDepartment] = useState<TurnoverByDepartment[]>([]);

  useEffect(() => {
    // 模拟获取流失率数据
    setTimeout(() => {
      setMetrics([
        { name: '总流失率', value: 12.5, change: -2.3, unit: '%', target: 10.0 },
        { name: '主动流失率', value: 9.8, change: -1.5, unit: '%', target: 8.0 },
        { name: '被动流失率', value: 2.7, change: -0.8, unit: '%', target: 2.0 },
        { name: '新员工流失率', value: 18.3, change: -4.2, unit: '%', target: 15.0 },
        { name: '高绩效流失率', value: 3.2, change: -0.5, unit: '%', target: 2.0 },
        { name: '平均在职时长', value: 2.8, change: 5.2, unit: '年', target: 3.0 },
      ]);

      setByReason([
        { reason: 'salary', name: '薪酬原因', count: 12, percentage: 28.6 },
        { reason: 'career', name: '职业发展', count: 15, percentage: 35.7 },
        { reason: 'culture', name: '文化不符', count: 8, percentage: 19.0 },
        { reason: 'work-life', name: '工作生活平衡', count: 5, percentage: 11.9 },
        { reason: 'other', name: '其他原因', count: 2, percentage: 4.8 },
      ]);

      setByDepartment([
        { department: '技术部', total: 85, turnover: 8, rate: 9.4 },
        { department: '产品部', total: 35, turnover: 5, rate: 14.3 },
        { department: '销售部', total: 45, turnover: 10, rate: 22.2 },
        { department: '市场部', total: 28, turnover: 4, rate: 14.3 },
        { department: '人力资源部', total: 15, turnover: 1, rate: 6.7 },
        { department: '财务部', total: 18, turnover: 2, rate: 11.1 },
        { department: '运营部', total: 30, turnover: 5, rate: 16.7 },
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
              <TrendingDown className="h-8 w-8 text-blue-600" />
              流失率分析
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              分析员工流失情况和流失原因
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
                const isGoodMetric = metric.name.includes('平均');
                const isOnTarget = isGoodMetric ? achievementRate >= 100 : achievementRate <= 100;
                return (
                  <Card key={metric.name}>
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center justify-center">
                        <Users className="h-8 w-8 text-blue-600 mb-2" />
                        <p className="text-2xl font-bold">
                          {metric.value}
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                            {metric.unit}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{metric.name}</p>
                        <Badge
                          className={`mt-2 ${isOnTarget ? 'bg-green-500' : 'bg-yellow-500'} text-white border-0`}
                        >
                          {metric.change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                          {Math.abs(metric.change)}%
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          目标: {metric.target}{metric.unit}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* 流失原因分析 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-purple-600" />
                    流失原因分布
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {byReason.map((item) => (
                      <div key={item.reason}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{item.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {item.count} 人
                            </span>
                            <span className="text-sm font-semibold">
                              {item.percentage}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              item.percentage >= 30 ? 'bg-red-500' :
                              item.percentage >= 20 ? 'bg-orange-500' :
                              'bg-blue-500'
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    部门流失率对比
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {byDepartment
                      .sort((a, b) => b.rate - a.rate)
                      .map((dept) => (
                        <div key={dept.department}>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{dept.department}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {dept.turnover}/{dept.total}
                              </span>
                              <Badge
                                className={
                                  dept.rate <= 10 ? 'bg-green-500' :
                                  dept.rate <= 15 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                } text-white border-0
                              >
                                {dept.rate}%
                              </Badge>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                dept.rate <= 10 ? 'bg-green-500' :
                                dept.rate <= 15 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(100, dept.rate * 5)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 流失趋势 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  月度流失趋势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">年度流失人数趋势</h4>
                    <div className="flex items-end justify-between h-48 gap-2">
                      {[3, 5, 4, 6, 8, 7, 5, 4, 6, 5, 8, 5].map((count, index) => (
                        <div
                          key={index}
                          className="flex-1 flex flex-col items-center gap-2"
                        >
                          <div
                            className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                            style={{ height: `${count * 10}px` }}
                            title={`${index + 1}月: ${count}人`}
                          />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {index + 1}月
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">主动流失</h4>
                      <div className="flex items-end justify-between h-24 gap-1">
                        {[2, 4, 3, 5, 6, 5, 4, 3, 5, 4, 6, 4].map((value, index) => (
                          <div
                            key={index}
                            className="flex-1 bg-orange-500 rounded-t transition-all hover:bg-orange-600"
                            style={{ height: `${value * 8}px` }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">被动流失</h4>
                      <div className="flex items-end justify-between h-24 gap-1">
                        {[1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 1].map((value, index) => (
                          <div
                            key={index}
                            className="flex-1 bg-red-500 rounded-t transition-all hover:bg-red-600"
                            style={{ height: `${value * 8}px` }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">新员工流失</h4>
                      <div className="flex items-end justify-between h-24 gap-1">
                        {[2, 3, 2, 3, 4, 3, 2, 2, 3, 2, 4, 2].map((value, index) => (
                          <div
                            key={index}
                            className="flex-1 bg-purple-500 rounded-t transition-all hover:bg-purple-600"
                            style={{ height: `${value * 8}px` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 画像分析 */}
            <Card>
              <CardHeader>
                <CardTitle>流失人员画像分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">司龄分布</h4>
                    <div className="space-y-1">
                      {[
                        { range: '0-3个月', count: 15, percentage: 35.7 },
                        { range: '3-6个月', count: 10, percentage: 23.8 },
                        { range: '6-12个月', count: 8, percentage: 19.0 },
                        { range: '1-2年', count: 6, percentage: 14.3 },
                        { range: '2年以上', count: 3, percentage: 7.2 },
                      ].map((item) => (
                        <div key={item.range} className="flex items-center gap-2 text-sm">
                          <span className="w-20 text-gray-600 dark:text-gray-400">{item.range}</span>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className="w-8 text-right">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">年龄分布</h4>
                    <div className="space-y-1">
                      {[
                        { range: '25岁以下', count: 8, percentage: 19.0 },
                        { range: '25-30岁', count: 18, percentage: 42.9 },
                        { range: '30-35岁', count: 10, percentage: 23.8 },
                        { range: '35-40岁', count: 4, percentage: 9.5 },
                        { range: '40岁以上', count: 2, percentage: 4.8 },
                      ].map((item) => (
                        <div key={item.range} className="flex items-center gap-2 text-sm">
                          <span className="w-20 text-gray-600 dark:text-gray-400">{item.range}</span>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-green-500"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className="w-8 text-right">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">绩效分布</h4>
                    <div className="space-y-1">
                      {[
                        { level: 'S级', count: 2, percentage: 4.8 },
                        { level: 'A级', count: 5, percentage: 11.9 },
                        { level: 'B级', count: 18, percentage: 42.9 },
                        { level: 'C级', count: 12, percentage: 28.6 },
                        { level: 'D级', count: 5, percentage: 11.8 },
                      ].map((item) => (
                        <div key={item.level} className="flex items-center gap-2 text-sm">
                          <span className="w-20 text-gray-600 dark:text-gray-400">{item.level}</span>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                item.level === 'S级' || item.level === 'A级' ? 'bg-red-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className="w-8 text-right">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">部门分布</h4>
                    <div className="space-y-1">
                      {byDepartment.slice(0, 5).map((dept) => (
                        <div key={dept.department} className="flex items-center gap-2 text-sm">
                          <span className="w-20 text-gray-600 dark:text-gray-400">{dept.department}</span>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-purple-500"
                              style={{ width: `${(dept.turnover / 15) * 100}%` }}
                            />
                          </div>
                          <span className="w-8 text-right">{dept.turnover}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
