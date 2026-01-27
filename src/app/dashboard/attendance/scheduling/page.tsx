'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Users, Plus } from 'lucide-react';

export default function SchedulingPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">排班管理</h1>
          <p className="text-muted-foreground mt-1">管理员工排班和班次</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />新增排班</Button>
      </div>

      <div className="grid gap-4">
        {['技术部', '销售部', '客服部'].map((dept, i) => (
          <Card key={i} className="hover:shadow-md transition-all">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{dept}</CardTitle>
                <Button size="sm" variant="outline">管理排班</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>15人</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>5班/天</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
