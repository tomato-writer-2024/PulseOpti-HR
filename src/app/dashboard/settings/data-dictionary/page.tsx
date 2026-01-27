'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Filter,
  MoreVertical,
  Database,
  BookOpen,
  Tag,
  List,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/theme';

interface DictionaryItem {
  id: string;
  dictCode: string;
  dictName: string;
  dictType: string;
  description: string;
  status: 'active' | 'inactive';
  sort: number;
  createdAt: string;
  updatedAt: string;
}

interface DictionaryData {
  id: string;
  dictId: string;
  dictCode: string;
  dictLabel: string;
  dictValue: string;
  dictType: string;
  cssClass?: string;
  listClass?: string;
  isDefault: boolean;
  status: 'active' | 'inactive';
  sort: number;
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

const dictTypeCategories = [
  { id: 'all', name: '全部类型', icon: Database },
  { id: 'sys', name: '系统字典', icon: BookOpen },
  { id: 'business', name: '业务字典', icon: Tag },
  { id: 'custom', name: '自定义字典', icon: List },
];

export default function DataDictionaryPage() {
  const [loading, setLoading] = useState(true);
  const [dictionaries, setDictionaries] = useState<DictionaryItem[]>([]);
  const [dictionaryData, setDictionaryData] = useState<DictionaryData[]>([]);
  
  const [activeTab, setActiveTab] = useState<'dictionaries' | 'data'>('dictionaries');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDictId, setSelectedDictId] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  const [dictDialogOpen, setDictDialogOpen] = useState(false);
  const [dataDialogOpen, setDataDialogOpen] = useState(false);
  const [editingDict, setEditingDict] = useState<DictionaryItem | null>(null);
  const [editingData, setEditingData] = useState<DictionaryData | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchDictionaries = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockDictionaries: DictionaryItem[] = [
        {
          id: '1',
          dictCode: 'sys_user_status',
          dictName: '用户状态',
          dictType: 'sys',
          description: '系统用户状态',
          status: 'active',
          sort: 1,
          createdAt: '2025-01-20 10:00:00',
          updatedAt: '2025-01-20 10:00:00',
        },
        {
          id: '2',
          dictCode: 'sys_gender',
          dictName: '性别',
          dictType: 'sys',
          description: '性别字典',
          status: 'active',
          sort: 2,
          createdAt: '2025-01-20 10:00:00',
          updatedAt: '2025-01-20 10:00:00',
        },
        {
          id: '3',
          dictCode: 'employee_status',
          dictName: '员工状态',
          dictType: 'business',
          description: '员工在职状态',
          status: 'active',
          sort: 3,
          createdAt: '2025-01-20 10:00:00',
          updatedAt: '2025-01-20 10:00:00',
        },
        {
          id: '4',
          dictCode: 'employee_level',
          dictName: '员工职级',
          dictType: 'business',
          description: '员工职级体系',
          status: 'active',
          sort: 4,
          createdAt: '2025-01-20 10:00:00',
          updatedAt: '2025-01-20 10:00:00',
        },
        {
          id: '5',
          dictCode: 'department_type',
          dictName: '部门类型',
          dictType: 'business',
          description: '部门分类',
          status: 'active',
          sort: 5,
          createdAt: '2025-01-20 10:00:00',
          updatedAt: '2025-01-20 10:00:00',
        },
        {
          id: '6',
          dictCode: 'job_type',
          dictName: '职位类型',
          dictType: 'business',
          description: '职位分类',
          status: 'active',
          sort: 6,
          createdAt: '2025-01-20 10:00:00',
          updatedAt: '2025-01-20 10:00:00',
        },
        {
          id: '7',
          dictCode: 'education_level',
          dictName: '学历',
          dictType: 'business',
          description: '学历水平',
          status: 'active',
          sort: 7,
          createdAt: '2025-01-20 10:00:00',
          updatedAt: '2025-01-20 10:00:00',
        },
        {
          id: '8',
          dictCode: 'leave_type',
          dictName: '请假类型',
          dictType: 'business',
          description: '请假分类',
          status: 'active',
          sort: 8,
          createdAt: '2025-01-20 10:00:00',
          updatedAt: '2025-01-20 10:00:00',
        },
        {
          id: '9',
          dictCode: 'training_type',
          dictName: '培训类型',
          dictType: 'business',
          description: '培训分类',
          status: 'active',
          sort: 9,
          createdAt: '2025-01-20 10:00:00',
          updatedAt: '2025-01-20 10:00:00',
        },
        {
          id: '10',
          dictCode: 'performance_level',
          dictName: '绩效等级',
          dictType: 'business',
          description: '绩效评定等级',
          status: 'active',
          sort: 10,
          createdAt: '2025-01-20 10:00:00',
          updatedAt: '2025-01-20 10:00:00',
        },
      ];
      
