import { superdevClient } from "@/lib/superdev/client";

export const appwriteSync = superdevClient.functions.appwriteSync;
export const getWorkflowStatus = superdevClient.functions.getWorkflowStatus;
export const runAgenticWorkflow = superdevClient.functions.runAgenticWorkflow;
