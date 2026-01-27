'use client';

import { useState, useEffect, useCallback, useMemo, memo, lazy, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Logo } from '@/components/branding/Logo';
import { Skeleton } from '@/components/ui/skeleton';

// 懒加载FeedbackWidget以提升性能
const FeedbackWidget = lazy(() => import('@/components/feedback/feedback-widget'));
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Target,
  DollarSign,
  FileText,
  Settings,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  BarChart3,
  ShoppingBag,
  Clock,
  GraduationCap,
  TrendingUp,
  Trophy,
  Gift,
  Zap,
  Layers,
  ChevronRight,
  User,
  Building,
  Award,
  Home,
  Download,
  Crown,
} from 'lucide-react';
import { cn } from '@/lib/theme';
import { useLocalStorage, useDebounce } from '@/hooks/use-performance';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  // 工作台
  {
    name: '工作台',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: '数据概览与快捷操作',
    category: 'workbench',
  },

  // COE - 专家中心
  {
    name: '绩效管理',
    href: '/performance',
    icon: Target,
    description: '目标设定、绩效评估、结果分析',
    category: 'coe',
    subItems: [
      { name: '目标设定', href: '/performance/goal-setting' },
      { name: '绩效评估', href: '/performance/performance-assessment' },
      { name: '结果分析', href: '/performance/result-analysis' },
      { name: '绩效报表', href: '/performance/reports' },
    ],
  },
  {
    name: '薪酬管理',
    href: '/compensation',
    icon: DollarSign,
    description: '工资核算、薪酬结构、社保公积金',
    category: 'coe',
    subItems: [
      { name: '工资核算', href: '/compensation/salary-calculation' },
      { name: '薪酬结构', href: '/compensation/salary-structure' },
      { name: '社保公积金', href: '/compensation/social-insurance' },
      { name: '个税管理', href: '/compensation/tax' },
      { name: '奖金发放', href: '/compensation/bonus' },
    ],
  },
  {
    name: '培训管理',
    href: '/training',
    icon: GraduationCap,
    description: '培训计划、课程管理、学习记录',
    category: 'coe',
    subItems: [
      { name: '培训计划', href: '/training/plans' },
      { name: '课程管理', href: '/training/courses' },
      { name: '学习记录', href: '/training/records' },
      { name: '培训效果', href: '/training/effectiveness' },
    ],
  },
  {
    name: '合规管理',
    href: '/compliance',
    icon: Settings,
    description: '劳动合同、试用期管理、风险控制',
    category: 'coe',
    subItems: [
      { name: '劳动合同', href: '/compliance/contracts' },
      { name: '试用期管理', href: '/compliance/probation' },
      { name: '风险控制', href: '/compliance/risk' },
      { name: '法律知识库', href: '/compliance/legal' },
    ],
  },
  {
    name: 'HR报表',
    href: '/hr-reports',
    icon: BarChart3,
    description: '人员结构、人效、离职率分析',
    category: 'coe',
    subItems: [
      { name: '人员结构', href: '/hr-reports/structure' },
      { name: '人效分析', href: '/hr-reports/efficiency' },
      { name: '离职分析', href: '/hr-reports/turnover' },
      { name: '自定义报表', href: '/hr-reports/custom' },
    ],
  },

  // HRBP - 人力资源业务合作伙伴
  {
    name: '人效监测',
    href: '/efficiency',
    icon: TrendingUp,
    description: '实时监测、归因分析、预测干预',
    category: 'hrbp',
    badge: 'NEW',
    color: 'from-blue-600 to-blue-500',
    subItems: [
      { name: '人效仪表盘', href: '/efficiency/dashboard' },
      { name: '归因分析', href: '/efficiency/attribution' },
      { name: '预测干预', href: '/efficiency/prediction' },
    ],
  },
  {
    name: '招聘管理',
    href: '/recruitment',
    icon: Briefcase,
    description: '岗位发布、简历筛选、面试安排',
    category: 'hrbp',
    subItems: [
      { name: '岗位发布', href: '/recruitment/jobs' },
      { name: '简历管理', href: '/recruitment/resumes' },
      { name: '面试安排', href: '/recruitment/interviews' },
      { name: '录用管理', href: '/recruitment/offers' },
      { name: '人才库', href: '/recruitment/talent-pool' },
      { name: '智能面试', href: '/recruitment/ai-interview' },
    ],
  },
  {
    name: '人才盘点',
    href: '/talent',
    icon: Trophy,
    description: '人才库、九宫格、人才地图',
    category: 'hrbp',
    subItems: [
      { name: '人才库', href: '/talent/pool' },
      { name: '九宫格盘点', href: '/talent/grid' },
      { name: '人才地图', href: '/talent/map' },
      { name: '继任计划', href: '/talent/succession' },
    ],
  },
  {
    name: '离职管理',
    href: '/offboarding',
    icon: FileText,
    description: '离职申请、交接、访谈、分析',
    category: 'hrbp',
    subItems: [
      { name: '离职申请', href: '/offboarding/applications' },
      { name: '离职交接', href: '/offboarding/handover' },
      { name: '离职访谈', href: '/offboarding/interview' },
      { name: '离职分析', href: '/offboarding/analysis' },
    ],
  },
  {
    name: 'AI助手',
    href: '/ai-assistant',
    icon: Sparkles,
    description: '岗位画像、人才盘点、离职分析',
    category: 'hrbp',
    badge: 'AI',
    color: 'from-purple-600 to-pink-600',
    subItems: [
      { name: '岗位画像', href: '/ai-assistant/job-profile' },
      { name: '人才推荐', href: '/ai-assistant/recommendation' },
      { name: '离职预测', href: '/ai-assistant/turnover-prediction' },
      { name: '人才盘点', href: '/ai-assistant/talent-review' },
    ],
  },

  // SSC - 共享服务中心
  {
    name: '组织人事',
    href: '/employees',
    icon: Users,
    description: '员工档案、组织架构、职位体系',
    category: 'ssc',
    subItems: [
      { name: '员工管理', href: '/employees' },
      { name: '组织架构', href: '/organization' },
      { name: '职位体系', href: '/job-hierarchy' },
      { name: '人员异动', href: '/employees/movement' },
    ],
  },
  {
    name: '考勤管理',
    href: '/attendance',
    icon: Clock,
    description: '打卡记录、排班管理、请假审批',
    category: 'ssc',
    subItems: [
      { name: '打卡记录', href: '/attendance/clock-in' },
      { name: '排班管理', href: '/attendance/scheduling' },
      { name: '请假审批', href: '/attendance/leave' },
      { name: '加班管理', href: '/attendance/overtime' },
      { name: '移动打卡', href: '/mobile/clock-in' },
    ],
  },
  {
    name: '员工自助',
    href: '/employee-portal',
    icon: User,
    description: '个人信息、请假申请、报销管理',
    category: 'ssc',
    subItems: [
      { name: '个人信息', href: '/employee-portal/profile' },
      { name: '请假申请', href: '/employee-portal/leave' },
      { name: '报销管理', href: '/employee-portal/reimbursement' },
      { name: '工资条', href: '/employee-portal/payslip' },
      { name: '我的培训', href: '/employee-portal/training' },
    ],
  },
  {
    name: '积分管理',
    href: '/points',
    icon: Gift,
    description: '积分系统、规则配置、兑换商城',
    category: 'ssc',
    badge: 'NEW',
    color: 'from-orange-500 to-yellow-500',
    subItems: [
      { name: '积分仪表盘', href: '/points/dashboard' },
      { name: '积分规则', href: '/points/rules' },
      { name: '积分明细', href: '/points/records' },
      { name: '兑换商城', href: '/points/exchange' },
      { name: '积分报表', href: '/points/reports' },
    ],
  },

  // 商业变现 - 付费高级功能
  {
    name: '高级权限',
    href: '/dashboard/permissions/advanced',
    icon: Award,
    description: '企业级权限控制、角色管理',
    category: 'premium',
    badge: 'PRO',
    color: 'from-red-600 to-pink-600',
  },
  {
    name: '数据导出',
    href: '/dashboard/data-export',
    icon: Download,
    description: '多种格式导出、自定义字段',
    category: 'premium',
    badge: 'PRO',
    color: 'from-red-600 to-pink-600',
  },
  {
    name: '企业协作',
    href: '/dashboard/integration',
    icon: Building,
    description: '钉钉、飞书等企业应用集成',
    category: 'premium',
    badge: 'PRO',
    color: 'from-red-600 to-pink-600',
    subItems: [
      { name: '钉钉集成', href: '/dashboard/integration/dingtalk' },
      { name: '飞书集成', href: '/dashboard/integration/feishu' },
      { name: '企业微信', href: '/dashboard/integration/wecom' },
    ],
  },

  // 系统管理
  {
    name: '订单管理',
    href: '/orders',
    icon: ShoppingBag,
    description: '会员订阅、订单查询',
    category: 'system',
    subItems: [
      { name: '订阅管理', href: '/orders/subscription' },
      { name: '订单查询', href: '/orders/list' },
      { name: '发票管理', href: '/orders/invoice' },
    ],
  },
  {
    name: '工作流',
    href: '/workflows',
    icon: Layers,
    description: '入职、离职、晋升、转岗、调薪',
    category: 'system',
    badge: 'NEW',
    subItems: [
      { name: '入职流程', href: '/workflows/onboarding' },
      { name: '离职流程', href: '/workflows/offboarding' },
      { name: '晋升流程', href: '/workflows/promotion' },
      { name: '转岗流程', href: '/workflows/transfer' },
      { name: '调薪流程', href: '/workflows/salary' },
    ],
  },
  {
    name: '系统设置',
    href: '/settings',
    icon: Settings,
    description: '基础设置、通知配置、API管理',
    category: 'system',
    subItems: [
      { name: '企业设置', href: '/settings/company' },
      { name: '通知配置', href: '/settings/notifications' },
      { name: 'API管理', href: '/settings/api' },
      { name: '安全设置', href: '/settings/security' },
    ],
  },
];

