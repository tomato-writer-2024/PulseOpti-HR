'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Calendar, User, Clock, Check, X } from 'lucide-react';

interface LeaveRequest {
  id: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function LeaveApprovalPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setRequests([
        {
          id: '1',
          employeeName: '张三',
          type: '年假',
          startDate: '2026-02-01',
          endDate: '2026-02-03',
          days: 3,
          reason: '回家探亲',
          status: 'pending',
        },
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="space-y-6"><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">请假审批</h1>
          <p className="text-muted-foreground mt-1">审批员工的请假申请</p>
        </div>
      </div>

      <div className="grid gap-4">
        {requests.map(request => (
          <Card key={request.id} className="hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{request.employeeName}</h3>
                    <p className="text-sm text-muted-foreground">{request.type}</p>
                  </div>
                </div>
                <Badge variant={request.status === 'pending' ? 'secondary' : request.status === 'approved' ? 'default' : 'outline'}>
                  {request.status === 'pending' ? '待审批' : request.status === 'approved' ? '已通过' : '已拒绝'}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{request.startDate} - {request.endDate}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{request.days}天</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>原因: {request.reason}</span>
                </div>
              </div>
              {request.status === 'pending' && (
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700"><Check className="mr-2 h-4 w-4" />通过</Button>
                  <Button size="sm" variant="outline" className="text-red-600"><X className="mr-2 h-4 w-4" />拒绝</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
