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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  TrendingUp,
  Users,
  Award,
  Clock,
  Target,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Download,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';

type AnalysisPeriod = 'week' | 'month' | 'quarter' | 'year';

interface TrainingEffectiveness {
  totalTrainings: number;
  totalParticipants: number;
  completionRate: number;
  averageScore: number;
  satisfactionRate: number;
  skillImprovementRate: number;
  returnOnInvestment: number;
}

interface CourseAnalysis {
  id: string;
  name: string;
  participants: number;
  completionRate: number;
  averageScore: number;
  satisfactionScore: number;
  skillImprovement: number;
}

export default function TrainingEffectivenessPage() {
  const [period, setPeriod] = useState<AnalysisPeriod>('month');
  const [effectiveness, setEffectiveness] = useState<TrainingEffectiveness | null>(null);
  const [courses, setCourses] = useState<CourseAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟获取培训效果数据
    setTimeout(() => {
      setEffectiveness({
        totalTrainings: 24,
        totalParticipants: 356,
        completionRate: 87.5,
        averageScore: 85.3,
        satisfactionRate: 92.4,
        skillImprovementRate: 78.6,
        returnOnInvestment: 3.2,
      });

      setCourses([
        {
          id: '1',
          name: 'React高级开发',
          participants: 45,
          completionRate: 93.3,
          averageScore: 88.5,
          satisfactionScore: 94.2,
          skillImprovement: 82.3,
        },
        {
          id: '2',
          name: '团队领导力',
          participants: 32,
          completionRate: 90.6,
          averageScore: 86.7,
          satisfactionScore: 91.5,
          skillImprovement: 75.8,
        },
        {
          id: '3',
          name: '销售技巧提升',
          participants: 58,
          completionRate: 85.4,
          averageScore: 83.2,
          satisfactionScore: 89.3,
          skillImprovement: 79.1,
        },
        {
          id: '4',
          name: '项目管理实务',
          participants: 28,
          completionRate: 88.9,
          averageScore: 84.9,
          satisfactionScore: 90.8,
          skillImprovement: 76.5,
        },
        {
          id: '5',
          name: '数据分析入门',
          participants: 41,
          completionRate: 82.9,
          averageScore: 81.5,
          satisfactionScore: 87.6,
          skillImprovement: 73.2,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, [period]);

  const handleExport = () => {
    toast.success('正在导出培训效果报告...');
    setTimeout(() => {
      toast.success('培训效果报告已导出');
    }, 2000);
  };

  if (loading || !effectiveness) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
          <div className="text-gray-600 dark:text-gray-400">加载中...</div>
        </div>
      </div>
    );
  }

  const periodConfig: Record<AnalysisPeriod, { label: string }> = {
    week: { label: '本周' },
    month: { label: '本月' },
    quarter: { label: '本季度' },
    year: { label: '本年度' },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BarChart className="h-8 w-8 text-blue-600" />
              培训效果分析
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              分析培训项目的成效和ROI
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={period} onValueChange={(v) => setPeriod(v as AnalysisPeriod)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(periodConfig).map(([value, config]) => (
                  <SelectItem key={value} value={value}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              导出报告
            </Button>
          </div>
        </div>

        {/* 核心指标 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center">
                <BarChart className="h-8 w-8 text-blue-600 mb-2" />
                <p className="text-2xl font-bold">{effectiveness.totalTrainings}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">培训总数</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center">
                <Users className="h-8 w-8 text-green-600 mb-2" />
                <p className="text-2xl font-bold">{effectiveness.totalParticipants}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">参与人数</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center">
                <CheckCircle className="h-8 w-8 text-purple-600 mb-2" />
                <p className="text-2xl font-bold">{effectiveness.completionRate}%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">完成率</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center">
                <Award className="h-8 w-8 text-orange-600 mb-2" />
                <p className="text-2xl font-bold">{effectiveness.averageScore}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">平均分数</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center">
                <TrendingUp className="h-8 w-8 text-cyan-600 mb-2" />
                <p className="text-2xl font-bold">{effectiveness.satisfactionRate}%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">满意度</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center">
                <Target className="h-8 w-8 text-red-600 mb-2" />
                <p className="text-2xl font-bold">{effectiveness.skillImprovementRate}%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">技能提升率</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主要分析内容 */}
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">整体概览</TabsTrigger>
            <TabsTrigger value="courses">课程分析</TabsTrigger>
            <TabsTrigger value="trends">趋势分析</TabsTrigger>
            <TabsTrigger value="roi">ROI分析</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>培训完成情况</CardTitle>
                  <CardDescription>
                    {periodConfig[period].label}培训完成统计
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">完成培训</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-green-600">
                          {Math.round(effectiveness.totalParticipants * effectiveness.completionRate / 100)}
                        </span>
                        <Badge className="bg-green-500 text-white border-0">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          12.5%
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">进行中</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-blue-600">
                          {Math.round(effectiveness.totalParticipants * (100 - effectiveness.completionRate) / 100 * 0.3)}
                        </span>
                        <Badge className="bg-blue-500 text-white border-0">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          8.3%
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">未开始</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-600">
                          {Math.round(effectiveness.totalParticipants * (100 - effectiveness.completionRate) / 100 * 0.7)}
                        </span>
                        <Badge className="bg-gray-500 text-white border-0">
                          <ArrowDown className="h-3 w-3 mr-1" />
                          5.2%
                        </Badge>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex justify-between">
                        <span className="font-medium">完成率</span>
                        <span className="font-bold text-xl text-green-600">
                          {effectiveness.completionRate}%
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all"
                          style={{ width: `${effectiveness.completionRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>培训满意度</CardTitle>
                  <CardDescription>
                    学员对培训的满意度反馈
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <p className="text-5xl font-bold text-green-600 mb-2">
                        {effectiveness.satisfactionRate}%
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">总体满意度</p>
                    </div>
                    <div className="space-y-3">
                      {['非常满意', '满意', '一般', '不满意'].map((level, index) => {
                        const percentages = [45, 35, 15, 5];
                        const colors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-red-500'];
                        return (
                          <div key={level} className="flex items-center gap-3">
                            <div className="w-20 text-sm text-gray-600 dark:text-gray-400">
                              {level}
                            </div>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${colors[index]}`}
                                style={{ width: `${percentages[index]}%` }}
                              />
                            </div>
                            <div className="w-12 text-right text-sm font-medium">
                              {percentages[index]}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>技能提升分析</CardTitle>
                <CardDescription>
                  培训前后技能水平对比
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {['技术能力', '沟通能力', '领导力', '问题解决', '团队协作'].map((skill, index) => {
                    const beforeScores = [65, 72, 58, 70, 75];
                    const afterScores = [82, 85, 78, 88, 90];
                    const improvement = afterScores[index] - beforeScores[index];
                    return (
                      <div key={skill}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{skill}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {beforeScores[index]} → {afterScores[index]}
                            </span>
                            <Badge className="bg-green-500 text-white border-0">
                              <ArrowUp className="h-3 w-3 mr-1" />
                              +{improvement}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-l-lg h-4">
                            <div
                              className="h-4 rounded-l-lg bg-blue-400"
                              style={{ width: `${beforeScores[index]}%` }}
                            />
                          </div>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-r-lg h-4">
                            <div
                              className="h-4 rounded-r-lg bg-green-500"
                              style={{ width: `${afterScores[index]}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                    <CardDescription>
                      {course.participants} 人参与
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">完成率</span>
                          <span className="font-medium">{course.completionRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-green-500 transition-all"
                            style={{ width: `${course.completionRate}%` }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-lg font-bold text-orange-600">
                            {course.averageScore}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">平均分</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-purple-600">
                            {course.satisfactionScore}%
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">满意度</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-cyan-600">
                            {course.skillImprovement}%
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">技能提升</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>培训趋势</CardTitle>
                <CardDescription>
                  培训参与度和效果的变化趋势
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">月度培训参与人数</h4>
                    <div className="flex items-end justify-between h-48 gap-2">
                      {[45, 52, 48, 65, 72, 58, 80, 75, 82, 78, 90, 85].map((value, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                            style={{ height: `${value * 1.5}px` }}
                          />
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                            {index + 1}月
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">培训效果指标趋势</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { name: '完成率', values: [78, 82, 85, 87, 88, 90], color: 'green' },
                        { name: '满意度', values: [85, 88, 90, 91, 92, 94], color: 'purple' },
                        { name: '平均分', values: [80, 82, 84, 85, 86, 88], color: 'orange' },
                      ].map((metric) => (
                        <div key={metric.name} className="space-y-2">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {metric.name}
                          </div>
                          <div className="flex items-end justify-between h-24 gap-1">
                            {metric.values.map((value, index) => (
                              <div
                                key={index}
                                className={`flex-1 bg-${metric.color}-500 rounded-t transition-all`}
                                style={{ height: `${value * 0.8}px` }}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roi" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>投资回报率分析</CardTitle>
                <CardDescription>
                  培训投入与收益分析
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center py-8">
                    <p className="text-6xl font-bold text-green-600 mb-2">
                      {effectiveness.returnOnInvestment}x
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">培训投资回报率</p>
                    <Badge className="mt-4 bg-green-500 text-white border-0">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      ROI为正，培训效果显著
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">成本投入</h4>
                      <div className="space-y-3">
                        {['培训课程费用', '讲师费用', '场地及设备', '员工时间成本'].map((item, index) => {
                          const costs = [50000, 30000, 10000, 80000];
                          return (
                            <div key={item} className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">{item}</span>
                              <span className="font-medium">¥{costs[index].toLocaleString()}</span>
                            </div>
                          );
                        })}
                        <div className="pt-3 border-t flex justify-between font-semibold">
                          <span>总成本</span>
                          <span className="text-red-600">¥170,000</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">收益测算</h4>
                      <div className="space-y-3">
                        {['绩效提升', '工作效率提高', '员工留存', '其他收益'].map((item, index) => {
                          const benefits = [200000, 150000, 80000, 60000];
                          return (
                            <div key={item} className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">{item}</span>
                              <span className="font-medium">¥{benefits[index].toLocaleString()}</span>
                            </div>
                          );
                        })}
                        <div className="pt-3 border-t flex justify-between font-semibold">
                          <span>总收益</span>
                          <span className="text-green-600">¥490,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
