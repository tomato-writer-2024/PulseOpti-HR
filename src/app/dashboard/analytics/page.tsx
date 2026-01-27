'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Download,
  RefreshCw,
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Eye,
  ArrowUp,
  ArrowDown,
  Target,
  Sparkles,
  PieChart,
  LineChart,
  Clock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  FileText,
  Award,
  Zap,
  Building2,
  Briefcase,
} from 'lucide-react';

interface MetricData {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
}

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  joinDate: string;
  salary: number;
  performance: number;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [activeTab, setActiveTab] = useState('overview');

  const [employeeData, setEmployeeData] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      setEmployeeData([
        { id: '1', name: '张三', department: '技术部', position: '高级前端工程师', joinDate: '2022-01-15', salary: 30000, performance: 92 },
        { id: '2', name: '李四', department: '产品部', position: '高级产品经理', joinDate: '2021-06-01', salary: 35000, performance: 88 },
        { id: '3', name: '王五', department: '技术部', position: '后端工程师', joinDate: '2022-03-10', salary: 25000, performance: 85 },
        { id: '4', name: '赵六', department: '市场部', position: '市场专员', joinDate: '2023-01-20', salary: 18000, performance: 82 },
        { id: '5', name: '孙七', department: '销售部', position: '销售经理', joinDate: '2021-11-05', salary: 22000, performance: 90 },
      ]);
      setLoading(false);
    };
    fetchData();
  }, [timeRange]);

  const overviewMetrics = useMemo(() => {
    return [
      { label: '总员工数', value: 156, change: 12, trend: 'up' as const, icon: Users, color: 'blue' },
      { label: '本月入职', value: 8, change: 3, trend: 'up' as const, icon: TrendingUp, color: 'green' },
      { label: '本月离职', value: 3, change: -2, trend: 'down' as const, icon: TrendingDown, color: 'red' },
      { label: '平均薪资', value: 28500, change: 1500, trend: 'up' as const, icon: DollarSign, color: 'purple' },
    ];
  }, []);

  const departmentStats = useMemo(() => {
    return [
      { name: '技术部', count: 45, avgSalary: 28000, growth: 15 },
      { name: '产品部', count: 18, avgSalary: 32000, growth: 8 },
      { name: '市场部', count: 32, avgSalary: 18000, growth: 20 },
      { name: '销售部', count: 28, avgSalary: 22000, growth: 12 },
      { name: '人力资源部', count: 12, avgSalary: 24000, growth: 5 },
    ];
  }, []);

  const recruitmentTrend = useMemo(() => {
    return [
      { month: '1月', applications: 45, hired: 12 },
      { month: '2月', applications: 52, hired: 15 },
      { month: '3月', applications: 68, hired: 18 },
      { month: '4月', applications: 72, hired: 20 },
      { month: '5月', applications: 65, hired: 17 },
    ];
  }, []);

  const attendanceRate = useMemo(() => {
    return [
      { week: '第1周', rate: 96.5 },
      { week: '第2周', rate: 97.2 },
      { week: '第3周', rate: 95.8 },
      { week: '第4周', rate: 98.1 },
    ];
  }, []);

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up') {
      return (
        <div className="flex items-center text-green-600">
          <ArrowUp className="h-4 w-4 mr-1" />
          <span>+{change}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center text-red-600">
        <ArrowDown className="h-4 w-4 mr-1" />
        <span>{change}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => <Skeleton key={i} className="h-96" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">统计分析</h1>
          <p className="text-muted-foreground mt-1">数据洞察与趋势分析</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">本周</SelectItem>
              <SelectItem value="month">本月</SelectItem>
              <SelectItem value="quarter">本季度</SelectItem>
              <SelectItem value="year">本年</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {overviewMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          const colorClass = {
            blue: 'text-blue-600 bg-blue-100',
            green: 'text-green-600 bg-green-100',
            red: 'text-red-600 bg-red-100',
            purple: 'text-purple-600 bg-purple-100',
          }[metric.color];
          return (
            <Card key={idx}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value.toLocaleString()}</div>
                <div className="flex items-center mt-2">
                  {getTrendIcon(metric.trend, metric.change)}
                  <span className="text-xs text-muted-foreground ml-2">较上期</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            概览
          </TabsTrigger>
          <TabsTrigger value="departments">
            <Building2 className="h-4 w-4 mr-2" />
            部门分析
          </TabsTrigger>
          <TabsTrigger value="recruitment">
            <Briefcase className="h-4 w-4 mr-2" />
            招聘分析
          </TabsTrigger>
          <TabsTrigger value="performance">
            <Award className="h-4 w-4 mr-2" />
            绩效分析
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  考勤率趋势
                </CardTitle>
                <CardDescription>近四周考勤率变化</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attendanceRate.map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{item.week}</span>
                        <span className="font-semibold">{item.rate}%</span>
                      </div>
                      <Progress value={item.rate} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  员工分布
                </CardTitle>
                <CardDescription>按部门分布情况</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentStats.map((dept, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{dept.name}</span>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{dept.count}人</Badge>
                          <span className="text-muted-foreground">¥{dept.avgSalary.toLocaleString()}</span>
                        </div>
                      </div>
                      <Progress value={(dept.count / 156) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                关键指标
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">95.2%</div>
                  <div className="text-sm text-muted-foreground">平均考勤率</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">87.5</div>
                  <div className="text-sm text-muted-foreground">平均绩效分</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">¥28.5K</div>
                  <div className="text-sm text-muted-foreground">平均月薪</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">2.8年</div>
                  <div className="text-sm text-muted-foreground">平均工龄</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>部门数据对比</CardTitle>
              <CardDescription>各部门关键指标对比</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>部门</TableHead>
                      <TableHead>人数</TableHead>
                      <TableHead>平均薪资</TableHead>
                      <TableHead>增长率</TableHead>
                      <TableHead>平均绩效</TableHead>
                      <TableHead>考勤率</TableHead>
                      <TableHead>离职率</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departmentStats.map((dept, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{dept.name}</TableCell>
                        <TableCell>{dept.count}</TableCell>
                        <TableCell>¥{dept.avgSalary.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className="text-green-600">+{dept.growth}%</span>
                        </TableCell>
                        <TableCell>85-92</TableCell>
                        <TableCell>94-98%</TableCell>
                        <TableCell>2-5%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recruitment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                招聘趋势
              </CardTitle>
              <CardDescription>申请数与录用数对比</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recruitmentTrend.map((item, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.month}</span>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                          <span>申请: {item.applications}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <span>录用: {item.hired}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Progress value={item.applications} className="h-2" />
                      <Progress value={item.hired} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>招聘漏斗</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { stage: '简历投递', count: 350, rate: 100 },
                  { stage: '简历筛选', count: 175, rate: 50 },
                  { stage: '初试', count: 105, rate: 30 },
                  { stage: '复试', count: 63, rate: 18 },
                  { stage: '录用', count: 35, rate: 10 },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.stage}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{item.count}</span>
                        <Badge variant="outline">{item.rate}%</Badge>
                      </div>
                    </div>
                    <Progress value={item.rate} className="h-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>绩效分布</CardTitle>
              <CardDescription>员工绩效等级分布</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { grade: 'A', count: 25, color: 'bg-green-100 text-green-800' },
                  { grade: 'B', count: 98, color: 'bg-blue-100 text-blue-800' },
                  { grade: 'C', count: 28, color: 'bg-yellow-100 text-yellow-800' },
                  { grade: 'D', count: 5, color: 'bg-red-100 text-red-800' },
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-lg ${item.color}`}>
                    <div className="text-3xl font-bold">{item.count}</div>
                    <div className="text-sm mt-1">{item.grade}等级</div>
                    <div className="text-xs mt-1">
                      {((item.count / 156) * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>高绩效员工</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {employeeData
                  .filter((e) => e.performance >= 90)
                  .slice(0, 5)
                  .map((employee, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {employee.department} · {employee.position}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{employee.performance}</div>
                        <div className="text-xs text-muted-foreground">绩效得分</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
