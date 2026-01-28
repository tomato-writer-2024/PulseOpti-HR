'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/layout/page-header';
import {
  Crown,
  Zap,
  Check,
  X,
  Star,
  TrendingUp,
  Shield,
  Database,
  FileText,
  BarChart3,
  Users,
  Brain,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

// PRO功能列表
const proFeatures = [
  {
    category: '数据分析',
    features: [
      { name: '数据大屏', description: '实时监控企业人力资源关键指标', icon: BarChart3 },
      { name: '自定义报表', description: '灵活创建和管理个性化数据报表', icon: FileText },
      { name: '趋势分析', description: '多维度数据趋势预测和对比分析', icon: TrendingUp },
    ],
  },
  {
    category: '高级管理',
    features: [
      { name: '组织人才诊断', description: '九宫格人才盘点和继任者计划', icon: Users },
      { name: '绩效方案库', description: 'KPI/OKR模板库和数据分析', icon: Star },
      { name: '业务复盘助手', description: 'AI驱动的业务目标与人力匹配分析', icon: Brain },
    ],
  },
  {
    category: '权限与协作',
    features: [
      { name: '高级权限', description: '细粒度的角色和权限管理', icon: Shield },
      { name: '企业协作', description: '多企业数据隔离和协作管理', icon: Database },
      { name: 'API开放平台', description: '开放API接口，支持系统集成', icon: Zap },
    ],
  },
];

// 定价方案
const pricingPlans = [
  {
    name: '免费版',
    price: 0,
    period: '永久免费',
    description: '适合初创团队和小型企业',
    features: [
      { name: '员工管理', included: true },
      { name: '考勤管理', included: true },
      { name: '基础报表', included: true },
      { name: '数据大屏', included: false },
      { name: '自定义报表', included: false },
      { name: '组织人才诊断', included: false },
      { name: '业务复盘助手', included: false },
      { name: 'AI智能分析', included: false },
      { name: '高级权限', included: false },
      { name: '企业协作', included: false },
      { name: 'API开放平台', included: false },
      { name: '数据导出', included: false, limit: '限制导出' },
    ],
    cta: '当前使用',
    popular: false,
  },
  {
    name: '专业版',
    price: 299,
    period: '月',
    description: '适合成长型企业',
    features: [
      { name: '员工管理', included: true },
      { name: '考勤管理', included: true },
      { name: '基础报表', included: true },
      { name: '数据大屏', included: true },
      { name: '自定义报表', included: true },
      { name: '组织人才诊断', included: true },
      { name: '业务复盘助手', included: true },
      { name: 'AI智能分析', included: true, limit: '每月10次' },
      { name: '高级权限', included: true },
      { name: '企业协作', included: true, limit: '最多3个企业' },
      { name: 'API开放平台', included: false },
      { name: '数据导出', included: true, limit: '无限制' },
    ],
    cta: '立即升级',
    popular: true,
  },
  {
    name: '企业版',
    price: 999,
    period: '月',
    description: '适合大型企业和集团',
    features: [
      { name: '员工管理', included: true },
      { name: '考勤管理', included: true },
      { name: '基础报表', included: true },
      { name: '数据大屏', included: true },
      { name: '自定义报表', included: true },
      { name: '组织人才诊断', included: true },
      { name: '业务复盘助手', included: true },
      { name: 'AI智能分析', included: true, limit: '无限制' },
      { name: '高级权限', included: true },
      { name: '企业协作', included: true, limit: '无限制' },
      { name: 'API开放平台', included: true },
      { name: '数据导出', included: true, limit: '无限制' },
      { name: '专属客服', included: true },
      { name: '定制开发', included: true, limit: '按需' },
    ],
    cta: '联系销售',
    popular: false,
  },
];

// 常见问题
const faqs = [
  {
    question: 'PRO版包含哪些核心功能？',
    answer: 'PRO版包含数据大屏、自定义报表、组织人才诊断、业务复盘助手、AI智能分析等高级功能，帮助企业更好地管理人力资源，提升组织效能。',
  },
  {
    question: '可以随时取消订阅吗？',
    answer: '可以。您可以随时在账户设置中取消订阅，取消后当前周期结束前仍可继续使用PRO功能。',
  },
  {
    question: '支持企业版吗？如何获取报价？',
    answer: '支持企业版。企业版提供更多定制化服务和专属支持，请联系我们的销售团队获取详细报价。',
  },
  {
    question: 'AI智能分析功能如何使用？',
    answer: 'AI智能分析功能提供数据洞察、趋势预测、优化建议等能力。专业版每月提供10次AI分析机会，企业版无限制使用。',
  },
];

export default function UpgradePage() {
  const [selectedPlan, setSelectedPlan] = useState('专业版');
  const [annualBilling, setAnnualBilling] = useState(false);

  return (
    <div className="space-y-12 pb-12">
      {/* 页面标题 */}
      <PageHeader
        title="升级PRO"
        description="解锁高级功能，提升组织效能"
        breadcrumbs={[
          { name: '设置', href: '/settings' },
          { name: '升级PRO', href: '/settings/upgrade' },
        ]}
      />

      {/* PRO功能展示 */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">PRO功能亮点</h2>
          <p className="text-gray-600 dark:text-gray-400">
            助力企业实现数据驱动的智能化人力资源管理
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {proFeatures.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.features.map((feature, fIndex) => {
                    const Icon = feature.icon;
                    return (
                      <div key={fIndex} className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950/30">
                          <Icon className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{feature.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {feature.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 定价方案 */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">选择适合您的方案</h2>
          <p className="text-gray-600 dark:text-gray-400">
            透明定价，无隐藏费用
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative hover:shadow-xl transition-all ${
                plan.popular
                  ? 'border-2 border-purple-600 shadow-lg'
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    最受欢迎
                  </Badge>
                </div>
              )}

              <CardHeader>
                <div className="text-center">
                  <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">
                        {annualBilling && plan.price > 0
                          ? `¥${Math.round(plan.price * 0.8 * 12) / 12}`
                          : `¥${plan.price}`}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        /{plan.period}
                      </span>
                    </div>
                    {annualBilling && plan.price > 0 && (
                      <div className="text-sm text-green-600 mt-1">
                        年付立省20%
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm"
                    >
                      {feature.included ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={
                          feature.included
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-400'
                        }
                      >
                        {feature.name}
                        {feature.limit && (
                          <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                            （{feature.limit}）
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full mt-6 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => {
                    if (plan.name === '企业版') {
                      // 跳转到联系销售
                      window.open('mailto:sales@pulsopti.com', '_blank');
                    }
                  }}
                >
                  {plan.cta}
                  {plan.name !== '免费版' && plan.name !== '企业版' && (
                    <ArrowRight className="h-4 w-4 ml-2" />
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 常见问题 */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">常见问题</h2>
          <p className="text-gray-600 dark:text-gray-400">
            解答您关于升级的疑问
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600" />
                  {faq.question}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 联系我们 */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <CardContent className="pt-6">
          <div className="text-center">
            <Crown className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h3 className="text-xl font-bold mb-2">
              需要定制化解决方案？
            </h3>
            <p className="text-white/80 mb-4">
              联系我们的销售团队，获取企业版专属方案
            </p>
            <Button
              variant="secondary"
              onClick={() => window.open('mailto:sales@pulsopti.com', '_blank')}
            >
              联系销售
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
