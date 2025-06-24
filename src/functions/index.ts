import { superdevClient } from "@/lib/superdev/client";

export const runAgenticWorkflow = superdevClient.functions.runAgenticWorkflow;
export const getWorkflowStatus = superdevClient.functions.getWorkflowStatus;
