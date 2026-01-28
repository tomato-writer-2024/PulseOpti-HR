'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Zap,
  Plus,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  Code,
  CheckCircle,
  XCircle,
  TrendingUp,
  Shield,
  Book,
  Globe,
  Lock,
  Unlock,
  Clock,
  AlertCircle,
  Download,
  FileText,
  Search,
  Filter,
  Key,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  permissions: string[];
  createdAt: string;
  lastUsed?: string;
  status: 'active' | 'inactive' | 'revoked';
  requests: number;
  rateLimit: number;
}

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  category: string;
  version: string;
  auth: boolean;
}

interface ApiUsage {
  date: string;
  requests: number;
  errors: number;
  avgLatency: number;
}

export default function ApiPlatformPage() {
  const [activeTab, setActiveTab] = useState('keys');
  const [showCreateKeyDialog, setShowCreateKeyDialog] = useState(false);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: '生产环境API Key',
      key: 'pk_live_51KzXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      prefix: 'pk_live_',
      permissions: ['all'],
      createdAt: '2024-01-15',
      lastUsed: '2024-12-15 14:30',
      status: 'active',
      requests: 125430,
      rateLimit: 10000,
    },
    {
      id: '2',
      name: '测试环境API Key',
      key: 'pk_test_51KzXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      prefix: 'pk_test_',
      permissions: ['employees.read', 'performance.read'],
      createdAt: '2024-03-01',
      lastUsed: '2024-12-15 10:20',
      status: 'active',
      requests: 45678,
      rateLimit: 1000,
    },
    {
      id: '3',
      name: '只读API Key',
      key: 'pk_read_51KzXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      prefix: 'pk_read_',
      permissions: ['read'],
      createdAt: '2024-06-01',
      lastUsed: '2024-12-14 16:45',
      status: 'active',
      requests: 1256,
      rateLimit: 500,
    },
  ]);

  const [endpoints] = useState<ApiEndpoint[]>([
    // 员工管理
    { id: 'e1', method: 'GET', path: '/api/v1/employees', description: '获取员工列表', category: '员工管理', version: 'v1', auth: true },
    { id: 'e2', method: 'POST', path: '/api/v1/employees', description: '创建员工', category: '员工管理', version: 'v1', auth: true },
    { id: 'e3', method: 'GET', path: '/api/v1/employees/{id}', description: '获取员工详情', category: '员工管理', version: 'v1', auth: true },
    { id: 'e4', method: 'PUT', path: '/api/v1/employees/{id}', description: '更新员工信息', category: '员工管理', version: 'v1', auth: true },
    // 绩效管理
    { id: 'e5', method: 'GET', path: '/api/v1/performance/goals', description: '获取绩效目标', category: '绩效管理', version: 'v1', auth: true },
    { id: 'e6', method: 'POST', path: '/api/v1/performance/assessments', description: '创建绩效评估', category: '绩效管理', version: 'v1', auth: true },
    // 薪酬管理
    { id: 'e7', method: 'GET', path: '/api/v1/payroll', description: '获取薪酬数据', category: '薪酬管理', version: 'v1', auth: true },
    { id: 'e8', method: 'POST', path: '/api/v1/payroll/calculate', description: '计算薪酬', category: '薪酬管理', version: 'v1', auth: true },
    // 考勤管理
    { id: 'e9', method: 'GET', path: '/api/v1/attendance', description: '获取考勤记录', category: '考勤管理', version: 'v1', auth: true },
    { id: 'e10', method: 'POST', path: '/api/v1/attendance/clock-in', description: '打卡', category: '考勤管理', version: 'v1', auth: true },
    // 组织架构
    { id: 'e11', method: 'GET', path: '/api/v1/organization', description: '获取组织架构', category: '组织管理', version: 'v1', auth: true },
    { id: 'e12', method: 'GET', path: '/api/v1/departments', description: '获取部门列表', category: '组织管理', version: 'v1', auth: true },
    // 数据分析
    { id: 'e13', method: 'GET', path: '/api/v1/analytics/hr-metrics', description: '获取HR指标', category: '数据分析', version: 'v1', auth: true },
    { id: 'e14', method: 'GET', path: '/api/v1/analytics/efficiency', description: '获取人效数据', category: '数据分析', version: 'v1', auth: true },
  ]);

  const [usage] = useState<ApiUsage[]>([
    { date: '2024-12-09', requests: 4200, errors: 12, avgLatency: 85 },
    { date: '2024-12-10', requests: 4500, errors: 15, avgLatency: 82 },
    { date: '2024-12-11', requests: 3800, errors: 8, avgLatency: 90 },
    { date: '2024-12-12', requests: 5100, errors: 10, avgLatency: 78 },
    { date: '2024-12-13', requests: 4800, errors: 14, avgLatency: 80 },
    { date: '2024-12-14', requests: 5200, errors: 9, avgLatency: 75 },
    { date: '2024-12-15', requests: 5600, errors: 11, avgLatency: 72 },
  ]);

  const [keyFormData, setKeyFormData] = useState({
    name: '',
    permissions: 'read',
    rateLimit: '1000',
  });

  const stats = {
    totalKeys: apiKeys.length,
    activeKeys: apiKeys.filter(k => k.status === 'active').length,
    totalRequests: apiKeys.reduce((sum, k) => sum + k.requests, 0),
    totalEndpoints: endpoints.length,
    avgLatency: Math.round(usage.reduce((sum, u) => sum + u.avgLatency, 0) / usage.length),
    errorRate: ((usage.reduce((sum, u) => sum + u.errors, 0) / usage.reduce((sum, u) => sum + u.requests, 0)) * 100).toFixed(2),
  };

  const filteredEndpoints = endpoints.filter(ep => {
    const matchesSearch = ep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ep.path.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: { label: '活跃', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      inactive: { label: '停用', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
      revoked: { label: '已吊销', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    };
    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getMethodBadge = (method: string) => {
    const variants: Record<string, any> = {
      GET: { label: 'GET', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      POST: { label: 'POST', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      PUT: { label: 'PUT', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      DELETE: { label: 'DELETE', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    };
    const variant = variants[method];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API Key已复制到剪贴板');
  };

  const handleToggleKeyVisibility = (keyId: string) => {
    setShowKey(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const handleCreateKey = () => {
    if (!keyFormData.name) {
      toast.error('请填写API Key名称');
      return;
    }

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: keyFormData.name,
      key: `pk_${keyFormData.permissions}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      prefix: `pk_${keyFormData.permissions}_`,
      permissions: [keyFormData.permissions],
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
      requests: 0,
      rateLimit: Number(keyFormData.rateLimit),
    };

    setApiKeys([...apiKeys, newKey]);
    setShowCreateKeyDialog(false);
    setKeyFormData({ name: '', permissions: 'read', rateLimit: '1000' });
    toast.success('API Key创建成功');
  };

  const handleRevokeKey = (keyId: string) => {
    setApiKeys(apiKeys.map(key =>
      key.id === keyId ? { ...key, status: 'revoked' } : key
    ));
    toast.success('API Key已吊销');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                <Zap className="h-7 w-7 text-white" />
              </div>
              API开放平台
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              完整的REST API接口，支持自定义开发与系统集成
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white border-0">
              <Zap className="h-3 w-3 mr-1" />
              PRO功能
            </Badge>
            <Button variant="outline">
              <Book className="h-4 w-4 mr-2" />
              API文档
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">API Key总数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalKeys}</div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                <Key className="h-3 w-3 mr-1" />
                个
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">活跃Key</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.activeKeys}</div>
              <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                个
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">API接口总数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalEndpoints}</div>
              <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mt-1">
                <Code className="h-3 w-3 mr-1" />
                个
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">总请求数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {(stats.totalRequests / 1000).toFixed(0)}K
              </div>
              <div className="flex items-center text-xs text-purple-600 dark:text-purple-400 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                次
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">平均延迟</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.avgLatency}ms
              </div>
              <div className="flex items-center text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                <Clock className="h-3 w-3 mr-1" />
                响应
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">错误率</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.errorRate}%</div>
              <div className="flex items-center text-xs text-red-600 dark:text-red-400 mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                低
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 功能Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="keys" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API密钥
            </TabsTrigger>
            <TabsTrigger value="endpoints" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              接口文档
            </TabsTrigger>
            <TabsTrigger value="usage" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              使用统计
            </TabsTrigger>
            <TabsTrigger value="quickstart" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              快速开始
            </TabsTrigger>
          </TabsList>

          {/* API密钥 */}
          <TabsContent value="keys" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>API密钥管理</CardTitle>
                    <CardDescription>创建和管理API密钥，控制访问权限</CardDescription>
                  </div>
                  <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                    <Plus className="h-4 w-4 mr-2" />
                    创建密钥
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <Card key={apiKey.id} className="hover:shadow-md transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {apiKey.name}
                              </h3>
                              {getStatusBadge(apiKey.status)}
                            </div>
                            <div className="text-xs text-gray-500">
                              创建于: {apiKey.createdAt}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {apiKey.status === 'active' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRevokeKey(apiKey.id)}
                              >
                                <RefreshCw className="h-4 w-4 mr-1" />
                                重置
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRevokeKey(apiKey.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div className="flex items-center justify-between">
                              <code className="text-sm font-mono text-gray-900 dark:text-white">
                                {showKey[apiKey.id] ? apiKey.key : `${apiKey.prefix}•••••••••••••••••••••••••••`}
                              </code>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleKeyVisibility(apiKey.id)}
                                >
                                  {showKey[apiKey.id] ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopyKey(apiKey.key)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="text-gray-600 dark:text-gray-400">权限</div>
                              <div className="font-medium">{apiKey.permissions.join(', ')}</div>
                            </div>
                            <div>
                              <div className="text-gray-600 dark:text-gray-400">请求次数</div>
                              <div className="font-medium">{apiKey.requests.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-gray-600 dark:text-gray-400">最后使用</div>
                              <div className="font-medium">{apiKey.lastUsed || '-'}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 接口文档 */}
          <TabsContent value="endpoints" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>API接口文档</CardTitle>
                    <CardDescription>所有可用的API接口</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="搜索接口..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border dark:border-gray-700">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>方法</TableHead>
                        <TableHead>路径</TableHead>
                        <TableHead>描述</TableHead>
                        <TableHead>分类</TableHead>
                        <TableHead>版本</TableHead>
                        <TableHead>认证</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEndpoints.map((endpoint) => (
                        <TableRow key={endpoint.id}>
                          <TableCell>{getMethodBadge(endpoint.method)}</TableCell>
                          <TableCell>
                            <code className="text-sm font-mono">{endpoint.path}</code>
                          </TableCell>
                          <TableCell>{endpoint.description}</TableCell>
                          <TableCell>{endpoint.category}</TableCell>
                          <TableCell>{endpoint.version}</TableCell>
                          <TableCell>
                            {endpoint.auth ? (
                              <Badge variant="outline" className="text-xs">
                                <Lock className="h-3 w-3 mr-1" />
                                需认证
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                <Unlock className="h-3 w-3 mr-1" />
                                公开
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 使用统计 */}
          <TabsContent value="usage" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>最近7天请求量</CardTitle>
                  <CardDescription>API请求统计</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {usage.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{item.date}</span>
                            <span className="text-sm font-medium">{item.requests.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${(item.requests / Math.max(...usage.map(u => u.requests))) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API性能指标</CardTitle>
                  <CardDescription>延迟与错误率</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">平均响应时间</span>
                        <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                          {stats.avgLatency}ms
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-yellow-500"
                          style={{ width: `${(stats.avgLatency / 200) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">错误率</span>
                        <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                          {stats.errorRate}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-red-500"
                          style={{ width: `${parseFloat(stats.errorRate)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 快速开始 */}
          <TabsContent value="quickstart" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>快速开始</CardTitle>
                <CardDescription>5分钟快速集成API</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      1. 获取API Key
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      在"API密钥"标签页创建一个新的API Key，用于身份验证。
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      2. 发送第一个请求
                    </h3>
                    <div className="p-4 bg-gray-900 dark:bg-gray-950 rounded-lg overflow-x-auto">
                      <pre className="text-sm text-green-400">
{`curl -X GET \\
  https://api.pulseopti.com/api/v1/employees \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json'`}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      3. 处理响应
                    </h3>
                    <div className="p-4 bg-gray-900 dark:bg-gray-950 rounded-lg overflow-x-auto">
                      <pre className="text-sm text-blue-400">
{`{
  "success": true,
  "data": {
    "employees": [
      {
        "id": "EMP001",
        "name": "张三",
        "department": "产品部",
        "position": "产品经理"
      }
    ],
    "total": 1
  }
}`}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      4. 了解速率限制
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      每个API Key都有速率限制，默认为1000次/分钟。如需更高配额，请联系客服。
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      下载SDK
                    </Button>
                    <Button variant="outline">
                      <Globe className="h-4 w-4 mr-2" />
                      查看完整文档
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 创建API Key对话框 */}
        <Dialog open={showCreateKeyDialog} onOpenChange={setShowCreateKeyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>创建API密钥</DialogTitle>
              <DialogDescription>
                创建新的API密钥用于身份验证
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">密钥名称 *</Label>
                <Input
                  id="name"
                  value={keyFormData.name}
                  onChange={(e) => setKeyFormData({ ...keyFormData, name: e.target.value })}
                  placeholder="例如：生产环境密钥"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="permissions">权限级别</Label>
                <select
                  id="permissions"
                  value={keyFormData.permissions}
                  onChange={(e) => setKeyFormData({ ...keyFormData, permissions: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="read">只读权限</option>
                  <option value="write">读写权限</option>
                  <option value="all">完全权限</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rateLimit">速率限制（次/分钟）</Label>
                <Input
                  id="rateLimit"
                  type="number"
                  value={keyFormData.rateLimit}
                  onChange={(e) => setKeyFormData({ ...keyFormData, rateLimit: e.target.value })}
                  placeholder="1000"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateKeyDialog(false)}>取消</Button>
              <Button onClick={handleCreateKey}>创建密钥</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
