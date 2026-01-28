'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader, createProPageHeader } from '@/components/layout/page-header';
import {
  Users,
  TrendingUp,
  Award,
  BookOpen,
  Target,
  Rocket,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  Zap,
  ArrowUpRight,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Code,
  Palette,
  MessageSquare,
  Users as UsersIcon,
  BarChart3,
  Lightbulb,
  Play,
  Download,
  Plus,
  Search,
  Filter,
  Calendar,
  FileText,
} from 'lucide-react';

// 技能矩阵数据
const skillMatrixData = [
  {
    category: '技术能力',
    skills: [
      { name: '前端开发', level: 85, employees: 45, required: 90 },
      { name: '后端开发', level: 80, employees: 40, required: 85 },
      { name: '数据库', level: 75, employees: 35, required: 80 },
      { name: '云计算', level: 65, employees: 25, required: 75 },
      { name: 'AI/ML', level: 55, employees: 15, required: 70 },
    ],
  },
  {
    category: '业务能力',
    skills: [
      { name: '产品思维', level: 70, employees: 30, required: 80 },
      { name: '项目管理', level: 75, employees: 28, required: 85 },
      { name: '数据分析', level: 72, employees: 32, required: 80 },
      { name: '商业意识', level: 68, employees: 25, required: 75 },
    ],
  },
  {
    category: '软技能',
    skills: [
      { name: '沟通能力', level: 85, employees: 50, required: 85 },
      { name: '团队协作', level: 88, employees: 48, required: 85 },
      { name: '问题解决', level: 80, employees: 42, required: 80 },
      { name: '创新思维', level: 75, employees: 35, required: 75 },
    ],
  },
];

// 培训推荐
const trainingRecommendations = [
  {
    id: 1,
    name: '前端高级开发实战',
    type: '技术',
    duration: '12周',
    instructor: '资深技术专家',
    difficulty: '高级',
    tags: ['前端', 'React', '性能优化'],
    targetSkills: ['前端开发', '性能优化'],
    participants: 15,
    status: '报名中',
    startDate: '2024-02-15',
    description: '深入学习前端性能优化、架构设计等高级主题',
    recommendedFor: ['高级前端工程师', '前端架构师'],
  },
  {
    id: 2,
    name: '产品经理进阶课程',
    type: '业务',
    duration: '8周',
    instructor: '产品总监',
    difficulty: '中级',
    tags: ['产品', '用户研究', '数据分析'],
    targetSkills: ['产品思维', '数据分析'],
    participants: 20,
    status: '进行中',
    startDate: '2024-01-20',
    description: '提升产品思维和数据分析能力，打造优秀产品',
    recommendedFor: ['产品经理', '产品专员'],
  },
  {
    id: 3,
    name: '领导力训练营',
    type: '管理',
    duration: '10周',
    instructor: '人力资源总监',
    difficulty: '高级',
    tags: ['管理', '领导力', '团队'],
    targetSkills: ['团队管理', '沟通能力'],
    participants: 12,
    status: '即将开始',
    startDate: '2024-02-20',
    description: '培养团队管理和领导能力，提升管理效能',
    recommendedFor: ['团队Leader', '部门经理'],
  },
  {
    id: 4,
    name: 'Python数据分析入门',
    type: '技术',
    duration: '6周',
    instructor: '数据科学家',
    difficulty: '初级',
    tags: ['Python', '数据分析', '可视化'],
    targetSkills: ['数据分析', 'Python'],
    participants: 25,
    status: '报名中',
    startDate: '2024-02-10',
    description: '从零开始学习Python数据分析，掌握数据处理和可视化',
    recommendedFor: ['业务分析师', '运营专员'],
  },
];

