'use client';

import { useState, useEffect, useCallback, useMemo, memo, lazy, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '@/components/branding/Logo';
import { OptimizedAvatar } from '@/components/performance/optimized-image';
import { cn } from '@/lib/theme';
import { useLocalStorage, useDebounce } from '@/hooks/use-performance';

// 懒加载重型组件
const FeedbackWidget = lazy(() => import('@/components/feedback/feedback-widget'));

// 动态导入图标组件
const IconRenderer = memo(function IconRenderer({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const [Icon, setIcon] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    import('lucide-react').then((icons) => {
      const iconComponent = icons[name as keyof typeof icons];
      if (iconComponent) {
        setIcon(() => iconComponent as any);
      }
    });
  }, [name]);

  if (!Icon) {
    return <div style={{ width: size, height: size }} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />;
  }

  return <Icon size={size} className={className} />;
});

// 导航配置 - 使用Memo缓存
export const navigationConfig = [
  {
    name: '工作台',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    description: '数据概览与快捷操作',
  },
  {
    name: '人效监测',
    href: '/dashboard/human-efficiency',
    icon: 'BarChart3',
    description: '实时监测、归因分析、预测干预',
    badge: 'NEW',
    color: 'from-blue-600 to-blue-500',
  },
  {
    name: '积分管理',
    href: '/dashboard/points',
    icon: 'Trophy',
    description: '积分系统、规则配置、兑换商城',
    badge: 'NEW',
    color: 'from-orange-500 to-yellow-500',
  },
  {
    name: '组织人事',
    href: '/dashboard/employees',
    icon: 'Users',
    description: '员工档案、组织架构',
  },
  {
    name: '招聘管理',
    href: '/dashboard/recruiting',
    icon: 'Briefcase',
    description: '岗位发布、简历筛选、面试安排',
  },
  {
    name: '绩效管理',
    href: '/dashboard/performance',
    icon: 'Target',
    description: '目标设定、绩效评估',
  },
  {
    name: '薪酬管理',
    href: '/dashboard/compensation',
    icon: 'DollarSign',
    description: '工资核算、福利管理',
  },
  {
    name: '考勤管理',
    href: '/dashboard/attendance',
    icon: 'Clock',
    description: '打卡管理、排班、请假',
  },
  {
    name: '培训管理',
    href: '/dashboard/training',
    icon: 'GraduationCap',
    description: '培训计划、课程管理',
  },
  {
    name: '离职管理',
    href: '/dashboard/offboarding',
    icon: 'FileText',
    description: '离职申请、交接、访谈、分析',
  },
  {
    name: '统计分析',
    href: '/dashboard/analytics',
    icon: 'BarChart3',
    description: '数据统计与AI智能分析',
    badge: 'NEW',
  },
  {
    name: '告警监控',
    href: '/dashboard/alerts/monitor',
    icon: 'Bell',
    description: '系统告警与异常监控',
    badge: 'NEW',
  },
  {
    name: '数据同步',
    href: '/dashboard/sync/manager',
    icon: 'Layers',
    description: '数据同步任务管理',
    badge: 'NEW',
  },
];

// 侧边栏状态持久化键
const SIDEBAR_STATE_KEY = 'sidebar-expanded';
const SIDEBAR_OPEN_KEY = 'sidebar-open';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// 优化的侧边栏组件
const OptimizedSidebar = memo(function OptimizedSidebar({
  isOpen,
  pathname,
  expandedMenus,
  onToggleMenu,
  onClose,
  isMobile,
}: {
  isOpen: boolean;
  pathname: string;
  expandedMenus: string[];
  onToggleMenu: (name: string, hasSubItems: boolean) => void;
  onClose: () => void;
  isMobile: boolean;
}) {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-30 h-screen w-64 transform border-r bg-white dark:bg-gray-800 transition-all duration-300 ease-out lg:translate-x-0 shadow-lg lg:shadow-none',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
      aria-label="侧边导航栏"
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          onClick={() => isMobile && onClose()}
        >
          <Logo variant="icon" size="md" />
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">
              PulseOpti HR
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              脉策聚效系统
            </p>
          </div>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={onClose}
          aria-label="关闭侧边栏"
        >
          <IconRenderer name="X" />
        </Button>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-1 custom-scrollbar" aria-label="主导航">
        <NavigationItems
          pathname={pathname}
          expandedMenus={expandedMenus}
          onToggle={onToggleMenu}
          isMobile={isMobile}
          onClose={onClose}
        />
      </nav>

      {/* 底部信息 */}
      <div className="border-t p-4 bg-gray-50 dark:bg-gray-900/50">
        <UpgradePrompt />
      </div>
    </aside>
  );
});

