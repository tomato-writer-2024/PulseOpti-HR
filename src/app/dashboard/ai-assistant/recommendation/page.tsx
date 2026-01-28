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
  User,
  TrendingUp,
  Brain,
  CheckCircle,
  Clock,
  MapPin,
  DollarSign,
  GraduationCap,
  Award,
  Calendar,
  Mail,
  Phone,
  Building,
  Target,
  Download,
  RefreshCw,
  Filter,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Send,
  FileText,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type MatchLevel = 'excellent' | 'good' | 'fair' | 'poor';
type TalentStatus = 'active' | 'contacted' | 'interviewing' | 'offered' | 'hired' | 'rejected';

interface CandidateSkill {
  name: string;
  level: number;
  years: number;
}

interface WorkExperience {
  company: string;
  position: string;
  duration: string;
  achievements: string[];
}

interface Education {
  school: string;
  degree: string;
  major: string;
  year: string;
}

interface Candidate {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  age: number;
  yearsExperience: number;
  currentSalary: number;
  expectedSalary: number;
  status: TalentStatus;
  skills: CandidateSkill[];
  workExperience: WorkExperience[];
  education: Education[];
  targetJobs: string[];
  summary: string;
  languages: { name: string; level: string }[];
}

interface MatchResult {
  candidate: Candidate;
  matchJob: {
    id: string;
    name: string;
    department: string;
    requirements: string[];
  };
  overallScore: number;
  matchLevel: MatchLevel;
  skillMatch: {
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
  };
  experienceMatch: {
    score: number;
    relevantYears: number;
    requiredYears: number;
  };
  culturalFit: {
    score: number;
    traits: string[];
  };
  salaryMatch: {
    score: number;
    fit: 'above' | 'within' | 'below';
  };
  recommendationReasons: string[];
  riskFactors: string[];
  suggestedQuestions: string[];
  lastUpdated: string;
}

