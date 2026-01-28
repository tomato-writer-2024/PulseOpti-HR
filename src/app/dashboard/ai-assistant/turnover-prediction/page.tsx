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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Sparkles,
  Search,
  TrendingDown,
  AlertTriangle,
  Shield,
  Users,
  DollarSign,
  Clock,
  Award,
  BarChart,
  Download,
  RefreshCw,
  Eye,
  User,
  Calendar,
  Building,
  ArrowDown,
  ArrowUp,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

interface RiskFactor {
  name: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  description: string;
}

interface TurnoverRisk {
  employeeId: string;
  name: string;
  avatar: string;
  department: string;
  position: string;
  tenure: number;
  riskLevel: RiskLevel;
  riskScore: number;
  trend: 'up' | 'down' | 'stable';
  lastMonthRisk: number;
  keyRiskFactors: RiskFactor[];
  predictions: {
    probability3Month: number;
    probability6Month: number;
  };
  recommendations: string[];
  lastUpdated: string;
}

export default function AIAssistantTurnoverPredictionPage() {
  const [risks, setRisks] = useState<TurnoverRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<TurnoverRisk | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  useEffect(() => {
    // 模拟获取离职风险数据
    setTimeout(() => {
      setRisks([
        {
          employeeId: 'E001',
          name: '张三',
          avatar: 'ZS',
          department: '技术部',
          position: '高级前端工程师',
          tenure: 2.5,
          riskLevel: 'high',
          riskScore: 72,
          trend: 'up',
          lastMonthRisk: 65,
          keyRiskFactors: [
            { name: '薪酬竞争力不足', impact: 'high', description: '低于市场平均水平15%' },
            { name: '工作压力过大', impact: 'medium', description: '连续加班超过3个月' },
            { name: '晋升通道不清晰', impact: 'medium', description: '职业发展缺乏规划' },
          ],
          predictions: {
            probability3Month: 45,
            probability6Month: 68,
          },
          recommendations: [
            '及时进行绩效沟通，了解诉求',
            '考虑薪酬调整或激励方案',
            '明确职业发展路径',
            '减轻工作负担，改善工作节奏',
          ],
          lastUpdated: '2024-02-28T10:00:00',
        },
        {
          employeeId: 'E002',
          name: '李四',
          avatar: 'LS',
          department: '产品部',
          position: '产品经理',
          tenure: 1.5,
          riskLevel: 'critical',
          riskScore: 85,
          trend: 'up',
          lastMonthRisk: 75,
          keyRiskFactors: [
            { name: '多手Offer竞争', impact: 'critical', description: '已收到2个外部Offer' },
            { name: '团队协作问题', impact: 'high', description: '与开发团队沟通不畅' },
            { name: '业务方向调整', impact: 'medium', description: '产品定位频繁变更' },
          ],
          predictions: {
            probability3Month: 70,
            probability6Month: 85,
          },
          recommendations: [
            '立即进行挽留谈话',
            '提供有竞争力的薪酬包',
            '协调跨团队协作问题',
            '稳定产品方向，减少变更',
          ],
          lastUpdated: '2024-02-28T11:00:00',
        },
        {
          employeeId: 'E003',
          name: '王五',
          avatar: 'WW',
          department: '销售部',
          position: '销售经理',
          tenure: 3,
          riskLevel: 'medium',
          riskScore: 45,
          trend: 'stable',
          lastMonthRisk: 45,
          keyRiskFactors: [
            { name: '业绩压力大', impact: 'medium', description: '近期业绩未达标' },
            { name: '培训支持不足', impact: 'low', description: '销售技能培训机会少' },
          ],
          predictions: {
            probability3Month: 25,
            probability6Month: 40,
          },
          recommendations: [
            '提供销售技能培训支持',
            '协助分析业绩不达标原因',
            '设定合理的阶段性目标',
          ],
          lastUpdated: '2024-02-27T16:00:00',
        },
        {
          employeeId: 'E004',
          name: '赵六',
          avatar: 'ZL',
          department: '技术部',
          position: '后端工程师',
          tenure: 0.8,
          riskLevel: 'low',
          riskScore: 25,
          trend: 'down',
          lastMonthRisk: 30,
          keyRiskFactors: [
            { name: '试用期适应', impact: 'low', description: '新员工适应期' },
          ],
          predictions: {
            probability3Month: 10,
            probability6Month: 20,
          },
          recommendations: [
            '加强新员工培训',
            '安排导师帮助',
          ],
          lastUpdated: '2024-02-28T09:00:00',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAnalyzing(false);
    toast.success('AI离职风险分析完成');
  };

  const filteredRisks = risks.filter(risk => {
    const matchesSearch =
      risk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || risk.riskLevel === levelFilter;
    const matchesDepartment = departmentFilter === 'all' || risk.department === departmentFilter;
    return matchesSearch && matchesLevel && matchesDepartment;
  });

  const riskLevelConfig: Record<RiskLevel, { label: string; color: string; bgColor: string; icon: any }> = {
    critical: { label: '极高风险', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30', icon: AlertTriangle },
    high: { label: '高风险', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30', icon: TrendingDown },
    medium: { label: '中风险', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', icon: Shield },
    low: { label: '低风险', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle },
  };

  const statistics = {
    total: risks.length,
    critical: risks.filter(r => r.riskLevel === 'critical').length,
    high: risks.filter(r => r.riskLevel === 'high').length,
    averageRisk: risks.length > 0 ? risks.reduce((sum, r) => sum + r.riskScore, 0) / risks.length : 0,
    avgPrediction: risks.length > 0 ? risks.reduce((sum, r) => sum + r.predictions.probability3Month, 0) / risks.length : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-purple-600" />
              AI离职预测
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              智能预测员工离职风险，提前干预挽留人才
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.info('导出中...')}>
              <Download className="h-4 w-4 mr-2" />
              导出报告
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              {analyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  AI分析中...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  重新分析
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">评估人数</p>
                  <p className="text-2xl font-bold">{statistics.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">极高风险</p>
                  <p className="text-2xl font-bold text-red-600">{statistics.critical}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">高风险</p>
                  <p className="text-2xl font-bold text-orange-600">{statistics.high}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">平均风险</p>
                  <p className="text-2xl font-bold text-purple-600">{statistics.averageRisk.toFixed(0)}</p>
                </div>
                <BarChart className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">3月离职概率</p>
                  <p className="text-2xl font-bold text-yellow-600">{statistics.avgPrediction.toFixed(0)}%</p>
                </div>
                <TrendingDown className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 搜索和筛选 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索员工姓名、部门或职位..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="风险等级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部等级</SelectItem>
                  {Object.entries(riskLevelConfig).map(([value, config]) => (
                    <SelectItem key={value} value={value}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="部门" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部部门</SelectItem>
                  <SelectItem value="技术部">技术部</SelectItem>
                  <SelectItem value="产品部">产品部</SelectItem>
                  <SelectItem value="销售部">销售部</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 风险列表 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600 dark:text-gray-400">加载中...</div>
          </div>
        ) : filteredRisks.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">暂无风险数据</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredRisks.map((risk) => {
              const config = riskLevelConfig[risk.riskLevel];
              const TrendIcon = risk.trend === 'up' ? ArrowUp : risk.trend === 'down' ? ArrowDown : Clock;

              return (
                <Card key={risk.employeeId} className={`hover:shadow-lg transition-shadow border-l-4 ${
                  risk.riskLevel === 'critical' ? 'border-l-red-500' :
                  risk.riskLevel === 'high' ? 'border-l-orange-500' :
                  risk.riskLevel === 'medium' ? 'border-l-yellow-500' :
                  'border-l-green-500'
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {risk.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-xl">{risk.name}</CardTitle>
                            <Badge className={config.bgColor + ' ' + config.color}>
                              {config.label} {risk.riskScore}%
                            </Badge>
                            <Badge className={risk.trend === 'up' ? 'bg-red-100 text-red-600' : risk.trend === 'down' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}>
                              <TrendIcon className="h-3 w-3 mr-1" />
                              {risk.trend === 'up' ? '上升' : risk.trend === 'down' ? '下降' : '稳定'}
                            </Badge>
                          </div>
                          <CardDescription className="mt-1">
                            {risk.position} • {risk.department} • {risk.tenure}年司龄
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">上月风险</p>
                        <p className="text-lg font-semibold">{risk.lastMonthRisk}%</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* 风险分数 */}
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">当前风险分数</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all ${
                                risk.riskLevel === 'critical' ? 'bg-red-600' :
                                risk.riskLevel === 'high' ? 'bg-orange-600' :
                                risk.riskLevel === 'medium' ? 'bg-yellow-600' :
                                'bg-green-600'
                              }`}
                              style={{ width: `${risk.riskScore}%` }}
                            />
                          </div>
                          <span className="text-lg font-bold">{risk.riskScore}</span>
                        </div>
                      </div>

                      {/* 预测概率 */}
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">离职概率预测</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600 dark:text-gray-400 w-16">3个月内</span>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-blue-600"
                                style={{ width: `${risk.predictions.probability3Month}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium w-10 text-right">{risk.predictions.probability3Month}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600 dark:text-gray-400 w-16">6个月内</span>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-purple-600"
                                style={{ width: `${risk.predictions.probability6Month}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium w-10 text-right">{risk.predictions.probability6Month}%</span>
                          </div>
                        </div>
                      </div>

                      {/* 关键风险因素 */}
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">关键风险因素</p>
                        <div className="space-y-1">
                          {risk.keyRiskFactors.slice(0, 2).map((factor, i) => (
                            <div key={i} className="text-xs flex items-center gap-1">
                              <Badge className={
                                factor.impact === 'critical' ? 'bg-red-100 text-red-600' :
                                factor.impact === 'high' ? 'bg-orange-100 text-orange-600' :
                                'bg-gray-100 text-gray-600'
                              }>
                                {factor.impact === 'critical' ? '关键' :
                                 factor.impact === 'high' ? '高' :
                                 factor.impact === 'medium' ? '中' : '低'}
                              </Badge>
                              <span className="truncate">{factor.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* AI建议 */}
                    <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-semibold">AI建议措施</span>
                      </div>
                      <ul className="space-y-1">
                        {risk.recommendations.slice(0, 3).map((rec, i) => (
                          <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-1">
                            <span className="text-blue-600">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedRisk(risk)}>
                        <Eye className="h-4 w-4 mr-1" />
                        查看详情
                      </Button>
                      {risk.riskLevel === 'critical' && (
                        <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          紧急处理
                        </Button>
                      )}
                      {risk.riskLevel === 'high' && (
                        <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700">
                          <Shield className="h-4 w-4 mr-1" />
                          挽留沟通
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* 风险详情弹窗 */}
      {selectedRisk && (
        <Dialog open={!!selectedRisk} onOpenChange={() => setSelectedRisk(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {selectedRisk.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span>{selectedRisk.name}</span>
                    <Badge className={riskLevelConfig[selectedRisk.riskLevel].bgColor + ' ' + riskLevelConfig[selectedRisk.riskLevel].color}>
                      {riskLevelConfig[selectedRisk.riskLevel].label} {selectedRisk.riskScore}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedRisk.position} • {selectedRisk.department} • {selectedRisk.tenure}年司龄
                  </p>
                </div>
              </DialogTitle>
              <DialogDescription>
                最后更新：{new Date(selectedRisk.lastUpdated).toLocaleString('zh-CN')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* 风险趋势 */}
              <div>
                <h3 className="font-semibold mb-3">风险趋势</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">当前风险</p>
                    <p className="text-2xl font-bold text-purple-600">{selectedRisk.riskScore}%</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">上月风险</p>
                    <p className="text-2xl font-bold">{selectedRisk.lastMonthRisk}%</p>
                  </div>
                  <div className={`p-4 rounded-lg ${
                    selectedRisk.trend === 'up' ? 'bg-red-50 dark:bg-red-950/30' :
                    selectedRisk.trend === 'down' ? 'bg-green-50 dark:bg-green-950/30' :
                    'bg-gray-50 dark:bg-gray-800'
                  }`}>
                    <p className="text-sm text-gray-600 dark:text-gray-400">风险趋势</p>
                    <p className={`text-2xl font-bold ${
                      selectedRisk.trend === 'up' ? 'text-red-600' :
                      selectedRisk.trend === 'down' ? 'text-green-600' :
                      'text-gray-600'
                    }`}>
                      {selectedRisk.trend === 'up' ? '上升' : selectedRisk.trend === 'down' ? '下降' : '稳定'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 预测概率 */}
              <div>
                <h3 className="font-semibold mb-3">离职概率预测</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">3个月内离职概率</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-blue-200 dark:bg-blue-900 rounded-full h-4">
                        <div
                          className="h-4 rounded-full bg-blue-600 transition-all"
                          style={{ width: `${selectedRisk.predictions.probability3Month}%` }}
                        />
                      </div>
                      <span className="text-2xl font-bold text-blue-600">
                        {selectedRisk.predictions.probability3Month}%
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">6个月内离职概率</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-purple-200 dark:bg-purple-900 rounded-full h-4">
                        <div
                          className="h-4 rounded-full bg-purple-600 transition-all"
                          style={{ width: `${selectedRisk.predictions.probability6Month}%` }}
                        />
                      </div>
                      <span className="text-2xl font-bold text-purple-600">
                        {selectedRisk.predictions.probability6Month}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 风险因素详情 */}
              <div>
                <h3 className="font-semibold mb-3">关键风险因素</h3>
                <div className="space-y-3">
                  {selectedRisk.keyRiskFactors.map((factor, i) => (
                    <div key={i} className={`p-4 rounded-lg border-2 ${
                      factor.impact === 'critical' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30' :
                      factor.impact === 'high' ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30' :
                      factor.impact === 'medium' ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/30' :
                      'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={
                              factor.impact === 'critical' ? 'bg-red-600 text-white' :
                              factor.impact === 'high' ? 'bg-orange-600 text-white' :
                              factor.impact === 'medium' ? 'bg-yellow-600 text-white' :
                              'bg-gray-600 text-white'
                            }>
                              {factor.impact === 'critical' ? '关键影响' :
                               factor.impact === 'high' ? '高影响' :
                               factor.impact === 'medium' ? '中等影响' : '低影响'}
                            </Badge>
                            <span className="font-semibold">{factor.name}</span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{factor.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI建议 */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold">AI建议措施</span>
                </div>
                <ul className="space-y-2">
                  {selectedRisk.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                导出报告
              </Button>
              {selectedRisk.riskLevel === 'critical' ? (
                <Button className="bg-red-600 hover:bg-red-700">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  立即处理
                </Button>
              ) : (
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Shield className="h-4 w-4 mr-2" />
                  开始挽留
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
