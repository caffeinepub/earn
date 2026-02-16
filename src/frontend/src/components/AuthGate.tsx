import { ReactNode } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, TrendingUp } from 'lucide-react';

interface AuthGateProps {
  children: ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const { identity, login, loginStatus } = useInternetIdentity();

  if (loginStatus === 'initializing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img
                src="/assets/generated/earn-logo.dim_512x512.png"
                alt="Earn"
                className="h-20 w-20 object-contain"
              />
            </div>
            <CardTitle className="text-3xl font-bold">Welcome to Earn</CardTitle>
            <CardDescription className="text-base">
              Start earning daily profits with our investment plans. Login to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center py-4">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">4</div>
                <div className="text-xs text-muted-foreground">Plans Available</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">30</div>
                <div className="text-xs text-muted-foreground">Days Max Duration</div>
              </div>
            </div>
            <Button
              onClick={login}
              disabled={loginStatus === 'logging-in'}
              className="w-full gap-2"
              size="lg"
            >
              {loginStatus === 'logging-in' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Login to Continue
                </>
              )}
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center pt-2">
              <TrendingUp className="h-3 w-3" />
              <span>Secure authentication with Internet Identity</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
