import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User, Zap, UserPlus, LogIn } from "lucide-react";

export default function AdminLogin() {
  const [location, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  // Auto-detect if on signup route
  const isSignupRoute = location === "/admin-signup";
  const [isNewUser, setIsNewUser] = useState(isSignupRoute);
  const [rememberedUsers, setRememberedUsers] = useState<string[]>([]);

  // Update isNewUser when route changes
  useEffect(() => {
    if (isSignupRoute) {
      setIsNewUser(true);
    }
  }, [isSignupRoute]);

  // Load remembered usernames from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("letitride_admin_users");
    if (stored) {
      try {
        setRememberedUsers(JSON.parse(stored));
      } catch {
        setRememberedUsers([]);
      }
    }
  }, []);

  // Save username to localStorage
  const rememberUser = (user: string) => {
    const updated = Array.from(new Set([user, ...rememberedUsers])).slice(0, 5);
    localStorage.setItem("letitride_admin_users", JSON.stringify(updated));
    setRememberedUsers(updated);
  };

  const loginMutation = trpc.adminAuth.loginPasswordless.useMutation({
    onSuccess: (data) => {
      rememberUser(data.username);
      setLocation("/admin-panel");
    },
    onError: (err) => {
      setError(err.message);
    }
  });

  const createAdminMutation = trpc.adminAuth.createAdminPasswordless.useMutation({
    onSuccess: (data) => {
      setError("");
      rememberUser(data.username);
      setLocation("/admin-panel");
    },
    onError: (err) => {
      setError(err.message);
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ username: username.trim() });
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    createAdminMutation.mutate({
      username: username.trim(),
      displayName: displayName.trim() || undefined,
      email: email.trim() || undefined
    });
  };

  const handleQuickLogin = (user: string) => {
    setUsername(user);
    loginMutation.mutate({ username: user });
  };

  const isLoading = loginMutation.isPending || createAdminMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/images/cascade-mountains.jpg')] bg-cover bg-center opacity-20" />
      
      <Card className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isNewUser ? "Create Admin Account" : "Admin Access"}
          </CardTitle>
          <CardDescription>
            {isNewUser 
              ? "Create your admin username to get started"
              : "Enter your username to access the admin panel"
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Quick Login for Remembered Users */}
          {!isNewUser && rememberedUsers.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-3">Quick Login:</p>
              <div className="flex flex-wrap gap-2">
                {rememberedUsers.map((user) => (
                  <Button
                    key={user}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin(user)}
                    disabled={isLoading}
                    className="bg-green-50 border-green-200 hover:bg-green-100"
                  >
                    <User className="w-3 h-3 mr-1" />
                    {user}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {isNewUser ? (
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username (min 3 chars)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                    minLength={3}
                    autoFocus
                  />
                </div>
                <p className="text-xs text-gray-500">This will be your login - no password needed!</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name (Optional)</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@letitridebend.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account & Login
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setIsNewUser(false);
                  setError("");
                }}
              >
                Back to Login
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-500 mb-2">First time here?</p>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsNewUser(true);
                    setError("");
                  }}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Admin Account
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-xs text-gray-400">
              Let It Ride Electric Bikes - Admin Panel
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
