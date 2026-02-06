import { useState } from 'react';
import { useInternetIdentity } from '../../../hooks/useInternetIdentity';
import { useSetCapital } from '../hooks/useTradingData';
import { useTradingSession } from '../state/useTradingSession';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { toast } from 'sonner';

interface CapitalEditorProps {
  currentCapital: number;
}

export default function CapitalEditor({ currentCapital }: CapitalEditorProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const setCapitalMutation = useSetCapital();
  const { setCapital: setSessionCapital } = useTradingSession();

  const [capital, setCapital] = useState(currentCapital.toString());
  const [error, setError] = useState('');

  const handleSave = async () => {
    const value = parseFloat(capital);
    
    if (isNaN(value) || value < 0) {
      setError('Please enter a valid positive number');
      return;
    }

    setError('');

    if (isAuthenticated) {
      try {
        await setCapitalMutation.mutateAsync(value);
        toast.success('Capital updated successfully');
      } catch (err) {
        console.error('Failed to set capital:', err);
        toast.error('Failed to update capital');
      }
    } else {
      setSessionCapital(value);
      toast.success('Capital updated (session only)');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Trading Capital</CardTitle>
            <CardDescription>Set your available trading capital</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="capital">Capital Amount (₹)</Label>
          <Input
            id="capital"
            type="number"
            step="0.01"
            placeholder="Enter capital amount"
            value={capital}
            onChange={(e) => {
              setCapital(e.target.value);
              setError('');
            }}
            className={error ? 'border-destructive' : ''}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <Button
          onClick={handleSave}
          disabled={setCapitalMutation.isPending}
          className="w-full"
        >
          {setCapitalMutation.isPending ? 'Updating...' : 'Update Capital'}
        </Button>
      </CardContent>
    </Card>
  );
}
