'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Shield,
  Users,
  Key,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Settings,
  Search,
  Filter,
  MoreVertical,
  RefreshCw,
  Lock,
  Unlock,
  Crown,
  Star,
  Zap,
  TrendingUp,
  UserPlus,
  LayoutGrid,
  List,
  Copy as CopyIcon,
} from 'lucide-react';

// 权限类型
type PermissionLevel = 'admin' | 'manager' | 'employee' | 'viewer';
type ModulePermission = 'read' | 'write' | 'delete' | 'approve';

interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  level: PermissionLevel;
  isSystem: boolean;
  permissions: ModulePermissions;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ModulePermissions {
  employee: ModulePermission;
  attendance: ModulePermission;
  leave: ModulePermission;
  performance: ModulePermission;
  recruitment: ModulePermission;
  training: ModulePermission;
  compensation: ModulePermission;
  settings: ModulePermission;
  reports: ModulePermission;
}

interface RoleUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  department: string;
  position: string;
  role: string;
  roleId: string;
  roleName: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
}

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: 'grant' | 'revoke' | 'modify' | 'delete';
  resourceType: 'role' | 'permission' | 'user';
  resourceId: string;
  resourceName: string;
  details: string;
  ip: string;
  timestamp: string;
}

export default function AdvancedPermissionsPage() {
  const [activeTab, setActiveTab] = useState('roles');
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  // 角色数据
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: '超级管理员',
      code: 'SUPER_ADMIN',
      description: '拥有系统的所有权限',
      level: 'admin',
      isSystem: true,
      permissions: {
        employee: 'delete',
        attendance: 'delete',
        leave: 'approve',
        performance: 'delete',
        recruitment: 'delete',
        training: 'delete',
        compensation: 'delete',
        settings: 'delete',
        reports: 'delete',
      },
      userCount: 3,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      name: '部门经理',
      code: 'DEPT_MANAGER',
      description: '管理部门范围内的员工和数据',
      level: 'manager',
      isSystem: true,
      permissions: {
        employee: 'write',
        attendance: 'write',
        leave: 'approve',
        performance: 'write',
        recruitment: 'read',
        training: 'write',
        compensation: 'read',
        settings: 'read',
        reports: 'write',
      },
      userCount: 12,
      createdAt: '2024-01-01',
      updatedAt: '2024-03-15',
    },
    {
      id: '3',
      name: 'HR专员',
      code: 'HR_SPECIALIST',
      description: '负责人力资源日常管理工作',
      level: 'manager',
      isSystem: true,
      permissions: {
        employee: 'write',
        attendance: 'write',
        leave: 'approve',
        performance: 'write',
        recruitment: 'write',
        training: 'write',
        compensation: 'read',
        settings: 'read',
        reports: 'write',
      },
      userCount: 8,
      createdAt: '2024-01-01',
      updatedAt: '2024-03-15',
    },
    {
      id: '4',
      name: '普通员工',
      code: 'EMPLOYEE',
      description: '查看个人信息和进行基本操作',
      level: 'employee',
      isSystem: true,
      permissions: {
        employee: 'read',
        attendance: 'write',
        leave: 'write',
        performance: 'read',
        recruitment: 'read',
        training: 'read',
        compensation: 'read',
        settings: 'read',
        reports: 'read',
      },
      userCount: 125,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '5',
      name: '访客',
      code: 'VISITOR',
      description: '仅查看权限，无编辑权限',
      level: 'viewer',
      isSystem: true,
      permissions: {
        employee: 'read',
        attendance: 'read',
        leave: 'read',
        performance: 'read',
        recruitment: 'read',
        training: 'read',
        compensation: 'read',
        settings: 'read',
        reports: 'read',
      },
      userCount: 5,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '6',
      name: '财务经理',
      code: 'FINANCE_MANAGER',
      description: '负责薪资和薪酬相关管理',
      level: 'manager',
      isSystem: false,
      permissions: {
        employee: 'read',
        attendance: 'read',
        leave: 'read',
        performance: 'read',
        recruitment: 'read',
        training: 'read',
        compensation: 'approve',
        settings: 'read',
        reports: 'delete',
      },
      userCount: 2,
      createdAt: '2024-02-15',
      updatedAt: '2024-04-01',
    },
  ]);

  // 角色用户数据
  const [roleUsers, setRoleUsers] = useState<RoleUser[]>([
    {
      id: '1',
      name: '张三',
      email: 'zhangsan@example.com',
      department: '技术部',
      position: '技术总监',
      role: 'admin',
      roleId: '1',
      roleName: '超级管理员',
      status: 'active',
      lastLogin: '2025-04-18 09:30:15',
    },
    {
      id: '2',
      name: '李四',
      email: 'lisi@example.com',
      department: '销售部',
      position: '销售经理',
      role: 'manager',
      roleId: '2',
      roleName: '部门经理',
      status: 'active',
      lastLogin: '2025-04-18 08:45:22',
    },
    {
      id: '3',
      name: '王五',
      email: 'wangwu@example.com',
      department: '人事部',
      position: 'HR专员',
      role: 'manager',
      roleId: '3',
      roleName: 'HR专员',
      status: 'active',
      lastLogin: '2025-04-18 09:10:08',
    },
    {
      id: '4',
      name: '赵六',
      email: 'zhaoliu@example.com',
      department: '技术部',
      position: '前端开发工程师',
      role: 'employee',
      roleId: '4',
      roleName: '普通员工',
      status: 'active',
      lastLogin: '2025-04-18 09:00:33',
    },
  ]);

  // 审计日志数据
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: '1',
      userId: '1',
      userName: '张三',
      action: 'modify',
      resourceType: 'permission',
      resourceId: '2',
      resourceName: '部门经理',
      details: '修改了"部门经理"角色的请假审批权限',
      ip: '192.168.1.100',
      timestamp: '2025-04-18 14:30:22',
    },
    {
      id: '2',
      userId: '1',
      userName: '张三',
      action: 'grant',
      resourceType: 'user',
      resourceId: '4',
      resourceName: '赵六',
      details: '为用户"赵六"分配了"普通员工"角色',
      ip: '192.168.1.100',
      timestamp: '2025-04-18 11:20:15',
    },
    {
      id: '3',
      userId: '2',
      userName: '李四',
      action: 'modify',
      resourceType: 'role',
      resourceId: '2',
      resourceName: '部门经理',
      details: '修改了"部门经理"角色的绩效管理权限',
      ip: '192.168.1.105',
      timestamp: '2025-04-17 16:45:30',
    },
  ]);

  // 弹窗状态
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // 权限级别映射
  const levelMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    admin: { label: '管理员', color: 'bg-red-100 text-red-800', icon: <Crown className="h-4 w-4" /> },
    manager: { label: '管理者', color: 'bg-purple-100 text-purple-800', icon: <Star className="h-4 w-4" /> },
    employee: { label: '员工', color: 'bg-blue-100 text-blue-800', icon: <Users className="h-4 w-4" /> },
    viewer: { label: '访客', color: 'bg-gray-100 text-gray-800', icon: <Eye className="h-4 w-4" /> },
  };

  // 权限级别映射
  const permissionLevelMap: Record<string, string> = {
    read: '只读',
    write: '编辑',
    delete: '删除',
    approve: '审批',
  };

  // 模块名称映射
  const moduleMap: Record<keyof ModulePermissions, string> = {
    employee: '员工管理',
    attendance: '考勤管理',
    leave: '请假管理',
    performance: '绩效管理',
    recruitment: '招聘管理',
    training: '培训管理',
    compensation: '薪酬管理',
    settings: '系统设置',
    reports: '报表分析',
  };

  // 操作类型映射
  const actionMap: Record<string, { label: string; color: string }> = {
    grant: { label: '授予', color: 'bg-green-100 text-green-800' },
    revoke: { label: '撤销', color: 'bg-red-100 text-red-800' },
    modify: { label: '修改', color: 'bg-yellow-100 text-yellow-800' },
    delete: { label: '删除', color: 'bg-red-100 text-red-800' },
  };

  // 过滤角色
  const filteredRoles = roles.filter(role => {
    const matchSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       role.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLevel = levelFilter === 'all' || role.level === levelFilter;
    return matchSearch && matchLevel;
  });

  // 获取权限徽章
  const getPermissionBadge = (permission: ModulePermission) => {
    const badges: Record<ModulePermission, { variant: 'default' | 'secondary' | 'outline'; text: string }> = {
      read: { variant: 'secondary', text: '只读' },
      write: { variant: 'default', text: '编辑' },
      delete: { variant: 'default', text: '删除' },
      approve: { variant: 'default', text: '审批' },
    };
    const badge = badges[permission];
    return <Badge variant={badge.variant}>{badge.text}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">高级权限管理</h1>
          <p className="text-gray-600 mt-2">
            企业级权限控制，精细化管理用户权限
            <Badge variant="secondary" className="ml-2">企业版功能</Badge>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
          <Button onClick={() => {
            setSelectedRole(null);
            setRoleDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            创建角色
          </Button>
        </div>
      </div>

      {/* 功能介绍 */}
      <Alert>
        <Zap className="h-4 w-4" />
        <AlertDescription>
          高级权限管理提供细粒度的权限控制，支持角色继承、动态权限分配和完整的审计日志追踪，确保系统安全和数据保护。
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="roles">角色管理</TabsTrigger>
          <TabsTrigger value="users">角色用户</TabsTrigger>
          <TabsTrigger value="permissions">权限配置</TabsTrigger>
          <TabsTrigger value="audit">审计日志</TabsTrigger>
        </TabsList>

        {/* 角色管理Tab */}
        <TabsContent value="roles" className="space-y-6">
          {/* 筛选栏 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索角色名称或编码"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="级别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部级别</SelectItem>
                  <SelectItem value="admin">管理员</SelectItem>
                  <SelectItem value="manager">管理者</SelectItem>
                  <SelectItem value="employee">员工</SelectItem>
                  <SelectItem value="viewer">访客</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 角色卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRoles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-base">{role.name}</CardTitle>
                        {role.isSystem && (
                          <Badge variant="secondary" className="text-xs">系统角色</Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs">{role.code}</CardDescription>
                    </div>
                    {levelMap[role.level].icon}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-2">{role.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge className={levelMap[role.level].color}>
                      {levelMap[role.level].label}
                    </Badge>
                    <Badge variant="outline">{role.userCount} 用户</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                    <div className="text-center">
                      <div className="text-sm font-bold text-blue-600">
                        {Object.values(role.permissions).filter(p => p === 'read').length}
                      </div>
                      <div className="text-xs text-gray-600">只读</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-green-600">
                        {Object.values(role.permissions).filter(p => p === 'write').length}
                      </div>
                      <div className="text-xs text-gray-600">编辑</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-red-600">
                        {Object.values(role.permissions).filter(p => p === 'delete' || p === 'approve').length}
                      </div>
                      <div className="text-xs text-gray-600">高级</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedRole(role);
                        setRoleDialogOpen(true);
                      }}>
                        <Edit className="h-4 w-4 mr-1" />
                        编辑
                      </Button>
                      {!role.isSystem && (
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4 mr-1" />
                          复制
                        </Button>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 角色用户Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>角色用户</CardTitle>
              <CardDescription>查看和管理各角色的用户分配</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>用户</TableHead>
                    <TableHead>部门</TableHead>
                    <TableHead>职位</TableHead>
                    <TableHead>角色</TableHead>
                    <TableHead>级别</TableHead>
                    <TableHead>最后登录</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roleUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-gray-600">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{user.position}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.roleName}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={levelMap[user.role].color}>
                          {levelMap[user.role].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{user.lastLogin || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status === 'active' ? '活跃' : '停用'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 权限配置Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>权限矩阵</CardTitle>
              <CardDescription>配置各角色在不同模块的权限级别</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-48">角色</TableHead>
                      {Object.keys(moduleMap).map((module) => (
                        <TableHead key={module} className="min-w-24">{moduleMap[module as keyof typeof moduleMap]}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {levelMap[role.level].icon}
                            <span className="font-medium">{role.name}</span>
                            {role.isSystem && <Badge variant="secondary" className="text-xs">系统</Badge>}
                          </div>
                        </TableCell>
                        {Object.entries(role.permissions).map(([module, permission]) => (
                          <TableCell key={module}>
                            {getPermissionBadge(permission)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 审计日志Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>审计日志</CardTitle>
              <CardDescription>追踪所有权限变更操作</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${actionMap[log.action].color}`}>
                      <Shield className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{log.userName}</span>
                          <Badge className={actionMap[log.action].color}>{actionMap[log.action].label}</Badge>
                          <span className="text-sm text-gray-600">{log.resourceName}</span>
                        </div>
                        <span className="text-sm text-gray-600">{log.timestamp}</span>
                      </div>
                      <div className="text-sm text-gray-600">{log.details}</div>
                      <div className="text-xs text-gray-500 mt-1">IP: {log.ip}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
