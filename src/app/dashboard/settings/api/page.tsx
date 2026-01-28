'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Key,
  Plus,
  Copy,
  Trash2,
  RefreshCw,
  Shield,
  Save,
  CheckCircle,
  Eye,
  EyeOff,
  Zap,
  Globe,
} from 'lucide-react';
import { toast } from 'sonner';

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  status: 'active' | 'expired' | 'revoked';
  createdAt: string;
  lastUsed: string;
  expiresAt: string;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  status: 'active' | 'disabled';
  createdAt: string;
  lastTriggered: string;
}

export default function SettingsAPIPage() {
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: '生产环境密钥',
      key: 'pk_live_51NhxVz2eQ3y7X8pF9K2L5M4N6O7P8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4G5H6',
      permissions: ['read', 'write', 'delete'],
      status: 'active',
      createdAt: '2024-01-15',
      lastUsed: '2024-12-15',
      expiresAt: '2025-01-15',
    },
    {
      id: '2',
      name: '开发环境密钥',
      key: 'pk_test_51NhxVz2eQ3y7X8pF9K2L5M4N6O7P8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4G5H6',
      permissions: ['read', 'write'],
      status: 'active',
      createdAt: '2024-06-01',
      lastUsed: '2024-12-14',
      expiresAt: '2025-06-01',
    },
  ]);

  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: '1',
      name: '员工入职通知',
      url: 'https://example.com/webhooks/employee-onboarding',
      events: ['employee.created', 'employee.updated'],
      secret: 'whsec_abc123def456ghi789',
      status: 'active',
      createdAt: '2024-01-15',
      lastTriggered: '2024-12-15',
    },
    {
      id: '2',
      name: '审批流程通知',
      url: 'https://example.com/webhooks/approval',
      events: ['approval.created', 'approval.completed'],
      secret: 'whsec_xyz789uvw456rst123',
      status: 'active',
      createdAt: '2024-03-01',
      lastTriggered: '2024-12-10',
    },
  ]);

  const [newKeyForm, setNewKeyForm] = useState({
    name: '',
    permissions: [] as string[],
    expiresIn: '30',
  });

  const handleCopyKey = async (key: string) => {
    await navigator.clipboard.writeText(key);
    toast.success('已复制到剪贴板');
  };

  const handleToggleKey = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleSecret = (id: string) => {
    setShowSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRevokeKey = async (id: string) => {
    setApiKeys(prev => prev.map(key =>
      key.id === id ? { ...key, status: 'revoked' as const } : key
    ));
    toast.success('API密钥已撤销');
  };

  const handleRefreshKey = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('API密钥已刷新');
  };

  const handleCreateKey = async () => {
    setCreating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const newKey: APIKey = {
      id: Date.now().toString(),
      name: newKeyForm.name,
      key: `pk_live_${Math.random().toString(36).substring(2, 50)}`,
      permissions: newKeyForm.permissions,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + parseInt(newKeyForm.expiresIn) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    setApiKeys(prev => [newKey, ...prev]);
    setNewKeyForm({ name: '', permissions: [], expiresIn: '30' });
    setCreating(false);
    toast.success('API密钥已创建');
  };

  const handleDeleteWebhook = async (id: string) => {
    setWebhooks(prev => prev.filter(h => h.id !== id));
    toast.success('Webhook已删除');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: { label: '启用', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
      expired: { label: '过期', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
      revoked: { label: '已撤销', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
      disabled: { label: '禁用', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
    };
    const variant = variants[status] || variants.active;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Key className="h-8 w-8 text-blue-600" />
              API 管理
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              管理 API 密钥和 Webhook 配置
            </p>
          </div>
          <Button onClick={() => document.getElementById('new-key-section')?.scrollIntoView({ behavior: 'smooth' })} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            创建API密钥
          </Button>
        </div>

        <Tabs defaultValue="api-keys" className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="api-keys" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API 密钥
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="docs" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              API 文档
            </TabsTrigger>
          </TabsList>

          {/* API 密钥 */}
          <TabsContent value="api-keys" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-blue-600" />
                  API 密钥管理
                </CardTitle>
                <CardDescription>
                  使用 API 密钥访问 PulseOpti HR 的所有功能
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{apiKey.name}</h3>
                            {getStatusBadge(apiKey.status)}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">密钥：</span>
                              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm flex-1">
                                {showKeys[apiKey.id] ? apiKey.key : '••••••••••••••••••••••••••••••••'}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopyKey(apiKey.key)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleKey(apiKey.id)}
                              >
                                {showKeys[apiKey.id] ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {apiKey.permissions.map((perm) => (
                                <Badge key={perm} variant="outline" className="text-xs">
                                  {perm}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              创建时间：{apiKey.createdAt} • 最后使用：{apiKey.lastUsed} • 过期时间：{apiKey.expiresAt}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {apiKey.status === 'active' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRefreshKey(apiKey.id)}
                              >
                                <RefreshCw className="h-4 w-4 mr-1" />
                                刷新
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRevokeKey(apiKey.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                撤销
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 创建新密钥 */}
            <Card id="new-key-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-green-600" />
                  创建新的 API 密钥
                </CardTitle>
                <CardDescription>
                  生成新的 API 密钥以访问系统功能
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>密钥名称</Label>
                      <Input
                        value={newKeyForm.name}
                        onChange={(e) => setNewKeyForm({ ...newKeyForm, name: e.target.value })}
                        placeholder="例如：生产环境密钥"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>过期天数</Label>
                      <Input
                        type="number"
                        value={newKeyForm.expiresIn}
                        onChange={(e) => setNewKeyForm({ ...newKeyForm, expiresIn: e.target.value })}
                        placeholder="30"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>权限</Label>
                    <div className="flex flex-wrap gap-2">
                      {['read', 'write', 'delete'].map((perm) => (
                        <Button
                          key={perm}
                          variant={newKeyForm.permissions.includes(perm) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            if (newKeyForm.permissions.includes(perm)) {
                              setNewKeyForm({
                                ...newKeyForm,
                                permissions: newKeyForm.permissions.filter(p => p !== perm)
                              });
                            } else {
                              setNewKeyForm({
                                ...newKeyForm,
                                permissions: [...newKeyForm.permissions, perm]
                              });
                            }
                          }}
                        >
                          {perm}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleCreateKey}
                    disabled={!newKeyForm.name || newKeyForm.permissions.length === 0 || creating}
                    className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                  >
                    {creating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        创建中...
                      </>
                    ) : (
                      <>
                        <Key className="h-4 w-4 mr-2" />
                        创建密钥
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Webhooks */}
          <TabsContent value="webhooks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-600" />
                  Webhook 管理
                </CardTitle>
                <CardDescription>
                  配置 Webhook 以接收系统事件通知
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {webhooks.map((webhook) => (
                    <div key={webhook.id} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{webhook.name}</h3>
                            {getStatusBadge(webhook.status)}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">URL：</span>
                              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                                {webhook.url}
                              </code>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Secret：</span>
                              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                                {showSecrets[webhook.id] ? webhook.secret : '•••••••••••••••••'}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleSecret(webhook.id)}
                              >
                                {showSecrets[webhook.id] ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {webhook.events.map((event) => (
                                <Badge key={event} variant="outline" className="text-xs">
                                  {event}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              创建时间：{webhook.createdAt} • 最后触发：{webhook.lastTriggered}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Zap className="h-4 w-4 mr-1" />
                            测试
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteWebhook(webhook.id)}>
                            <Trash2 className="h-4 w-4 mr-1" />
                            删除
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 border rounded-lg border-dashed border-gray-300 dark:border-gray-700">
                  <div className="text-center text-gray-600 dark:text-gray-400">
                    <Globe className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="font-medium mb-1">添加新的 Webhook</p>
                    <p className="text-sm">配置 Webhook 以接收系统事件通知</p>
                    <Button className="mt-4" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      添加 Webhook
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API 文档 */}
          <TabsContent value="docs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API 文档</CardTitle>
                <CardDescription>快速开始使用 PulseOpti HR API</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold">认证方式</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      所有 API 请求需要在请求头中包含 API 密钥
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <code className="text-sm">
                        Authorization: Bearer YOUR_API_KEY
                      </code>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">基础 URL</h3>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <code className="text-sm">
                        https://api.pulseopti.com/v1
                      </code>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">请求示例</h3>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <pre className="text-sm overflow-x-auto">
{`curl -X GET https://api.pulseopti.com/v1/employees \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                      </pre>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">主要接口</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">GET</Badge>
                        <code className="text-sm">/employees</code>
                        <span className="text-sm text-gray-600 dark:text-gray-400">获取员工列表</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">POST</Badge>
                        <code className="text-sm">/employees</code>
                        <span className="text-sm text-gray-600 dark:text-gray-400">创建新员工</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">GET</Badge>
                        <code className="text-sm">/departments</code>
                        <span className="text-sm text-gray-600 dark:text-gray-400">获取部门列表</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">POST</Badge>
                        <code className="text-sm">/approvals</code>
                        <span className="text-sm text-gray-600 dark:text-gray-400">发起审批</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    查看完整文档
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 提示信息 */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  安全提示
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  API 密钥具有系统访问权限，请妥善保管。建议定期更换密钥，使用最小权限原则，
                  不要在客户端代码中暴露密钥。如果密钥泄露，请立即撤销并创建新的密钥。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BookOpen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
