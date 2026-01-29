'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Target,
  Users,
  DollarSign,
  Zap,
  ArrowRight,
  Sparkles,
  Shield,
  Lightbulb,
} from 'lucide-react';

// AI 智能分析数据
const aiInsights = {
  // 人效预测
  efficiencyPrediction: {
    currentScore: 92.5,
    predictedScore: 94.8,
    improvement: 2.3,
    trend: 'up',
    recommendations: [
      { priority: 'high', text: '销售部人员配置可优化2人，预计提升人效5%' },
      { priority: 'medium', text: '建议加强技术部培训，预计提升人均产出3%' },
      { priority: 'low', text: '行政部可考虑共享服务模式' },
    ],
  },

  // 离职风险预测
  turnoverRisk: {
    highRisk: 3,
    mediumRisk: 8,
    totalEmployees: 485,
    riskRate: 2.3,
    alerts: [
      {
        employee: '张三',
        department: '销售部',
        role: '销售经理',
        risk: 85,
        reasons: ['绩效下滑15%', '出勤率下降', '加班时长增加'],
        recommendation: '建议尽快进行一对一沟通，了解离职原因并提供激励措施',
      },
      {
        employee: '李四',
        department: '技术部',
        role: '高级工程师',
        risk: 78,
        reasons: ['项目参与度下降', '文档输出减少'],
        recommendation: '考虑提供晋升机会或参与核心项目',
      },
    ],
  },

  // 绩效趋势分析
  performanceTrend: {
    avgScore: 4.2,
    improvementRate: 12.5,
    topPerformers: [
      { name: '王五', department: '销售部', score: 4.9, achievement: '超额完成120%' },
      { name: '赵六', department: '技术部', score: 4.8, achievement: '核心项目主力' },
    ],
    needImprovement: [
      { name: '钱七', department: '市场部', score: 3.2, issue: 'KPI未达成' },
    ],
  },

  // 招聘智能建议
  recruitmentInsights: {
    avgHiringTime: 18,
    targetTime: 15,
    costPerHire: 8500,
    qualityRate: 82,
    recommendations: [
      '建议优化面试流程，可缩短招聘周期20%',
      '推荐技术面试官培训，提升候选人质量10%',
      '市场部招聘渠道建议增加校园招聘',
    ],
  },

  // 薪酬优化建议
  compensationOptimization: {
    competitiveness: 78,
    fairness: 85,
    budgetUtilization: 72,
    recommendations: [
      '技术部薪酬水平略低于市场P50，建议调整5-8%',
      '销售部奖金结构可优化，增加提成比例',
      '建议引入宽带薪酬体系，提升内部公平性',
    ],
  },

  // 培训需求预测
  trainingNeeds: {
    skillGaps: [
      { skill: '数据分析', employees: 45, priority: 'high' },
      { skill: '项目管理', employees: 32, priority: 'medium' },
      { skill: '领导力', employees: 18, priority: 'medium' },
    ],
    recommendedCourses: [
      { title: '数据分析实战', employees: 45, impact: '提升30%决策效率' },
      { title: '项目管理PMP', employees: 32, impact: '降低15%项目延期' },
      { title: '领导力进阶', employees: 18, impact: '提升团队凝聚力' },
    ],
  },
};

export default function AIIntelligencePanel() {
  return (
    <div className="space-y-6">
      {/* AI 智能总览 */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI 智能分析
              </CardTitle>
              <CardDescription className="mt-1">
                基于大数据和机器学习，为您提供智能决策支持
              </CardDescription>
            </div>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              AI Powered
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">人效预测</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {aiInsights.efficiencyPrediction.predictedScore}分
              </div>
              <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                预计提升{aiInsights.efficiencyPrediction.improvement}分
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">离职风险</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {aiInsights.turnoverRisk.riskRate}%
              </div>
              <div className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {aiInsights.turnoverRisk.highRisk}人高风险
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">绩效趋势</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {aiInsights.performanceTrend.improvementRate}%
              </div>
              <div className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                同比提升
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">招聘优化</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                -{aiInsights.recruitmentInsights.avgHiringTime - aiInsights.recruitmentInsights.targetTime}天
              </div>
              <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                预计缩短周期
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 人效预测 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            人效预测
          </CardTitle>
          <CardDescription>AI 分析历史数据，预测未来 3 个月人效趋势</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 人效评分对比 */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">当前人效评分</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {aiInsights.efficiencyPrediction.currentScore}分
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">预测人效评分</div>
                <div className="text-2xl font-bold text-green-600">
                  {aiInsights.efficiencyPrediction.predictedScore}分
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">预计提升</div>
                <div className="text-xl font-bold text-green-600">
                  +{aiInsights.efficiencyPrediction.improvement}分
                </div>
              </div>
            </div>

            {/* 改进建议 */}
            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                AI 改进建议
              </div>
              <div className="space-y-2">
                {aiInsights.efficiencyPrediction.recommendations.map((rec, index) => (
                  <Alert key={index} className={
                    rec.priority === 'high' 
                      ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20' 
                      : rec.priority === 'medium'
                      ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20'
                      : 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20'
                  }>
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {rec.text}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 离职风险预警 */}
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            离职风险预警
          </CardTitle>
          <CardDescription>AI 分析员工行为数据，提前识别离职风险</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 风险概览 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">
                  {aiInsights.turnoverRisk.highRisk}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">高风险</div>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {aiInsights.turnoverRisk.mediumRisk}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">中风险</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {aiInsights.turnoverRisk.riskRate}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">风险率</div>
              </div>
            </div>

            {/* 高风险员工详情 */}
            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                高风险员工
              </div>
              <div className="space-y-3">
                {aiInsights.turnoverRisk.alerts.map((alert, index) => (
                  <Card key={index} className="border-red-200 dark:border-red-800">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {alert.employee}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {alert.department} · {alert.role}
                          </div>
                        </div>
                        <Badge className="bg-red-100 text-red-600">
                          风险值: {alert.risk}%
                        </Badge>
                      </div>
                      <div className="space-y-2 mb-3">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          风险原因：
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {alert.reasons.map((reason, rIndex) => (
                            <Badge key={rIndex} variant="outline" className="text-xs">
                              {reason}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-sm">
                          {alert.recommendation}
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 智能建议汇总 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            智能建议汇总
          </CardTitle>
          <CardDescription>基于 AI 分析的全面优化建议</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 招聘建议 */}
            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-gray-900 dark:text-white">招聘优化</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {aiInsights.recruitmentInsights.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 薪酬优化 */}
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-medium text-gray-900 dark:text-white">薪酬优化</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {aiInsights.compensationOptimization.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 培训需求 */}
          <div className="mt-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              培训需求预测
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {aiInsights.trainingNeeds.recommendedCourses.map((course, index) => (
                <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                    {course.title}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {course.employees}人需要培训
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {course.impact}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
