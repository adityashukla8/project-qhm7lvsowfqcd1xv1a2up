import { superdevClient } from "@/lib/superdev/client";

export const Patient = superdevClient.entity("Patient");
export const ProcessingMetric = superdevClient.entity("ProcessingMetric");
export const Summary = superdevClient.entity("Summary");
export const Trial = superdevClient.entity("Trial");
export const TrialMatch = superdevClient.entity("TrialMatch");
export const User = superdevClient.auth;
