'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, DollarSign, Users, Calendar } from 'lucide-react';

export default function SocialInsurancePage() {
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
          <h1 className="text-3xl font-bold tracking-tight">社保公积金</h1>
          <p className="text-muted-foreground mt-1">管理社保和公积金缴纳</p>
        </div>
        <Button>更新基数</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">社保总额</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">¥285,000</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Shield className="h-4 w-4" />
              <span>单位+个人</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">公积金总额</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">¥180,000</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <DollarSign className="h-4 w-4" />
              <span>单位+个人</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">缴纳人数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">142</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Users className="h-4 w-4" />
              <span>全员缴纳</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>缴纳明细</CardTitle>
              <CardDescription>查看社保公积金缴纳明细</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>2026-01</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-center py-12 text-muted-foreground">社保公积金管理功能开发中...</p>
        </CardContent>
      </Card>
    </div>
  );
}
