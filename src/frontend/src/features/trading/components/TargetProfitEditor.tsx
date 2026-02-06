import { useState } from 'react';
import { useInternetIdentity } from '../../../hooks/useInternetIdentity';
import { useSetTargetProfit } from '../hooks/useTradingData';
import { useTradingSession } from '../state/useTradingSession';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency, calculateTargetRemaining } from '../utils/tradingMath';

interface TargetProfitEditorProps {
  currentTarget: number;
  totalProfit: number;
}

export default function TargetProfitEditor({ currentTarget, totalProfit }: TargetProfitEditorProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const setTargetMutation = useSetTargetProfit();
  const { setTarget: setSessionTarget } = useTradingSession();

  const [target, setTarget] = useState(currentTarget.toString());
  const [error, setError] = useState('');

  const targetRemaining = calculateTargetRemaining(parseFloat(target) || 0, totalProfit);

  const handleSave = async () => {
    const value = parseFloat(target);
    
    if (isNaN(value) || value < 0) {
      setError('Please enter a valid positive number');
      return;
    }

    setError('');

    if (isAuthenticated) {
      try {
        await setTargetMutation.mutateAsync(value);
        toast.success('Target profit updated successfully');
      } catch (err) {
        console.error('Failed to set target:', err);
        toast.error('Failed to update target profit');
      }
    } else {
      setSessionTarget(value);
      toast.success('Target profit updated (session only)');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-chart-1/10">
            <Target className="h-5 w-5 text-chart-1" />
          </div>
          <div>
            <CardTitle>Target Profit</CardTitle>
            <CardDescription>Set your profit goal</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="target">Target Amount (₹)</Label>
          <Input
            id="target"
            type="number"
            step="0.01"
            placeholder="Enter target profit"
            value={target}
            onChange={(e) => {
              setTarget(e.target.value);
              setError('');
            }}
            className={error ? 'border-destructive' : ''}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        
        {parseFloat(target) > 0 && (
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground mb-1">Remaining to Target</p>
            <p className="text-xl font-bold text-chart-1">{formatCurrency(targetRemaining)}</p>
          </div>
        )}

        <Button
          onClick={handleSave}
          disabled={setTargetMutation.isPending}
          className="w-full"
        >
          {setTargetMutation.isPending ? 'Updating...' : 'Update Target'}
        </Button>
      </CardContent>
    </Card>
  );
}
