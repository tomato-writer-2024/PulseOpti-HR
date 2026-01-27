'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Gift,
  Calendar,
  Zap,
  Star,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ShoppingBag,
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

interface PointsRecord {
  id: string;
  type: 'earn' | 'spend';
  points: number;
  reason: string;
  createdAt: Date;
}

interface Rule {
  id: string;
  name: string;
  points: number;
  description: string;
  icon: string;
  enabled: boolean;
  dailyLimit: number;
}

export default function PointsDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [pointsData, setPointsData] = useState<PointsData | null>(null);
  const [records, setRecords] = useState<PointsRecord[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
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

  const fetchRecords = useCallback(async () => {
    try {
      const response = await fetch('/api/points?type=records');
      const data = await response.json();
      if (data.success) {
        setRecords(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch records:', error);
    }
  }, []);

  const fetchRules = useCallback(async () => {
    try {
      const response = await fetch('/api/points?type=rules');
      const data = await response.json();
      if (data.success) {
        setRules(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch rules:', error);
    }
  }, []);

  useEffect(() => {
    fetchPointsData();
    fetchRecords();
    fetchRules();
  }, [fetchPointsData, fetchRecords, fetchRules]);

  const handleRefresh = useCallback(() => {
    fetchPointsData();
    fetchRecords();
    fetchRules();
  }, [fetchPointsData, fetchRecords, fetchRules]);

  const recentRecords = useMemo(() => {
    return records.slice(0, 10);
  }, [records]);

  const statsCards = useMemo(() => {
    if (!pointsData) return [];
    return [
      {
        title: '当前积分',
        value: pointsData.balance,
        icon: Trophy,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        trend: '+12%',
        trendUp: true,
      },
      {
        title: '累计获得',
        value: pointsData.totalEarned,
        icon: TrendingUp,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        trend: '+8%',
        trendUp: true,
      },
      {
        title: '累计消费',
        value: pointsData.totalSpent,
        icon: TrendingDown,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        trend: '+5%',
        trendUp: false,
      },
      {
        title: '会员等级',
        value: pointsData.level,
        icon: Award,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        trend: '',
        trendUp: true,
      },
    ];
  }, [pointsData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
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
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full mb-3 last:mb-0" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">积分仪表盘</h1>
          <p className="text-muted-foreground mt-1">
            查看您的积分概况和活动记录
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw
            className={cn(
              'mr-2 h-4 w-4',
              refreshing && 'animate-spin'
            )}
          />
          刷新
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                  <stat.icon className={cn('h-4 w-4', stat.color)} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </div>
                {stat.trend && (
                  <div className={cn(
                    'flex items-center text-xs font-medium',
                    stat.trendUp ? 'text-green-600' : 'text-red-600'
                  )}>
                    {stat.trendUp ? (
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-3 w-3" />
                    )}
                    {stat.trend}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pointsData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>等级进度</CardTitle>
                <CardDescription>
                  距离下一等级还需 {pointsData.nextLevelPoints - pointsData.balance} 积分
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-base px-4 py-1">
                {pointsData.level}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={pointsData.progress} className="h-3" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>0</span>
              <span>{pointsData.nextLevelPoints}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">近期活动</TabsTrigger>
          <TabsTrigger value="rules">获取积分</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>最近积分记录</CardTitle>
              <CardDescription>查看您最近的积分获取和消费记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'p-3 rounded-full',
                        record.type === 'earn' ? 'bg-green-100' : 'bg-red-100'
                      )}>
                        {record.type === 'earn' ? (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{record.reason}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(record.createdAt).toLocaleDateString('zh-CN')}
                        </p>
                      </div>
                    </div>
                    <div className={cn(
                      'text-lg font-semibold',
                      record.type === 'earn' ? 'text-green-600' : 'text-red-600'
                    )}>
                      {record.points > 0 ? '+' : ''}{record.points}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map((rule) => (
              <Card key={rule.id} className="hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-amber-600" />
                        {rule.name}
                      </CardTitle>
                      <CardDescription>{rule.description}</CardDescription>
                    </div>
                    <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                      {rule.enabled ? '可用' : '已禁用'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-amber-600">
                      +{rule.points}
                    </div>
                    <Button size="sm" disabled={!rule.enabled}>
                      去完成
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Gift className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-amber-900">积分商城</CardTitle>
              <CardDescription className="text-amber-700">
                使用积分兑换各种奖励和福利
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button className="bg-amber-600 hover:bg-amber-700">
            <ShoppingBag className="mr-2 h-4 w-4" />
            前往积分商城
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
