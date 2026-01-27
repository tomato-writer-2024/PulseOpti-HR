'use client';

import { useState, useCallback, useMemo, ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/theme';
import { useDebounce } from '@/hooks/use-performance';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, record: T, index: number) => ReactNode;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface DataTableFiltersProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchableKeys?: (keyof T)[];
  filters?: { key: keyof T; options: FilterOption[]; label: string }[];
  renderItem: (item: T, index: number) => ReactNode;
  emptyMessage?: string;
  loading?: boolean;
  onRefresh?: () => void;
}

export function DataTableFilters<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  searchableKeys,
  filters = [],
  renderItem,
  emptyMessage = '暂无数据',
  loading = false,
  onRefresh,
}: DataTableFiltersProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const debouncedSearch = useDebounce(searchQuery, 300);

  // 筛选和排序数据
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // 搜索过滤
    if (debouncedSearch && searchableKeys) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter((item) =>
        searchableKeys.some((key) => {
          const value = item[key];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(query);
          }
          if (typeof value === 'number') {
            return value.toString().includes(query);
          }
          return false;
        })
      );
    }

    // 状态过滤
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter((item) => item[key] === value);
      }
    });

    // 排序
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          const comparison = aVal.localeCompare(bVal, 'zh');
          return sortDirection === 'asc' ? comparison : -comparison;
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }

        return 0;
      });
    }

    return result;
  }, [data, debouncedSearch, searchableKeys, activeFilters, sortKey, sortDirection]);

  // 处理排序
  const handleSort = useCallback((key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  }, [sortKey, sortDirection]);

  // 重置所有筛选
  const handleReset = useCallback(() => {
    setSearchQuery('');
    setActiveFilters({});
    setSortKey(null);
    setSortDirection('desc');
  }, []);

  return (
    <div className="space-y-4">
      {/* 筛选栏 */}
      <div className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
        {/* 搜索框 */}
        {searchable && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* 筛选器 */}
        {filters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            {filters.map((filter) => (
              <Select
                key={String(filter.key)}
                value={activeFilters[String(filter.key)] || 'all'}
                onValueChange={(value) =>
                  setActiveFilters((prev) => ({ ...prev, [String(filter.key)]: value }))
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部{filter.label}</SelectItem>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex items-center gap-2 ml-auto">
          {(searchQuery || Object.keys(activeFilters).length > 0 || sortKey) && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              重置
            </Button>
          )}
          {onRefresh && (
            <Button variant="ghost" size="icon" onClick={onRefresh} disabled={loading}>
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            </Button>
          )}
        </div>
      </div>

      {/* 数据展示 */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          加载中...
        </div>
      ) : filteredAndSortedData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <p>{emptyMessage}</p>
          {(searchQuery || Object.keys(activeFilters).length > 0) && (
            <Button variant="outline" size="sm" className="mt-4" onClick={handleReset}>
              清除筛选条件
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          {filteredAndSortedData.map((item, index) => renderItem(item, index))}
        </div>
      )}

      {/* 统计信息 */}
      <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
        共 {filteredAndSortedData.length} 条记录
      </div>
    </div>
  );
}
