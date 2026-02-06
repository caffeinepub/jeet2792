import { create } from 'zustand';
import { TradeOutcome, Trade } from '../../../backend';

interface TradingSessionState {
  capital: number;
  target: number;
  totalProfit: number;
  totalLoss: number;
  trades: Trade[];
  setCapital: (capital: number) => void;
  setTarget: (target: number) => void;
  recordTrade: (invest: number, outcome: TradeOutcome) => void;
  reset: () => void;
}

const initialState = {
  capital: 0,
  target: 0,
  totalProfit: 0,
  totalLoss: 0,
  trades: [],
};

export const useTradingSession = create<TradingSessionState>((set) => ({
  ...initialState,
  
  setCapital: (capital: number) => set({ capital }),
  
  setTarget: (target: number) => set({ target }),
  
  recordTrade: (invest: number, outcome: TradeOutcome) =>
    set((state) => {
      const profitOrLoss = outcome === TradeOutcome.win ? invest * 0.98 : invest;
      
      const newCapital =
        outcome === TradeOutcome.win
          ? state.capital + profitOrLoss
          : state.capital - invest;
      
      const newTotalProfit =
        outcome === TradeOutcome.win
          ? state.totalProfit + profitOrLoss
          : state.totalProfit;
      
      const newTotalLoss =
        outcome === TradeOutcome.loss
          ? state.totalLoss + invest
          : state.totalLoss;
      
      const newTrade: Trade = {
        timestamp: BigInt(Date.now() * 1000000),
        invest,
        outcome,
        profitOrLoss,
      };
      
      return {
        capital: newCapital,
        totalProfit: newTotalProfit,
        totalLoss: newTotalLoss,
        trades: [...state.trades, newTrade],
      };
    }),
  
  reset: () => set(initialState),
}));
