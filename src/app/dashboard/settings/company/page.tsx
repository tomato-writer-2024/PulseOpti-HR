'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Building,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Users,
  DollarSign,
  Globe,
  Shield,
  Save,
  Upload,
  Download,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

interface CompanySettings {
  basic: {
    name: string;
    code: string;
    logo: string;
    description: string;
    industry: string;
    scale: string;
    foundedYear: string;
    website: string;
  };
  contact: {
    address: string;
    city: string;
    province: string;
    postalCode: string;
    phone: string;
    email: string;
  };
  employment: {
    employeeCount: number;
    departmentCount: number;
    workingDays: string;
    workingHours: string;
    probationPeriod: number;
    noticePeriod: number;
  };
  legal: {
    businessLicense: string;
    taxId: string;
    bankName: string;
    bankAccount: string;
    legalRepresentative: string;
  };
}

export default function SettingsCompanyPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState<CompanySettings>({
    basic: {
      name: 'PulseOpti HR 脉策聚效',
      code: 'PULSE-001',
      logo: '',
      description: '赋能中小企业的智能人力资源管理SaaS平台',
      industry: '互联网',
      scale: '51-100人',
      foundedYear: '2023',
      website: 'https://pulseopti.com',
    },
    contact: {
      address: '北京市朝阳区',
      city: '北京市',
      province: '北京市',
      postalCode: '100000',
      phone: '010-12345678',
      email: 'contact@pulseopti.com',
    },
    employment: {
      employeeCount: 68,
      departmentCount: 12,
      workingDays: '周一至周五',
      workingHours: '09:00-18:00',
      probationPeriod: 3,
      noticePeriod: 30,
    },
    legal: {
      businessLicense: '91110000MA12345678',
      taxId: '91110000MA12345678',
      bankName: '中国工商银行',
      bankAccount: '6222020200012345678',
      legalRepresentative: '张三',
    },
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success('企业设置已保存');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Building className="h-8 w-8 text-blue-600" />
              企业设置
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              配置企业基本信息和规章制度
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            {saving ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                保存设置
              </>
            )}
          </Button>
        </div>

        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              基本信息
            </CardTitle>
            <CardDescription>配置企业的基本信息和对外展示信息</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>企业名称 *</Label>
                  <Input
                    value={settings.basic.name}
                    onChange={(e) => setSettings({
                      ...settings,
                      basic: { ...settings.basic, name: e.target.value }
                    })}
                    placeholder="输入企业名称"
                  />
                </div>

                <div className="space-y-2">
                  <Label>企业代码</Label>
                  <Input
                    value={settings.basic.code}
                    onChange={(e) => setSettings({
                      ...settings,
                      basic: { ...settings.basic, code: e.target.value }
                    })}
                    placeholder="输入企业代码"
                  />
                </div>

                <div className="space-y-2">
                  <Label>企业描述</Label>
                  <Textarea
                    value={settings.basic.description}
                    onChange={(e) => setSettings({
                      ...settings,
                      basic: { ...settings.basic, description: e.target.value }
                    })}
                    placeholder="简要描述企业业务和愿景"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>所属行业</Label>
                    <Select
                      value={settings.basic.industry}
                      onValueChange={(v) => setSettings({
                        ...settings,
                        basic: { ...settings.basic, industry: v }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="互联网">互联网</SelectItem>
                        <SelectItem value="金融">金融</SelectItem>
                        <SelectItem value="制造业">制造业</SelectItem>
                        <SelectItem value="零售">零售</SelectItem>
                        <SelectItem value="教育">教育</SelectItem>
                        <SelectItem value="医疗">医疗</SelectItem>
                        <SelectItem value="其他">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>企业规模</Label>
                    <Select
                      value={settings.basic.scale}
                      onValueChange={(v) => setSettings({
                        ...settings,
                        basic: { ...settings.basic, scale: v }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10人">1-10人</SelectItem>
                        <SelectItem value="11-50人">11-50人</SelectItem>
                        <SelectItem value="51-100人">51-100人</SelectItem>
                        <SelectItem value="101-500人">101-500人</SelectItem>
                        <SelectItem value="500人以上">500人以上</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>成立年份</Label>
                    <Input
                      type="number"
                      value={settings.basic.foundedYear}
                      onChange={(e) => setSettings({
                        ...settings,
                        basic: { ...settings.basic, foundedYear: e.target.value }
                      })}
                      placeholder="输入成立年份"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>官网地址</Label>
                    <Input
                      value={settings.basic.website}
                      onChange={(e) => setSettings({
                        ...settings,
                        basic: { ...settings.basic, website: e.target.value }
                      })}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>企业Logo</Label>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      上传Logo
                    </Button>
                    {settings.basic.logo && (
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        下载Logo
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    建议尺寸：200x200px，支持PNG、JPG格式，大小不超过2MB
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg">
                <h3 className="font-semibold mb-4 text-blue-600">企业信息预览</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">{settings.basic.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{settings.basic.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span>{settings.basic.industry} • {settings.basic.scale}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>成立于 {settings.basic.foundedYear}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <a href={settings.basic.website} className="text-blue-600 hover:underline">
                        {settings.basic.website}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 联系信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              联系信息
            </CardTitle>
            <CardDescription>配置企业的联系方式和地址信息</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>详细地址</Label>
                <Input
                  value={settings.contact.address}
                  onChange={(e) => setSettings({
                    ...settings,
                    contact: { ...settings.contact, address: e.target.value }
                  })}
                  placeholder="输入详细地址"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>省份</Label>
                  <Select
                    value={settings.contact.province}
                    onValueChange={(v) => setSettings({
                      ...settings,
                      contact: { ...settings.contact, province: v }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="北京市">北京市</SelectItem>
                      <SelectItem value="上海市">上海市</SelectItem>
                      <SelectItem value="广东省">广东省</SelectItem>
                      <SelectItem value="浙江省">浙江省</SelectItem>
                      <SelectItem value="江苏省">江苏省</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>城市</Label>
                  <Input
                    value={settings.contact.city}
                    onChange={(e) => setSettings({
                      ...settings,
                      contact: { ...settings.contact, city: e.target.value }
                    })}
                    placeholder="输入城市"
                  />
                </div>

                <div className="space-y-2">
                  <Label>邮政编码</Label>
                  <Input
                    value={settings.contact.postalCode}
                    onChange={(e) => setSettings({
                      ...settings,
                      contact: { ...settings.contact, postalCode: e.target.value }
                    })}
                    placeholder="输入邮政编码"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>联系电话</Label>
                  <Input
                    value={settings.contact.phone}
                    onChange={(e) => setSettings({
                      ...settings,
                      contact: { ...settings.contact, phone: e.target.value }
                    })}
                    placeholder="输入联系电话"
                  />
                </div>

                <div className="space-y-2">
                  <Label>企业邮箱</Label>
                  <Input
                    type="email"
                    value={settings.contact.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      contact: { ...settings.contact, email: e.target.value }
                    })}
                    placeholder="输入企业邮箱"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 用工制度 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              用工制度
            </CardTitle>
            <CardDescription>配置企业的用工制度和考勤规则</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>员工数量</Label>
                <Input
                  type="number"
                  value={settings.employment.employeeCount}
                  onChange={(e) => setSettings({
                    ...settings,
                    employment: { ...settings.employment, employeeCount: parseInt(e.target.value) }
                  })}
                  placeholder="输入员工数量"
                />
              </div>

              <div className="space-y-2">
                <Label>部门数量</Label>
                <Input
                  type="number"
                  value={settings.employment.departmentCount}
                  onChange={(e) => setSettings({
                    ...settings,
                    employment: { ...settings.employment, departmentCount: parseInt(e.target.value) }
                  })}
                  placeholder="输入部门数量"
                />
              </div>

              <div className="space-y-2">
                <Label>工作日</Label>
                <Select
                  value={settings.employment.workingDays}
                  onValueChange={(v) => setSettings({
                    ...settings,
                    employment: { ...settings.employment, workingDays: v }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="周一至周五">周一至周五</SelectItem>
                    <SelectItem value="周一至周六">周一至周六</SelectItem>
                    <SelectItem value="排班制">排班制</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>工作时间</Label>
                <Input
                  value={settings.employment.workingHours}
                  onChange={(e) => setSettings({
                    ...settings,
                    employment: { ...settings.employment, workingHours: e.target.value }
                  })}
                  placeholder="如：09:00-18:00"
                />
              </div>

              <div className="space-y-2">
                <Label>试用期（月）</Label>
                <Input
                  type="number"
                  value={settings.employment.probationPeriod}
                  onChange={(e) => setSettings({
                    ...settings,
                    employment: { ...settings.employment, probationPeriod: parseInt(e.target.value) }
                  })}
                  placeholder="输入试用期月数"
                />
              </div>

              <div className="space-y-2">
                <Label>通知期（天）</Label>
                <Input
                  type="number"
                  value={settings.employment.noticePeriod}
                  onChange={(e) => setSettings({
                    ...settings,
                    employment: { ...settings.employment, noticePeriod: parseInt(e.target.value) }
                  })}
                  placeholder="输入通知期天数"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 法务信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-600" />
              法务信息
            </CardTitle>
            <CardDescription>配置企业的法务和财务信息</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>营业执照号</Label>
                <Input
                  value={settings.legal.businessLicense}
                  onChange={(e) => setSettings({
                    ...settings,
                    legal: { ...settings.legal, businessLicense: e.target.value }
                  })}
                  placeholder="输入营业执照号"
                />
              </div>

              <div className="space-y-2">
                <Label>纳税人识别号</Label>
                <Input
                  value={settings.legal.taxId}
                  onChange={(e) => setSettings({
                    ...settings,
                    legal: { ...settings.legal, taxId: e.target.value }
                  })}
                  placeholder="输入纳税人识别号"
                />
              </div>

              <div className="space-y-2">
                <Label>开户银行</Label>
                <Input
                  value={settings.legal.bankName}
                  onChange={(e) => setSettings({
                    ...settings,
                    legal: { ...settings.legal, bankName: e.target.value }
                  })}
                  placeholder="输入开户银行"
                />
              </div>

              <div className="space-y-2">
                <Label>银行账号</Label>
                <Input
                  value={settings.legal.bankAccount}
                  onChange={(e) => setSettings({
                    ...settings,
                    legal: { ...settings.legal, bankAccount: e.target.value }
                  })}
                  placeholder="输入银行账号"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>法定代表人</Label>
                <Input
                  value={settings.legal.legalRepresentative}
                  onChange={(e) => setSettings({
                    ...settings,
                    legal: { ...settings.legal, legalRepresentative: e.target.value }
                  })}
                  placeholder="输入法定代表人姓名"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 提示信息 */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  提示
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  企业设置保存后将同步到所有相关模块，包括劳动合同、薪资发放、税务申报等。
                  请确保信息的准确性和完整性。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
