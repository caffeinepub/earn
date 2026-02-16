import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Plan, UserProfile, DepositRequest, WithdrawalRequest } from '../backend';
import { ExternalBlob } from '../backend';
import type { Principal } from '@icp-sdk/core/principal';

export function useGetPlans() {
  const { actor, isFetching } = useActor();

  return useQuery<Plan[]>({
    queryKey: ['plans'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailablePlans();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDepositAccountDetails() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['depositAccountDetails'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDepositAccountDetails();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAvailableBalance() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['availableBalance'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAvailableBalance();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetWithdrawalLimits() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['withdrawalLimits'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const [min, max] = await Promise.all([
        actor.getMinimumWithdrawalAmount(),
        actor.getMaximumWithdrawalAmount(),
      ]);
      return { min, max };
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReferralTiers() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, bigint]>>({
    queryKey: ['referralTiers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getReferralTiers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useSubmitDepositRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ planId, screenshot }: { planId: bigint; screenshot: ExternalBlob }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitDepositRequest(planId, screenshot);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDepositRequests'] });
    },
  });
}

export function useSubmitWithdrawalRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ account, amount }: { account: string; amount: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitWithdrawalRequest(account, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myWithdrawalRequests'] });
      queryClient.invalidateQueries({ queryKey: ['availableBalance'] });
    },
  });
}

export function useMyDepositRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<DepositRequest[]>({
    queryKey: ['myDepositRequests'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const allRequests = await actor.getAllDepositRequests();
      return allRequests.map(([_, request]) => request);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyWithdrawalRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<WithdrawalRequest[]>({
    queryKey: ['myWithdrawalRequests'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const allRequests = await actor.getAllWithdrawalRequests();
      return allRequests.map(([_, request]) => request);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminDepositRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[Principal, DepositRequest]>>({
    queryKey: ['adminDepositRequests'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllDepositRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminWithdrawalRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[Principal, WithdrawalRequest]>>({
    queryKey: ['adminWithdrawalRequests'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllWithdrawalRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveDeposit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveDepositRequest(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDepositRequests'] });
    },
  });
}

export function useRejectDeposit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectDepositRequest(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDepositRequests'] });
    },
  });
}

export function useApproveWithdrawal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveWithdrawalRequest(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminWithdrawalRequests'] });
    },
  });
}

export function useRejectWithdrawal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectWithdrawalRequest(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminWithdrawalRequests'] });
    },
  });
}
