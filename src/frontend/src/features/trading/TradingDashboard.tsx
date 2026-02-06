import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetTradingData } from './hooks/useTradingData';
import { useTradingSession } from './state/useTradingSession';
import MetricsPanel from './components/MetricsPanel';
import CapitalEditor from './components/CapitalEditor';
import TargetProfitEditor from './components/TargetProfitEditor';
import TradeEntry from './components/TradeEntry';
import TradeHistory from './components/TradeHistory';
import ResetTradingDataButton from './components/ResetTradingDataButton';
import { Skeleton } from '@/components/ui/skeleton';

export default function TradingDashboard() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  // Authenticated data
  const { data: tradingData, isLoading: tradingDataLoading } = useGetTradingData();

  // Unauthenticated session data
  const sessionData = useTradingSession();

  // Choose data source based on authentication
  const data = isAuthenticated ? tradingData : sessionData;
  const isLoading = isAuthenticated && tradingDataLoading;

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <MetricsPanel data={data} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <CapitalEditor currentCapital={data.capital} />
          <TargetProfitEditor currentTarget={data.target} totalProfit={data.totalProfit} />
        </div>
        <TradeEntry currentCapital={data.capital} />
      </div>

      <div className="flex justify-end">
        <ResetTradingDataButton />
      </div>

      <TradeHistory trades={data.trades} />
    </div>
  );
}
