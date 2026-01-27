'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Target, Plus, Search, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: 'active' | 'completed' | 'delayed';
  deadline: string;
  owner: string;
}

export default function GoalSettingPage() {
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<Goal[]>([]);

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setGoals([
        {
          id: '1',
          title: '完成Q1季度目标',
          description: '完成所有销售指标和项目交付',
          progress: 75,
          status: 'active',
          deadline: '2026-03-31',
          owner: '张三',
        },
        {
          id: '2',
          title: '提升团队技能',
          description: '组织至少3次技术培训',
          progress: 60,
          status: 'active',
          deadline: '2026-06-30',
          owner: '李四',
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  if (loading) {
    return <div className="space-y-6"><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">目标设定</h1>
          <p className="text-muted-foreground mt-1">设定和管理团队目标</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />新建目标</Button>
      </div>

      <div className="grid gap-4">
        {goals.map(goal => (
          <Card key={goal.id} className="hover:shadow-md transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{goal.title}</CardTitle>
                    <CardDescription className="mt-1">{goal.description}</CardDescription>
                  </div>
                </div>
                <Badge variant={goal.status === 'active' ? 'default' : goal.status === 'completed' ? 'default' : 'secondary'}>
                  {goal.status === 'active' ? '进行中' : goal.status === 'completed' ? '已完成' : '延期'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>进度</span>
                    <span className="font-semibold">{goal.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${goal.progress}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>截止: {goal.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>负责人: {goal.owner}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
