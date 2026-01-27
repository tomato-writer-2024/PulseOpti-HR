'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  Zap,
  Calendar,
  Target,
  Users,
  GraduationCap,
  Search,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/theme';

interface Rule {
  id: string;
  name: string;
  points: number;
  description: string;
  icon: string;
  enabled: boolean;
  dailyLimit: number;
}

export default function PointsRulesPage() {
  const [loading, setLoading] = useState(true);
  const [rules, setRules] = useState<Rule[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);

  const fetchRules = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/points?type=rules');
      const data = await response.json();
      if (data.success) {
        setRules(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch rules:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const filteredRules = rules.filter(rule =>
    rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, any> = {
      calendar: Calendar,
      target: Target,
      users: Users,
      'graduation-cap': GraduationCap,
    };
    return iconMap[iconName] || Zap;
  };

  const handleToggleRule = useCallback(async (ruleId: string, enabled: boolean) => {
    setRules(rules.map(rule =>
      rule.id === ruleId ? { ...rule, enabled } : rule
    ));
  }, [rules]);

  const handleDeleteRule = useCallback(async (ruleId: string) => {
    if (confirm('确定要删除这个规则吗？')) {
      setRules(rules.filter(rule => rule.id !== ruleId));
    }
  }, [rules]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">积分规则</h1>
          <p className="text-muted-foreground mt-1">
            管理和配置积分获取规则
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          添加规则
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索规则..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              筛选
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRules.map((rule) => {
          const IconComponent = getIconComponent(rule.icon);
          return (
            <Card key={rule.id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'p-2 rounded-lg',
                      rule.enabled ? 'bg-amber-100' : 'bg-gray-100'
                    )}>
                      <IconComponent className={cn(
                        'h-5 w-5',
                        rule.enabled ? 'text-amber-600' : 'text-gray-400'
                      )} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{rule.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {rule.description}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteRule(rule.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">积分奖励</p>
                      <p className="text-2xl font-bold text-amber-600">
                        +{rule.points}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">每日上限</p>
                      <p className="text-lg font-semibold">
                        {rule.dailyLimit || '无限制'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <Label htmlFor={`switch-${rule.id}`}>启用规则</Label>
                    <Switch
                      id={`switch-${rule.id}`}
                      checked={rule.enabled}
                      onCheckedChange={(checked) => handleToggleRule(rule.id, checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRules.length === 0 && !loading && (
        <Card className="p-12">
          <div className="text-center">
            <Zap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">没有找到规则</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? '尝试搜索其他关键词' : '开始添加第一个积分规则'}
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              添加规则
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
