'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  MapPin,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Navigation,
  Home,
  Map,
  Camera,
  Mic,
  RefreshCw,
  Bell,
  User,
  Building2,
} from 'lucide-react';
import { toast } from 'sonner';

interface ClockRecord {
  id: string;
  type: 'clock_in' | 'clock_out';
  time: string;
  date: string;
  location: string;
  latitude: number;
  longitude: number;
  photo?: string;
  status: 'normal' | 'late' | 'early' | 'absent';
}

interface AttendanceStats {
  totalDays: number;
  lateCount: number;
  earlyCount: number;
  absentCount: number;
  normalCount: number;
}

export default function MobileClockInPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [records, setRecords] = useState<ClockRecord[]>([]);
  const [todayRecords, setTodayRecords] = useState<{ clockIn?: ClockRecord; clockOut?: ClockRecord }>({});
  const [location, setLocation] = useState<{ name: string; address: string } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [clockingIn, setClockingIn] = useState(false);
  const [clockingOut, setClockingOut] = useState(false);
  const [stats, setStats] = useState<AttendanceStats>({
    totalDays: 22,
    lateCount: 2,
    earlyCount: 1,
    absentCount: 0,
    normalCount: 19,
  });

  const timeRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // 更新时间
  useEffect(() => {
    timeRef.current = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    };
  }, []);

  // 获取位置
  const fetchLocation = async () => {
    setLoadingLocation(true);
    try {
      // 模拟获取位置
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLocation({
        name: '公司（科技园）',
        address: '深圳市南山区科技园A座',
      });
    } catch (error) {
      toast.error('获取位置失败，请检查定位权限');
    } finally {
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  // 获取今日打卡记录
  const fetchTodayRecords = async () => {
    const today = new Date().toISOString().split('T')[0];
    const mockRecords: ClockRecord[] = [
      {
        id: '1',
        type: 'clock_in',
        time: '08:55:32',
        date: today,
        location: '公司（科技园）',
        latitude: 22.5431,
        longitude: 114.0579,
        status: 'normal',
      },
    ];
    setRecords(mockRecords);
    const clockIn = mockRecords.find(r => r.type === 'clock_in');
    const clockOut = mockRecords.find(r => r.type === 'clock_out');
    setTodayRecords({ clockIn, clockOut });
  };

  useEffect(() => {
    fetchTodayRecords();
  }, []);

  // 打卡
  const handleClockIn = async () => {
    if (clockingIn) return;
    setClockingIn(true);

    try {
      // 模拟打卡
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newRecord: ClockRecord = {
        id: `clock-${Date.now()}`,
        type: 'clock_in',
        time: currentTime.toLocaleTimeString('zh-CN', { hour12: false }),
        date: new Date().toISOString().split('T')[0],
        location: location?.name || '未知位置',
        latitude: 22.5431,
        longitude: 114.0579,
        status: new Date().getHours() >= 9 ? 'late' : 'normal',
      };

      setRecords([...records, newRecord]);
      setTodayRecords({ ...todayRecords, clockIn: newRecord });
      toast.success('上班打卡成功！');
    } catch (error) {
      toast.error('打卡失败，请重试');
    } finally {
      setClockingIn(false);
    }
  };

  const handleClockOut = async () => {
    if (clockingOut) return;
    setClockingOut(true);

    try {
      // 模拟打卡
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newRecord: ClockRecord = {
        id: `clock-${Date.now()}`,
        type: 'clock_out',
        time: currentTime.toLocaleTimeString('zh-CN', { hour12: false }),
        date: new Date().toISOString().split('T')[0],
        location: location?.name || '未知位置',
        latitude: 22.5431,
        longitude: 114.0579,
        status: new Date().getHours() < 18 ? 'early' : 'normal',
      };

      setRecords([...records, newRecord]);
      setTodayRecords({ ...todayRecords, clockOut: newRecord });
      toast.success('下班打卡成功！');
    } catch (error) {
      toast.error('打卡失败，请重试');
    } finally {
      setClockingOut(false);
    }
  };

  // 获取状态徽章
  const getStatusBadge = (status: ClockRecord['status']) => {
    const badges = {
      normal: { color: 'bg-green-100 text-green-800', text: '正常' },
      late: { color: 'bg-yellow-100 text-yellow-800', text: '迟到' },
      early: { color: 'bg-yellow-100 text-yellow-800', text: '早退' },
      absent: { color: 'bg-red-100 text-red-800', text: '缺勤' },
    };
    const badge = badges[status];
    return <Badge className={badge.color}>{badge.text}</Badge>;
  };

  // 格式化日期
  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部状态栏 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold">张三</div>
              <div className="text-sm opacity-80">技术部 · 高级开发</div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Bell className="h-5 w-5" />
          </Button>
        </div>

        <div className="text-center mb-6">
          <div className="text-6xl font-bold mb-2">
            {currentTime.toLocaleTimeString('zh-CN', { hour12: false })}
          </div>
          <div className="text-lg opacity-80">
            {currentTime.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
          </div>
        </div>

        {/* 打卡按钮 */}
        <div className="flex justify-center gap-6">
          <Button
            className={`h-32 w-32 rounded-full flex flex-col items-center justify-center gap-2 text-lg font-bold transition-all ${
              todayRecords.clockIn
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-white text-blue-600 hover:bg-gray-100'
            }`}
            onClick={handleClockIn}
            disabled={!!todayRecords.clockIn || clockingIn}
          >
            <Clock className="h-8 w-8" />
            {clockingIn ? '打卡中...' : todayRecords.clockIn ? '已打卡' : '上班打卡'}
          </Button>

          <Button
            className={`h-32 w-32 rounded-full flex flex-col items-center justify-center gap-2 text-lg font-bold transition-all ${
              todayRecords.clockOut
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-white text-blue-600 hover:bg-gray-100'
            }`}
            onClick={handleClockOut}
            disabled={!todayRecords.clockIn || !!todayRecords.clockOut || clockingOut}
          >
            <CheckCircle className="h-8 w-8" />
            {clockingOut ? '打卡中...' : todayRecords.clockOut ? '已打卡' : '下班打卡'}
          </Button>
        </div>
      </div>

      {/* 今日打卡记录 */}
      <div className="px-4 -mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">今日打卡</h3>
              <span className="text-sm text-gray-600">
                {formatDate(new Date().toISOString())}
              </span>
            </div>

            {todayRecords.clockIn ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <Clock className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">上班打卡</span>
                      {getStatusBadge(todayRecords.clockIn.status)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {todayRecords.clockIn.time}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {todayRecords.clockIn.location}
                    </div>
                  </div>
                </div>

                {todayRecords.clockOut && (
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">下班打卡</span>
                        {getStatusBadge(todayRecords.clockOut.status)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {todayRecords.clockOut.time}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {todayRecords.clockOut.location}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>今日还未打卡</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 位置信息 */}
      <div className="px-4 mt-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-blue-600 mt-1" />
              <div className="flex-1">
                <div className="font-medium mb-1">当前位置</div>
                {loadingLocation ? (
                  <div className="flex items-center text-sm text-gray-600">
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    获取位置中...
                  </div>
                ) : location ? (
                  <div>
                    <div className="text-sm font-medium">{location.name}</div>
                    <div className="text-xs text-gray-600">{location.address}</div>
                  </div>
                ) : (
                  <div className="text-sm text-red-600">获取位置失败</div>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={fetchLocation}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 本月考勤统计 */}
      <div className="px-4 mt-4">
        <Card>
          <CardContent className="p-4">
            <div className="font-bold mb-4">本月考勤</div>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalDays}</div>
                <div className="text-xs text-gray-600">应出勤</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.normalCount}</div>
                <div className="text-xs text-gray-600">正常</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.lateCount}</div>
                <div className="text-xs text-gray-600">迟到</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.absentCount}</div>
                <div className="text-xs text-gray-600">缺勤</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 最近打卡记录 */}
      <div className="px-4 mt-4">
        <Card>
          <CardContent className="p-4">
            <div className="font-bold mb-4">最近打卡</div>
            <div className="space-y-3">
              {records.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mt-1">
                    {record.type === 'clock_in' ? (
                      <Clock className="h-4 w-4 text-gray-600" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {record.type === 'clock_in' ? '上班打卡' : '下班打卡'}
                      </span>
                      {getStatusBadge(record.status)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {record.time} · {formatDate(record.date)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {record.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 底部导航 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-2">
        <div className="flex justify-around">
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 text-blue-600"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">首页</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 text-gray-600"
          >
            <Map className="h-5 w-5" />
            <span className="text-xs">地图</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 text-gray-600"
          >
            <Calendar className="h-5 w-5" />
            <span className="text-xs">日程</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 text-gray-600"
          >
            <User className="h-5 w-5" />
            <span className="text-xs">我的</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
