'use client';

import { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  User,
  Plus,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Phone,
  Mail,
  Building2,
  MapPin,
  Search,
  Filter,
  Download,
  Upload,
  Save,
  Eye,
  Trash2,
  MoreVertical,
  Shield,
  Award,
  Briefcase,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

// 类型定义
type EmployeeStatus = 'active' | 'inactive' | 'on_leave' | 'resigned';
type EmployeeType = 'full_time' | 'part_time' | 'contract' | 'intern';

interface Employee {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  employeeNo: string;
  department: string;
  position: string;
  type: EmployeeType;
  status: EmployeeStatus;
  joinDate: string;
  manager: string;
  location: string;
  education: string;
  skills: string[];
}

interface LeaveApplication {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
}

export default function EmployeePortalPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [dialogOpen, setDialogOpen] = useState(false);

  // 当前用户信息
  const [currentUser] = useState<Employee>({
    id: '1',
    name: '张三',
    avatar: '',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    employeeNo: 'EMP001',
    department: '技术部',
    position: '高级工程师',
    type: 'full_time',
    status: 'active',
    joinDate: '2023-01-15',
    manager: '李四',
    location: '北京',
    education: '本科',
    skills: ['JavaScript', 'React', 'Node.js', 'Python'],
  });

  // 假期申请记录
  const [leaveApplications] = useState<LeaveApplication[]>([
    {
      id: '1',
      employeeId: '1',
      employeeName: '张三',
      type: '年假',
      startDate: '2025-05-01',
      endDate: '2025-05-03',
      days: 3,
      reason: '家庭旅游',
      status: 'pending',
      appliedAt: '2025-04-18',
    },
    {
      id: '2',
      employeeId: '1',
      employeeName: '张三',
      type: '事假',
      startDate: '2025-04-10',
      endDate: '2025-04-10',
      days: 1,
      reason: '个人事务',
      status: 'approved',
      appliedAt: '2025-04-09',
    },
  ]);

  // 假期余额
  const [leaveBalance] = useState({
    annual: 15,
    sick: 5,
    personal: 3,
    used: {
      annual: 8,
      sick: 1,
      personal: 2,
    },
  });

  // 报销记录
  const [reimbursements] = useState([
    {
      id: '1',
      type: '差旅费',
      amount: 2500,
      date: '2025-04-15',
      description: '上海出差交通和住宿',
      status: 'approved',
    },
    {
      id: '2',
      type: '餐饮费',
      amount: 320,
      date: '2025-04-12',
      description: '客户招待',
      status: 'pending',
    },
  ]);

  const statusMap: Record<EmployeeStatus, { label: string; color: string }> = {
    active: { label: '在职', color: 'bg-green-100 text-green-800' },
    inactive: { label: '离职', color: 'bg-gray-100 text-gray-800' },
    on_leave: { label: '请假', color: 'bg-yellow-100 text-yellow-800' },
    resigned: { label: '已离职', color: 'bg-red-100 text-red-800' },
  };

  const leaveStatusMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: '待审批', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-4 w-4" /> },
    approved: { label: '已通过', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" /> },
    rejected: { label: '已拒绝', color: 'bg-red-100 text-red-800', icon: <XCircle className="h-4 w-4" /> },
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">员工自助</h1>
          <p className="text-gray-600 mt-2">
            个人信息、请假申请、报销管理
            <Badge variant="secondary" className="ml-2">SSC</Badge>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-lg bg-blue-500 text-white">
              {currentUser.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{currentUser.name}</div>
            <div className="text-sm text-gray-600">{currentUser.position}</div>
          </div>
        </div>
      </div>

      {/* 功能介绍 */}
      <Alert>
        <User className="h-4 w-4" />
        <AlertDescription>
          员工自助门户，支持个人信息管理、请假申请、报销提交、工资条查看等功能
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">个人信息</TabsTrigger>
          <TabsTrigger value="leave">请假管理</TabsTrigger>
          <TabsTrigger value="reimbursement">报销管理</TabsTrigger>
          <TabsTrigger value="documents">我的文档</TabsTrigger>
        </TabsList>

        {/* 个人信息 */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 基本信息 */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>基本信息</CardTitle>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    编辑
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>姓名</Label>
                    <div className="mt-1 font-medium">{currentUser.name}</div>
                  </div>
                  <div>
                    <Label>员工编号</Label>
                    <div className="mt-1 font-medium">{currentUser.employeeNo}</div>
                  </div>
                  <div>
                    <Label>邮箱</Label>
                    <div className="mt-1 font-medium flex items-center gap-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {currentUser.email}
                    </div>
                  </div>
                  <div>
                    <Label>手机</Label>
                    <div className="mt-1 font-medium flex items-center gap-1">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {currentUser.phone}
                    </div>
                  </div>
                  <div>
                    <Label>部门</Label>
                    <div className="mt-1 font-medium flex items-center gap-1">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      {currentUser.department}
                    </div>
                  </div>
                  <div>
                    <Label>职位</Label>
                    <div className="mt-1 font-medium flex items-center gap-1">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      {currentUser.position}
                    </div>
                  </div>
                  <div>
                    <Label>直属上级</Label>
                    <div className="mt-1 font-medium">{currentUser.manager}</div>
                  </div>
                  <div>
                    <Label>工作地点</Label>
                    <div className="mt-1 font-medium flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {currentUser.location}
                    </div>
                  </div>
                  <div>
                    <Label>入职日期</Label>
                    <div className="mt-1 font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {currentUser.joinDate}
                    </div>
                  </div>
                  <div>
                    <Label>员工类型</Label>
                    <div className="mt-1 font-medium">{currentUser.type === 'full_time' ? '全职' : '兼职'}</div>
                  </div>
                  <div className="col-span-2">
                    <Label>教育背景</Label>
                    <div className="mt-1 font-medium">{currentUser.education}</div>
                  </div>
                  <div className="col-span-2">
                    <Label>技能标签</Label>
                    <div className="mt-1 flex gap-2 flex-wrap">
                      {currentUser.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 假期余额 */}
            <Card>
              <CardHeader>
                <CardTitle>假期余额</CardTitle>
                <CardDescription>当前可用假期</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">年假</span>
                      <span className="text-sm text-gray-600">
                        {leaveBalance.used.annual}/{leaveBalance.annual} 天
                      </span>
                    </div>
                    <Progress
                      value={(leaveBalance.used.annual / leaveBalance.annual) * 100}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">病假</span>
                      <span className="text-sm text-gray-600">
                        {leaveBalance.used.sick}/{leaveBalance.sick} 天
                      </span>
                    </div>
                    <Progress
                      value={(leaveBalance.used.sick / leaveBalance.sick) * 100}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">事假</span>
                      <span className="text-sm text-gray-600">
                        {leaveBalance.used.personal}/{leaveBalance.personal} 天
                      </span>
                    </div>
                    <Progress
                      value={(leaveBalance.used.personal / leaveBalance.personal) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 请假管理 */}
        <TabsContent value="leave">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 假期申请 */}
            <Card>
              <CardHeader>
                <CardTitle>申请请假</CardTitle>
                <CardDescription>提交新的假期申请</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="leaveType">假期类型 *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="annual">年假</SelectItem>
                        <SelectItem value="sick">病假</SelectItem>
                        <SelectItem value="personal">事假</SelectItem>
                        <SelectItem value="maternity">产假</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">开始日期 *</Label>
                      <Input id="startDate" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="endDate">结束日期 *</Label>
                      <Input id="endDate" type="date" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="reason">请假原因 *</Label>
                    <Textarea
                      id="reason"
                      placeholder="请输入请假原因"
                      rows={3}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => toast.success('请假申请已提交')}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    提交申请
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 申请记录 */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>申请记录</CardTitle>
                <CardDescription>历史请假申请</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>类型</TableHead>
                      <TableHead>日期</TableHead>
                      <TableHead>天数</TableHead>
                      <TableHead>原因</TableHead>
                      <TableHead>状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>{app.type}</TableCell>
                        <TableCell>
                          <div className="text-xs">
                            {app.startDate} ~ {app.endDate}
                          </div>
                        </TableCell>
                        <TableCell>{app.days}天</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {app.reason}
                        </TableCell>
                        <TableCell>
                          <Badge className={leaveStatusMap[app.status].color}>
                            {leaveStatusMap[app.status].icon}
                            {leaveStatusMap[app.status].label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 报销管理 */}
        <TabsContent value="reimbursement">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 报销申请 */}
            <Card>
              <CardHeader>
                <CardTitle>报销申请</CardTitle>
                <CardDescription>提交新的报销申请</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reimbursementType">报销类型 *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="travel">差旅费</SelectItem>
                        <SelectItem value="dining">餐饮费</SelectItem>
                        <SelectItem value="office">办公用品</SelectItem>
                        <SelectItem value="other">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="amount">金额 (¥) *</Label>
                    <Input id="amount" type="number" placeholder="0.00" />
                  </div>
                  <div>
                    <Label htmlFor="expenseDate">消费日期 *</Label>
                    <Input id="expenseDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="description">说明 *</Label>
                    <Textarea
                      id="description"
                      placeholder="请详细说明消费用途"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="receipt">上传凭证</Label>
                    <div className="flex gap-2 mt-1">
                      <Button variant="outline" className="flex-1">
                        <Upload className="mr-2 h-4 w-4" />
                        选择文件
                      </Button>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => toast.success('报销申请已提交')}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    提交申请
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 报销记录 */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>报销记录</CardTitle>
                <CardDescription>历史报销申请</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>类型</TableHead>
                      <TableHead>金额</TableHead>
                      <TableHead>日期</TableHead>
                      <TableHead>说明</TableHead>
                      <TableHead>状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reimbursements.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.type}</TableCell>
                        <TableCell className="font-medium">
                          ¥{item.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {item.description}
                        </TableCell>
                        <TableCell>
                          <Badge className={leaveStatusMap[item.status].color}>
                            {leaveStatusMap[item.status].label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 我的文档 */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>我的文档</CardTitle>
              <CardDescription>查看和管理个人相关文档</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <FileText className="h-8 w-8 text-blue-600 mb-2" />
                  <div className="font-medium">劳动合同</div>
                  <div className="text-sm text-gray-600">2025-04-15</div>
                </div>
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <FileText className="h-8 w-8 text-green-600 mb-2" />
                  <div className="font-medium">员工手册</div>
                  <div className="text-sm text-gray-600">2025-04-10</div>
                </div>
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <FileText className="h-8 w-8 text-purple-600 mb-2" />
                  <div className="font-medium">培训证书</div>
                  <div className="text-sm text-gray-600">2025-03-20</div>
                </div>
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <FileText className="h-8 w-8 text-orange-600 mb-2" />
                  <div className="font-medium">薪资证明</div>
                  <div className="text-sm text-gray-600">2025-03-15</div>
                </div>
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <FileText className="h-8 w-8 text-red-600 mb-2" />
                  <div className="font-medium">离职证明</div>
                  <div className="text-sm text-gray-600">暂无</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
