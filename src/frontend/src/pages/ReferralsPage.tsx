import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetCallerUserProfile, useGetReferralTiers } from '../hooks/useQueries';
import { Users, Gift, Link as LinkIcon } from 'lucide-react';
import CopyToClipboardButton from '../components/CopyToClipboardButton';

export default function ReferralsPage() {
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: tiers, isLoading: tiersLoading } = useGetReferralTiers();

  const isLoading = profileLoading || tiersLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  const referralCode = profile?.referralCode || '';
  const referralLink = `${window.location.origin}?ref=${referralCode}`;
  const totalReferrals = profile?.referrers?.length || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Users className="h-8 w-8" />
          Referral Program
        </h1>
        <p className="text-muted-foreground mt-2">
          Invite friends and earn bonus rewards when they join and activate a plan
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Your Referral Code
            </CardTitle>
            <CardDescription>Share this code with friends to earn bonuses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-mono font-bold text-center">{referralCode}</div>
            </div>
            <CopyToClipboardButton text={referralCode} label="Copy Code" />

            <div className="pt-4 border-t border-border">
              <Label className="text-sm text-muted-foreground mb-2 block">Referral Link</Label>
              <div className="flex gap-2">
                <div className="flex-1 p-2 bg-muted/50 rounded text-sm truncate">{referralLink}</div>
                <CopyToClipboardButton text={referralLink} label="Copy Link" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Your Referral Stats
            </CardTitle>
            <CardDescription>Track your referral progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Total Referrals</span>
                <span className="text-2xl font-bold">{totalReferrals}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Active Referrals</span>
                <span className="text-2xl font-bold">0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Referral Bonus Tiers</CardTitle>
          <CardDescription>Earn bonuses when your referrals activate plans</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Active Referrals Required</TableHead>
                <TableHead>Bonus Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiers?.map(([required, bonus]) => (
                <TableRow key={Number(required)}>
                  <TableCell className="font-medium">{Number(required)} referrals</TableCell>
                  <TableCell className="text-primary font-bold">{Number(bonus)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Not Earned</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
