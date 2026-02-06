import { useState } from 'react';
import { useInternetIdentity } from '../../../hooks/useInternetIdentity';
import { useRecordTrade } from '../hooks/useTradingData';
import { useTradingSession } from '../state/useTradingSession';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import InvestPresets from './InvestPresets';
import { calculateWinProfit, calculateWinReturn, formatCurrency } from '../utils/tradingMath';
import { TradeOutcome } from '../../../backend';

interface TradeEntryProps {
  currentCapital: number;
}

export default function TradeEntry({ currentCapital }: TradeEntryProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const recordTradeMutation = useRecordTrade();
  const { recordTrade: recordSessionTrade } = useTradingSession();

  const [invest, setInvest] = useState<number>(0);

  const winProfit = calculateWinProfit(invest);
  const winReturn = calculateWinReturn(invest);

  const handleRecordTrade = async (outcome: TradeOutcome) => {
    if (invest <= 0) {
      toast.error('Please select or enter a valid investment amount');
      return;
    }

    if (invest > currentCapital) {
      toast.error('Investment amount exceeds available capital');
      return;
    }

    if (isAuthenticated) {
      try {
        await recordTradeMutation.mutateAsync({ invest, outcome });
        toast.success(`${outcome === TradeOutcome.win ? 'Win' : 'Loss'} trade recorded successfully`);
        setInvest(0);
      } catch (err) {
        console.error('Failed to record trade:', err);
        toast.error('Failed to record trade');
      }
    } else {
      recordSessionTrade(invest, outcome);
      toast.success(`${outcome === TradeOutcome.win ? 'Win' : 'Loss'} trade recorded (session only)`);
      setInvest(0);
    }
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Record Trade</CardTitle>
        <CardDescription>Select investment amount and outcome</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <InvestPresets selectedInvest={invest} onSelectInvest={setInvest} />

        {invest > 0 && (
          <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Investment</span>
              <span className="font-semibold">{formatCurrency(invest)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Win Return</span>
              <span className="font-semibold text-chart-4">{formatCurrency(winReturn)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Win Profit</span>
              <span className="font-semibold text-chart-4">{formatCurrency(winProfit)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Loss Amount</span>
              <span className="font-semibold text-destructive">{formatCurrency(invest)}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => handleRecordTrade(TradeOutcome.win)}
            disabled={invest <= 0 || recordTradeMutation.isPending}
            className="gap-2 bg-chart-4 hover:bg-chart-4/90 text-white"
          >
            <TrendingUp className="h-4 w-4" />
            Win
          </Button>
          <Button
            onClick={() => handleRecordTrade(TradeOutcome.loss)}
            disabled={invest <= 0 || recordTradeMutation.isPending}
            variant="destructive"
            className="gap-2"
          >
            <TrendingDown className="h-4 w-4" />
            Loss
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
