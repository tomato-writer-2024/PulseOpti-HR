'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Calendar,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Bell,
  Settings,
  LogOut,
  Shield,
  Award,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Building2,
  Users,
  Star,
  TrendingUp,
  Target,
  BookOpen,
  Heart,
  Gift,
  MessageSquare,
  CalendarCheck,
  Coffee,
  Plane,
  Edit,
} from 'lucide-react';

interface EmployeeProfile {
  id: string;
  name: string;
  avatar?: string;
  employeeId: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  manager: string;
  location: string;
  hireDate: string;
  tenure: number;
  employmentType: 'fulltime' | 'parttime' | 'contract';
  status: 'active' | 'probation' | 'notice';
  personalInfo: {
    gender: string;
    birthDate: string;
    nationality: string;
    address: string;
    emergencyContact: string;
    emergencyPhone: string;
  };
  workInfo: {
    workEmail: string;
    workPhone: string;
    extension: string;
    deskLocation: string;
  };
}

interface LeaveBalance {
  annual: { total: number; used: number; remaining: number };
  sick: { total: number; used: number; remaining: number };
  personal: { total: number; used: number; remaining: number };
  compensation: { total: number; used: number; remaining: number };
}

interface Attendance {
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  hours: number;
}

interface PaySlip {
  id: string;
  month: string;
  year: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  status: 'paid' | 'pending';
}

interface Training {
  id: string;
  title: string;
  progress: number;
  status: 'in-progress' | 'completed' | 'not-started';
  dueDate: string;
}

interface Benefit {
  id: string;
  name: string;
  type: 'insurance' | 'welfare' | 'allowance';
  coverage: string;
  enrollmentDate: string;
}

