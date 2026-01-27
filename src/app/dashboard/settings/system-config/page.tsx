'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Save,
  RefreshCw,
  Settings,
  Bell,
  Shield,
  Database,
  Mail,
  Globe,
  Clock,
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/theme';

interface SystemConfig {
  id: string;
  category: 'basic' | 'notification' | 'security' | 'integration' | 'advanced';
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json' | 'text';
  description: string;
  isEncrypted: boolean;
  updatedAt: string;
  updatedBy: string;
}

const configCategories = [
  { id: 'basic', name: '基础设置', icon: Settings, description: '系统基础参数配置' },
  { id: 'notification', name: '通知设置', icon: Bell, description: '消息通知相关配置' },
  { id: 'security', name: '安全设置', icon: Shield, description: '系统安全相关配置' },
  { id: 'integration', name: '集成设置', icon: Database, description: '第三方集成配置' },
  { id: 'advanced', name: '高级设置', icon: Globe, description: '系统高级参数配置' },
];

export default function SystemConfigPage() {
  const [loading, setLoading] = useState(true);
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('basic');
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<SystemConfig | null>(null);
  const [editedValue, setEditedValue] = useState('');

  const fetchConfigs = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockConfigs: SystemConfig[] = [
        // 基础设置
        {
          id: '1',
          category: 'basic',
          key: 'system_name',
          value: 'PulseOpti HR 脉策聚效',
          type: 'string',
          description: '系统名称',
          isEncrypted: false,
          updatedAt: '2025-01-20 10:00:00',
          updatedBy: 'admin',
        },
        {
          id: '2',
          category: 'basic',
          key: 'company_name',
          value: '科技有限公司',
          type: 'string',
          description: '公司名称',
          isEncrypted: false,
          updatedAt: '2025-01-20 10:00:00',
          updatedBy: 'admin',
        },
        {
          id: '3',
          category: 'basic',
          key: 'system_timezone',
          value: 'Asia/Shanghai',
          type: 'string',
          description: '系统时区',
          isEncrypted: false,
          updatedAt: '2025-01-20 10:00:00',
          updatedBy: 'admin',
        },
        {
          id: '4',
          category: 'basic',
          key: 'date_format',
          value: 'YYYY-MM-DD',
          type: 'string',
          description: '日期格式',
          isEncrypted: false,
          updatedAt: '2025-01-20 10:00:00',
          updatedBy: 'admin',
        },
        {
          id: '5',
          category: 'basic',
          key: 'default_language',
          value: 'zh-CN',
          type: 'string',
          description: '默认语言',
          isEncrypted: false,
          updatedAt: '2025-01-20 10:00:00',
          updatedBy: 'admin',
        },
        // 通知设置
        {
          id: '6',
          category: 'notification',
          key: 'email_enabled',
          value: 'true',
          type: 'boolean',
          description: '启用邮件通知',
          isEncrypted: false,
          updatedAt: '2025-01-20 10:00:00',
          updatedBy: 'admin',
        },
        {
          id: '7',
          category: 'notification',
          key: 'sms_enabled',
          value: 'false',
          type: 'boolean',
          description: '启用短信通知',
          isEncrypted: false,
          updatedAt: '2025-01-20 10:00:00',
          updatedBy: 'admin',
        },
        {
          id: '8',
          category: 'notification',
          key: 'feishu_enabled',
          value: 'true',
          type: 'boolean',
          description: '启用飞书通知',
          isEncrypted: false,
          updatedAt: '2025-01-20 10:00:00',
          updatedBy: 'admin',
        },
        {
          id: '9',
          category: 'notification',
          key: 'notification_batch_size',
          value: '100',
          type: 'number',
          description: '批量通知大小',
          isEncrypted: false,
          updatedAt: '2025-01-20 10:00:00',
          updatedBy: 'admin',
        },
        // 安全设置
        {
          id: '10',
          category: 'security',
          key: 'password_min_length',
          value: '8',
          type: 'number',
          description: '密码最小长度',
          isEncrypted: false,
          updatedAt: '2025-01-20 10:00:00',
          updatedBy: 'admin',
        },
        {
          id: '11',
          category: 'security',
          key: 'password_require_uppercase',
          value: 'true',
          type: 'boolean',
          description: '密码需要大写字母',
          isEncrypted: false,
          updatedAt: '2025-01-20 10:00:00',
          updatedBy: 'admin',
        },
        {
          id: '12',
          category: 'security',
          key: 'session_timeout',
          value: '7200',
          type: 'number',
          description: '会话超时时间（秒）',
          isEncrypted: false,
          updatedAt: '2025-01-20 10:00:00',
          updatedBy: 'admin',
        },
        {
          id: '13',
          category: 'security',
          key: 'max_login_attempts',
          value: '5',
          type: 'number',
          description: '最大登录尝试次数',
          isEncrypted: false,
          updatedAt: '2025-01-20 10:00:00',
          updatedBy: 'admin',
        },
        {
          id: '14',
          category: 'security',
          key: 'enable_2fa',
          value: 'false',
          type: 'boolean',
          description: '启用双因素认证',
          isEncrypted: false,
          updatedAt: '2025-01-20 10:00:00',
          updatedBy: 'admin',
        },
        // 集成设置
        {
          id: '15',
          category: 'integration',
          key: 'feishu_app_id',
          value: 'cli_xxxxxxxxxxxx',
          type: 'string',
          description: '飞书应用ID',
          isEncrypted: true,
          updatedAt: '2025-01-20 10:00:00',
          updatedBy: 'admin',
        },
        {
          id: '16',
          category: 'integration',
          key: 'feishu_app_secret',
          value: 'xxxxxxxxxxxxxx',
          type: 'string',
          description: '飞书应用密钥',
          isEncrypted: true,
          updatedAt: '2025-01-20 10:00:00',
          updatedBy: 'admin',
        },
        {
          id: '17',
          category: 'integration',
          key: 'sync_interval',
          value: '3600',
          type: 'number',
          description: '数据同步间隔（秒）',
          isEncrypted: false,
          updatedAt: '2025-01-20 10:00:00',
          updatedBy: 'admin',
        },
        // 高级设置
        {
          id: '18',
          category: 'advanced',
          key: 'enable_debug_mode',
          value: 'false',
          type: 'boolean',
          description: '启用调试模式',
          isEncrypted: false,
          updatedAt: '2025-01-20 10:00:00',
          updatedBy: 'admin',
        },
        {
          id: '19',
          category: 'advanced',
          key: 'log_retention_days',
          value: '90',
          type: 'number',
          description: '日志保留天数',
          isEncrypted: false,
          updatedAt: '2025-01-20 10:00:00',
          updatedBy: 'admin',
        },
        {
          id: '20',
          category: 'advanced',
          key: 'backup_retention_days',
          value: '30',
          type: 'number',
          description: '备份保留天数',
          isEncrypted: false,
          updatedAt: '2025-01-20 10:00:00',
          updatedBy: 'admin',
        },
        {
          id: '21',
          category: 'advanced',
          key: 'max_file_size',
          value: '10485760',
          type: 'number',
          description: '最大文件大小（字节）',
          isEncrypted: false,
          updatedAt: '2025-01-20 10:00:00',
          updatedBy: 'admin',
        },
      ];
      
      setConfigs(mockConfigs);
    } catch (error) {
      console.error('Failed to fetch configs:', error);
      toast.error('加载系统配置失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  const filteredConfigs = useMemo(() => {
    return configs.filter(config => {
      const matchesCategory = config.category === activeCategory;
      const matchesSearch = config.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           config.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [configs, activeCategory, searchTerm]);

  const handleEdit = useCallback((config: SystemConfig) => {
    setSelectedConfig(config);
    setEditedValue(config.value);
    setEditDialogOpen(true);
  }, []);

  const handleSave = useCallback(async () => {
    if (!selectedConfig) return;
    
    try {
      setSaving(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setConfigs(configs.map(config =>
        config.id === selectedConfig.id
          ? { ...config, value: editedValue, updatedAt: new Date().toLocaleString() }
          : config
      ));
      
      setEditDialogOpen(false);
      toast.success('配置保存成功');
    } catch (error) {
      console.error('Failed to save config:', error);
      toast.error('保存配置失败');
    } finally {
      setSaving(false);
    }
  }, [selectedConfig, editedValue, configs]);

  const handleSwitchChange = useCallback(async (config: SystemConfig, newValue: string) => {
    try {
      setConfigs(configs.map(c =>
        c.id === config.id
          ? { ...c, value: newValue, updatedAt: new Date().toLocaleString() }
          : c
      ));
      toast.success('配置已更新');
    } catch (error) {
      console.error('Failed to update config:', error);
      toast.error('更新配置失败');
    }
  }, [configs]);

  const getTypeBadge = (type: SystemConfig['type']) => {
    const typeMap = {
      string: { label: '字符串', color: 'bg-blue-100 text-blue-800' },
      number: { label: '数字', color: 'bg-green-100 text-green-800' },
      boolean: { label: '布尔值', color: 'bg-purple-100 text-purple-800' },
      json: { label: 'JSON', color: 'bg-orange-100 text-orange-800' },
      text: { label: '文本', color: 'bg-gray-100 text-gray-800' },
    };
    const { label, color } = typeMap[type];
    return <Badge className={color}>{label}</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">系统参数配置</h1>
          <p className="text-muted-foreground mt-1">
            管理系统运行参数，调整系统行为
          </p>
        </div>
        <Button variant="outline" onClick={fetchConfigs}>
          <RefreshCw className="mr-2 h-4 w-4" />
          刷新
        </Button>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          修改系统配置可能会影响系统运行，请谨慎操作。建议在修改前备份当前配置。
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {configCategories.map((category) => {
          const Icon = category.icon;
          const categoryCount = configs.filter(c => c.category === category.id).length;
          return (
            <Card
              key={category.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-lg',
                activeCategory === category.id && 'ring-2 ring-primary'
              )}
              onClick={() => setActiveCategory(category.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <Badge variant="secondary">{categoryCount}</Badge>
                </div>
                <CardTitle className="text-sm font-medium mt-2">{category.name}</CardTitle>
                <CardDescription className="text-xs">{category.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {configCategories.find(c => c.id === activeCategory)?.name}配置
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索配置项..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredConfigs.map((config) => (
              <div
                key={config.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{config.key}</h3>
                    {getTypeBadge(config.type)}
                    {config.isEncrypted && (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        加密
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{config.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>更新于: {config.updatedAt}</span>
                    <span>·</span>
                    <span>更新人: {config.updatedBy}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {config.type === 'boolean' ? (
                    <Switch
                      checked={config.value === 'true'}
                      onCheckedChange={(checked) => handleSwitchChange(config, checked.toString())}
                    />
                  ) : config.isEncrypted ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="password"
                        value="••••••••••••"
                        disabled
                        className="w-40"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(config)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        value={config.value}
                        disabled
                        className="w-40 font-mono text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(config)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑配置</DialogTitle>
          </DialogHeader>
          {selectedConfig && (
            <div className="space-y-4 py-4">
              <div>
                <Label>配置项</Label>
                <Input value={selectedConfig.key} disabled className="mt-2" />
              </div>
              <div>
                <Label>当前值</Label>
                {selectedConfig.type === 'boolean' ? (
                  <div className="mt-2">
                    <Select
                      value={editedValue}
                      onValueChange={setEditedValue}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">true</SelectItem>
                        <SelectItem value="false">false</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : selectedConfig.type === 'text' || selectedConfig.type === 'json' ? (
                  <Textarea
                    value={editedValue}
                    onChange={(e) => setEditedValue(e.target.value)}
                    rows={6}
                    className="mt-2 font-mono text-sm"
                  />
                ) : selectedConfig.type === 'number' ? (
                  <Input
                    type="number"
                    value={editedValue}
                    onChange={(e) => setEditedValue(e.target.value)}
                    className="mt-2 font-mono"
                  />
                ) : (
                  <Input
                    value={editedValue}
                    onChange={(e) => setEditedValue(e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>
              {selectedConfig.isEncrypted && (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    此配置项已加密存储，请确保输入正确的值。
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? '保存中...' : '保存'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
