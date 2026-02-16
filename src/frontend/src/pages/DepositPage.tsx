import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetPlans, useGetDepositAccountDetails, useSubmitDepositRequest } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Info, ArrowDownToLine } from 'lucide-react';
import FileUploadField from '../components/FileUploadField';
import PlanCard from '../components/PlanCard';
import DepositRequestList from '../components/DepositRequestList';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';

export default function DepositPage() {
  const { data: plans, isLoading: plansLoading } = useGetPlans();
  const { data: accountDetails, isLoading: accountLoading } = useGetDepositAccountDetails();
  const submitMutation = useSubmitDepositRequest();

  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const selectedPlan = plans?.find((p) => p.planId.toString() === selectedPlanId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlanId) {
      toast.error('Please select a plan');
      return;
    }

    if (!selectedFile) {
      toast.error('Please upload a payment screenshot');
      return;
    }

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(bytes);

      await submitMutation.mutateAsync({
        planId: BigInt(selectedPlanId),
        screenshot: blob,
      });

      toast.success('Deposit request submitted successfully!');
      setSelectedPlanId('');
      setSelectedFile(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit deposit request');
    }
  };

  if (plansLoading || accountLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <ArrowDownToLine className="h-8 w-8" />
          Make a Deposit
        </h1>
        <p className="text-muted-foreground mt-2">
          Select a plan and submit your payment screenshot for verification
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deposit Information</CardTitle>
              <CardDescription>Send payment to the account below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Transfer the exact deposit amount to the account below and upload a screenshot of the payment confirmation.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-sm text-muted-foreground">Account Holder:</span>
                  <span className="font-medium">{accountDetails?.accountHolderName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-sm text-muted-foreground">Account Number:</span>
                  <span className="font-medium">{accountDetails?.accountNumber}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-sm text-muted-foreground">Payment Channel:</span>
                  <span className="font-medium">{accountDetails?.paymentChannel}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submit Deposit Request</CardTitle>
              <CardDescription>Complete the form below to submit your deposit</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label>Select Plan</Label>
                  <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {plans?.map((plan) => (
                        <SelectItem key={Number(plan.planId)} value={plan.planId.toString()}>
                          Plan {Number(plan.planId)} - Deposit {Number(plan.depositAmount)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <FileUploadField
                  onFileSelect={setSelectedFile}
                  onClear={() => setSelectedFile(null)}
                  selectedFile={selectedFile}
                  label="Payment Screenshot"
                  description="Upload a clear screenshot of your payment confirmation"
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitMutation.isPending || !selectedPlanId || !selectedFile}
                >
                  {submitMutation.isPending ? 'Submitting...' : 'Submit Deposit Request'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {selectedPlan && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Selected Plan</h3>
              <PlanCard plan={selectedPlan} />
            </div>
          )}
        </div>
      </div>

      <DepositRequestList />
    </div>
  );
}
