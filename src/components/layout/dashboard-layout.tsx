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
  // 工作台 - 数据总览，快速决策
  {
    name: '工作台',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: '一屏看懂企业人效，关键指标实时监控',
    category: 'workbench',
    priority: 1,
    badge: 'HOT',
  },

  // COE - 卓越中心（紫色主题）- 专业深度，标准化，创新驱动
  {
    name: 'COE中心',
    href: '/coe',
    icon: Award,
    description: '卓越中心 - 构建标准化专业体系',
    category: 'coe',
    priority: 2,
    color: 'from-purple-600 to-purple-500',
    badge: '专业',
    subItems: [
      {
        name: '绩效管理',
        href: '/performance',
        icon: Target,
        description: '科学评估，激发潜能，提升人效',
        subItems: [
          { name: 'OKR目标', href: '/performance/okr', description: '目标对齐与跟踪' },
          { name: 'KPI设定', href: '/performance/kpi', description: '指标定义与分解' },
          { name: '360评估', href: '/performance/360', description: '多维度评估' },
          { name: '绩效面谈', href: '/performance/interview', description: '面谈记录与反馈' },
          { name: '改进计划', href: '/performance/improvement', description: '绩效提升计划' },
          { name: '人才盘点', href: '/performance/review', description: '九宫格人才盘点', badge: 'PRO' },
          { name: '智能评估', href: '/performance/ai', description: 'AI 辅助评估', badge: 'AI' },
        ],
      },
      {
        name: '薪酬福利',
        href: '/compensation',
        icon: DollarSign,
        description: '公平激励，保留人才，控制成本',
        subItems: [
          { name: '薪酬体系', href: '/compensation/structure', description: '岗位价值与宽带设计' },
          { name: '薪酬调整', href: '/compensation/adjustment', description: '调薪管理' },
          { name: '奖金发放', href: '/compensation/bonus', description: '绩效奖金管理' },
          { name: '社保公积金', href: '/compensation/social', description: '五险一金管理' },
          { name: '个税申报', href: '/compensation/tax', description: '个税计算申报' },
          { name: '薪酬分析', href: '/compensation/analysis', description: '薪酬成本分析', badge: 'PRO' },
          { name: '市场对标', href: '/compensation/market', description: '薪酬数据对标', badge: 'PRO' },
        ],
      },
      {
        name: '培训发展',
        href: '/training',
        icon: GraduationCap,
        description: '能力提升，梯队建设，知识沉淀',
        subItems: [
          { name: '培训计划', href: '/training/plans', description: '年度培训规划' },
          { name: '课程管理', href: '/training/courses', description: '课程创建与管理' },
          { name: '在线学习', href: '/training/learning', description: '在线学习平台' },
          { name: '学习记录', href: '/training/records', description: '学习进度跟踪' },
          { name: '效果评估', href: '/training/effectiveness', description: '培训效果评估' },
          { name: '技能图谱', href: '/training/skills', description: '岗位技能体系', badge: 'PRO' },
          { name: '智能推荐', href: '/training/ai', description: 'AI 个性化推荐', badge: 'AI' },
        ],
      },
      {
        name: '合规管理',
        href: '/compliance',
        icon: Settings,
        description: '防范风险，合规经营，稳健发展',
        subItems: [
          { name: '劳动合同', href: '/compliance/contracts', description: '合同签署与管理' },
          { name: '试用期管理', href: '/compliance/probation', description: '试用期跟踪' },
          { name: '离职管理', href: '/compliance/exit', description: '离职流程管控' },
          { name: '风险预警', href: '/compliance/risk', description: '合规风险预警' },
          { name: '法规库', href: '/compliance/legal', description: '劳动法规查询' },
          { name: '智能风控', href: '/compliance/ai', description: 'AI 风险识别', badge: 'AI' },
        ],
      },
    ],
  },

  // HRBP - 人力资源业务伙伴（蓝色主题）- 业务导向，贴近业务，战略支持
  {
    name: 'HRBP中心',
    href: '/hrbp',
    icon: TrendingUp,
    description: '业务伙伴 - 深度支持业务目标',
    category: 'hrbp',
    priority: 3,
    color: 'from-blue-600 to-blue-500',
    badge: '业务',
    subItems: [
      {
        name: '组织管理',
        href: '/organization',
        icon: Building,
        description: '组织诊断，架构优化，效能提升',
        subItems: [
          { name: '组织架构', href: '/organization/structure', description: '组织结构图' },
          { name: '岗位体系', href: '/organization/positions', description: '岗位职级体系' },
          { name: '编制管理', href: '/organization/headcount', description: '编制规划与控制' },
          { name: '组织诊断', href: '/organization/diagnostics', description: '组织健康诊断', badge: 'PRO' },
          { name: '效能分析', href: '/organization/efficiency', description: '人效指标分析', badge: 'PRO' },
        ],
      },
      {
        name: '智能招聘',
        href: '/recruitment',
        icon: Briefcase,
        description: '精准画像，智能筛选，快速入职',
        subItems: [
          { name: '招聘需求', href: '/recruitment/requirements', description: '招聘需求管理' },
          { name: '职位发布', href: '/recruitment/jobs', description: '多渠道职位发布' },
          { name: '智能筛选', href: '/recruitment/ai-screening', description: 'AI 简历筛选', badge: 'AI' },
          { name: '面试管理', href: '/recruitment/interviews', description: '面试流程管理' },
          { name: 'AI 面试', href: '/recruitment/ai-interview', description: 'AI 面试辅助', badge: 'AI' },
          { name: '录用管理', href: '/recruitment/offers', description: 'Offer 发放' },
          { name: '人才库', href: '/recruitment/talent-pool', description: '人才储备库' },
          { name: '招聘分析', href: '/recruitment/analytics', description: '招聘数据分析', badge: 'PRO' },
        ],
      },
      {
        name: '人才发展',
        href: '/talent',
        icon: Trophy,
        description: '识别高潜，梯队建设，继任计划',
        subItems: [
          { name: '人才盘点', href: '/talent/review', description: '人才九宫格分析' },
          { name: '高潜人才', href: '/talent/high-potential', description: '高潜人才库' },
          { name: '继任计划', href: '/talent/succession', description: '关键岗位继任' },
          { name: '职业发展', href: '/talent/career', description: '职业发展通道' },
          { name: '人才预测', href: '/talent/ai-prediction', description: 'AI 人才预测', badge: 'AI' },
        ],
      },
      {
        name: '员工关怀',
        href: '/care',
        icon: Gift,
        description: '关怀员工，提升满意度，降低流失',
        subItems: [
          { name: '关怀计划', href: '/care/plans', description: '年度关怀计划' },
          { name: '关怀记录', href: '/care/records', description: '关怀活动记录' },
          { name: '满意度调查', href: '/care/survey', description: '员工满意度调研' },
          { name: '离职预警', href: '/care/turnover-warning', description: '离职风险预警', badge: 'AI' },
          { name: '留任建议', href: '/care/retention', description: 'AI 留任建议', badge: 'AI' },
        ],
      },
      {
        name: '业务协同',
        href: '/business',
        icon: Zap,
        description: '深入业务，目标对齐，支持决策',
        subItems: [
          { name: '业务对接', href: '/business/connect', description: '业务伙伴对接' },
          { name: '项目支持', href: '/business/projects', description: 'HR 支持项目' },
          { name: '会议记录', href: '/business/meetings', description: '业务沟通记录' },
          { name: '决策支持', href: '/business/decisions', description: '数据驱动决策', badge: 'PRO' },
        ],
      },
    ],
  },

  // SSC - 共享服务中心（绿色主题）- 效率提升，降低成本，标准化服务
  {
    name: 'SSC中心',
    href: '/ssc',
    icon: Users,
    description: '共享服务 - 高效事务处理',
    category: 'ssc',
    priority: 4,
    color: 'from-green-600 to-green-500',
    badge: '服务',
    subItems: [
      {
        name: '组织人事',
        href: '/employees',
        icon: Users,
        description: '员工档案，组织架构，人员异动',
        subItems: [
          { name: '员工管理', href: '/employees', description: '员工档案管理' },
          { name: '组织架构', href: '/employees/org', description: '组织结构图' },
          { name: '人员异动', href: '/employees/movement', description: '入职晋升转岗离职' },
          { name: '入职办理', href: '/employees/onboarding', description: '入职流程管理' },
          { name: '离职办理', href: '/employees/offboarding', description: '离职流程管理' },
          { name: '证明开具', href: '/employees/certificates', description: '各类证明开具' },
        ],
      },
      {
        name: '考勤管理',
        href: '/attendance',
        icon: Clock,
        description: '灵活打卡，智能排班，自动统计',
        subItems: [
          { name: '打卡管理', href: '/attendance/clock', description: '打卡记录查询' },
          { name: '排班管理', href: '/attendance/scheduling', description: '智能排班设置' },
          { name: '请假审批', href: '/attendance/leave', description: '请假申请审批' },
          { name: '加班管理', href: '/attendance/overtime', description: '加班申请管理' },
          { name: '调休管理', href: '/attendance/lieu', description: '调休申请管理' },
          { name: '考勤报表', href: '/attendance/reports', description: '考勤统计报表' },
          { name: '移动打卡', href: '/attendance/mobile', description: '手机 GPS 打卡', badge: 'NEW' },
        ],
      },
      {
        name: '员工自助',
        href: '/portal',
        icon: User,
        description: '一站式服务，自助办理，便捷高效',
        subItems: [
          { name: '个人信息', href: '/portal/info', description: '个人档案维护' },
          { name: '请假申请', href: '/portal/leave', description: '请假申请提交' },
          { name: '报销管理', href: '/portal/reimbursement', description: '费用报销申请' },
          { name: '工资条', href: '/portal/payslip', description: '电子工资条查看' },
          { name: '我的培训', href: '/portal/training', description: '培训课程学习' },
          { name: '我的绩效', href: '/portal/performance', description: '绩效结果查看' },
          { name: '积分商城', href: '/portal/points', description: '积分兑换礼品', badge: 'HOT' },
        ],
      },
      {
        name: '薪酬发放',
        href: '/payroll',
        icon: DollarSign,
        description: '精准计算，准时发放，透明清晰',
        subItems: [
          { name: '薪资核算', href: '/payroll/calculation', description: '薪资批量核算' },
          { name: '薪资发放', href: '/payroll/distribution', description: '薪资批量发放' },
          { name: '个税申报', href: '/payroll/tax', description: '个税自动申报' },
          { name: '社保缴纳', href: '/payroll/social', description: '社保自动缴纳' },
          { name: '工资条推送', href: '/payroll/payslip', description: '电子工资条推送' },
          { name: '发放历史', href: '/payroll/history', description: '历史发放记录' },
        ],
      },
      {
        name: '积分激励',
        href: '/points',
        icon: Gift,
        description: '积分激励，活跃氛围，提升满意度',
        badge: 'HOT',
        subItems: [
          { name: '积分仪表盘', href: '/points/dashboard', description: '积分总览' },
          { name: '积分规则', href: '/points/rules', description: '积分规则设置' },
          { name: '积分明细', href: '/points/records', description: '积分获取明细' },
          { name: '兑换商城', href: '/points/exchange', description: '积分兑换礼品' },
          { name: '积分报表', href: '/points/reports', description: '积分统计报表' },
        ],
      },
    ],
  },

  // 高级功能 - 商业变现（红色主题）- 增值服务，企业级功能
  {
    name: '高级功能',
    href: '/premium',
    icon: Crown,
    description: '企业级功能 - 提升管理效率',
    category: 'premium',
    priority: 5,
    color: 'from-red-600 to-pink-600',
    badge: 'PRO',
    subItems: [
      {
        name: '高级权限',
        href: '/dashboard/permissions/advanced',
        icon: Award,
        description: '精细化权限控制，数据安全隔离',
        badge: 'PRO',
        price: '¥199/月',
      },
      {
        name: '数据导出',
        href: '/dashboard/data-export',
        icon: Download,
        description: '全量数据导出，自定义字段报表',
        badge: 'PRO',
        price: '¥99/月',
      },
      {
        name: 'API 开放平台',
        href: '/dashboard/settings/api',
        icon: Zap,
        description: '完整 REST API，支持自定义集成',
        badge: 'PRO',
        price: '¥199/月',
      },
      {
        name: '自定义报表',
        href: '/dashboard/reports/custom',
        icon: BarChart3,
        description: '拖拽式设计器，创建专属报表',
        badge: 'PRO',
        price: '¥199/月',
      },
      {
        name: '数据大屏',
        href: '/dashboard/analytics/dashboard',
        icon: TrendingUp,
        description: '实时可视化大屏，关键指标一目了然',
        badge: 'PRO',
        price: '¥299/月',
      },
      {
        name: '企业集成',
        href: '/dashboard/integration',
        icon: Building,
        description: '钉钉、飞书、企微无缝集成',
        badge: 'PRO',
        price: '¥99/月',
      },
    ],
  },

  // 系统管理（灰色主题）- 订单管理，工作流配置
  {
    name: '系统管理',
    href: '/system',
    icon: Settings,
    description: '订单订阅，工作流配置，系统设置',
    category: 'system',
    priority: 6,
    color: 'from-gray-600 to-gray-500',
    subItems: [
      {
        name: '订单管理',
        href: '/orders',
        icon: ShoppingBag,
        description: '会员订阅，订单查询，发票管理',
        subItems: [
          { name: '订阅管理', href: '/orders/subscription', description: '套餐订阅管理' },
          { name: '订单查询', href: '/orders/list', description: '订单列表查询' },
          { name: '发票管理', href: '/orders/invoice', description: '发票开具管理' },
        ],
      },
      {
        name: '工作流',
        href: '/workflows',
        icon: Layers,
        description: '流程配置，审批管理，自动化',
        badge: 'NEW',
        subItems: [
          { name: '流程设计', href: '/workflows/design', description: '流程可视化设计' },
          { name: '审批管理', href: '/workflows/approval', description: '审批流程管理' },
          { name: '自动化', href: '/workflows/automation', description: '流程自动化配置' },
        ],
      },
      {
        name: '系统设置',
        href: '/settings',
        icon: Settings,
        description: '企业设置、通知配置、API管理',
        subItems: [
          { name: '企业设置', href: '/settings/company', description: '企业信息配置' },
          { name: '通知配置', href: '/settings/notifications', description: '消息通知设置' },
          { name: 'API管理', href: '/settings/api', description: 'API接口管理' },
          { name: '安全设置', href: '/settings/security', description: '账户安全设置' },
        ],
      },
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
