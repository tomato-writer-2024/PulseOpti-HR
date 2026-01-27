'use client';

import { useState, useEffect } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Building2,
  Users,
  Award,
  Briefcase,
  Star,
  Heart,
  Share2,
  Edit,
  Plus,
  Trash2,
  Eye,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Image as ImageIcon,
  Video,
  FileText,
  Calendar,
  MapPin,
  Target,
  Lightbulb,
  ThumbsUp,
  MessageCircle,
  Share,
  Download,
  MoreVertical,
  Upload,
  X,
} from 'lucide-react';

interface BrandStory {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  status: 'published' | 'draft' | 'archived';
  views: number;
  likes: number;
  publishedAt: string;
  author: string;
}

interface CompanyCulture {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: string;
  status: 'active' | 'inactive';
  order: number;
}

interface EmployeeTestimonial {
  id: string;
  employeeName: string;
  position: string;
  avatar?: string;
  department: string;
  content: string;
  rating: number;
  status: 'approved' | 'pending' | 'rejected';
  date: string;
}

interface CompanyBenefit {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'welfare' | 'growth' | 'environment' | 'life';
  status: 'active' | 'inactive';
  order: number;
}

interface EmployerBrandStats {
  brandScore: number;
  totalViews: number;
  totalInteractions: number;
  employeeStories: number;
  culturalPosts: number;
  testimonials: number;
  growthRate: number;
}