export default function AIAssistantRecommendationPage() {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [matchLevelFilter, setMatchLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [selectedJob, setSelectedJob] = useState('');

  useEffect(() => {
    // 模拟获取人才推荐数据
    setTimeout(() => {
      setMatches([
        {
          candidate: {
            id: 'C001',
            name: '张伟',
            avatar: 'ZW',
            email: 'zhangwei@example.com',
            phone: '138****1234',
            location: '北京',
            age: 32,
            yearsExperience: 8,
            currentSalary: 35000,
            expectedSalary: 38000,
            status: 'active',
            skills: [
              { name: 'React', level: 95, years: 6 },
              { name: 'TypeScript', level: 90, years: 5 },
              { name: 'Node.js', level: 85, years: 4 },
              { name: 'Vue', level: 80, years: 3 },
              { name: '性能优化', level: 88, years: 4 },
              { name: '架构设计', level: 82, years: 3 },
            ],
            workExperience: [
              {
                company: '某知名互联网公司',
                position: '高级前端工程师',
                duration: '2019-2024',
                achievements: [
                  '主导公司核心项目前端架构升级',
                  '提升页面性能40%',
                  '带领5人前端团队',
                ],
              },
              {
                company: '某科技公司',
                position: '前端工程师',
                duration: '2016-2019',
                achievements: [
                  '负责电商平台前端开发',
                  '参与微前端架构建设',
                ],
              },
            ],
            education: [
              {
                school: '清华大学',
                degree: '硕士',
                major: '计算机科学与技术',
                year: '2016',
              },
            ],
            targetJobs: ['高级前端工程师', '前端技术专家', '前端架构师'],
            summary: '拥有8年前端开发经验，精通React和TypeScript，有大型项目架构经验，擅长性能优化',
            languages: [
              { name: '中文', level: '母语' },
              { name: '英语', level: 'CET-6' },
            ],
          },
          matchJob: {
            id: '1',
            name: '高级前端工程师',
            department: '技术部',
            requirements: ['React', 'TypeScript', 'Node.js', '性能优化', '架构设计', '5年以上经验'],
          },
          overallScore: 92,
          matchLevel: 'excellent',
          skillMatch: {
            score: 95,
            matchedSkills: ['React', 'TypeScript', 'Node.js', '性能优化', '架构设计'],
            missingSkills: [],
          },
          experienceMatch: {
            score: 90,
            relevantYears: 8,
            requiredYears: 5,
          },
          culturalFit: {
            score: 88,
            traits: ['技术热情', '团队协作', '学习能力', '分享精神'],
          },
          salaryMatch: {
            score: 85,
            fit: 'within',
          },
          recommendationReasons: [
            '技能完全匹配，经验丰富',
            '有大型项目架构经验',
            '名校硕士，综合素质高',
            '期望薪资在预算范围内',
          ],
          riskFactors: [
            '可能面临高薪竞争',
            '期望较高职位空间',
          ],
          suggestedQuestions: [
            '请分享你主导的架构升级项目经验',
            '如何带领技术团队提升效率？',
            '你如何平衡技术深度和广度？',
            '对我们公司的技术栈有什么看法？',
          ],
          lastUpdated: '2024-02-28T10:30:00',
        },
        {
          candidate: {
            id: 'C002',
            name: '李明',
            avatar: 'LM',
            email: 'liming@example.com',
            phone: '139****5678',
            location: '上海',
            age: 28,
            yearsExperience: 5,
            currentSalary: 28000,
            expectedSalary: 32000,
            status: 'active',
            skills: [
              { name: 'React', level: 88, years: 4 },
              { name: 'TypeScript', level: 85, years: 3 },
              { name: 'Vue', level: 90, years: 5 },
              { name: 'Node.js', level: 75, years: 2 },
              { name: '性能优化', level: 80, years: 3 },
            ],
            workExperience: [
              {
                company: '某金融科技公司',
                position: '前端工程师',
                duration: '2020-2024',
                achievements: [
                  '负责交易系统前端开发',
                  '提升系统性能30%',
                ],
              },
            ],
            education: [
              {
                school: '上海交通大学',
                degree: '本科',
                major: '软件工程',
                year: '2019',
              },
            ],
            targetJobs: ['高级前端工程师', '前端架构师'],
            summary: '5年前端开发经验，精通React和Vue，有金融科技行业背景',
            languages: [
              { name: '中文', level: '母语' },
              { name: '英语', level: 'CET-6' },
            ],
          },
          matchJob: {
            id: '1',
            name: '高级前端工程师',
            department: '技术部',
            requirements: ['React', 'TypeScript', 'Node.js', '性能优化', '架构设计', '5年以上经验'],
          },
          overallScore: 78,
          matchLevel: 'good',
          skillMatch: {
            score: 82,
            matchedSkills: ['React', 'TypeScript', '性能优化'],
            missingSkills: ['架构设计', 'Node.js'],
          },
          experienceMatch: {
            score: 80,
            relevantYears: 5,
            requiredYears: 5,
          },
          culturalFit: {
            score: 75,
            traits: ['认真细致', '团队协作'],
          },
          salaryMatch: {
            score: 90,
            fit: 'within',
          },
          recommendationReasons: [
            '技能基本匹配',
            '薪资期望合理',
            '有行业背景经验',
          ],
          riskFactors: [
            '缺乏架构经验',
            '需要加强Node.js能力',
          ],
          suggestedQuestions: [
            '你对架构设计有什么理解？',
            '如何提升前端项目性能？',
            '未来职业规划是什么？',
          ],
          lastUpdated: '2024-02-28T09:15:00',
        },
        {
          candidate: {
            id: 'C003',
            name: '王芳',
            avatar: 'WF',
            email: 'wangfang@example.com',
            phone: '137****9012',
            location: '北京',
            age: 30,
            yearsExperience: 7,
            currentSalary: 32000,
            expectedSalary: 40000,
            status: 'interviewing',
            skills: [
              { name: 'React', level: 92, years: 6 },
              { name: 'TypeScript', level: 88, years: 5 },
              { name: 'Node.js', level: 80, years: 4 },
              { name: '性能优化', level: 85, years: 5 },
              { name: '架构设计', level: 75, years: 3 },
            ],
            workExperience: [
              {
                company: '某电商平台',
                position: '高级前端工程师',
                duration: '2020-2024',
                achievements: [
                  '负责大促活动前端开发',
                  '优化页面加载速度',
                ],
              },
              {
                company: '某O2O公司',
                position: '前端工程师',
                duration: '2017-2020',
                achievements: [
                  '开发移动端应用',
                ],
              },
            ],
            education: [
              {
                school: '北京大学',
                degree: '硕士',
                major: '计算机科学',
                year: '2017',
              },
            ],
            targetJobs: ['高级前端工程师', '前端技术专家'],
            summary: '7年前端开发经验，专注于电商行业，擅长性能优化',
            languages: [
              { name: '中文', level: '母语' },
              { name: '英语', level: 'TEM-8' },
            ],
          },
          matchJob: {
            id: '1',
            name: '高级前端工程师',
            department: '技术部',
            requirements: ['React', 'TypeScript', 'Node.js', '性能优化', '架构设计', '5年以上经验'],
          },
          overallScore: 85,
          matchLevel: 'excellent',
          skillMatch: {
            score: 88,
            matchedSkills: ['React', 'TypeScript', '性能优化', 'Node.js'],
            missingSkills: ['架构设计经验'],
          },
          experienceMatch: {
            score: 85,
            relevantYears: 7,
            requiredYears: 5,
          },
          culturalFit: {
            score: 80,
            traits: ['业务理解', '用户体验', '沟通能力'],
          },
          salaryMatch: {
            score: 70,
            fit: 'below',
          },
          recommendationReasons: [
            '技能匹配度高',
            '名校硕士',
            '行业经验丰富',
          ],
          riskFactors: [
            '期望薪资超出预算',
            '已进入其他公司面试',
          ],
          suggestedQuestions: [
            '为什么选择我们公司？',
            '电商行业经验如何应用到我们业务？',
            '对薪资的期望是否可以调整？',
          ],
          lastUpdated: '2024-02-27T16:45:00',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleMatch = async () => {
    setMatching(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setMatching(false);
    toast.success('AI人才匹配完成');
  };

  const filteredMatches = matches.filter(match => {
    const matchesSearch =
      match.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.matchJob.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = matchLevelFilter === 'all' || match.matchLevel === matchLevelFilter;
    const matchesStatus = statusFilter === 'all' || match.candidate.status === statusFilter;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const matchLevelConfig: Record<MatchLevel, { label: string; color: string; bgColor: string }> = {
    excellent: { label: '优秀', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
    good: { label: '良好', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    fair: { label: '一般', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
    poor: { label: '较差', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  };

  const statusConfig: Record<TalentStatus, { label: string; color: string; icon: any }> = {
    active: { label: '活跃', color: 'bg-green-500', icon: CheckCircle },
    contacted: { label: '已联系', color: 'bg-blue-500', icon: MessageSquare },
    interviewing: { label: '面试中', color: 'bg-purple-500', icon: Clock },
    offered: { label: '已发Offer', color: 'bg-orange-500', icon: CheckCircle },
    hired: { label: '已录用', color: 'bg-green-600', icon: CheckCircle },
    rejected: { label: '已拒绝', color: 'bg-red-500', icon: ThumbsDown },
  };

  const statistics = {
    total: matches.length,
    excellent: matches.filter(m => m.matchLevel === 'excellent').length,
    good: matches.filter(m => m.matchLevel === 'good').length,
    averageScore: matches.length > 0 ? matches.reduce((sum, m) => sum + m.overallScore, 0) / matches.length : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-purple-600" />
              AI人才推荐
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              智能匹配岗位需求，精准推荐优秀人才
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.info('导出中...')}>
              <Download className="h-4 w-4 mr-2" />
              导出报告
            </Button>
            <Button onClick={handleMatch} disabled={matching} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              {matching ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  AI匹配中...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  重新匹配
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">总推荐数</p>
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">优秀匹配</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.excellent}</p>
                </div>
                <Star className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">良好匹配</p>
                  <p className="text-2xl font-bold text-blue-600">{statistics.good}</p>
                </div>
                <ThumbsUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">平均匹配度</p>
                  <p className="text-2xl font-bold text-purple-600">{statistics.averageScore.toFixed(0)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
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
                  placeholder="搜索候选人姓名、邮箱或岗位..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={matchLevelFilter} onValueChange={setMatchLevelFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="匹配度" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部匹配度</SelectItem>
                  {Object.entries(matchLevelConfig).map(([value, config]) => (
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

        {/* 推荐列表 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600 dark:text-gray-400">加载中...</div>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">暂无推荐人才</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredMatches.map((match) => {
              const StatusIcon = statusConfig[match.candidate.status].icon;
              const config = matchLevelConfig[match.matchLevel];

              return (
                <Card key={match.candidate.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {match.candidate.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-xl">{match.candidate.name}</CardTitle>
                            <Badge className={config.bgColor + ' ' + config.color}>
                              {config.label} {match.overallScore}%
                            </Badge>
                            <Badge className={statusConfig[match.candidate.status].color + ' text-white border-0 flex items-center gap-1'}>
                              <StatusIcon className="h-3 w-3" />
                              {statusConfig[match.candidate.status].label}
                            </Badge>
                          </div>
                          <CardDescription className="mt-1">
                            {match.candidate.yearsExperience}年经验 • {match.candidate.location} • {match.candidate.education[0]?.school}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">期望薪资</p>
                        <p className="text-lg font-semibold">
                          ¥{match.candidate.expectedSalary.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 技能匹配 */}
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">技能匹配</p>
                        <div className="flex flex-wrap gap-2">
                          {match.skillMatch.matchedSkills.map((skill, i) => (
                            <Badge key={i} className="bg-green-100 text-green-700 border-0">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {skill}
                            </Badge>
                          ))}
                          {match.skillMatch.missingSkills.map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-red-600 border-red-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* 经验匹配 */}
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">经验匹配</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-blue-600 transition-all"
                              style={{ width: `${match.experienceMatch.score}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{match.experienceMatch.score}%</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {match.experienceMatch.relevantYears}年相关经验
                        </p>
                      </div>
                    </div>

                    {/* 匹配详情 */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">技能匹配</span>
                          <span className="font-semibold">{match.skillMatch.score}%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">文化匹配</span>
                          <span className="font-semibold">{match.culturalFit.score}%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">薪资匹配</span>
                          <span className="font-semibold">{match.salaryMatch.score}%</span>
                        </div>
                      </div>
                    </div>

                    {/* AI推荐理由 */}
                    <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-semibold">AI推荐理由</span>
                      </div>
                      <ul className="space-y-1">
                        {match.recommendationReasons.slice(0, 3).map((reason, i) => (
                          <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-1">
                            <span className="text-green-600">✓</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedMatch(match)}>
                        <Eye className="h-4 w-4 mr-1" />
                        查看详情
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        联系
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Send className="h-4 w-4 mr-1" />
                        邀请面试
                      </Button>
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        <Star className="h-4 w-4 mr-1" />
                        标记重点
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* 候选人详情弹窗 */}
      {selectedMatch && (
        <Dialog open={!!selectedMatch} onOpenChange={() => setSelectedMatch(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {selectedMatch.candidate.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span>{selectedMatch.candidate.name}</span>
                    <Badge className={matchLevelConfig[selectedMatch.matchLevel].bgColor + ' ' + matchLevelConfig[selectedMatch.matchLevel].color}>
                      匹配度 {selectedMatch.overallScore}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedMatch.candidate.email} • {selectedMatch.candidate.phone}
                  </p>
                </div>
              </DialogTitle>
              <DialogDescription>
                {selectedMatch.candidate.location} • {selectedMatch.candidate.yearsExperience}年经验
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">年龄</p>
                  <p className="font-semibold">{selectedMatch.candidate.age}岁</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">当前薪资</p>
                  <p className="font-semibold">¥{selectedMatch.candidate.currentSalary.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">期望薪资</p>
                  <p className="font-semibold">¥{selectedMatch.candidate.expectedSalary.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">学历</p>
                  <p className="font-semibold">{selectedMatch.candidate.education[0]?.degree}</p>
                </div>
              </div>

              {/* 匹配详情 */}
              <div>
                <h3 className="font-semibold mb-3">匹配分析</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>技能匹配</span>
                      <span className="font-semibold">{selectedMatch.skillMatch.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-green-600"
                        style={{ width: `${selectedMatch.skillMatch.score}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>经验匹配</span>
                      <span className="font-semibold">{selectedMatch.experienceMatch.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-600"
                        style={{ width: `${selectedMatch.experienceMatch.score}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>文化匹配</span>
                      <span className="font-semibold">{selectedMatch.culturalFit.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-purple-600"
                        style={{ width: `${selectedMatch.culturalFit.score}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>薪资匹配</span>
                      <span className="font-semibold">{selectedMatch.salaryMatch.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-orange-600"
                        style={{ width: `${selectedMatch.salaryMatch.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 技能详情 */}
              <div>
                <h3 className="font-semibold mb-3">技能详情</h3>
                <div className="space-y-2">
                  {selectedMatch.candidate.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{skill.name}</span>
                        <span className="font-semibold">{skill.level}% • {skill.years}年</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 工作经历 */}
              <div>
                <h3 className="font-semibold mb-3">工作经历</h3>
                <div className="space-y-3">
                  {selectedMatch.candidate.workExperience.map((exp, i) => (
                    <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{exp.position}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company} • {exp.duration}</p>
                        </div>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {exp.achievements.map((ach, j) => (
                          <li key={j} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-1">
                            <span className="text-blue-600">•</span>
                            {ach}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* 个人简介 */}
              <div>
                <h3 className="font-semibold mb-3">个人简介</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{selectedMatch.candidate.summary}</p>
              </div>

              {/* AI推荐理由 */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <span className="font-semibold">AI推荐理由</span>
                </div>
                <ul className="space-y-1">
                  {selectedMatch.recommendationReasons.map((reason, i) => (
                    <li key={i} className="text-sm flex items-start gap-1">
                      <span className="text-green-600">✓</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 风险提示 */}
              {selectedMatch.riskFactors.length > 0 && (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsDown className="h-4 w-4 text-red-600" />
                    <span className="font-semibold text-red-600">风险提示</span>
                  </div>
                  <ul className="space-y-1">
                    {selectedMatch.riskFactors.map((risk, i) => (
                      <li key={i} className="text-sm text-red-700 dark:text-red-300 flex items-start gap-1">
                        <span>!</span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 建议面试问题 */}
              <div>
                <h3 className="font-semibold mb-3">建议面试问题</h3>
                <div className="space-y-2">
                  {selectedMatch.suggestedQuestions.map((q, i) => (
                    <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm">{i + 1}. {q}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => toast.info('导出中...')}>
                <Download className="h-4 w-4 mr-2" />
                导出简历
              </Button>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                联系候选人
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Send className="h-4 w-4 mr-2" />
                发送面试邀请
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
