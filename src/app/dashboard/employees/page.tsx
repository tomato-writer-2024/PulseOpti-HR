'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Plus,
  Download,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ChevronRight,
  Filter,
  MoreVertical,
  User,
  Building2,
  Briefcase,
  GraduationCap,
  Grid3x3,
  List,
  BarChart3,
} from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  level: string;
  status: 'active' | 'inactive' | 'onboarding' | 'terminated';
  joinDate: string;
  location: string;
  salary?: number;
  manager?: string;
}

interface EmployeeDetailProps {
  employee: Employee;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
}

function EmployeeDetail({ employee, onClose, onEdit }: EmployeeDetailProps) {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{employee.name}</h2>
          <p className="text-muted-foreground">{employee.position} · {employee.department}</p>
        </div>
        <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
          {employee.status}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="info">基本信息</TabsTrigger>
          <TabsTrigger value="work">工作信息</TabsTrigger>
          <TabsTrigger value="contact">联系方式</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">工号</Label>
              <p className="font-medium">{employee.id}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">姓名</Label>
              <p className="font-medium">{employee.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">状态</Label>
              <p className="font-medium">{employee.status}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">入职日期</Label>
              <p className="font-medium">{employee.joinDate}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="work" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">部门</Label>
              <p className="font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {employee.department}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">职位</Label>
              <p className="font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                {employee.position}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">职级</Label>
              <p className="font-medium">{employee.level}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">直属上级</Label>
              <p className="font-medium">{employee.manager || '未设置'}</p>
            </div>
            {employee.salary && (
              <div>
                <Label className="text-muted-foreground">薪资</Label>
                <p className="font-medium">¥{employee.salary.toLocaleString()}</p>
              </div>
            )}
            <div>
              <Label className="text-muted-foreground">工作地点</Label>
              <p className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {employee.location}
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-xs">邮箱</Label>
                <p className="font-medium">{employee.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-xs">电话</Label>
                <p className="font-medium">{employee.phone}</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2 pt-4 border-t">
        <Button onClick={() => onEdit(employee)} className="flex-1">
          <Edit className="h-4 w-4 mr-2" />
          编辑
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1">
          关闭
        </Button>
      </div>
    </div>
  );
}

export default function EmployeesPage() {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setEmployees([
        {
          id: 'EMP001',
          name: '张三',
          email: 'zhangsan@example.com',
          phone: '13800138000',
          department: '技术部',
          position: '高级前端工程师',
          level: 'P6',
          status: 'active',
          joinDate: '2023-01-15',
          location: '北京',
          salary: 35000,
          manager: '李总',
        },
        {
          id: 'EMP002',
          name: '李四',
          email: 'lisi@example.com',
          phone: '13800138001',
          department: '产品部',
          position: '高级产品经理',
          level: 'P7',
          status: 'active',
          joinDate: '2023-02-20',
          location: '上海',
          salary: 45000,
          manager: '王总',
        },
        {
          id: 'EMP003',
          name: '王五',
          email: 'wangwu@example.com',
          phone: '13800138002',
          department: '技术部',
          position: '后端工程师',
          level: 'P5',
          status: 'onboarding',
          joinDate: '2024-04-01',
          location: '北京',
          salary: 25000,
          manager: '李总',
        },
        {
          id: 'EMP004',
          name: '赵六',
          email: 'zhaoliu@example.com',
          phone: '13800138003',
          department: '市场部',
          position: '市场专员',
          level: 'P4',
          status: 'active',
          joinDate: '2023-06-10',
          location: '深圳',
          salary: 20000,
          manager: '陈总',
        },
        {
          id: 'EMP005',
          name: '钱七',
          email: 'qianqi@example.com',
          phone: '13800138004',
          department: '人力资源部',
          position: 'HR专员',
          level: 'P4',
          status: 'inactive',
          joinDate: '2022-09-15',
          location: '北京',
          salary: 18000,
          manager: '刘总',
        },
      ]);
      setLoading(false);
    };
    fetchEmployees();
  }, []);

  const departments = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.department)));
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    let filtered = [...employees];

    if (debouncedSearch) {
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          emp.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          emp.department.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          emp.position.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter((emp) => emp.department === departmentFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((emp) => emp.status === statusFilter);
    }

    filtered.sort((a, b) => {
      const aValue = a[sortBy as keyof Employee];
      const bValue = b[sortBy as keyof Employee];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });

    return filtered;
  }, [employees, debouncedSearch, departmentFilter, statusFilter, sortBy, sortOrder]);

  const handleSort = useCallback((field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  }, [sortBy, sortOrder]);

  const stats = useMemo(() => ({
    total: employees.length,
    active: employees.filter((e) => e.status === 'active').length,
    onboarding: employees.filter((e) => e.status === 'onboarding').length,
    terminated: employees.filter((e) => e.status === 'terminated').length,
  }), [employees]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredEmployees.map((e) => e.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectEmployee = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 animate-pulse bg-muted rounded" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
        <div className="h-96 animate-pulse bg-muted rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">员工管理</h1>
          <p className="text-muted-foreground mt-1">管理企业员工信息和组织架构</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                导出选中
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                批量删除
              </Button>
            </>
          )}
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            导出全部
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                新增员工
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新增员工</DialogTitle>
                <DialogDescription>添加新的员工到组织架构中</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>姓名</Label>
                  <Input placeholder="请输入姓名" />
                </div>
                <div className="space-y-2">
                  <Label>邮箱</Label>
                  <Input type="email" placeholder="请输入邮箱" />
                </div>
                <div className="space-y-2">
                  <Label>部门</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择部门" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>职位</Label>
                  <Input placeholder="请输入职位" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  取消
                </Button>
                <Button>创建</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">员工总数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">所有员工</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">在职员工</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground mt-1">正常工作</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">入职中</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.onboarding}</div>
            <p className="text-xs text-muted-foreground mt-1">待入职</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已离职</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.terminated}</div>
            <p className="text-xs text-muted-foreground mt-1">历史记录</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>员工列表 ({filteredEmployees.length})</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索姓名、邮箱、部门、职位..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="部门" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部部门</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="active">在职</SelectItem>
                  <SelectItem value="inactive">离职</SelectItem>
                  <SelectItem value="onboarding">入职中</SelectItem>
                  <SelectItem value="terminated">已离职</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-l-none"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              没有找到匹配的员工
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 border-b">
                <Checkbox
                  checked={selectedIds.length === filteredEmployees.length && filteredEmployees.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-muted-foreground">全选</span>
                {selectedIds.length > 0 && (
                  <span className="text-sm text-muted-foreground ml-2">
                    已选择 {selectedIds.length} 项
                  </span>
                )}
              </div>
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                >
                  <Checkbox
                    checked={selectedIds.includes(employee.id)}
                    onCheckedChange={(checked) => handleSelectEmployee(employee.id, checked as boolean)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div
                    className="flex items-center gap-3 flex-1 min-w-0"
                    onClick={() => setSelectedEmployee(employee)}
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shrink-0">
                      {employee.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{employee.name}</p>
                        <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                          {employee.status === 'active' ? '在职' : employee.status === 'onboarding' ? '入职中' : employee.status === 'inactive' ? '离职' : '已离职'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {employee.position} · {employee.department}
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground shrink-0">
                      <span>{employee.email}</span>
                      <span>{employee.joinDate}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setSelectedEmployee(employee)}>
                        <User className="h-4 w-4 mr-2" />
                        查看详情
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.map((employee) => (
                <Card
                  key={employee.id}
                  className="cursor-pointer hover:shadow-lg transition-all group"
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                          {employee.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.position}</p>
                        </div>
                      </div>
                      <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                        {employee.status === 'active' ? '在职' : employee.status === 'onboarding' ? '入职中' : '离职'}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>{employee.department}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>入职: {employee.joinDate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>员工详情</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <EmployeeDetail
              employee={selectedEmployee}
              onClose={() => setSelectedEmployee(null)}
              onEdit={(emp) => {
                setSelectedEmployee(emp);
                setIsEditDialogOpen(true);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