// 导航项组件
const NavigationItems = memo(function NavigationItems({
  pathname,
  expandedMenus,
  onToggle,
  isMobile,
  onClose,
}: {
  pathname: string;
  expandedMenus: string[];
  onToggle: (name: string, hasSubItems: boolean) => void;
  isMobile: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {navigationConfig.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

        return (
          <NavigationItem
            key={item.name}
            item={item}
            isActive={isActive}
            pathname={pathname}
            isMobile={isMobile}
            onClose={onClose}
          />
        );
      })}
    </>
  );
});

// 单个导航项组件
const NavigationItem = memo(function NavigationItem({
  item,
  isActive,
  pathname,
  isMobile,
  onClose,
}: {
  item: typeof navigationConfig[0];
  isActive: boolean;
  pathname: string;
  isMobile: boolean;
  onClose: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={() => isMobile && onClose()}
      className={cn(
        'group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative overflow-hidden',
        isActive
          ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 text-blue-700 dark:text-blue-400 font-medium shadow-sm'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-purple-600 rounded-l" />
      )}

      <div className={cn(
        'relative z-10 flex items-center justify-center transition-transform duration-200',
        isActive ? 'scale-110' : 'group-hover:scale-110'
      )}>
        <IconRenderer name={item.icon} size={20} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{item.name}</span>
          {item.badge && (
            <Badge variant="secondary" className="text-xs font-semibold">
              {item.badge}
            </Badge>
          )}
        </div>
        {!isActive && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
});

// 升级提示组件
const UpgradePrompt = memo(function UpgradePrompt() {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-4 text-white shadow-lg">
      <div className="flex items-start gap-3">
        <IconRenderer name="Sparkles" size={20} className="flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm mb-1">升级到专业版</p>
          <p className="text-xs opacity-90 mb-2">解锁AI智能分析和高级功能</p>
          <Button size="sm" variant="secondary" className="w-full text-xs">
            立即升级
          </Button>
        </div>
      </div>
    </div>
  );
});

// 主布局组件
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // 从本地存储加载侧边栏状态
  const [storedSidebarOpen, setStoredSidebarOpen] = useLocalStorage<boolean>(SIDEBAR_OPEN_KEY, true);
  const [storedExpandedMenus, setStoredExpandedMenus] = useLocalStorage<string[]>(SIDEBAR_STATE_KEY, []);

  useEffect(() => {
    setSidebarOpen(storedSidebarOpen);
  }, [storedSidebarOpen]);

  useEffect(() => {
    setExpandedMenus(storedExpandedMenus);
  }, [storedExpandedMenus]);

  // 保存侧边栏状态
  useEffect(() => {
    setStoredSidebarOpen(sidebarOpen);
  }, [sidebarOpen, setStoredSidebarOpen]);

  useEffect(() => {
    setStoredExpandedMenus(expandedMenus);
  }, [expandedMenus, setStoredExpandedMenus]);

  // 防抖处理菜单切换
  const debouncedToggleMenu = useCallback((menuName: string) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

    if (isMobile) {
      setSidebarOpen(false);
      return;
    }

    setExpandedMenus(prev =>
      prev.includes(menuName)
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    );
  }, []);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 优化的侧边栏 */}
      <OptimizedSidebar
        isOpen={sidebarOpen}
        pathname={pathname}
        expandedMenus={expandedMenus}
        onToggleMenu={debouncedToggleMenu}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* 主内容区 */}
      <div className="lg:pl-64 transition-all duration-300 min-h-screen flex flex-col">
        <Header
          onMenuOpen={() => setSidebarOpen(true)}
          pathname={pathname}
          isMobile={isMobile}
        />

        {/* 页面内容 - 使用 Suspense 优化加载 */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Suspense fallback={<PageSkeleton />}>
            {children}
          </Suspense>
        </main>

        {/* 懒加载反馈组件 */}
        <Suspense fallback={null}>
          <FeedbackWidget />
        </Suspense>
      </div>
    </div>
  );
}

