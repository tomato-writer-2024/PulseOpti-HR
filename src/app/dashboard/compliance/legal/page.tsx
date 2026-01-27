'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Search,
  ExternalLink,
  Calendar,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Scale,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';

type LawCategory = 'labor' | 'social-security' | 'tax' | 'data-protection' | 'safety';
type LawStatus = 'effective' | 'pending' | 'repealed';
type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

interface Law {
  id: string;
  title: string;
  category: LawCategory;
  status: LawStatus;
  urgency: UrgencyLevel;
  effectiveDate: string;
  lastUpdated: string;
  summary: string;
  impact: string;
  source: string;
  sourceUrl: string;
  tags: string[];
}

interface ComplianceCheck {
  id: string;
  name: string;
  description: string;
  status: 'compliant' | 'non-compliant' | 'pending';
  lastChecked: string;
}

export default function LegalPage() {
  const [laws, setLaws] = useState<Law[]>([]);
  const [checks, setChecks] = useState<ComplianceCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // 模拟获取法律法规数据
    setTimeout(() => {
      setLaws([
        {
          id: '1',
          title: '中华人民共和国劳动合同法',
          category: 'labor',
          status: 'effective',
          urgency: 'critical',
          effectiveDate: '2008-01-01',
          lastUpdated: '2013-07-01',
          summary: '为了完善劳动合同制度，明确劳动合同双方当事人的权利和义务，保护劳动者的合法权益，构建和发展和谐稳定的劳动关系',
          impact: '影响所有劳动关系的建立、履行、变更、解除和终止',
          source: '全国人民代表大会常务委员会',
          sourceUrl: '#',
          tags: ['劳动', '合同', '员工权益'],
        },
        {
          id: '2',
          title: '中华人民共和国社会保险法',
          category: 'social-security',
          status: 'effective',
          urgency: 'high',
          effectiveDate: '2011-07-01',
          lastUpdated: '2018-12-29',
          summary: '为了规范社会保险关系，维护公民参加社会保险和享受社会保险待遇的合法权益',
          impact: '影响所有员工的社保缴纳和待遇享受',
          source: '全国人民代表大会常务委员会',
          sourceUrl: '#',
          tags: ['社保', '福利', '保障'],
        },
        {
          id: '3',
          title: '个人所得税法',
          category: 'tax',
          status: 'effective',
          urgency: 'high',
          effectiveDate: '2019-01-01',
          lastUpdated: '2023-08-31',
          summary: '为了规范个人所得税的征收和管理，维护纳税人合法权益',
          impact: '影响员工个人所得税的代扣代缴和申报',
          source: '全国人民代表大会常务委员会',
          sourceUrl: '#',
          tags: ['个税', '薪酬', '申报'],
        },
        {
          id: '4',
          title: '个人信息保护法',
          category: 'data-protection',
          status: 'effective',
          urgency: 'critical',
          effectiveDate: '2021-11-01',
          lastUpdated: '2021-08-20',
          summary: '为了保护个人信息权益，规范个人信息处理活动',
          impact: '影响员工个人信息的收集、存储、使用和共享',
          source: '全国人民代表大会常务委员会',
          sourceUrl: '#',
          tags: ['数据安全', '隐私保护', '合规'],
        },
        {
          id: '5',
          title: '工作场所职业卫生管理规定',
          category: 'safety',
          status: 'effective',
          urgency: 'medium',
          effectiveDate: '2021-03-01',
          lastUpdated: '2021-02-01',
          summary: '为了加强工作场所职业卫生管理，预防和控制职业病危害',
          impact: '影响工作环境安全管理和员工健康保护',
          source: '国家卫生健康委员会',
          sourceUrl: '#',
          tags: ['安全', '健康', '防护'],
        },
      ]);

      setChecks([
        {
          id: '1',
          name: '劳动合同签订率检查',
          description: '确保所有员工均已签订劳动合同',
          status: 'compliant',
          lastChecked: '2024-01-20',
        },
        {
          id: '2',
          name: '社保缴纳合规性检查',
          description: '检查社保缴纳基数和比例是否符合规定',
          status: 'compliant',
          lastChecked: '2024-01-22',
        },
        {
          id: '3',
          name: '个税代扣代缴检查',
          description: '检查个税代扣代缴是否及时准确',
          status: 'compliant',
          lastChecked: '2024-01-25',
        },
        {
          id: '4',
          name: '加班时长合规性检查',
          description: '检查员工加班时长是否超过法定标准',
          status: 'non-compliant',
          lastChecked: '2024-01-25',
        },
        {
          id: '5',
          name: '员工信息保护检查',
          description: '检查员工个人信息处理是否符合法律要求',
          status: 'pending',
          lastChecked: '2024-01-10',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredLaws = laws.filter((law) => {
    const matchesSearch =
      law.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      law.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      law.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || law.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || law.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categoryConfig: Record<LawCategory, { label: string; color: string; icon: any }> = {
    labor: { label: '劳动法', color: 'bg-blue-500', icon: FileText },
    'social-security': { label: '社保法', color: 'bg-green-500', icon: BookOpen },
    tax: { label: '税法', color: 'bg-yellow-500', icon: Scale },
    'data-protection': { label: '数据保护', color: 'bg-purple-500', icon: Shield },
    safety: { label: '安全法规', color: 'bg-red-500', icon: AlertTriangle },
  };

  const statusConfig: Record<LawStatus, { label: string; color: string }> = {
    effective: { label: '有效', color: 'bg-green-500' },
    pending: { label: '待生效', color: 'bg-yellow-500' },
    repealed: { label: '已废止', color: 'bg-gray-500' },
  };

  const urgencyConfig: Record<UrgencyLevel, { label: string; color: string }> = {
    low: { label: '低', color: 'bg-gray-500' },
    medium: { label: '中', color: 'bg-blue-500' },
    high: { label: '高', color: 'bg-orange-500' },
    critical: { label: '紧急', color: 'bg-red-500' },
  };

  const statistics = {
    totalLaws: laws.length,
    effectiveLaws: laws.filter(l => l.status === 'effective').length,
    highUrgency: laws.filter(l => ['high', 'critical'].includes(l.urgency)).length,
    compliantChecks: checks.filter(c => c.status === 'compliant').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Scale className="h-8 w-8 text-blue-600" />
            法律法规
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            查看和管理相关法律法规及合规检查
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">相关法规</p>
                  <p className="text-2xl font-bold">{statistics.totalLaws}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">生效法规</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.effectiveLaws}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">高关注度</p>
                  <p className="text-2xl font-bold text-orange-600">{statistics.highUrgency}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">合规检查</p>
                  <p className="text-2xl font-bold text-cyan-600">
                    {checks.length > 0 ? Math.round((statistics.compliantChecks / checks.length) * 100) : 0}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-cyan-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主要内容 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>法规管理</CardTitle>
                <CardDescription>
                  查看相关法律法规和合规状态
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="laws">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="laws">法律法规</TabsTrigger>
                <TabsTrigger value="compliance">合规检查</TabsTrigger>
              </TabsList>

              <TabsContent value="laws" className="mt-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="搜索法规、标签..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="类别" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部类别</SelectItem>
                        {Object.entries(categoryConfig).map(([value, config]) => (
                          <SelectItem key={value} value={value}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        {Object.entries(statusConfig).map(([value, config]) => (
                          <SelectItem key={value} value={value}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-gray-600 dark:text-gray-400">加载中...</div>
                    </div>
                  ) : filteredLaws.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">暂无法规记录</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>法规名称</TableHead>
                          <TableHead>类别</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>关注度</TableHead>
                          <TableHead>生效日期</TableHead>
                          <TableHead>最后更新</TableHead>
                          <TableHead>来源</TableHead>
                          <TableHead>操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLaws.map((law) => {
                          const CategoryIcon = categoryConfig[law.category].icon;
                          return (
                            <TableRow key={law.id}>
                              <TableCell className="font-medium max-w-[300px]">
                                <div className="truncate" title={law.title}>
                                  {law.title}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={`${categoryConfig[law.category].color} text-white border-0 flex items-center gap-1 w-fit`}>
                                  <CategoryIcon className="h-3 w-3" />
                                  {categoryConfig[law.category].label}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={`${statusConfig[law.status].color} text-white border-0`}>
                                  {statusConfig[law.status].label}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={`${urgencyConfig[law.urgency].color} text-white border-0`}>
                                  {urgencyConfig[law.urgency].label}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">{law.effectiveDate}</TableCell>
                              <TableCell className="text-sm">{law.lastUpdated}</TableCell>
                              <TableCell className="text-sm max-w-[150px] truncate">
                                {law.source}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" asChild>
                                  <a href={law.sourceUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="compliance" className="mt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">合规检查项目</h3>
                    <Button variant="outline" onClick={() => toast.info('正在执行合规检查...')}>
                      执行检查
                    </Button>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-gray-600 dark:text-gray-400">加载中...</div>
                    </div>
                  ) : checks.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">暂无合规检查记录</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {checks.map((check) => {
                        const statusIcon = check.status === 'compliant' ? CheckCircle :
                                         check.status === 'non-compliant' ? AlertTriangle :
                                         Clock;
                        const StatusIcon = statusIcon;
                        const statusColor = check.status === 'compliant' ? 'bg-green-500' :
                                          check.status === 'non-compliant' ? 'bg-red-500' :
                                          'bg-yellow-500';
                        const statusLabel = check.status === 'compliant' ? '合规' :
                                          check.status === 'non-compliant' ? '不合规' :
                                          '待检查';
                        return (
                          <Card key={check.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className="font-semibold mb-1">{check.name}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {check.description}
                                  </p>
                                </div>
                                <Badge className={`${statusColor} text-white border-0 flex items-center gap-1`}>
                                  <StatusIcon className="h-3 w-3" />
                                  {statusLabel}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>最后检查: {check.lastChecked}</span>
                                </div>
                                <Button variant="ghost" size="sm" className="h-8">
                                  查看详情
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
