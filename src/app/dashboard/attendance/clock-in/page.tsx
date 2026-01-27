'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, MapPin, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface ClockRecord {
  id: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut: string;
  location: string;
  status: 'normal' | 'late' | 'early' | 'absent';
}

export default function ClockInPage() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<ClockRecord[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setRecords([
        {
          id: '1',
          employeeName: '张三',
          date: '2026-01-27',
          clockIn: '08:55',
          clockOut: '18:05',
          location: '北京总部',
          status: 'normal',
        },
        {
          id: '2',
          employeeName: '李四',
          date: '2026-01-27',
          clockIn: '09:15',
          clockOut: '18:00',
          location: '上海分公司',
          status: 'late',
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
          <h1 className="text-3xl font-bold tracking-tight">打卡记录</h1>
          <p className="text-muted-foreground mt-1">查看员工打卡记录</p>
        </div>
        <Button>导出记录</Button>
      </div>

      <div className="grid gap-4">
        {records.map(record => (
          <Card key={record.id} className="hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{record.employeeName}</h3>
                    <p className="text-sm text-muted-foreground">{record.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={record.status === 'normal' ? 'default' : 'secondary'}>
                    {record.status === 'normal' ? '正常' : record.status === 'late' ? '迟到' : record.status === 'early' ? '早退' : '缺勤'}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>上班: {record.clockIn}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>下班: {record.clockOut}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{record.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