      setDictionaries(mockDictionaries);
      
      // 模拟字典数据
      const mockData: DictionaryData[] = [
        // 用户状态数据
        { id: '1-1', dictId: '1', dictCode: 'sys_user_status', dictLabel: '正常', dictValue: '0', dictType: 'sys', cssClass: 'bg-green-100 text-green-800', isDefault: true, status: 'active', sort: 1, createdAt: '2025-01-20 10:00:00', updatedAt: '2025-01-20 10:00:00' },
        { id: '1-2', dictId: '1', dictCode: 'sys_user_status', dictLabel: '停用', dictValue: '1', dictType: 'sys', cssClass: 'bg-red-100 text-red-800', isDefault: false, status: 'active', sort: 2, createdAt: '2025-01-20 10:00:00', updatedAt: '2025-01-20 10:00:00' },
        // 性别数据
        { id: '2-1', dictId: '2', dictCode: 'sys_gender', dictLabel: '男', dictValue: '1', dictType: 'sys', cssClass: 'bg-blue-100 text-blue-800', isDefault: false, status: 'active', sort: 1, createdAt: '2025-01-20 10:00:00', updatedAt: '2025-01-20 10:00:00' },
        { id: '2-2', dictId: '2', dictCode: 'sys_gender', dictLabel: '女', dictValue: '2', dictType: 'sys', cssClass: 'bg-pink-100 text-pink-800', isDefault: false, status: 'active', sort: 2, createdAt: '2025-01-20 10:00:00', updatedAt: '2025-01-20 10:00:00' },
        // 员工状态数据
        { id: '3-1', dictId: '3', dictCode: 'employee_status', dictLabel: '在职', dictValue: 'active', dictType: 'business', cssClass: 'bg-green-100 text-green-800', isDefault: true, status: 'active', sort: 1, createdAt: '2025-01-20 10:00:00', updatedAt: '2025-01-20 10:00:00' },
        { id: '3-2', dictId: '3', dictCode: 'employee_status', dictLabel: '试用期', dictValue: 'probation', dictType: 'business', cssClass: 'bg-yellow-100 text-yellow-800', isDefault: false, status: 'active', sort: 2, createdAt: '2025-01-20 10:00:00', updatedAt: '2025-01-20 10:00:00' },
        { id: '3-3', dictId: '3', dictCode: 'employee_status', dictLabel: '离职', dictValue: 'resigned', dictType: 'business', cssClass: 'bg-gray-100 text-gray-800', isDefault: false, status: 'active', sort: 3, createdAt: '2025-01-20 10:00:00', updatedAt: '2025-01-20 10:00:00' },
        // 员工职级数据
        { id: '4-1', dictId: '4', dictCode: 'employee_level', dictLabel: 'P1-初级专员', dictValue: 'P1', dictType: 'business', cssClass: 'bg-gray-100 text-gray-800', isDefault: false, status: 'active', sort: 1, createdAt: '2025-01-20 10:00:00', updatedAt: '2025-01-20 10:00:00' },
        { id: '4-2', dictId: '4', dictCode: 'employee_level', dictLabel: 'P2-专员', dictValue: 'P2', dictType: 'business', cssClass: 'bg-blue-100 text-blue-800', isDefault: false, status: 'active', sort: 2, createdAt: '2025-01-20 10:00:00', updatedAt: '2025-01-20 10:00:00' },
        { id: '4-3', dictId: '4', dictCode: 'employee_level', dictLabel: 'P3-高级专员', dictValue: 'P3', dictType: 'business', cssClass: 'bg-green-100 text-green-800', isDefault: false, status: 'active', sort: 3, createdAt: '2025-01-20 10:00:00', updatedAt: '2025-01-20 10:00:00' },
        { id: '4-4', dictId: '4', dictCode: 'employee_level', dictLabel: 'P4-主管', dictValue: 'P4', dictType: 'business', cssClass: 'bg-teal-100 text-teal-800', isDefault: false, status: 'active', sort: 4, createdAt: '2025-01-20 10:00:00', updatedAt: '2025-01-20 10:00:00' },
        { id: '4-5', dictId: '4', dictCode: 'employee_level', dictLabel: 'P5-经理', dictValue: 'P5', dictType: 'business', cssClass: 'bg-indigo-100 text-indigo-800', isDefault: false, status: 'active', sort: 5, createdAt: '2025-01-20 10:00:00', updatedAt: '2025-01-20 10:00:00' },
        { id: '4-6', dictId: '4', dictCode: 'employee_level', dictLabel: 'P6-高级经理', dictValue: 'P6', dictType: 'business', cssClass: 'bg-purple-100 text-purple-800', isDefault: false, status: 'active', sort: 6, createdAt: '2025-01-20 10:00:00', updatedAt: '2025-01-20 10:00:00' },
        // 绩效等级数据
        { id: '10-1', dictId: '10', dictCode: 'performance_level', dictLabel: 'S-卓越', dictValue: 'S', dictType: 'business', cssClass: 'bg-amber-100 text-amber-800', isDefault: false, status: 'active', sort: 1, createdAt: '2025-01-20 10:00:00', updatedAt: '2025-01-20 10:00:00' },
        { id: '10-2', dictId: '10', dictCode: 'performance_level', dictLabel: 'A-优秀', dictValue: 'A', dictType: 'business', cssClass: 'bg-green-100 text-green-800', isDefault: false, status: 'active', sort: 2, createdAt: '2025-01-20 10:00:00', updatedAt: '2025-01-20 10:00:00' },
        { id: '10-3', dictId: '10', dictCode: 'performance_level', dictLabel: 'B-良好', dictValue: 'B', dictType: 'business', cssClass: 'bg-blue-100 text-blue-800', isDefault: true, status: 'active', sort: 3, createdAt: '2025-01-20 10:00:00', updatedAt: '2025-01-20 10:00:00' },
        { id: '10-4', dictId: '10', dictCode: 'performance_level', dictLabel: 'C-合格', dictValue: 'C', dictType: 'business', cssClass: 'bg-yellow-100 text-yellow-800', isDefault: false, status: 'active', sort: 4, createdAt: '2025-01-20 10:00:00', updatedAt: '2025-01-20 10:00:00' },
        { id: '10-5', dictId: '10', dictCode: 'performance_level', dictLabel: 'D-不合格', dictValue: 'D', dictType: 'business', cssClass: 'bg-red-100 text-red-800', isDefault: false, status: 'active', sort: 5, createdAt: '2025-01-20 10:00:00', updatedAt: '2025-01-20 10:00:00' },
      ];
      
