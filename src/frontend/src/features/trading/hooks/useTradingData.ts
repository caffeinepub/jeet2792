import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../../hooks/useActor';
import { TradeOutcome, UserProfile } from '../../../backend';

const TRADING_DATA_KEY = 'tradingData';
const USER_PROFILE_KEY = 'currentUserProfile';

export function useGetTradingData() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: [TRADING_DATA_KEY],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTradingData();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSetCapital() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (capital: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setCapital(capital);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRADING_DATA_KEY] });
    },
  });
}

export function useSetTargetProfit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (target: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setTargetProfit(target);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRADING_DATA_KEY] });
    },
  });
}

export function useRecordTrade() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ invest, outcome }: { invest: number; outcome: TradeOutcome }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordTrade(invest, outcome);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRADING_DATA_KEY] });
    },
  });
}

export function useResetTradingData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.resetTradingData();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRADING_DATA_KEY] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: [USER_PROFILE_KEY],
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

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_PROFILE_KEY] });
    },
  });
}
