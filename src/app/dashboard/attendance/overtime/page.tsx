'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Calendar, DollarSign, Plus } from 'lucide-react';

export default function OvertimePage() {
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
          <h1 className="text-3xl font-bold tracking-tight">加班管理</h1>
          <p className="text-muted-foreground mt-1">管理员工加班记录和费用</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />添加加班</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">本月加班时长</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">156小时</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Clock className="h-4 w-4" />
              <span>全员累计</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">加班费用</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">¥23,400</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <DollarSign className="h-4 w-4" />
              <span>预计发放</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">加班人数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">28</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Calendar className="h-4 w-4" />
              <span>本月有加班</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>加班记录</CardTitle>
          <CardDescription>查看最近的加班记录</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-12 text-muted-foreground">加班管理功能开发中...</p>
        </CardContent>
      </Card>
    </div>
  );
}
