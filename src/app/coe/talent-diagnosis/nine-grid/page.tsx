'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader, createProPageHeader } from '@/components/layout/page-header';
import {
  Trophy,
  Users,
  Star,
  TrendingUp,
  Target,
  Award,
  Zap,
  ArrowUpRight,
  Search,
  Filter,
  Download,
  Eye,
  Briefcase,
  Building2,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';

// 人才九宫格数据
const talentGridData = [
  // 第一象限：高绩效高潜力（明星员工）
  {
    id: 1,
    name: '张三',
    position: '高级工程师',
    department: '研发部',
    performance: 95,
    potential: 90,
    quadrant: 'star',
    avatar: 'Z',
    years: 5,
    risk: 'low',
    action: '晋升',
  },
  {
    id: 2,
    name: '李四',
    position: '产品经理',
    department: '产品部',
    performance: 92,
    potential: 88,
    quadrant: 'star',
    avatar: 'L',
    years: 4,
    risk: 'low',
    action: '晋升',
  },
  
  // 第二象限：高绩效中潜力（核心骨干）
  {
    id: 3,
    name: '王五',
    position: '销售经理',
    department: '销售部',
    performance: 90,
    potential: 70,
    quadrant: 'backbone',
    avatar: 'W',
    years: 3,
    risk: 'low',
    action: '培养',
  },
  {
    id: 4,
    name: '赵六',
    position: '架构师',
    department: '研发部',
    performance: 88,
    potential: 65,
    quadrant: 'backbone',
    avatar: 'Z',
    years: 6,
    risk: 'low',
    action: '培养',
  },
  
  // 第三象限：中绩效高潜力（潜力股）
  {
    id: 5,
    name: '钱七',
    position: '前端工程师',
    department: '研发部',
    performance: 75,
    potential: 85,
    quadrant: 'potential',
    avatar: 'Q',
    years: 2,
    risk: 'medium',
    action: '培养',
  },
  {
    id: 6,
    name: '孙八',
    position: '运营专员',
    department: '运营部',
    performance: 72,
    potential: 80,
    quadrant: 'potential',
    avatar: 'S',
    years: 1.5,
    risk: 'medium',
    action: '培养',
  },
  
  // 第四象限：中绩效中潜力（中坚力量）
  {
    id: 7,
    name: '周九',
    position: 'UI设计师',
    department: '设计部',
    performance: 80,
    potential: 60,
    quadrant: 'solid',
    avatar: 'Z',
    years: 2,
    risk: 'low',
    action: '维持',
  },
  {
    id: 8,
    name: '吴十',
    position: '测试工程师',
    department: '研发部',
    performance: 78,
    potential: 55,
    quadrant: 'solid',
    avatar: 'W',
    years: 3,
    risk: 'low',
    action: '维持',
  },
  
  // 第五象限：低绩效高潜力（问题员工）
  {
    id: 9,
    name: '郑十一',
    position: '销售代表',
    department: '销售部',
    performance: 60,
    potential: 75,
    quadrant: 'problem',
    avatar: 'Z',
    years: 1,
    risk: 'high',
    action: '辅导',
  },
  
  // 第六象限：低绩效中潜力（观察对象）
  {
    id: 10,
    name: '王十二',
    position: '行政专员',
    department: '行政部',
    performance: 65,
    potential: 50,
    quadrant: 'watch',
    avatar: 'W',
    years: 1,
    risk: 'high',
    action: '观察',
  },
  
  // 第七象限：中绩效低潜力（稳定员工）
  {
    id: 11,
    name: '蒋十三',
    position: '会计',
    department: '财务部',
    performance: 82,
    potential: 40,
    quadrant: 'stable',
    avatar: 'J',
    years: 4,
    risk: 'low',
    action: '维持',
  },
  {
    id: 12,
    name: '沈十四',
    position: '人事专员',
    department: '人力资源部',
    performance: 79,
    potential: 35,
    quadrant: 'stable',
    avatar: 'S',
    years: 3,
    risk: 'low',
    action: '维持',
  },
  
  // 第八象限：低绩效低潜力（需改进）
  {
    id: 13,
    name: '韩十五',
    position: '客服专员',
    department: '客服部',
    performance: 55,
    potential: 45,
    quadrant: 'improve',
    avatar: 'H',
    years: 0.5,
    risk: 'high',
    action: 'PIP',
  },
  {
    id: 14,
    name: '杨十六',
    position: '市场专员',
    department: '市场部',
    performance: 58,
    potential: 40,
    quadrant: 'improve',
    avatar: 'Y',
    years: 0.5,
    risk: 'high',
    action: 'PIP',
  },
];

// 类型守卫
function isValidQuadrantKey(key: string): key is keyof typeof quadrantConfig {
  return key in quadrantConfig;
}

// 象限配置
const quadrantConfig = {
  star: {
    name: '明星员工',
    description: '高绩效+高潜力',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    textColor: 'text-purple-600',
    icon: Star,
    action: '重点培养与晋升',
  },
  backbone: {
    name: '核心骨干',
    description: '高绩效+中潜力',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-600',
    icon: Award,
    action: '保持与激励',
  },
  potential: {
    name: '潜力股',
    description: '中绩效+高潜力',
    color: 'from-green-500 to-teal-600',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    borderColor: 'border-green-200 dark:border-green-800',
    textColor: 'text-green-600',
    icon: TrendingUp,
    action: '重点培养',
  },
  solid: {
    name: '中坚力量',
    description: '中绩效+中潜力',
    color: 'from-indigo-500 to-blue-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    textColor: 'text-indigo-600',
    icon: Target,
    action: '保持与激励',
  },
  problem: {
    name: '问题员工',
    description: '低绩效+高潜力',
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    textColor: 'text-orange-600',
    icon: Zap,
    action: '深入辅导',
  },
  watch: {
    name: '观察对象',
    description: '低绩效+中潜力',
    color: 'from-yellow-500 to-orange-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    textColor: 'text-yellow-600',
    icon: Eye,
    action: '密切观察',
  },
  stable: {
    name: '稳定员工',
    description: '中绩效+低潜力',
    color: 'from-gray-500 to-slate-600',
    bgColor: 'bg-gray-50 dark:bg-gray-800',
    borderColor: 'border-gray-200 dark:border-gray-700',
    textColor: 'text-gray-600',
    icon: Users,
    action: '稳定发展',
  },
  improve: {
    name: '需改进',
    description: '低绩效+低潜力',
    color: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-50 dark:bg-red-950/20',
    borderColor: 'border-red-200 dark:border-red-800',
    textColor: 'text-red-600',
    icon: Target,
    action: 'PIP改进计划',
  },
};

// 统计数据
const statistics = {
  total: talentGridData.length,
  byQuadrant: {
    star: 2,
    backbone: 2,
    potential: 2,
    solid: 2,
    problem: 1,
    watch: 1,
    stable: 2,
    improve: 2,
  },
  avgPerformance: 77.4,
  avgPotential: 62.9,
};

export default function NineGridPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedQuadrant, setSelectedQuadrant] = useState('all');

  // 过滤数据
  const filteredData = talentGridData.filter(item => {
    const matchDept = selectedDepartment === 'all' || item.department === selectedDepartment;
    const matchQuad = selectedQuadrant === 'all' || item.quadrant === selectedQuadrant;
    return matchDept && matchQuad;
  });

  // 计算象限统计
  const quadrantCount = Object.entries(quadrantConfig).reduce((acc, [key, _]) => {
    if (isValidQuadrantKey(key)) {
      acc[key] = filteredData.filter(item => item.quadrant === key).length;
    }
    return acc;
  }, {} as Record<keyof typeof quadrantConfig, number>);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <PageHeader {...createProPageHeader({
        icon: Trophy,
        title: '人才九宫格',
        description: '基于绩效和潜力双维度分析人才，科学制定人才发展策略',
        badge: { text: 'PRO', color: 'from-purple-600 to-pink-600' },
        extraActions: (
          <div className="flex items-center gap-2">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[140px]">
                <Building2 className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有部门</SelectItem>
                <SelectItem value="研发部">研发部</SelectItem>
                <SelectItem value="销售部">销售部</SelectItem>
                <SelectItem value="产品部">产品部</SelectItem>
                <SelectItem value="运营部">运营部</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出报告
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <BarChart3 className="h-4 w-4 mr-2" />
              AI智能分析
            </Button>
          </div>
        )
      })} />

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>总人数</CardDescription>
            <CardTitle className="text-3xl">{filteredData.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>平均绩效</CardDescription>
            <CardTitle className="text-3xl">{statistics.avgPerformance.toFixed(1)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>平均潜力</CardDescription>
            <CardTitle className="text-3xl">{statistics.avgPotential.toFixed(1)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>明星员工</CardDescription>
            <CardTitle className="text-3xl text-purple-600">{quadrantCount.star}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* 九宫格可视化 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-purple-600" />
            人才九宫格分布
          </CardTitle>
          <CardDescription>
            横轴：绩效表现 | 纵轴：潜力评估
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 九宫格坐标轴 */}
          <div className="relative">
            {/* 纵轴标签 */}
            <div className="absolute -left-8 top-0 h-full flex flex-col justify-between py-12 text-xs text-gray-600 dark:text-gray-400">
              <span>高</span>
              <span>潜力</span>
              <span>低</span>
            </div>

            {/* 横轴标签 */}
            <div className="absolute -bottom-8 left-0 w-full flex justify-around px-12 text-xs text-gray-600 dark:text-gray-400">
              <span>低</span>
              <span>绩效</span>
              <span>高</span>
            </div>

            {/* 九宫格 */}
            <div className="grid grid-cols-3 gap-1 ml-8">
              {/* 第一行：高潜力 */}
              {[null, 'potential', 'star'].map((quadrant, idx) => {
                const data = quadrant ? filteredData.filter(item => item.quadrant === quadrant) : [];
                const config = quadrant ? quadrantConfig[quadrant as keyof typeof quadrantConfig] : null;
                
                return (
                  <div
                    key={idx}
                    className={config ? `${config.bgColor} ${config.borderColor} border rounded-lg p-4 min-h-[200px]` : 'bg-gray-100 dark:bg-gray-800 rounded-lg'}
                  >
                    {config && quadrant && (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <Badge className={config.textColor}>
                            {config.name}
                          </Badge>
                          <span className="text-sm font-bold">{data.length}人</span>
                        </div>
                        <div className="space-y-2">
                          {data.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded-lg">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                                {item.avatar}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.name}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{item.position}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                          {config.action}
                        </p>
                      </>
                    )}
                  </div>
                );
              })}

              {/* 第二行：中潜力 */}
              {['problem', 'solid', 'backbone'].map((quadrant, idx) => {
                const data = filteredData.filter(item => item.quadrant === quadrant);
                const config = isValidQuadrantKey(quadrant) ? quadrantConfig[quadrant] : null;
                
                if (!config) return null;
                
                return (
                  <div
                    key={idx}
                    className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 min-h-[200px]`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={config.textColor}>
                        {config.name}
                      </Badge>
                      <span className="text-sm font-bold">{data.length}人</span>
                    </div>
                    <div className="space-y-2">
                      {data.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                            {item.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{item.position}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      {config.action}
                    </p>
                  </div>
                );
              })}

              {/* 第三行：低潜力 */}
              {['improve', 'stable', 'watch'].map((quadrant, idx) => {
                const data = filteredData.filter(item => item.quadrant === quadrant);
                const config = isValidQuadrantKey(quadrant) ? quadrantConfig[quadrant] : null;
                
                if (!config) return null;
                
                return (
                  <div
                    key={idx}
                    className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 min-h-[200px]`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={config.textColor}>
                        {config.name}
                      </Badge>
                      <span className="text-sm font-bold">{data.length}人</span>
                    </div>
                    <div className="space-y-2">
                      {data.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                            {item.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{item.position}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      {config.action}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 员工详情列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            员工详情
          </CardTitle>
          <CardDescription>
            查看每位员工的详细信息和行动计划
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredData.map((item) => {
              const config = isValidQuadrantKey(item.quadrant) ? quadrantConfig[item.quadrant] : null;
              
              if (!config) return null;
              
              const ConfigIcon = config.icon;
              
              return (
                <Card key={item.id} className={`${config.bgColor} ${config.borderColor} border`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                          {item.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{item.name}</h4>
                            <Badge className={config.textColor}>
                              {config.name}
                            </Badge>
                            {item.risk === 'high' && (
                              <Badge className="bg-red-100 text-red-600">
                                高风险
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              <span>{item.position}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              <span>{item.department}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{item.years}年</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">绩效得分</p>
                              <div className="flex items-center gap-2">
                                <Progress value={item.performance} className="h-2 flex-1" />
                                <span className="text-sm font-medium">{item.performance}</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">潜力评估</p>
                              <div className="flex items-center gap-2">
                                <Progress value={item.potential} className="h-2 flex-1" />
                                <span className="text-sm font-medium">{item.potential}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline" onClick={() => toast.success('查看详情')}>
                          <Eye className="h-4 w-4 mr-2" />
                          详情
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                          <ConfigIcon className="h-4 w-4 mr-2" />
                          {config.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 行动计划 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            人才发展行动计划
          </CardTitle>
          <CardDescription>
            基于九宫格分析结果，制定针对性的发展计划
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(quadrantConfig).map(([key, config]) => {
              if (!isValidQuadrantKey(key)) return null;
              const count = quadrantCount[key];
              const ConfigIcon = config.icon;
              
              return (
                <Card key={key} className={`${config.bgColor} ${config.borderColor} border`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <ConfigIcon className={`h-5 w-5 ${config.textColor}`} />
                      <Badge className={config.textColor}>
                        {count}人
                      </Badge>
                    </div>
                    <h4 className="font-medium mb-1">{config.name}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {config.description}
                    </p>
                    <p className="text-sm font-medium text-blue-600">
                      {config.action}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
