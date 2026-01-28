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
  Sparkles,
  Search,
  TrendingUp,
  Star,
  Target,
  Award,
  Brain,
  Download,
  RefreshCw,
  Eye,
  User,
  Calendar,
  Building,
  BarChart,
  Zap,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type TalentLevel = 'star' | 'high-potential' | 'key' | 'core' | 'development';
type ReviewStatus = 'completed' | 'in-progress' | 'pending';

interface TalentAssessment {
  name: string;
  score: number;
  details: string[];
}

interface Talent {
  employeeId: string;
  name: string;
  avatar: string;
  department: string;
  position: string;
  tenure: number;
  performanceScore: number;
  potentialScore: number;
  talentLevel: TalentLevel;
  reviewStatus: ReviewStatus;
  strengths: string[];
  weaknesses: string[];
  developmentNeeds: TalentAssessment[];
  careerPath: string[];
  promotionReadiness: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastReview: string;
  reviewer: string;
}

export default function AIAssistantTalentReviewPage() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  useEffect(() => {
    setTimeout(() => {
      setTalents([
        {
          employeeId: 'E001',
          name: '张三',
          avatar: 'ZS',
          department: '技术部',
          position: '高级前端工程师',
          tenure: 2.5,
          performanceScore: 92,
          potentialScore: 88,
          talentLevel: 'star',
          reviewStatus: 'completed',
          strengths: ['技术能力强', '团队协作好', '学习能力强', '解决问题能力突出'],
          weaknesses: ['管理经验不足', '跨部门沟通待提升'],
          developmentNeeds: [
            { name: '领导力', score: 65, details: ['需要培养团队管理能力'] },
            { name: '战略思维', score: 70, details: ['需要提升业务理解能力'] },
          ],
          careerPath: ['高级前端工程师', '前端技术专家', '技术总监'],
          promotionReadiness: 85,
          riskLevel: 'high',
          lastReview: '2024-02-25',
          reviewer: '李技术总监',
        },
        {
          employeeId: 'E002',
          name: '李四',
          avatar: 'LS',
          department: '产品部',
          position: '产品经理',
          tenure: 2,
          performanceScore: 85,
          potentialScore: 82,
          talentLevel: 'high-potential',
          reviewStatus: 'completed',
          strengths: ['业务理解深', '数据分析强', '用户洞察好'],
          weaknesses: ['技术背景薄弱', '项目管理经验少'],
          developmentNeeds: [
            { name: '项目管理', score: 60, details: ['需要系统学习项目管理方法'] },
            { name: '技术理解', score: 55, details: ['需要了解技术实现原理'] },
          ],
          careerPath: ['产品经理', '高级产品经理', '产品总监'],
          promotionReadiness: 70,
          riskLevel: 'medium',
          lastReview: '2024-02-20',
          reviewer: '王产品总监',
        },
        {
          employeeId: 'E003',
          name: '王五',
          avatar: 'WW',
          department: '销售部',
          position: '销售经理',
          tenure: 3,
          performanceScore: 78,
          potentialScore: 75,
          talentLevel: 'key',
          reviewStatus: 'in-progress',
          strengths: ['客户资源丰富', '销售技巧熟练', '市场敏感度高'],
          weaknesses: ['团队管理能力弱', '数字化工具使用不足'],
          developmentNeeds: [
            { name: '团队管理', score: 50, details: ['需要加强团队建设和管理'] },
            { name: '数字化能力', score: 60, details: ['需要提升数字化销售工具使用能力'] },
          ],
          careerPath: ['销售经理', '区域销售总监', '销售VP'],
          promotionReadiness: 60,
          riskLevel: 'low',
          lastReview: '2024-02-28',
          reviewer: '赵销售总监',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAnalyzing(false);
    toast.success('AI人才盘点完成');
  };

  const filteredTalents = talents.filter(talent => {
    const matchesSearch =
      talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talent.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talent.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || talent.talentLevel === levelFilter;
    const matchesDepartment = departmentFilter === 'all' || talent.department === departmentFilter;
    return matchesSearch && matchesLevel && matchesDepartment;
  });

  const talentLevelConfig: Record<TalentLevel, { label: string; color: string; bgColor: string; icon: any }> = {
    star: { label: '明星人才', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30', icon: Star },
    'high-potential': { label: '高潜人才', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', icon: TrendingUp },
    key: { label: '关键人才', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30', icon: Award },
    core: { label: '核心人才', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30', icon: Target },
    development: { label: '待发展', color: 'text-gray-600', bgColor: 'bg-gray-100 dark:bg-gray-800', icon: Zap },
  };

  const statusConfig: Record<ReviewStatus, { label: string; color: string }> = {
    completed: { label: '已完成', color: 'bg-green-500' },
    'in-progress': { label: '进行中', color: 'bg-blue-500' },
    pending: { label: '待评估', color: 'bg-gray-500' },
  };

  const statistics = {
    total: talents.length,
    star: talents.filter(t => t.talentLevel === 'star').length,
    highPotential: talents.filter(t => t.talentLevel === 'high-potential').length,
    averagePerformance: talents.length > 0 ? talents.reduce((sum, t) => sum + t.performanceScore, 0) / talents.length : 0,
    completed: talents.filter(t => t.reviewStatus === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-purple-600" />
              AI人才盘点
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              智能识别高潜人才，优化人才梯队建设
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
                  AI盘点中...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  开始盘点
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
                <User className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">明星人才</p>
                  <p className="text-2xl font-bold text-purple-600">{statistics.star}</p>
                </div>
                <Star className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">高潜人才</p>
                  <p className="text-2xl font-bold text-blue-600">{statistics.highPotential}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">平均绩效</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.averagePerformance.toFixed(0)}</p>
                </div>
                <BarChart className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">已完成</p>
                  <p className="text-2xl font-bold text-gray-600">{statistics.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-gray-600" />
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
                  <SelectValue placeholder="人才层级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部层级</SelectItem>
                  {Object.entries(talentLevelConfig).map(([value, config]) => (
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

        {/* 人才列表 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600 dark:text-gray-400">加载中...</div>
          </div>
        ) : filteredTalents.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">暂无人才数据</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTalents.map((talent) => {
              const config = talentLevelConfig[talent.talentLevel];
              return (
                <Card key={talent.employeeId} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {talent.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{talent.name}</CardTitle>
                            <Badge className={config.bgColor + ' ' + config.color}>
                              <config.icon className="h-3 w-3 mr-1" />
                              {config.label}
                            </Badge>
                            <Badge className={statusConfig[talent.reviewStatus].color + ' text-white border-0'}>
                              {statusConfig[talent.reviewStatus].label}
                            </Badge>
                          </div>
                          <CardDescription className="mt-1">
                            {talent.position} • {talent.department} • {talent.tenure}年司龄
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {/* 绩效分数 */}
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">绩效分数</span>
                          <span className="text-xl font-bold text-green-600">{talent.performanceScore}</span>
                        </div>
                      </div>
                      {/* 潜力分数 */}
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">潜力分数</span>
                          <span className="text-xl font-bold text-blue-600">{talent.potentialScore}</span>
                        </div>
                      </div>
                    </div>

                    {/* 优势 */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">核心优势</p>
                      <div className="flex flex-wrap gap-1">
                        {talent.strengths.slice(0, 3).map((strength, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{strength}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* 晋升准备度 */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">晋升准备度</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              talent.promotionReadiness >= 80 ? 'bg-green-600' :
                              talent.promotionReadiness >= 60 ? 'bg-blue-600' :
                              'bg-yellow-600'
                            }`}
                            style={{ width: `${talent.promotionReadiness}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{talent.promotionReadiness}%</span>
                      </div>
                    </div>

                    {/* 风险等级 */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">流失风险</p>
                      <Badge className={
                        talent.riskLevel === 'high' ? 'bg-red-100 text-red-600' :
                        talent.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }>
                        {talent.riskLevel === 'high' ? '高风险' :
                         talent.riskLevel === 'medium' ? '中风险' :
                         '低风险'}
                      </Badge>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedTalent(talent)}>
                        <Eye className="h-4 w-4 mr-1" />
                        查看详情
                      </Button>
                      {talent.talentLevel === 'star' && (
                        <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                          <Star className="h-4 w-4 mr-1" />
                          重点培养
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

      {/* 人才详情弹窗 */}
      {selectedTalent && (
        <Dialog open={!!selectedTalent} onOpenChange={() => setSelectedTalent(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {selectedTalent.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedTalent.name}</span>
                    <Badge className={talentLevelConfig[selectedTalent.talentLevel].bgColor + ' ' + talentLevelConfig[selectedTalent.talentLevel].color}>
                      {talentLevelConfig[selectedTalent.talentLevel].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedTalent.position} • {selectedTalent.department} • {selectedTalent.tenure}年司龄
                  </p>
                </div>
              </DialogTitle>
              <DialogDescription>
                评估人：{selectedTalent.reviewer} • 最后评估：{selectedTalent.lastReview}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* 绩效和潜力 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">绩效表现</p>
                  <p className="text-4xl font-bold text-green-600">{selectedTalent.performanceScore}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">排名：</span>
                    <span className="text-xs font-medium">Top 10%</span>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">发展潜力</p>
                  <p className="text-4xl font-bold text-blue-600">{selectedTalent.potentialScore}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">排名：</span>
                    <span className="text-xs font-medium">Top 15%</span>
                  </div>
                </div>
              </div>

              {/* 优势和劣势 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2 text-green-600">✓ 核心优势</h3>
                  <ul className="space-y-1">
                    {selectedTalent.strengths.map((strength, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-orange-600">⚠ 待提升项</h3>
                  <ul className="space-y-1">
                    {selectedTalent.weaknesses.map((weakness, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <Zap className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 发展需求 */}
              <div>
                <h3 className="font-semibold mb-3">发展需求评估</h3>
                <div className="space-y-3">
                  {selectedTalent.developmentNeeds.map((need, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{need.name}</span>
                        <span className="font-semibold">{need.score}分</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            need.score >= 80 ? 'bg-green-600' :
                            need.score >= 60 ? 'bg-blue-600' :
                            need.score >= 40 ? 'bg-yellow-600' :
                            'bg-red-600'
                          }`}
                          style={{ width: `${need.score}%` }}
                        />
                      </div>
                      {need.details.map((detail, j) => (
                        <p key={j} className="text-xs text-gray-600 dark:text-gray-400">{detail}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* 职业路径 */}
              <div>
                <h3 className="font-semibold mb-3">职业发展路径</h3>
                <div className="flex items-center gap-4">
                  {selectedTalent.careerPath.map((path, i) => (
                    <div key={i} className="flex items-center">
                      <div className={`px-4 py-2 rounded-lg border-2 ${
                        i === 0 ? 'bg-blue-50 border-blue-300' :
                        i === 1 ? 'bg-purple-50 border-purple-300' :
                        'bg-green-50 border-green-300'
                      }`}>
                        <p className="text-sm font-medium">{path}</p>
                      </div>
                      {i < selectedTalent.careerPath.length - 1 && (
                        <div className="w-8 h-0.5 bg-gray-300" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 晋升准备度 */}
              <div>
                <h3 className="font-semibold mb-3">晋升准备度</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full transition-all ${
                        selectedTalent.promotionReadiness >= 80 ? 'bg-green-600' :
                        selectedTalent.promotionReadiness >= 60 ? 'bg-blue-600' :
                        'bg-yellow-600'
                      }`}
                      style={{ width: `${selectedTalent.promotionReadiness}%` }}
                    />
                  </div>
                  <span className="text-2xl font-bold">{selectedTalent.promotionReadiness}%</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {selectedTalent.promotionReadiness >= 80 ? '已准备好晋升，建议立即启动晋升流程' :
                   selectedTalent.promotionReadiness >= 60 ? '基本具备晋升条件，建议加强特定领域培养' :
                   '尚需提升，建议制定详细发展计划'}
                </p>
              </div>

              {/* AI洞察 */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold">AI洞察建议</span>
                </div>
                <ul className="space-y-1">
                  {selectedTalent.talentLevel === 'star' && (
                    <li className="text-sm flex items-start gap-2">
                      <Star className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <span>建议作为重点培养对象，制定个性化发展计划，提供更多挑战机会</span>
                    </li>
                  )}
                  <li className="text-sm flex items-start gap-2">
                    <Target className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>建议每季度进行一次深入沟通，跟踪发展进展</span>
                  </li>
                  <li className="text-sm flex items-start gap-2">
                    <Award className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>提供跨部门项目机会，拓展视野和能力边界</span>
                  </li>
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                导出报告
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Brain className="h-4 w-4 mr-2" />
                制定培养计划
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
