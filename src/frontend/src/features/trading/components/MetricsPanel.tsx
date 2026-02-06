import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target, Wallet } from 'lucide-react';
import { formatCurrency, calculateTargetRemaining } from '../utils/tradingMath';

interface MetricsPanelProps {
  data: {
    capital: number;
    target: number;
    totalProfit: number;
    totalLoss: number;
  };
}

export default function MetricsPanel({ data }: MetricsPanelProps) {
  const targetRemaining = calculateTargetRemaining(data.target, data.totalProfit);

  const metrics = [
    {
      title: 'Current Capital',
      value: data.capital,
      icon: Wallet,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Profit',
      value: data.totalProfit,
      icon: TrendingUp,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    },
    {
      title: 'Total Loss',
      value: data.totalLoss,
      icon: TrendingDown,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      title: 'Target Remaining',
      value: targetRemaining,
      icon: Target,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${metric.color}`}>
                {formatCurrency(metric.value)}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
