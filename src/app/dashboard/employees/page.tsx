'use client';

import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { VirtualScroll } from '@/components/performance/virtual-scroll';
import { ResponsiveImage } from '@/components/performance/optimized-image';
import { useForm } from '@/hooks/use-form';
import { useDebounce } from '@/hooks/use-performance';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Filter,
  Download,
  UserCheck,
  UserX,
  ChevronDown,
  ChevronUp,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/theme';

// 类型定义
interface Employee {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  location: string;
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  hireDate: string;
  avatar: string | null;
  manager: string;
  team: string;
}

// 模拟数据生成
const generateMockEmployees = (): Employee[] =>
  Array.from({ length: 150 }, (_, i) => {
    const departments = ['技术部', '产品部', '设计部', '市场部', '运营部', '人力资源部'];
    const positions = ['高级工程师', '工程师', '经理', '主管', '专员', '总监'];
    const statuses: Array<'active' | 'inactive' | 'on_leave' | 'terminated'> =
      ['active', 'active', 'active', 'active', 'inactive', 'on_leave', 'terminated'];
    const locations = ['北京', '上海', '深圳', '杭州', '成都'];

    return {
      id: `emp-${i + 1}`,
      name: `员工${String.fromCharCode(65 + (i % 26))}${i + 1}`,
      employeeId: `EMP${String(i + 1).padStart(4, '0')}`,
      department: departments[i % departments.length],
      position: positions[i % positions.length],
      email: `employee${i + 1}@company.com`,
      phone: `138${String(i).padStart(8, '0')}`,
      location: locations[i % locations.length],
      status: statuses[i % statuses.length],
      hireDate: `202${i % 4}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      avatar: null,
      manager: i < 5 ? '' : `员工${String.fromCharCode(65 + ((i - 1) % 26))}${i}`,
      team: `${departments[i % departments.length]}团队${(i % 3) + 1}`,
    };
  });

// 状态映射
const statusMap: Record<string, { label: string; color: string; icon: any }> = {
  active: { label: '在职', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: UserCheck },
  inactive: { label: '离职', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', icon: UserX },
  on_leave: { label: '休假', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Calendar },
  terminated: { label: '已离职', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: UserX },
};

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const debouncedSearch = useDebounce(searchQuery, 300);

  // 模拟数据
  const [employees] = useState<Employee[]>(generateMockEmployees());

  // 部门列表
  const departments = useMemo(() => {
    const depts = Array.from(new Set(employees.map((e) => e.department)));
    return depts.sort();
  }, [employees]);

  // 统计数据
  const stats = useMemo(() => {
    return {
      total: employees.length,
      active: employees.filter((e) => e.status === 'active').length,
      onLeave: employees.filter((e) => e.status === 'on_leave').length,
      newHiresThisMonth: employees.filter((e) => {
        const hireDate = new Date(e.hireDate);
        const now = new Date();
        return hireDate.getMonth() === now.getMonth() && hireDate.getFullYear() === now.getFullYear();
      }).length,
    };
  }, [employees]);

  // 筛选员工
  const filteredEmployees = useMemo(() => {
    let filtered = [...employees];

    // 搜索过滤
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(query) ||
          emp.employeeId.toLowerCase().includes(query) ||
          emp.position.toLowerCase().includes(query) ||
          emp.department.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query)
      );
    }

    // 状态过滤
    if (statusFilter !== 'all') {
      filtered = filtered.filter((emp) => emp.status === statusFilter);
    }

    // 部门过滤
    if (departmentFilter !== 'all') {
      filtered = filtered.filter((emp) => emp.department === departmentFilter);
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name, 'zh');
        case 'name-desc':
          return b.name.localeCompare(a.name, 'zh');
        case 'date-asc':
          return new Date(a.hireDate).getTime() - new Date(b.hireDate).getTime();
        case 'date-desc':
          return new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime();
        case 'id-asc':
          return a.employeeId.localeCompare(b.employeeId);
        case 'id-desc':
          return b.employeeId.localeCompare(a.employeeId);
        default:
          return 0;
      }
    });

    return filtered;
  }, [employees, debouncedSearch, statusFilter, departmentFilter, sortBy]);

  // 员工表单
  const employeeForm = useForm({
    initialValues: {
      name: '',
      employeeId: '',
      department: '',
      position: '',
      email: '',
      phone: '',
      location: '',
      manager: '',
    },
    validationRules: {
      name: { required: true, minLength: 2 },
      employeeId: { required: true },
      department: { required: true },
      position: { required: true },
      email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      phone: { required: true },
      location: { required: true },
    },
    onSubmit: async (values) => {
      console.log('Creating employee:', values);
      setIsCreateDialogOpen(false);
      employeeForm.resetForm();
    },
  });

  // 切换卡片展开
  const toggleCardExpand = useCallback((employeeId: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(employeeId)) {
        next.delete(employeeId);
      } else {
        next.add(employeeId);
      }
      return next;
    });
  }, []);

  // 查看员工详情
  const viewEmployeeDetail = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailDialogOpen(true);
  }, []);

  // 员工列表项
  const EmployeeItem = useCallback((employee: Employee) => {
    const isExpanded = expandedCards.has(employee.id);
    const statusInfo = statusMap[employee.status];
    const StatusIcon = statusInfo.icon;

    return (
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="shrink-0 relative">
                {employee.avatar ? (
                  <ResponsiveImage src={employee.avatar} alt={employee.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-lg">
                    {employee.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                    {employee.name}
                  </h4>
                  <Badge variant="outline" className="text-xs">{employee.employeeId}</Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {employee.position}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-500">
                  <span className="flex items-center gap-1">
                    <Building2 size={12} />
                    {employee.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {employee.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge className={statusInfo.color} variant="secondary">
                <StatusIcon size={12} className="mr-1" />
                {statusInfo.label}
              </Badge>
              <Button variant="ghost" size="icon" onClick={() => toggleCardExpand(employee.id)}>
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => viewEmployeeDetail(employee)}>
                <Eye size={16} />
              </Button>
            </div>
          </div>

          {isExpanded && (
            <div className="px-4 pb-4 pt-0 border-t dark:border-gray-700 mt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">邮箱</p>
                  <p className="text-sm flex items-center gap-1">
                    <Mail size={12} className="text-gray-400" />
                    <span className="truncate">{employee.email}</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">电话</p>
                  <p className="text-sm flex items-center gap-1">
                    <Phone size={12} className="text-gray-400" />
                    {employee.phone}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">入职日期</p>
                  <p className="text-sm flex items-center gap-1">
                    <Calendar size={12} className="text-gray-400" />
                    {employee.hireDate}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">团队</p>
                  <p className="text-sm flex items-center gap-1">
                    <Briefcase size={12} className="text-gray-400" />
                    {employee.team}
                  </p>
                </div>
              </div>
              {employee.manager && (
                <div className="mt-3 pt-3 border-t dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">直属上级</p>
                  <p className="text-sm mt-1">{employee.manager}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }, [expandedCards, toggleCardExpand, viewEmployeeDetail]);

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">组织人事</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            管理员工档案、组织架构和团队信息
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            导出员工
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus size={16} className="mr-2" />
                新增员工
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>新增员工</DialogTitle>
                <DialogDescription>
                  填写员工基本信息，添加到组织架构
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={employeeForm.handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">姓名 *</Label>
                    <Input
                      id="name"
                      placeholder="员工姓名"
                      value={employeeForm.values.name}
                      onChange={(e) => employeeForm.handleChange('name', e.target.value)}
                      onBlur={() => employeeForm.handleBlur('name')}
                      className={employeeForm.errors.name ? 'border-red-500' : ''}
                    />
                    {employeeForm.errors.name && (
                      <p className="text-sm text-red-500">{employeeForm.errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">工号 *</Label>
                    <Input
                      id="employeeId"
                      placeholder="EMP0001"
                      value={employeeForm.values.employeeId}
                      onChange={(e) => employeeForm.handleChange('employeeId', e.target.value)}
                      onBlur={() => employeeForm.handleBlur('employeeId')}
                      className={employeeForm.errors.employeeId ? 'border-red-500' : ''}
                    />
                    {employeeForm.errors.employeeId && (
                      <p className="text-sm text-red-500">{employeeForm.errors.employeeId}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">部门 *</Label>
                    <Input
                      id="department"
                      placeholder="所属部门"
                      value={employeeForm.values.department}
                      onChange={(e) => employeeForm.handleChange('department', e.target.value)}
                      onBlur={() => employeeForm.handleBlur('department')}
                      className={employeeForm.errors.department ? 'border-red-500' : ''}
                    />
                    {employeeForm.errors.department && (
                      <p className="text-sm text-red-500">{employeeForm.errors.department}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">职位 *</Label>
                    <Input
                      id="position"
                      placeholder="职位名称"
                      value={employeeForm.values.position}
                      onChange={(e) => employeeForm.handleChange('position', e.target.value)}
                      onBlur={() => employeeForm.handleBlur('position')}
                      className={employeeForm.errors.position ? 'border-red-500' : ''}
                    />
                    {employeeForm.errors.position && (
                      <p className="text-sm text-red-500">{employeeForm.errors.position}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">邮箱 *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="employee@company.com"
                      value={employeeForm.values.email}
                      onChange={(e) => employeeForm.handleChange('email', e.target.value)}
                      onBlur={() => employeeForm.handleBlur('email')}
                      className={employeeForm.errors.email ? 'border-red-500' : ''}
                    />
                    {employeeForm.errors.email && (
                      <p className="text-sm text-red-500">{employeeForm.errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">电话 *</Label>
                    <Input
                      id="phone"
                      placeholder="手机号码"
                      value={employeeForm.values.phone}
                      onChange={(e) => employeeForm.handleChange('phone', e.target.value)}
                      onBlur={() => employeeForm.handleBlur('phone')}
                      className={employeeForm.errors.phone ? 'border-red-500' : ''}
                    />
                    {employeeForm.errors.phone && (
                      <p className="text-sm text-red-500">{employeeForm.errors.phone}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">办公地点 *</Label>
                    <Input
                      id="location"
                      placeholder="北京"
                      value={employeeForm.values.location}
                      onChange={(e) => employeeForm.handleChange('location', e.target.value)}
                      onBlur={() => employeeForm.handleBlur('location')}
                      className={employeeForm.errors.location ? 'border-red-500' : ''}
                    />
                    {employeeForm.errors.location && (
                      <p className="text-sm text-red-500">{employeeForm.errors.location}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manager">直属上级</Label>
                    <Input
                      id="manager"
                      placeholder="上级姓名"
                      value={employeeForm.values.manager}
                      onChange={(e) => employeeForm.handleChange('manager', e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      employeeForm.resetForm();
                    }}
                  >
                    取消
                  </Button>
                  <Button type="submit" disabled={employeeForm.submitting}>
                    {employeeForm.submitting ? '添加中...' : '添加员工'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              员工总数
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">在职员工</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              在职
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">活跃员工</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              休假中
            </CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.onLeave}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">请假或休假</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              本月入职
            </CardTitle>
            <Plus className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.newHiresThisMonth}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">新员工加入</p>
          </CardContent>
        </Card>
      </div>

      {/* 筛选和列表 */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索员工姓名、工号、职位、部门或邮箱..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              <Filter className="h-4 w-4 text-gray-400" />
              <div className="flex gap-2">
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-9 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">全部状态</option>
                    <option value="active">在职</option>
                    <option value="inactive">离职</option>
                    <option value="on_leave">休假</option>
                    <option value="terminated">已离职</option>
                  </select>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="h-9 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">全部部门</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-9 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="name-asc">姓名升序</option>
                    <option value="name-desc">姓名降序</option>
                    <option value="date-asc">入职日期升序</option>
                    <option value="date-desc">入职日期降序</option>
                    <option value="id-asc">工号升序</option>
                    <option value="id-desc">工号降序</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <VirtualScroll
            items={filteredEmployees}
            itemHeight={150}
            renderItem={EmployeeItem}
            height={700}
            className="h-[700px]"
          />
        </CardContent>
      </Card>
    </div>
  );
}