// 头部组件
const Header = memo(function Header({
  onMenuOpen,
  pathname,
  isMobile,
}: {
  onMenuOpen: () => void;
  pathname: string;
  isMobile: boolean;
}) {
  return (
    <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur-lg dark:bg-gray-800/80 transition-all duration-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={onMenuOpen}
            aria-label="打开侧边栏"
          >
            <IconRenderer name="Menu" />
          </Button>
          <Breadcrumbs pathname={pathname} />
        </div>

        <HeaderActions />
      </div>
    </header>
  );
});

// 面包屑导航
const Breadcrumbs = memo(function Breadcrumbs({ pathname }: { pathname: string }) {
  const crumbs = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return [{ name: '工作台', href: '/dashboard' }];

    const labelMap: Record<string, string> = {
      'dashboard': '工作台',
      'recruiting': '招聘管理',
      'performance': '绩效管理',
      'attendance': '考勤管理',
      'compensation': '薪酬管理',
      'training': '培训管理',
      'employees': '组织人事',
      'human-efficiency': '人效监测',
      'analytics': '统计分析',
      'alerts': '告警监控',
      'sync': '数据同步',
    };

    return segments.map((segment, index) => ({
      name: labelMap[segment] || (segment.charAt(0).toUpperCase() + segment.slice(1)),
      href: '/' + segments.slice(0, index + 1).join('/'),
    }));
  }, [pathname]);

  return (
    <nav className="hidden md:flex items-center gap-2 text-sm" aria-label="面包屑导航">
      {crumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center">
          {index > 0 && (
            <IconRenderer name="ChevronRight" size={14} className="text-gray-400 flex-shrink-0" />
          )}
          <Link
            href={crumb.href}
            className={cn(
              'hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate max-w-[150px]',
              index === crumbs.length - 1
                ? 'text-gray-900 dark:text-white font-medium'
                : 'text-gray-600 dark:text-gray-400'
            )}
          >
            {crumb.name}
          </Link>
        </div>
      ))}
    </nav>
  );
});

// 头部操作区
const HeaderActions = memo(function HeaderActions() {
  return (
    <div className="flex items-center gap-2">
      <SearchBox />
      <NotificationBell />
      <UserMenu />
    </div>
  );
});

// 搜索框
const SearchBox = memo(function SearchBox() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 300);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // 使用 debouncedQuery 执行搜索
    if (debouncedQuery.length >= 2) {
      console.log('Searching:', debouncedQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      console.log('Execute search:', searchQuery);
    }
  };

  return (
    <div className={cn(
      'relative hidden sm:block transition-all duration-200',
      isFocused ? 'w-80' : 'w-64'
    )}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <IconRenderer name="Search" size={16} />
      </div>
      <input
        type="text"
        placeholder="搜索功能、员工、文档..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        className={cn(
          'pl-10 pr-4 py-2 w-full rounded-lg border text-sm transition-all duration-200',
          'bg-white dark:bg-gray-800',
          'border-gray-300 dark:border-gray-600',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'hover:border-gray-400 dark:hover:border-gray-500',
          isFocused && 'ring-2 ring-blue-500'
        )}
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="清除搜索"
        >
          <IconRenderer name="X" size={14} />
        </button>
      )}
    </div>
  );
});

// 通知铃铛
const NotificationBell = memo(function NotificationBell() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label="通知"
    >
      <IconRenderer name="Bell" size={20} />
      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
    </Button>
  );
});

// 用户菜单
const UserMenu = memo(function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="user-menu-container relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all duration-200',
          'hover:bg-gray-100 dark:hover:bg-gray-700',
          'focus:outline-none focus:ring-2 focus:ring-blue-500'
        )}
      >
        <OptimizedAvatar
          src="/avatar.png"
          alt="用户头像"
          fallback="李"
          size="md"
        />
        <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
          李明
        </span>
        <IconRenderer name="ChevronDown" size={16} className={cn(
          'transition-transform duration-200 text-gray-500',
          isOpen && 'rotate-180'
        )} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">李明</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">HR经理</p>
          </div>
          <div className="py-1">
            {[
              { icon: 'User', label: '个人资料', href: '/profile' },
              { icon: 'Settings', label: '系统设置', href: '/settings' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <IconRenderer name={item.icon} size={16} />
                {item.label}
              </Link>
            ))}
          </div>
          <div className="border-t dark:border-gray-700 pt-1">
            <Link
              href="/logout"
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <IconRenderer name="LogOut" size={16} />
              退出登录
            </Link>
          </div>
        </div>
      )}
    </div>
  );
});

// 页面骨架屏
function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}
