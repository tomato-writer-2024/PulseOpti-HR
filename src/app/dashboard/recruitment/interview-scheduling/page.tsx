'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Search,
  User,
  Plus,
  Edit,
  Check,
  X,
} from 'lucide-react';

interface Interview {
  id: string;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  type: 'online' | 'offline';
  location: string;
  interviewer: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export default function InterviewSchedulingPage() {
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchInterviews = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setInterviews([
        {
          id: '1',
          candidateName: '张三',
          position: '高级前端工程师',
          date: '2026-01-28',
          time: '14:00',
          type: 'online',
          location: 'Zoom会议室',
          interviewer: '李经理',
          status: 'scheduled',
        },
        {
          id: '2',
          candidateName: '李四',
          position: '产品经理',
          date: '2026-01-27',
          time: '10:00',
          type: 'offline',
          location: '北京总部301会议室',
          interviewer: '王总监',
          status: 'completed',
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch interviews:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  if (loading) {
    return <div className="space-y-6"><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">面试安排</h1>
          <p className="text-muted-foreground mt-1">管理面试日程和安排</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />安排面试</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="搜索面试..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {interviews.map(interview => (
          <Card key={interview.id} className="hover:shadow-md transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{interview.candidateName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{interview.candidateName}</CardTitle>
                    <CardDescription>{interview.position}</CardDescription>
                  </div>
                </div>
                <Badge variant={interview.status === 'scheduled' ? 'default' : interview.status === 'completed' ? 'default' : 'secondary'}>
                  {interview.status === 'scheduled' ? '已安排' : interview.status === 'completed' ? '已完成' : '已取消'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{interview.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{interview.time}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  {interview.type === 'online' ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                  <span>{interview.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{interview.interviewer}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm"><Edit className="mr-2 h-4 w-4" />编辑</Button>
                <Button size="sm" variant="outline" className="text-green-600"><Check className="mr-2 h-4 w-4" />完成</Button>
                <Button size="sm" variant="outline" className="text-red-600"><X className="mr-2 h-4 w-4" />取消</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
