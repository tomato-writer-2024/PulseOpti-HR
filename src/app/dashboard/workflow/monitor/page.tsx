'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, Clock, AlertCircle, CheckCircle, TrendingUp, BarChart3 } from 'lucide-react';

export default function WorkflowMonitorPage() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [metrics, setMetrics] = useState({
    totalExecutions: 0,
    successfulExecutions: 0,
    failedExecutions: 0,
    avgExecutionTime: 0,
    successRate: 0,
    avgCompletionTime: 0,
    bottleneckNodes: [] as Array<{ name: string; avgTime: number }>,
    topWorkflows: [] as Array<{ name: string; executions: number; avgTime: number }>,
  });

  useEffect(() => {
    setTimeout(() => {
      setMetrics({
        totalExecutions: 1256,
        successfulExecutions: 1180,
        failedExecutions: 76,
        avgExecutionTime: 45,
        successRate: 94.0,
        avgCompletionTime: 2.5,
        bottleneckNodes: [
          { name: '部门经理审批', avgTime: 120 },
          { name: '技术面试', avgTime: 90 },
          { name: '财务审核', avgTime: 75 },
        ],
        topWorkflows: [
          { name: '请假审批流程', executions: 456, avgTime: 1.8 },
          { name: '费用报销流程', executions: 324, avgTime: 3.2 },
          { name: '招聘审批流程', executions: 234, avgTime: 4.5 },
        ],
      });
      setLoading(false);
    }, 500);
  }, [timeRange]);

  if (loading) {
    return <div className="space-y-6"><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">工作流监控</h1>
          <p className="text-muted-foreground mt-1">监控工作流运行状态和性能</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="时间范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">今天</SelectItem>
              <SelectItem value="7d">最近7天</SelectItem>
              <SelectItem value="30d">最近30天</SelectItem>
              <SelectItem value="90d">最近90天</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">导出报告</Button>
        </div>
      </div>

      {/* 核心指标 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              总执行次数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.totalExecutions}</div>
            <p className="text-xs text-muted-foreground mt-1">所选时间范围内</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              成功执行
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.successfulExecutions}</div>
            <p className="text-xs text-green-600 mt-1">
              {metrics.successRate.toFixed(1)}% 成功率
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              失败执行
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.failedExecutions}</div>
            <p className="text-xs text-red-600 mt-1">
              {((metrics.failedExecutions / metrics.totalExecutions) * 100).toFixed(1)}% 失败率
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              平均执行时间
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.avgExecutionTime}分钟</div>
            <p className="text-xs text-muted-foreground mt-1">每个工作流平均</p>
          </CardContent>
        </Card>
      </div>

      {/* 趋势图表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>执行趋势</CardTitle>
            <CardDescription>工作流执行数量趋势</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/10 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">图表开发中...</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>成功率趋势</CardTitle>
            <CardDescription>工作流执行成功率变化</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/10 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">图表开发中...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 热门工作流 */}
      <Card>
        <CardHeader>
          <CardTitle>热门工作流</CardTitle>
          <CardDescription>使用最频繁的工作流</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.topWorkflows.map((workflow, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 font-bold">
                      {index + 1}
                    </div>
                    <h3 className="font-semibold">{workflow.name}</h3>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 text-right">
                  <div>
                    <p className="text-xs text-muted-foreground">执行次数</p>
                    <p className="font-semibold">{workflow.executions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">平均耗时</p>
                    <p className="font-semibold">{workflow.avgTime}小时</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 性能瓶颈 */}
      <Card>
        <CardHeader>
          <CardTitle>性能瓶颈分析</CardTitle>
          <CardDescription>执行时间最长的节点</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.bottleneckNodes.map((node, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{node.name}</h3>
                  <span className="text-sm text-muted-foreground">平均 {node.avgTime}分钟</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all"
                    style={{ width: `${(node.avgTime / 120) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 性能指标 */}
      <Card>
        <CardHeader>
          <CardTitle>性能指标</CardTitle>
          <CardDescription>关键性能指标监控</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">平均完成时间</p>
              <p className="text-3xl font-bold">{metrics.avgCompletionTime}小时</p>
              <p className="text-xs text-green-600 mt-1">↓ 0.5小时 优化</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">系统响应时间</p>
              <p className="text-3xl font-bold">0.8秒</p>
              <p className="text-xs text-muted-600 mt-1">正常范围</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">并发处理能力</p>
              <p className="text-3xl font-bold">100/秒</p>
              <p className="text-xs text-green-600 mt-1">↑ 20% 提升</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
