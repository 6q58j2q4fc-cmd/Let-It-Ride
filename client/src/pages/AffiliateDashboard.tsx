import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { toast } from 'sonner';
import { 
  DollarSign, Link2, TrendingUp, Copy, ExternalLink, 
  Calendar, Users, ShoppingCart, ArrowUpRight, ArrowDownRight,
  Download
} from 'lucide-react';

export default function AffiliateDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [copied, setCopied] = useState(false);

  // Mock affiliate data
  const affiliateData = {
    status: 'active',
    referralCode: 'LETITRIDE-' + (user?.id || '123'),
    referralLink: `https://letitridebend.com/?ref=LETITRIDE-${user?.id || '123'}`,
    stats: {
      totalEarnings: 1247.50,
      pendingEarnings: 349.50,
      paidEarnings: 898.00,
      totalClicks: 1234,
      totalConversions: 23,
      conversionRate: 1.86
    },
    recentSales: [
      { id: 1, date: '2026-01-12', type: 'Tour', amount: 100, commission: 10, status: 'pending' },
      { id: 2, date: '2026-01-10', type: 'E-Bike', amount: 2995, commission: 299.50, status: 'pending' },
      { id: 3, date: '2026-01-08', type: 'Tour', amount: 150, commission: 15, status: 'paid' },
      { id: 4, date: '2026-01-05', type: 'Tour', amount: 75, commission: 7.50, status: 'paid' },
      { id: 5, date: '2026-01-03', type: 'Rental', amount: 120, commission: 12, status: 'paid' }
    ]
  };

  const copyLink = () => {
    navigator.clipboard.writeText(affiliateData.referralLink);
    setCopied(true);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Affiliate Dashboard</h1>
            <p className="text-muted-foreground mb-6">Sign in to access your affiliate dashboard</p>
            <a href={getLoginUrl()}>
              <Button size="lg">Sign In</Button>
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <section className="py-8 bg-secondary">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.name || 'Affiliate'}</p>
            </div>
            <Badge variant={affiliateData.status === 'active' ? 'default' : 'secondary'} className="w-fit">
              {affiliateData.status === 'active' ? 'Active Affiliate' : 'Pending Approval'}
            </Badge>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container">
          {/* Referral Link */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Your Referral Link
              </CardTitle>
              <CardDescription>Share this link to earn commissions on sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input 
                  value={affiliateData.referralLink} 
                  readOnly 
                  className="font-mono text-sm"
                />
                <Button onClick={copyLink} variant="outline">
                  {copied ? 'Copied!' : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Referral Code: <span className="font-mono font-medium">{affiliateData.referralCode}</span>
              </p>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Earnings</CardDescription>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  ${affiliateData.stats.totalEarnings.toFixed(2)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+12% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Pending Payout</CardDescription>
                <CardTitle className="text-2xl">${affiliateData.stats.pendingEarnings.toFixed(2)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Next payout: Feb 1</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Clicks</CardDescription>
                <CardTitle className="text-2xl">{affiliateData.stats.totalClicks.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+8% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Conversion Rate</CardDescription>
                <CardTitle className="text-2xl">{affiliateData.stats.conversionRate}%</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{affiliateData.stats.totalConversions} conversions</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Sales */}
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>Your latest referral conversions</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium">Date</th>
                      <th className="text-left py-3 px-2 font-medium">Type</th>
                      <th className="text-right py-3 px-2 font-medium">Sale Amount</th>
                      <th className="text-right py-3 px-2 font-medium">Commission</th>
                      <th className="text-right py-3 px-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {affiliateData.recentSales.map((sale) => (
                      <tr key={sale.id} className="border-b last:border-0">
                        <td className="py-3 px-2">
                          {new Date(sale.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td className="py-3 px-2">{sale.type}</td>
                        <td className="py-3 px-2 text-right">${sale.amount.toLocaleString()}</td>
                        <td className="py-3 px-2 text-right font-medium text-primary">
                          ${sale.commission.toFixed(2)}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <Badge variant={sale.status === 'paid' ? 'default' : 'secondary'}>
                            {sale.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Marketing Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Marketing Resources</CardTitle>
              <CardDescription>Banners, images, and copy to help you promote</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Banner Ads</h4>
                  <p className="text-sm text-muted-foreground mb-3">Download banner ads in various sizes</p>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Social Media Kit</h4>
                  <p className="text-sm text-muted-foreground mb-3">Ready-to-post social media content</p>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Email Templates</h4>
                  <p className="text-sm text-muted-foreground mb-3">Pre-written email copy</p>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
