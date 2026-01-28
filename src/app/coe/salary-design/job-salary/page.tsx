'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader, createProPageHeader } from '@/components/layout/page-header';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Building2,
  Users,
  Search,
  Filter,
  Download,
  FileText,
  Shield,
  Zap,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Briefcase,
  Star,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

// 模拟行业薪酬数据
const industrySalaryData = [
  {
    id: 1,
    position: '高级软件工程师',
    level: 'P5',
    industry: {
      internet: { p25: 25000, p50: 32000, p75: 40000, p90: 48000, avg: 36000 },
      finance: { p25: 28000, p50: 35000, p75: 43000, p90: 52000, avg: 39500 },
      manufacturing: { p25: 22000, p50: 28000, p75: 35000, p90: 42000, avg: 31750 },
    },
    company: { avg: 28000, median: 27000, max: 35000, min: 22000 },
    marketPosition: 'low',
    recommendedAction: '建议调薪10-15%',
  },
  {
    id: 2,
    position: '产品经理',
    level: 'P4',
    industry: {
      internet: { p25: 20000, p50: 28000, p75: 38000, p90: 48000, avg: 33500 },
      finance: { p25: 22000, p50: 30000, p75: 40000, p90: 50000, avg: 35500 },
      manufacturing: { p25: 18000, p50: 25000, p75: 35000, p90: 45000, avg: 30750 },
    },
    company: { avg: 26000, median: 25000, max: 32000, min: 20000 },
    marketPosition: 'medium',
    recommendedAction: '建议保持当前水平',
  },
  {
    id: 3,
    position: '销售经理',
    level: 'M3',
    industry: {
      internet: { p25: 18000, p50: 25000, p75: 35000, p90: 45000, avg: 30750 },
      finance: { p25: 20000, p50: 28000, p75: 38000, p90: 48000, avg: 33500 },
      manufacturing: { p25: 16000, p50: 22000, p75: 30000, p90: 40000, avg: 27000 },
    },
    company: { avg: 22000, median: 21000, max: 28000, min: 18000 },
    marketPosition: 'low',
    recommendedAction: '建议调薪12-18%',
  },
  {
    id: 4,
    position: '数据分析师',
    level: 'P3',
    industry: {
      internet: { p25: 15000, p50: 20000, p75: 28000, p90: 35000, avg: 24500 },
      finance: { p25: 17000, p50: 23000, p75: 30000, p90: 38000, avg: 27000 },
      manufacturing: { p25: 13000, p50: 18000, p75: 25000, p90: 32000, avg: 22000 },
    },
    company: { avg: 18000, median: 17500, max: 22000, min: 15000 },
    marketPosition: 'low',
    recommendedAction: '建议调薪15-20%',
  },
  {
    id: 5,
    position: 'UI/UX设计师',
    level: 'P3',
    industry: {
      internet: { p25: 14000, p50: 19000, p75: 27000, p90: 34000, avg: 23500 },
      finance: { p25: 16000, p50: 22000, p75: 29000, p90: 37000, avg: 26000 },
      manufacturing: { p25: 12000, p50: 17000, p75: 24000, p90: 31000, avg: 21000 },
    },
    company: { avg: 17000, median: 16500, max: 21000, min: 14000 },
    marketPosition: 'medium',
    recommendedAction: '建议保持当前水平',
  },
];

// 薪酬差异分析
const salaryGapAnalysis = [
  {
    category: '严重偏低',
    count: 2,
    gapRange: '15-25%',
    risk: 'high',
    impact: '离职风险较高',
  },
  {
    category: '略低于市场',
    count: 1,
    gapRange: '5-15%',
    risk: 'medium',
    impact: '影响人才竞争力',
  },
  {
    category: '与市场持平',
    count: 2,
    gapRange: '±5%',
    risk: 'low',
    impact: '竞争力一般',
  },
];

