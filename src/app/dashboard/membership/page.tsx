'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Crown,
  CheckCircle,
  X,
  Star,
  TrendingUp,
  Shield,
  Zap,
  Gift,
  Clock,
  Users,
  ArrowRight,
  Check,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { toast } from 'sonner';

type Plan = 'free' | 'basic' | 'professional' | 'enterprise';
type BillingCycle = 'monthly' | 'yearly';

interface PlanFeature {
  name: string;
  included: boolean;
  description?: string;
}

interface PricingPlan {
  id: Plan;
  name: string;
  price: number;
  yearlyPrice: number;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  badge?: string;
}

export default function MembershipPage() {
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<Plan>('free');

  const pricingPlans: PricingPlan[] = [
    {
      id: 'free',
      name: '免费版',
      price: 0,
      yearlyPrice: 0,
      description: '适合初创团队和小企业试用',
      features: [
        { name: '员工数量', included: true, description: '最多50人' },
        { name: '基础功能', included: true, description: '组织人事、考勤管理' },
        { name: '员工自助', included: true },
        { name: '基础报表', included: true },
        { name: '绩效管理', included: false },
        { name: '薪酬管理', included: false },
        { name: '培训管理', included: false },
        { name: '数据导出', included: false },
        { name: '高级权限', included: false },
        { name: '企业协作', included: false },
        { name: 'AI助手', included: false },
        { name: '专属客服', included: false },
      ],
    },
    {
      id: 'basic',
      name: '基础版',
      price: 299,
      yearlyPrice: 2990,
      description: '适合成长期企业',
      features: [
        { name: '员工数量', included: true, description: '最多200人' },
        { name: '基础功能', included: true },
        { name: '员工自助', included: true },
        { name: '基础报表', included: true },
        { name: '绩效管理', included: true },
        { name: '薪酬管理', included: true },
        { name: '培训管理', included: true },
        { name: '数据导出', included: false },
        { name: '高级权限', included: false },
        { name: '企业协作', included: false },
        { name: 'AI助手', included: false },
        { name: '专属客服', included: true, description: '工作时间' },
      ],
      badge: '推荐',
    },
    {
      id: 'professional',
      name: '专业版',
      price: 899,
      yearlyPrice: 8990,
      description: '适合中型企业和快速成长企业',
      popular: true,
      badge: 'PRO',
      features: [
        { name: '员工数量', included: true, description: '最多1000人' },
        { name: '基础功能', included: true },
        { name: '员工自助', included: true },
        { name: '基础报表', included: true },
        { name: '绩效管理', included: true, description: '包含360度评估' },
        { name: '薪酬管理', included: true, description: '全功能' },
        { name: '培训管理', included: true },
        { name: '数据导出', included: true, description: '多种格式' },
        { name: '高级权限', included: true, description: '企业级权限' },
        { name: '企业协作', included: true, description: '钉钉/飞书/企业微信' },
        { name: 'AI助手', included: true, description: '基础功能' },
        { name: '专属客服', included: true, description: '7x24小时' },
      ],
    },
    {
      id: 'enterprise',
      name: '企业版',
      price: 2999,
      yearlyPrice: 29990,
      description: '适合大型企业和集团企业',
      badge: '企业',
      features: [
        { name: '员工数量', included: true, description: '不限人数' },
        { name: '基础功能', included: true },
        { name: '员工自助', included: true },
        { name: '基础报表', included: true, description: '定制化报表' },
        { name: '绩效管理', included: true, description: '高级功能+OKR' },
        { name: '薪酬管理', included: true, description: '全功能+薪酬设计' },
        { name: '培训管理', included: true },
        { name: '数据导出', included: true, description: 'API接口' },
        { name: '高级权限', included: true, description: '定制权限' },
        { name: '企业协作', included: true, description: '全平台集成' },
        { name: 'AI助手', included: true, description: '全部功能' },
        { name: '专属客服', included: true, description: '专属顾问' },
        { name: '私有化部署', included: true },
        { name: '定制开发', included: true },
      ],
    },
  ];

  const getDisplayPrice = (plan: PricingPlan) => {
    return selectedCycle === 'yearly' ? plan.yearlyPrice : plan.price;
  };

  const getDiscount = () => {
    return selectedCycle === 'yearly' ? '年付省17%' : '';
  };

  const handleSubscribe = (planId: Plan) => {
    setSelectedPlan(planId);
    if (planId === 'free') {
      toast.success('已切换到免费版');
    } else {
      toast.success(`已选择${pricingPlans.find(p => p.id === planId)?.name}，跳转支付...`);
      // 实际场景中会跳转到支付页面
      setTimeout(() => {
        window.location.href = `/dashboard/billing/payment?plan=${planId}&cycle=${selectedCycle}`;
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 页面标题 */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Crown className="h-10 w-10 text-amber-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              选择您的订阅计划
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            解锁企业级人力资源管理系统，提升组织效能，助力业务增长
          </p>
        </div>

        {/* 计费周期选择 */}
        <div className="flex items-center justify-center gap-4">
          <Select value={selectedCycle} onValueChange={(v: BillingCycle) => setSelectedCycle(v)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">月付</SelectItem>
              <SelectItem value="yearly">
                <div className="flex items-center gap-2">
                  <span>年付</span>
                  <Badge className="bg-green-600">省17%</Badge>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {getDiscount()}
          </span>
        </div>

        {/* 定价卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan) => {
            const displayPrice = getDisplayPrice(plan);
            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 ${
                  plan.popular ? 'border-2 border-blue-600 shadow-xl' : ''
                } ${selectedPlan === plan.id ? 'ring-2 ring-blue-600' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                    最受欢迎
                  </div>
                )}
                {plan.badge && !plan.popular && (
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600">
                    {plan.badge}
                  </Badge>
                )}
                <CardHeader className="pt-6 pb-4">
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    {displayPrice === 0 ? (
                      <div className="text-3xl font-bold">免费</div>
                    ) : (
                      <div>
                        <span className="text-4xl font-bold">¥{displayPrice}</span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">
                          /{selectedCycle === 'yearly' ? '年' : '月'}
                        </span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        {feature.included ? (
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className={feature.included ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                            {feature.name}
                          </span>
                          {feature.description && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {feature.description}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full mt-6"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {selectedPlan === plan.id ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        已选择
                      </>
                    ) : (
                      <>
                        {displayPrice === 0 ? '免费使用' : '立即订阅'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 功能对比 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">功能对比</CardTitle>
            <CardDescription>详细了解各版本功能差异</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="coe">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="coe">COE中心</TabsTrigger>
                <TabsTrigger value="hrbp">HRBP中心</TabsTrigger>
                <TabsTrigger value="ssc">SSC中心</TabsTrigger>
                <TabsTrigger value="premium">高级功能</TabsTrigger>
                <TabsTrigger value="support">服务支持</TabsTrigger>
              </TabsList>
              <TabsContent value="coe" className="mt-6">
                <div className="grid grid-cols-5 gap-4 text-sm">
                  <div className="font-semibold">功能</div>
                  <div className="font-semibold">免费版</div>
                  <div className="font-semibold">基础版</div>
                  <div className="font-semibold text-blue-600">专业版</div>
                  <div className="font-semibold text-purple-600">企业版</div>

                  <div className="py-2">目标设定</div>
                  <div className="py-2 text-center"><X className="h-4 w-4 text-gray-400 mx-auto" /></div>
                  <div className="py-2 text-center"><Check className="h-4 w-4 text-green-600 mx-auto" /></div>
                  <div className="py-2 text-center"><Check className="h-4 w-4 text-green-600 mx-auto" /></div>
                  <div className="py-2 text-center"><Check className="h-4 w-4 text-green-600 mx-auto" /></div>

                  <div className="py-2">绩效评估</div>
                  <div className="py-2 text-center"><X className="h-4 w-4 text-gray-400 mx-auto" /></div>
                  <div className="py-2 text-center"><Check className="h-4 w-4 text-green-600 mx-auto" /></div>
                  <div className="py-2 text-center"><Check className="h-4 w-4 text-green-600 mx-auto" /></div>
                  <div className="py-2 text-center"><Check className="h-4 w-4 text-green-600 mx-auto" /></div>

                  <div className="py-2">360度评估</div>
                  <div className="py-2 text-center"><X className="h-4 w-4 text-gray-400 mx-auto" /></div>
                  <div className="py-2 text-center"><X className="h-4 w-4 text-gray-400 mx-auto" /></div>
                  <div className="py-2 text-center"><Check className="h-4 w-4 text-green-600 mx-auto" /></div>
                  <div className="py-2 text-center"><Check className="h-4 w-4 text-green-600 mx-auto" /></div>

                  <div className="py-2">薪酬核算</div>
                  <div className="py-2 text-center"><X className="h-4 w-4 text-gray-400 mx-auto" /></div>
                  <div className="py-2 text-center"><Check className="h-4 w-4 text-green-600 mx-auto" /></div>
                  <div className="py-2 text-center"><Check className="h-4 w-4 text-green-600 mx-auto" /></div>
                  <div className="py-2 text-center"><Check className="h-4 w-4 text-green-600 mx-auto" /></div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 常见问题 */}
        <Card>
          <CardHeader>
            <CardTitle>常见问题</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="font-semibold flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-600" />
                如何切换订阅计划？
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                您可以随时在会员中心切换订阅计划。升级立即生效，降级将在当前计费周期结束后生效。
              </p>
            </div>
            <div className="space-y-2">
              <div className="font-semibold flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-600" />
                年付有什么优惠？
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                年付可享受17%的折扣，相当于只需支付10个月的价格即可使用12个月。
              </p>
            </div>
            <div className="space-y-2">
              <div className="font-semibold flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-600" />
                可以申请退款吗？
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                我们提供7天无理由退款服务。如果您不满意，可在购买后7天内申请全额退款。
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 企业专属服务 */}
        <Alert className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <Crown className="h-4 w-4 text-purple-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-purple-900 dark:text-purple-100">企业专属服务</strong>
                <span className="ml-2">：提供私有化部署、定制开发、专属顾问等企业级服务</span>
              </div>
              <Button variant="link" className="h-auto p-0 text-purple-600" asChild>
                <a href="mailto:enterprise@pulseopti.com">
                  联系我们 <ArrowRight className="h-4 w-4 ml-1 inline" />
                </a>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