// 侧边栏状态持久化键
const SIDEBAR_STATE_KEY = 'sidebar-expanded';
const SIDEBAR_OPEN_KEY = 'sidebar-open';

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  // 使用 localStorage 持久化侧边栏状态
  const [sidebarOpen, setSidebarOpen] = useLocalStorage<boolean>(SIDEBAR_OPEN_KEY, false);
  const [expandedMenus, setExpandedMenus] = useLocalStorage<string[]>(SIDEBAR_STATE_KEY, []);

  // 自动展开当前活动菜单
  useEffect(() => {
    const activeMenu = navigation.find(item =>
      pathname === item.href || pathname.startsWith(item.href + '/')
    );

    if (activeMenu && activeMenu.subItems && activeMenu.subItems.length > 0) {
      if (!expandedMenus.includes(activeMenu.name)) {
        setExpandedMenus([...expandedMenus, activeMenu.name]);
      }
    }
  }, [pathname, expandedMenus, setExpandedMenus]);

  // 获取面包屑导航
  const breadcrumbs = useMemo(() => {
    const crumbs = [{ name: '首页', href: '/dashboard', icon: Home }];

    const activeMenu = navigation.find(item =>
      pathname === item.href || pathname.startsWith(item.href + '/')
    );

    if (activeMenu) {
      crumbs.push({ name: activeMenu.name, href: activeMenu.href, icon: activeMenu.icon });

      // 查找子菜单
      if (activeMenu.subItems) {
        const activeSubItem = activeMenu.subItems.find(sub =>
          pathname === sub.href
        );
        if (activeSubItem) {
          crumbs.push({ name: activeSubItem.name, href: activeSubItem.href, icon: FileText });
        }
      }
    }

    return crumbs;
  }, [pathname]);

  const toggleMenu = useCallback((menuName: string, hasSubItems: boolean) => {
    if (!hasSubItems) {
      // 移动端关闭侧边栏
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
      return;
    }

    setExpandedMenus(prev =>
      prev.includes(menuName)
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    );
  }, [setExpandedMenus, setSidebarOpen]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-30 h-screen w-64 transform border-r bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            onClick={() => {
              if (isMobile) setSidebarOpen(false);
            }}
          >
            <Logo variant="icon" size="md" />
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                PulseOpti HR
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                脉策聚效系统
              </p>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="关闭侧边栏"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6" aria-label="主导航">
          {/* COE - 专家中心 */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-3 py-2">
              <Award className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                COE 专家中心
              </span>
            </div>
            {navigation.filter(item => item.category === 'coe').map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              const isExpanded = expandedMenus.includes(item.name);
              const hasSubItems = item.subItems && item.subItems.length > 0;

              return (
                <div key={item.name}>
                  <div
                    onClick={() => toggleMenu(item.name, hasSubItems || false)}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer select-none',
                      'hover:shadow-sm',
                      isActive
                        ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 dark:from-purple-950 dark:to-pink-950 dark:text-purple-400 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    )}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    aria-haspopup={hasSubItems}
                  >
                    <Icon
                      className={cn(
                        'h-5 w-5 transition-colors flex-shrink-0',
                        isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                      )}
                    />
                    <span className="flex-1 truncate">{item.name}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-xs shrink-0 font-normal',
                          item.badge === 'AI'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 hover:opacity-90'
                            : item.badge === 'NEW'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0 hover:opacity-90'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    {hasSubItems && (
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform flex-shrink-0',
                          isExpanded && 'rotate-180'
                        )}
                      />
                    )}
                  </div>

                  {/* 子菜单 */}
                  {hasSubItems && (
                    <div
                      className={cn(
                        'ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-200 ease-in-out',
                        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-50'
                      )}
                      role="group"
                    >
                      {item.subItems.map((subItem) => {
                        const isSubActive = pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={cn(
                              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group/link',
                              isSubActive
                                ? 'text-purple-600 bg-purple-50/50 dark:bg-purple-950/30 dark:text-purple-400'
                                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                            )}
                            onClick={() => {
                              if (isMobile) setSidebarOpen(false);
                            }}
                          >
                            <div
                              className={cn(
                                'h-1.5 w-1.5 rounded-full transition-colors',
                                isSubActive
                                  ? 'bg-purple-600 dark:bg-purple-400'
                                  : 'bg-gray-300 group-hover/link:bg-gray-400 dark:bg-gray-600'
                              )}
                            />
                            <span className="truncate">{subItem.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* HRBP - 人力资源业务合作伙伴 */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-3 py-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                HRBP 业务伙伴
              </span>
            </div>
            {navigation.filter(item => item.category === 'hrbp').map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              const isExpanded = expandedMenus.includes(item.name);
              const hasSubItems = item.subItems && item.subItems.length > 0;

              return (
                <div key={item.name}>
                  <div
                    onClick={() => toggleMenu(item.name, hasSubItems || false)}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer select-none',
                      'hover:shadow-sm',
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 dark:from-blue-950 dark:to-cyan-950 dark:text-blue-400 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    )}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    aria-haspopup={hasSubItems}
                  >
                    <Icon
                      className={cn(
                        'h-5 w-5 transition-colors flex-shrink-0',
                        isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                      )}
                    />
                    <span className="flex-1 truncate">{item.name}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-xs shrink-0 font-normal',
                          item.badge === 'AI'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 hover:opacity-90'
                            : item.badge === 'NEW'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0 hover:opacity-90'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    {hasSubItems && (
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform flex-shrink-0',
                          isExpanded && 'rotate-180'
                        )}
                      />
                    )}
                  </div>

                  {/* 子菜单 */}
                  {hasSubItems && (
                    <div
                      className={cn(
                        'ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-200 ease-in-out',
                        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-50'
                      )}
                      role="group"
                    >
                      {item.subItems.map((subItem) => {
                        const isSubActive = pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={cn(
                              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group/link',
                              isSubActive
                                ? 'text-blue-600 bg-blue-50/50 dark:bg-blue-950/30 dark:text-blue-400'
                                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                            )}
                            onClick={() => {
                              if (isMobile) setSidebarOpen(false);
                            }}
                          >
                            <div
                              className={cn(
                                'h-1.5 w-1.5 rounded-full transition-colors',
                                isSubActive
                                  ? 'bg-blue-600 dark:bg-blue-400'
                                  : 'bg-gray-300 group-hover/link:bg-gray-400 dark:bg-gray-600'
                              )}
                            />
                            <span className="truncate">{subItem.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* SSC - 共享服务中心 */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-3 py-2">
              <Settings className="h-4 w-4 text-green-600" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                SSC 共享中心
              </span>
            </div>
            {navigation.filter(item => item.category === 'ssc').map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              const isExpanded = expandedMenus.includes(item.name);
              const hasSubItems = item.subItems && item.subItems.length > 0;

              return (
                <div key={item.name}>
                  <div
                    onClick={() => toggleMenu(item.name, hasSubItems || false)}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer select-none',
                      'hover:shadow-sm',
                      isActive
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 dark:from-green-950 dark:to-emerald-950 dark:text-green-400 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    )}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    aria-haspopup={hasSubItems}
                  >
                    <Icon
                      className={cn(
                        'h-5 w-5 transition-colors flex-shrink-0',
                        isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                      )}
                    />
                    <span className="flex-1 truncate">{item.name}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-xs shrink-0 font-normal',
                          item.badge === 'AI'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 hover:opacity-90'
                            : item.badge === 'NEW'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0 hover:opacity-90'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    {hasSubItems && (
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform flex-shrink-0',
                          isExpanded && 'rotate-180'
                        )}
                      />
                    )}
                  </div>

                  {/* 子菜单 */}
                  {hasSubItems && (
                    <div
                      className={cn(
                        'ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-200 ease-in-out',
                        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-50'
                      )}
                      role="group"
                    >
                      {item.subItems.map((subItem) => {
                        const isSubActive = pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={cn(
                              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group/link',
                              isSubActive
                                ? 'text-green-600 bg-green-50/50 dark:bg-green-950/30 dark:text-green-400'
                                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                            )}
                            onClick={() => {
                              if (isMobile) setSidebarOpen(false);
                            }}
                          >
                            <div
                              className={cn(
                                'h-1.5 w-1.5 rounded-full transition-colors',
                                isSubActive
                                  ? 'bg-green-600 dark:bg-green-400'
                                  : 'bg-gray-300 group-hover/link:bg-gray-400 dark:bg-gray-600'
                              )}
                            />
                            <span className="truncate">{subItem.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 商业变现 - 付费高级功能 */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-3 py-2">
              <Crown className="h-4 w-4 text-red-600" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                高级功能
              </span>
              <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white border-0 text-xs ml-auto">
                PRO
              </Badge>
            </div>
            {navigation.filter(item => item.category === 'premium').map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              const isExpanded = expandedMenus.includes(item.name);
              const hasSubItems = item.subItems && item.subItems.length > 0;

              return (
                <div key={item.name}>
                  <div
                    onClick={() => toggleMenu(item.name, hasSubItems || false)}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer select-none',
                      'hover:shadow-sm border-2',
                      isActive
                        ? 'bg-gradient-to-r from-red-50 to-pink-50 text-red-600 border-red-200 dark:from-red-950 dark:to-pink-950 dark:text-red-400 dark:border-red-800 shadow-sm'
                        : 'border-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 hover:border-red-200'
                    )}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    aria-haspopup={hasSubItems}
                  >
                    <Icon
                      className={cn(
                        'h-5 w-5 transition-colors flex-shrink-0',
                        isActive ? 'text-red-600 dark:text-red-400' : 'text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400'
                      )}
                    />
                    <span className="flex-1 truncate">{item.name}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-xs shrink-0 font-normal bg-gradient-to-r from-red-600 to-pink-600 text-white border-0 hover:opacity-90'
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    {hasSubItems && (
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform flex-shrink-0',
                          isExpanded && 'rotate-180'
                        )}
                      />
                    )}
                  </div>

                  {/* 子菜单 */}
                  {hasSubItems && (
                    <div
                      className={cn(
                        'ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-200 ease-in-out',
                        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-50'
                      )}
                      role="group"
                    >
                      {item.subItems.map((subItem) => {
                        const isSubActive = pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={cn(
                              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group/link',
                              isSubActive
                                ? 'text-red-600 bg-red-50/50 dark:bg-red-950/30 dark:text-red-400'
                                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                            )}
                            onClick={() => {
                              if (isMobile) setSidebarOpen(false);
                            }}
                          >
                            <div
                              className={cn(
                                'h-1.5 w-1.5 rounded-full transition-colors',
                                isSubActive
                                  ? 'bg-red-600 dark:bg-red-400'
                                  : 'bg-gray-300 group-hover/link:bg-gray-400 dark:bg-gray-600'
                              )}
                            />
                            <span className="truncate">{subItem.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 系统管理 */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-3 py-2">
              <Settings className="h-4 w-4 text-gray-600" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                系统管理
              </span>
            </div>
            {navigation.filter(item => item.category === 'system').map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              const isExpanded = expandedMenus.includes(item.name);
              const hasSubItems = item.subItems && item.subItems.length > 0;

              return (
                <div key={item.name}>
                  <div
                    onClick={() => toggleMenu(item.name, hasSubItems || false)}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer select-none',
                      'hover:shadow-sm',
                      isActive
                        ? 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-600 dark:from-gray-950 dark:to-slate-950 dark:text-gray-400 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    )}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    aria-haspopup={hasSubItems}
                  >
                    <Icon
                      className={cn(
                        'h-5 w-5 transition-colors flex-shrink-0',
                        isActive ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                      )}
                    />
                    <span className="flex-1 truncate">{item.name}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-xs shrink-0 font-normal',
                          item.badge === 'AI'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 hover:opacity-90'
                            : item.badge === 'NEW'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0 hover:opacity-90'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    {hasSubItems && (
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform flex-shrink-0',
                          isExpanded && 'rotate-180'
                        )}
                      />
                    )}
                  </div>

                  {/* 子菜单 */}
                  {hasSubItems && (
                    <div
                      className={cn(
                        'ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-200 ease-in-out',
                        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-50'
                      )}
                      role="group"
                    >
                      {item.subItems.map((subItem) => {
                        const isSubActive = pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={cn(
                              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group/link',
                              isSubActive
                                ? 'text-gray-600 bg-gray-50/50 dark:bg-gray-950/30 dark:text-gray-400'
                                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                            )}
                            onClick={() => {
                              if (isMobile) setSidebarOpen(false);
                            }}
                          >
                            <div
                              className={cn(
                                'h-1.5 w-1.5 rounded-full transition-colors',
                                isSubActive
                                  ? 'bg-gray-600 dark:bg-gray-400'
                                  : 'bg-gray-300 group-hover/link:bg-gray-400 dark:bg-gray-600'
                              )}
                            />
                            <span className="truncate">{subItem.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* 底部信息 */}
        <div className="border-t p-4">
          <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4 dark:from-blue-950 dark:to-purple-950">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  免费版
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  升级解锁全部功能
                </p>
              </div>
              <Button
                size="sm"
                className="h-7 px-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs"
              >
                升级
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="lg:pl-64 transition-all duration-300">
        {/* 顶部工具栏 */}
        <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* 左侧 */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden flex-shrink-0"
                onClick={() => setSidebarOpen(true)}
                aria-label="打开侧边栏"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* 面包屑导航 */}
              <nav className="hidden md:flex items-center gap-2 text-sm" aria-label="面包屑">
                {breadcrumbs.map((crumb, index) => {
                  const Icon = crumb.icon as React.ElementType;
                  const isLast = index === breadcrumbs.length - 1;

                  return (
                    <div key={crumb.href} className="flex items-center gap-2">
                      {index > 0 && (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                      {isLast ? (
                        <span className="text-gray-900 dark:text-white font-medium flex items-center gap-1.5">
                          {Icon && <Icon className="h-4 w-4" />}
                          {crumb.name}
                        </span>
                      ) : (
                        <Link
                          href={crumb.href}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors flex items-center gap-1.5"
                        >
                          {Icon && <Icon className="h-4 w-4" />}
                          {crumb.name}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* 右侧 */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* 搜索 */}
              <div className="hidden sm:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索功能、员工..."
                    className="h-9 w-48 md:w-64 rounded-lg border bg-gray-50 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 transition-all"
                  />
                </div>
              </div>

              {/* 通知 */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="通知"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
              </Button>

              {/* 用户菜单 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                    aria-label="用户菜单"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        HR
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">HRBP 用户</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        hr@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/employee-portal" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      个人中心
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      系统设置
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* 主内容 */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* 反馈组件 */}
        <FeedbackWidget />
      </div>
    </div>
  );
}
