import { superdevClient } from "@/lib/superdev/client";

export const trialInfo = superdevClient.functions.trialInfo;
export const getWorkflowStatus = superdevClient.functions.getWorkflowStatus;
export const runAgenticWorkflow = superdevClient.functions.runAgenticWorkflow;
export const appwriteSync = superdevClient.functions.appwriteSync;
export const syncAppwriteData = superdevClient.functions.syncAppwriteData;
export const fetchPatients = superdevClient.functions.fetchPatients;
export const matchTrials = superdevClient.functions.matchTrials;
export const fetchTrials = superdevClient.functions.fetchTrials;
export const fetchMetrics = superdevClient.functions.fetchMetrics;
export const copilotkit = superdevClient.functions.copilotkit;
export const fetchPatient = superdevClient.functions.fetchPatient;
export const fetchProtocols = superdevClient.functions.fetchProtocols;
export const fetchProtocolDetail = superdevClient.functions.fetchProtocolDetail;
export const optimizeProtocol = superdevClient.functions.optimizeProtocol;
