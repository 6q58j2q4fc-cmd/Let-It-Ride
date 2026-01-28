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
import { trpc } from '@/lib/trpc';
import { getLoginUrl } from '@/const';
import { ServiceAppointmentsTab } from '@/components/ServiceAppointmentsTab';
import { toast } from 'sonner';
import { 
  LayoutDashboard, Calendar, ShoppingBag, FileText, Users, 
  DollarSign, TrendingUp, Eye, Star, Plus,
  Edit, Trash2, Send, RefreshCw, Instagram, Facebook,
  Mail, Gift, Gamepad2, BarChart3, Wrench, Clock, CheckCircle,
  XCircle, AlertCircle, Loader2
} from 'lucide-react';

export default function Admin() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [generatingBlog, setGeneratingBlog] = useState(false);
  const [postingSocial, setPostingSocial] = useState(false);

  // Fetch real live data from database
  const { data: stats, isLoading: statsLoading } = trpc.adminDashboard.getStats.useQuery(undefined, {
    refetchInterval: 30000 // Refresh every 30 seconds
  });
  
  const { data: recentActivity, isLoading: activityLoading } = trpc.adminDashboard.getRecentActivity.useQuery();
  const { data: gameStats } = trpc.adminDashboard.getGameStats.useQuery();
  const { data: blogPosts } = trpc.blog.getAllAdmin.useQuery();
  const { data: socialPosts } = trpc.adminDashboard.getAllSocialPosts.useQuery();
  const { data: subscribers } = trpc.adminDashboard.getAllSubscribers.useQuery();
  const { data: coupons } = trpc.adminDashboard.getAllCoupons.useQuery();
  const { data: affiliates } = trpc.adminDashboard.getAllAffiliates.useQuery();
  const { data: products } = trpc.adminDashboard.getAllProducts.useQuery();
  const { data: tours } = trpc.adminDashboard.getAllTours.useQuery();

  const generateBlogMutation = trpc.automation.generateBlogPost.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Blog post generated: ${data.title}`);
      } else {
        toast.error(`Failed to generate blog: ${data.error}`);
      }
      setGeneratingBlog(false);
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
      setGeneratingBlog(false);
    }
  });

  const handleGenerateBlog = async () => {
    setGeneratingBlog(true);
    toast.info('Generating SEO-optimized blog post with AI...');
    generateBlogMutation.mutate();
  };

  const generateSocialMutation = trpc.automation.generateSocialPost.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Social media post generated and queued!');
      } else {
        toast.error(`Failed to generate social post: ${data.error}`);
      }
      setPostingSocial(false);
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
      setPostingSocial(false);
    }
  });

  const runDailyMutation = trpc.automation.runDaily.useMutation({
    onSuccess: (data) => {
      if (data.blog.success && data.social.success) {
        toast.success('Daily automation completed successfully!');
      } else {
        toast.warning('Automation completed with some issues');
      }
    },
    onError: (error) => {
      toast.error(`Automation error: ${error.message}`);
    }
  });

  const handlePostSocial = async () => {
    setPostingSocial(true);
    toast.info('Generating social media post with AI...');
    generateSocialMutation.mutate();
  };

  const handleRunDailyAutomation = () => {
    toast.info('Running daily automation (blog + social)...');
    runDailyMutation.mutate();
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

  const formatCurrency = (value: number | string | undefined) => {
    const num = typeof value === 'string' ? parseFloat(value) : (value || 0);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

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
            <TabsTrigger value="service" className="gap-2">
              <Wrench className="h-4 w-4" />
              Service
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab - Real Live Data */}
          <TabsContent value="dashboard">
            {statsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading live data...</span>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Today's Revenue</CardDescription>
                      <CardTitle className="text-2xl text-primary">
                        {formatCurrency(stats?.todayRevenue)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {stats?.todayBookings || 0} bookings today
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total Revenue</CardDescription>
                      <CardTitle className="text-2xl">
                        {formatCurrency(stats?.totalRevenue)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {stats?.totalBookings || 0} bookings, {stats?.totalOrders || 0} orders
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Pending Items</CardDescription>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        {(stats?.pendingBookings || 0) + (stats?.pendingServiceAppointments || 0)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {stats?.pendingBookings || 0} bookings, {stats?.pendingServiceAppointments || 0} service
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Email Subscribers</CardDescription>
                      <CardTitle className="text-2xl">{stats?.emailSubscribers?.toLocaleString() || 0}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Active subscribers</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Affiliate Earnings</CardDescription>
                      <CardTitle className="text-2xl">{formatCurrency(stats?.affiliateEarnings)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Total paid out</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Game Plays Today</CardDescription>
                      <CardTitle className="text-2xl">{stats?.gamePlaysToday || 0}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {stats?.couponsWonToday || 0} coupons won
                      </p>
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
                    <Button onClick={handleRunDailyAutomation} variant="secondary" disabled={runDailyMutation.isPending}>
                      <BarChart3 className={`h-4 w-4 mr-2 ${runDailyMutation.isPending ? 'animate-spin' : ''}`} />
                      Run Daily Automation
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Bookings - Real Data */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Bookings</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('bookings')}>View All</Button>
                  </CardHeader>
                  <CardContent>
                    {activityLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : recentActivity?.bookings && recentActivity.bookings.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-2 font-medium">Customer</th>
                              <th className="text-left py-3 px-2 font-medium">Date</th>
                              <th className="text-right py-3 px-2 font-medium">Total</th>
                              <th className="text-right py-3 px-2 font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentActivity.bookings.slice(0, 5).map((booking) => (
                              <tr key={booking.id} className="border-b last:border-0">
                                <td className="py-3 px-2">{booking.customerName}</td>
                                <td className="py-3 px-2">{formatDate(booking.bookingDate)}</td>
                                <td className="py-3 px-2 text-right">{formatCurrency(booking.totalPrice)}</td>
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
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No bookings yet</p>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Blog Tab - Real Data */}
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
                    <p className="text-sm text-muted-foreground">AI will create and publish a new blog post every day at 9 AM PST</p>
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
                <div>
                  <CardTitle>Blog Posts</CardTitle>
                  <CardDescription>{blogPosts?.length || 0} total posts</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blogPosts && blogPosts.length > 0 ? (
                    blogPosts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{post.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(post.publishedAt || post.createdAt)} • {post.views || 0} views
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
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No blog posts yet. Generate your first one!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Tab - Real Data */}
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
                    <Badge variant="outline">Setup Required</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <Facebook className="h-5 w-5" />
                      <div>
                        <p className="font-medium">@letitridebend</p>
                        <p className="text-sm text-muted-foreground">Facebook</p>
                      </div>
                    </div>
                    <Badge variant="outline">Setup Required</Badge>
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
                  Generate Post Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scheduled Posts</CardTitle>
                <CardDescription>{socialPosts?.length || 0} total posts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {socialPosts && socialPosts.length > 0 ? (
                    socialPosts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {post.platform === 'instagram' ? <Instagram className="h-5 w-5" /> : <Facebook className="h-5 w-5" />}
                          <div>
                            <p className="font-medium line-clamp-1">{post.content}</p>
                            <p className="text-sm text-muted-foreground">
                              {post.scheduledAt ? formatDate(post.scheduledAt) : 'Not scheduled'}
                            </p>
                          </div>
                        </div>
                        <Badge variant={post.status === 'posted' ? 'default' : post.status === 'failed' ? 'destructive' : 'secondary'}>
                          {post.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No social posts yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab - Real Data */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <CardDescription>View and manage all tour bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity?.bookings && recentActivity.bookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 font-medium">Customer</th>
                          <th className="text-left py-3 px-2 font-medium">Email</th>
                          <th className="text-left py-3 px-2 font-medium">Date</th>
                          <th className="text-left py-3 px-2 font-medium">Guests</th>
                          <th className="text-right py-3 px-2 font-medium">Total</th>
                          <th className="text-right py-3 px-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentActivity.bookings.map((booking) => (
                          <tr key={booking.id} className="border-b last:border-0">
                            <td className="py-3 px-2">{booking.customerName}</td>
                            <td className="py-3 px-2">{booking.customerEmail}</td>
                            <td className="py-3 px-2">{formatDate(booking.bookingDate)}</td>
                            <td className="py-3 px-2">{booking.guests}</td>
                            <td className="py-3 px-2 text-right">{formatCurrency(booking.totalPrice)}</td>
                            <td className="py-3 px-2 text-right">
                              <Badge variant={
                                booking.status === 'confirmed' ? 'default' : 
                                booking.status === 'completed' ? 'secondary' : 
                                booking.status === 'cancelled' ? 'destructive' : 'outline'
                              }>
                                {booking.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No bookings yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab - Real Data */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Product Management</CardTitle>
                  <CardDescription>{products?.length || 0} products in inventory</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </CardHeader>
              <CardContent>
                {products && products.length > 0 ? (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          {product.image && (
                            <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                          )}
                          <div>
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {product.category} • Stock: {product.stock}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(product.price)}</p>
                            {product.salePrice && (
                              <p className="text-sm text-green-600">{formatCurrency(product.salePrice)}</p>
                            )}
                          </div>
                          <Badge variant={product.isActive ? 'default' : 'secondary'}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No products yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Affiliates Tab - Real Data */}
          <TabsContent value="affiliates">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Affiliate Management</CardTitle>
                  <CardDescription>{affiliates?.length || 0} active affiliates</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Affiliate
                </Button>
              </CardHeader>
              <CardContent>
                {affiliates && affiliates.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 font-medium">Name</th>
                          <th className="text-left py-3 px-2 font-medium">Code</th>
                          <th className="text-right py-3 px-2 font-medium">Sales</th>
                          <th className="text-right py-3 px-2 font-medium">Earnings</th>
                          <th className="text-right py-3 px-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {affiliates.map((affiliate) => (
                          <tr key={affiliate.id} className="border-b last:border-0">
                            <td className="py-3 px-2">{affiliate.code}</td>
                            <td className="py-3 px-2">
                              <code className="bg-secondary px-2 py-1 rounded">{affiliate.code}</code>
                            </td>
                            <td className="py-3 px-2 text-right">{affiliate.totalSales || 0}</td>
                            <td className="py-3 px-2 text-right">{formatCurrency(affiliate.totalEarnings || '0')}</td>
                            <td className="py-3 px-2 text-right">
                              <Badge variant={affiliate.status === 'active' ? 'default' : affiliate.status === 'suspended' ? 'destructive' : 'secondary'}>
                                {affiliate.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No affiliates yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coupons Tab - Real Data */}
          <TabsContent value="coupons">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Coupon Management</CardTitle>
                  <CardDescription>{coupons?.length || 0} coupons created</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Coupon
                </Button>
              </CardHeader>
              <CardContent>
                {coupons && coupons.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 font-medium">Code</th>
                          <th className="text-left py-3 px-2 font-medium">Discount</th>
                          <th className="text-right py-3 px-2 font-medium">Used</th>
                          <th className="text-right py-3 px-2 font-medium">Expires</th>
                          <th className="text-right py-3 px-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coupons.map((coupon) => (
                          <tr key={coupon.id} className="border-b last:border-0">
                            <td className="py-3 px-2">
                              <code className="bg-secondary px-2 py-1 rounded">{coupon.code}</code>
                            </td>
                            <td className="py-3 px-2">
                              {coupon.discountType === 'percentage' 
                                ? `${coupon.discountValue}%` 
                                : formatCurrency(coupon.discountValue)}
                            </td>
                            <td className="py-3 px-2 text-right">
                              {coupon.usedCount || 0}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}
                            </td>
                            <td className="py-3 px-2 text-right">
                              {coupon.expiresAt ? formatDate(coupon.expiresAt) : 'Never'}
                            </td>
                            <td className="py-3 px-2 text-right">
                              <Badge variant={coupon.isActive ? 'default' : 'secondary'}>
                                {coupon.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No coupons yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emails Tab - Real Data */}
          <TabsContent value="emails">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Email Subscribers</CardTitle>
                  <CardDescription>{subscribers?.length || 0} subscribers</CardDescription>
                </div>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Export List
                </Button>
              </CardHeader>
              <CardContent>
                {subscribers && subscribers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 font-medium">Email</th>
                          <th className="text-left py-3 px-2 font-medium">Name</th>
                          <th className="text-left py-3 px-2 font-medium">Subscribed</th>
                          <th className="text-right py-3 px-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribers.map((subscriber) => (
                          <tr key={subscriber.id} className="border-b last:border-0">
                            <td className="py-3 px-2">{subscriber.email}</td>
                            <td className="py-3 px-2">{subscriber.name || '-'}</td>
                            <td className="py-3 px-2">{formatDate(subscriber.createdAt)}</td>
                            <td className="py-3 px-2 text-right">
                              <Badge variant={subscriber.isActive ? 'default' : 'secondary'}>
                                {subscriber.isActive ? 'Active' : 'Unsubscribed'}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No subscribers yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="service">
            <ServiceAppointmentsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
