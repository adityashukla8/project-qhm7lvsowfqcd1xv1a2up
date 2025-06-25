import { ReactNode } from 'react';
import { useCopilotPatientActions, useCopilotTrialActions } from './CopilotActions';

interface CopilotProviderProps {
  children: ReactNode;
}

export const CopilotProvider = ({ children }: CopilotProviderProps) => {
  // Register all CopilotKit actions
  useCopilotPatientActions();
  useCopilotTrialActions();

  return <>{children}</>;
};