      setDictionaryData(mockData);
    } catch (error) {
      console.error('Failed to fetch dictionaries:', error);
      toast.error('加载数据字典失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDictionaries();
  }, [fetchDictionaries]);

  const filteredDictionaries = useMemo(() => {
    return dictionaries.filter(dict => {
      const matchesSearch = dict.dictCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dict.dictName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dict.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || dict.dictType === selectedType;
      const matchesStatus = statusFilter === 'all' || dict.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [dictionaries, searchTerm, selectedType, statusFilter]);

  const filteredDictionaryData = useMemo(() => {
    return dictionaryData.filter(data => {
      const matchesDict = !selectedDictId || data.dictId === selectedDictId;
      const matchesSearch = data.dictLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           data.dictValue.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || data.status === statusFilter;
      return matchesDict && matchesSearch && matchesStatus;
    });
  }, [dictionaryData, selectedDictId, searchTerm, statusFilter]);

  const getStatusBadge = (status: 'active' | 'inactive') => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800">启用</Badge>
    ) : (
      <Badge variant="secondary">禁用</Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; color: string }> = {
      sys: { label: '系统字典', color: 'bg-blue-100 text-blue-800' },
      business: { label: '业务字典', color: 'bg-green-100 text-green-800' },
      custom: { label: '自定义字典', color: 'bg-purple-100 text-purple-800' },
    };
    const config = typeMap[type] || { label: type, color: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const handleSelectDictionary = useCallback((dictId: string) => {
    setSelectedDictId(dictId);
    setActiveTab('data');
  }, []);

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
          <h1 className="text-3xl font-bold tracking-tight">数据字典管理</h1>
          <p className="text-muted-foreground mt-1">
            管理系统业务字典数据，统一数据标准
          </p>
        </div>
        <Button variant="outline" onClick={fetchDictionaries}>
          <RefreshCw className="mr-2 h-4 w-4" />
          刷新
        </Button>
      </div>

      <div className="flex gap-2">
        {dictTypeCategories.map((category) => {
          const Icon = category.icon;
          const count = category.id === 'all'
            ? dictionaries.length
            : dictionaries.filter(d => d.dictType === category.id).length;
          return (
            <Button
              key={category.id}
              variant={selectedType === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedType(category.id)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {category.name} ({count})
            </Button>
          );
        })}
      </div>

      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
        <TabsList>
          <TabsTrigger value="dictionaries">
            字典类型 ({filteredDictionaries.length})
          </TabsTrigger>
          <TabsTrigger value="data">
            字典数据 ({filteredDictionaryData.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dictionaries" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>字典类型列表</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索字典..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="active">启用</SelectItem>
                      <SelectItem value="inactive">禁用</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>字典编码</TableHead>
                    <TableHead>字典名称</TableHead>
                    <TableHead>字典类型</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>排序</TableHead>
                    <TableHead>数据量</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDictionaries.map((dict) => {
                    const dataCount = dictionaryData.filter(d => d.dictId === dict.id).length;
                    return (
                      <TableRow key={dict.id}>
                        <TableCell className="font-mono">{dict.dictCode}</TableCell>
                        <TableCell className="font-medium">{dict.dictName}</TableCell>
                        <TableCell>{getTypeBadge(dict.dictType)}</TableCell>
                        <TableCell className="text-muted-foreground">{dict.description}</TableCell>
                        <TableCell>{getStatusBadge(dict.status)}</TableCell>
                        <TableCell>{dict.sort}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSelectDictionary(dict.id)}
                          >
                            {dataCount}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSelectDictionary(dict.id)}
                            >
                              查看数据
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>字典数据列表</CardTitle>
                <div className="flex items-center gap-2">
                  {selectedDictId && (
                    <div className="flex items-center gap-2 mr-4">
                      <span className="text-sm text-muted-foreground">当前字典:</span>
                      <Badge>{dictionaries.find(d => d.id === selectedDictId)?.dictName}</Badge>
                    </div>
                  )}
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索数据..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="active">启用</SelectItem>
                      <SelectItem value="inactive">禁用</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>字典标签</TableHead>
                    <TableHead>字典值</TableHead>
                    <TableHead>样式类</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>默认值</TableHead>
                    <TableHead>排序</TableHead>
                    <TableHead>备注</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDictionaryData.map((data) => (
                    <TableRow key={data.id}>
                      <TableCell className="font-medium">
                        {data.cssClass ? (
                          <Badge className={data.cssClass}>{data.dictLabel}</Badge>
                        ) : (
                          <span>{data.dictLabel}</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono">{data.dictValue}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">
                        {data.cssClass}
                      </TableCell>
                      <TableCell>{getStatusBadge(data.status)}</TableCell>
                      <TableCell>
                        {data.isDefault && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </TableCell>
                      <TableCell>{data.sort}</TableCell>
                      <TableCell className="text-muted-foreground">{data.remark}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
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
    </div>
  );
}
