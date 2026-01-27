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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Users,
  Plus,
  Search,
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle,
  FileText,
  User,
  Building,
  Eye,
  Edit,
  Download,
  Filter,
  MoreHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';

type MeetingStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'postponed';
type MeetingType = '1-on-1' | 'team' | 'project' | 'training' | 'review' | 'other';
type MeetingLocationType = 'offline' | 'online' | 'hybrid';

interface MeetingParticipant {
  id: string;
  employeeId: string;
  employeeName: string;
  role: 'host' | 'attendee' | 'optional' | 'recorder';
  department: string;
  attendance?: 'confirmed' | 'declined' | 'pending';
}

interface Meeting {
  id: string;
  title: string;
  description: string;
  type: MeetingType;
  status: MeetingStatus;
  locationType: MeetingLocationType;
  location: string;
  meetingLink?: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  host: string;
  department: string;
  participants: MeetingParticipant[];
  agenda: string[];
  minutes?: string;
  actionItems: {
    id: string;
    description: string;
    assignee: string;
    dueDate?: string;
    status: 'open' | 'completed';
  }[];
  relatedProject?: string;
  relatedGoal?: string;
  materials: {
    name: string;
    url: string;
  }[];
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    until?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function BusinessSupportMeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateMeeting, setShowCreateMeeting] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    type: 'other' as MeetingType,
    locationType: 'offline' as MeetingLocationType,
    location: '',
    date: '',
    startTime: '',
    duration: '60',
    host: '',
    department: '',
    agenda: '',
  });

  useEffect(() => {
    // 模拟获取业务支持会议数据
    setTimeout(() => {
      setMeetings([
        {
          id: '1',
          title: '技术部人才梯队建设月度例会',
          description: '讨论技术团队人才梯队建设项目的进展和下一步计划',
          type: 'project',
          status: 'completed',
          locationType: 'offline',
          location: '3号会议室',
          date: '2024-02-28',
          startTime: '14:00',
          endTime: '15:30',
          duration: 90,
          host: '张三 (HR BP)',
          department: '技术部',
          participants: [
            {
              id: '1',
              employeeId: 'E001',
              employeeName: '张三 (HR BP)',
              role: 'host',
              department: '人力资源部',
              attendance: 'confirmed',
            },
            {
              id: '2',
              employeeId: 'E100',
              employeeName: '李技术总监',
              role: 'attendee',
              department: '技术部',
              attendance: 'confirmed',
            },
            {
              id: '3',
              employeeId: 'E101',
              employeeName: '王架构师',
              role: 'attendee',
              department: '技术部',
              attendance: 'confirmed',
            },
          ],
          agenda: [
            '项目进度汇报',
            '高潜人才识别情况',
            '培训计划实施进度',
            '问题讨论与解决方案',
          ],
          minutes: '会议纪要内容...',
          actionItems: [
            {
              id: '1',
              description: '完成下一批高潜人才评估',
              assignee: '李技术总监',
              dueDate: '2024-03-15',
              status: 'open',
            },
            {
              id: '2',
              description: '准备下一季度培训方案',
              assignee: '张三 (HR BP)',
              dueDate: '2024-03-10',
              status: 'open',
            },
          ],
          relatedProject: 'HR-2024-001',
          materials: [],
          createdAt: '2024-02-20T10:00:00',
          updatedAt: '2024-02-28T16:00:00',
        },
        {
          id: '2',
          title: 'HRBP与业务部门对齐会',
          description: '与销售部门HRBP对齐第一季度工作重点',
          type: '1-on-1',
          status: 'completed',
          locationType: 'online',
          location: '腾讯会议',
          meetingLink: 'https://meeting.tencent.com/xxx',
          date: '2024-02-25',
          startTime: '10:00',
          endTime: '11:00',
          duration: 60,
          host: '王五 (HR BP)',
          department: '销售部',
          participants: [
            {
              id: '1',
              employeeId: 'E002',
              employeeName: '王五 (HR BP)',
              role: 'host',
              department: '人力资源部',
              attendance: 'confirmed',
            },
            {
              id: '2',
              employeeId: 'E200',
              employeeName: '赵销售总监',
              role: 'attendee',
              department: '销售部',
              attendance: 'confirmed',
            },
          ],
          agenda: [
            'Q1工作重点对齐',
            '销售团队激励方案讨论',
            '人才招聘需求确认',
          ],
          actionItems: [],
          relatedGoal: '2',
          materials: [],
          createdAt: '2024-02-20T14:00:00',
          updatedAt: '2024-02-25T11:00:00',
        },
        {
          id: '3',
          title: '组织架构优化研讨会',
          description: '讨论公司组织架构优化方案',
          type: 'team',
          status: 'scheduled',
          locationType: 'hybrid',
          location: '大会议室 + 线上',
          meetingLink: 'https://meeting.tencent.com/yyy',
          date: '2024-03-05',
          startTime: '09:30',
          endTime: '11:30',
          duration: 120,
          host: 'HR Director',
          department: '人力资源部',
          participants: [
            {
              id: '1',
              employeeId: 'E300',
              employeeName: 'HR Director',
              role: 'host',
              department: '人力资源部',
              attendance: 'confirmed',
            },
            {
              id: '2',
              employeeId: 'E400',
              employeeName: 'CEO',
              role: 'attendee',
              department: '管理层',
              attendance: 'confirmed',
            },
            {
              id: '3',
              employeeId: 'E401',
              employeeName: 'COO',
              role: 'attendee',
              department: '管理层',
              attendance: 'pending',
            },
          ],
          agenda: [
            '现有组织架构问题分析',
            '优化方案讨论',
            '实施计划制定',
          ],
          actionItems: [],
          materials: [],
          createdAt: '2024-02-25T09:00:00',
          updatedAt: '2024-02-25T09:00:00',
        },
        {
          id: '4',
          title: '绩效考核复盘会',
          description: '上季度绩效考核结果复盘和改进讨论',
          type: 'review',
          status: 'scheduled',
          locationType: 'offline',
          location: '2号会议室',
          date: '2024-03-10',
          startTime: '14:00',
          endTime: '16:00',
          duration: 120,
          host: 'HR Director',
          department: '人力资源部',
          participants: [
            {
              id: '1',
              employeeId: 'E300',
              employeeName: 'HR Director',
              role: 'host',
              department: '人力资源部',
              attendance: 'confirmed',
            },
          ],
          agenda: [
            '绩效考核结果分析',
            '部门绩效对比',
            '问题讨论',
            '改进建议',
          ],
          actionItems: [],
          materials: [],
          createdAt: '2024-02-26T10:00:00',
          updatedAt: '2024-02-26T10:00:00',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateMeeting = () => {
    const meeting: Meeting = {
      id: Date.now().toString(),
      title: newMeeting.title,
      description: newMeeting.description,
      type: newMeeting.type,
      status: 'scheduled',
      locationType: newMeeting.locationType,
      location: newMeeting.location,
      date: newMeeting.date,
      startTime: newMeeting.startTime,
      endTime: newMeeting.startTime,
      duration: parseInt(newMeeting.duration) || 60,
      host: newMeeting.host,
      department: newMeeting.department,
      participants: [],
      agenda: newMeeting.agenda.split('\n').filter(item => item.trim() !== ''),
      actionItems: [],
      materials: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 计算结束时间
    const startDateTime = new Date(`${newMeeting.date}T${newMeeting.startTime}`);
    startDateTime.setMinutes(startDateTime.getMinutes() + meeting.duration);
    meeting.endTime = startDateTime.toTimeString().slice(0, 5);

    setMeetings([meeting, ...meetings]);
    setShowCreateMeeting(false);
    toast.success('会议已创建');
    setNewMeeting({
      title: '',
      description: '',
      type: 'other',
      locationType: 'offline',
      location: '',
      date: '',
      startTime: '',
      duration: '60',
      host: '',
      department: '',
      agenda: '',
    });
  };

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || meeting.status === statusFilter;
    const matchesType = typeFilter === 'all' || meeting.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const statusConfig: Record<MeetingStatus, { label: string; color: string; icon: any }> = {
    scheduled: { label: '已安排', color: 'bg-blue-500', icon: Calendar },
    'in-progress': { label: '进行中', color: 'bg-green-500', icon: Clock },
    completed: { label: '已完成', color: 'bg-gray-500', icon: CheckCircle },
    cancelled: { label: '已取消', color: 'bg-red-500', icon: Calendar },
    postponed: { label: '已延期', color: 'bg-orange-500', icon: Calendar },
  };

  const typeConfig: Record<MeetingType, { label: string; color: string; icon: any }> = {
    '1-on-1': { label: '1对1', color: 'bg-purple-500', icon: User },
    team: { label: '团队', color: 'bg-blue-500', icon: Users },
    project: { label: '项目', color: 'bg-green-500', icon: FileText },
    training: { label: '培训', color: 'bg-orange-500', icon: Users },
    review: { label: '复盘', color: 'bg-cyan-500', icon: CheckCircle },
    other: { label: '其他', color: 'bg-gray-500', icon: MoreHorizontal },
  };

  const locationTypeConfig: Record<MeetingLocationType, { label: string; icon: any }> = {
    offline: { label: '线下', icon: MapPin },
    online: { label: '线上', icon: Video },
    hybrid: { label: '混合', icon: Video },
  };

  const statistics = {
    total: meetings.length,
    scheduled: meetings.filter((m) => m.status === 'scheduled').length,
    inProgress: meetings.filter((m) => m.status === 'in-progress').length,
    completed: meetings.filter((m) => m.status === 'completed').length,
    totalParticipants: meetings.reduce((sum, m) => sum + m.participants.length, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-600" />
              业务支持会议
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              管理HRBP与业务部门的会议
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.info('导出中...')}>
              <Download className="h-4 w-4 mr-2" />
              导出
            </Button>
            <Button onClick={() => setShowCreateMeeting(true)}>
              <Plus className="h-4 w-4 mr-2" />
              创建会议
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">总会议数</p>
                  <p className="text-2xl font-bold">{statistics.total}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">已安排</p>
                  <p className="text-2xl font-bold text-blue-600">{statistics.scheduled}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">进行中</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.inProgress}</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">已完成</p>
                  <p className="text-2xl font-bold text-gray-600">{statistics.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">总参与人</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {statistics.totalParticipants}
                  </p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 筛选栏 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索会议名称、主持人或部门..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  {Object.entries(statusConfig).map(([value, config]) => (
                    <SelectItem key={value} value={value}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  {Object.entries(typeConfig).map(([value, config]) => (
                    <SelectItem key={value} value={value}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 会议列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 flex items-center justify-center h-64">
              <div className="text-gray-600 dark:text-gray-400">加载中...</div>
            </div>
          ) : filteredMeetings.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">暂无会议</p>
              <Button className="mt-4" onClick={() => setShowCreateMeeting(true)}>
                <Plus className="h-4 w-4 mr-2" />
                创建会议
              </Button>
            </div>
          ) : (
            filteredMeetings.map((meeting) => {
              const StatusIcon = statusConfig[meeting.status].icon;
              const TypeIcon = typeConfig[meeting.type].icon;
              const LocationIcon = locationTypeConfig[meeting.locationType].icon;

              return (
                <Card key={meeting.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{meeting.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge className={`${statusConfig[meeting.status].color} text-white border-0 flex items-center gap-1`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[meeting.status].label}
                          </Badge>
                          <Badge className={`${typeConfig[meeting.type].color} text-white border-0 flex items-center gap-1`}>
                            <TypeIcon className="h-3 w-3" />
                            {typeConfig[meeting.type].label}
                          </Badge>
                          <span className="text-sm">{meeting.date}</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {meeting.description}
                      </p>

                      {/* 时间和地点 */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">时间</p>
                            <p className="font-medium">{meeting.startTime} - {meeting.endTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <LocationIcon className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">地点</p>
                            <p className="font-medium">{meeting.location}</p>
                          </div>
                        </div>
                      </div>

                      {/* 主持人和部门 */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">主持人</span>
                          <p className="font-medium">{meeting.host}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">部门</span>
                          <p className="font-medium">{meeting.department}</p>
                        </div>
                      </div>

                      {/* 参与人 */}
                      {meeting.participants.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {meeting.participants.length} 位参与者
                          </span>
                          <div className="flex -space-x-2">
                            {meeting.participants.slice(0, 3).map((participant) => (
                              <div
                                key={participant.id}
                                className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white dark:border-gray-800"
                                title={participant.employeeName}
                              >
                                <span className="text-xs font-medium text-blue-600">
                                  {participant.employeeName.charAt(0)}
                                </span>
                              </div>
                            ))}
                            {meeting.participants.length > 3 && (
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white dark:border-gray-800">
                                <span className="text-xs text-gray-600">
                                  +{meeting.participants.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 议程 */}
                      {meeting.agenda.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">会议议程</p>
                          <ul className="space-y-1">
                            {meeting.agenda.slice(0, 3).map((item, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <span className="text-gray-400">{index + 1}.</span>
                                <span className="line-clamp-1">{item}</span>
                              </li>
                            ))}
                            {meeting.agenda.length > 3 && (
                              <li className="text-xs text-gray-500">
                                还有 {meeting.agenda.length - 3} 项议程...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* 待办事项 */}
                      {meeting.actionItems.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            待办事项 ({meeting.actionItems.filter(item => item.status === 'open').length}/{meeting.actionItems.length})
                          </p>
                          <ul className="space-y-1">
                            {meeting.actionItems.slice(0, 2).map((item) => (
                              <li key={item.id} className="text-sm flex items-start gap-2">
                                <CheckCircle className={`h-4 w-4 flex-shrink-0 mt-0.5 ${item.status === 'completed' ? 'text-green-500' : 'text-gray-300'}`} />
                                <span className="line-clamp-1">{item.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* 操作按钮 */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          查看详情
                        </Button>
                        {meeting.meetingLink && (
                          <Button variant="outline" size="sm" className="flex-1">
                            <Video className="h-4 w-4 mr-1" />
                            加入会议
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* 创建会议弹窗 */}
      <Dialog open={showCreateMeeting} onOpenChange={setShowCreateMeeting}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>创建会议</DialogTitle>
            <DialogDescription>
              创建新的HRBP与业务部门会议
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>会议标题 *</Label>
              <Input
                placeholder="输入会议标题"
                value={newMeeting.title}
                onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>会议描述</Label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                placeholder="输入会议描述..."
                value={newMeeting.description}
                onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>会议类型 *</Label>
                <Select
                  value={newMeeting.type}
                  onValueChange={(v) => setNewMeeting({ ...newMeeting, type: v as MeetingType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeConfig).map(([value, config]) => (
                      <SelectItem key={value} value={value}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>地点类型 *</Label>
                <Select
                  value={newMeeting.locationType}
                  onValueChange={(v) => setNewMeeting({ ...newMeeting, locationType: v as MeetingLocationType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offline">线下</SelectItem>
                    <SelectItem value="online">线上</SelectItem>
                    <SelectItem value="hybrid">混合</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>时长（分钟）</Label>
                <Input
                  type="number"
                  value={newMeeting.duration}
                  onChange={(e) => setNewMeeting({ ...newMeeting, duration: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>地点</Label>
              <Input
                placeholder="输入会议地点或会议链接"
                value={newMeeting.location}
                onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>会议日期 *</Label>
                <Input
                  type="date"
                  value={newMeeting.date}
                  onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>开始时间 *</Label>
                <Input
                  type="time"
                  value={newMeeting.startTime}
                  onChange={(e) => setNewMeeting({ ...newMeeting, startTime: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>主持人 *</Label>
                <Input
                  placeholder="输入主持人姓名"
                  value={newMeeting.host}
                  onChange={(e) => setNewMeeting({ ...newMeeting, host: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>部门 *</Label>
                <Input
                  placeholder="输入部门"
                  value={newMeeting.department}
                  onChange={(e) => setNewMeeting({ ...newMeeting, department: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>会议议程（每行一项）</Label>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                placeholder="输入会议议程..."
                value={newMeeting.agenda}
                onChange={(e) => setNewMeeting({ ...newMeeting, agenda: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateMeeting(false)}>
              取消
            </Button>
            <Button onClick={handleCreateMeeting}>
              <Plus className="h-4 w-4 mr-2" />
              创建会议
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
