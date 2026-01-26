'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Users, BarChart3, Filter, Download } from 'lucide-react';

export default function SalaryAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [filters, setFilters] = useState({
    department: 'all',
    year: new Date().getFullYear().toString(),
    quarter: 'all',
  });

  useEffect(() => {
    fetchSalaryData();
  }, [filters]);

  const fetchSalaryData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/salary?${new URLSearchParams(filters)}`);
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        setData(mockData);
      }
    } catch (error) {
      console.error('Error fetching salary data:', error);
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const mockData = {
    summary: {
      totalSalaryCost: 12500000,
      averageSalary: 185000,
      medianSalary: 165000,
      salaryGrowthRate: 8.5,
      costPerHeadcount: 192307,
      salaryVsRevenue: 0.32,
    },
    departmentComparison: [
      { name: '技术部', avgSalary: 220000, headcount: 25, growthRate: 12.5, budget: 5500000, spent: 5800000 },
      { name: '销售部', avgSalary: 180000, headcount: 30, growthRate: 9.2, budget: 5400000, spent: 5200000 },
      { name: '市场部', avgSalary: 150000, headcount: 20, growthRate: 7.8, budget: 3000000, spent: 2900000 },
      { name: '运营部', avgSalary: 160000, headcount: 22, growthRate: 8.3, budget: 3520000, spent: 3450000 },
      { name: '人力资源', avgSalary: 140000, headcount: 8, growthRate: 6.5, budget: 1120000, spent: 1150000 },
    ],
    salaryDistribution: [
      { range: '0-10万', count: 8, percentage: 12.3 },
      { range: '10-20万', count: 22, percentage: 33.8 },
      { range: '20-30万', count: 20, percentage: 30.8 },
      { range: '30-50万', count: 10, percentage: 15.4 },
      { range: '50万+', count: 5, percentage: 7.7 },
    ],
    marketComparison: [
      { level: '初级', current: 80000, market: 75000, competitiveness: 1.07, status: 'above' },
      { level: '中级', current: 150000, market: 140000, competitiveness: 1.07, status: 'above' },
      { level: '高级', current: 250000, market: 260000, competitiveness: 0.96, status: 'below' },
      { level: '专家', current: 400000, market: 420000, competitiveness: 0.95, status: 'below' },
    ],
    trends: {
      byQuarter: [
        { quarter: 'Q1', avgSalary: 175000, total: 3100000, growth: 0 },
        { quarter: 'Q2', avgSalary: 182000, total: 3200000, growth: 3.2 },
        { quarter: 'Q3', avgSalary: 188000, total: 3300000, growth: 3.1 },
        { quarter: 'Q4', avgSalary: 195000, total: 2900000, growth: 3.7 },
      ],
      byYear: [
        { year: '2021', avgSalary: 145000, growth: 8.5 },
        { year: '2022', avgSalary: 158000, growth: 9.0 },
        { year: '2023', avgSalary: 172000, growth: 8.9 },
        { year: '2024', avgSalary: 185000, growth: 7.6 },
      ],
    },
    recommendations: [
      {
        type: 'optimization',
        priority: 'high',
        title: '高级岗位薪酬竞争力不足',
        description: '高级和专家级岗位薪酬低于市场平均水平5-8%，影响人才保留',
        action: '建议将高级岗位薪酬提升至市场P75分位',
        impact: '预计降低关键人才流失率15-20%',
        budget: 800000,
      },
      {
        type: 'budget',
        priority: 'medium',
        title: '技术部预算超支',
        description: '技术部薪酬支出超出预算5.5%',
        action: '优化人员结构，控制初级岗位招聘，专注核心人才',
        impact: '预计降低薪酬成本3-4%',
        budget: -320000,
      },
      {
        type: 'efficiency',
        priority: 'medium',
        title: '薪酬与绩效关联性不足',
        description: '30%的员工薪酬增长与绩效表现不匹配',
        action: '强化绩效考核结果与薪酬调整的关联机制',
        impact: '提升人效10-15%',
        budget: 0,
      },
    ],
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">加载薪酬分析数据...</p>
        </div>
      </div>
    );
  }

  const currentData = data || mockData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard/analytics">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回
                </Button>
              </Link>
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-indigo-600 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">薪酬分析</h1>
                <p className="text-sm text-slate-500">薪酬成本与竞争力分析</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                导出报告
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>筛选条件</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="department">部门</Label>
                <Select
                  value={filters.department}
                  onValueChange={(value) => setFilters({ ...filters, department: value })}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="选择部门" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部部门</SelectItem>
                    <SelectItem value="tech">技术部</SelectItem>
                    <SelectItem value="sales">销售部</SelectItem>
                    <SelectItem value="marketing">市场部</SelectItem>
                    <SelectItem value="operations">运营部</SelectItem>
                    <SelectItem value="hr">人力资源</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="year">年份</Label>
                <Select
                  value={filters.year}
                  onValueChange={(value) => setFilters({ ...filters, year: value })}
                >
                  <SelectTrigger id="year">
                    <SelectValue placeholder="选择年份" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024年</SelectItem>
                    <SelectItem value="2023">2023年</SelectItem>
                    <SelectItem value="2022">2022年</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quarter">季度</Label>
                <Select
                  value={filters.quarter}
                  onValueChange={(value) => setFilters({ ...filters, quarter: value })}
                >
                  <SelectTrigger id="quarter">
                    <SelectValue placeholder="选择季度" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全年</SelectItem>
                    <SelectItem value="Q1">第一季度</SelectItem>
                    <SelectItem value="Q2">第二季度</SelectItem>
                    <SelectItem value="Q3">第三季度</SelectItem>
                    <SelectItem value="Q4">第四季度</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">年度薪酬总额</CardTitle>
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(currentData.summary.totalSalaryCost)}
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500">+{currentData.summary.salaryGrowthRate}%</span>
                <span className="text-slate-500 ml-2">较上年</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">平均薪酬</CardTitle>
              <Users className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(currentData.summary.averageSalary)}
              </div>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-slate-500">中位数: {formatCurrency(currentData.summary.medianSalary)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">人均成本</CardTitle>
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(currentData.summary.costPerHeadcount)}
              </div>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-slate-500">营收占比: {currentData.summary.salaryVsRevenue * 100}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Comparison */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle>部门薪酬对比</CardTitle>
            <CardDescription>各部门薪酬水平与预算执行情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentData.departmentComparison.map((dept: any, index: number) => {
                const budgetUsage = (dept.spent / dept.budget) * 100;
                return (
                  <div key={index} className="p-4 bg-white border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-slate-900">{dept.name}</h3>
                        <Badge variant={budgetUsage > 100 ? 'destructive' : 'secondary'}>
                          预算: {(dept.spent / dept.budget * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-500">+{dept.growthRate}%</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-slate-500">平均薪酬</div>
                        <div className="font-semibold text-slate-900">{formatCurrency(dept.avgSalary)}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">人数</div>
                        <div className="font-semibold text-slate-900">{dept.headcount}人</div>
                      </div>
                      <div>
                        <div className="text-slate-500">年度预算</div>
                        <div className="font-semibold text-slate-900">{formatCurrency(dept.budget)}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">已支出</div>
                        <div className="font-semibold text-slate-900">{formatCurrency(dept.spent)}</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${budgetUsage > 100 ? 'bg-red-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(budgetUsage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Market Comparison */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle>市场竞争力对比</CardTitle>
            <CardDescription>薪酬水平与市场平均水平的对比</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentData.marketComparison.map((item: any, index: number) => (
                <div key={index} className="p-4 bg-white border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-slate-900">{item.level}</h3>
                      <Badge variant={item.status === 'above' ? 'default' : 'destructive'}>
                        {item.status === 'above' ? '高于市场' : '低于市场'}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500">竞争力指数</div>
                      <div className={`text-lg font-bold ${item.status === 'above' ? 'text-green-600' : 'text-red-600'}`}>
                        {(item.competitiveness * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-slate-500">当前平均</div>
                      <div className="font-semibold text-slate-900">{formatCurrency(item.current)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">市场平均</div>
                      <div className="font-semibold text-slate-900">{formatCurrency(item.market)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>优化建议</CardTitle>
            <CardDescription>基于数据的薪酬优化建议</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentData.recommendations.map((rec: any, index: number) => (
                <div key={index} className={`p-4 border rounded-lg ${
                  rec.type === 'optimization' ? 'bg-blue-50 border-blue-200' :
                  rec.type === 'budget' ? 'bg-orange-50 border-orange-200' :
                  'bg-emerald-50 border-emerald-200'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                          {rec.priority === 'high' ? '高优先级' : '中优先级'}
                        </Badge>
                        <h3 className="font-semibold text-slate-900">{rec.title}</h3>
                      </div>
                      <p className="text-sm text-slate-600">{rec.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`text-lg font-bold ${rec.budget > 0 ? 'text-red-600' : rec.budget < 0 ? 'text-green-600' : 'text-slate-600'}`}>
                        {rec.budget > 0 ? '+' : ''}{formatCurrency(rec.budget)}
                      </div>
                      <div className="text-sm text-slate-500">预算影响</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="font-medium text-slate-700">建议：</span>
                      <span className="text-slate-600">{rec.action}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="font-medium text-slate-700">预期效果：</span>
                      <span className="text-slate-600">{rec.impact}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
