'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Briefcase,
  Plus,
  Search,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/theme';

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  salary: string;
  type: string;
  status: 'active' | 'closed' | 'draft';
  applicants: number;
  createdAt: string;
}

export default function JobPostingPage() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'closed' | 'draft'>('all');

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setJobs([
        {
          id: '1',
          title: '高级前端工程师',
          department: '技术部',
          location: '北京',
          salary: '25K-40K',
          type: '全职',
          status: 'active',
          applicants: 45,
          createdAt: '2026-01-20',
        },
        {
          id: '2',
          title: '产品经理',
          department: '产品部',
          location: '上海',
          salary: '30K-50K',
          type: '全职',
          status: 'active',
          applicants: 32,
          createdAt: '2026-01-18',
        },
        {
          id: '3',
          title: 'UI设计师',
          department: '设计部',
          location: '深圳',
          salary: '20K-35K',
          type: '全职',
          status: 'draft',
          applicants: 0,
          createdAt: '2026-01-25',
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    active: jobs.filter(j => j.status === 'active').length,
    draft: jobs.filter(j => j.status === 'draft').length,
    closed: jobs.filter(j => j.status === 'closed').length,
    totalApplicants: jobs.reduce((sum, j) => sum + j.applicants, 0),
  };

  if (loading) {
    return <div className="space-y-6"><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">岗位发布</h1>
          <p className="text-muted-foreground mt-1">发布和管理招聘岗位</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />发布新岗位</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">招聘中</p><p className="text-2xl font-bold">{stats.active}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">草稿</p><p className="text-2xl font-bold">{stats.draft}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">已关闭</p><p className="text-2xl font-bold">{stats.closed}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">投递总数</p><p className="text-2xl font-bold">{stats.totalApplicants}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="搜索岗位..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2">
              {(['active', 'draft', 'closed'] as const).map(status => (
                <Button key={status} variant={filterStatus === status ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus(status)}>
                  {status === 'active' ? '招聘中' : status === 'draft' ? '草稿' : '已关闭'}
                </Button>
              ))}
              <Button variant="outline" size="sm" onClick={() => setFilterStatus('all')}>全部</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredJobs.map(job => (
          <Card key={job.id} className="hover:shadow-md transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {job.department} · {job.type}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={job.status === 'active' ? 'default' : job.status === 'draft' ? 'secondary' : 'outline'}>
                  {job.status === 'active' ? '招聘中' : job.status === 'draft' ? '草稿' : '已关闭'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{job.applicants}人投递</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{job.createdAt}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm"><Eye className="mr-2 h-4 w-4" />查看详情</Button>
                <Button size="sm" variant="outline"><Edit className="mr-2 h-4 w-4" />编辑</Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700"><Trash2 className="mr-2 h-4 w-4" />删除</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
