import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

interface CopilotProviderProps {
  children: React.ReactNode;
}

export function CopilotProvider({ children }: CopilotProviderProps) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <CopilotSidebar
        instructions="You are an AI assistant for the Criteria-AI clinical trials matching system. You can help users search for patient information, find clinical trials, and provide insights about the matching process. When users ask about patients, use the searchPatients function to find relevant patient data."
        labels={{
          title: "Criteria-AI Assistant",
          initial: "Hi! I'm your AI assistant for clinical trials matching. I can help you search for patient information, find trials, and answer questions about the system. How can I help you today?",
        }}
        defaultOpen={false}
        clickOutsideToClose={false}
      >
        {children}
      </CopilotSidebar>
    </CopilotKit>
  );
}