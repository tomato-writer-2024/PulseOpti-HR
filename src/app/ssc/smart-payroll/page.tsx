'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PageHeader, createProPageHeader } from '@/components/layout/page-header';
import {
  Calculator,
  CreditCard,
  FileText,
  Shield,
  Download,
  Eye,
  EyeOff,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  DollarSign,
  Percent,
  Calendar,
  CheckCircle,
  AlertCircle,
  Lock,
  Unlock,
  PieChart,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';

// 薪资数据
const payrollData = {
  currentSalary: {
    basic: 15000,
    performance: 3000,
    allowance: 2000,
    subsidy: 500,
    total: 20500,
  },
  deductions: {
    socialInsurance: {
      pension: 1200,
      medical: 300,
      unemployment: 75,
      total: 1575,
    },
    housingFund: 1500,
    tax: 925,
    total: 4000,
  },
  netSalary: 16500,
  yearly: {
    gross: 246000,
    net: 198000,
    tax: 11100,
  },
};

// 个税计算参数
const taxBrackets = [
  { min: 0, max: 3000, rate: 0.03, deduction: 0 },
  { min: 3000, max: 12000, rate: 0.1, deduction: 210 },
  { min: 12000, max: 25000, rate: 0.2, deduction: 1410 },
  { min: 25000, max: 35000, rate: 0.25, deduction: 2660 },
  { min: 35000, max: 55000, rate: 0.3, deduction: 4410 },
  { min: 55000, max: 80000, rate: 0.35, deduction: 7160 },
  { min: 80000, max: Infinity, rate: 0.45, deduction: 15160 },
];

// 社保公积金数据
const insuranceData = {
  socialInsurance: {
    pension: { employeeRate: 8, companyRate: 16, base: 15000 },
    medical: { employeeRate: 2, companyRate: 7, base: 15000 },
    unemployment: { employeeRate: 0.5, companyRate: 0.5, base: 15000 },
    workInjury: { employeeRate: 0, companyRate: 0.5, base: 15000 },
    maternity: { employeeRate: 0, companyRate: 0.8, base: 15000 },
  },
  housingFund: {
    employeeRate: 10,
    companyRate: 10,
    base: 15000,
  },
};

// 工资条历史
const payslipHistory = [
  {
    id: 1,
    month: '2024-12',
    basic: 15000,
    performance: 3000,
    allowance: 2000,
    subsidy: 500,
    socialInsurance: 1575,
    housingFund: 1500,
    tax: 925,
    netSalary: 16500,
    status: '已发放',
   发放日期: '2024-12-25',
  },
  {
    id: 2,
    month: '2024-11',
    basic: 15000,
    performance: 2800,
    allowance: 2000,
    subsidy: 500,
    socialInsurance: 1575,
    housingFund: 1500,
    tax: 845,
    netSalary: 16380,
    status: '已发放',
   发放日期: '2024-11-25',
  },
  {
    id: 3,
    month: '2024-10',
    basic: 15000,
    performance: 3200,
    allowance: 2000,
    subsidy: 500,
    socialInsurance: 1575,
    housingFund: 1500,
    tax: 975,
    netSalary: 16650,
    status: '已发放',
   发放日期: '2024-10-25',
  },
];

export default function SSCSmartPayrollPage() {
  const [activeTab, setActiveTab] = useState('tax-calc');
  const [showSalaryDetails, setShowSalaryDetails] = useState(true);

  // 个税计算参数
  const [taxParams, setTaxParams] = useState({
    grossSalary: 20500,
    deduction: 5000,
    insurance: 3075,
    specialDeduction: 0,
  });

  // 计算个税
  const calculateTax = () => {
    const { grossSalary, deduction, insurance, specialDeduction } = taxParams;
    const taxableIncome = grossSalary - deduction - insurance - specialDeduction;

    let tax = 0;
    for (const bracket of taxBrackets) {
      if (taxableIncome > bracket.min) {
        const taxableAmount = Math.min(taxableIncome, bracket.max) - bracket.min;
        tax += taxableAmount * bracket.rate - bracket.deduction;
      }
    }

    return {
      grossSalary,
      deduction,
      insurance,
      specialDeduction,
      taxableIncome: Math.max(0, taxableIncome),
      tax: Math.max(0, tax),
      netSalary: grossSalary - tax - insurance,
    };
  };

  const taxResult = calculateTax();

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <PageHeader
        icon={CreditCard}
        title="智能薪酬核算"
        description="自动计算个税、社保公积金，查看加密工资条"
        badge={{ text: '智能', color: 'from-purple-600 to-pink-600' }}
      />

      {/* 核心指标 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>本月税前薪资</CardDescription>
            <CardTitle className="text-2xl">¥{payrollData.currentSalary.total.toLocaleString()}</CardTitle>
            <div className="flex items-center gap-2 text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+2.3% 较上月</span>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>本月实发薪资</CardDescription>
            <CardTitle className="text-2xl">¥{payrollData.netSalary.toLocaleString()}</CardTitle>
            <div className="flex items-center gap-2 text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+1.8% 较上月</span>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>社保公积金</CardDescription>
            <CardTitle className="text-2xl">¥{payrollData.deductions.total.toLocaleString()}</CardTitle>
            <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
              <span>个人缴纳部分</span>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>年度累计个税</CardDescription>
            <CardTitle className="text-2xl">¥{payrollData.yearly.tax.toLocaleString()}</CardTitle>
            <div className="flex items-center gap-2 text-xs text-blue-600 mt-1">
              <span>已缴纳</span>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Tab导航 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tax-calc">个税计算</TabsTrigger>
          <TabsTrigger value="payslip">工资条</TabsTrigger>
          <TabsTrigger value="social-insurance">社保明细</TabsTrigger>
          <TabsTrigger value="housing-fund">公积金明细</TabsTrigger>
        </TabsList>

        {/* 个税计算 */}
        <TabsContent value="tax-calc" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 计算器 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  个税计算器
                </CardTitle>
                <CardDescription>
                  根据最新个人所得税法计算
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>税前薪资</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={taxParams.grossSalary}
                      onChange={(e) =>
                        setTaxParams({ ...taxParams, grossSalary: Number(e.target.value) })
                      }
                    />
                    <span className="text-sm text-gray-600">元</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>起征点</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={taxParams.deduction}
                      onChange={(e) =>
                        setTaxParams({ ...taxParams, deduction: Number(e.target.value) })
                      }
                    />
                    <span className="text-sm text-gray-600">元</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>社保公积金</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={taxParams.insurance}
                      onChange={(e) =>
                        setTaxParams({ ...taxParams, insurance: Number(e.target.value) })
                      }
                    />
                    <span className="text-sm text-gray-600">元</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>专项附加扣除</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={taxParams.specialDeduction}
                      onChange={(e) =>
                        setTaxParams({ ...taxParams, specialDeduction: Number(e.target.value) })
                      }
                    />
                    <span className="text-sm text-gray-600">元</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    包括子女教育、赡养老人、住房贷款利息等
                  </p>
                </div>

                <Button className="w-full" onClick={() => toast.success('个税计算完成')}>
                  <Calculator className="h-4 w-4 mr-2" />
                  计算个税
                </Button>
              </CardContent>
            </Card>

            {/* 计算结果 */}
            <Card>
              <CardHeader>
                <CardTitle>计算结果</CardTitle>
                <CardDescription>个人所得税明细</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">税前薪资</span>
                    <span className="font-medium">¥{taxResult.grossSalary.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">减：起征点</span>
                    <span className="font-medium text-red-600">-¥{taxResult.deduction.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">减：社保公积金</span>
                    <span className="font-medium text-red-600">-¥{taxResult.insurance.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">减：专项附加扣除</span>
                    <span className="font-medium text-red-600">-¥{taxResult.specialDeduction.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-950/20 px-3 rounded-lg">
                    <span className="font-medium">应纳税所得额</span>
                    <span className="font-bold text-blue-600">¥{taxResult.taxableIncome.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 bg-orange-50 dark:bg-orange-950/20 px-3 rounded-lg">
                    <span className="font-medium">应纳税额</span>
                    <span className="font-bold text-orange-600">¥{taxResult.tax.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 bg-green-50 dark:bg-green-950/20 px-3 rounded-lg">
                    <span className="font-medium">税后薪资</span>
                    <span className="font-bold text-green-600 text-lg">¥{taxResult.netSalary.toLocaleString()}</span>
                  </div>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>温馨提示</AlertTitle>
                  <AlertDescription className="text-sm">
                    个税采用累计预扣法计算，实际税额可能因月度累计变化而调整
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* 个税税率表 */}
          <Card>
            <CardHeader>
              <CardTitle>个人所得税税率表</CardTitle>
              <CardDescription>综合所得适用税率</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2">级数</th>
                      <th className="text-left py-2">全年应纳税所得额</th>
                      <th className="text-left py-2">税率</th>
                      <th className="text-left py-2">速算扣除数</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxBrackets.map((bracket, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2">{index + 1}</td>
                        <td className="py-2">
                          ¥{(bracket.min / 12).toFixed(0)} - ¥{(bracket.max / 12).toFixed(0)} / 月
                        </td>
                        <td className="py-2">
                          <Badge variant="outline">{(bracket.rate * 100).toFixed(0)}%</Badge>
                        </td>
                        <td className="py-2">¥{(bracket.deduction / 12).toFixed(0)} / 月</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 工资条 */}
        <TabsContent value="payslip" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    加密工资条
                  </CardTitle>
                  <CardDescription>
                    查看您的工资明细，已加密保护
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  下载
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">已加密保护</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSalaryDetails(!showSalaryDetails)}
                >
                  {showSalaryDetails ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      隐藏详情
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      显示详情
                    </>
                  )}
                </Button>
              </div>

              {showSalaryDetails && (
                <div className="space-y-4">
                  {/* 应发工资 */}
                  <div>
                    <h4 className="font-medium mb-2">应发工资</h4>
                    <div className="space-y-2 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">基本工资</span>
                        <span className="font-medium">¥{payrollData.currentSalary.basic.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">绩效工资</span>
                        <span className="font-medium">¥{payrollData.currentSalary.performance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">津贴补贴</span>
                        <span className="font-medium">¥{payrollData.currentSalary.allowance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-blue-200 dark:border-blue-800 pt-2">
                        <span className="font-medium">合计</span>
                        <span className="font-bold">¥{payrollData.currentSalary.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* 扣款项 */}
                  <div>
                    <h4 className="font-medium mb-2">扣款项</h4>
                    <div className="space-y-2 bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">养老保险</span>
                        <span className="font-medium">-¥{payrollData.deductions.socialInsurance.pension.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">医疗保险</span>
                        <span className="font-medium">-¥{payrollData.deductions.socialInsurance.medical.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">失业保险</span>
                        <span className="font-medium">-¥{payrollData.deductions.socialInsurance.unemployment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">住房公积金</span>
                        <span className="font-medium">-¥{payrollData.deductions.housingFund.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">个人所得税</span>
                        <span className="font-medium">-¥{payrollData.deductions.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-orange-200 dark:border-orange-800 pt-2">
                        <span className="font-medium">合计</span>
                        <span className="font-bold text-red-600">-¥{payrollData.deductions.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* 实发工资 */}
                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">实发工资</span>
                      <span className="text-2xl font-bold text-green-600">
                        ¥{payrollData.netSalary.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 工资条历史 */}
          <Card>
            <CardHeader>
              <CardTitle>工资条历史</CardTitle>
              <CardDescription>查看最近3个月的工资记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payslipHistory.map((payslip) => (
                  <Card key={payslip.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white">
                            <Calendar className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="font-medium">{payslip.month}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              发放日期：{payslip.发放日期}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            ¥{payslip.netSalary.toLocaleString()}
                          </p>
                          <Badge className="bg-green-100 text-green-600 text-xs">
                            {payslip.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 社保明细 */}
        <TabsContent value="social-insurance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                社保缴纳明细
              </CardTitle>
              <CardDescription>
                个人与公司缴纳比例及金额
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(insuranceData.socialInsurance).map(([key, value]) => (
                  <div key={key} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">
                        {key === 'pension' && '养老保险'}
                        {key === 'medical' && '医疗保险'}
                        {key === 'unemployment' && '失业保险'}
                        {key === 'workInjury' && '工伤保险'}
                        {key === 'maternity' && '生育保险'}
                      </h4>
                      <Badge variant="outline">基数 ¥{value.base.toLocaleString()}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">个人缴纳</p>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{value.employeeRate}%</span>
                          <span className="font-bold">
                            ¥{((value.base * value.employeeRate) / 100).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">公司缴纳</p>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{value.companyRate}%</span>
                          <span className="font-bold">
                            ¥{((value.base * value.companyRate) / 100).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Alert className="mt-4">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>温馨提示</AlertTitle>
                <AlertDescription className="text-sm">
                  社保缴纳比例根据当地政策执行，具体以实际为准
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 公积金明细 */}
        <TabsContent value="housing-fund" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                住房公积金明细
              </CardTitle>
              <CardDescription>
                个人与公司缴纳比例及金额
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">个人缴纳</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{insuranceData.housingFund.employeeRate}%</span>
                    <span className="font-bold">
                      ¥{((insuranceData.housingFund.base * insuranceData.housingFund.employeeRate) / 100).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    基数：¥{insuranceData.housingFund.base.toLocaleString()}
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">公司缴纳</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{insuranceData.housingFund.companyRate}%</span>
                    <span className="font-bold">
                      ¥{((insuranceData.housingFund.base * insuranceData.housingFund.companyRate) / 100).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    基数：¥{insuranceData.housingFund.base.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <h4 className="font-medium mb-2">年度累计</h4>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">个人账户总额</span>
                  <span className="font-bold text-green-600 text-lg">
                    ¥{((insuranceData.housingFund.base * insuranceData.housingFund.employeeRate * 2) / 100 * 12).toLocaleString()}
                  </span>
                </div>
              </div>

              <Alert className="mt-4">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>温馨提示</AlertTitle>
                <AlertDescription className="text-sm">
                  公积金缴纳比例根据当地政策执行，公司和个人缴纳比例相同
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
