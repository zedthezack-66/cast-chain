import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from '@/store';
import { setupEventListeners } from '@/services/blockchain';
import Index from "./pages/Index";
import PollDetails from "./pages/PollDetails";
import VoterDashboard from "./pages/VoterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import { useEffect } from 'react';

const queryClient = new QueryClient();

import { useRouteBasedWallet } from '@/hooks/useRouteBasedWallet';

const AppContent = () => {
  useRouteBasedWallet(); // Handle route-based wallet management
  
  useEffect(() => {
    setupEventListeners();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/polls/:id" element={<PollDetails />} />
        <Route path="/voter-dashboard" element={<VoterDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
