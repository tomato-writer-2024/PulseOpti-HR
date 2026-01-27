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
  FileText,
  Download,
  Eye,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  Search,
  Plus,
  Filter,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

type ReportType = 'structure' | 'efficiency' | 'turnover' | 'compensation' | 'custom';
type ReportStatus = 'draft' | 'completed' | 'archived';
type ReportPeriod = 'monthly' | 'quarterly' | 'yearly';

interface HRReport {
  id: string;
  name: string;
  type: ReportType;
  status: ReportStatus;
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  createdBy: string;
  createdAt: string;
  description: string;
  metrics: {
    key: string;
    value: number;
    change: number;
  }[];
}

export default function HRReportsPage() {
  const [reports, setReports] = useState<HRReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // 模拟获取HR报告数据
    setTimeout(() => {
      setReports([
        {
          id: '1',
          name: '2024年第一季度人力结构分析',
          type: 'structure',
          status: 'completed',
          period: 'quarterly',
          startDate: '2024-01-01',
          endDate: '2024-03-31',
          createdBy: 'HR Director',
          createdAt: '2024-04-05T10:00:00',
          description: '分析公司整体人力结构、各部门人员分布、岗位层级分布等',
          metrics: [
            { key: '总人数', value: 256, change: 5.3 },
            { key: '正式员工', value: 230, change: 4.5 },
            { key: '实习生', value: 26, change: 12.0 },
            { key: '管理层比例', value: 15.6, change: -2.1 },
          ],
        },
        {
          id: '2',
          name: '2024年第一季度人效分析',
          type: 'efficiency',
          status: 'completed',
          period: 'quarterly',
          startDate: '2024-01-01',
          endDate: '2024-03-31',
          createdBy: 'HR Manager',
          createdAt: '2024-04-06T14:30:00',
          description: '分析员工效率、人均产值、人均成本等关键指标',
          metrics: [
            { key: '人均产值', value: 125000, change: 8.5 },
            { key: '人均成本', value: 18000, change: 3.2 },
            { key: '人效比', value: 6.94, change: 5.1 },
            { key: '加班率', value: 15.8, change: -3.5 },
          ],
        },
        {
          id: '3',
          name: '2023年度员工流失率分析',
          type: 'turnover',
          status: 'completed',
          period: 'yearly',
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          createdBy: 'HR Director',
          createdAt: '2024-01-15T09:00:00',
          description: '分析年度员工流失情况、流失原因、流失趋势等',
          metrics: [
            { key: '总流失率', value: 12.5, change: -2.3 },
            { key: '主动流失率', value: 9.8, change: -1.5 },
            { key: '被动流失率', value: 2.7, change: -0.8 },
            { key: '新员工流失率', value: 18.3, change: -4.2 },
          ],
        },
        {
          id: '4',
          name: '2024年第一季度薪酬分析',
          type: 'compensation',
          status: 'completed',
          period: 'quarterly',
          startDate: '2024-01-01',
          endDate: '2024-03-31',
          createdBy: 'Compensation Manager',
          createdAt: '2024-04-08T11:00:00',
          description: '分析薪酬结构、薪酬水平、薪酬分布等',
          metrics: [
            { key: '平均薪酬', value: 18500, change: 6.2 },
            { key: '薪酬中位数', value: 15500, change: 5.8 },
            { key: '薪酬总额', value: 14200000, change: 8.3 },
            { key: '薪酬占成本', value: 45.2, change: 1.5 },
          ],
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
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

  const typeConfig: Record<ReportType, { label: string; color: string; icon: any }> = {
    structure: { label: '人力结构', color: 'bg-blue-500', icon: Users },
    efficiency: { label: '人效分析', color: 'bg-green-500', icon: TrendingUp },
    turnover: { label: '流失率', color: 'bg-orange-500', icon: TrendingDown },
    compensation: { label: '薪酬分析', color: 'bg-purple-500', icon: BarChart },
    custom: { label: '自定义', color: 'bg-gray-500', icon: FileText },
  };

  const statusConfig: Record<ReportStatus, { label: string; color: string }> = {
    draft: { label: '草稿', color: 'bg-gray-500' },
    completed: { label: '已完成', color: 'bg-green-500' },
    archived: { label: '已归档', color: 'bg-yellow-500' },
  };

  const statistics = {
    totalReports: reports.length,
    completedReports: reports.filter(r => r.status === 'completed').length,
    quarterlyReports: reports.filter(r => r.period === 'quarterly').length,
    yearlyReports: reports.filter(r => r.period === 'yearly').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              HR报告
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              查看和管理人力资源分析报告
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            生成报告
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">总报告数</p>
                  <p className="text-2xl font-bold">{statistics.totalReports}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">已完成</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.completedReports}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">季度报告</p>
                  <p className="text-2xl font-bold">{statistics.quarterlyReports}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">年度报告</p>
                  <p className="text-2xl font-bold">{statistics.yearlyReports}</p>
                </div>
                <PieChart className="h-8 w-8 text-orange-600" />
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
                    placeholder="搜索报告名称或描述..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 flex items-center justify-center h-64">
              <div className="text-gray-600 dark:text-gray-400">加载中...</div>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">暂无报告记录</p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                生成报告
              </Button>
            </div>
          ) : (
            filteredReports.map((report) => {
              const TypeIcon = typeConfig[report.type].icon;
              return (
                <Card key={report.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{report.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge className={`${typeConfig[report.type].color} text-white border-0 flex items-center gap-1`}>
                            <TypeIcon className="h-3 w-3" />
                            {typeConfig[report.type].label}
                          </Badge>
                          <Badge className={statusConfig[report.status].color + ' text-white border-0'}>
                            {statusConfig[report.status].label}
                          </Badge>
                          <Badge variant="outline">
                            {report.period === 'monthly' ? '月报' : report.period === 'quarterly' ? '季报' : '年报'}
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {report.description}
                      </p>

                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">报告周期</span>
                          <span>{report.startDate} 至 {report.endDate}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-gray-600 dark:text-gray-400">创建时间</span>
                          <span>{new Date(report.createdAt).toLocaleDateString('zh-CN')}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-gray-600 dark:text-gray-400">创建人</span>
                          <span>{report.createdBy}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t">
                        <p className="text-sm font-medium mb-2">关键指标</p>
                        <div className="grid grid-cols-2 gap-2">
                          {report.metrics.slice(0, 4).map((metric) => (
                            <div key={metric.key} className="flex justify-between items-center">
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                {metric.key}
                              </span>
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-semibold">{metric.value}</span>
                                {metric.change !== 0 && (
                                  <span className={`text-xs flex items-center ${
                                    metric.change > 0 ? 'text-red-500' : 'text-green-500'
                                  }`}>
                                    {metric.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                    {Math.abs(metric.change)}%
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          查看详情
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleExport(report.id)}>
                          <Download className="h-4 w-4 mr-1" />
                          导出
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
