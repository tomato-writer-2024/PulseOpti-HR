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
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import {
  Clock,
  MapPin,
  Calendar,
  LogIn,
  LogOut,
  Coffee,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Upload,
  Save,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Map,
  Bell,
  Settings,
  TrendingUp,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

// 类型定义
type AttendanceStatus = 'normal' | 'late' | 'early' | 'absent' | 'leave' | 'overtime';
type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  status: AttendanceStatus;
  approvalStatus?: ApprovalStatus;
  workHours: number;
  location?: string;
  note?: string;
}

interface LeaveRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: ApprovalStatus;
  appliedAt: string;
}

interface WorkSchedule {
  id: string;
  name: string;
  workDays: number[];
  checkInTime: string;
  checkOutTime: string;
  lateTolerance: number; // 分钟
  description: string;
}

export default function AttendanceManagementPage() {
  const [activeTab, setActiveTab] = useState('records');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // 考勤记录
  const [attendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: '1',
      employeeId: '1',
      employeeName: '张三',
      date: '2025-04-18',
      checkInTime: '08:55',
      checkOutTime: '18:10',
      status: 'normal',
      workHours: 9.25,
      location: '公司总部',
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: '李四',
      date: '2025-04-18',
      checkInTime: '09:15',
      checkOutTime: '18:05',
      status: 'late',
      workHours: 8.83,
      location: '公司总部',
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: '王五',
      date: '2025-04-18',
      checkInTime: '08:45',
      checkOutTime: '17:45',
      status: 'early',
      workHours: 9,
      location: '公司总部',
    },
    {
      id: '4',
      employeeId: '4',
      employeeName: '赵六',
      date: '2025-04-18',
      checkInTime: '-',
      checkOutTime: '-',
      status: 'absent',
      workHours: 0,
      approvalStatus: 'pending',
    },
  ]);

  // 请假记录
  const [leaveRecords] = useState<LeaveRecord[]>([
    {
      id: '1',
      employeeId: '4',
      employeeName: '赵六',
      type: '事假',
      startDate: '2025-04-18',
      endDate: '2025-04-18',
      days: 1,
      reason: '个人事务',
      status: 'pending',
      appliedAt: '2025-04-17',
    },
    {
      id: '2',
      employeeId: '5',
      employeeName: '钱七',
      type: '年假',
      startDate: '2025-04-20',
      endDate: '2025-04-22',
      days: 3,
      reason: '旅游',
      status: 'approved',
      appliedAt: '2025-04-15',
    },
  ]);

  // 工作班次
  const [workSchedules] = useState<WorkSchedule[]>([
    {
      id: '1',
      name: '标准工时',
      workDays: [1, 2, 3, 4, 5],
      checkInTime: '09:00',
      checkOutTime: '18:00',
      lateTolerance: 10,
      description: '周一至周五 9:00-18:00',
    },
    {
      id: '2',
      name: '弹性工时',
      workDays: [1, 2, 3, 4, 5],
      checkInTime: '10:00',
      checkOutTime: '19:00',
      lateTolerance: 0,
      description: '周一至周五 10:00-19:00',
    },
  ]);

  // 考勤统计
  const [attendanceStats] = useState({
    totalEmployees: 100,
    present: 95,
    late: 3,
    early: 2,
    absent: 1,
    leave: 4,
    avgWorkHours: 8.5,
    onTimeRate: 92,
  });

  const statusMap: Record<AttendanceStatus, { label: string; icon: React.ReactNode; color: string }> = {
    normal: { label: '正常', icon: <CheckCircle className="h-4 w-4" />, color: 'bg-green-100 text-green-800' },
    late: { label: '迟到', icon: <AlertTriangle className="h-4 w-4" />, color: 'bg-yellow-100 text-yellow-800' },
    early: { label: '早退', icon: <AlertTriangle className="h-4 w-4" />, color: 'bg-orange-100 text-orange-800' },
    absent: { label: '缺勤', icon: <XCircle className="h-4 w-4" />, color: 'bg-red-100 text-red-800' },
    leave: { label: '请假', icon: <Coffee className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800' },
    overtime: { label: '加班', icon: <Clock className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800' },
  };

  const approvalStatusMap: Record<ApprovalStatus, { label: string; color: string }> = {
    pending: { label: '待审批', color: 'bg-yellow-100 text-yellow-800' },
    approved: { label: '已批准', color: 'bg-green-100 text-green-800' },
    rejected: { label: '已拒绝', color: 'bg-red-100 text-red-800' },
  };

  const filteredRecords = attendanceRecords.filter(record => {
    const matchSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       record.date.includes(searchTerm);
    const matchStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">考勤管理</h1>
          <p className="text-gray-600 mt-2">
            考勤记录、请假审批、排班管理
            <Badge variant="secondary" className="ml-2">SSC</Badge>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出报表
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            导入考勤
          </Button>
        </div>
      </div>

      {/* 功能介绍 */}
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          支持多地点打卡、人脸识别、GPS定位，自动计算工时和考勤异常
        </AlertDescription>
      </Alert>

      {/* 统计概览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-gray-600">总员工</CardTitle>
            <Users className="h-3 w-3 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{attendanceStats.totalEmployees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-gray-600">出勤</CardTitle>
            <CheckCircle className="h-3 w-3 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{attendanceStats.present}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-gray-600">迟到</CardTitle>
            <AlertTriangle className="h-3 w-3 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-yellow-600">{attendanceStats.late}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-gray-600">早退</CardTitle>
            <LogOut className="h-3 w-3 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-orange-600">{attendanceStats.early}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-gray-600">缺勤</CardTitle>
            <XCircle className="h-3 w-3 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-600">{attendanceStats.absent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-gray-600">请假</CardTitle>
            <Coffee className="h-3 w-3 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{attendanceStats.leave}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-gray-600">平均工时</CardTitle>
            <Clock className="h-3 w-3 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{attendanceStats.avgWorkHours}h</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-gray-600">准时率</CardTitle>
            <TrendingUp className="h-3 w-3 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">{attendanceStats.onTimeRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="records">考勤记录</TabsTrigger>
          <TabsTrigger value="approval">审批管理</TabsTrigger>
          <TabsTrigger value="schedule">排班管理</TabsTrigger>
          <TabsTrigger value="settings">考勤设置</TabsTrigger>
        </TabsList>

        {/* 考勤记录 */}
        <TabsContent value="records" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>考勤记录</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="搜索员工或日期"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="normal">正常</SelectItem>
                      <SelectItem value="late">迟到</SelectItem>
                      <SelectItem value="early">早退</SelectItem>
                      <SelectItem value="absent">缺勤</SelectItem>
                      <SelectItem value="leave">请假</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>日期</TableHead>
                    <TableHead>员工</TableHead>
                    <TableHead>上班打卡</TableHead>
                    <TableHead>下班打卡</TableHead>
                    <TableHead>工时</TableHead>
                    <TableHead>地点</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell className="font-medium">{record.employeeName}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <LogIn className="h-3 w-3 text-green-600" />
                        {record.checkInTime}
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        <LogOut className="h-3 w-3 text-blue-600" />
                        {record.checkOutTime}
                      </TableCell>
                      <TableCell>{record.workHours.toFixed(2)}h</TableCell>
                      <TableCell className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        {record.location}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusMap[record.status].color}>
                          {statusMap[record.status].icon}
                          {statusMap[record.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 审批管理 */}
        <TabsContent value="approval">
          <Card>
            <CardHeader>
              <CardTitle>审批管理</CardTitle>
              <CardDescription>处理请假和补卡申请</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>员工</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>日期</TableHead>
                    <TableHead>天数</TableHead>
                    <TableHead>原因</TableHead>
                    <TableHead>申请时间</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.employeeName}</TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell>
                        {record.startDate} ~ {record.endDate}
                      </TableCell>
                      <TableCell>{record.days}天</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {record.reason}
                      </TableCell>
                      <TableCell className="text-sm">{record.appliedAt}</TableCell>
                      <TableCell>
                        <Badge className={approvalStatusMap[record.status].color}>
                          {approvalStatusMap[record.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {record.status === 'pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toast.success('已批准')}
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toast.success('已拒绝')}
                              >
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 排班管理 */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>排班管理</CardTitle>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  新增班次
                </Button>
              </div>
              <CardDescription>管理工作班次和排班规则</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workSchedules.map((schedule) => (
                  <Card key={schedule.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{schedule.name}</CardTitle>
                      <CardDescription>{schedule.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">工作日</span>
                          <span className="text-sm font-medium">
                            {schedule.workDays.map((day, i) => (
                              <Badge key={i} variant="outline" className="mr-1">
                                {['日', '一', '二', '三', '四', '五', '六'][day]}
                              </Badge>
                            ))}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">上班时间</span>
                          <span className="text-sm font-medium flex items-center gap-1">
                            <LogIn className="h-3 w-3 text-green-600" />
                            {schedule.checkInTime}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">下班时间</span>
                          <span className="text-sm font-medium flex items-center gap-1">
                            <LogOut className="h-3 w-3 text-blue-600" />
                            {schedule.checkOutTime}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">迟到宽限</span>
                          <span className="text-sm font-medium">
                            {schedule.lateTolerance} 分钟
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          编辑
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 考勤设置 */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>打卡设置</CardTitle>
                <CardDescription>配置打卡方式和规则</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">GPS 定位打卡</div>
                    <div className="text-sm text-gray-600">要求在指定范围内打卡</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">WiFi 打卡</div>
                    <div className="text-sm text-gray-600">连接指定 WiFi 可打卡</div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">人脸识别</div>
                    <div className="text-sm text-gray-600">打卡时进行人脸验证</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">外勤打卡</div>
                    <div className="text-sm text-gray-600">允许在办公地点外打卡</div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>提醒设置</CardTitle>
                <CardDescription>配置考勤提醒</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      上班提醒
                    </div>
                    <div className="text-sm text-gray-600">提前提醒上班打卡</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue={30} className="w-20" />
                    <span className="text-sm text-gray-600">分钟</span>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      下班提醒
                    </div>
                    <div className="text-sm text-gray-600">提醒下班打卡</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue={5} className="w-20" />
                    <span className="text-sm text-gray-600">分钟</span>
                    <Switch />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      异常提醒
                    </div>
                    <div className="text-sm text-gray-600">考勤异常时通知</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
