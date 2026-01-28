'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Save,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

interface NotificationConfig {
  email: {
    enabled: boolean;
    smtpServer: string;
    smtpPort: number;
    senderEmail: string;
    senderName: string;
    username: string;
    password: string;
  };
  sms: {
    enabled: boolean;
    provider: string;
    apiKey: string;
    signature: string;
  };
  push: {
    enabled: boolean;
    browser: boolean;
    mobile: boolean;
    sound: boolean;
  };
  system: {
    approval: boolean;
    deadline: boolean;
    task: boolean;
    announcement: boolean;
    security: boolean;
  };
}

export default function SettingsNotificationsPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<'email' | 'sms' | null>(null);

  const [config, setConfig] = useState<NotificationConfig>({
    email: {
      enabled: true,
      smtpServer: 'smtp.example.com',
      smtpPort: 587,
      senderEmail: 'hr@pulseopti.com',
      senderName: 'PulseOpti HR',
      username: 'hr@pulseopti.com',
      password: '******',
    },
    sms: {
      enabled: true,
      provider: '阿里云',
      apiKey: '****************',
      signature: '脉策聚效',
    },
    push: {
      enabled: true,
      browser: true,
      mobile: true,
      sound: true,
    },
    system: {
      approval: true,
      deadline: true,
      task: true,
      announcement: true,
      security: true,
    },
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success('通知设置已保存');
  };

  const handleTest = async (type: 'email' | 'sms') => {
    setTesting(type);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTesting(null);
    toast.success(`${type === 'email' ? '邮件' : '短信'}测试成功`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Bell className="h-8 w-8 text-blue-600" />
              通知设置
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              配置系统通知方式和渠道
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            {saving ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
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

        {/* 邮件通知 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>邮件通知</CardTitle>
                  <CardDescription>配置邮件服务器和发件人信息</CardDescription>
                </div>
              </div>
              <Switch
                checked={config.email.enabled}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  email: { ...config.email, enabled: checked }
                })}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>SMTP服务器</Label>
                <Input
                  value={config.email.smtpServer}
                  onChange={(e) => setConfig({
                    ...config,
                    email: { ...config.email, smtpServer: e.target.value }
                  })}
                  placeholder="smtp.example.com"
                />
              </div>

              <div className="space-y-2">
                <Label>SMTP端口</Label>
                <Input
                  type="number"
                  value={config.email.smtpPort}
                  onChange={(e) => setConfig({
                    ...config,
                    email: { ...config.email, smtpPort: parseInt(e.target.value) }
                  })}
                  placeholder="587"
                />
              </div>

              <div className="space-y-2">
                <Label>发件人邮箱</Label>
                <Input
                  value={config.email.senderEmail}
                  onChange={(e) => setConfig({
                    ...config,
                    email: { ...config.email, senderEmail: e.target.value }
                  })}
                  placeholder="hr@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label>发件人名称</Label>
                <Input
                  value={config.email.senderName}
                  onChange={(e) => setConfig({
                    ...config,
                    email: { ...config.email, senderName: e.target.value }
                  })}
                  placeholder="HR系统"
                />
              </div>

              <div className="space-y-2">
                <Label>用户名</Label>
                <Input
                  value={config.email.username}
                  onChange={(e) => setConfig({
                    ...config,
                    email: { ...config.email, username: e.target.value }
                  })}
                  placeholder="邮箱地址"
                />
              </div>

              <div className="space-y-2">
                <Label>密码</Label>
                <Input
                  type="password"
                  value={config.email.password}
                  onChange={(e) => setConfig({
                    ...config,
                    email: { ...config.email, password: e.target.value }
                  })}
                  placeholder="邮箱密码或授权码"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => handleTest('email')} disabled={testing === 'email'}>
                {testing === 'email' ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    测试中...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    发送测试邮件
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 短信通知 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle>短信通知</CardTitle>
                  <CardDescription>配置短信服务商和签名</CardDescription>
                </div>
              </div>
              <Switch
                checked={config.sms.enabled}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  sms: { ...config.sms, enabled: checked }
                })}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>服务商</Label>
                <Select
                  value={config.sms.provider}
                  onValueChange={(v) => setConfig({
                    ...config,
                    sms: { ...config.sms, provider: v }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="阿里云">阿里云</SelectItem>
                    <SelectItem value="腾讯云">腾讯云</SelectItem>
                    <SelectItem value="华为云">华为云</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>API Key</Label>
                <Input
                  value={config.sms.apiKey}
                  onChange={(e) => setConfig({
                    ...config,
                    sms: { ...config.sms, apiKey: e.target.value }
                  })}
                  placeholder="输入API密钥"
                />
              </div>

              <div className="space-y-2">
                <Label>短信签名</Label>
                <Input
                  value={config.sms.signature}
                  onChange={(e) => setConfig({
                    ...config,
                    sms: { ...config.sms, signature: e.target.value }
                  })}
                  placeholder="输入短信签名"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => handleTest('sms')} disabled={testing === 'sms'}>
                {testing === 'sms' ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    测试中...
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4 mr-2" />
                    发送测试短信
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 推送通知 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Bell className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle>推送通知</CardTitle>
                  <CardDescription>配置浏览器和移动端推送</CardDescription>
                </div>
              </div>
              <Switch
                checked={config.push.enabled}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  push: { ...config.push, enabled: checked }
                })}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
                  <Zap className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">浏览器推送</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">在网页浏览器中显示通知</p>
                </div>
              </div>
              <Switch
                checked={config.push.browser}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  push: { ...config.push, browser: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">
                  <Phone className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">移动端推送</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">在手机APP中显示通知</p>
                </div>
              </div>
              <Switch
                checked={config.push.mobile}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  push: { ...config.push, mobile: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded">
                  <Bell className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">通知声音</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">收到通知时播放提示音</p>
                </div>
              </div>
              <Switch
                checked={config.push.sound}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  push: { ...config.push, sound: checked }
                })}
              />
            </div>
          </CardContent>
        </Card>

        {/* 系统通知 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Settings className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle>系统通知类型</CardTitle>
                <CardDescription>选择需要接收的通知类型</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(config.system).map(([key, enabled]) => {
              const labels: Record<string, { name: string; description: string; icon: any }> = {
                approval: {
                  name: '审批通知',
                  description: '审批申请、审批结果',
                  icon: CheckCircle,
                },
                deadline: {
                  name: '截止提醒',
                  description: '任务截止、合同到期',
                  icon: Clock,
                },
                task: {
                  name: '任务通知',
                  description: '任务分配、任务更新',
                  icon: Settings,
                },
                announcement: {
                  name: '公告通知',
                  description: '公司公告、重要通知',
                  icon: Bell,
                },
                security: {
                  name: '安全通知',
                  description: '登录提醒、密码修改',
                  icon: AlertTriangle,
                },
              };

              const label = labels[key];
              const Icon = label.icon;

              return (
                <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                      <Icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{label.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{label.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={enabled}
                    onCheckedChange={(checked) => setConfig({
                      ...config,
                      system: { ...config.system, [key]: checked }
                    })}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* 提示信息 */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  提示
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  通知设置保存后立即生效。建议先进行测试，确保通知渠道正常工作后再启用。
                  部分通知（如安全通知）建议保持开启，以保障账户安全。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
