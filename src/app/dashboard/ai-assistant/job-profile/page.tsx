'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Target,
  TrendingUp,
  Brain,
  BookOpen,
  Award,
  Users,
  DollarSign,
  Calendar,
  Zap,
  Download,
  RefreshCw,
  FileText,
  Plus,
  Eye,
  Edit,
  BarChart,
  Lightbulb,
} from 'lucide-react';
import { toast } from 'sonner';

type JobLevel = 'junior' | 'middle' | 'senior' | 'expert' | 'manager' | 'director' | 'vp';

interface JobCompetency {
  name: string;
  level: number;
  importance: 'critical' | 'high' | 'medium' | 'low';
  description: string;
}

interface JobProfile {
  id: string;
  name: string;
  code: string;
  department: string;
  level: JobLevel;
  description: string;
  responsibilities: string[];
  requirements: {
    education: string[];
    experience: string;
    skills: string[];
    certifications?: string[];
  };
  competencies: JobCompetency[];
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  kpis: {
    name: string;
    target: string;
    weight: number;
  }[];
  careerPath: {
    current: string;
    next: string[];
  };
  marketData: {
    avgSalary: number;
    marketDemand: 'high' | 'medium' | 'low';
    talentShortage: 'severe' | 'moderate' | 'adequate';
  };
  aiInsights: {
    keyPoints: string[];
    recommendations: string[];
    riskFactors: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export default function AIAssistantJobProfilePage() {
  const [profiles, setProfiles] = useState<JobProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<JobProfile | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [newProfile, setNewProfile] = useState({
    name: '',
    department: '',
    level: 'middle' as JobLevel,
    description: '',
  });

  useEffect(() => {
    // 模拟获取岗位画像数据
    setTimeout(() => {
      setProfiles([
        {
          id: '1',
          name: '高级前端工程师',
          code: 'DEV-003',
          department: '技术部',
          level: 'senior',
          description: '负责公司核心产品的前端开发与技术架构优化',
          responsibilities: [
            '负责前端架构设计和技术选型',
            '带领团队完成复杂业务模块开发',
            '推动前端工程化建设和性能优化',
            '指导初级工程师成长',
          ],
          requirements: {
            education: ['本科及以上', '计算机相关专业'],
            experience: '5年以上前端开发经验',
            skills: ['React', 'Vue', 'TypeScript', 'Node.js', '性能优化', '架构设计'],
            certifications: ['AWS认证', '前端技术专家认证'],
          },
          competencies: [
            { name: '技术能力', level: 90, importance: 'critical', description: '具备深厚的前端技术功底' },
            { name: '架构设计', level: 85, importance: 'high', description: '能够设计可扩展的前端架构' },
            { name: '团队协作', level: 80, importance: 'high', description: '良好的沟通和团队协作能力' },
            { name: '问题解决', level: 85, importance: 'high', description: '快速定位和解决技术问题' },
          ],
          salaryRange: { min: 25000, max: 40000, currency: 'CNY' },
          kpis: [
            { name: '代码质量', target: '90分', weight: 30 },
            { name: '交付效率', target: '按期交付率95%', weight: 25 },
            { name: '技术影响力', target: '技术分享4次/年', weight: 25 },
            { name: '团队成长', target: '培养2名中级工程师', weight: 20 },
          ],
          careerPath: {
            current: '高级前端工程师',
            next: ['技术专家', '前端技术总监'],
          },
          marketData: {
            avgSalary: 32000,
            marketDemand: 'high',
            talentShortage: 'moderate',
          },
          aiInsights: {
            keyPoints: [
              '市场需求旺盛，竞争激烈',
              '技术深度要求高，需要持续学习',
              '候选人更关注技术成长和团队文化',
            ],
            recommendations: [
              '突出技术挑战和学习机会',
              '提供清晰的职业发展路径',
              '强调团队技术氛围',
            ],
            riskFactors: [
              '高薪竞争激烈',
              '候选人多手offer',
              '技术栈匹配度要求高',
            ],
          },
          createdAt: '2024-01-15T09:00:00',
          updatedAt: '2024-02-28T16:00:00',
        },
        {
          id: '2',
          name: '产品经理',
          code: 'PM-002',
          department: '产品部',
          level: 'middle',
          description: '负责产品规划、需求分析和产品迭代',
          responsibilities: [
            '负责产品需求分析和规划',
            '撰写产品文档和原型设计',
            '协调开发和测试团队',
            '跟进产品数据和用户反馈',
          ],
          requirements: {
            education: ['本科及以上', '不限专业'],
            experience: '3年以上产品经理经验',
            skills: ['需求分析', '原型设计', '数据分析', '用户调研', '项目管理'],
          },
          competencies: [
            { name: '需求分析', level: 85, importance: 'critical', description: '深入理解用户需求' },
            { name: '产品设计', level: 80, importance: 'high', description: '设计良好的产品体验' },
            { name: '沟通协调', level: 85, importance: 'high', description: '有效协调各方资源' },
            { name: '数据驱动', level: 75, importance: 'medium', description: '基于数据做决策' },
          ],
          salaryRange: { min: 20000, max: 35000, currency: 'CNY' },
          kpis: [
            { name: '产品满意度', target: '85分', weight: 35 },
            { name: '功能交付率', target: '90%', weight: 25 },
            { name: '用户增长', target: '月增长10%', weight: 25 },
            { name: '需求响应速度', target: '平均响应时间2天', weight: 15 },
          ],
          careerPath: {
            current: '产品经理',
            next: ['高级产品经理', '产品总监'],
          },
          marketData: {
            avgSalary: 28000,
            marketDemand: 'medium',
            talentShortage: 'adequate',
          },
          aiInsights: {
            keyPoints: [
              '市场竞争平稳，候选量充足',
              '重视业务思维和产品感',
              '行业经验重要加分项',
            ],
            recommendations: [
              '关注候选人的产品思维',
              '考察数据分析和决策能力',
              '提供有竞争力的产品成长空间',
            ],
            riskFactors: [
              '行业经验要求可能导致候选量受限',
              '薪资水平中等吸引力有限',
            ],
          },
          createdAt: '2024-01-20T10:00:00',
          updatedAt: '2024-02-25T14:00:00',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    // 模拟AI分析
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAnalyzing(false);
    toast.success('AI分析完成');
    setSelectedProfile(profiles[0]);
  };

  const handleCreateProfile = () => {
    const profile: JobProfile = {
      id: Date.now().toString(),
      name: newProfile.name,
      code: 'JOB-' + Date.now().toString().slice(-4),
      department: newProfile.department,
      level: newProfile.level,
      description: newProfile.description,
      responsibilities: [],
      requirements: {
        education: [],
        experience: '',
        skills: [],
      },
      competencies: [],
      salaryRange: { min: 0, max: 0, currency: 'CNY' },
      kpis: [],
      careerPath: { current: '', next: [] },
      marketData: { avgSalary: 0, marketDemand: 'medium', talentShortage: 'adequate' },
      aiInsights: { keyPoints: [], recommendations: [], riskFactors: [] },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProfiles([profile, ...profiles]);
    setShowCreateProfile(false);
    toast.success('岗位画像已创建，请完善详细信息');
    setNewProfile({
      name: '',
      department: '',
      level: 'middle',
      description: '',
    });
  };

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const levelConfig: Record<JobLevel, { label: string; color: string }> = {
    junior: { label: '初级', color: 'bg-blue-100 text-blue-700' },
    middle: { label: '中级', color: 'bg-green-100 text-green-700' },
    senior: { label: '高级', color: 'bg-purple-100 text-purple-700' },
    expert: { label: '专家', color: 'bg-orange-100 text-orange-700' },
    manager: { label: '经理', color: 'bg-pink-100 text-pink-700' },
    director: { label: '总监', color: 'bg-red-100 text-red-700' },
    vp: { label: '副总裁', color: 'bg-amber-100 text-amber-700' },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-purple-600" />
              AI岗位画像
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              智能分析岗位需求，生成标准岗位画像
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.info('导出中...')}>
              <Download className="h-4 w-4 mr-2" />
              导出画像
            </Button>
            <Button onClick={() => setShowCreateProfile(true)}>
              <Plus className="h-4 w-4 mr-2" />
              创建画像
            </Button>
          </div>
        </div>

        {/* AI分析提示卡片 */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  AI智能分析
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  输入岗位名称和职责，AI将自动分析市场数据、能力要求、薪酬范围，生成完整的岗位画像。
                </p>
                <Button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      AI分析中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      开始AI分析
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 搜索栏 */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索岗位名称、部门或编号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* 岗位画像列表 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600 dark:text-gray-400">加载中...</div>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">暂无岗位画像</p>
            <Button className="mt-4" onClick={() => setShowCreateProfile(true)}>
              <Plus className="h-4 w-4 mr-2" />
              创建画像
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProfiles.map((profile) => (
              <Card key={profile.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-xl">{profile.name}</CardTitle>
                        <Badge className={levelConfig[profile.level].color}>
                          {levelConfig[profile.level].label}
                        </Badge>
                        <Badge variant="outline">{profile.code}</Badge>
                      </div>
                      <CardDescription className="mt-2">
                        {profile.department} • {profile.description}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedProfile(profile)}>
                        <Eye className="h-4 w-4 mr-1" />
                        查看详情
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* 薪酬范围 */}
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">薪酬范围</p>
                        <p className="text-lg font-semibold">
                          {(profile.salaryRange.min / 1000).toFixed(0)}-{(profile.salaryRange.max / 1000).toFixed(0)}k
                        </p>
                      </div>
                    </div>

                    {/* 市场需求 */}
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">市场需求</p>
                        <p className="text-lg font-semibold">
                          {profile.marketData.marketDemand === 'high' ? '旺盛' :
                           profile.marketData.marketDemand === 'medium' ? '平稳' : '低迷'}
                        </p>
                      </div>
                    </div>

                    {/* 人才短缺 */}
                    <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                      <Users className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">人才短缺</p>
                        <p className="text-lg font-semibold">
                          {profile.marketData.talentShortage === 'severe' ? '严重' :
                           profile.marketData.talentShortage === 'moderate' ? '中等' : '充足'}
                        </p>
                      </div>
                    </div>

                    {/* 能力要求 */}
                    <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                      <Award className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">核心能力</p>
                        <p className="text-lg font-semibold">{profile.competencies.filter(c => c.importance === 'critical').length}项</p>
                      </div>
                    </div>
                  </div>

                  {/* AI洞察 */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="h-5 w-5 text-yellow-600" />
                      <span className="font-semibold text-gray-900 dark:text-white">AI洞察</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">关键要点</p>
                        <ul className="space-y-1">
                          {profile.aiInsights.keyPoints.slice(0, 2).map((point, i) => (
                            <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-1">
                              <span className="text-blue-600">•</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">招聘建议</p>
                        <ul className="space-y-1">
                          {profile.aiInsights.recommendations.slice(0, 2).map((rec, i) => (
                            <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-1">
                              <span className="text-green-600">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">风险因素</p>
                        <ul className="space-y-1">
                          {profile.aiInsights.riskFactors.slice(0, 2).map((risk, i) => (
                            <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-1">
                              <span className="text-red-600">•</span>
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* 核心能力 */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">核心能力模型</p>
                    <div className="space-y-2">
                      {profile.competencies.slice(0, 4).map((comp) => (
                        <div key={comp.name} className="flex items-center gap-3">
                          <span className="text-sm font-medium w-24">{comp.name}</span>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{
                                width: `${comp.level}%`,
                                backgroundColor: comp.importance === 'critical' ? '#dc2626' :
                                                 comp.importance === 'high' ? '#f97316' :
                                                 comp.importance === 'medium' ? '#eab308' : '#3b82f6'
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium w-10 text-right">{comp.level}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 创建岗位画像弹窗 */}
      <Dialog open={showCreateProfile} onOpenChange={setShowCreateProfile}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>创建岗位画像</DialogTitle>
            <DialogDescription>
              创建新的岗位画像，AI将自动分析生成完整画像
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>岗位名称 *</Label>
              <Input
                placeholder="输入岗位名称，如：高级前端工程师"
                value={newProfile.name}
                onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>所属部门 *</Label>
                <Input
                  placeholder="输入部门名称"
                  value={newProfile.department}
                  onChange={(e) => setNewProfile({ ...newProfile, department: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>岗位级别 *</Label>
                <Select
                  value={newProfile.level}
                  onValueChange={(v) => setNewProfile({ ...newProfile, level: v as JobLevel })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="junior">初级</SelectItem>
                    <SelectItem value="middle">中级</SelectItem>
                    <SelectItem value="senior">高级</SelectItem>
                    <SelectItem value="expert">专家</SelectItem>
                    <SelectItem value="manager">经理</SelectItem>
                    <SelectItem value="director">总监</SelectItem>
                    <SelectItem value="vp">副总裁</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>岗位描述 *</Label>
              <Textarea
                placeholder="描述岗位的主要职责和工作内容，AI将基于此生成完整画像"
                value={newProfile.description}
                onChange={(e) => setNewProfile({ ...newProfile, description: e.target.value })}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateProfile(false)}>
              取消
            </Button>
            <Button onClick={handleCreateProfile} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Sparkles className="h-4 w-4 mr-2" />
              创建并AI分析
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 岗位画像详情弹窗 */}
      {selectedProfile && (
        <Dialog open={!!selectedProfile} onOpenChange={() => setSelectedProfile(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                {selectedProfile.name}
              </DialogTitle>
              <DialogDescription>
                {selectedProfile.code} • {selectedProfile.department}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* 基本信息 */}
              <div>
                <h3 className="font-semibold mb-3">岗位描述</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{selectedProfile.description}</p>
              </div>

              {/* 职责 */}
              <div>
                <h3 className="font-semibold mb-3">主要职责</h3>
                <ul className="space-y-2">
                  {selectedProfile.responsibilities.map((resp, i) => (
                    <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 要求 */}
              <div>
                <h3 className="font-semibold mb-3">任职要求</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">学历要求</p>
                    <div className="flex gap-2">
                      {selectedProfile.requirements.education.map((edu, i) => (
                        <Badge key={i} variant="outline">{edu}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">经验要求</p>
                    <p className="text-sm">{selectedProfile.requirements.experience}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">技能要求</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfile.requirements.skills.map((skill, i) => (
                        <Badge key={i} className="bg-blue-100 text-blue-700">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 能力模型 */}
              <div>
                <h3 className="font-semibold mb-3">核心能力模型</h3>
                <div className="space-y-3">
                  {selectedProfile.competencies.map((comp) => (
                    <div key={comp.name}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{comp.name}</span>
                          <Badge
                            variant="outline"
                            className={
                              comp.importance === 'critical' ? 'text-red-600 border-red-200' :
                              comp.importance === 'high' ? 'text-orange-600 border-orange-200' :
                              'text-gray-600'
                            }
                          >
                            {comp.importance === 'critical' ? '关键' :
                             comp.importance === 'high' ? '高' :
                             comp.importance === 'medium' ? '中' : '低'}
                          </Badge>
                        </div>
                        <span className="text-sm font-medium">{comp.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${comp.level}%`,
                            backgroundColor: comp.importance === 'critical' ? '#dc2626' :
                                             comp.importance === 'high' ? '#f97316' :
                                             comp.importance === 'medium' ? '#eab308' : '#3b82f6'
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{comp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* KPI */}
              <div>
                <h3 className="font-semibold mb-3">关键绩效指标</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedProfile.kpis.map((kpi, i) => (
                    <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{kpi.name}</span>
                        <Badge variant="outline">{kpi.weight}%</Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">目标：{kpi.target}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 职业路径 */}
              <div>
                <h3 className="font-semibold mb-3">职业发展路径</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600" />
                    <span className="text-sm">{selectedProfile.careerPath.current}</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700" />
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-600" />
                    <div className="flex gap-2">
                      {selectedProfile.careerPath.next.map((next, i) => (
                        <Badge key={i} variant="outline">{next}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 市场数据 */}
              <div>
                <h3 className="font-semibold mb-3">市场数据</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">市场平均薪资</p>
                    <p className="text-lg font-semibold text-green-600">
                      ¥{(selectedProfile.marketData.avgSalary / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">市场需求</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {selectedProfile.marketData.marketDemand === 'high' ? '旺盛' :
                       selectedProfile.marketData.marketDemand === 'medium' ? '平稳' : '低迷'}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">人才稀缺度</p>
                    <p className="text-lg font-semibold text-orange-600">
                      {selectedProfile.marketData.talentShortage === 'severe' ? '严重' :
                       selectedProfile.marketData.talentShortage === 'moderate' ? '中等' : '充足'}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI洞察 */}
              <div>
                <h3 className="font-semibold mb-3">AI智能洞察</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <p className="text-xs text-blue-600 font-medium mb-2">💡 关键要点</p>
                    <ul className="space-y-1">
                      {selectedProfile.aiInsights.keyPoints.map((point, i) => (
                        <li key={i} className="text-sm">{point}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <p className="text-xs text-green-600 font-medium mb-2">✅ 招聘建议</p>
                    <ul className="space-y-1">
                      {selectedProfile.aiInsights.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm">{rec}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <p className="text-xs text-red-600 font-medium mb-2">⚠️ 风险因素</p>
                    <ul className="space-y-1">
                      {selectedProfile.aiInsights.riskFactors.map((risk, i) => (
                        <li key={i} className="text-sm">{risk}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => toast.info('导出中...')}>
                <Download className="h-4 w-4 mr-2" />
                导出画像
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Edit className="h-4 w-4 mr-2" />
                编辑画像
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