export default function JobSalaryPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('internet');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');

  // 过滤数据
  const filteredData = industrySalaryData.filter(item => {
    const matchSearch = item.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLevel = selectedLevel === 'all' || item.level === selectedLevel;
    return matchSearch && matchLevel;
  });

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <PageHeader {...createProPageHeader({
        icon: Target,
        title: '岗位薪酬对标',
        description: '实时对比行业薪酬水平，科学制定薪酬策略，提升人才竞争力',
        badge: { text: 'PRO', color: 'from-orange-600 to-red-600' },
        extraActions: (
          <div className="flex items-center gap-2">
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-[140px]">
                <Building2 className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="internet">互联网行业</SelectItem>
                <SelectItem value="finance">金融行业</SelectItem>
                <SelectItem value="manufacturing">制造业</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出报告
            </Button>
            <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
              <Zap className="h-4 w-4 mr-2" />
              AI智能分析
            </Button>
          </div>
        )
      })} />

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索职位..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有职级</SelectItem>
                <SelectItem value="P3">P3级</SelectItem>
                <SelectItem value="P4">P4级</SelectItem>
                <SelectItem value="P5">P5级</SelectItem>
                <SelectItem value="M3">M3级</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 薪酬差异分析 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {salaryGapAnalysis.map((item, index) => (
          <Card key={index} className={
            item.risk === 'high' ? 'border-red-200 dark:border-red-800' :
            item.risk === 'medium' ? 'border-yellow-200 dark:border-yellow-800' :
            'border-green-200 dark:border-green-800'
          }>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge className={
                  item.risk === 'high' ? 'bg-red-100 text-red-600' :
                  item.risk === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }>
                  {item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                </Badge>
                <span className="text-2xl font-bold">{item.count}</span>
              </div>
              <h4 className="font-medium mb-1">{item.category}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.impact}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 薪酬对标表格 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            薪酬对标详情
          </CardTitle>
          <CardDescription>
            {selectedIndustry === 'internet' && '互联网行业'}
            {selectedIndustry === 'finance' && '金融行业'}
            {selectedIndustry === 'manufacturing' && '制造业'}
            薪酬水平对比
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredData.map((item) => {
              const industryData = item.industry[selectedIndustry as keyof typeof item.industry];
              const marketRatio = (item.company.avg / industryData.p50) * 100;
              const gap = ((industryData.p50 - item.company.avg) / industryData.p50) * 100;

              return (
                <Card key={item.id} className={
                  item.marketPosition === 'low' ? 'border-red-200 dark:border-red-800' :
                  item.marketPosition === 'high' ? 'border-green-200 dark:border-green-800' :
                  'border-yellow-200 dark:border-yellow-800'
                }>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-semibold">{item.position}</h4>
                          <Badge variant="outline">{item.level}</Badge>
                          <Badge className={
                            item.marketPosition === 'low' ? 'bg-red-100 text-red-600' :
                            item.marketPosition === 'high' ? 'bg-green-100 text-green-600' :
                            'bg-yellow-100 text-yellow-600'
                          }>
                            {item.marketPosition === 'low' ? '低于市场' :
                             item.marketPosition === 'high' ? '高于市场' : '持平'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.recommendedAction}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          ¥{item.company.avg.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          公司平均
                        </p>
                      </div>
                    </div>

                    {/* 薪酬对比图表 */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                      <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">P25</p>
                        <p className="text-sm font-bold">¥{industryData.p25.toLocaleString()}</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">P50</p>
                        <p className="text-sm font-bold">¥{industryData.p50.toLocaleString()}</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">P75</p>
                        <p className="text-sm font-bold">¥{industryData.p75.toLocaleString()}</p>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">P90</p>
                        <p className="text-sm font-bold">¥{industryData.p90.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">行业平均</p>
                        <p className="text-sm font-bold">¥{industryData.avg.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* 市场位置 */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">市场位置</span>
                        <span className="text-sm font-medium">{marketRatio.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            marketRatio < 80 ? 'bg-red-500' :
                            marketRatio < 100 ? 'bg-yellow-500' :
                            marketRatio < 120 ? 'bg-green-500' :
                            'bg-purple-500'
                          }`}
                          style={{ width: `${Math.min(marketRatio, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">0%</span>
                        <span className="text-gray-500">50%</span>
                        <span className="text-gray-500">100%</span>
                        <span className="text-gray-500">150%+</span>
                      </div>
                    </div>

                    {/* 差距分析 */}
                    {gap > 0 && (
                      <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-red-600">
                            低于行业平均{gap.toFixed(1)}%
                          </span>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          查看调薪方案
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 调薪建议 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            调薪建议
          </CardTitle>
          <CardDescription>
            基于市场对标结果，为偏低薪酬岗位提供调薪建议
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredData
              .filter(item => item.marketPosition === 'low')
              .map((item, index) => (
                <div key={index} className="p-4 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.position}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.recommendedAction}</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => toast.success('已添加到调薪计划')}>
                      <Award className="h-4 w-4 mr-2" />
                      添加到调薪计划
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
