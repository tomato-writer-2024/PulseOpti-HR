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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Copy,
  Save,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Filter,
  Zap,
  Crown,
  Users,
  TrendingUp,
  Target,
  Briefcase,
  GraduationCap,
  Clock,
  DollarSign,
  Award,
  FileText,
  Layout,
  Settings,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  color: string;
  fields: string[];
  chartType: string;
  badge?: string;
}

interface CustomReport {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  createdBy: string;
  fields: string[];
  chartType: string;
  filters: Record<string, any>;
  lastUpdated: string;
}

export default function CustomReportPage() {
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);

  const [newReport, setNewReport] = useState({
    name: '',
    description: '',
    fields: [] as string[],
    chartType: 'bar',
  });

  const reportTemplates: ReportTemplate[] = [
    {
      id: '1',
      name: '员工结构分析',
      description: '按部门、职级、年龄段分析员工结构',
      category: 'organization',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      fields: ['部门', '职级', '年龄段', '性别', '工龄'],
      chartType: 'pie',
      badge: '热门',
    },
    {
      id: '2',
      name: '人效分析',
      description: '人力资源效能指标分析',
      category: 'efficiency',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      fields: ['人均产值', '人均利润', '人均成本', '人均培训时长'],
      chartType: 'line',
      badge: '推荐',
    },
    {
      id: '3',
      name: '招聘分析',
      description: '招聘漏斗、周期、成本分析',
      category: 'recruitment',
      icon: Briefcase,
      color: 'from-purple-500 to-purple-600',
      fields: ['岗位', '简历数', '面试数', '入职数', '招聘成本', '招聘周期'],
      chartType: 'funnel',
      badge: 'NEW',
    },
    {
      id: '4',
      name: '绩效分析',
      description: '绩效分布、趋势、对比分析',
      category: 'performance',
      icon: Target,
      color: 'from-orange-500 to-orange-600',
      fields: ['绩效等级', '部门', '得分', '排名', '趋势'],
      chartType: 'bar',
    },
    {
      id: '5',
      name: '培训分析',
      description: '培训覆盖、效果、成本分析',
      category: 'training',
      icon: GraduationCap,
      color: 'from-pink-500 to-pink-600',
      fields: ['课程', '参训人数', '完成率', '满意度', '培训成本'],
      chartType: 'bar',
    },
    {
      id: '6',
      name: '薪酬分析',
      description: '薪酬结构、分布、趋势分析',
      category: 'compensation',
      icon: DollarSign,
      color: 'from-teal-500 to-teal-600',
      fields: ['部门', '职级', '基本工资', '绩效奖金', '总薪酬'],
      chartType: 'bar',
    },
    {
      id: '7',
      name: '考勤分析',
      description: '考勤率、请假、加班分析',
      category: 'attendance',
      icon: Clock,
      color: 'from-cyan-500 to-cyan-600',
      fields: ['部门', '考勤率', '请假天数', '加班时长', '迟到早退'],
      chartType: 'bar',
    },
    {
      id: '8',
      name: '人才盘点',
      description: '人才九宫格、能力评估分析',
      category: 'talent',
      icon: Award,
      color: 'from-indigo-500 to-indigo-600',
      fields: ['人才类别', '部门', '绩效得分', '潜力得分', '关键能力'],
      chartType: 'grid',
    },
  ];

  const customReports: CustomReport[] = [
    {
      id: '1',
      name: '季度人员流动分析',
      description: '各部门季度入职、离职、调动分析',
      createdAt: '2024-01-15',
      createdBy: '张三',
      fields: ['部门', '入职人数', '离职人数', '调动人数', '净增长率'],
      chartType: 'bar',
      filters: { quarter: 'Q1 2024' },
      lastUpdated: '2024-03-01',
    },
    {
      id: '2',
      name: '培训效果评估',
      description: '各部门培训完成率和满意度',
      createdAt: '2024-02-01',
      createdBy: '李四',
      fields: ['部门', '课程', '参训人数', '完成率', '满意度'],
      chartType: 'bar',
      filters: { year: '2024' },
      lastUpdated: '2024-03-15',
    },
    {
      id: '3',
      name: '薪酬对比分析',
      description: '各部门薪酬水平和分布对比',
      createdAt: '2024-02-10',
      createdBy: '王五',
      fields: ['部门', '职级', '平均薪资', '中位数', '最高值', '最低值'],
      chartType: 'bar',
      filters: { year: '2024' },
      lastUpdated: '2024-03-20',
    },
  ];

  const availableFields = [
    { name: '员工ID', category: '基本信息' },
    { name: '员工姓名', category: '基本信息' },
    { name: '部门', category: '基本信息' },
    { name: '职位', category: '基本信息' },
    { name: '职级', category: '基本信息' },
    { name: '入职日期', category: '基本信息' },
    { name: '工龄', category: '基本信息' },
    { name: '年龄段', category: '基本信息' },
    { name: '性别', category: '基本信息' },
    { name: '学历', category: '基本信息' },
    { name: '绩效得分', category: '绩效' },
    { name: '绩效等级', category: '绩效' },
    { name: '绩效排名', category: '绩效' },
    { name: '目标完成率', category: '绩效' },
    { name: '基本工资', category: '薪酬' },
    { name: '绩效奖金', category: '薪酬' },
    { name: '总薪酬', category: '薪酬' },
    { name: '人均产值', category: '人效' },
    { name: '人均利润', category: '人效' },
    { name: '人均成本', category: '人效' },
    { name: '培训时长', category: '培训' },
    { name: '培训次数', category: '培训' },
    { name: '培训完成率', category: '培训' },
    { name: '培训满意度', category: '培训' },
    { name: '考勤率', category: '考勤' },
    { name: '请假天数', category: '考勤' },
    { name: '加班时长', category: '考勤' },
    { name: '迟到次数', category: '考勤' },
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleCreateFromTemplate = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setNewReport({
      name: template.name,
      description: template.description,
      fields: template.fields,
      chartType: template.chartType,
    });
    setShowCreateDialog(true);
  };

  const handleCreateReport = () => {
    toast.success('报表创建成功');
    setShowCreateDialog(false);
    setNewReport({ name: '', description: '', fields: [], chartType: 'bar' });
  };

  const handleDeleteReport = (id: string) => {
    toast.success('报表已删除');
  };

  const handleCopyReport = (id: string) => {
    toast.success('报表已复制');
  };

  const handleExportReport = (id: string) => {
    toast.success('报表已导出');
  };

  const filteredTemplates = reportTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredReports = customReports.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              自定义报表
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              拖拽式报表设计器，创建符合企业需求的专属报表
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              刷新
            </Button>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              创建报表
            </Button>
          </div>
        </div>

        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              报表模板
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              我的报表
            </TabsTrigger>
          </TabsList>

          {/* 报表模板 */}
          <TabsContent value="templates" className="space-y-6">
            {/* 搜索和筛选 */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="搜索报表模板..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="全部分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分类</SelectItem>
                  <SelectItem value="organization">组织管理</SelectItem>
                  <SelectItem value="efficiency">人效分析</SelectItem>
                  <SelectItem value="recruitment">招聘管理</SelectItem>
                  <SelectItem value="performance">绩效管理</SelectItem>
                  <SelectItem value="training">培训管理</SelectItem>
                  <SelectItem value="compensation">薪酬管理</SelectItem>
                  <SelectItem value="attendance">考勤管理</SelectItem>
                  <SelectItem value="talent">人才管理</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 报表模板网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <Card
                    key={template.id}
                    className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-300 dark:hover:border-blue-700"
                    onClick={() => handleCreateFromTemplate(template)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${template.color}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        {template.badge && (
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {template.badge}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base mt-3">{template.name}</CardTitle>
                      <CardDescription className="text-xs">{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>{template.fields.length} 个字段</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* 我的报表 */}
          <TabsContent value="custom" className="space-y-6">
            {/* 搜索 */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="搜索我的报表..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
            </div>

            {/* 报表列表 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <Card key={report.id} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="outline">已发布</Badge>
                    </div>
                    <CardTitle className="text-base mt-3">{report.name}</CardTitle>
                    <CardDescription className="text-xs">{report.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>创建时间</span>
                        <span>{report.createdAt}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>创建人</span>
                        <span>{report.createdBy}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>最后更新</span>
                        <span>{report.lastUpdated}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setShowPreviewDialog(true)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        预览
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleExportReport(report.id)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        导出
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyReport(report.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteReport(report.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* 创建报表对话框 */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>创建自定义报表</DialogTitle>
              <DialogDescription>
                {selectedTemplate
                  ? `基于模板 "${selectedTemplate.name}" 创建报表`
                  : '从零开始创建报表，选择数据字段和图表类型'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* 基本信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>报表名称 *</Label>
                  <Input
                    value={newReport.name}
                    onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                    placeholder="输入报表名称"
                  />
                </div>
                <div className="space-y-2">
                  <Label>图表类型</Label>
                  <Select
                    value={newReport.chartType}
                    onValueChange={(v) => setNewReport({ ...newReport, chartType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          柱状图
                        </div>
                      </SelectItem>
                      <SelectItem value="line">
                        <div className="flex items-center gap-2">
                          <LineChart className="h-4 w-4" />
                          折线图
                        </div>
                      </SelectItem>
                      <SelectItem value="pie">
                        <div className="flex items-center gap-2">
                          <PieChart className="h-4 w-4" />
                          饼图
                        </div>
                      </SelectItem>
                      <SelectItem value="table">
                        <div className="flex items-center gap-2">
                          <Layout className="h-4 w-4" />
                          表格
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>报表描述</Label>
                <Input
                  value={newReport.description}
                  onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  placeholder="输入报表描述"
                />
              </div>

              {/* 数据字段选择 */}
              <div className="space-y-2">
                <Label>选择数据字段 *</Label>
                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                  <div className="space-y-3">
                    {['基本信息', '绩效', '薪酬', '人效', '培训', '考勤'].map(category => (
                      <div key={category}>
                        <div className="font-medium text-sm mb-2">{category}</div>
                        <div className="grid grid-cols-3 gap-2">
                          {availableFields.filter(f => f.category === category).map(field => (
                            <div
                              key={field.name}
                              onClick={() => {
                                if (newReport.fields.includes(field.name)) {
                                  setNewReport({
                                    ...newReport,
                                    fields: newReport.fields.filter(f => f !== field.name)
                                  });
                                } else {
                                  setNewReport({
                                    ...newReport,
                                    fields: [...newReport.fields, field.name]
                                  });
                                }
                              }}
                              className={`p-2 rounded border cursor-pointer text-sm transition-colors ${
                                newReport.fields.includes(field.name)
                                  ? 'bg-blue-100 border-blue-500 text-blue-900'
                                  : 'bg-white border-gray-300 hover:border-blue-300'
                              }`}
                            >
                              {newReport.fields.includes(field.name) && (
                                <CheckCircle className="h-4 w-4 inline mr-1" />
                              )}
                              {field.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 筛选条件 */}
              <div className="space-y-2">
                <Label>筛选条件</Label>
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="选择字段" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.map(field => (
                        <SelectItem key={field.name} value={field.name}>{field.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="选择条件" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">等于</SelectItem>
                      <SelectItem value="not_equals">不等于</SelectItem>
                      <SelectItem value="contains">包含</SelectItem>
                      <SelectItem value="greater_than">大于</SelectItem>
                      <SelectItem value="less_than">小于</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    className="flex-1"
                    placeholder="输入值"
                  />
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    添加
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                取消
              </Button>
              <Button
                onClick={handleCreateReport}
                disabled={!newReport.name || newReport.fields.length === 0}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Save className="h-4 w-4 mr-2" />
                创建报表
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 升级提示 */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Crown className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  自定义报表高级功能
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  升级企业版可解锁更多高级功能，包括实时数据更新、自动定时发送、多维度分析、数据下钻、图表联动等
                </p>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                立即升级
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
