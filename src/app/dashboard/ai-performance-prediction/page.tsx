'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  BarChart3,
  AlertCircle,
  RefreshCw,
  Download,
  Search,
  Target,
  Brain,
  Zap,
  Calendar,
  User,
  Building2,
  CheckCircle2,
  ShieldAlert,
  Lightbulb,
  Rocket,
  LineChart,
  PieChart,
  Filter,
  MoreVertical,
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  avatar?: string;
  department: string;
  position: string;
  level: string;
}

interface HistoricalData {
  scores: number[];
  cycles: string[];
  avgScore: number;
}

interface PredictionResult {
  employeeId: string;
  employeeName: string;
  predictionPeriod: string;
  predictionDate: string;
  historicalData: HistoricalData;
  finalPrediction: {
    predictedScore: number;
    trend: 'up' | 'down' | 'stable';
    confidence: number;
    dimensions: {
      workQuality: number;
      efficiency: number;
      collaboration: number;
      innovation: number;
    };
    strengths: string[];
    risks: string[];
    recommendations: string[];
    keyFactors: {
      factor: string;
      impact: number;
      description: string;
    }[];
  };
  riskLevel: 'low' | 'medium' | 'high';
}

export default function AIPerformancePredictionPage() {
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | PredictionResult['riskLevel']>('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionResult | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      setPredictions([
        {
          employeeId: 'EMP001',
          employeeName: '张三',
          predictionPeriod: '2025 Q2',
          predictionDate: '2025-04-18',
          historicalData: {
            scores: [85, 88, 90, 89, 92, 91],
            cycles: ['2024 Q3', '2024 Q4', '2025 Q1', '2025 Q2', '2025 Q3', '2025 Q4'],
            avgScore: 89.2,
          },
          finalPrediction: {
            predictedScore: 93,
            trend: 'up',
            confidence: 0.92,
            dimensions: { workQuality: 94, efficiency: 92, collaboration: 91, innovation: 93 },
            strengths: ['技术能力持续提升', '团队协作表现优异', '创新能力强'],
            risks: ['工作负荷较重', '缺乏管理经验'],
            recommendations: ['适当分配工作负荷', '提供管理培训机会'],
            keyFactors: [
              { factor: '技术能力', impact: 0.85, description: '技术能力是主要驱动因素' },
              { factor: '团队协作', impact: 0.78, description: '团队协作对绩效有积极影响' },
            ],
          },
          riskLevel: 'low',
        },
        {
          employeeId: 'EMP002',
          employeeName: '李四',
          predictionPeriod: '2025 Q2',
          predictionDate: '2025-04-18',
          historicalData: {
            scores: [82, 80, 85, 84, 83, 85],
            cycles: ['2024 Q3', '2024 Q4', '2025 Q1', '2025 Q2', '2025 Q3', '2025 Q4'],
            avgScore: 83.2,
          },
          finalPrediction: {
            predictedScore: 84,
            trend: 'stable',
            confidence: 0.88,
            dimensions: { workQuality: 85, efficiency: 83, collaboration: 85, innovation: 82 },
            strengths: ['沟通能力强', '用户洞察敏锐'],
            risks: ['技术理解有限', '数据分析能力需提升'],
            recommendations: ['加强技术学习', '提升数据分析能力'],
            keyFactors: [
              { factor: '沟通能力', impact: 0.82, description: '沟通能力是关键优势' },
              { factor: '产品思维', impact: 0.80, description: '产品思维推动绩效提升' },
            ],
          },
          riskLevel: 'medium',
        },
        {
          employeeId: 'EMP003',
          employeeName: '王五',
          predictionPeriod: '2025 Q2',
          predictionDate: '2025-04-18',
          historicalData: {
            scores: [78, 75, 80, 76, 74, 72],
            cycles: ['2024 Q3', '2024 Q4', '2025 Q1', '2025 Q2', '2025 Q3', '2025 Q4'],
            avgScore: 75.8,
          },
          finalPrediction: {
            predictedScore: 71,
            trend: 'down',
            confidence: 0.85,
            dimensions: { workQuality: 72, efficiency: 70, collaboration: 74, innovation: 68 },
            strengths: ['责任心强'],
            risks: ['工作效率下降', '团队协作不足', '缺乏创新'],
            recommendations: ['及时沟通了解困难', '提供技能培训', '调整工作分配'],
            keyFactors: [
              { factor: '工作态度', impact: 0.75, description: '工作态度是主要影响因素' },
              { factor: '技能水平', impact: 0.68, description: '技能水平有待提升' },
            ],
          },
          riskLevel: 'high',
        },
        {
          employeeId: 'EMP004',
          employeeName: '赵六',
          predictionPeriod: '2025 Q2',
          predictionDate: '2025-04-18',
          historicalData: {
            scores: [88, 90, 89, 91, 92, 90],
            cycles: ['2024 Q3', '2024 Q4', '2025 Q1', '2025 Q2', '2025 Q3', '2025 Q4'],
            avgScore: 90.0,
          },
          finalPrediction: {
            predictedScore: 91,
            trend: 'up',
            confidence: 0.90,
            dimensions: { workQuality: 92, efficiency: 91, collaboration: 90, innovation: 89 },
            strengths: ['全面发展', '执行力强'],
            risks: [],
            recommendations: ['继续保持良好表现', '考虑晋升机会'],
            keyFactors: [
              { factor: '综合能力', impact: 0.88, description: '综合能力均衡发展' },
            ],
          },
          riskLevel: 'low',
        },
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const departments = useMemo(() => {
    return ['技术部', '产品部', '市场部', '销售部'];
  }, []);

  const filteredPredictions = useMemo(() => {
    return predictions.filter((prediction) => {
      const matchesSearch =
        prediction.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === 'all' || prediction.riskLevel === riskFilter;
      const matchesDepartment = departmentFilter === 'all';
      return matchesSearch && matchesRisk && matchesDepartment;
    });
  }, [predictions, searchTerm, riskFilter, departmentFilter]);

  const stats = useMemo(() => {
    return {
      total: predictions.length,
      highRisk: predictions.filter((p) => p.riskLevel === 'high').length,
      mediumRisk: predictions.filter((p) => p.riskLevel === 'medium').length,
      lowRisk: predictions.filter((p) => p.riskLevel === 'low').length,
      avgPredictedScore: predictions.reduce((sum, p) => sum + p.finalPrediction.predictedScore, 0) / predictions.length,
      avgConfidence: predictions.reduce((sum, p) => sum + p.finalPrediction.confidence, 0) / predictions.length,
    };
  }, [predictions]);

  const getRiskBadge = (risk: PredictionResult['riskLevel']) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };
    const labels: Record<string, string> = {
      low: '低风险',
      medium: '中风险',
      high: '高风险',
    };
    return <Badge className={colors[risk]}>{labels[risk]}</Badge>;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <LineChart className="h-4 w-4 text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI绩效预测</h1>
          <p className="text-muted-foreground mt-1">利用AI技术预测员工未来绩效表现</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新预测
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出报告
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">预测总数</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">覆盖率 100%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">高风险</CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.highRisk}</div>
            <p className="text-xs text-muted-foreground mt-1">
              占比 {((stats.highRisk / stats.total) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">中风险</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.mediumRisk}</div>
            <p className="text-xs text-muted-foreground mt-1">
              占比 {((stats.mediumRisk / stats.total) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">低风险</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.lowRisk}</div>
            <p className="text-xs text-muted-foreground mt-1">
              占比 {((stats.lowRisk / stats.total) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均置信度</CardTitle>
            <Brain className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{(stats.avgConfidence * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">AI模型可信度</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>预测结果 ({filteredPredictions.length})</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索员工..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={riskFilter} onValueChange={(v) => setRiskFilter(v as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="风险等级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部风险</SelectItem>
                  <SelectItem value="low">低风险</SelectItem>
                  <SelectItem value="medium">中风险</SelectItem>
                  <SelectItem value="high">高风险</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPredictions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              没有找到匹配的预测结果
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>员工</TableHead>
                    <TableHead>历史平均</TableHead>
                    <TableHead>预测得分</TableHead>
                    <TableHead>趋势</TableHead>
                    <TableHead>置信度</TableHead>
                    <TableHead>风险等级</TableHead>
                    <TableHead>预测周期</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPredictions.map((prediction) => (
                    <TableRow key={prediction.employeeId}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {prediction.employeeName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{prediction.employeeName}</p>
                            <p className="text-xs text-muted-foreground">{prediction.employeeId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{prediction.historicalData.avgScore.toFixed(1)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-lg">
                          {prediction.finalPrediction.predictedScore}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(prediction.finalPrediction.trend)}
                          <span className="text-sm">
                            {prediction.finalPrediction.trend === 'up' ? '上升' : prediction.finalPrediction.trend === 'down' ? '下降' : '稳定'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={prediction.finalPrediction.confidence * 100} className="w-16 h-2" />
                          <span className="text-sm">{(prediction.finalPrediction.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{getRiskBadge(prediction.riskLevel)}</TableCell>
                      <TableCell>{prediction.predictionPeriod}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => { setSelectedPrediction(prediction); setViewDialogOpen(true); }}
                        >
                          查看详情
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>预测详情</DialogTitle>
          </DialogHeader>
          {selectedPrediction && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6">
                <div className="flex items-start gap-4 pb-4 border-b">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {selectedPrediction.employeeName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{selectedPrediction.employeeName}</h3>
                    <div className="flex items-center gap-3 mb-2">
                      {getRiskBadge(selectedPrediction.riskLevel)}
                      <div className="flex items-center gap-1">
                        {getTrendIcon(selectedPrediction.finalPrediction.trend)}
                        <span className="text-sm text-muted-foreground">
                          {selectedPrediction.finalPrediction.trend === 'up' ? '上升趋势' : selectedPrediction.finalPrediction.trend === 'down' ? '下降趋势' : '稳定趋势'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      预测周期: {selectedPrediction.predictionPeriod}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className={`p-4 rounded-lg ${
                      selectedPrediction.riskLevel === 'high' ? 'bg-red-50' :
                      selectedPrediction.riskLevel === 'medium' ? 'bg-yellow-50' : 'bg-green-50'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="h-6 w-6 text-amber-500" />
                        <span className="text-sm text-muted-foreground">预测得分</span>
                      </div>
                      <p className={`text-3xl font-bold ${
                        selectedPrediction.riskLevel === 'high' ? 'text-red-600' :
                        selectedPrediction.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {selectedPrediction.finalPrediction.predictedScore}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        历史数据
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">历史平均</span>
                          <span className="font-semibold">{selectedPrediction.historicalData.avgScore.toFixed(1)}</span>
                        </div>
                        <div className="space-y-2">
                          {selectedPrediction.historicalData.cycles.map((cycle, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">{cycle}</span>
                              <span>{selectedPrediction.historicalData.scores[idx]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <PieChart className="h-4 w-4" />
                        维度预测
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(selectedPrediction.finalPrediction.dimensions).map(([key, value]) => (
                          <div key={key}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground capitalize">{key}</span>
                              <span className="font-medium">{value}</span>
                            </div>
                            <Progress value={value} />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {selectedPrediction.finalPrediction.strengths.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-600" />
                        优势分析
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedPrediction.finalPrediction.strengths.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {selectedPrediction.finalPrediction.risks.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-red-600" />
                        风险提示
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedPrediction.finalPrediction.risks.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {selectedPrediction.finalPrediction.recommendations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                        改进建议
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedPrediction.finalPrediction.recommendations.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Rocket className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {selectedPrediction.finalPrediction.keyFactors.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Target className="h-4 w-4 text-purple-600" />
                        关键影响因素
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedPrediction.finalPrediction.keyFactors.map((factor, idx) => (
                          <div key={idx} className="p-3 bg-muted rounded">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{factor.factor}</span>
                              <Badge variant="outline">{(factor.impact * 100).toFixed(0)}%</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{factor.description}</p>
                            <Progress value={factor.impact * 100} className="mt-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="text-xs text-muted-foreground pt-4 border-t">
                  <p>预测日期: {selectedPrediction.predictionDate}</p>
                  <p>置信度: {(selectedPrediction.finalPrediction.confidence * 100).toFixed(1)}%</p>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              关闭
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出报告
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
