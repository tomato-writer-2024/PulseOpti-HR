'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Trophy,
  Users,
  TrendingUp,
  Target,
  Award,
  Star,
  Zap,
  Crown,
  ArrowUp,
  ArrowDown,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Shield,
  Sparkles,
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  performance: number;
  potential: number;
  engagement: number;
  skills: string[];
  avatar: string;
  years: number;
}

interface TalentGridCell {
  id: string;
  label: string;
  description: string;
  color: string;
  employees: Employee[];
  action: string;
}

// 人才数据
const TALENT_DATA = {
  // 员工数据
  employees: [
    {
      id: '1',
      name: '张三',
      department: '技术部',
      position: '高级工程师',
      performance: 95,
      potential: 90,
      engagement: 92,
      skills: ['Java', 'Python', '架构设计', '团队管理'],
      avatar: 'ZS',
      years: 5,
    },
    {
      id: '2',
      name: '李四',
      department: '销售部',
      position: '销售经理',
      performance: 90,
      potential: 88,
      engagement: 85,
      skills: ['销售技巧', '客户管理', '团队管理', '数据分析'],
      avatar: 'LS',
      years: 4,
    },
    {
      id: '3',
      name: '王五',
      department: '产品部',
      position: '产品经理',
      performance: 88,
      potential: 85,
      engagement: 90,
      skills: ['产品设计', '数据分析', '项目管理', '用户研究'],
      avatar: 'WW',
      years: 3,
    },
    {
      id: '4',
      name: '赵六',
      department: '市场部',
      position: '市场专员',
      performance: 75,
      potential: 70,
      engagement: 78,
      skills: ['市场策划', '内容创作', '社交媒体', '活动组织'],
      avatar: 'ZL',
      years: 2,
    },
    {
      id: '5',
      name: '钱七',
      department: '技术部',
      position: '工程师',
      performance: 70,
      potential: 85,
      engagement: 80,
      skills: ['JavaScript', 'React', 'Vue', 'Node.js'],
      avatar: 'QQ',
      years: 2,
    },
  ],

  // 九宫格数据
  nineGrid: {
    highPerformance: {
      label: '高绩效高潜力',
      description: '核心人才，重点培养',
      color: 'from-green-500 to-emerald-600',
      employees: [
        {
          id: '1',
          name: '张三',
          department: '技术部',
          position: '高级工程师',
          performance: 95,
          potential: 90,
          engagement: 92,
          skills: ['Java', 'Python', '架构设计', '团队管理'],
          avatar: 'ZS',
          years: 5,
        },
      ],
      action: '制定发展计划',
    },
    mediumPerformance: {
      label: '中绩效高潜力',
      description: '潜力人才，持续关注',
      color: 'from-blue-500 to-cyan-600',
      employees: [
        {
          id: '5',
          name: '钱七',
          department: '技术部',
          position: '工程师',
          performance: 70,
          potential: 85,
          engagement: 80,
          skills: ['JavaScript', 'React', 'Vue', 'Node.js'],
          avatar: 'QQ',
          years: 2,
        },
      ],
      action: '提供培训机会',
    },
    lowPerformance: {
      label: '低绩效高潜力',
      description: '待培养，需要辅导',
      color: 'from-purple-500 to-pink-600',
      employees: [],
      action: '制定改进计划',
    },
    highPerformanceMedium: {
      label: '高绩效中潜力',
      description: '业务骨干，稳定可靠',
      color: 'from-yellow-500 to-orange-600',
      employees: [
        {
          id: '2',
          name: '李四',
          department: '销售部',
          position: '销售经理',
          performance: 90,
          potential: 78,
          engagement: 85,
          skills: ['销售技巧', '客户管理', '团队管理', '数据分析'],
          avatar: 'LS',
          years: 4,
        },
        {
          id: '3',
          name: '王五',
          department: '产品部',
          position: '产品经理',
          performance: 88,
          potential: 75,
          engagement: 90,
          skills: ['产品设计', '数据分析', '项目管理', '用户研究'],
          avatar: 'WW',
          years: 3,
        },
      ],
      action: '提供发展机会',
    },
    mediumPerformanceMedium: {
      label: '中绩效中潜力',
      description: '大多数员工，保持关注',
      color: 'from-gray-500 to-gray-600',
      employees: [],
      action: '保持现有水平',
    },
    lowPerformanceMedium: {
      label: '低绩效中潜力',
      description: '需要关注，可能流失',
      color: 'from-red-500 to-orange-600',
      employees: [],
      action: '制定挽留计划',
    },
    highPerformanceLow: {
      label: '高绩效低潜力',
      description: '专业人才，稳定贡献',
      color: 'from-teal-500 to-blue-600',
      employees: [],
      action: '保持激励',
    },
    mediumPerformanceLow: {
      label: '中绩效低潜力',
      description: '稳定员工，维持现状',
      color: 'from-slate-500 to-gray-600',
      employees: [],
      action: '持续关注',
    },
    lowPerformanceLow: {
      label: '低绩效低潜力',
      description: '需要改进，可能淘汰',
      color: 'from-red-600 to-pink-600',
      employees: [],
      action: '制定退出计划',
    },
  },

  // 人才盘点统计
  stats: {
    totalEmployees: 485,
    highPerformer: 58,
    mediumPerformer: 310,
    lowPerformer: 117,
    highPotential: 125,
    readyForPromotion: 35,
    needImprovement: 42,
  },

  // 关键岗位继任者
  succession: [
    {
      position: '技术总监',
      current: '张三',
      successors: ['李四 (2年内)', '王五 (3年内)'],
      readiness: '2年',
    },
    {
      position: '销售总监',
      current: '李四',
      successors: ['王五 (1年内)', '赵六 (2年内)'],
      readiness: '1年',
    },
    {
      position: '产品总监',
      current: '王五',
      successors: ['钱七 (2年内)', '赵六 (3年内)'],
      readiness: '2年',
    },
  ],
};

