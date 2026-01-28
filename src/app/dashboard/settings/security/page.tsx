'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Shield,
  Lock,
  Key,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
  AlertTriangle,
  User,
  History,
  Smartphone,
  Globe,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

interface SecuritySettings {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    passwordExpiry: number;
  };
  sessionSettings: {
    sessionTimeout: number;
    maxConcurrentSessions: number;
    rememberMeDuration: number;
  };
  twoFactorAuth: {
    enabled: boolean;
    method: 'sms' | 'email' | 'app' | 'none';
  };
  loginSecurity: {
    maxFailedAttempts: number;
    lockoutDuration: number;
    notifyOnFailedLogin: boolean;
  };
  ipWhitelist: {
    enabled: boolean;
    ipList: string[];
  };
}

interface LoginHistory {
  id: string;
  timestamp: string;
  ip: string;
  location: string;
  device: string;
  status: 'success' | 'failed';
}

export default function SettingsSecurityPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [settings, setSettings] = useState<SecuritySettings>({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      passwordExpiry: 90,
    },
    sessionSettings: {
      sessionTimeout: 30,
      maxConcurrentSessions: 3,
      rememberMeDuration: 7,
    },
    twoFactorAuth: {
      enabled: false,
      method: 'none',
    },
    loginSecurity: {
      maxFailedAttempts: 5,
      lockoutDuration: 30,
      notifyOnFailedLogin: true,
    },
    ipWhitelist: {
      enabled: false,
      ipList: ['192.168.1.0/24', '10.0.0.0/8'],
    },
  });

  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([
    {
      id: '1',
      timestamp: '2024-12-15 14:32:00',
      ip: '192.168.1.100',
      location: '北京市朝阳区',
      device: 'Chrome / Windows',
      status: 'success',
    },
    {
      id: '2',
      timestamp: '2024-12-15 10:15:00',
      ip: '192.168.1.100',
      location: '北京市朝阳区',
      device: 'Chrome / Windows',
      status: 'success',
    },
    {
      id: '3',
      timestamp: '2024-12-14 23:45:00',
      ip: '192.168.1.200',
      location: '上海市浦东新区',
      device: 'Safari / iOS',
      status: 'failed',
    },
    {
      id: '4',
      timestamp: '2024-12-14 09:20:00',
      ip: '192.168.1.100',
      location: '北京市朝阳区',
      device: 'Chrome / Windows',
      status: 'success',
    },
  ]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success('安全设置已保存');
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    toast.success('密码已修改成功');
  };

  const handleClearHistory = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success('登录历史已清除');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              安全设置
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              配置账户安全和访问控制
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                保存设置
              </>
            )}
          </Button>
        </div>

        {/* 密码策略 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-600" />
              密码策略
            </CardTitle>
            <CardDescription>配置密码复杂度要求和过期策略</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>最小长度</Label>
                <Input
                  type="number"
                  value={settings.passwordPolicy.minLength}
                  onChange={(e) => setSettings({
                    ...settings,
                    passwordPolicy: { ...settings.passwordPolicy, minLength: parseInt(e.target.value) }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label>密码有效期（天）</Label>
                <Input
                  type="number"
                  value={settings.passwordPolicy.passwordExpiry}
                  onChange={(e) => setSettings({
                    ...settings,
                    passwordPolicy: { ...settings.passwordPolicy, passwordExpiry: parseInt(e.target.value) }
                  })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">要求大写字母</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">密码必须包含至少一个大写字母</p>
                </div>
                <Switch
                  checked={settings.passwordPolicy.requireUppercase}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    passwordPolicy: { ...settings.passwordPolicy, requireUppercase: checked }
                  })}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">要求小写字母</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">密码必须包含至少一个小写字母</p>
                </div>
                <Switch
                  checked={settings.passwordPolicy.requireLowercase}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    passwordPolicy: { ...settings.passwordPolicy, requireLowercase: checked }
                  })}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">要求数字</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">密码必须包含至少一个数字</p>
                </div>
                <Switch
                  checked={settings.passwordPolicy.requireNumbers}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    passwordPolicy: { ...settings.passwordPolicy, requireNumbers: checked }
                  })}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">要求特殊字符</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">密码必须包含至少一个特殊字符</p>
                </div>
                <Switch
                  checked={settings.passwordPolicy.requireSpecialChars}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    passwordPolicy: { ...settings.passwordPolicy, requireSpecialChars: checked }
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 修改密码 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-purple-600" />
              修改密码
            </CardTitle>
            <CardDescription>修改当前账户的登录密码</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>当前密码</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="输入当前密码"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>新密码</Label>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="输入新密码"
              />
            </div>

            <div className="space-y-2">
              <Label>确认新密码</Label>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="再次输入新密码"
              />
            </div>

            <Button onClick={handlePasswordChange} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Key className="h-4 w-4 mr-2" />
              修改密码
            </Button>
          </CardContent>
        </Card>

        {/* 会话设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              会话设置
            </CardTitle>
            <CardDescription>配置会话超时和并发会话限制</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>会话超时（分钟）</Label>
                <Input
                  type="number"
                  value={settings.sessionSettings.sessionTimeout}
                  onChange={(e) => setSettings({
                    ...settings,
                    sessionSettings: { ...settings.sessionSettings, sessionTimeout: parseInt(e.target.value) }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label>最大并发会话数</Label>
                <Input
                  type="number"
                  value={settings.sessionSettings.maxConcurrentSessions}
                  onChange={(e) => setSettings({
                    ...settings,
                    sessionSettings: { ...settings.sessionSettings, maxConcurrentSessions: parseInt(e.target.value) }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label>记住我时长（天）</Label>
                <Input
                  type="number"
                  value={settings.sessionSettings.rememberMeDuration}
                  onChange={(e) => setSettings({
                    ...settings,
                    sessionSettings: { ...settings.sessionSettings, rememberMeDuration: parseInt(e.target.value) }
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 双因素认证 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>双因素认证</CardTitle>
                  <CardDescription>增强账户安全性，防止未授权访问</CardDescription>
                </div>
              </div>
              <Switch
                checked={settings.twoFactorAuth.enabled}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  twoFactorAuth: { ...settings.twoFactorAuth, enabled: checked, method: checked ? 'app' : 'none' }
                })}
              />
            </div>
          </CardHeader>
          {settings.twoFactorAuth.enabled && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>认证方式</Label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                    value={settings.twoFactorAuth.method}
                    onChange={(e) => setSettings({
                      ...settings,
                      twoFactorAuth: { ...settings.twoFactorAuth, method: e.target.value as any }
                    })}
                  >
                    <option value="app">认证器应用</option>
                    <option value="sms">短信验证码</option>
                    <option value="email">邮箱验证码</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm mb-1">双因素认证已启用</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      每次登录时，您需要输入额外的验证码来验证身份。
                      这可以显著提高账户安全性。
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* 登录安全 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              登录安全
            </CardTitle>
            <CardDescription>配置登录失败处理和安全通知</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>最大失败尝试次数</Label>
                <Input
                  type="number"
                  value={settings.loginSecurity.maxFailedAttempts}
                  onChange={(e) => setSettings({
                    ...settings,
                    loginSecurity: { ...settings.loginSecurity, maxFailedAttempts: parseInt(e.target.value) }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label>锁定时长（分钟）</Label>
                <Input
                  type="number"
                  value={settings.loginSecurity.lockoutDuration}
                  onChange={(e) => setSettings({
                    ...settings,
                    loginSecurity: { ...settings.loginSecurity, lockoutDuration: parseInt(e.target.value) }
                  })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">登录失败通知</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">当检测到多次失败登录时发送通知</p>
              </div>
              <Switch
                checked={settings.loginSecurity.notifyOnFailedLogin}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  loginSecurity: { ...settings.loginSecurity, notifyOnFailedLogin: checked }
                })}
              />
            </div>
          </CardContent>
        </Card>

        {/* IP白名单 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Globe className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle>IP白名单</CardTitle>
                  <CardDescription>限制只允许特定IP地址访问</CardDescription>
                </div>
              </div>
              <Switch
                checked={settings.ipWhitelist.enabled}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  ipWhitelist: { ...settings.ipWhitelist, enabled: checked }
                })}
              />
            </div>
          </CardHeader>
          {settings.ipWhitelist.enabled && (
            <CardContent>
              <div className="space-y-2">
                <Label>IP地址列表</Label>
                <Textarea
                  value={settings.ipWhitelist.ipList.join('\n')}
                  onChange={(e) => setSettings({
                    ...settings,
                    ipWhitelist: {
                      ...settings.ipWhitelist,
                      ipList: e.target.value.split('\n').filter(ip => ip.trim())
                    }
                  })}
                  placeholder="每行一个IP地址或IP段&#10;192.168.1.0/24&#10;10.0.0.0/8"
                  rows={5}
                />
              </div>
            </CardContent>
          )}
        </Card>

        {/* 登录历史 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <History className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle>登录历史</CardTitle>
                  <CardDescription>查看最近的登录记录</CardDescription>
                </div>
              </div>
              <Button variant="outline" onClick={handleClearHistory}>
                清除历史
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loginHistory.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Badge variant={record.status === 'success' ? 'default' : 'destructive'}>
                        {record.status === 'success' ? '成功' : '失败'}
                      </Badge>
                      <span className="font-medium">{record.ip}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{record.location}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {record.device} • {record.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 安全提示 */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  安全建议
                </h3>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                  <li>定期修改密码，使用强密码</li>
                  <li>启用双因素认证以增强安全性</li>
                  <li>不要在不安全的网络环境下登录</li>
                  <li>定期查看登录历史，及时发现异常</li>
                  <li>如发现异常登录，立即修改密码并联系管理员</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
