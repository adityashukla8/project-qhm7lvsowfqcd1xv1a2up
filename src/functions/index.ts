import { superdevClient } from "@/lib/superdev/client";

export const fetchTrials = superdevClient.functions.fetchTrials;
export const getWorkflowStatus = superdevClient.functions.getWorkflowStatus;
export const runAgenticWorkflow = superdevClient.functions.runAgenticWorkflow;
export const appwriteSync = superdevClient.functions.appwriteSync;
export const syncAppwriteData = superdevClient.functions.syncAppwriteData;
export const fetchPatients = superdevClient.functions.fetchPatients;
export const matchTrials = superdevClient.functions.matchTrials;
export const trialInfo = superdevClient.functions.trial_info;