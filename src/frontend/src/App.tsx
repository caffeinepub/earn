import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/AppLayout';
import AuthGate from './components/AuthGate';
import PlansPage from './pages/PlansPage';
import DepositPage from './pages/DepositPage';
import WalletPage from './pages/WalletPage';
import WithdrawalsPage from './pages/WithdrawalsPage';
import ReferralsPage from './pages/ReferralsPage';
import AccountPage from './pages/AccountPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: PlansPage,
});

const plansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/plans',
  component: PlansPage,
});

const depositRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/deposit',
  component: DepositPage,
});

const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wallet',
  component: WalletPage,
});

const withdrawalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/withdrawals',
  component: WithdrawalsPage,
});

const referralsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/referrals',
  component: ReferralsPage,
});

const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/account',
  component: AccountPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboardPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  plansRoute,
  depositRoute,
  walletRoute,
  withdrawalsRoute,
  referralsRoute,
  accountRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthGate>
        <RouterProvider router={router} />
      </AuthGate>
      <Toaster />
    </ThemeProvider>
  );
}
