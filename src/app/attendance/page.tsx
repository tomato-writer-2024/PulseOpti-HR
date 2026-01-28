'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, Calendar, Users, CheckCircle2, AlertCircle, Plus, Download, TrendingUp, ArrowUpRight, ArrowDownRight, MapPin, UserCircle } from 'lucide-react';

const attendanceData = {
  metrics: {
    todayAttendance: 476,
    totalEmployees: 492,
    attendanceRate: 96.8,
    onLeave: 12,
    late: 4,
    earlyLeave: 3,
  },
  records: [
    {
      id: '1',
      employeeId: 'E001',
      employeeName: '张三',
      department: '技术部',
      date: '2025-01-17',
      checkInTime: '08:45',
      checkOutTime: '18:30',
      workHours: 9.75,
      status: 'normal',
    },
    {
      id: '2',
      employeeId: 'E002',
      employeeName: '李四',
      department: '销售部',
      date: '2025-01-17',
      checkInTime: '09:15',
      checkOutTime: '18:00',
      workHours: 8.75,
      status: 'late',
    },
    {
      id: '3',
      employeeId: 'E003',
      employeeName: '王五',
      department: '市场部',
      date: '2025-01-17',
      checkInTime: '-',
      checkOutTime: '-',
      workHours: 0,
      status: 'leave',
    },
  ],
  leaveRequests: [
    {
      id: '1',
      employeeName: '王五',
      type: '年假',
      startDate: '2025-01-17',
      endDate: '2025-01-19',
      days: 3,
      reason: '家庭事务',
      status: 'approved',
    },
    {
      id: '2',
      employeeName: '赵六',
      type: '病假',
      startDate: '2025-01-18',
      endDate: '2025-01-18',
      days: 1,
      reason: '身体不适',
      status: 'pending',
    },
  ],
};

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            考勤管理
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            打卡记录、排班管理、请假审批
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出报表
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Plus className="h-4 w-4 mr-2" />
            批量补卡
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>今日出勤</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-3xl">{attendanceData.metrics.todayAttendance}</CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <Badge className="bg-green-100 text-green-600">
                {attendanceData.metrics.attendanceRate}%
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>请假人数</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-white">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-3xl">{attendanceData.metrics.onLeave}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>迟到</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-3xl">{attendanceData.metrics.late}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>早退</CardDescription>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-3xl">{attendanceData.metrics.earlyLeave}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">
            <TrendingUp className="h-4 w-4 mr-2" />
            总览
          </TabsTrigger>
          <TabsTrigger value="records">
            <Clock className="h-4 w-4 mr-2" />
            考勤记录
          </TabsTrigger>
          <TabsTrigger value="leave">
            <Calendar className="h-4 w-4 mr-2" />
            请假管理
          </TabsTrigger>
          <TabsTrigger value="scheduling">
            <Calendar className="h-4 w-4 mr-2" />
            排班管理
          </TabsTrigger>
          <TabsTrigger value="overtime">
            <Clock className="h-4 w-4 mr-2" />
            加班管理
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>今日考勤概况</CardTitle>
              <CardDescription>实时查看员工出勤情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">正常出勤</span>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600">469</div>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">异常记录</span>
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="text-3xl font-bold text-red-600">7</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records">
          <Card>
            <CardHeader>
              <CardTitle>考勤记录</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>员工</TableHead>
                      <TableHead>部门</TableHead>
                      <TableHead>日期</TableHead>
                      <TableHead>上班打卡</TableHead>
                      <TableHead>下班打卡</TableHead>
                      <TableHead>工作时长</TableHead>
                      <TableHead>状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceData.records.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="font-medium">{record.employeeName}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{record.employeeId}</div>
                        </TableCell>
                        <TableCell>{record.department}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.checkInTime}</TableCell>
                        <TableCell>{record.checkOutTime}</TableCell>
                        <TableCell>{record.workHours}小时</TableCell>
                        <TableCell>
                          <Badge className={record.status === 'normal' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}>
                            {record.status === 'normal' ? '正常' : record.status === 'late' ? '迟到' : '请假'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave">
          <Card>
            <CardHeader>
              <CardTitle>请假管理</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attendanceData.leaveRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{request.employeeName}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {request.type} · {request.days}天
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {request.startDate} - {request.endDate}
                          </div>
                        </div>
                        <Badge className={request.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}>
                          {request.status === 'approved' ? '已批准' : '待审核'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduling">
          <Card>
            <CardHeader>
              <CardTitle>排班管理</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  排班管理功能开发中...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overtime">
          <Card>
            <CardHeader>
              <CardTitle>加班管理</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Clock className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  加班管理功能开发中...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
