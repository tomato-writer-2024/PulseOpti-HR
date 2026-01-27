'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Search,
  Filter,
  Download,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/theme';

interface PointsRecord {
  id: string;
  type: 'earn' | 'spend';
  points: number;
  reason: string;
  createdAt: Date;
}

export default function PointsRecordsPage() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<PointsRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'earn' | 'spend'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecords = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/points?type=records');
      const data = await response.json();
      if (data.success) {
        setRecords(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch records:', error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleRefresh = useCallback(() => {
    fetchRecords();
  }, [fetchRecords]);

  const filteredRecords = useMemo(() => {
    return records
      .filter(record => {
        const matchesSearch = record.reason.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || record.type === filterType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [records, searchTerm, filterType]);

  const stats = useMemo(() => {
    const totalEarned = records
      .filter(r => r.type === 'earn')
      .reduce((sum, r) => sum + r.points, 0);
    const totalSpent = records
      .filter(r => r.type === 'spend')
      .reduce((sum, r) => sum + Math.abs(r.points), 0);
    const currentBalance = totalEarned - totalSpent;
    
    return {
      totalEarned,
      totalSpent,
      currentBalance,
      totalCount: records.length,
    };
  }, [records]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full mb-3 last:mb-0" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">积分明细</h1>
          <p className="text-muted-foreground mt-1">
            查看您的积分历史记录
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
          >
            <RefreshCw
              className={cn('mr-2 h-4 w-4', refreshing && 'animate-spin')}
            />
            刷新
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              当前余额
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.currentBalance.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              积分
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              累计获得
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              +{stats.totalEarned.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              积分
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              累计消费
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              -{stats.totalSpent.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              积分
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>记录筛选</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索记录..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="earn">获得</SelectItem>
                  <SelectItem value="spend">消费</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                高级筛选
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>积分记录</CardTitle>
              <CardDescription>
                共 {filteredRecords.length} 条记录
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'p-3 rounded-full',
                    record.type === 'earn' ? 'bg-green-100' : 'bg-red-100'
                  )}>
                    {record.type === 'earn' ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{record.reason}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(record.createdAt).toLocaleDateString('zh-CN')}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(record.createdAt).toLocaleTimeString('zh-CN')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={record.type === 'earn' ? 'default' : 'secondary'}>
                    {record.type === 'earn' ? '获得' : '消费'}
                  </Badge>
                  <div className={cn(
                    'text-xl font-bold min-w-[80px] text-right',
                    record.type === 'earn' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {record.points > 0 ? '+' : ''}{record.points}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">暂无记录</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterType !== 'all'
                  ? '尝试调整筛选条件'
                  : '开始使用积分系统来生成记录'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