export default function EmployeeSelfServicePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [paySlips, setPaySlips] = useState<PaySlip[]>([]);
  const [training, setTraining] = useState<Training[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [notifications] = useState([
    { id: '1', type: 'info', message: '您的年度绩效考核已开始，请及时完成自评', time: '2小时前' },
    { id: '2', type: 'warning', message: '您有3天的年假即将过期，请合理安排', time: '1天前' },
    { id: '3', type: 'success', message: '4月薪资单已生成，请查看', time: '2天前' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));

      setProfile({
        id: '1',
        name: '张明',
        avatar: undefined,
        employeeId: 'EMP2024001',
        email: 'zhangming@company.com',
        phone: '138****8888',
        department: '技术部',
        position: '高级工程师',
        manager: '陈伟',
        location: '北京',
        hireDate: '2019-03-15',
        tenure: 5,
        employmentType: 'fulltime',
        status: 'active',
        personalInfo: {
          gender: '男',
          birthDate: '1990-05-20',
          nationality: '中国',
          address: '北京市朝阳区某某街道123号',
          emergencyContact: '李芳',
          emergencyPhone: '139****6666',
        },
        workInfo: {
          workEmail: 'zhangming@company.com',
          workPhone: '010-8888****',
          extension: '1001',
          deskLocation: 'A栋 5楼 503工位',
        },
      });

      setLeaveBalance({
        annual: { total: 15, used: 8, remaining: 7 },
        sick: { total: 5, used: 1, remaining: 4 },
        personal: { total: 3, used: 2, remaining: 1 },
        compensation: { total: 0, used: 0, remaining: 0 },
      });

      setAttendance([
        { date: '2025-04-18', checkIn: '09:00', checkOut: '18:00', status: 'present', hours: 9 },
        { date: '2025-04-17', checkIn: '08:45', checkOut: '18:15', status: 'present', hours: 9.5 },
        { date: '2025-04-16', checkIn: '09:15', checkOut: '18:00', status: 'late', hours: 8.75 },
        { date: '2025-04-15', checkIn: '09:00', checkOut: '18:00', status: 'present', hours: 9 },
        { date: '2025-04-14', checkIn: '-', checkOut: '-', status: 'absent', hours: 0 },
      ]);

      setPaySlips([
        { id: '1', month: '4月', year: 2025, grossPay: 35000, deductions: 5200, netPay: 29800, status: 'paid' },
        { id: '2', month: '3月', year: 2025, grossPay: 35000, deductions: 5200, netPay: 29800, status: 'paid' },
        { id: '3', month: '2月', year: 2025, grossPay: 35000, deductions: 5200, netPay: 29800, status: 'paid' },
      ]);

      setTraining([
        { id: '1', title: 'React 高级开发', progress: 75, status: 'in-progress', dueDate: '2025-04-30' },
        { id: '2', title: '项目管理认证', progress: 100, status: 'completed', dueDate: '2025-03-31' },
        { id: '3', title: '领导力培训', progress: 0, status: 'not-started', dueDate: '2025-05-15' },
      ]);

      setBenefits([
        { id: '1', name: '医疗保险', type: 'insurance', coverage: '全额', enrollmentDate: '2019-03-15' },
        { id: '2', name: '公积金', type: 'welfare', coverage: '按比例', enrollmentDate: '2019-03-15' },
        { id: '3', name: '通讯补贴', type: 'allowance', coverage: '200元/月', enrollmentDate: '2019-03-15' },
      ]);

      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">员工自助</h1>
          <p className="text-muted-foreground mt-1">个人信息与办公服务</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            设置
          </Button>
          <Button variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            退出
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">年假余额</CardTitle>
            <Coffee className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{leaveBalance?.annual.remaining}</div>
            <p className="text-xs text-muted-foreground mt-1">
              / {leaveBalance?.annual.total} 天
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">本月出勤</CardTitle>
            <CalendarCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {attendance.filter(a => a.status === 'present' || a.status === 'late').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              工作日
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">培训进度</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {training.filter(t => t.status === 'in-progress').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              进行中
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">福利权益</CardTitle>
            <Gift className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">{benefits.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              项福利
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>个人信息</CardTitle>
            <CardDescription>基本资料与工作信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl bg-blue-500 text-white">
                  {profile?.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold">{profile?.name}</h3>
                <p className="text-sm text-muted-foreground">{profile?.position}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{profile?.employeeId}</Badge>
                  <Badge className="bg-green-100 text-green-800">{profile?.status === 'active' ? '在职' : '试用期'}</Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  工作信息
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">部门</span>
                    <span>{profile?.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">直属领导</span>
                    <span>{profile?.manager}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">工作地点</span>
                    <span>{profile?.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">工位</span>
                    <span className="text-xs">{profile?.workInfo.deskLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">入职日期</span>
                    <span>{profile?.hireDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">司龄</span>
                    <span>{profile?.tenure} 年</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  联系方式
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">工作邮箱</span>
                    <span className="text-xs">{profile?.workInfo.workEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">工作电话</span>
                    <span>{profile?.workInfo.workPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">分机号</span>
                    <span>{profile?.workInfo.extension}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  紧急联系人
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">姓名</span>
                    <span>{profile?.personalInfo.emergencyContact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">电话</span>
                    <span>{profile?.personalInfo.emergencyPhone}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              编辑资料
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>快速服务</CardTitle>
              <Button size="sm">
                <Filter className="h-4 w-4 mr-2" />
                筛选
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-24 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300">
                <Calendar className="h-6 w-6 text-blue-600" />
                <span className="text-sm">请假申请</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2 hover:bg-green-50 hover:border-green-300">
                <Clock className="h-6 w-6 text-green-600" />
                <span className="text-sm">加班申请</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2 hover:bg-purple-50 hover:border-purple-300">
                <FileText className="h-6 w-6 text-purple-600" />
                <span className="text-sm">报销申请</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2 hover:bg-yellow-50 hover:border-yellow-300">
                <Plane className="h-6 w-6 text-yellow-600" />
                <span className="text-sm">差旅申请</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2 hover:bg-pink-50 hover:border-pink-300">
                <Coffee className="h-6 w-6 text-pink-600" />
                <span className="text-sm">福利申请</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2 hover:bg-orange-50 hover:border-orange-300">
                <MessageSquare className="h-6 w-6 text-orange-600" />
                <span className="text-sm">HR咨询</span>
              </Button>
            </div>

            <Separator className="my-6" />

            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Bell className="h-4 w-4" />
                通知消息
              </h3>
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg border ${
                      notif.type === 'warning'
                        ? 'bg-yellow-50 border-yellow-200'
                        : notif.type === 'success'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {notif.type === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />}
                      {notif.type === 'success' && <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />}
                      {notif.type === 'info' && <Bell className="h-5 w-5 text-blue-600 flex-shrink-0" />}
                      <div className="flex-1">
                        <p className="text-sm">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                出勤记录 (最近5天)
              </h3>
              <div className="space-y-2">
                {attendance.map((record) => (
                  <div key={record.date} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={
                          record.status === 'present'
                            ? 'bg-green-100 border-green-500 text-green-800'
                            : record.status === 'late'
                            ? 'bg-yellow-100 border-yellow-500 text-yellow-800'
                            : 'bg-red-100 border-red-500 text-red-800'
                        }
                      >
                        {record.status === 'present' ? '正常' : record.status === 'late' ? '迟到' : '缺勤'}
                      </Badge>
                      <span className="text-sm font-medium">{record.date}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="text-muted-foreground text-xs">上班</div>
                        <div>{record.checkIn}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground text-xs">下班</div>
                        <div>{record.checkOut}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground text-xs">工时</div>
                        <div className="font-medium">{record.hours}h</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  薪资单
                </h3>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  查看全部
                </Button>
              </div>
              <div className="space-y-2">
                {paySlips.map((slip) => (
                  <div key={slip.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{slip.year}年{slip.month}</p>
                        <p className="text-xs text-muted-foreground">发放日期: {slip.year}-{slip.month}-10</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">¥{slip.netPay.toLocaleString()}</p>
                      <Badge className="bg-green-100 text-green-800 mt-1">已发放</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                我的培训
              </h3>
              <div className="space-y-3">
                {training.map((course) => (
                  <div key={course.id} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{course.title}</span>
                      <Badge
                        variant="outline"
                        className={
                          course.status === 'completed'
                            ? 'bg-green-100 border-green-500 text-green-800'
                            : course.status === 'in-progress'
                            ? 'bg-blue-100 border-blue-500 text-blue-800'
                            : 'bg-gray-100 border-gray-500 text-gray-800'
                        }
                      >
                        {course.status === 'completed' ? '已完成' : course.status === 'in-progress' ? '进行中' : '未开始'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={course.progress} className="flex-1" />
                      <span className="text-xs text-muted-foreground">{course.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
