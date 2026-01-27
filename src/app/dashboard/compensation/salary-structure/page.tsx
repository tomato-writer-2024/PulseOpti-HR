'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Layers, Building, Users, Plus } from 'lucide-react';

export default function SalaryStructurePage() {
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
          <h1 className="text-3xl font-bold tracking-tight">薪酬结构</h1>
          <p className="text-muted-foreground mt-1">管理薪酬体系和结构设置</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />添加薪酬体系</Button>
      </div>

      <div className="grid gap-4">
        {[
          { name: '技术序列', levels: 'P1-P12', range: '8K-60K', count: 45 },
          { name: '管理序列', levels: 'M1-M6', range: '20K-100K', count: 15 },
          { name: '销售序列', levels: 'S1-S5', range: '10K-50K', count: 20 },
        ].map((item, i) => (
          <Card key={i} className="hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    职级: {item.levels} · 薪资范围: {item.range}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{item.count}人</span>
                  </div>
                  <Button size="sm" variant="outline" className="mt-2">编辑</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
