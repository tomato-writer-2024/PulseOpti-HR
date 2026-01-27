'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Target,
  Activity,
} from 'lucide-react';
import { toast } from 'sonner';

interface StructureMetric {
  name: string;
  value: number;
  change: number;
  unit: string;
}

interface DepartmentData {
  name: string;
  total: number;
  managers: number;
  staff: number;
  ratio: number;
}

export default function StructureReportPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<StructureMetric[]>([]);
  const [departments, setDepartments] = useState<DepartmentData[]>([]);

  useEffect(() => {
    // 模拟获取人力结构数据
    setTimeout(() => {
      setMetrics([
        { name: '总人数', value: 256, change: 5.3, unit: '人' },
        { name: '正式员工', value: 230, change: 4.5, unit: '人' },
        { name: '实习生', value: 26, change: 12.0, unit: '人' },
        { name: '管理层比例', value: 15.6, change: -2.1, unit: '%' },
        { name: '平均司龄', value: 2.8, change: 8.7, unit: '年' },
        { name: '本科以上学历', value: 78.5, change: 3.2, unit: '%' },
      ]);

      setDepartments([
        { name: '技术部', total: 85, managers: 12, staff: 73, ratio: 14.1 },
        { name: '产品部', total: 35, managers: 5, staff: 30, ratio: 14.3 },
        { name: '销售部', total: 45, managers: 8, staff: 37, ratio: 17.8 },
        { name: '市场部', total: 28, managers: 4, staff: 24, ratio: 14.3 },
        { name: '人力资源部', total: 15, managers: 3, staff: 12, ratio: 20.0 },
        { name: '财务部', total: 18, managers: 3, staff: 15, ratio: 16.7 },
        { name: '运营部', total: 30, managers: 5, staff: 25, ratio: 16.7 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleExport = () => {
    toast.success('报告导出中，请稍候...');
    setTimeout(() => {
      toast.success('报告已导出');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              人力结构分析
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              分析公司整体人力结构和各部门人员分布
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              导出报告
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-gray-600 dark:text-gray-400">加载中...</div>
          </div>
        ) : (
          <>
            {/* 核心指标 */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {metrics.map((metric) => (
                <Card key={metric.name}>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center justify-center">
                      <Activity className="h-8 w-8 text-blue-600 mb-2" />
                      <p className="text-2xl font-bold">
                        {metric.value}
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                          {metric.unit}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{metric.name}</p>
                      <Badge
                        variant={metric.change >= 0 ? 'default' : 'secondary'}
                        className={`mt-2 ${metric.change >= 0 ? 'bg-green-500' : 'bg-red-500'} text-white border-0`}
                      >
                        {metric.change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                        {Math.abs(metric.change)}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 部门分布 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  部门人员分布
                </CardTitle>
                <CardDescription>
                  各部门人员构成及管理比例
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.map((dept) => (
                    <div key={dept.name}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{dept.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            总计 {dept.total} 人
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            管理 {dept.managers} 人
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            员工 {dept.staff} 人
                          </span>
                          <span className="font-semibold">
                            管理比例 {dept.ratio}%
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 h-6">
                        <div
                          className="bg-blue-500 rounded-l transition-all hover:bg-blue-600"
                          style={{ width: `${(dept.managers / dept.total) * 100}%` }}
                          title={`管理层: ${dept.managers}人`}
                        />
                        <div
                          className="bg-green-500 rounded-r transition-all hover:bg-green-600"
                          style={{ width: `${(dept.staff / dept.total) * 100}%` }}
                          title={`员工: ${dept.staff}人`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 职级分布 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    职级分布
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { level: '总监级', count: 12, percentage: 4.7 },
                      { level: '经理级', count: 28, percentage: 10.9 },
                      { level: '主管级', count: 35, percentage: 13.7 },
                      { level: '高级专员', count: 68, percentage: 26.6 },
                      { level: '专员', count: 87, percentage: 34.0 },
                      { level: '助理/实习生', count: 26, percentage: 10.1 },
                    ].map((item) => (
                      <div key={item.level}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{item.level}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.count} 人 ({item.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    年龄分布
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { range: '20-25岁', count: 45, percentage: 17.6 },
                      { range: '26-30岁', count: 89, percentage: 34.8 },
                      { range: '31-35岁', count: 68, percentage: 26.6 },
                      { range: '36-40岁', count: 32, percentage: 12.5 },
                      { range: '41-45岁', count: 15, percentage: 5.9 },
                      { range: '46岁以上', count: 7, percentage: 2.6 },
                    ].map((item) => (
                      <div key={item.range}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{item.range}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.count} 人 ({item.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 性别与学历 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>性别分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { gender: '男性', count: 142, percentage: 55.5 },
                      { gender: '女性', count: 114, percentage: 44.5 },
                    ].map((item) => (
                      <div key={item.gender}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{item.gender}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.count} 人 ({item.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all ${item.gender === '男性' ? 'bg-blue-500' : 'bg-pink-500'}`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>学历分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { degree: '博士', count: 5, percentage: 2.0 },
                      { degree: '硕士', count: 68, percentage: 26.6 },
                      { degree: '本科', count: 128, percentage: 50.0 },
                      { degree: '大专', count: 45, percentage: 17.6 },
                      { degree: '高中及以下', count: 10, percentage: 3.8 },
                    ].map((item) => (
                      <div key={item.degree}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{item.degree}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.count} 人 ({item.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
