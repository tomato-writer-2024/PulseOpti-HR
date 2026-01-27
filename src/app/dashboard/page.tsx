'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ResponsiveImage } from '@/components/performance/optimized-image';
import { 
  Activity, 
  Users, 
  Clock, 
  TrendingUp, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  Calendar,
  Zap,
  Crown,
  Sparkles,
  Award,
  Target,
  DollarSign,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Star,
  Shield,
  Download,
  Building,
} from 'lucide-react';
import Link from 'next/link';

interface QuickStat {
  title: string;
  value: string | number;
  change: string;
  icon: any;
  color: string;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  time: string;
  user: string;
  avatar: string | null;
}

interface Todo {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  deadline: string;
}

interface PremiumFeature {
  title: string;
  description: string;
  icon: any;
  href: string;
}

interface COEModule {
  name: string;
  description: string;
  icon: any;
  href: string;
  color: string;
}

export default function DashboardOverview() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const quickStats: QuickStat[] = [
    { title: '员工总数', value: 156, change: '+12%', icon: Users, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900' },
    { title: '本月入职', value: 8, change: '+3', icon: Briefcase, color: 'text-green-600 bg-green-100 dark:bg-green-900' },
    { title: '待办事项', value: 24, change: '-5', icon: FileText, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900' },
    { title: '培训课程', value: 12, change: '+2', icon: GraduationCap, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900' },
  ];

  const recentActivities: RecentActivity[] = [
    { id: '1', type: 'recruit', title: '新候选人申请: 张三 - 高级工程师', time: '5分钟前', user: '张三', avatar: null },
    { id: '2', type: 'leave', title: '李四提交了请假申请', time: '15分钟前', user: '李四', avatar: null },
    { id: '3', type: 'review', title: '王五完成了绩效自评', time: '30分钟前', user: '王五', avatar: null },
    { id: '4', type: 'training', title: '新员工培训课程已创建', time: '1小时前', user: 'HR团队', avatar: null },
    { id: '5', type: 'salary', title: '3月工资发放完成', time: '2小时前', user: '财务部', avatar: null },
  ];

  const todos: Todo[] = [
    { id: '1', title: '审核候选人面试结果', priority: 'high', deadline: '今天' },
    { id: '2', title: '批准李四的请假申请', priority: 'high', deadline: '今天' },
    { id: '3', title: '完成季度绩效评估', priority: 'medium', deadline: '本周五' },
    { id: '4', title: '更新员工培训计划', priority: 'medium', deadline: '下周' },
    { id: '5', title: '准备月度薪酬报告', priority: 'low', deadline: '月底' },
  ];

  const priorityColors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  };

  const premiumFeatures: PremiumFeature[] = [
    {
      title: '高级权限管理',
      description: '企业级权限控制，角色继承和动态权限分配',
      icon: Shield,
      href: '/dashboard/permissions/advanced',
    },
    {
      title: '数据导出',
      description: '支持多种格式导出，自定义字段和日期范围',
      icon: Download,
      href: '/dashboard/data-export',
    },
    {
      title: '企业协作集成',
      description: '钉钉、飞书等企业应用无缝对接',
      icon: Building,
      href: '/dashboard/integration/dingtalk',
    },
  ];

  const coeModules: COEModule[] = [
    { name: '绩效管理', description: '目标设定、绩效评估、结果分析', icon: Target, href: '/performance', color: 'from-purple-500 to-pink-500' },
    { name: '薪酬管理', description: '工资核算、薪酬结构、社保公积金', icon: DollarSign, href: '/compensation', color: 'from-green-500 to-emerald-500' },
    { name: '培训管理', description: '培训计划、课程管理、学习记录', icon: GraduationCap, href: '/training', color: 'from-blue-500 to-cyan-500' },
    { name: '合规管理', description: '劳动合同、试用期管理、风险控制', icon: FileText, href: '/compliance', color: 'from-orange-500 to-red-500' },
  ];

  const hrbpModules: COEModule[] = [
    { name: '人效监测', description: '实时监测、归因分析、预测干预', icon: TrendingUp, href: '/efficiency', color: 'from-blue-500 to-indigo-500' },
    { name: '招聘管理', description: '岗位发布、简历筛选、面试安排', icon: Briefcase, href: '/recruitment', color: 'from-cyan-500 to-blue-500' },
    { name: '人才盘点', description: '人才库、九宫格、人才地图', icon: Award, href: '/talent', color: 'from-purple-500 to-violet-500' },
    { name: 'AI助手', description: '岗位画像、人才推荐、离职预测', icon: Sparkles, href: '/ai-assistant', color: 'from-pink-500 to-rose-500' },
  ];

  const sscModules: COEModule[] = [
    { name: '组织人事', description: '员工档案、组织架构、职位体系', icon: Users, href: '/employees', color: 'from-green-500 to-teal-500' },
    { name: '考勤管理', description: '打卡记录、排班管理、请假审批', icon: Clock, href: '/attendance', color: 'from-blue-500 to-sky-500' },
    { name: '员工自助', description: '个人信息、请假申请、报销管理', icon: Activity, href: '/employee-portal', color: 'from-indigo-500 to-purple-500' },
    { name: '积分管理', description: '积分系统、规则配置、兑换商城', icon: Star, href: '/points', color: 'from-yellow-500 to-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* 欢迎头部 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            工作台
            <Badge className="ml-2 bg-gradient-to-r from-blue-600 to-purple-600">企业版</Badge>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {time.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            {' · '}
            {time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Activity size={16} className="mr-2" />
            刷新数据
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Crown size={16} className="mr-2" />
            升级企业版
          </Button>
        </div>
      </div>

      {/* 升级提示 */}
      <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20">
        <Crown className="h-4 w-4 text-red-600" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            解锁全部高级功能，包括<strong>高级权限管理</strong>、<strong>数据导出</strong>、<strong>企业协作集成</strong>等
          </span>
          <Button variant="link" className="h-auto p-0 text-red-600 ml-4" asChild>
            <Link href="/orders/subscription">立即升级 &rarr;</Link>
          </Button>
        </AlertDescription>
      </Alert>

      {/* 快速统计 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <TrendingUp size={12} className="inline mr-1" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 商业变现功能入口 */}
      <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-red-600" />
                企业版高级功能
              </CardTitle>
              <CardDescription className="mt-1">
                解锁更多功能，提升企业管理效率
              </CardDescription>
            </div>
            <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white">
              PRO
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {premiumFeatures.map((feature, index) => (
              <Link key={index} href={feature.href}>
                <div className="p-4 rounded-lg border-2 border-red-200 bg-white hover:border-red-400 hover:shadow-lg transition-all cursor-pointer dark:bg-gray-900 dark:border-red-900 dark:hover:border-red-700">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                      <feature.icon className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">{feature.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{feature.description}</div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* COE/HRBP/SSC 三支柱功能入口 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COE */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              COE 专家中心
            </CardTitle>
            <CardDescription>专业功能设计、政策制定、专业支持</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {coeModules.map((module, index) => (
                <Link key={index} href={module.href}>
                  <div className="p-3 rounded-lg border hover:shadow-md transition-all cursor-pointer dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${module.color}`}>
                        <module.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{module.name}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{module.description}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* HRBP */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              HRBP 业务伙伴
            </CardTitle>
            <CardDescription>业务部门的人力资源业务支持</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {hrbpModules.map((module, index) => (
                <Link key={index} href={module.href}>
                  <div className="p-3 rounded-lg border hover:shadow-md transition-all cursor-pointer dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${module.color}`}>
                        <module.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{module.name}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{module.description}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SSC */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              SSC 共享中心
            </CardTitle>
            <CardDescription>事务性工作、员工服务</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sscModules.map((module, index) => (
                <Link key={index} href={module.href}>
                  <div className="p-3 rounded-lg border hover:shadow-md transition-all cursor-pointer dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${module.color}`}>
                        <module.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{module.name}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{module.description}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 最近动态和待办事项 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>最近动态</CardTitle>
              <Button variant="ghost" size="sm">
                查看全部
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="shrink-0">
                    {activity.avatar ? (
                      <ResponsiveImage src={activity.avatar} alt={activity.user} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                        {activity.user.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">{activity.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {activity.type === 'recruit' && '招聘'}
                    {activity.type === 'leave' && '考勤'}
                    {activity.type === 'review' && '绩效'}
                    {activity.type === 'training' && '培训'}
                    {activity.type === 'salary' && '薪酬'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>待办事项</CardTitle>
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                {todos.length} 项
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todos.map((todo) => (
                <div key={todo.id} className="p-3 rounded-lg border dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{todo.title}</h4>
                    <Badge className={priorityColors[todo.priority]} variant="secondary">
                      {todo.priority === 'high' && '高'}
                      {todo.priority === 'medium' && '中'}
                      {todo.priority === 'low' && '低'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar size={12} />
                    <span>{todo.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-sm">
              查看全部待办事项
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
