'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calculator, DollarSign, Users, Calendar, Download } from 'lucide-react';

export default function SalaryCalculationPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">工资核算</h1>
          <p className="text-muted-foreground mt-1">进行工资计算和发放管理</p>
        </div>
        <Button><Calculator className="mr-2 h-4 w-4" />开始核算</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">本月工资总额</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">¥1,245,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">应发人数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">142</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Users className="h-4 w-4" />
              <span>在职员工</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">核算周期</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2026-01</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Calendar className="h-4 w-4" />
              <span>1月份</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>工资明细</CardTitle>
              <CardDescription>查看本月的工资计算明细</CardDescription>
            </div>
            <Button variant="outline"><Download className="mr-2 h-4 w-4" />导出</Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-center py-12 text-muted-foreground">工资核算功能开发中...</p>
        </CardContent>
      </Card>
    </div>
  );
}
