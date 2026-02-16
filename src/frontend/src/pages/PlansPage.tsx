import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { useGetPlans } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import PlanCard from '../components/PlanCard';
import { TrendingUp } from 'lucide-react';

export default function PlansPage() {
  const navigate = useNavigate();
  const { data: plans, isLoading } = useGetPlans();

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-background border border-border">
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Start Earning Today
              </h1>
              <p className="text-lg text-muted-foreground">
                Choose from our flexible investment plans and start earning daily profits. All plans offer competitive returns with transparent terms.
              </p>
              <div className="flex gap-4 pt-4">
                <Button size="lg" onClick={() => navigate({ to: '/deposit' })} className="gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Get Started
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="/assets/generated/earn-hero-illustration.dim_1600x900.png"
                alt="Earn illustration"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Available Plans</h2>
          <p className="text-muted-foreground mt-2">
            Select the plan that best fits your investment goals
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans?.map((plan) => (
              <PlanCard key={Number(plan.planId)} plan={plan}>
                <Button
                  className="w-full"
                  onClick={() => navigate({ to: '/deposit' })}
                >
                  Select Plan
                </Button>
              </PlanCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
