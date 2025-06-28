import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import usePageTitle from "@/hooks/usePageTitle";
import Index from "./pages/Index";
import About from "./pages/About";
import MatchTrials from "./pages/MatchTrials";
import Trials from "./pages/Trials";
import TrialDetail from "./pages/TrialDetail";
import PatientInfo from "./pages/PatientInfo";
import ProtocolOptimization from "./pages/ProtocolOptimization";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  usePageTitle();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/match-trials" element={<MatchTrials />} />
            <Route path="/trials" element={<Trials />} />
            <Route path="/trials/:id" element={<TrialDetail />} />
            <Route path="/patient-info" element={<PatientInfo />} />
            <Route path="/protocol-optimization" element={<ProtocolOptimization />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;