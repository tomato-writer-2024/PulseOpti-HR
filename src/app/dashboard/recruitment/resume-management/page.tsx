'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileText,
  Search,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Eye,
  MessageSquare,
  Check,
  X,
} from 'lucide-react';
import { cn } from '@/lib/theme';

interface Resume {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  education: string;
  experience: string;
  position: string;
  status: 'pending' | 'reviewed' | 'interview' | 'offered' | 'rejected';
  appliedAt: string;
}

export default function ResumeManagementPage() {
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchResumes = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setResumes([
        {
          id: '1',
          name: '张三',
          email: 'zhangsan@example.com',
          phone: '138****1234',
          location: '北京',
          education: '本科',
          experience: '3年',
          position: '高级前端工程师',
          status: 'pending',
          appliedAt: '2026-01-25',
        },
        {
          id: '2',
          name: '李四',
          email: 'lisi@example.com',
          phone: '139****5678',
          location: '上海',
          education: '硕士',
          experience: '5年',
          position: '产品经理',
          status: 'reviewed',
          appliedAt: '2026-01-24',
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const filteredResumes = resumes.filter(resume =>
    resume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resume.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="space-y-6"><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">简历管理</h1>
          <p className="text-muted-foreground mt-1">管理和筛选应聘简历</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="搜索简历..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredResumes.map(resume => (
          <Card key={resume.id} className="hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{resume.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{resume.name}</h3>
                    <Badge variant={
                      resume.status === 'pending' ? 'secondary' :
                      resume.status === 'reviewed' ? 'default' :
                      resume.status === 'interview' ? 'default' :
                      resume.status === 'offered' ? 'default' :
                      'outline'
                    }>
                      {resume.status === 'pending' ? '待审核' :
                       resume.status === 'reviewed' ? '已审核' :
                       resume.status === 'interview' ? '面试中' :
                       resume.status === 'offered' ? '已录用' : '已拒绝'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{resume.position}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{resume.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{resume.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{resume.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      <span>{resume.education}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>{resume.experience}工作经验</span>
                    <span>•</span>
                    <span>投递于 {resume.appliedAt}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button size="sm"><Eye className="mr-2 h-4 w-4" />查看详情</Button>
                <Button size="sm" variant="outline"><MessageSquare className="mr-2 h-4 w-4" />发送消息</Button>
                <Button size="sm" variant="outline" className="text-green-600"><Check className="mr-2 h-4 w-4" />通过</Button>
                <Button size="sm" variant="outline" className="text-red-600"><X className="mr-2 h-4 w-4" />拒绝</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
