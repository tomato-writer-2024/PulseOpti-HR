'use client';

import { useState, useEffect, useRef } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Bot,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  PhoneOff,
  Send,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Star,
  Zap,
  Brain,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Download,
  Share2,
  ArrowRight,
  User,
  Target,
  Lightbulb,
  Award,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Save,
  Eye,
  Plus,
  Code,
} from 'lucide-react';

// 面试类型
type InterviewType = 'technical' | 'behavioral' | 'hr' | 'mixed';
type InterviewStatus = 'preparing' | 'in_progress' | 'completed' | 'paused';
type QuestionDifficulty = 'easy' | 'medium' | 'hard';

interface Candidate {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  resume?: string;
}

interface Question {
  id: string;
  type: InterviewType;
  difficulty: QuestionDifficulty;
  question: string;
  answer?: string;
  score?: number;
  feedback?: string;
  duration?: number;
}

interface InterviewSession {
  id: string;
  candidateId: string;
  candidateName: string;
  position: string;
  type: InterviewType;
  status: InterviewStatus;
  startTime: string;
  endTime?: string;
  duration: number;
  questions: Question[];
  totalScore: number;
  maxScore: number;
  aiAnalysis: string;
  recommendations: string[];
}

interface SkillAssessment {
  skill: string;
  score: number;
  maxScore: number;
  level: 'Excellent' | 'Good' | 'Average' | 'Poor';
}

interface AnswerAnalysis {
  content: string;
  score: number;
  strengths: string[];
  improvements: string[];
  keywords: string[];
}

