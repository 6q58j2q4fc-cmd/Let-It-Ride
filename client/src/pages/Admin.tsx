import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { toast } from 'sonner';
import { 
  LayoutDashboard, Calendar, ShoppingBag, FileText, Users, 
  Settings, DollarSign, TrendingUp, Eye, Star, Plus,
  Edit, Trash2, Send, RefreshCw, Instagram, Facebook,
  Mail, Gift, Gamepad2, BarChart3
} from 'lucide-react';

export default function Admin() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [generatingBlog, setGeneratingBlog] = useState(false);
  const [postingSocial, setPostingSocial] = useState(false);

  // Mock data
  const stats = {
    todayRevenue: 1250,
    todayBookings: 5,
    pendingOrders: 3,
    totalReviews: 189,
    emailSubscribers: 1234,
    affiliateEarnings: 2450
  };

  const recentBookings = [
    { id: 1, customer: 'John Smith', tour: 'Deschutes River Tour', date: '2026-01-15', guests: 2, total: 200, status: 'confirmed' },
    { id: 2, customer: 'Sarah Johnson', tour: 'Taste of Bend', date: '2026-01-16', guests: 4, total: 600, status: 'pending' },
    { id: 3, customer: 'Mike Brown', tour: 'Short & Sweet', date: '2026-01-14', guests: 2, total: 150, status: 'completed' }
  ];

  const blogPosts = [
    { id: 1, title: 'Best E-Bike Trails in Bend', status: 'published', views: 1234, date: '2026-01-10' },
    { id: 2, title: 'Why E-Bikes Are Perfect for Bend', status: 'published', views: 892, date: '2026-01-08' },
    { id: 3, title: 'Complete Guide to Pedego Bikes', status: 'draft', views: 0, date: '2026-01-12' }
  ];

  const socialQueue = [
    { id: 1, platform: 'instagram', content: 'Explore Bend on an e-bike! 🚴‍♂️', scheduledFor: '2026-01-14 10:00', status: 'scheduled' },
    { id: 2, platform: 'facebook', content: 'New blog post: Best trails in Bend', scheduledFor: '2026-01-14 14:00', status: 'scheduled' }
  ];

  const handleGenerateBlog = async () => {
    setGeneratingBlog(true);
    toast.info('Generating SEO-optimized blog post...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    toast.success('Blog post generated and scheduled!');
    setGeneratingBlog(false);
  };

  const handlePostSocial = async () => {
    setPostingSocial(true);
    toast.info('Posting to social media...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success('Posted to Instagram and Facebook!');
    setPostingSocial(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
          <p className="text-muted-foreground mb-6">Please sign in to access the admin panel</p>
          <a href={getLoginUrl()}>
            <Button size="lg">Sign In</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/">
              <span className="text-xl font-bold text-primary">Let It Ride</span>
            </Link>
            <Badge>Admin</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Site
              </Button>
            </Link>
            <span className="text-sm text-muted-foreground">{user?.email}</span>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 flex-wrap h-auto gap-2">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="bookings" className="gap-2">
              <Calendar className="h-4 w-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="blog" className="gap-2">
              <FileText className="h-4 w-4" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-2">
              <Instagram className="h-4 w-4" />
              Social
            </TabsTrigger>
            <TabsTrigger value="affiliates" className="gap-2">
              <Users className="h-4 w-4" />
              Affiliates
            </TabsTrigger>
            <TabsTrigger value="coupons" className="gap-2">
              <Gift className="h-4 w-4" />
              Coupons
            </TabsTrigger>
            <TabsTrigger value="emails" className="gap-2">
              <Mail className="h-4 w-4" />
              Emails
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Today's Revenue</CardDescription>
                  <CardTitle className="text-2xl text-primary">${stats.todayRevenue}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-600">+15% from yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Today's Bookings</CardDescription>
                  <CardTitle className="text-2xl">{stats.todayBookings}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{stats.pendingOrders} pending</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>TripAdvisor Reviews</CardDescription>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    {stats.totalReviews}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">5.0 average rating</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Email Subscribers</CardDescription>
                  <CardTitle className="text-2xl">{stats.emailSubscribers.toLocaleString()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-600">+23 this week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Affiliate Earnings</CardDescription>
                  <CardTitle className="text-2xl">${stats.affiliateEarnings}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Game Plays Today</CardDescription>
                  <CardTitle className="text-2xl">47</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">12 coupons won</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button onClick={handleGenerateBlog} disabled={generatingBlog}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${generatingBlog ? 'animate-spin' : ''}`} />
                  Generate Blog Post
                </Button>
                <Button onClick={handlePostSocial} disabled={postingSocial} variant="outline">
                  <Send className={`h-4 w-4 mr-2 ${postingSocial ? 'animate-pulse' : ''}`} />
                  Post to Social Media
                </Button>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Review Requests
                </Button>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Bookings</CardTitle>
                <Button variant="outline" size="sm">View All</Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-medium">Customer</th>
                        <th className="text-left py-3 px-2 font-medium">Tour</th>
                        <th className="text-left py-3 px-2 font-medium">Date</th>
                        <th className="text-right py-3 px-2 font-medium">Total</th>
                        <th className="text-right py-3 px-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="border-b last:border-0">
                          <td className="py-3 px-2">{booking.customer}</td>
                          <td className="py-3 px-2">{booking.tour}</td>
                          <td className="py-3 px-2">{booking.date}</td>
                          <td className="py-3 px-2 text-right">${booking.total}</td>
                          <td className="py-3 px-2 text-right">
                            <Badge variant={
                              booking.status === 'confirmed' ? 'default' : 
                              booking.status === 'completed' ? 'secondary' : 'outline'
                            }>
                              {booking.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>AI Blog Generator</CardTitle>
                <CardDescription>Automatically generate SEO-optimized blog posts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <div>
                    <p className="font-medium">Auto-Generate Daily Posts</p>
                    <p className="text-sm text-muted-foreground">AI will create and publish a new blog post every day</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Topic Suggestions</Label>
                  <Textarea placeholder="Enter topics for AI to write about (one per line)..." rows={3} />
                </div>
                <Button onClick={handleGenerateBlog} disabled={generatingBlog}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${generatingBlog ? 'animate-spin' : ''}`} />
                  Generate Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Blog Posts</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{post.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {post.date} • {post.views} views
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Tab */}
          <TabsContent value="social">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Social Media Automation</CardTitle>
                <CardDescription>Auto-post to Instagram and Facebook daily</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <Instagram className="h-5 w-5" />
                      <div>
                        <p className="font-medium">@letitridebend</p>
                        <p className="text-sm text-muted-foreground">Instagram</p>
                      </div>
                    </div>
                    <Badge>Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <Facebook className="h-5 w-5" />
                      <div>
                        <p className="font-medium">@letitridebend</p>
                        <p className="text-sm text-muted-foreground">Facebook</p>
                      </div>
                    </div>
                    <Badge>Connected</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <div>
                    <p className="font-medium">Auto-Post Daily</p>
                    <p className="text-sm text-muted-foreground">Automatically post content with backlinks</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button onClick={handlePostSocial} disabled={postingSocial}>
                  <Send className={`h-4 w-4 mr-2 ${postingSocial ? 'animate-pulse' : ''}`} />
                  Post Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scheduled Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {socialQueue.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {post.platform === 'instagram' ? <Instagram className="h-5 w-5" /> : <Facebook className="h-5 w-5" />}
                        <div>
                          <p className="font-medium">{post.content}</p>
                          <p className="text-sm text-muted-foreground">{post.scheduledFor}</p>
                        </div>
                      </div>
                      <Badge>{post.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs - simplified placeholders */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <CardDescription>View and manage all tour bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Booking management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Manage e-bike inventory and pricing</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Product management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="affiliates">
            <Card>
              <CardHeader>
                <CardTitle>Affiliate Management</CardTitle>
                <CardDescription>Track affiliate performance and payouts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Affiliate management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coupons">
            <Card>
              <CardHeader>
                <CardTitle>Coupon Management</CardTitle>
                <CardDescription>Create and manage discount codes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Coupon management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emails">
            <Card>
              <CardHeader>
                <CardTitle>Email Subscribers</CardTitle>
                <CardDescription>Manage email list and campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Email management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