export default function EmployerBrandingPage() {
  const [stats, setStats] = useState<EmployerBrandStats>({
    brandScore: 85,
    totalViews: 12580,
    totalInteractions: 3420,
    employeeStories: 48,
    culturalPosts: 32,
    testimonials: 86,
    growthRate: 15.2,
  });

  const [stories, setStories] = useState<BrandStory[]>([
    {
      id: '1',
      title: '我们的使命：用科技改变世界',
      description: '作为一家技术驱动的公司，我们始终相信技术的力量能够改变世界。从创立之初，我们就确立了清晰的使命和愿景...',
      status: 'published',
      views: 2847,
      likes: 423,
      publishedAt: '2025-04-15',
      author: '张三',
    },
    {
      id: '2',
      title: '团队文化：开放、透明、协作',
      description: '在我们的办公室里，没有等级之分，只有思想的碰撞和创意的火花。开放的文化让每个人都能充分表达自己的观点...',
      status: 'published',
      views: 1923,
      likes: 312,
      publishedAt: '2025-04-10',
      author: '李四',
    },
    {
      id: '3',
      title: '成长故事：从实习生到技术经理',
      description: '三年前，我还是一名实习生，在导师的指导下快速成长。今天，我已经成为技术团队的核心成员...',
      status: 'draft',
      views: 0,
      likes: 0,
      publishedAt: '',
      author: '王五',
    },
  ]);

  const [cultures, setCultures] = useState<CompanyCulture[]>([
    {
      id: '1',
      category: '价值观',
      title: '客户第一',
      description: '始终将客户的需求放在首位，用最优质的服务赢得客户信任',
      icon: 'heart',
      status: 'active',
      order: 1,
    },
    {
      id: '2',
      category: '价值观',
      title: '创新驱动',
      description: '鼓励创新思维，拥抱变化，持续推动技术和业务创新',
      icon: 'lightbulb',
      status: 'active',
      order: 2,
    },
    {
      id: '3',
      category: '价值观',
      title: '团队协作',
      description: '倡导团队合作，互相支持，共同成长，打造高绩效团队',
      icon: 'users',
      status: 'active',
      order: 3,
    },
    {
      id: '4',
      category: '工作方式',
      title: '敏捷开发',
      description: '采用敏捷开发模式，快速响应市场变化，持续交付价值',
      icon: 'target',
      status: 'active',
      order: 1,
    },
  ]);

  const [testimonials, setTestimonials] = useState<EmployeeTestimonial[]>([
    {
      id: '1',
      employeeName: '张三',
      position: '高级软件工程师',
      avatar: '',
      department: '技术部',
      content: '加入公司两年，我的技术能力和管理能力都得到了很大提升。公司提供了丰富的培训和学习资源，导师制度也让我受益匪浅。',
      rating: 5,
      status: 'approved',
      date: '2025-04-18',
    },
    {
      id: '2',
      employeeName: '李四',
      position: '产品经理',
      avatar: '',
      department: '产品部',
      content: '公司的开放文化和扁平化管理让我能够充分发挥创造力。团队成员之间的协作非常顺畅，每个人都能在项目中发挥自己的价值。',
      rating: 5,
      status: 'approved',
      date: '2025-04-15',
    },
    {
      id: '3',
      employeeName: '王五',
      position: '市场专员',
      avatar: '',
      department: '市场部',
      content: '作为应届毕业生，公司给了我很多成长机会。完善的培训和晋升机制让我看到了清晰的职业发展路径。',
      rating: 4,
      status: 'pending',
      date: '2025-04-12',
    },
  ]);

  const [benefits, setBenefits] = useState<CompanyBenefit[]>([
    {
      id: '1',
      title: '五险一金',
      description: '按照国家规定足额缴纳五险一金',
      icon: 'shield',
      category: 'welfare',
      status: 'active',
      order: 1,
    },
    {
      id: '2',
      title: '年度体检',
      description: '每年提供一次全面体检，关注员工健康',
      icon: 'heart',
      category: 'welfare',
      status: 'active',
      order: 2,
    },
    {
      id: '3',
      title: '培训基金',
      description: '每年提供培训基金支持员工学习提升',
      icon: 'book',
      category: 'growth',
      status: 'active',
      order: 1,
    },
    {
      id: '4',
      title: '弹性工作',
      description: '支持弹性工作时间，平衡工作与生活',
      icon: 'clock',
      category: 'environment',
      status: 'active',
      order: 1,
    },
  ]);

  // 弹窗状态
  const [storyDialogOpen, setStoryDialogOpen] = useState(false);
  const [cultureDialogOpen, setCultureDialogOpen] = useState(false);
  const [benefitDialogOpen, setBenefitDialogOpen] = useState(false);

  // 表单状态
  const [selectedStory, setSelectedStory] = useState<BrandStory | null>(null);
  const [selectedCulture, setSelectedCulture] = useState<CompanyCulture | null>(null);
  const [selectedBenefit, setSelectedBenefit] = useState<CompanyBenefit | null>(null);

  const [activeTab, setActiveTab] = useState('overview');

  // 渲染图标
  const renderIcon = (iconName: string, className = 'h-5 w-5') => {
    const icons: Record<string, React.ReactNode> = {
      heart: <Heart className={className} />,
      lightbulb: <Lightbulb className={className} />,
      users: <Users className={className} />,
      target: <Target className={className} />,
      shield: <Award className={className} />,
      clock: <Clock className={className} />,
      book: <FileText className={className} />,
      award: <Award className={className} />,
      briefcase: <Briefcase className={className} />,
      star: <Star className={className} />,
    };
    return icons[iconName] || <Star className={className} />;
  };

  // 获取状态徽章
  const getStatusBadge = (status: string) => {
    const badges: Record<string, { variant: 'default' | 'secondary' | 'outline' | 'destructive'; text: string }> = {
      published: { variant: 'default', text: '已发布' },
      active: { variant: 'default', text: '已启用' },
      approved: { variant: 'default', text: '已审核' },
      draft: { variant: 'secondary', text: '草稿' },
      pending: { variant: 'secondary', text: '待审核' },
      archived: { variant: 'outline', text: '已归档' },
      inactive: { variant: 'outline', text: '已停用' },
      rejected: { variant: 'destructive', text: '已拒绝' },
    };
    const badge = badges[status] || { variant: 'outline', text: status };
    return <Badge variant={badge.variant}>{badge.text}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">雇主品牌管理</h1>
          <p className="text-gray-600 mt-2">打造卓越雇主品牌，吸引优秀人才</p>
        </div>
        <Button>
          <Share2 className="mr-2 h-4 w-4" />
          分享品牌主页
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">总览</TabsTrigger>
          <TabsTrigger value="stories">品牌故事</TabsTrigger>
          <TabsTrigger value="culture">企业文化</TabsTrigger>
          <TabsTrigger value="testimonials">员工见证</TabsTrigger>
          <TabsTrigger value="benefits">员工福利</TabsTrigger>
        </TabsList>

        {/* 总览Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* 品牌评分 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">品牌评分</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-blue-600">{stats.brandScore}</div>
                  <div className="flex items-center text-green-600 text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +{stats.growthRate}%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">总浏览量</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalViews.toLocaleString()}</div>
                <div className="flex items-center text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12.5%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">总互动</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalInteractions.toLocaleString()}</div>
                <div className="flex items-center text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8.3%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">内容总数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {stats.employeeStories + stats.culturalPosts + stats.testimonials}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {stats.employeeStories} 故事 · {stats.culturalPosts} 文化 · {stats.testimonials} 见证
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 品牌预览 */}
          <Card>
            <CardHeader>
              <CardTitle>品牌主页预览</CardTitle>
              <CardDescription>展示在招聘网站上的雇主品牌形象</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 border">
                <div className="text-center space-y-6">
                  <div className="h-20 w-20 bg-blue-600 rounded-full mx-auto flex items-center justify-center">
                    <Building2 className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">PulseOpti HR</h3>
                    <p className="text-gray-600 mt-2">用科技赋能人力资源管理</p>
                  </div>
                  <div className="flex justify-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.brandScore}</div>
                      <div className="text-sm text-gray-600">品牌评分</div>
                    </div>
                    <div className="h-10 w-px bg-gray-300" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{stats.employeeStories}</div>
                      <div className="text-sm text-gray-600">品牌故事</div>
                    </div>
                    <div className="h-10 w-px bg-gray-300" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.testimonials}</div>
                      <div className="text-sm text-gray-600">员工评价</div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-3">
                    <Button variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      查看完整主页
                    </Button>
                    <Button>
                      <Share2 className="mr-2 h-4 w-4" />
                      分享主页
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 品牌故事Tab */}
        <TabsContent value="stories" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">品牌故事</h2>
              <p className="text-gray-600 mt-1">展示公司发展历程和团队文化</p>
            </div>
            <Button onClick={() => {
              setSelectedStory(null);
              setStoryDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              新增故事
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stories.map((story) => (
              <Card key={story.id} className="overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                  <FileText className="h-16 w-16 text-white opacity-80" />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold line-clamp-1">{story.title}</h3>
                    {getStatusBadge(story.status)}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">{story.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {story.views}
                      </span>
                      <span className="flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {story.likes}
                      </span>
                    </div>
                    <span>{story.publishedAt || '草稿'}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 企业文化Tab */}
        <TabsContent value="culture" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">企业文化</h2>
              <p className="text-gray-600 mt-1">定义和展示公司价值观与文化</p>
            </div>
            <Button onClick={() => {
              setSelectedCulture(null);
              setCultureDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              新增文化
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cultures.map((culture) => (
              <Card key={culture.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      {renderIcon(culture.icon, 'h-6 w-6 text-blue-600')}
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-1">{culture.category}</Badge>
                      <h3 className="font-bold">{culture.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{culture.description}</p>
                  <div className="flex items-center justify-between">
                    {getStatusBadge(culture.status)}
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 员工见证Tab */}
        <TabsContent value="testimonials" className="space-y-6">
          <div>
            <h2 className="text-xl font-bold">员工见证</h2>
            <p className="text-gray-600 mt-1">真实员工评价，展示公司工作氛围</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback>
                        {testimonial.employeeName.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-bold">{testimonial.employeeName}</h3>
                          <p className="text-sm text-gray-600">{testimonial.position} · {testimonial.department}</p>
                        </div>
                        {getStatusBadge(testimonial.status)}
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-3 mb-3">{testimonial.content}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{testimonial.date}</span>
                        {testimonial.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">拒绝</Button>
                            <Button size="sm">通过</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 员工福利Tab */}
        <TabsContent value="benefits" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">员工福利</h2>
              <p className="text-gray-600 mt-1">展示公司完善的员工福利体系</p>
            </div>
            <Button onClick={() => {
              setSelectedBenefit(null);
              setBenefitDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              新增福利
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit) => (
              <Card key={benefit.id}>
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    {renderIcon(benefit.icon, 'h-8 w-8 text-blue-600')}
                  </div>
                  <h3 className="font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{benefit.description}</p>
                  {getStatusBadge(benefit.status)}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
