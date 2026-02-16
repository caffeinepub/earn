import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, Coins } from 'lucide-react';
import type { Plan } from '../backend';

interface PlanCardProps {
  plan: Plan;
  children?: React.ReactNode;
}

export default function PlanCard({ plan, children }: PlanCardProps) {
  const depositAmount = Number(plan.depositAmount);
  const dailyProfit = Number(plan.dailyProfit);
  const durationDays = Number(plan.durationDays);
  const totalReturn = dailyProfit * durationDays;
  const roi = ((totalReturn / depositAmount) * 100).toFixed(0);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">Plan {Number(plan.planId)}</CardTitle>
            <CardDescription>Investment opportunity</CardDescription>
          </div>
          <Badge variant="secondary" className="text-sm">
            {roi}% ROI
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Coins className="h-4 w-4" />
              <span>Deposit</span>
            </div>
            <div className="text-lg font-bold">{depositAmount}</div>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Daily Profit</span>
            </div>
            <div className="text-lg font-bold text-primary">{dailyProfit}</div>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Duration</span>
            </div>
            <div className="text-lg font-bold">{durationDays} days</div>
          </div>
        </div>

        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Return</span>
            <span className="text-xl font-bold text-primary">{totalReturn}</span>
          </div>
        </div>

        {children && <div className="pt-2">{children}</div>}
      </CardContent>
    </Card>
  );
}
