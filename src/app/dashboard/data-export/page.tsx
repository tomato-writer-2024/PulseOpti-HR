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
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileJson,
  FileImage,
  Plus,
  Eye,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  Crown,
  Calendar,
  User,
  BarChart3,
  File,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

// 导出类型
type ExportType = 'report' | 'data' | 'template';
type FileFormat = 'excel' | 'pdf' | 'csv' | 'json';
type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface ExportConfig {
  id: string;
  name: string;
  type: ExportType;
  module: string;
  description: string;
  formats: FileFormat[];
  isPro: boolean;
  icon: React.ReactNode;
}

interface ExportTask {
  id: string;
  configId: string;
  configName: string;
  fileName: string;
  format: FileFormat;
  status: ExportStatus;
  progress: number;
  size: string;
  recordCount: number;
  createdAt: string;
  completedAt?: string;
  userId: string;
  userName: string;
}

interface ExportField {
  id: string;
  name: string;
  key: string;
  selected: boolean;
  order: number;
}

export default function DataExportPage() {
  const [activeTab, setActiveTab] = useState('new');
  const [selectedConfig, setSelectedConfig] = useState<ExportConfig | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<FileFormat>('excel');
  const [exportDateRange, setExportDateRange] = useState<'today' | 'week' | 'month' | 'custom'>('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // 导出配置
  const [configs] = useState<ExportConfig[]>([
    {
      id: '1',
      name: '员工花名册',
      type: 'data',
      module: 'employee',
      description: '导出所有员工基本信息',
      formats: ['excel', 'pdf', 'csv'],
      isPro: false,
      icon: <User className="h-5 w-5" />,
    },
    {
      id: '2',
      name: '考勤汇总报表',
      type: 'report',
      module: 'attendance',
      description: '导出考勤统计数据',
      formats: ['excel', 'pdf', 'csv'],
      isPro: false,
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      id: '3',
      name: '绩效考核报表',
      type: 'report',
      module: 'performance',
      description: '导出绩效考核结果',
      formats: ['excel', 'pdf', 'csv'],
      isPro: true,
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      id: '4',
      name: '薪资发放明细',
      type: 'data',
      module: 'compensation',
      description: '导出薪资发放记录',
      formats: ['excel', 'pdf', 'csv'],
      isPro: true,
      icon: <FileSpreadsheet className="h-5 w-5" />,
    },
    {
      id: '5',
      name: '招聘漏斗分析',
      type: 'report',
      module: 'recruitment',
      description: '导出招聘数据统计分析',
      formats: ['excel', 'pdf', 'csv'],
      isPro: true,
      icon: <Sparkles className="h-5 w-5" />,
    },
    {
      id: '6',
      name: '培训完成情况',
      type: 'data',
      module: 'training',
      description: '导出培训完成记录',
      formats: ['excel', 'pdf', 'csv'],
      isPro: true,
      icon: <FileText className="h-5 w-5" />,
    },
  ]);

  // 导出任务历史
  const [tasks, setTasks] = useState<ExportTask[]>([
    {
      id: '1',
      configId: '1',
      configName: '员工花名册',
      fileName: '员工花名册_20250418.xlsx',
      format: 'excel',
      status: 'completed',
      progress: 100,
      size: '2.5 MB',
      recordCount: 156,
      createdAt: '2025-04-18 10:30:15',
      completedAt: '2025-04-18 10:30:25',
      userId: '1',
      userName: '张三',
    },
    {
      id: '2',
      configId: '2',
      configName: '考勤汇总报表',
      fileName: '考勤汇总报表_20250418.pdf',
      format: 'pdf',
      status: 'completed',
      progress: 100,
      size: '1.8 MB',
      recordCount: 22,
      createdAt: '2025-04-18 09:15:22',
      completedAt: '2025-04-18 09:15:35',
      userId: '1',
      userName: '张三',
    },
    {
      id: '3',
      configId: '3',
      configName: '绩效考核报表',
      fileName: '绩效考核报表_20250418.csv',
      format: 'csv',
      status: 'processing',
      progress: 65,
      size: '-',
      recordCount: 156,
      createdAt: '2025-04-18 10:45:10',
      userId: '2',
      userName: '李四',
    },
    {
      id: '4',
      configId: '4',
      configName: '薪资发放明细',
      fileName: '薪资发放明细_20250417.xlsx',
      format: 'excel',
      status: 'completed',
      progress: 100,
      size: '3.2 MB',
      recordCount: 156,
      createdAt: '2025-04-17 16:20:08',
      completedAt: '2025-04-17 16:20:22',
      userId: '1',
      userName: '张三',
    },
  ]);

  // 导出字段配置
  const [fields] = useState<ExportField[]>([
    { id: '1', name: '员工编号', key: 'employeeNo', selected: true, order: 1 },
    { id: '2', name: '姓名', key: 'name', selected: true, order: 2 },
    { id: '3', name: '部门', key: 'department', selected: true, order: 3 },
    { id: '4', name: '职位', key: 'position', selected: true, order: 4 },
    { id: '5', name: '入职日期', key: 'hireDate', selected: true, order: 5 },
    { id: '6', name: '工龄', key: 'tenure', selected: false, order: 6 },
    { id: '7', name: '邮箱', key: 'email', selected: false, order: 7 },
    { id: '8', name: '手机号', key: 'phone', selected: false, order: 8 },
  ]);

  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  // 文件格式映射
  const formatMap: Record<FileFormat, { icon: React.ReactNode; label: string; color: string }> = {
    excel: { icon: <FileSpreadsheet className="h-5 w-5" />, label: 'Excel', color: 'text-green-600' },
    pdf: { icon: <FileText className="h-5 w-5" />, label: 'PDF', color: 'text-red-600' },
    csv: { icon: <File className="h-5 w-5" />, label: 'CSV', color: 'text-blue-600' },
    json: { icon: <FileJson className="h-5 w-5" />, label: 'JSON', color: 'text-purple-600' },
  };

  // 状态映射
  const statusMap: Record<ExportStatus, { icon: React.ReactNode; label: string; color: string }> = {
    pending: { icon: <Clock className="h-4 w-4" />, label: '等待中', color: 'bg-gray-100 text-gray-800' },
    processing: { icon: <RefreshCw className="h-4 w-4 animate-spin" />, label: '处理中', color: 'bg-blue-100 text-blue-800' },
    completed: { icon: <CheckCircle className="h-4 w-4" />, label: '已完成', color: 'bg-green-100 text-green-800' },
    failed: { icon: <AlertCircle className="h-4 w-4" />, label: '失败', color: 'bg-red-100 text-red-800' },
  };

  // 日期范围映射
  const dateRangeMap: Record<string, string> = {
    today: '今天',
    week: '本周',
    month: '本月',
    custom: '自定义',
  };

  // 处理导出
  const handleExport = async () => {
    if (!selectedConfig) {
      toast.error('请选择导出内容');
      return;
    }

    if (selectedConfig.isPro) {
      toast.error('此功能为企业版专属功能，请升级订阅');
      return;
    }

    // 创建新任务
    const newTask: ExportTask = {
      id: `task-${Date.now()}`,
      configId: selectedConfig.id,
      configName: selectedConfig.name,
      fileName: `${selectedConfig.name}_${new Date().toISOString().split('T')[0]}.${selectedFormat}`,
      format: selectedFormat,
      status: 'processing',
      progress: 0,
      size: '-',
      recordCount: 0,
      createdAt: new Date().toLocaleString('zh-CN'),
      userId: '1',
      userName: '张三',
    };

    setTasks([newTask, ...tasks]);
    setExportDialogOpen(false);

    // 模拟导出进度
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setTasks(prev => prev.map(task => 
        task.id === newTask.id 
          ? { ...task, progress, recordCount: Math.floor(progress * 1.56) }
          : task
      ));

      if (progress >= 100) {
        clearInterval(interval);
        setTasks(prev => prev.map(task => 
          task.id === newTask.id 
            ? { ...task, status: 'completed', progress: 100, size: '1.2 MB', completedAt: new Date().toLocaleString('zh-CN') }
            : task
        ));
        toast.success('导出成功！');
      }
    }, 500);
  };

  // 下载文件
  const handleDownload = (task: ExportTask) => {
    toast.success(`开始下载 ${task.fileName}`);
    // 实际项目中应该调用文件下载API
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">数据导出</h1>
          <p className="text-gray-600 mt-2">
            导出各类报表和数据，支持多种格式
            <Badge variant="secondary" className="ml-2">高级功能</Badge>
          </p>
        </div>
        <Button onClick={() => {
          setSelectedConfig(null);
          setExportDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          新建导出
        </Button>
      </div>

      {/* 功能介绍 */}
      <Alert>
        <Zap className="h-4 w-4" />
        <AlertDescription>
          数据导出功能支持多种格式的数据导出，可以自定义导出字段和日期范围，导出记录可以随时下载查看。
          <Badge className="ml-2" variant="secondary">高级报表需企业版</Badge>
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new">新建导出</TabsTrigger>
          <TabsTrigger value="history">导出记录</TabsTrigger>
        </TabsList>

        {/* 新建导出Tab */}
        <TabsContent value="new" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {configs.map((config) => (
              <Card 
                key={config.id} 
                className="cursor-pointer hover:shadow-lg transition-all border-2"
                onClick={() => setSelectedConfig(config)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {config.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base">{config.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">{config.description}</CardDescription>
                      </div>
                    </div>
                    {config.isPro && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                        <Crown className="h-3 w-3 mr-1" />
                        企业版
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">支持的格式：</div>
                    <div className="flex gap-2">
                      {config.formats.map((format) => (
                        <Badge key={format} variant="outline" className={formatMap[format].color}>
                          {formatMap[format].label}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      className="w-full mt-2"
                      variant={selectedConfig?.id === config.id ? 'default' : 'outline'}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedConfig(config);
                        setExportDialogOpen(true);
                      }}
                    >
                      {config.isPro ? (
                        <>
                          <Crown className="mr-2 h-4 w-4" />
                          升级使用
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          立即导出
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 导出记录Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>导出记录</CardTitle>
              <CardDescription>查看和下载历史导出文件</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>文件名</TableHead>
                    <TableHead>格式</TableHead>
                    <TableHead>大小</TableHead>
                    <TableHead>记录数</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>进度</TableHead>
                    <TableHead>创建人</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4 text-gray-600" />
                          <span className="font-medium">{task.fileName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          {formatMap[task.format].icon}
                          <span className={formatMap[task.format].color}>{formatMap[task.format].label}</span>
                        </div>
                      </TableCell>
                      <TableCell>{task.size}</TableCell>
                      <TableCell>{task.recordCount} 条</TableCell>
                      <TableCell>
                        <Badge className={statusMap[task.status].color}>
                          {statusMap[task.status].icon}
                          {statusMap[task.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-24">
                            <div
                              className={`h-full bg-blue-600 transition-all ${
                                task.status === 'processing' ? 'animate-pulse' : ''
                              }`}
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                          <span className="text-sm">{task.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{task.userName.slice(0, 1)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{task.userName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{task.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {task.status === 'completed' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(task)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
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
      </Tabs>

      {/* 导出配置弹窗 */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>导出配置</DialogTitle>
            <DialogDescription>
              配置导出参数并开始导出
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* 选择导出内容 */}
            <div>
              <Label>导出内容</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {configs.map((config) => (
                  <div
                    key={config.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedConfig?.id === config.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedConfig(config)}
                  >
                    <div className="flex items-center gap-2">
                      {config.icon}
                      <span className="font-medium">{config.name}</span>
                      {config.isPro && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                          <Crown className="h-3 w-3" />
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 选择文件格式 */}
            <div>
              <Label>文件格式</Label>
              <div className="flex gap-3 mt-2">
                {selectedConfig?.formats.map((format) => (
                  <Button
                    key={format}
                    variant={selectedFormat === format ? 'default' : 'outline'}
                    onClick={() => setSelectedFormat(format)}
                  >
                    {formatMap[format].icon}
                    {formatMap[format].label}
                  </Button>
                ))}
              </div>
            </div>

            {/* 选择日期范围 */}
            <div>
              <Label>数据范围</Label>
              <div className="flex gap-3 mt-2">
                {(['today', 'week', 'month', 'custom'] as const).map((range) => (
                  <Button
                    key={range}
                    variant={exportDateRange === range ? 'default' : 'outline'}
                    onClick={() => setExportDateRange(range)}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateRangeMap[range]}
                  </Button>
                ))}
              </div>
              {exportDateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label>开始日期</Label>
                    <Input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>结束日期</Label>
                    <Input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 选择导出字段 */}
            <div>
              <Label>导出字段</Label>
              <div className="border rounded-lg p-4 mt-2 max-h-48 overflow-y-auto">
                <div className="space-y-2">
                  {fields.map((field) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={field.id}
                        checked={field.selected}
                        onCheckedChange={(checked) => {
                          // 实际项目中应该更新字段选择状态
                        }}
                      />
                      <Label htmlFor={field.id} className="cursor-pointer flex-1">
                        {field.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 预计记录数 */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <span className="font-medium">预计导出记录数：</span>
                <span className="text-blue-600 font-bold">156 条</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleExport} disabled={!selectedConfig || selectedConfig.isPro}>
              {selectedConfig?.isPro ? (
                <>
                  <Crown className="mr-2 h-4 w-4" />
                  升级订阅
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  开始导出
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
