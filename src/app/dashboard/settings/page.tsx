'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building,
  Bell,
  Key,
  Shield,
  Settings,
  ChevronRight,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const settingsModules = [
    {
      title: '企业设置',
      description: '配置企业基本信息、联系方式、用工制度和法务信息',
      icon: Building,
      href: '/dashboard/settings/company',
      color: 'blue',
    },
    {
      title: '通知设置',
      description: '配置邮件、短信、推送等通知渠道和系统通知类型',
      icon: Bell,
      href: '/dashboard/settings/notifications',
      color: 'green',
    },
    {
      title: 'API管理',
      description: '管理API密钥、Webhook配置和查看API文档',
      icon: Key,
      href: '/dashboard/settings/api',
      color: 'purple',
    },
    {
      title: '安全设置',
      description: '配置密码策略、会话设置、双因素认证和登录安全',
      icon: Shield,
      href: '/dashboard/settings/security',
      color: 'orange',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings className="h-8 w-8 text-blue-600" />
            系统设置
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            配置企业系统各项参数和规则
          </p>
        </div>

        {/* 设置模块卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link key={module.href} href={module.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200 dark:hover:border-blue-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 ${colorClasses[module.color as keyof typeof colorClasses]} rounded-lg`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{module.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {module.description}
                          </CardDescription>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      进入设置
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* 快速入口 */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">快速配置向导</h3>
                  <p className="text-white/80 text-sm">首次使用？按照向导快速完成基本配置</p>
                </div>
              </div>
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-white/90">
                开始配置
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 提示信息 */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                <Settings className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  设置说明
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  系统设置修改后会立即生效。部分设置可能会影响所有用户，请谨慎操作。
                  建议在非工作时间进行重要配置的修改。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
