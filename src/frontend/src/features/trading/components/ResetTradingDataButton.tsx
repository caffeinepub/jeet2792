import { useState } from 'react';
import { useInternetIdentity } from '../../../hooks/useInternetIdentity';
import { useResetTradingData } from '../hooks/useTradingData';
import { useTradingSession } from '../state/useTradingSession';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function ResetTradingDataButton() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const resetMutation = useResetTradingData();
  const { reset: resetSession } = useTradingSession();

  const [open, setOpen] = useState(false);

  const handleReset = async () => {
    if (isAuthenticated) {
      try {
        await resetMutation.mutateAsync();
        toast.success('All trading data has been reset');
        setOpen(false);
      } catch (err) {
        console.error('Failed to reset data:', err);
        toast.error('Failed to reset trading data');
      }
    } else {
      resetSession();
      toast.success('Session data has been reset');
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset All Data
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete all your trading data including capital, target, totals, and trade history. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReset}
            disabled={resetMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {resetMutation.isPending ? 'Resetting...' : 'Reset All Data'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
