import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '../utils/tradingMath';

const PRESETS = [1, 10, 50, 100, 200, 500, 1000, 2000, 5000, 10000];

interface InvestPresetsProps {
  selectedInvest: number;
  onSelectInvest: (amount: number) => void;
}

export default function InvestPresets({ selectedInvest, onSelectInvest }: InvestPresetsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Quick Select Investment (₹)</Label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {PRESETS.map((amount) => (
            <Button
              key={amount}
              variant={selectedInvest === amount ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSelectInvest(amount)}
              className="text-xs"
            >
              ₹{amount >= 1000 ? `${amount / 1000}k` : amount}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="custom-invest">Or Enter Custom Amount (₹)</Label>
        <Input
          id="custom-invest"
          type="number"
          step="0.01"
          placeholder="Enter amount"
          value={selectedInvest || ''}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            onSelectInvest(isNaN(value) ? 0 : value);
          }}
        />
      </div>
    </div>
  );
}
