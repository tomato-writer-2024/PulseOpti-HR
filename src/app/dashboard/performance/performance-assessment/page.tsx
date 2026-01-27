'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ClipboardCheck, Star, Search, Eye } from 'lucide-react';

interface Assessment {
  id: string;
  employeeName: string;
  department: string;
  period: string;
  score: number;
  status: 'pending' | 'completed';
  assessedBy: string;
}

export default function PerformanceAssessmentPage() {
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  const fetchAssessments = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setAssessments([
        {
          id: '1',
          employeeName: '张三',
          department: '技术部',
          period: '2025 Q4',
          score: 92,
          status: 'completed',
          assessedBy: '李经理',
        },
        {
          id: '2',
          employeeName: '李四',
          department: '产品部',
          period: '2025 Q4',
          score: 88,
          status: 'pending',
          assessedBy: '王总监',
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  if (loading) {
    return <div className="space-y-6"><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">绩效评估</h1>
          <p className="text-muted-foreground mt-1">进行员工绩效评估和考核</p>
        </div>
        <Button><ClipboardCheck className="mr-2 h-4 w-4" />开始评估</Button>
      </div>

      <div className="grid gap-4">
        {assessments.map(assessment => (
          <Card key={assessment.id} className="hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{assessment.employeeName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{assessment.employeeName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {assessment.department} · {assessment.period}
                  </p>
                </div>
                <div className="text-right">
                  {assessment.status === 'completed' ? (
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                      <span className="text-2xl font-bold">{assessment.score}</span>
                    </div>
                  ) : (
                    <Badge variant="secondary">待评估</Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm"><Eye className="mr-2 h-4 w-4" />查看详情</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