export default function TalentReviewPage() {
  const [selectedView, setSelectedView] = useState('grid');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              人才管理
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
              AI增强
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            人才盘点
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            全面评估人才，优化人才配置，建立人才梯队
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="选择部门" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部部门</SelectItem>
              <SelectItem value="tech">技术部</SelectItem>
              <SelectItem value="sales">销售部</SelectItem>
              <SelectItem value="product">产品部</SelectItem>
              <SelectItem value="marketing">市场部</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
            <Sparkles className="h-4 w-4 mr-2" />
            AI智能分析
          </Button>
        </div>
      </div>

      {/* PRO功能提示 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Crown className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                升级PRO，解锁AI智能人才分析
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                PRO版本提供AI能力评估、人才画像、智能推荐等高级功能，帮助企业精准识别和培养人才。
              </p>
            </div>
          </div>
          <Badge className="bg-purple-600 text-white">PRO</Badge>
        </div>
      </div>

      {/* 人才盘点统计 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">员工总数</div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {TALENT_DATA.stats.totalEmployees}
            </div>
            <div className="text-xs text-gray-500 mt-1">活跃员工</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">高绩效员工</div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {TALENT_DATA.stats.highPerformer}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              占比 {((TALENT_DATA.stats.highPerformer / TALENT_DATA.stats.totalEmployees) * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">高潜力人才</div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {TALENT_DATA.stats.highPotential}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              占比 {((TALENT_DATA.stats.highPotential / TALENT_DATA.stats.totalEmployees) * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">待晋升员工</div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {TALENT_DATA.stats.readyForPromotion}
            </div>
            <div className="text-xs text-gray-500 mt-1">已做好晋升准备</div>
          </CardContent>
        </Card>
      </div>

      {/* 九宫格 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            人才九宫格
          </CardTitle>
          <CardDescription>
            基于绩效和潜力的二维分析
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid">九宫格视图</TabsTrigger>
              <TabsTrigger value="list">列表视图</TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="mt-6">
              <div className="grid gap-4 md:grid-cols-3">
                {Object.entries(TALENT_DATA.nineGrid).map(([key, cell]) => (
                  <Card
                    key={key}
                    className={`border-2 hover:shadow-lg transition-all duration-300 ${
                      cell.employees.length > 0 ? 'bg-gradient-to-br ' + cell.color + ' text-white' : ''
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{cell.label}</CardTitle>
                      <CardDescription className={cell.employees.length > 0 ? 'text-white/80' : ''}>
                        {cell.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {cell.employees.length > 0 ? (
                        <div className="space-y-2">
                          {cell.employees.map((employee) => (
                            <div
                              key={employee.id}
                              className="flex items-center gap-2 bg-white/10 rounded-lg p-2"
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {employee.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {employee.name}
                                </div>
                                <div className="text-xs text-white/80 truncate">
                                  {employee.department} · {employee.position}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-center text-white/70 py-4">
                          暂无员工
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list" className="mt-6">
              <div className="border rounded-lg">
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-800 font-medium text-sm text-gray-700 dark:text-gray-300">
                  <div className="col-span-2">员工</div>
                  <div className="col-span-2">部门</div>
                  <div className="col-span-2">职位</div>
                  <div className="col-span-2">绩效</div>
                  <div className="col-span-2">潜力</div>
                  <div className="col-span-2">状态</div>
                </div>
                {TALENT_DATA.employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="grid grid-cols-12 gap-4 p-4 border-t hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="col-span-2 flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {employee.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {employee.name}
                      </span>
                    </div>
                    <div className="col-span-2 text-sm text-gray-600 dark:text-gray-400">
                      {employee.department}
                    </div>
                    <div className="col-span-2 text-sm text-gray-600 dark:text-gray-400">
                      {employee.position}
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Progress value={employee.performance} className="flex-1 h-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                          {employee.performance}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Progress value={employee.potential} className="flex-1 h-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                          {employee.potential}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Badge
                        className={
                          employee.performance >= 90 && employee.potential >= 80
                            ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                            : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                        }
                      >
                        {employee.performance >= 90 && employee.potential >= 80 ? '核心人才' : '潜力人才'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 继任者计划 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            关键岗位继任计划
          </CardTitle>
          <CardDescription>
            确保关键岗位有合格的继任者
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {TALENT_DATA.succession.map((plan) => (
              <div
                key={plan.position}
                className="border rounded-lg p-4 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {plan.position}
                      </h4>
                      <Badge className="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                        关键岗位
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      当前负责人: <span className="font-medium text-gray-900 dark:text-white">
                        {plan.current}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      继任者: <span className="font-medium text-gray-900 dark:text-white">
                        {plan.successors.join(', ')}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      准备就绪时间
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {plan.readiness}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
