import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AuthControls from './components/AuthControls';
import ProfileSetupModal from './components/ProfileSetupModal';
import TradingDashboard from './features/trading/TradingDashboard';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  if (isInitializing) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading jeet2792...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-chart-1 flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                J
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">jeet2792</h1>
                <p className="text-xs text-muted-foreground">Trading Calculator</p>
              </div>
            </div>
            <AuthControls />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {!isAuthenticated && (
            <Alert className="mb-6 border-chart-1/20 bg-chart-1/5">
              <AlertCircle className="h-4 w-4 text-chart-1" />
              <AlertDescription className="text-sm">
                You're using local session mode. Sign in to save your trading data permanently.
              </AlertDescription>
            </Alert>
          )}
          
          <TradingDashboard />
        </main>

        <footer className="border-t border-border mt-16 py-6 bg-card/30">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © 2026. Built with ❤️ using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </div>
        </footer>

        <ProfileSetupModal />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
