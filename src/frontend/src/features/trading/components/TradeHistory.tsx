import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, History } from 'lucide-react';
import { formatCurrency } from '../utils/tradingMath';
import { Trade, TradeOutcome } from '../../../backend';

interface TradeHistoryProps {
  trades: Trade[];
}

export default function TradeHistory({ trades }: TradeHistoryProps) {
  const sortedTrades = [...trades].sort((a, b) => Number(b.timestamp - a.timestamp));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <History className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Trade History</CardTitle>
            <CardDescription>
              {trades.length === 0 ? 'No trades recorded yet' : `${trades.length} trade${trades.length !== 1 ? 's' : ''} recorded`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {trades.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No trades recorded yet. Start trading to see your history here.</p>
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead className="text-right">Investment</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead className="text-right">Profit/Loss</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTrades.map((trade, index) => {
                  const date = new Date(Number(trade.timestamp) / 1000000);
                  const isWin = trade.outcome === TradeOutcome.win;
                  
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="text-sm">
                          <div>{date.toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {date.toLocaleTimeString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(trade.invest)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={isWin ? 'default' : 'destructive'}
                          className={isWin ? 'bg-chart-4 hover:bg-chart-4/90' : ''}
                        >
                          {isWin ? (
                            <>
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Win
                            </>
                          ) : (
                            <>
                              <TrendingDown className="h-3 w-3 mr-1" />
                              Loss
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        <span className={isWin ? 'text-chart-4' : 'text-destructive'}>
                          {isWin ? '+' : '-'}{formatCurrency(trade.profitOrLoss)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
