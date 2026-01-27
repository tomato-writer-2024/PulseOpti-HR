'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Gift,
  Calendar,
  Download,
  RefreshCw,
  Award,
  Star,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/theme';

interface PointsData {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  level: string;
  nextLevelPoints: number;
  progress: number;
}

export default function PointsReportsPage() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [pointsData, setPointsData] = useState<PointsData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPointsData = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/points?type=overview');
      const data = await response.json();
      if (data.success) {
        setPointsData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch points data:', error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPointsData();
  }, [fetchPointsData]);

  const handleRefresh = useCallback(() => {
    fetchPointsData();
  }, [fetchPointsData]);

  const mockChartData = useMemo(() => {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    return days.map(day => ({
      label: day,
      earn: Math.floor(Math.random() * 200) + 50,
      spend: Math.floor(Math.random() * 100) + 20,
    }));
  }, [timeRange]);

  const mockTopEarners = useMemo(() => {
    return [
      { name: '张三', points: 12500, avatar: 'Z' },
      { name: '李四', points: 11200, avatar: 'L' },
      { name: '王五', points: 10800, avatar: 'W' },
      { name: '赵六', points: 9500, avatar: 'Z' },
      { name: '钱七', points: 8900, avatar: 'Q' },
    ];
  }, []);

  const mockTrendData = useMemo(() => {
    return [
      { label: '1月', value: 3200 },
      { label: '2月', value: 4100 },
      { label: '3月', value: 3800 },
      { label: '4月', value: 5200 },
      { label: '5月', value: 4600 },
      { label: '6月', value: 5800 },
    ];
  }, [timeRange]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">积分报表</h1>
          <p className="text-muted-foreground mt-1">
            查看积分的统计分析报表
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">本周</SelectItem>
              <SelectItem value="month">本月</SelectItem>
              <SelectItem value="quarter">本季度</SelectItem>
              <SelectItem value="year">本年度</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出报表
          </Button>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
          >
            <RefreshCw
              className={cn('mr-2 h-4 w-4', refreshing && 'animate-spin')}
            />
            刷新
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              本期获得
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              +3,240
            </div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <TrendingUp className="mr-1 h-4 w-4" />
              <span>+12.5%</span>
              <span className="text-muted-foreground ml-2">较上期</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              本期消费
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              -1,850
            </div>
            <div className="flex items-center mt-2 text-sm text-red-600">
              <TrendingDown className="mr-1 h-4 w-4" />
              <span>+8.3%</span>
              <span className="text-muted-foreground ml-2">较上期</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              活跃用户
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              142
            </div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <TrendingUp className="mr-1 h-4 w-4" />
              <span>+5.2%</span>
              <span className="text-muted-foreground ml-2">较上期</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              兑换次数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              38
            </div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <TrendingUp className="mr-1 h-4 w-4" />
              <span>+15.8%</span>
              <span className="text-muted-foreground ml-2">较上期</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trend" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trend">趋势分析</TabsTrigger>
          <TabsTrigger value="ranking">排行榜</TabsTrigger>
          <TabsTrigger value="distribution">分布统计</TabsTrigger>
        </TabsList>

        <TabsContent value="trend" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>积分获取与消费趋势</CardTitle>
              <CardDescription>
                近期积分获取和消费情况统计
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {mockChartData.map((data) => (
                  <div key={data.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{data.label}</span>
                      <div className="flex gap-4">
                        <span className="text-green-600">+{data.earn}</span>
                        <span className="text-red-600">-{data.spend}</span>
                      </div>
                    </div>
                    <div className="relative h-8">
                      <div className="absolute inset-0 flex items-end">
                        <div
                          className="bg-green-500 rounded-l h-full transition-all duration-500"
                          style={{ width: `${(data.earn / 250) * 100}%` }}
                        />
                        <div
                          className="bg-red-500 rounded-r h-full transition-all duration-500"
                          style={{ width: `${(data.spend / 250) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ranking" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>积分排行榜</CardTitle>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>积分最多的前5名用户</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTopEarners.map((user, index) => (
                    <div
                      key={user.name}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                          index === 0 && 'bg-amber-100 text-amber-700',
                          index === 1 && 'bg-gray-100 text-gray-700',
                          index === 2 && 'bg-orange-100 text-orange-700',
                          index > 2 && 'bg-muted text-muted-foreground'
                        )}>
                          {index + 1}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-medium text-primary">{user.avatar}</span>
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            第{index + 1}名
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-amber-600" />
                        <span className="font-bold text-lg">
                          {user.points.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>等级分布</CardTitle>
                  <Star className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>各等级用户数量分布</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { level: '黄金会员', count: 45, percentage: 32 },
                    { level: '白银会员', count: 68, percentage: 48 },
                    { level: '青铜会员', count: 29, percentage: 20 },
                  ].map((item) => (
                    <div key={item.level} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.level}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{item.count}人</span>
                          <Badge variant="outline">{item.percentage}%</Badge>
                        </div>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>积分来源分布</CardTitle>
                  <Zap className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>各项积分规则的贡献占比</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { source: '每日签到', count: 1240, percentage: 35 },
                    { source: '完成绩效考核', count: 980, percentage: 28 },
                    { source: '参与培训', count: 720, percentage: 20 },
                    { source: '推荐新员工', count: 600, percentage: 17 },
                  ].map((item) => (
                    <div key={item.source} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.source}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{item.count}分</span>
                          <Badge variant="outline">{item.percentage}%</Badge>
                        </div>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>兑换商品分布</CardTitle>
                  <Gift className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>各品类商品的兑换占比</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: '餐饮', count: 18, percentage: 47 },
                    { category: '购物', count: 12, percentage: 32 },
                    { category: '健康', count: 5, percentage: 13 },
                    { category: '教育', count: 3, percentage: 8 },
                  ].map((item) => (
                    <div key={item.category} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{item.count}次</span>
                          <Badge variant="outline">{item.percentage}%</Badge>
                        </div>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
