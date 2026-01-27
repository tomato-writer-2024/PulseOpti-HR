'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, TrendingUp, Users, Award, Download } from 'lucide-react';

export default function ResultAnalysisPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div className="space-y-6"><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">结果分析</h1>
          <p className="text-muted-foreground mt-1">分析绩效数据和趋势</p>
        </div>
        <Button><Download className="mr-2 h-4 w-4" />导出报告</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">平均绩效</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">88.5</div>
            <div className="flex items-center text-sm text-green-600 mt-2">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+5.2%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">优秀员工</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Award className="h-4 w-4" />
              <span>占比 15%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">待改进</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Users className="h-4 w-4" />
              <span>占比 4%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>绩效分布</CardTitle>
          <CardDescription>各部门绩效得分分布情况</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { dept: '技术部', avg: 90, count: 25 },
              { dept: '产品部', avg: 87, count: 15 },
              { dept: '市场部', avg: 85, count: 20 },
              { dept: '销售部', avg: 88, count: 18 },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.dept}</span>
                  <div className="flex gap-4">
                    <span className="text-muted-foreground">{item.count}人</span>
                    <span className="font-semibold">{item.avg}分</span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${item.avg}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
