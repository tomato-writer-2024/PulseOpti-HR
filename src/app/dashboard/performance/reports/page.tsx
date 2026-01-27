'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  PieChart,
  FileText,
  Download,
  Search,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  Target,
  Filter,
  Eye,
  Printer,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';

type ReportType = 'department' | 'individual' | 'period' | 'comparison';
type ReportStatus = 'draft' | 'completed' | 'archived';

interface Report {
  id: string;
  name: string;
  type: ReportType;
  status: ReportStatus;
  period: string;
  department?: string;
  employeeCount: number;
  averageScore: number;
  createdAt: string;
  createdBy: string;
}

export default function PerformanceReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // 模拟获取报告数据
    setTimeout(() => {
      setReports([
        {
          id: '1',
          name: '2024年第一季度绩效报告',
          type: 'period',
          status: 'completed',
          period: '2024-Q1',
          employeeCount: 156,
          averageScore: 82.5,
          createdAt: '2024-04-01T10:00:00',
          createdBy: 'HR Manager',
        },
        {
          id: '2',
          name: '技术部门绩效分析报告',
          type: 'department',
          status: 'completed',
          period: '2024-Q1',
          department: '技术部',
          employeeCount: 45,
          averageScore: 85.3,
          createdAt: '2024-04-02T14:30:00',
          createdBy: 'HR Manager',
        },
        {
          id: '3',
          name: '王明个人绩效报告',
          type: 'individual',
          status: 'completed',
          period: '2024-Q1',
          employeeCount: 1,
          averageScore: 92.0,
          createdAt: '2024-04-03T09:15:00',
          createdBy: 'HR Manager',
        },
        {
          id: '4',
          name: '2023年年度绩效对比报告',
          type: 'comparison',
          status: 'completed',
          period: '2023',
          employeeCount: 180,
          averageScore: 78.6,
          createdAt: '2024-01-15T16:00:00',
          createdBy: 'HR Director',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleExport = (reportId: string) => {
    toast.success('报告导出中，请稍候...');
    setTimeout(() => {
      toast.success('报告已导出为PDF');
    }, 2000);
  };

  const handlePrint = (reportId: string) => {
    toast.info('正在准备打印...');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleShare = (reportId: string) => {
    toast.success('分享链接已复制到剪贴板');
  };

  const statistics = {
    total: reports.length,
    department: reports.filter(r => r.type === 'department').length,
    individual: reports.filter(r => r.type === 'individual').length,
    averageScore: reports.length > 0
      ? reports.reduce((sum, r) => sum + r.averageScore, 0) / reports.length
      : 0,
  };

  const typeConfig: Record<ReportType, { label: string; icon: any; color: string }> = {
    department: { label: '部门报告', icon: Users, color: 'bg-blue-500' },
    individual: { label: '个人报告', icon: Award, color: 'bg-green-500' },
    period: { label: '周期报告', icon: Calendar, color: 'bg-purple-500' },
    comparison: { label: '对比报告', icon: TrendingUp, color: 'bg-orange-500' },
  };

  const statusConfig: Record<ReportStatus, { label: string; color: string }> = {
    draft: { label: '草稿', color: 'bg-gray-500' },
    completed: { label: '已完成', color: 'bg-green-500' },
    archived: { label: '已归档', color: 'bg-yellow-500' },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              绩效报告
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              查看和管理绩效分析报告
            </p>
          </div>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            生成新报告
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">总报告数</p>
                  <p className="text-2xl font-bold">{statistics.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">部门报告</p>
                  <p className="text-2xl font-bold">{statistics.department}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">个人报告</p>
                  <p className="text-2xl font-bold">{statistics.individual}</p>
                </div>
                <Award className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">平均绩效</p>
                  <p className="text-2xl font-bold">{statistics.averageScore.toFixed(1)}</p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 筛选栏 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="搜索报告名称或部门..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  {Object.entries(typeConfig).map(([value, config]) => (
                    <SelectItem key={value} value={value}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  {Object.entries(statusConfig).map(([value, config]) => (
                    <SelectItem key={value} value={value}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 报告列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 flex items-center justify-center h-64">
              <div className="text-gray-600 dark:text-gray-400">加载中...</div>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">暂无报告记录</p>
            </div>
          ) : (
            filteredReports.map((report) => {
              const typeIcon = typeConfig[report.type].icon;
              const Icon = typeIcon;
              return (
                <Card key={report.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${typeConfig[report.type].color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{report.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{typeConfig[report.type].label}</Badge>
                            <Badge className={statusConfig[report.status].color + ' text-white border-0'}>
                              {statusConfig[report.status].label}
                            </Badge>
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">考核周期</p>
                          <p className="font-medium">{report.period}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">参与人数</p>
                          <p className="font-medium">{report.employeeCount} 人</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">平均得分</p>
                          <p className="font-medium">
                            <span className={report.averageScore >= 80 ? 'text-green-600' : report.averageScore >= 60 ? 'text-yellow-600' : 'text-red-600'}>
                              {report.averageScore.toFixed(1)}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">创建时间</p>
                          <p className="font-medium text-sm">
                            {new Date(report.createdAt).toLocaleDateString('zh-CN')}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <a href={`/dashboard/performance/report/${report.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            查看详情
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleExport(report.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handlePrint(report.id)}>
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleShare(report.id)}>
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
