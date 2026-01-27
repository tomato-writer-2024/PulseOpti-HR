'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Sparkles,
  Mic,
  MicOff,
  Send,
  MessageSquare,
  FileText,
  BarChart3,
  CheckCircle2,
  Clock,
  User,
  AlertCircle,
  Download,
  RefreshCw,
  Eye,
  Play,
  Pause,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Target,
  Brain,
  Zap,
  TrendingUp,
  Lightbulb,
} from 'lucide-react';

interface InterviewSession {
  id: string;
  candidateName: string;
  position: string;
  department: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  duration: number;
  questions: Question[];
  answers: Answer[];
  overallScore: number;
  aiEvaluation: AIEvaluation;
  createdAt: string;
  updatedAt: string;
}

interface Question {
  id: string;
  question: string;
  type: 'technical' | 'behavioral' | 'situational' | 'open';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  evaluationCriteria: string[];
}

interface Answer {
  questionId: string;
  answer: string;
  duration: number;
  score: number;
  feedback: string;
  audioUrl?: string;
}

interface AIEvaluation {
  dimensions: {
    technical: number;
    communication: number;
    problemSolving: number;
    teamwork: number;
    leadership: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  overallVerdict: 'recommended' | 'consider' | 'not-recommended';
}

export default function AIInterviewPage() {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InterviewSession['status']>('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [interviewActive, setInterviewActive] = useState(false);

  const [newInterview, setNewInterview] = useState({
    candidateName: '',
    position: '',
    department: '',
    interviewType: 'technical' as 'technical' | 'behavioral' | 'mixed',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      setSessions([
        {
          id: '1',
          candidateName: '张三',
          position: '高级前端工程师',
          department: '技术部',
          status: 'completed',
          duration: 45,
          questions: [
            { id: '1', question: '请介绍一下你的React项目经验', type: 'technical', category: 'React', difficulty: 'medium', timeLimit: 5, evaluationCriteria: ['项目描述清晰', '技术深度', '解决问题能力'] },
            { id: '2', question: '如何优化前端性能？', type: 'technical', category: '性能优化', difficulty: 'hard', timeLimit: 8, evaluationCriteria: ['全面性', '实践经验', '深度理解'] },
            { id: '3', question: '描述一个你解决过的技术难题', type: 'behavioral', category: '问题解决', difficulty: 'medium', timeLimit: 6, evaluationCriteria: ['分析思路', '解决方案', '结果'] },
          ],
          answers: [
            { questionId: '1', answer: '我有5年React开发经验...', duration: 120, score: 85, feedback: '项目经验丰富，技术栈全面' },
            { questionId: '2', answer: '性能优化可以从多个方面...', duration: 180, score: 90, feedback: '思路清晰，实践经验丰富' },
            { questionId: '3', answer: '曾经遇到一个复杂的渲染性能问题...', duration: 150, score: 88, feedback: '分析深入，解决方案有效' },
          ],
          overallScore: 87,
          aiEvaluation: {
            dimensions: { technical: 90, communication: 85, problemSolving: 88, teamwork: 82, leadership: 80 },
            strengths: ['技术能力强', '解决问题思路清晰', '沟通表达能力好'],
            weaknesses: ['缺乏大型团队协作经验', '项目管理经验有待提升'],
            recommendations: ['建议进行技术深度面试', '关注团队协作能力培养'],
            overallVerdict: 'recommended',
          },
          createdAt: '2025-04-15',
          updatedAt: '2025-04-15',
        },
        {
          id: '2',
          candidateName: '李四',
          position: '产品经理',
          department: '产品部',
          status: 'in-progress',
          duration: 20,
          questions: [
            { id: '1', question: '请介绍一个你主导的产品', type: 'behavioral', category: '产品经验', difficulty: 'medium', timeLimit: 5, evaluationCriteria: ['产品定位', '市场分析', '用户价值'] },
          ],
          answers: [
            { questionId: '1', answer: '我主导了一款企业级SaaS产品...', duration: 100, score: 82, feedback: '产品思维清晰，市场洞察力强' },
          ],
          overallScore: 82,
          aiEvaluation: {
            dimensions: { technical: 70, communication: 90, problemSolving: 85, teamwork: 85, leadership: 80 },
            strengths: ['沟通能力强', '产品思维清晰', '用户导向意识强'],
            weaknesses: ['技术理解有限', '数据分析能力需提升'],
            recommendations: ['加强技术知识学习', '提升数据分析能力'],
            overallVerdict: 'consider',
          },
          createdAt: '2025-04-18',
          updatedAt: '2025-04-18',
        },
        {
          id: '3',
          candidateName: '王五',
          position: '后端工程师',
          department: '技术部',
          status: 'pending',
          duration: 0,
          questions: [],
          answers: [],
          overallScore: 0,
          aiEvaluation: {
            dimensions: { technical: 0, communication: 0, problemSolving: 0, teamwork: 0, leadership: 0 },
            strengths: [],
            weaknesses: [],
            recommendations: [],
            overallVerdict: 'not-recommended',
          },
          createdAt: '2025-04-20',
          updatedAt: '2025-04-20',
        },
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const departments = useMemo(() => {
    return Array.from(new Set(sessions.map((s) => s.department)));
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch =
        session.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
      const matchesDepartment = departmentFilter === 'all' || session.department === departmentFilter;
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [sessions, searchTerm, statusFilter, departmentFilter]);

  const stats = useMemo(() => {
    return {
      total: sessions.length,
      completed: sessions.filter((s) => s.status === 'completed').length,
      inProgress: sessions.filter((s) => s.status === 'in-progress').length,
      pending: sessions.filter((s) => s.status === 'pending').length,
      avgScore: sessions
        .filter((s) => s.status === 'completed' && s.overallScore > 0)
        .reduce((sum, s) => sum + s.overallScore, 0) / Math.max(sessions.filter((s) => s.status === 'completed').length, 1),
    };
  }, [sessions]);

  const getStatusBadge = (status: InterviewSession['status']) => {
    const colors: Record<string, string> = {
      pending: 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    const labels: Record<string, string> = {
      pending: '待开始',
      'in-progress': '进行中',
      completed: '已完成',
      cancelled: '已取消',
    };
    return <Badge className={colors[status]}>{labels[status]}</Badge>;
  };

  const getVerdictBadge = (verdict: string) => {
    const colors: Record<string, string> = {
      recommended: 'bg-green-100 text-green-800',
      consider: 'bg-yellow-100 text-yellow-800',
      'not-recommended': 'bg-red-100 text-red-800',
    };
    const labels: Record<string, string> = {
      recommended: '推荐录用',
      consider: '可考虑',
      'not-recommended': '不推荐',
    };
    return <Badge className={colors[verdict]}>{labels[verdict]}</Badge>;
  };

  const handleCreateInterview = async () => {
    try {
      const newSession: InterviewSession = {
        id: Date.now().toString(),
        ...newInterview,
        status: 'pending',
        duration: 0,
        questions: [],
        answers: [],
        overallScore: 0,
        aiEvaluation: {
          dimensions: { technical: 0, communication: 0, problemSolving: 0, teamwork: 0, leadership: 0 },
          strengths: [],
          weaknesses: [],
          recommendations: [],
          overallVerdict: 'not-recommended',
        },
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setSessions([newSession, ...sessions]);
      setCreateDialogOpen(false);
      setNewInterview({ candidateName: '', position: '', department: '', interviewType: 'technical', difficulty: 'medium' });
    } catch (error) {
      console.error('Failed to create interview:', error);
    }
  };

  const handleStartInterview = (session: InterviewSession) => {
    setSelectedSession(session);
    setInterviewActive(true);
    setViewDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI智能面试</h1>
          <p className="text-muted-foreground mt-1">利用AI技术进行智能面试和评估</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </Button>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            分析报告
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                新建面试
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>创建AI面试</DialogTitle>
                <DialogDescription>设置AI面试的基本信息</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>候选人姓名</Label>
                  <Input
                    placeholder="请输入候选人姓名"
                    value={newInterview.candidateName}
                    onChange={(e) => setNewInterview({ ...newInterview, candidateName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>应聘职位</Label>
                  <Input
                    placeholder="请输入应聘职位"
                    value={newInterview.position}
                    onChange={(e) => setNewInterview({ ...newInterview, position: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>所属部门</Label>
                  <Select value={newInterview.department} onValueChange={(v) => setNewInterview({ ...newInterview, department: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择部门" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="技术部">技术部</SelectItem>
                      <SelectItem value="产品部">产品部</SelectItem>
                      <SelectItem value="市场部">市场部</SelectItem>
                      <SelectItem value="销售部">销售部</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>面试类型</Label>
                    <Select value={newInterview.interviewType} onValueChange={(v: any) => setNewInterview({ ...newInterview, interviewType: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">技术面试</SelectItem>
                        <SelectItem value="behavioral">行为面试</SelectItem>
                        <SelectItem value="mixed">综合面试</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>难度级别</Label>
                    <Select value={newInterview.difficulty} onValueChange={(v: any) => setNewInterview({ ...newInterview, difficulty: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">简单</SelectItem>
                        <SelectItem value="medium">中等</SelectItem>
                        <SelectItem value="hard">困难</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleCreateInterview}>
                  创建面试
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">面试总数</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">已完成 {stats.completed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">进行中</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground mt-1">
              待开始 {stats.pending}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均得分</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.avgScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">满分100分</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">推荐率</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {((sessions.filter((s) => s.aiEvaluation.overallVerdict === 'recommended').length / Math.max(sessions.filter((s) => s.status === 'completed').length, 1)) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">推荐录用比例</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>面试会话 ({filteredSessions.length})</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索候选人、职位..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="部门" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部部门</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待开始</SelectItem>
                  <SelectItem value="in-progress">进行中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSessions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              没有找到匹配的面试记录
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {session.candidateName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-lg font-semibold">{session.candidateName}</h3>
                            {getStatusBadge(session.status)}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span>{session.department}</span>
                            <span>·</span>
                            <span>{session.position}</span>
                            <span>·</span>
                            <span>时长 {session.duration} 分钟</span>
                            <span>·</span>
                            <span>{session.createdAt}</span>
                          </div>
                          {session.status === 'completed' && (
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-amber-500" />
                                <span className="font-semibold text-lg">{session.overallScore}</span>
                                <span className="text-muted-foreground">综合得分</span>
                              </div>
                              {getVerdictBadge(session.aiEvaluation.overallVerdict)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button size="sm" variant="outline" onClick={() => { setSelectedSession(session); setViewDialogOpen(true); }}>
                        <Eye className="h-4 w-4 mr-2" />
                        查看详情
                      </Button>
                      {session.status === 'pending' && (
                        <Button size="sm" onClick={() => handleStartInterview(session)}>
                          <Play className="h-4 w-4 mr-2" />
                          开始面试
                        </Button>
                      )}
                      {session.status === 'completed' && (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          导出报告
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>面试详情</DialogTitle>
          </DialogHeader>
          {selectedSession && (
            <ScrollArea className="max-h-[70vh]">
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">概览</TabsTrigger>
                  <TabsTrigger value="questions">问答</TabsTrigger>
                  <TabsTrigger value="evaluation">AI评估</TabsTrigger>
                  <TabsTrigger value="interview">面试</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <div className="flex items-start gap-4 pb-4 border-b">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {selectedSession.candidateName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{selectedSession.candidateName}</h3>
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusBadge(selectedSession.status)}
                        {selectedSession.status === 'completed' && getVerdictBadge(selectedSession.aiEvaluation.overallVerdict)}
                      </div>
                      <p className="text-muted-foreground">
                        {selectedSession.position} · {selectedSession.department}
                      </p>
                    </div>
                    {selectedSession.status === 'completed' && (
                      <div className="text-center">
                        <div className="flex items-center gap-2 bg-green-50 px-6 py-3 rounded-lg">
                          <Sparkles className="h-8 w-8 text-amber-500" />
                          <div>
                            <p className="text-3xl font-bold text-green-600">{selectedSession.overallScore}</p>
                            <p className="text-xs text-muted-foreground">综合得分</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">面试信息</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">开始时间:</span>
                          <span className="ml-2">{selectedSession.createdAt}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">面试时长:</span>
                          <span className="ml-2">{selectedSession.duration} 分钟</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">问题数量:</span>
                          <span className="ml-2">{selectedSession.questions.length}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">已回答:</span>
                          <span className="ml-2">{selectedSession.answers.length}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {selectedSession.status === 'completed' && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">维度得分</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {Object.entries(selectedSession.aiEvaluation.dimensions).map(([key, value]) => (
                            <div key={key}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground capitalize">{key}</span>
                                <span className="font-medium">{value}</span>
                              </div>
                              <Progress value={value} />
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="questions" className="space-y-4">
                  {selectedSession.questions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      暂无问题
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedSession.questions.map((question) => {
                        const answer = selectedSession.answers.find((a) => a.questionId === question.id);
                        return (
                          <Card key={question.id}>
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline">{question.type}</Badge>
                                    <Badge variant="outline">{question.category}</Badge>
                                    <Badge variant="outline">{question.difficulty}</Badge>
                                  </div>
                                  <CardDescription>{question.question}</CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            {answer && (
                              <CardContent>
                                <div className="mb-3">
                                  <Label className="text-sm text-muted-foreground">回答</Label>
                                  <p className="text-sm mt-1">{answer.answer}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">得分:</span>
                                    <span className="font-bold text-lg">{answer.score}</span>
                                  </div>
                                  <Badge variant="outline">{answer.duration}秒</Badge>
                                </div>
                                {answer.feedback && (
                                  <div className="mt-2 p-2 bg-muted rounded text-sm">
                                    <span className="text-muted-foreground">反馈: </span>
                                    {answer.feedback}
                                  </div>
                                )}
                              </CardContent>
                            )}
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="evaluation" className="space-y-4">
                  {selectedSession.status === 'completed' ? (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Zap className="h-4 w-4 text-yellow-600" />
                            优势亮点
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {selectedSession.aiEvaluation.strengths.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            待提升
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {selectedSession.aiEvaluation.weaknesses.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <Target className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-blue-600" />
                            改进建议
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {selectedSession.aiEvaluation.recommendations.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <Brain className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      面试完成后查看AI评估
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="interview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">AI面试官</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            <Sparkles className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">AI面试官</p>
                          <p className="text-sm text-muted-foreground">
                            {interviewActive ? '正在面试中...' : '准备就绪'}
                          </p>
                        </div>
                        <Badge variant="outline">在线</Badge>
                      </div>

                      <div className="space-y-2">
                        <Label>候选人回答</Label>
                        <Textarea
                          placeholder="请输入您的回答，或使用语音输入..."
                          value={currentAnswer}
                          onChange={(e) => setCurrentAnswer(e.target.value)}
                          rows={4}
                          disabled={!interviewActive}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant={isRecording ? 'destructive' : 'outline'}
                          onClick={() => setIsRecording(!isRecording)}
                          disabled={!interviewActive}
                        >
                          {isRecording ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                          {isRecording ? '停止录音' : '开始录音'}
                        </Button>
                        <Button
                          onClick={() => setCurrentAnswer('')}
                          disabled={!interviewActive}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          提交回答
                        </Button>
                      </div>

                      {interviewActive && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800">
                            AI面试官将根据您的回答进行评估，并提供实时反馈。
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              关闭
            </Button>
            {selectedSession?.status === 'completed' && (
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                导出报告
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
