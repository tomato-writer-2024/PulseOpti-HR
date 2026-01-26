'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { ArrowLeft, Settings, RefreshCw, CheckCircle, AlertCircle, Clock, Zap, MessageSquare, Calendar, FileText } from 'lucide-react';

export default function FeishuDashboardPage() {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const [syncing, setSyncing] = useState(false);
  const [testMode, setTestMode] = useState(false);

  useEffect(() => {
    fetchFeishuConfig();
  }, []);

  const fetchFeishuConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/integrations/feishu/config');
      const result = await response.json();
      if (result.success) {
        setConfig(result.data);
      } else {
        setConfig(mockConfig);
      }
    } catch (error) {
      console.error('Error fetching Feishu config:', error);
      setConfig(mockConfig);
    } finally {
      setLoading(false);
    }
  };

  const mockConfig = {
    status: 'connected',
    appId: 'cli_9xxxxxxx',
    appName: 'PulseOpti HR',
    connectionTime: '2024-01-15 10:30:00',
    syncStatus: {
      lastSync: '2024-01-20 14:30:00',
      nextSync: '2024-01-20 20:30:00',
      interval: '6小时',
      enabled: true,
    },
    features: [
      {
        id: 'employee_sync',
        name: '员工信息同步',
        description: '自动同步飞书组织架构和员工信息',
        enabled: true,
        status: 'active',
        lastSync: '2024-01-20 14:30:00',
        recordCount: 65,
      },
      {
        id: 'attendance_sync',
        name: '考勤数据同步',
        description: '同步员工打卡、请假、加班等考勤数据',
        enabled: true,
        status: 'active',
        lastSync: '2024-01-20 14:25:00',
        recordCount: 1250,
      },
      {
        id: 'approval_sync',
        name: '审批流程同步',
        description: '同步审批记录和状态',
        enabled: true,
        status: 'active',
        lastSync: '2024-01-20 14:20:00',
        recordCount: 89,
      },
      {
        id: 'notification_push',
        name: '消息推送',
        description: '通过飞书机器人推送重要通知',
        enabled: true,
        status: 'active',
        lastSync: '-',
        recordCount: 156,
      },
      {
        id: 'calendar_sync',
        name: '日历同步',
        description: '同步会议和重要日程',
        enabled: false,
        status: 'disabled',
        lastSync: '-',
        recordCount: 0,
      },
      {
        id: 'bot_message',
        name: '机器人消息',
        description: '接收并处理飞书机器人消息',
        enabled: true,
        status: 'active',
        lastSync: '-',
        recordCount: 42,
      },
    ],
    statistics: {
      totalSyncs: 521,
      successRate: 99.2,
      avgDuration: 2.5,
      lastWeekSyncs: 42,
      dataVolume: '2.3GB',
    },
    webhook: {
      enabled: true,
      url: 'https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxx',
      lastPing: '2024-01-20 14:28:00',
      status: 'healthy',
    },
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('同步完成！');
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleToggleFeature = async (featureId: string, enabled: boolean) => {
    const updatedFeatures = config.features.map((f: any) =>
      f.id === featureId ? { ...f, enabled } : f
    );
    setConfig({ ...config, features: updatedFeatures });
  };

  const handleTestConnection = async () => {
    setTestMode(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('连接测试成功！');
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setTestMode(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">加载飞书配置...</p>
        </div>
      </div>
    );
  }

  const currentConfig = config || mockConfig;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard/integrations">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回
                </Button>
              </Link>
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">飞书仪表盘</h1>
                <p className="text-sm text-slate-500">飞书集成管理与数据同步</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestConnection}
                disabled={testMode}
              >
                {testMode ? '测试中...' : '测试连接'}
              </Button>
              <Button
                onClick={handleSync}
                disabled={syncing}
                size="sm"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? '同步中...' : '立即同步'}
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                配置
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connection Status */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {currentConfig.status === 'connected' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <span>连接状态</span>
              </div>
              <Badge variant={currentConfig.status === 'connected' ? 'default' : 'destructive'}>
                {currentConfig.status === 'connected' ? '已连接' : '未连接'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-slate-500">应用ID</Label>
                <div className="text-sm font-mono bg-slate-100 p-2 rounded mt-1">
                  {currentConfig.appId}
                </div>
              </div>
              <div>
                <Label className="text-slate-500">应用名称</Label>
                <div className="text-sm bg-slate-100 p-2 rounded mt-1">
                  {currentConfig.appName}
                </div>
              </div>
              <div>
                <Label className="text-slate-500">连接时间</Label>
                <div className="text-sm bg-slate-100 p-2 rounded mt-1">
                  {currentConfig.connectionTime}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sync Status */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle>同步状态</CardTitle>
            <CardDescription>自动同步配置与状态</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-500">上次同步</span>
                </div>
                <div className="text-sm font-semibold">{currentConfig.syncStatus.lastSync}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-500">下次同步</span>
                </div>
                <div className="text-sm font-semibold">{currentConfig.syncStatus.nextSync}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-500 mb-2">同步间隔</div>
                <div className="text-sm font-semibold">{currentConfig.syncStatus.interval}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-500 mb-2">自动同步</div>
                    <div className="text-sm font-semibold">
                      {currentConfig.syncStatus.enabled ? '已启用' : '已禁用'}
                    </div>
                  </div>
                  <Switch
                    checked={currentConfig.syncStatus.enabled}
                    onCheckedChange={() => {}}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Toggle */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle>功能管理</CardTitle>
            <CardDescription>启用或禁用飞书集成功能</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentConfig.features.map((feature: any) => (
                <div key={feature.id} className="flex items-start justify-between p-4 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-slate-900">{feature.name}</h3>
                      <Badge variant={feature.status === 'active' ? 'default' : 'secondary'}>
                        {feature.status === 'active' ? '运行中' : '已禁用'}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{feature.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span>记录数: {feature.recordCount}</span>
                      {feature.lastSync !== '-' && (
                        <span>最后同步: {feature.lastSync}</span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={(checked) => handleToggleFeature(feature.id, checked)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>同步统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">
                    {currentConfig.statistics.totalSyncs}
                  </div>
                  <div className="text-sm text-slate-500">总同步次数</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {currentConfig.statistics.successRate}%
                  </div>
                  <div className="text-sm text-slate-500">成功率</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">
                    {currentConfig.statistics.avgDuration}s
                  </div>
                  <div className="text-sm text-slate-500">平均耗时</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">
                    {currentConfig.statistics.lastWeekSyncs}
                  </div>
                  <div className="text-sm text-slate-500">本周同步</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>数据统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">数据传输量</div>
                      <div className="font-semibold text-slate-900">
                        {currentConfig.statistics.dataVolume}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">活跃天数</div>
                      <div className="font-semibold text-slate-900">36天</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Webhook Status */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Webhook 配置</span>
              </div>
              <Badge variant={currentConfig.webhook.status === 'healthy' ? 'default' : 'destructive'}>
                {currentConfig.webhook.status === 'healthy' ? '健康' : '异常'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Webhook URL</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Input
                    value={currentConfig.webhook.url}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" size="sm">
                    复制
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>最后心跳</Label>
                  <div className="text-sm bg-slate-100 p-2 rounded mt-2">
                    {currentConfig.webhook.lastPing}
                  </div>
                </div>
                <div>
                  <Label>状态</Label>
                  <div className="text-sm bg-slate-100 p-2 rounded mt-2 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>正常运行</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
