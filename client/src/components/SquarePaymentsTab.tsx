import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, XCircle, AlertCircle, ExternalLink, RefreshCw, Loader2, CreditCard
} from "lucide-react";

export function SquarePaymentsTab() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data: squareStatus, isLoading, refetch } = trpc.square.getStatus.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
                <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h4v4H7V7zm6 0h4v4h-4V7zm-6 6h4v4H7v-4zm6 0h4v4h-4v-4z"/>
              </svg>
            </div>
            <div>
              <CardTitle>Square Payment Integration</CardTitle>
              <CardDescription>Accept payments for tours, rentals, and e-bike sales</CardDescription>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
          >
            {(isLoading || isRefreshing) ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span className="ml-2">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Status */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : squareStatus?.configured ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-green-800">Square API Connected</h4>
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                    {squareStatus.environment === 'sandbox' ? 'Sandbox Mode' : 'Production'}
                  </Badge>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Your Square account is connected and ready to accept payments.
                </p>
                <div className="mt-3 p-3 bg-white rounded border border-green-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <p className="font-medium text-gray-900">{squareStatus.locationName || 'Default'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Location ID:</span>
                      <p className="font-mono text-xs text-gray-700">{squareStatus.locationId}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800">Square API Not Connected</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  {squareStatus?.error || 'Connect your Square account to enable payment processing.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Payment Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <CheckCircle2 className={`w-5 h-5 mt-0.5 ${squareStatus?.configured ? 'text-green-600' : 'text-gray-400'}`} />
              <div>
                <p className="font-medium">Tour Bookings</p>
                <p className="text-sm text-gray-600">Accept payments for guided e-bike tours</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <CheckCircle2 className={`w-5 h-5 mt-0.5 ${squareStatus?.configured ? 'text-green-600' : 'text-gray-400'}`} />
              <div>
                <p className="font-medium">E-Bike Rentals</p>
                <p className="text-sm text-gray-600">Process rental payments and deposits</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <CheckCircle2 className={`w-5 h-5 mt-0.5 ${squareStatus?.configured ? 'text-green-600' : 'text-gray-400'}`} />
              <div>
                <p className="font-medium">E-Bike Sales</p>
                <p className="text-sm text-gray-600">Sell Pedego and Urtopia e-bikes online</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <CheckCircle2 className={`w-5 h-5 mt-0.5 ${squareStatus?.configured ? 'text-green-600' : 'text-gray-400'}`} />
              <div>
                <p className="font-medium">Service Appointments</p>
                <p className="text-sm text-gray-600">Collect deposits for service work</p>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Instructions (show only if not configured) */}
        {!squareStatus?.configured && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Setup Instructions</h4>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-medium">Create a Square Developer Account</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Visit the Square Developer Dashboard to create an application.
                  </p>
                  <a 
                    href="https://developer.squareup.com/apps" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 mt-2"
                  >
                    Open Square Developer Dashboard
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-medium">Get Your API Credentials</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Copy your <strong>Application ID</strong> and <strong>Access Token</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-medium">Configure in Settings</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Add credentials via Settings → Secrets in the management panel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Payment Info */}
        {squareStatus?.configured && squareStatus.environment === 'sandbox' && (
          <Alert>
            <CreditCard className="w-4 h-4" />
            <AlertDescription>
              <strong>Sandbox Mode:</strong> Use test card <code className="bg-gray-100 px-1 rounded">4532 0123 4567 8901</code> with any future expiry and CVV to test payments.
            </AlertDescription>
          </Alert>
        )}

        {/* Help Link */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Need help with Square?</p>
            <p className="text-sm text-gray-600">Visit Square's documentation for detailed guides</p>
          </div>
          <a 
            href="https://developer.squareup.com/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Square Docs
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