export default function AIInterviewAssistantPage() {
  const [activeTab, setActiveTab] = useState('session');
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [interviewTime, setInterviewTime] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 模拟当前面试会话
  const [currentSession] = useState<InterviewSession>({
    id: '1',
    candidateId: '1',
    candidateName: '张三',
    position: '前端开发工程师',
    type: 'technical',
    status: 'in_progress',
    startTime: new Date().toLocaleString('zh-CN'),
    duration: 1800, // 30分钟
    questions: [
      {
        id: '1',
        type: 'technical',
        difficulty: 'medium',
        question: '请介绍一下你的前端开发经验，以及你最喜欢使用的技术栈是什么？',
        answer: '我有5年的前端开发经验，主要使用React和Vue进行开发。我最喜欢使用React，因为它有丰富的生态系统和优秀的性能...',
        score: 85,
        feedback: '回答清晰，技术栈经验丰富，建议补充项目案例',
        duration: 180,
      },
      {
        id: '2',
        type: 'technical',
        difficulty: 'hard',
        question: '请解释一下React的虚拟DOM原理，以及它在性能优化中的作用。',
        answer: '',
        score: 0,
        feedback: '',
        duration: 0,
      },
      {
        id: '3',
        type: 'behavioral',
        difficulty: 'medium',
        question: '请描述一个你解决过的最棘手的技术难题，以及你是如何解决的？',
        answer: '',
        score: 0,
        feedback: '',
        duration: 0,
      },
    ],
    totalScore: 85,
    maxScore: 100,
    aiAnalysis: '候选人技术基础扎实，React经验丰富，但在复杂问题解决能力上需要进一步考察。',
    recommendations: [
      '建议深入了解React底层原理',
      '可以分享更多项目实战经验',
      '关注性能优化方面的实践经验',
    ],
  });

  // 历史面试会话
  const [historySessions] = useState<InterviewSession[]>([
    {
      id: '2',
      candidateId: '2',
      candidateName: '李四',
      position: '后端开发工程师',
      type: 'technical',
      status: 'completed',
      startTime: '2025-04-17 14:00:00',
      endTime: '2025-04-17 15:00:00',
      duration: 3600,
      questions: [],
      totalScore: 92,
      maxScore: 100,
      aiAnalysis: '候选人后端技术扎实，数据库设计和优化能力强，团队协作经验丰富。',
      recommendations: [
        '在分布式系统方面有深入了解',
        '建议增加微服务架构经验分享',
      ],
    },
    {
      id: '3',
      candidateId: '3',
      candidateName: '王五',
      position: '产品经理',
      type: 'mixed',
      status: 'completed',
      startTime: '2025-04-16 10:00:00',
      endTime: '2025-04-16 11:30:00',
      duration: 5400,
      questions: [],
      totalScore: 88,
      maxScore: 100,
      aiAnalysis: '产品思维清晰，用户洞察力强，沟通表达能力优秀。',
      recommendations: [
        '建议加强数据分析能力',
        '可以分享更多成功案例',
      ],
    },
  ]);

  // 技能评估
  const [skillAssessments] = useState<SkillAssessment[]>([
    { skill: '前端基础', score: 90, maxScore: 100, level: 'Excellent' },
    { skill: 'React框架', score: 85, maxScore: 100, level: 'Good' },
    { skill: '性能优化', score: 78, maxScore: 100, level: 'Good' },
    { skill: '工程化', score: 82, maxScore: 100, level: 'Good' },
    { skill: '问题解决', score: 75, maxScore: 100, level: 'Average' },
  ]);

  // AI分析结果
  const [answerAnalysis, setAnswerAnalysis] = useState<AnswerAnalysis | null>(null);

  // 面试类型映射
  const interviewTypeMap: Record<InterviewType, { label: string; color: string; icon: React.ReactNode }> = {
    technical: { label: '技术面试', color: 'bg-blue-100 text-blue-800', icon: <Code className="h-4 w-4" /> },
    behavioral: { label: '行为面试', color: 'bg-green-100 text-green-800', icon: <User className="h-4 w-4" /> },
    hr: { label: 'HR面试', color: 'bg-purple-100 text-purple-800', icon: <MessageSquare className="h-4 w-4" /> },
    mixed: { label: '综合面试', color: 'bg-orange-100 text-orange-800', icon: <Sparkles className="h-4 w-4" /> },
  };

  // 难度映射
  const difficultyMap: Record<QuestionDifficulty, { label: string; color: string }> = {
    easy: { label: '简单', color: 'bg-green-100 text-green-800' },
    medium: { label: '中等', color: 'bg-yellow-100 text-yellow-800' },
    hard: { label: '困难', color: 'bg-red-100 text-red-800' },
  };

  // 状态映射
  const statusMap: Record<InterviewStatus, { label: string; color: string }> = {
    preparing: { label: '准备中', color: 'bg-gray-100 text-gray-800' },
    in_progress: { label: '进行中', color: 'bg-blue-100 text-blue-800' },
    completed: { label: '已完成', color: 'bg-green-100 text-green-800' },
    paused: { label: '已暂停', color: 'bg-yellow-100 text-yellow-800' },
  };

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // AI分析回答
  const handleAnalyzeAnswer = () => {
    setIsAnalyzing(true);
    // 模拟AI分析
    setTimeout(() => {
      setAnswerAnalysis({
        content: '回答内容全面，技术理解正确，建议增加实际项目案例。',
        score: 82,
        strengths: [
          '对React虚拟DOM理解准确',
          '提到了性能优化的关键点',
          '回答逻辑清晰',
        ],
        improvements: [
          '可以补充更多实际项目经验',
          '建议提供具体的数据对比',
        ],
        keywords: ['虚拟DOM', '性能优化', 'Diff算法', '渲染', '优化'],
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  // 下一题
  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentSession.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswerText('');
      setAnswerAnalysis(null);
    }
  };

  // 上一题
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const question = currentSession.questions[currentQuestionIndex - 1];
      setAnswerText(question.answer || '');
    }
  };

  const currentQuestion = currentSession.questions[currentQuestionIndex];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI面试助手</h1>
          <p className="text-gray-600 mt-2">
            智能化面试辅助，提供实时分析和评估
            <Badge variant="secondary" className="ml-2">AI驱动</Badge>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
          <Button onClick={() => {
            // 创建新面试
          }}>
            <Plus className="mr-2 h-4 w-4" />
            新建面试
          </Button>
        </div>
      </div>

      {/* 功能介绍 */}
      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          AI面试助手支持语音/视频面试、实时问答分析、智能评分和反馈建议，帮助提升面试效率和准确性。
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="session">当前面试</TabsTrigger>
          <TabsTrigger value="analysis">AI分析</TabsTrigger>
          <TabsTrigger value="history">历史记录</TabsTrigger>
        </TabsList>

        {/* 当前面试Tab */}
        <TabsContent value="session" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 面试主界面 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 视频区域 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>视频面试</CardTitle>
                      <CardDescription>当前面试：{currentSession.candidateName} - {currentSession.position}</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="text-gray-600">时长：</span>
                        <span className="font-mono font-bold">{formatTime(interviewTime)}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={isAudioEnabled ? 'default' : 'secondary'}
                          size="icon"
                          onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                        >
                          {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant={isVideoEnabled ? 'default' : 'secondary'}
                          size="icon"
                          onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                        >
                          {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* 模拟视频区域 */}
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative">
                    {isVideoEnabled ? (
                      <div className="text-white text-center">
                        <Avatar className="w-24 h-24 mx-auto mb-4">
                          <AvatarFallback className="text-3xl bg-blue-500 text-white">
                            {currentSession.candidateName.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-lg font-medium">{currentSession.candidateName}</div>
                        <div className="text-sm text-gray-400">{currentSession.position}</div>
                      </div>
                    ) : (
                      <div className="text-white text-center">
                        <VideoOff className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                        <div className="text-sm text-gray-400">视频已关闭</div>
                      </div>
                    )}
                    {/* AI分析提示 */}
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-white text-sm">
                        <Brain className="h-4 w-4 text-blue-400" />
                        <span>AI实时分析中...</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 问答区域 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>问题 {currentQuestionIndex + 1}/{currentSession.questions.length}</CardTitle>
                      <CardDescription>请回答以下问题</CardDescription>
                    </div>
                    <Badge className={difficultyMap[currentQuestion.difficulty].color}>
                      {difficultyMap[currentQuestion.difficulty].label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 问题 */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Bot className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 mb-2">AI面试官：</div>
                        <div className="text-gray-700">{currentQuestion.question}</div>
                      </div>
                    </div>
                  </div>

                  {/* 回答输入 */}
                  <div className="space-y-2">
                    <Label>你的回答</Label>
                    <Textarea
                      placeholder="请输入你的回答..."
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      rows={6}
                      className="resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant={isRecording ? 'destructive' : 'secondary'}
                          size="sm"
                          onClick={() => setIsRecording(!isRecording)}
                        >
                          {isRecording ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                          {isRecording ? '停止录音' : '语音输入'}
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePrevQuestion}
                          disabled={currentQuestionIndex === 0}
                        >
                          <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                          上一题
                        </Button>
                        <Button
                          onClick={handleAnalyzeAnswer}
                          disabled={isAnalyzing || !answerText.trim()}
                        >
                          {isAnalyzing ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              分析中...
                            </>
                          ) : (
                            <>
                              <Brain className="mr-2 h-4 w-4" />
                              AI分析
                            </>
                          )}
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleNextQuestion}
                          disabled={currentQuestionIndex === currentSession.questions.length - 1}
                        >
                          下一题
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* AI分析结果 */}
                  {answerAnalysis && (
                    <div className="bg-purple-50 p-4 rounded-lg space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        <div className="font-medium text-gray-800">AI分析结果</div>
                        <Badge className="ml-auto bg-purple-600">
                          得分：{answerAnalysis.score}/100
                        </Badge>
                      </div>
                      <div className="text-gray-700">{answerAnalysis.content}</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="font-medium text-sm text-gray-600 mb-2 flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4 text-green-600" />
                            优点
                          </div>
                          <ul className="space-y-1 text-sm">
                            {answerAnalysis.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start gap-1 text-gray-700">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-600 mb-2 flex items-center gap-1">
                            <ThumbsDown className="h-4 w-4 text-yellow-600" />
                            改进建议
                          </div>
                          <ul className="space-y-1 text-sm">
                            {answerAnalysis.improvements.map((improvement, index) => (
                              <li key={index} className="flex items-start gap-1 text-gray-700">
                                <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <span>{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-600 mb-2">关键词</div>
                        <div className="flex gap-2 flex-wrap">
                          {answerAnalysis.keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* 侧边栏 */}
            <div className="space-y-6">
              {/* 候选人信息 */}
              <Card>
                <CardHeader>
                  <CardTitle>候选人信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-lg bg-blue-500 text-white">
                        {currentSession.candidateName.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{currentSession.candidateName}</div>
                      <div className="text-sm text-gray-600">{currentSession.position}</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">面试类型</span>
                      <Badge className={interviewTypeMap[currentSession.type].color}>
                        {interviewTypeMap[currentSession.type].label}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">开始时间</span>
                      <span>{currentSession.startTime.split(' ')[1]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">总时长</span>
                      <span>{formatTime(currentSession.duration)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 面试进度 */}
              <Card>
                <CardHeader>
                  <CardTitle>面试进度</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>完成进度</span>
                      <span>{Math.round(((currentQuestionIndex + 1) / currentSession.questions.length) * 100)}%</span>
                    </div>
                    <Progress value={((currentQuestionIndex + 1) / currentSession.questions.length) * 100} />
                  </div>
                  <div className="space-y-2">
                    {currentSession.questions.map((q, index) => (
                      <div
                        key={q.id}
                        className={`p-2 rounded-lg text-sm cursor-pointer transition-colors ${
                          index === currentQuestionIndex
                            ? 'bg-blue-100 border-2 border-blue-500'
                            : index < currentQuestionIndex
                            ? 'bg-green-50 border-2 border-green-300'
                            : 'bg-gray-50 border-2 border-gray-200'
                        }`}
                        onClick={() => {
                          setCurrentQuestionIndex(index);
                          setAnswerText(q.answer || '');
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span>问题 {index + 1}</span>
                          {index < currentQuestionIndex ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : index === currentQuestionIndex ? (
                            <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 操作按钮 */}
              <Card>
                <CardHeader>
                  <CardTitle>操作</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <Pause className="mr-2 h-4 w-4" />
                    暂停面试
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Save className="mr-2 h-4 w-4" />
                    保存草稿
                  </Button>
                  <Button className="w-full" variant="destructive">
                    <PhoneOff className="mr-2 h-4 w-4" />
                    结束面试
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* AI分析Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 技能评估 */}
            <Card>
              <CardHeader>
                <CardTitle>技能评估</CardTitle>
                <CardDescription>基于面试回答的技能能力分析</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillAssessments.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{skill.skill}</span>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            skill.level === 'Excellent' ? 'bg-green-500' :
                            skill.level === 'Good' ? 'bg-blue-500' :
                            skill.level === 'Average' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }>
                            {skill.level}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {skill.score}/{skill.maxScore}
                          </span>
                        </div>
                      </div>
                      <Progress value={(skill.score / skill.maxScore) * 100} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI总评 */}
            <Card>
              <CardHeader>
                <CardTitle>AI总评</CardTitle>
                <CardDescription>综合评价和建议</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <div className="font-medium">综合评分</div>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {currentSession.totalScore}/{currentSession.maxScore}
                  </div>
                  <div className="text-sm text-gray-600">
                    {currentSession.aiAnalysis}
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600" />
                    改进建议
                  </div>
                  <ul className="space-y-2">
                    {currentSession.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 历史记录Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>历史面试记录</CardTitle>
              <CardDescription>查看所有已完成的面试记录</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>候选人</TableHead>
                    <TableHead>职位</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>开始时间</TableHead>
                    <TableHead>时长</TableHead>
                    <TableHead>分数</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historySessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-blue-500 text-white">
                              {session.candidateName.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{session.candidateName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{session.position}</TableCell>
                      <TableCell>
                        <Badge className={interviewTypeMap[session.type].color}>
                          {interviewTypeMap[session.type].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{session.startTime}</TableCell>
                      <TableCell className="text-sm">{formatTime(session.duration)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{session.totalScore}/{session.maxScore}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusMap[session.status].color}>
                          {statusMap[session.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
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
      </Tabs>
    </div>
  );
}
