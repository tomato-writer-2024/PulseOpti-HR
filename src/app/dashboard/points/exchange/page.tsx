'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Gift,
  ShoppingBag,
  Search,
  Filter,
  Star,
  Package,
  Coffee,
  CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/theme';

interface Product {
  id: string;
  name: string;
  points: number;
  image: string;
  description: string;
  stock: number;
  enabled: boolean;
}

export default function PointsExchangePage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<'all' | 'food' | 'shopping' | 'health' | 'education'>('all');
  const [userPoints, setUserPoints] = useState(12500);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/points?type=products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = [
    { id: 'all', name: '全部', icon: ShoppingBag },
    { id: 'food', name: '餐饮', icon: Coffee },
    { id: 'shopping', name: '购物', icon: Package },
    { id: 'health', name: '健康', icon: Star },
    { id: 'education', name: '教育', icon: Gift },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all';
      return matchesSearch && matchesCategory && product.enabled;
    });
  }, [products, searchTerm, category]);

  const handleExchange = useCallback(async (product: Product) => {
    if (userPoints < product.points) {
      alert('积分不足，无法兑换');
      return;
    }
    
    if (product.stock <= 0) {
      alert('商品已售罄');
      return;
    }

    setSelectedProduct(product);
    if (confirm(`确定要兑换 "${product.name}" 吗？需要 ${product.points} 积分`)) {
      try {
        const response = await fetch('/api/points', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'spend',
            productId: product.id,
          }),
        });
        const data = await response.json();
        if (data.success) {
          setUserPoints(userPoints - product.points);
          alert('兑换成功！');
          setProducts(products.map(p =>
            p.id === product.id ? { ...p, stock: p.stock - 1 } : p
          ));
        }
      } catch (error) {
        console.error('Failed to exchange:', error);
        alert('兑换失败，请稍后重试');
      }
    }
    setSelectedProduct(null);
  }, [userPoints, products]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-40 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
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
          <h1 className="text-3xl font-bold tracking-tight">积分商城</h1>
          <p className="text-muted-foreground mt-1">
            使用积分兑换各种奖励和福利
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="flex items-center gap-3 py-4 px-6">
              <CreditCard className="h-6 w-6 text-amber-600" />
              <div>
                <p className="text-sm text-amber-900 font-medium">可用积分</p>
                <p className="text-2xl font-bold text-amber-600">
                  {userPoints.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索商品..."
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

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          return (
            <Button
              key={cat.id}
              variant={category === cat.id ? 'default' : 'outline'}
              onClick={() => setCategory(cat.id as any)}
              className="whitespace-nowrap"
            >
              <IconComponent className="mr-2 h-4 w-4" />
              {cat.name}
            </Button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                <Gift className="h-24 w-24 text-gray-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              {product.stock <= 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    已售罄
                  </Badge>
                </div>
              )}
            </div>
            <CardHeader>
              <div className="space-y-2">
                <CardTitle className="text-lg line-clamp-1">
                  {product.name}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {product.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-amber-600">
                    {product.points.toLocaleString()} 积分
                  </div>
                  <Badge variant="outline">
                    库存: {product.stock}
                  </Badge>
                </div>
                <Button
                  className="w-full"
                  disabled={userPoints < product.points || product.stock <= 0}
                  onClick={() => handleExchange(product)}
                >
                  {userPoints < product.points ? '积分不足' : 
                   product.stock <= 0 ? '已售罄' : '立即兑换'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <Card className="p-12">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">暂无商品</h3>
            <p className="text-muted-foreground">
              {searchTerm ? '尝试搜索其他商品' : '商城正在补充商品，敬请期待'}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
