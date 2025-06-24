import { superdevClient } from "@/lib/superdev/client";

export const syncAppwriteData = superdevClient.functions.syncAppwriteData;
export const getWorkflowStatus = superdevClient.functions.getWorkflowStatus;
export const runAgenticWorkflow = superdevClient.functions.runAgenticWorkflow;
export const appwriteSync = superdevClient.functions.appwriteSync;