// 晋升路径
const promotionPaths = [
  {
    role: '研发线',
    levels: [
      {
        title: '初级工程师',
        code: 'L1',
        requirements: ['掌握基础编程技能', '能够独立完成任务', '良好的沟通能力'],
        skills: ['编码基础', '问题解决', '文档编写'],
        salaryRange: '10-15K',
        duration: '1-2年',
      },
      {
        title: '中级工程师',
        code: 'L2',
        requirements: ['熟练掌握专业技能', '能够带领小团队', '技术分享能力'],
        skills: ['技术专长', '团队协作', '技术指导'],
        salaryRange: '15-25K',
        duration: '2-3年',
      },
      {
        title: '高级工程师',
        code: 'L3',
        requirements: ['精通领域技术', '技术决策能力', '跨团队协作'],
        skills: ['架构设计', '技术决策', '资源整合'],
        salaryRange: '25-40K',
        duration: '3-4年',
      },
      {
        title: '技术专家',
        code: 'L4',
        requirements: ['技术前瞻性', '技术规划能力', '影响力建设'],
        skills: ['技术战略', '创新驱动', '技术影响力'],
        salaryRange: '40-60K',
        duration: '4-5年',
      },
      {
        title: '技术总监',
        code: 'L5',
        requirements: ['技术战略规划', '团队建设', '业务理解'],
        skills: ['技术管理', '战略规划', '业务洞察'],
        salaryRange: '60-100K',
        duration: '5年以上',
      },
    ],
  },
  {
    role: '产品线',
    levels: [
      {
        title: '产品专员',
        code: 'P1',
        requirements: ['了解产品流程', '需求分析能力', '文档编写能力'],
        skills: ['需求分析', '文档编写', '用户研究'],
        salaryRange: '12-18K',
        duration: '1-2年',
      },
      {
        title: '产品经理',
        code: 'P2',
        requirements: ['产品规划能力', '项目管理', '跨部门协作'],
        skills: ['产品规划', '项目管理', '数据分析'],
        salaryRange: '18-30K',
        duration: '2-3年',
      },
      {
        title: '高级产品经理',
        code: 'P3',
        requirements: ['战略思维能力', '产品创新能力', '团队管理'],
        skills: ['产品战略', '创新设计', '资源整合'],
        salaryRange: '30-50K',
        duration: '3-4年',
      },
      {
        title: '产品总监',
        code: 'P4',
        requirements: ['产品战略规划', '团队建设', '商业模式'],
        skills: ['战略规划', '团队领导', '商业模式'],
        salaryRange: '50-80K',
        duration: '4-5年',
      },
    ],
  },
];

// 能力评估数据
const capabilityAssessment = {
  employee: {
    name: '张三',
    position: '高级前端工程师',
    department: '研发部',
    level: 'L3',
    currentLevel: '高级工程师',
    nextLevel: '技术专家',
    overallScore: 85,
  },
  dimensions: [
    {
      name: '专业技能',
      score: 88,
      weight: 40,
      items: [
        { name: '编码能力', score: 90, feedback: '代码质量高，逻辑清晰' },
        { name: '架构设计', score: 85, feedback: '能够设计合理的技术架构' },
        { name: '性能优化', score: 88, feedback: '有丰富的性能优化经验' },
        { name: '技术前瞻', score: 82, feedback: '关注新技术，有学习热情' },
      ],
    },
    {
      name: '业务能力',
      score: 80,
      weight: 25,
      items: [
        { name: '需求理解', score: 85, feedback: '能够准确理解业务需求' },
        { name: '产品思维', score: 75, feedback: '需要加强产品思维' },
        { name: '数据分析', score: 78, feedback: '具备基本的数据分析能力' },
        { name: '商业意识', score: 72, feedback: '需要提升商业敏感度' },
      ],
    },
    {
      name: '软技能',
      score: 85,
      weight: 20,
      items: [
        { name: '沟通能力', score: 90, feedback: '沟通表达清晰高效' },
        { name: '团队协作', score: 88, feedback: '团队协作能力强' },
        { name: '问题解决', score: 85, feedback: '善于解决复杂问题' },
        { name: '创新思维', score: 75, feedback: '需要加强创新意识' },
      ],
    },
    {
      name: '管理能力',
      score: 75,
      weight: 15,
      items: [
        { name: '项目管理', score: 78, feedback: '具备项目管理能力' },
        { name: '团队指导', score: 72, feedback: '需要提升指导能力' },
        { name: '资源协调', score: 75, feedback: '能够有效协调资源' },
      ],
    },
  ],
};

// 成长记录
const growthRecords = [
  {
    id: 1,
    type: '培训',
    title: 'React性能优化实战',
    date: '2024-01-15',
    status: '已完成',
    result: '优秀',
    description: '学习了React性能优化的最佳实践，并应用到项目中',
    rating: 95,
  },
  {
    id: 2,
    type: '项目',
    title: '电商平台重构',
    date: '2023-12-20',
    status: '已完成',
    result: '成功',
    description: '主导电商平台前端重构，性能提升40%',
    rating: 92,
  },
  {
    id: 3,
    type: '晋升',
    title: '晋升高级工程师',
    date: '2023-11-10',
    status: '已完成',
    result: '通过',
    description: '通过晋升评审，晋升为高级工程师',
    rating: 90,
  },
  {
    id: 4,
    type: '培训',
    title: 'TypeScript进阶',
    date: '2023-10-25',
    status: '已完成',
    result: '良好',
    description: '系统学习了TypeScript高级特性',
    rating: 88,
  },
];

