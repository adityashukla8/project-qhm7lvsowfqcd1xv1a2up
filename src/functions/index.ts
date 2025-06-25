import { superdevClient } from "@/lib/superdev/client";

export const copilotkit = superdevClient.functions.copilotkit;
export const fetchPatients = superdevClient.functions.fetchPatients;
export const fetchTrials = superdevClient.functions.fetchTrials;
export const trialInfo = superdevClient.functions.trialInfo;
export const getWorkflowStatus = superdevClient.functions.getWorkflowStatus;
export const runAgenticWorkflow = superdevClient.functions.runAgenticWorkflow;
export const appwriteSync = superdevClient.functions.appwriteSync;
export const syncAppwriteData = superdevClient.functions.syncAppwriteData;
export const matchTrials = superdevClient.functions.matchTrials;
export const trial_info = superdevClient.functions.trial_info;
export const fetchMetrics = superdevClient.functions.fetchMetrics;
