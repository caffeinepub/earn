import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Menu, Wallet, TrendingUp, ArrowDownToLine, ArrowUpFromLine, Users, User, Shield } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LoginButton from './LoginButton';
import { useIsAdmin } from '../hooks/useQueries';
import { useState } from 'react';

export default function AppHeader() {
  const navigate = useNavigate();
  const { data: isAdmin } = useIsAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Plans', path: '/plans', icon: TrendingUp },
    { label: 'Deposit', path: '/deposit', icon: ArrowDownToLine },
    { label: 'Wallet', path: '/wallet', icon: Wallet },
    { label: 'Withdrawals', path: '/withdrawals', icon: ArrowUpFromLine },
    { label: 'Referrals', path: '/referrals', icon: Users },
    { label: 'Account', path: '/account', icon: User },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin', path: '/admin', icon: Shield });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/assets/generated/earn-logo.dim_512x512.png"
              alt="Earn"
              className="h-10 w-10 object-contain"
            />
            <span className="text-2xl font-bold tracking-tight">Earn</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: item.path })}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <LoginButton />
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.path}
                      variant="ghost"
                      onClick={() => {
                        navigate({ to: item.path });
                        setMobileMenuOpen(false);
                      }}
                      className="justify-start gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  );
                })}
                <div className="pt-4 border-t border-border">
                  <LoginButton />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
