'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Clock, MapPin, CheckCircle2, XCircle, AlertCircle, TrendingUp, TrendingDown, Calendar as CalendarIcon, Filter, Search, User } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface ClockRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  location: string;
  status: 'normal' | 'late' | 'early' | 'absent' | 'leave';
  workHours: number;
  overtimeHours: number;
  notes?: string;
}

export default function ClockInPage() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  const [records, setRecords] = useState<ClockRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<ClockRecord | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      setRecords([
        {
          id: '1',
          employeeId: 'EMP001',
          employeeName: '张三',
          date: '2024-04-27',
          clockIn: '08:55',
          clockOut: '18:05',
          location: '北京总部',
          status: 'normal',
          workHours: 9.17,
          overtimeHours: 0.17,
        },
        {
          id: '2',
          employeeId: 'EMP002',
          employeeName: '李四',
          date: '2024-04-27',
          clockIn: '09:15',
          clockOut: '18:00',
          location: '上海分公司',
          status: 'late',
          workHours: 8.75,
          overtimeHours: 0,
          notes: '交通拥堵',
        },
        {
          id: '3',
          employeeId: 'EMP003',
          employeeName: '王五',
          date: '2024-04-27',
          clockIn: '09:00',
          clockOut: '17:30',
          location: '北京总部',
          status: 'early',
          workHours: 8.5,
          overtimeHours: 0,
          notes: '家有急事',
        },
        {
          id: '4',
          employeeId: 'EMP004',
          employeeName: '赵六',
          date: '2024-04-27',
          clockIn: null,
          clockOut: null,
          location: '深圳分公司',
          status: 'leave',
          workHours: 0,
          overtimeHours: 0,
          notes: '年假',
        },
        {
          id: '5',
          employeeId: 'EMP005',
          employeeName: '钱七',
          date: '2024-04-27',
          clockIn: null,
          clockOut: null,
          location: '北京总部',
          status: 'absent',
          workHours: 0,
          overtimeHours: 0,
          notes: '未请假',
        },
        {
          id: '6',
          employeeId: 'EMP001',
          employeeName: '张三',
          date: '2024-04-26',
          clockIn: '08:50',
          clockOut: '19:00',
          location: '北京总部',
          status: 'normal',
          workHours: 10.17,
          overtimeHours: 1.17,
        },
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredRecords = useMemo(() => {
    let filtered = [...records];

    if (debouncedSearch) {
      filtered = filtered.filter(record =>
        record.employeeName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        record.location.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    return filtered;
  }, [records, debouncedSearch, statusFilter]);

  const stats = useMemo(() => {
    const total = filteredRecords.length;
    const normal = filteredRecords.filter(r => r.status === 'normal').length;
    const late = filteredRecords.filter(r => r.status === 'late').length;
    const absent = filteredRecords.filter(r => r.status === 'absent').length;
    const avgWorkHours = filteredRecords.reduce((sum, r) => sum + r.workHours, 0) / total || 0;
    const totalOvertime = filteredRecords.reduce((sum, r) => sum + r.overtimeHours, 0);

    return { total, normal, late, absent, avgWorkHours, totalOvertime };
  }, [filteredRecords]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive'; icon: any }> = {
      normal: { label: '正常', variant: 'default', icon: CheckCircle2 },
      late: { label: '迟到', variant: 'secondary', icon: AlertCircle },
      early: { label: '早退', variant: 'secondary', icon: AlertCircle },
      absent: { label: '缺勤', variant: 'destructive', icon: XCircle },
      leave: { label: '请假', variant: 'secondary', icon: Clock },
    };
    const { label, variant, icon: Icon } = statusMap[status] || statusMap.normal;
    return <Badge variant={variant}><Icon className="h-3 w-3 mr-1" />{label}</Badge>;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      normal: 'text-green-600',
      late: 'text-orange-600',
      early: 'text-orange-600',
      absent: 'text-red-600',
      leave: 'text-blue-600',
    };
    return colorMap[status] || 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 animate-pulse bg-muted rounded" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
        <div className="h-96 animate-pulse bg-muted rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">打卡记录</h1>
          <p className="text-muted-foreground mt-1">查看和管理员工考勤打卡记录</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            高级筛选
          </Button>
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            导出记录
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">记录总数</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">所有打卡记录</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">正常出勤</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.normal}</div>
            <p className="text-xs text-muted-foreground mt-1">
              占比 {((stats.normal / stats.total) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">迟到记录</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.late}</div>
            <p className="text-xs text-muted-foreground mt-1">
              占比 {((stats.late / stats.total) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均工时</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgWorkHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground mt-1">每日平均</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总加班</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalOvertime.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground mt-1">累计加班时长</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>打卡记录列表 ({filteredRecords.length})</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索员工姓名或地点..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="normal">正常</SelectItem>
                  <SelectItem value="late">迟到</SelectItem>
                  <SelectItem value="early">早退</SelectItem>
                  <SelectItem value="absent">缺勤</SelectItem>
                  <SelectItem value="leave">请假</SelectItem>
                </SelectContent>
              </Select>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {format(dateRange.from, 'yyyy-MM-dd')} ~ {format(dateRange.to, 'yyyy-MM-dd')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range: any) => {
                      if (range?.from && range?.to) {
                        setDateRange(range);
                        setIsCalendarOpen(false);
                      }
                    }}
                    locale={zhCN}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              没有找到匹配的打卡记录
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div
                  key={record.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedRecord(record)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                        {record.employeeName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{record.employeeName}</h3>
                        <p className="text-sm text-muted-foreground">{record.date}</p>
                      </div>
                    </div>
                    {getStatusBadge(record.status)}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">上班打卡</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{record.clockIn || '--:--'}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">下班打卡</p>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="font-medium">{record.clockOut || '--:--'}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">工作时长</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{record.workHours > 0 ? `${record.workHours.toFixed(1)}小时` : '--'}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">地点</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-sm">{record.location}</span>
                      </div>
                    </div>
                  </div>

                  {record.overtimeHours > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <TrendingUp className="h-4 w-4" />
                        <span>加班 {record.overtimeHours.toFixed(1)} 小时</span>
                      </div>
                    </div>
                  )}

                  {record.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-muted-foreground">
                        备注: {record.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