export default function EmployeeGrowthPage() {
  const [activeTab, setActiveTab] = useState('skills');
  const [selectedRole, setSelectedRole] = useState('研发线');

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      '初级': 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-200',
      '中级': 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-200',
      '高级': 'bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-200',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      '报名中': 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-200',
      '进行中': 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-200',
      '即将开始': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-200',
      '已完成': 'bg-gray-100 text-gray-800 dark:bg-gray-950/30 dark:text-gray-200',
      '成功': 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-200',
      '通过': 'bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      '技术': Code,
      '业务': BarChart3,
      '管理': UsersIcon,
      '培训': BookOpen,
      '项目': Briefcase,
      '晋升': Rocket,
    };
    return icons[type] || FileText;
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <PageHeader {...createProPageHeader({
        icon: GraduationCap,
        title: '员工成长路径',
        description: '技能矩阵、培训推荐、晋升路径、能力评估，助力员工持续成长',
        extraActions: (
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出成长报告
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
              <Plus className="h-4 w-4 mr-2" />
              创建培训计划
            </Button>
          </div>
        )
      })} />

      {/* Tab导航 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full max-w-lg grid-cols-4">
          <TabsTrigger value="skills">技能矩阵</TabsTrigger>
          <TabsTrigger value="training">培训推荐</TabsTrigger>
          <TabsTrigger value="promotion">晋升路径</TabsTrigger>
          <TabsTrigger value="assessment">能力评估</TabsTrigger>
        </TabsList>

        {/* 技能矩阵 */}
        <TabsContent value="skills" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {skillMatrixData.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{category.category}</CardTitle>
                  <CardDescription>团队平均技能掌握情况</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.skills.map((skill) => (
                      <div key={skill.name}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{skill.name}</span>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  掌握人数：{skill.employees}人
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold">{skill.level}%</span>
                                  {skill.level < skill.required && (
                                    <Badge variant="outline" className="text-xs">
                                      目标：{skill.required}%
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Progress value={skill.level} className="h-2" />
                          </div>
                        </div>
                        {skill.level < skill.required && (
                          <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg flex items-center gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="text-gray-700 dark:text-gray-300">
                              该技能存在缺口，建议安排针对性培训
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 培训推荐 */}
        <TabsContent value="training" className="space-y-4">
          {/* 统计 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>培训课程</CardDescription>
                <CardTitle className="text-3xl">{trainingRecommendations.length}</CardTitle>
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <BookOpen className="h-3 w-3 mr-1" />
                  个课程
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>参与人数</CardDescription>
                <CardTitle className="text-3xl">
                  {trainingRecommendations.reduce((sum, t) => sum + t.participants, 0)}
                </CardTitle>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  较上月 +18人
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>进行中</CardDescription>
                <CardTitle className="text-3xl text-blue-600">
                  {trainingRecommendations.filter(t => t.status === '进行中').length}
                </CardTitle>
                <div className="flex items-center text-xs text-blue-600 mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  个课程
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>完成率</CardDescription>
                <CardTitle className="text-3xl text-green-600">85%</CardTitle>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  整体完成率
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* 培训列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainingRecommendations.map((training) => {
              const TypeIcon = getTypeIcon(training.type);
              return (
                <Card key={training.id} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          training.type === '技术' ? 'bg-blue-100 dark:bg-blue-950/30' :
                          training.type === '业务' ? 'bg-green-100 dark:bg-green-950/30' :
                          'bg-purple-100 dark:bg-purple-950/30'
                        }`}>
                          <TypeIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{training.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getDifficultyColor(training.difficulty)}>
                              {training.difficulty}
                            </Badge>
                            <Badge className={getStatusColor(training.status)}>
                              {training.status === '进行中' && <Play className="h-3 w-3 mr-1" />}
                              {training.status === '即将开始' && <Clock className="h-3 w-3 mr-1" />}
                              {training.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {training.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">讲师</span>
                        <span className="font-medium">{training.instructor}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">时长</span>
                        <span className="font-medium">{training.duration}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">开始时间</span>
                        <span className="font-medium">{training.startDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">参与人数</span>
                        <span className="font-medium">{training.participants}人</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">技能标签</div>
                      <div className="flex flex-wrap gap-2">
                        {training.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">推荐岗位</div>
                      <div className="flex flex-wrap gap-2">
                        {training.recommendedFor.map((role, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <Button variant="ghost" size="sm">
                        查看详情
                      </Button>
                      <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700" size="sm">
                        {training.status === '报名中' ? '立即报名' : '继续学习'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* 晋升路径 */}
        <TabsContent value="promotion" className="space-y-4">
          <div className="flex items-center justify-between">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[200px]">
                <Briefcase className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="研发线">研发线</SelectItem>
                <SelectItem value="产品线">产品线</SelectItem>
                <SelectItem value="销售线">销售线</SelectItem>
                <SelectItem value="运营线">运营线</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {promotionPaths
            .filter(path => path.role === selectedRole)
            .map((path, index) => (
              <div key={index} className="space-y-4">
                {path.levels.map((level, levelIndex) => (
                  <Card key={levelIndex} className="hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                            {level.code}
                          </div>
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {level.title}
                              {levelIndex === path.levels.length - 1 && (
                                <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
                                  <Star className="h-3 w-3 mr-1" />
                                  顶级职位
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription>预计晋升周期：{level.duration}</CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600 dark:text-gray-400">薪酬范围</div>
                          <div className="font-bold text-lg">{level.salaryRange}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* 基本要求 */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">晋升要求</h4>
                          <ul className="space-y-1">
                            {level.requirements.map((req, reqIndex) => (
                              <li key={reqIndex} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 技能要求 */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">核心技能</h4>
                          <div className="flex flex-wrap gap-2">
                            {level.skills.map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="secondary">
                                <Zap className="h-3 w-3 mr-1" />
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* 晋升进度（如果是当前等级） */}
                        {levelIndex > 0 && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">从上一级晋升进度</span>
                              <span className="text-sm font-bold">75%</span>
                            </div>
                            <Progress value={75} className="h-2" />
                            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                              预计3个月后可申请晋升
                            </div>
                          </div>
                        )}
                      </div>

                      {levelIndex < path.levels.length - 1 && (
                        <div className="flex items-center justify-center mt-4">
                          <ArrowRight className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
        </TabsContent>

        {/* 能力评估 */}
        <TabsContent value="assessment" className="space-y-4">
          {/* 员工信息 */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                    {capabilityAssessment.employee.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle>{capabilityAssessment.employee.name}</CardTitle>
                    <CardDescription>
                      {capabilityAssessment.employee.position} · {capabilityAssessment.employee.department}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">综合评分</div>
                  <div className="text-3xl font-bold text-purple-600">
                    {capabilityAssessment.employee.overallScore}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    当前：{capabilityAssessment.employee.currentLevel} → 目标：{capabilityAssessment.employee.nextLevel}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* 能力维度 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {capabilityAssessment.dimensions.map((dimension, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{dimension.name}</CardTitle>
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      {dimension.score}分
                    </Badge>
                  </div>
                  <CardDescription>权重：{dimension.weight}%</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">总体进度</span>
                      <span className="text-sm font-bold">{dimension.score}%</span>
                    </div>
                    <Progress value={dimension.score} className="h-2 mb-4" />

                    <div className="space-y-3">
                      {dimension.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{item.name}</span>
                            <span className="text-sm font-bold">{item.score}分</span>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {item.feedback}
                          </div>
                          <Progress value={item.score} className="h-1.5 mt-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 成长记录 */}
          <Card>
            <CardHeader>
              <CardTitle>成长记录</CardTitle>
              <CardDescription>培训、项目、晋升等成长历程</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {growthRecords.map((record) => {
                  const TypeIcon = getTypeIcon(record.type);
                  return (
                    <div key={record.id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-all">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white flex-shrink-0">
                        <TypeIcon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h4 className="font-medium">{record.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getStatusColor(record.status)}>
                                {record.status}
                              </Badge>
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-200">
                                {record.result}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600 dark:text-gray-400">{record.date}</div>
                            {record.rating && (
                              <div className="flex items-center gap-1 justify-end mt-1">
                                <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
                                <span className="text-sm font-bold">{record.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {record.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 改进建议 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                改进建议
              </CardTitle>
              <CardDescription>基于能力评估的个性化建议</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">提升产品思维</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    建议参与产品经理培训课程，加强产品理解和用户思维
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">技术创新</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    多关注前沿技术，参与技术分享和创新项目
                  </p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <UsersIcon className="h-4 w-4 text-green-600" />
                    <span className="font-medium">团队指导</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    提升团队指导能力，帮助团队成员成长
                  </p>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">数据驱动</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    加强数据分析能力，用数据指导决策
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
