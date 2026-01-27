'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Layers,
  Plus,
  Search,
  Edit,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  DollarSign,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/theme';

interface JobLevel {
  id: string;
  level: string;
  name: string;
  description: string;
  salaryRange: string;
  employeeCount: number;
}

export default function JobHierarchyPage() {
  const [loading, setLoading] = useState(true);
  const [jobLevels, setJobLevels] = useState<JobLevel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchJobHierarchy = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setJobLevels([
        {
          id: '1',
          level: 'P1-P3',
          name: '初级工程师',
          description: '入门级技术岗位，需要指导完成工作',
          salaryRange: '8K-15K',
          employeeCount: 15,
        },
        {
          id: '2',
          level: 'P4-P6',
          name: '中级工程师',
          description: '能够独立完成工作，具备一定经验',
          salaryRange: '15K-25K',
          employeeCount: 25,
        },
        {
          id: '3',
          level: 'P7-P9',
          name: '高级工程师',
          description: '能够独立负责项目，指导初级工程师',
          salaryRange: '25K-40K',
          employeeCount: 18,
        },
        {
          id: '4',
          level: 'P10-P12',
          name: '资深工程师',
          description: '技术专家，负责复杂系统架构设计',
          salaryRange: '40K-60K',
          employeeCount: 8,
        },
        {
          id: '5',
          level: 'M1-M3',
          name: '经理',
          description: '团队管理，负责团队目标和成员发展',
          salaryRange: '30K-50K',
          employeeCount: 12,
        },
        {
          id: '6',
          level: 'M4-M6',
          name: '总监',
          description: '部门负责人，制定战略和规划',
          salaryRange: '50K-80K',
          employeeCount: 5,
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch job hierarchy:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobHierarchy();
  }, [fetchJobHierarchy]);

  const filteredLevels = useMemo(() => {
    return jobLevels.filter(level =>
      level.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      level.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobLevels, searchTerm]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">职位体系</h1>
          <p className="text-muted-foreground mt-1">
            管理公司的职位层级和职级体系
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          添加职级
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索职级..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLevels.map((level, index) => (
          <Card
            key={level.id}
            className={cn(
              "hover:shadow-lg transition-all",
              index === 0 && "border-green-500 bg-green-50/50",
              index === filteredLevels.length - 1 && "border-amber-500 bg-amber-50/50"
            )}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    index === 0 ? "bg-green-100" :
                    index === filteredLevels.length - 1 ? "bg-amber-100" :
                    "bg-primary/10"
                  )}>
                    <Layers className={cn(
                      "h-5 w-5",
                      index === 0 ? "text-green-600" :
                      index === filteredLevels.length - 1 ? "text-amber-600" :
                      "text-primary"
                    )} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{level.name}</CardTitle>
                    <CardDescription className="font-mono text-sm">
                      {level.level}
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {level.description}
                </p>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">薪资范围</p>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{level.salaryRange}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">在岗人数</p>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{level.employeeCount}人</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-blue-900">职级体系说明</CardTitle>
              <CardDescription className="text-blue-700">
                PulseOpti HR 采用双通道职业发展路径，员工可以根据自己的职业规划选择管理通道（M系列）或专业通道（P系列）发展
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
