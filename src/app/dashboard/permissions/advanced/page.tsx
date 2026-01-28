'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Users,
  Lock,
  Unlock,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Crown,
  Key,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  AlertTriangle,
  CheckSquare,
  Square,
  MoreHorizontal,
  UserPlus,
  Settings,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  type: 'system' | 'custom';
  permissions: string[];
  userCount: number;
  createdAt: string;
  status: 'active' | 'inactive';
}

interface Permission {
  id: string;
  module: string;
  category: string;
  name: string;
  code: string;
  description: string;
  level: 'read' | 'write' | 'delete' | 'admin';
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  department: string;
  position: string;
  roles: string[];
  status: 'active' | 'inactive';
  lastLogin?: string;
}

export default function AdvancedPermissionsPage() {
  const [activeTab, setActiveTab] = useState('roles');
  const [showCreateRoleDialog, setShowCreateRoleDialog] = useState(false);
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: '超级管理员',
      code: 'SUPER_ADMIN',
      description: '拥有系统所有权限，可以进行所有操作',
      type: 'system',
      permissions: ['all'],
      userCount: 2,
      createdAt: '2024-01-01',
      status: 'active',
    },
    {
      id: '2',
      name: 'COE管理员',
      code: 'COE_ADMIN',
      description: 'COE专家中心管理员，管理绩效、薪酬、培训等',
      type: 'system',
      permissions: [
        'performance.read', 'performance.write', 'performance.delete',
        'compensation.read', 'compensation.write',
        'training.read', 'training.write',
        'compliance.read', 'compliance.write',
      ],
      userCount: 3,
      createdAt: '2024-01-01',
      status: 'active',
    },
    {
      id: '3',
      name: 'HRBP管理员',
      code: 'HRBP_ADMIN',
      description: 'HRBP业务伙伴管理员，管理招聘、人才发展等',
      type: 'system',
      permissions: [
        'recruitment.read', 'recruitment.write', 'recruitment.delete',
        'talent.read', 'talent.write',
        'employee-care.read', 'employee-care.write',
        'org-diagnostics.read', 'org-diagnostics.write',
        'ai-assistant.read', 'ai-assistant.write',
      ],
      userCount: 5,
      createdAt: '2024-01-01',
      status: 'active',
    },
    {
      id: '4',
      name: 'SSC管理员',
      code: 'SSC_ADMIN',
      description: 'SSC共享中心管理员，管理员工、考勤、薪酬发放等',
      type: 'system',
      permissions: [
        'employees.read', 'employees.write', 'employees.delete',
        'attendance.read', 'attendance.write',
        'employee-portal.read', 'employee-portal.write',
        'payroll.read', 'payroll.write',
        'points.read', 'points.write',
      ],
      userCount: 4,
      createdAt: '2024-01-01',
      status: 'active',
    },
    {
      id: '5',
      name: 'HR专员',
      code: 'HR_SPECIALIST',
      description: 'HR专员，基本的HR操作权限',
      type: 'custom',
      permissions: [
        'employees.read',
        'performance.read',
        'attendance.read',
        'employee-portal.read',
      ],
      userCount: 8,
      createdAt: '2024-03-01',
      status: 'active',
    },
    {
      id: '6',
      name: '部门经理',
      code: 'DEPT_MANAGER',
      description: '部门经理，可以查看和管理本部门员工',
      type: 'custom',
      permissions: [
        'employees.read',
        'performance.read', 'performance.write',
        'attendance.read',
      ],
      userCount: 12,
      createdAt: '2024-04-01',
      status: 'active',
    },
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: '张总',
      email: 'zhang@example.com',
      department: '管理层',
      position: 'CEO',
      roles: ['超级管理员'],
      status: 'active',
      lastLogin: '2024-12-15 10:30',
    },
    {
      id: '2',
      name: '李HR',
      email: 'li.hr@example.com',
      department: '人力资源部',
      position: 'HR总监',
      roles: ['超级管理员'],
      status: 'active',
      lastLogin: '2024-12-15 09:15',
    },
    {
      id: '3',
      name: '王COE',
      email: 'wang.coe@example.com',
      department: '人力资源部',
      position: 'COE负责人',
      roles: ['COE管理员'],
      status: 'active',
      lastLogin: '2024-12-14 16:45',
    },
    {
      id: '4',
      name: '刘HRBP',
      email: 'liu.hrbp@example.com',
      department: '人力资源部',
      position: 'HRBP经理',
      roles: ['HRBP管理员'],
      status: 'active',
      lastLogin: '2024-12-14 14:20',
    },
    {
      id: '5',
      name: '陈SSC',
      email: 'chen.ssc@example.com',
      department: '人力资源部',
      position: 'SSC负责人',
      roles: ['SSC管理员'],
      status: 'active',
      lastLogin: '2024-12-14 11:30',
    },
  ]);

  const [permissions] = useState<Permission[]>([
    // 工作台
    { id: 'p1', module: 'workbench', category: '工作台', name: '查看工作台', code: 'workbench.read', description: '查看工作台数据和概览', level: 'read' },
    // COE - 绩效管理
    { id: 'p2', module: 'performance', category: 'COE', name: '查看绩效', code: 'performance.read', description: '查看绩效数据', level: 'read' },
    { id: 'p3', module: 'performance', category: 'COE', name: '编辑绩效', code: 'performance.write', description: '编辑绩效数据', level: 'write' },
    { id: 'p4', module: 'performance', category: 'COE', name: '删除绩效', code: 'performance.delete', description: '删除绩效数据', level: 'delete' },
    { id: 'p5', module: 'performance', category: 'COE', name: '绩效管理', code: 'performance.admin', description: '绩效管理权限', level: 'admin' },
    // COE - 薪酬管理
    { id: 'p6', module: 'compensation', category: 'COE', name: '查看薪酬', code: 'compensation.read', description: '查看薪酬数据', level: 'read' },
    { id: 'p7', module: 'compensation', category: 'COE', name: '编辑薪酬', code: 'compensation.write', description: '编辑薪酬数据', level: 'write' },
    { id: 'p8', module: 'compensation', category: 'COE', name: '薪酬管理', code: 'compensation.admin', description: '薪酬管理权限', level: 'admin' },
    // HRBP - 招聘管理
    { id: 'p9', module: 'recruitment', category: 'HRBP', name: '查看招聘', code: 'recruitment.read', description: '查看招聘数据', level: 'read' },
    { id: 'p10', module: 'recruitment', category: 'HRBP', name: '编辑招聘', code: 'recruitment.write', description: '编辑招聘数据', level: 'write' },
    { id: 'p11', module: 'recruitment', category: 'HRBP', name: '删除招聘', code: 'recruitment.delete', description: '删除招聘数据', level: 'delete' },
    { id: 'p12', module: 'recruitment', category: 'HRBP', name: '招聘管理', code: 'recruitment.admin', description: '招聘管理权限', level: 'admin' },
    // SSC - 员工管理
    { id: 'p13', module: 'employees', category: 'SSC', name: '查看员工', code: 'employees.read', description: '查看员工信息', level: 'read' },
    { id: 'p14', module: 'employees', category: 'SSC', name: '编辑员工', code: 'employees.write', description: '编辑员工信息', level: 'write' },
    { id: 'p15', module: 'employees', category: 'SSC', name: '删除员工', code: 'employees.delete', description: '删除员工信息', level: 'delete' },
    { id: 'p16', module: 'employees', category: 'SSC', name: '员工管理', code: 'employees.admin', description: '员工管理权限', level: 'admin' },
    // 高级功能
    { id: 'p17', module: 'premium', category: '高级功能', name: '高级权限', code: 'premium.permissions', description: '管理高级权限', level: 'admin' },
    { id: 'p18', module: 'premium', category: '高级功能', name: '数据导出', code: 'premium.export', description: '数据导出权限', level: 'write' },
    { id: 'p19', module: 'premium', category: '高级功能', name: 'API访问', code: 'premium.api', description: 'API访问权限', level: 'write' },
    { id: 'p20', module: 'premium', category: '高级功能', name: '自定义报表', code: 'premium.reports', description: '自定义报表权限', level: 'write' },
  ]);

  const [roleFormData, setRoleFormData] = useState({
    name: '',
    code: '',
    description: '',
    type: 'custom',
  });

  const stats = {
    totalRoles: roles.length,
    activeRoles: roles.filter(r => r.status === 'active').length,
    systemRoles: roles.filter(r => r.type === 'system').length,
    customRoles: roles.filter(r => r.type === 'custom').length,
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
  };

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || role.type === selectedType;
    return matchesSearch && matchesType;
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getTypeBadge = (type: string) => {
    const variants: Record<string, any> = {
      system: { label: '系统角色', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
      custom: { label: '自定义角色', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    };
    const variant = variants[type];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: { label: '启用', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      inactive: { label: '停用', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
    };
    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getLevelBadge = (level: string) => {
    const variants: Record<string, any> = {
      read: { label: '查看', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      write: { label: '编辑', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      delete: { label: '删除', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
      admin: { label: '管理', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    };
    const variant = variants[level];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const handleCreateRole = () => {
    if (!roleFormData.name || !roleFormData.code) {
      toast.error('请填写完整的角色信息');
      return;
    }

    const newRole: Role = {
      id: Date.now().toString(),
      name: roleFormData.name,
      code: roleFormData.code,
      description: roleFormData.description,
      type: roleFormData.type as any,
      permissions: [],
      userCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    setRoles([...roles, newRole]);
    setShowCreateRoleDialog(false);
    setRoleFormData({ name: '', code: '', description: '', type: 'custom' });
    toast.success('角色创建成功');
  };

  const handleToggleRoleStatus = (roleId: string) => {
    setRoles(roles.map(role =>
      role.id === roleId
        ? { ...role, status: role.status === 'active' ? 'inactive' : 'active' }
        : role
    ));
    toast.success('角色状态已更新');
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter(role => role.id !== roleId));
    toast.success('角色已删除');
  };

  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-red-600 to-pink-600 rounded-lg">
                <Shield className="h-7 w-7 text-white" />
              </div>
              高级权限管理
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              企业级权限控制系统，精细化管理用户角色与权限
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white border-0">
              <Crown className="h-3 w-3 mr-1" />
              PRO功能
            </Badge>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出权限
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">角色总数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRoles}</div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                <Shield className="h-3 w-3 mr-1" />
                个
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">启用角色</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.activeRoles}</div>
              <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                个
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">系统角色</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.systemRoles}</div>
              <div className="flex items-center text-xs text-purple-600 dark:text-purple-400 mt-1">
                <Lock className="h-3 w-3 mr-1" />
                个
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">自定义角色</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.customRoles}</div>
              <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mt-1">
                <Unlock className="h-3 w-3 mr-1" />
                个
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">用户总数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                <Users className="h-3 w-3 mr-1" />
                人
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">活跃用户</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.activeUsers}</div>
              <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                人
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 功能Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              角色管理
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              用户管理
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              权限列表
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              审计日志
            </TabsTrigger>
          </TabsList>

          {/* 角色管理 */}
          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>角色列表</CardTitle>
                    <CardDescription>管理系统中的所有角色和权限</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="搜索角色..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                    <Select
                      value={selectedType}
                      onValueChange={setSelectedType}
                      defaultValue={selectedType}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部类型</SelectItem>
                        <SelectItem value="system">系统角色</SelectItem>
                        <SelectItem value="custom">自定义角色</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
                      <Plus className="h-4 w-4 mr-2" />
                      创建角色
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRoles.map((role) => (
                    <Card key={role.id} className="hover:shadow-md transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {role.type === 'system' ? (
                              <Lock className="h-5 w-5 text-purple-600" />
                            ) : (
                              <Unlock className="h-5 w-5 text-blue-600" />
                            )}
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {role.name}
                              </h3>
                              <p className="text-xs text-gray-500">{role.code}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {getTypeBadge(role.type)}
                            {getStatusBadge(role.status)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {role.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{role.userCount} 用户</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Key className="h-3 w-3" />
                            <span>{role.permissions.length} 权限</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-3 border-t dark:border-gray-700">
                          <Button variant="ghost" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            查看
                          </Button>
                          <Button variant="ghost" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-1" />
                            编辑
                          </Button>
                          {role.type === 'custom' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteRole(role.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 用户管理 */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>用户列表</CardTitle>
                    <CardDescription>管理系统中的所有用户</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="搜索用户..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                    <Button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
                      <UserPlus className="h-4 w-4 mr-2" />
                      添加用户
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border dark:border-gray-700">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>用户</TableHead>
                        <TableHead>部门</TableHead>
                        <TableHead>职位</TableHead>
                        <TableHead>角色</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>最后登录</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                                  {user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-xs text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.department}</TableCell>
                          <TableCell>{user.position}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {user.roles.map((role, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                            {user.lastLogin || '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 权限列表 */}
          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>权限列表</CardTitle>
                <CardDescription>系统中的所有权限配置</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(groupedPermissions).map(([category, perms]) => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        {category}
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {perms.map((perm) => (
                          <Card key={perm.id} className="hover:shadow-sm transition-all">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-sm">{perm.name}</h4>
                                    {getLevelBadge(perm.level)}
                                  </div>
                                  <p className="text-xs text-gray-500">{perm.code}</p>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {perm.description}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 审计日志 */}
          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>审计日志</CardTitle>
                <CardDescription>权限变更和访问记录</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    暂无审计日志
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    权限操作和访问记录将显示在这里
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 创建角色对话框 */}
        <Dialog open={showCreateRoleDialog} onOpenChange={setShowCreateRoleDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>创建新角色</DialogTitle>
              <DialogDescription>
                创建自定义角色并配置权限
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">角色名称 *</Label>
                <Input
                  id="name"
                  value={roleFormData.name}
                  onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
                  placeholder="例如：市场部专员"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">角色代码 *</Label>
                <Input
                  id="code"
                  value={roleFormData.code}
                  onChange={(e) => setRoleFormData({ ...roleFormData, code: e.target.value })}
                  placeholder="例如：MARKETING_SPECIALIST"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">角色描述</Label>
                <Textarea
                  id="description"
                  value={roleFormData.description}
                  onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })}
                  placeholder="描述该角色的职责和权限范围"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateRoleDialog(false)}>取消</Button>
              <Button onClick={handleCreateRole}>创建角色</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
