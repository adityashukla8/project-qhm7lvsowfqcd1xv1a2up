import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { CopilotProvider } from "@/components/CopilotProvider";
import usePageTitle from "@/hooks/usePageTitle";
import Index from "./pages/Index";
import About from "./pages/About";
import MatchTrials from "./pages/MatchTrials";
import Trials from "./pages/Trials";
import TrialDetail from "./pages/TrialDetail";
import PatientInfo from "./pages/PatientInfo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  usePageTitle();
  
  return (
    <CopilotProvider>
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
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </SidebarProvider>
    </CopilotProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CopilotKit runtimeUrl="/functions/copilotkit">
          <AppContent />
          <CopilotSidebar
            instructions="You are a helpful assistant for clinical trial researchers. You can search for patient information by patient ID and clinical trial details by trial ID. When users ask for patient or trial information, use the available functions to fetch the data and present it in a clear, organized format. You can also provide statistics about patients and trials in the system."
            labels={{
              title: "Clinical Trials Assistant",
              initial: "Hi! I can help you search for patient information and clinical trial details. Try asking me:\n\n• 'Get patient with ID P001'\n• 'Show trial details for trial ID NCT123456'\n• 'Show patient statistics'\n• 'Get trial statistics'\n\nWhat would you like to know?"
            }}
          />
        </CopilotKit>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;