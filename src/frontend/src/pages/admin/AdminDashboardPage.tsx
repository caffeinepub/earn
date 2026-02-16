import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminGate from '../../components/AdminGate';
import PendingDepositsTable from '../../components/admin/PendingDepositsTable';
import PendingWithdrawalsTable from '../../components/admin/PendingWithdrawalsTable';
import { Shield } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <AdminGate>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Shield className="h-8 w-8" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Review and manage deposit and withdrawal requests
          </p>
        </div>

        <Tabs defaultValue="deposits" className="space-y-6">
          <TabsList>
            <TabsTrigger value="deposits">Deposit Requests</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawal Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="deposits">
            <PendingDepositsTable />
          </TabsContent>

          <TabsContent value="withdrawals">
            <PendingWithdrawalsTable />
          </TabsContent>
        </Tabs>
      </div>
    </AdminGate>
  );
}
