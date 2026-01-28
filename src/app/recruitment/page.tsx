'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, Users, Calendar, Plus, Download, TrendingUp, Zap, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, Star } from 'lucide-react';

const recruitmentData = {
  metrics: {
    activeJobs: 25,
    totalCandidates: 856,
    interviewsScheduled: 48,
    hiredThisMonth: 12,
    avgTimeToHire: 18,
    acceptanceRate: 78.5,
  },
  jobs: [
    {
      id: '1',
      title: '高级前端工程师',
      department: '技术部',
      location: '北京',
      salaryRange: '20K-35K',
      status: 'active',
      applicants: 85,
      hired: 3,
    },
    {
      id: '2',
      title: '产品经理',
      department: '产品部',
      location: '上海',
      salaryRange: '15K-25K',
      status: 'active',
      applicants: 62,
      hired: 2,
    },
  ],
  candidates: [
    {
      id: '1',
      name: '李明',
      position: '高级前端工程师',
      status: 'interviewed',
      score: 92,
    },
    {
      id: '2',
      name: '王芳',
      position: '产品经理',
      status: 'offered',
      score: 88,
    },
  ],
};

export default function RecruitmentPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            招聘管理
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            岗位发布、简历筛选、面试安排
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出报表
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Plus className="h-4 w-4 mr-2" />
            发布职位
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>招聘中岗位</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white">
                <Briefcase className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-3xl">{recruitmentData.metrics.activeJobs}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>候选人总数</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-3xl">{recruitmentData.metrics.totalCandidates}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>待面试</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-3xl">{recruitmentData.metrics.interviewsScheduled}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>本月录用</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-3xl">{recruitmentData.metrics.hiredThisMonth}</CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span className="text-green-600">+15.2%</span>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>平均招聘周期</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-3xl">{recruitmentData.metrics.avgTimeToHire}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>接受率</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-white">
                <Star className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-3xl">{recruitmentData.metrics.acceptanceRate}%</CardTitle>
            <Progress value={recruitmentData.metrics.acceptanceRate} className="mt-2" />
          </CardHeader>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">
            <TrendingUp className="h-4 w-4 mr-2" />
            总览
          </TabsTrigger>
          <TabsTrigger value="jobs">
            <Briefcase className="h-4 w-4 mr-2" />
            招聘职位
          </TabsTrigger>
          <TabsTrigger value="candidates">
            <Users className="h-4 w-4 mr-2" />
            候选人
          </TabsTrigger>
          <TabsTrigger value="interviews">
            <Calendar className="h-4 w-4 mr-2" />
            面试安排
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Zap className="h-4 w-4 mr-2" />
            AI面试
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>招聘漏斗</CardTitle>
              <CardDescription>从简历到录用的转化情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: '简历投递', count: 856, value: 100 },
                  { label: '简历筛选', count: 342, value: 40 },
                  { label: '面试安排', count: 156, value: 18 },
                  { label: 'Offer发放', count: 48, value: 5.6 },
                  { label: '成功录用', count: 12, value: 1.4 },
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {item.count}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {item.value}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={item.value} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>招聘职位</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  招聘职位管理功能开发中...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates">
          <Card>
            <CardHeader>
              <CardTitle>候选人管理</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  候选人管理功能开发中...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interviews">
          <Card>
            <CardHeader>
              <CardTitle>面试安排</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  面试安排功能开发中...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI智能面试</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Zap className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  AI智能面试功能开发中...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
