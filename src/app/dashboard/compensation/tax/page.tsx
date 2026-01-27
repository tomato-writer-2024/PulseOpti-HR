'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Save,
  RefreshCw,
  Download,
  FileText,
  Info,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

type TaxType = 'personal' | 'social' | 'housing' | 'medical';

interface TaxRule {
  id: string;
  name: string;
  type: TaxType;
  rate: number;
  threshold: number;
  effectiveDate: string;
  status: 'active' | 'inactive';
  description: string;
}

interface TaxCalculation {
  gross: number;
  personalTax: number;
  socialInsurance: number;
  housingFund: number;
  medicalInsurance: number;
  net: number;
  breakdown: {
    taxableIncome: number;
    quickDeduction: number;
    taxRate: number;
  };
}

export default function TaxPage() {
  const [taxRules, setTaxRules] = useState<TaxRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [selectedRule, setSelectedRule] = useState<TaxRule | null>(null);

  // 计算器状态
  const [calcGross, setCalcGross] = useState<string>('15000');
  const [calcInsurance, setCalcInsurance] = useState<string>('2000');
  const [calcDeduction, setCalcDeduction] = useState<string>('5000');
  const [calculation, setCalculation] = useState<TaxCalculation | null>(null);

  useEffect(() => {
    // 模拟获取税收规则数据
    setTimeout(() => {
      setTaxRules([
        {
          id: '1',
          name: '个人所得税-税率1',
          type: 'personal',
          rate: 3,
          threshold: 0,
          effectiveDate: '2019-01-01',
          status: 'active',
          description: '年应纳税所得额不超过36000元',
        },
        {
          id: '2',
          name: '个人所得税-税率2',
          type: 'personal',
          rate: 10,
          threshold: 36000,
          effectiveDate: '2019-01-01',
          status: 'active',
          description: '年应纳税所得额36000-144000元',
        },
        {
          id: '3',
          name: '个人所得税-税率3',
          type: 'personal',
          rate: 20,
          threshold: 144000,
          effectiveDate: '2019-01-01',
          status: 'active',
          description: '年应纳税所得额144000-300000元',
        },
        {
          id: '4',
          name: '社保-养老保险',
          type: 'social',
          rate: 8,
          threshold: 0,
          effectiveDate: '2024-01-01',
          status: 'active',
          description: '个人缴费比例8%',
        },
        {
          id: '5',
          name: '公积金',
          type: 'housing',
          rate: 12,
          threshold: 0,
          effectiveDate: '2024-01-01',
          status: 'active',
          description: '个人缴费比例12%',
        },
        {
          id: '6',
          name: '医保',
          type: 'medical',
          rate: 2,
          threshold: 0,
          effectiveDate: '2024-01-01',
          status: 'active',
          description: '个人缴费比例2%',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const calculateTax = () => {
    const gross = parseFloat(calcGross) || 0;
    const insurance = parseFloat(calcInsurance) || 0;
    const deduction = parseFloat(calcDeduction) || 5000;

    // 计算应纳税所得额
    const monthlyIncome = gross;
    const socialInsurance = monthlyIncome * 0.102; // 社保 + 医保
    const housingFund = monthlyIncome * 0.12; // 公积金
    const taxableIncome = Math.max(0, monthlyIncome - socialInsurance - housingFund - deduction);

    // 计算个人所得税（简化版）
    let taxRate = 0;
    let quickDeduction = 0;

    if (taxableIncome <= 3000) {
      taxRate = 0.03;
      quickDeduction = 0;
    } else if (taxableIncome <= 12000) {
      taxRate = 0.1;
      quickDeduction = 210;
    } else if (taxableIncome <= 25000) {
      taxRate = 0.2;
      quickDeduction = 1410;
    } else if (taxableIncome <= 35000) {
      taxRate = 0.25;
      quickDeduction = 2660;
    } else if (taxableIncome <= 55000) {
      taxRate = 0.3;
      quickDeduction = 4410;
    } else if (taxableIncome <= 80000) {
      taxRate = 0.35;
      quickDeduction = 7160;
    } else {
      taxRate = 0.45;
      quickDeduction = 15160;
    }

    const personalTax = Math.max(0, taxableIncome * taxRate - quickDeduction);
    const net = gross - socialInsurance - housingFund - personalTax;

    setCalculation({
      gross,
      personalTax,
      socialInsurance,
      housingFund,
      medicalInsurance: gross * 0.02,
      net,
      breakdown: {
        taxableIncome,
        quickDeduction,
        taxRate: taxRate * 100,
      },
    });
  };

  useEffect(() => {
    if (showCalculator && calcGross) {
      calculateTax();
    }
  }, [showCalculator, calcGross, calcInsurance, calcDeduction]);

  const typeConfig: Record<TaxType, { label: string; color: string }> = {
    personal: { label: '个人所得税', color: 'bg-red-500' },
    social: { label: '社保', color: 'bg-blue-500' },
    housing: { label: '公积金', color: 'bg-green-500' },
    medical: { label: '医保', color: 'bg-purple-500' },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Calculator className="h-8 w-8 text-blue-600" />
              薪酬税收
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              管理税收规则和进行薪酬税收计算
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowCalculator(true)}>
              <Calculator className="h-4 w-4 mr-2" />
              税收计算器
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              新增规则
            </Button>
          </div>
        </div>

        {/* 功能提示 */}
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-blue-900 dark:text-blue-100">功能说明</p>
                <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                  本模块用于管理企业薪酬相关的税收规则，包括个人所得税、社保、公积金等。
                  使用税收计算器可以快速预估员工税后收入。所有规则将自动应用于薪酬核算。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">税收规则数</p>
                  <p className="text-2xl font-bold">{taxRules.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">生效规则</p>
                  <p className="text-2xl font-bold text-green-600">
                    {taxRules.filter(r => r.status === 'active').length}
                  </p>
                </div>
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">个税档位</p>
                  <p className="text-2xl font-bold">
                    {taxRules.filter(r => r.type === 'personal').length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">社保公积金</p>
                  <p className="text-2xl font-bold">
                    {taxRules.filter(r => ['social', 'housing', 'medical'].includes(r.type)).length}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 税收规则列表 */}
        <Card>
          <CardHeader>
            <CardTitle>税收规则</CardTitle>
            <CardDescription>
              管理个人所得税、社保、公积金等规则配置
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">全部</TabsTrigger>
                <TabsTrigger value="personal">个人所得税</TabsTrigger>
                <TabsTrigger value="insurance">社保公积金</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>规则名称</TableHead>
                        <TableHead>类型</TableHead>
                        <TableHead>税率/比例</TableHead>
                        <TableHead>起征点</TableHead>
                        <TableHead>生效日期</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {taxRules.map((rule) => (
                        <TableRow key={rule.id}>
                          <TableCell className="font-medium">{rule.name}</TableCell>
                          <TableCell>
                            <Badge className={`${typeConfig[rule.type].color} text-white border-0`}>
                              {typeConfig[rule.type].label}
                            </Badge>
                          </TableCell>
                          <TableCell>{rule.rate}%</TableCell>
                          <TableCell>
                            {rule.threshold > 0 ? `¥${rule.threshold.toLocaleString()}` : '-'}
                          </TableCell>
                          <TableCell>{rule.effectiveDate}</TableCell>
                          <TableCell>
                            <Badge
                              variant={rule.status === 'active' ? 'default' : 'secondary'}
                              className={rule.status === 'active' ? 'bg-green-600' : ''}
                            >
                              {rule.status === 'active' ? '生效中' : '已停用'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedRule(rule);
                                setShowRuleDialog(true);
                              }}
                            >
                              编辑
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>

              <TabsContent value="personal" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>税率档位</TableHead>
                      <TableHead>税率</TableHead>
                      <TableHead>应纳税所得额</TableHead>
                      <TableHead>速算扣除数</TableHead>
                      <TableHead>状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxRules.filter(r => r.type === 'personal').map((rule, index) => (
                      <TableRow key={rule.id}>
                        <TableCell>税率档位 {index + 1}</TableCell>
                        <TableCell>{rule.rate}%</TableCell>
                        <TableCell>
                          {index === 0 ? '0-36,000' :
                           index === 1 ? '36,000-144,000' :
                           index === 2 ? '144,000-300,000' :
                           index === 3 ? '300,000-420,000' :
                           index === 4 ? '420,000-660,000' :
                           index === 5 ? '660,000-960,000' :
                           '> 960,000'}
                        </TableCell>
                        <TableCell>¥{(index * (index + 1) * 210).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-600 text-white border-0">生效中</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* 税收计算器弹窗 */}
      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Calculator className="h-5 w-5 text-blue-600" />
              薪酬税收计算器
            </DialogTitle>
            <DialogDescription>
              快速计算员工的税后收入和各项扣除
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gross">税前工资 (元)</Label>
                <Input
                  id="gross"
                  type="number"
                  value={calcGross}
                  onChange={(e) => setCalcGross(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance">社保公积金 (元)</Label>
                <Input
                  id="insurance"
                  type="number"
                  value={calcInsurance}
                  onChange={(e) => setCalcInsurance(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deduction">起征点 (元)</Label>
                <Input
                  id="deduction"
                  type="number"
                  value={calcDeduction}
                  onChange={(e) => setCalcDeduction(e.target.value)}
                />
              </div>
            </div>

            {calculation && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">应纳税所得额</p>
                      <p className="text-2xl font-bold">¥{calculation.breakdown.taxableIncome.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">适用税率</p>
                      <p className="text-2xl font-bold text-red-600">{calculation.breakdown.taxRate}%</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>薪酬明细</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">税前工资</span>
                        <span className="font-semibold">¥{calculation.gross.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">社保扣除</span>
                        <span className="font-semibold text-red-600">
                          -¥{calculation.socialInsurance.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">公积金扣除</span>
                        <span className="font-semibold text-red-600">
                          -¥{calculation.housingFund.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">医保扣除</span>
                        <span className="font-semibold text-red-600">
                          -¥{calculation.medicalInsurance.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">个人所得税</span>
                        <span className="font-semibold text-red-600">
                          -¥{calculation.personalTax.toLocaleString()}
                        </span>
                      </div>
                      <div className="border-t pt-3 flex justify-between">
                        <span className="font-semibold text-lg">税后收入</span>
                        <span className="font-bold text-2xl text-green-600">
                          ¥{calculation.net.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCalculator(false)}>
              关闭
            </Button>
            <Button onClick={() => {
              toast.success('计算结果已导出');
              setShowCalculator(false);
            }}>
              <Download className="h-4 w-4 mr-2" />
              导出结果
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 规则详情弹窗 */}
      <Dialog open={showRuleDialog} onOpenChange={setShowRuleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>规则详情</DialogTitle>
          </DialogHeader>
          {selectedRule && (
            <div className="space-y-4">
              <div>
                <Label>规则名称</Label>
                <p className="font-medium mt-1">{selectedRule.name}</p>
              </div>
              <div>
                <Label>类型</Label>
                <p className="mt-1">
                  <Badge className={`${typeConfig[selectedRule.type].color} text-white border-0`}>
                    {typeConfig[selectedRule.type].label}
                  </Badge>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>税率/比例</Label>
                  <p className="font-medium mt-1">{selectedRule.rate}%</p>
                </div>
                <div>
                  <Label>起征点</Label>
                  <p className="font-medium mt-1">
                    {selectedRule.threshold > 0 ? `¥${selectedRule.threshold.toLocaleString()}` : '无'}
                  </p>
                </div>
              </div>
              <div>
                <Label>描述</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {selectedRule.description}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
