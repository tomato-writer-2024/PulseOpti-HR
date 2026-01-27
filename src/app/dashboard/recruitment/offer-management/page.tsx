'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileCheck,
  DollarSign,
  Calendar,
  Search,
  Download,
  Send,
  Eye,
} from 'lucide-react';

interface Offer {
  id: string;
  candidateName: string;
  position: string;
  salary: string;
  startDate: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  createdAt: string;
}

export default function OfferManagementPage() {
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setOffers([
        {
          id: '1',
          candidateName: '张三',
          position: '高级前端工程师',
          salary: '35K',
          startDate: '2026-02-01',
          status: 'sent',
          createdAt: '2026-01-25',
        },
        {
          id: '2',
          candidateName: '李四',
          position: '产品经理',
          salary: '40K',
          startDate: '2026-02-15',
          status: 'accepted',
          createdAt: '2026-01-20',
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch offers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  if (loading) {
    return <div className="space-y-6"><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">录用管理</h1>
          <p className="text-muted-foreground mt-1">管理Offer发放和入职流程</p>
        </div>
        <Button><FileCheck className="mr-2 h-4 w-4" />创建Offer</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">草稿</p><p className="text-2xl font-bold">{offers.filter(o => o.status === 'draft').length}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">已发送</p><p className="text-2xl font-bold">{offers.filter(o => o.status === 'sent').length}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">已接受</p><p className="text-2xl font-bold">{offers.filter(o => o.status === 'accepted').length}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">已拒绝</p><p className="text-2xl font-bold">{offers.filter(o => o.status === 'rejected').length}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="搜索Offer..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {offers.map(offer => (
          <Card key={offer.id} className="hover:shadow-md transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{offer.candidateName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{offer.candidateName}</CardTitle>
                    <CardDescription>{offer.position}</CardDescription>
                  </div>
                </div>
                <Badge variant={
                  offer.status === 'draft' ? 'secondary' :
                  offer.status === 'sent' ? 'default' :
                  offer.status === 'accepted' ? 'default' :
                  'outline'
                }>
                  {offer.status === 'draft' ? '草稿' :
                   offer.status === 'sent' ? '已发送' :
                   offer.status === 'accepted' ? '已接受' : '已拒绝'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>{offer.salary}/月</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>入职: {offer.startDate}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileCheck className="h-4 w-4" />
                  <span>创建于 {offer.createdAt}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm"><Eye className="mr-2 h-4 w-4" />查看详情</Button>
                <Button size="sm" variant="outline"><Download className="mr-2 h-4 w-4" />下载PDF</Button>
                {offer.status === 'draft' && (
                  <Button size="sm" variant="outline" className="text-green-600"><Send className="mr-2 h-4 w-4" />发送Offer</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
