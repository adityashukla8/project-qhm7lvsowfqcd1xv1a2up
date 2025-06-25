import { useCopilotAction } from "@copilotkit/react-core";
import { fetchPatients, fetchTrials, trialInfo } from "@/functions";

export const useCopilotPatientActions = () => {
  useCopilotAction({
    name: "searchPatient",
    description: "Search for a patient by their patient ID",
    parameters: [
      {
        name: "patientId",
        type: "string",
        description: "The patient ID to search for (e.g., P001, P002, etc.)",
        required: true,
      },
    ],
    handler: async ({ patientId }) => {
      try {
        console.log('Searching for patient:', patientId);
        const response = await fetchPatients({ patientId: patientId.trim() });
        
        if (response.success && response.patient) {
          const patient = response.patient;
          return `**Patient Found: ${patient.patient_name}**

**Basic Information:**
- Patient ID: ${patient.patient_id}
- Age: ${patient.age}
- Gender: ${Array.isArray(patient.gender) ? patient.gender.join(', ') : patient.gender}
- Country: ${patient.country}
- Status: ${patient.status}

**Medical Information:**
- Condition: ${patient.condition}
- Histology: ${patient.histology}
- Biomarker: ${patient.biomarker}
- ECOG Score: ${patient.ecog_score}

**Treatment History:**
- Chemotherapy: ${Array.isArray(patient.chemotherapy) ? patient.chemotherapy.join(', ') : patient.chemotherapy || 'None'}
- Radiotherapy: ${Array.isArray(patient.radiotherapy) ? patient.radiotherapy.join(', ') : patient.radiotherapy || 'None'}
- Metastasis: ${Array.isArray(patient.metastasis) ? patient.metastasis.join(', ') : patient.metastasis || 'None'}

**Trial Matching:**
- Matched to trials: ${patient.matched ? 'Yes' : 'No'}
- Number of matched trials: ${patient.matched_trials_count || 0}`;
        } else {
          return `❌ Patient with ID "${patientId}" not found. Please check the patient ID and try again.`;
        }
      } catch (error) {
        console.error('Error searching patient:', error);
        return `❌ Error searching for patient: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    },
  });

  useCopilotAction({
    name: "getPatientStats",
    description: "Get statistics about all patients in the system",
    parameters: [],
    handler: async () => {
      try {
        const response = await fetchPatients({});
        
        if (response.success && response.patients) {
          const patients = Array.isArray(response.patients) ? response.patients : [];
          const totalPatients = patients.length;
          const processedPatients = patients.filter(p => p.status === 'processed').length;
          const matchedPatients = patients.filter(p => p.matched).length;
          
          const conditions = patients.reduce((acc, patient) => {
            acc[patient.condition] = (acc[patient.condition] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const topConditions = Object.entries(conditions)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([condition, count]) => `- ${condition}: ${count} patients`)
            .join('\n');

          return `**Patient Statistics:**

📊 **Overview:**
- Total Patients: ${totalPatients}
- Processed Patients: ${processedPatients}
- Patients with Trial Matches: ${matchedPatients}

🏥 **Top Conditions:**
${topConditions}

📈 **Processing Rate:** ${totalPatients > 0 ? Math.round((processedPatients / totalPatients) * 100) : 0}%
🎯 **Match Rate:** ${processedPatients > 0 ? Math.round((matchedPatients / processedPatients) * 100) : 0}%`;
        } else {
          return `❌ Unable to retrieve patient statistics.`;
        }
      } catch (error) {
        console.error('Error getting patient stats:', error);
        return `❌ Error retrieving patient statistics: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    },
  });
};

export const useCopilotTrialActions = () => {
  useCopilotAction({
    name: "searchTrial",
    description: "Search for a clinical trial by trial ID",
    parameters: [
      {
        name: "trialId",
        type: "string",
        description: "The trial ID to search for (e.g., NCT123456)",
        required: true,
      },
    ],
    handler: async ({ trialId }) => {
      try {
        console.log('Searching for trial:', trialId);
        const response = await trialInfo({ trial_id: trialId.trim() });
        
        if (response.success && response.trial_info) {
          const trial = response.trial_info;
          return `**Clinical Trial Found: ${trial.title || 'Untitled Trial'}**

**Trial Information:**
- Trial ID: ${trial.trial_id}
- Official Title: ${trial.official_title || 'Not specified'}
- Phase: ${trial.phase || 'Not specified'}
- Status: ${trial.status || 'Not specified'}
- Condition: ${trial.condition || 'Not specified'}

**Study Details:**
- Objective: ${trial.objective_summary || 'Not available'}
- Sample Size: ${trial.sample_size || 'Not specified'}
- Intervention Arms: ${trial.intervention_arms || 'Not specified'}

**Eligibility:**
${trial.eligibility ? trial.eligibility.substring(0, 500) + (trial.eligibility.length > 500 ? '...' : '') : 'Not available'}

**Location & Contact:**
- Sites: ${trial.sites || 'Not specified'}
- Location Details: ${trial.location_and_site_details || 'Not available'}
- Sponsor Contact: ${trial.sponsor_contact || 'Not available'}

**Additional Information:**
- Known Side Effects: ${trial.known_side_effects || 'Not specified'}
- Patient FAQ: ${trial.patient_faq_summary || 'Not available'}
- Source URL: ${trial.source_url || 'Not available'}

**Matching:**
- Matched Patients: ${trial.matched_patients_count || 0}`;
        } else {
          return `❌ Trial with ID "${trialId}" not found. Please check the trial ID and try again.`;
        }
      } catch (error) {
        console.error('Error searching trial:', error);
        return `❌ Error searching for trial: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    },
  });

  useCopilotAction({
    name: "getTrialStats",
    description: "Get statistics about all clinical trials in the system",
    parameters: [],
    handler: async () => {
      try {
        const response = await fetchTrials();
        
        if (response.success && response.data?.trials) {
          const trials = Array.isArray(response.data.trials) ? response.data.trials : [];
          const totalTrials = trials.length;
          
          // Extract phases from titles
          const phases = trials.reduce((acc, trial) => {
            const text = `${trial.title || ''} ${trial.official_title || ''}`.toLowerCase();
            let phase = 'Unknown';
            if (text.includes('phase 1') || text.includes('phase i')) phase = 'Phase 1';
            else if (text.includes('phase 2') || text.includes('phase ii')) phase = 'Phase 2';
            else if (text.includes('phase 3') || text.includes('phase iii')) phase = 'Phase 3';
            else if (text.includes('phase 4') || text.includes('phase iv')) phase = 'Phase 4';
            
            acc[phase] = (acc[phase] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const phaseBreakdown = Object.entries(phases)
            .sort(([,a], [,b]) => b - a)
            .map(([phase, count]) => `- ${phase}: ${count} trials`)
            .join('\n');

          const totalMatches = trials.reduce((sum, trial) => sum + (trial.matched_patients_count || 0), 0);

          return `**Clinical Trial Statistics:**

📊 **Overview:**
- Total Trials: ${totalTrials}
- Total Patient Matches: ${totalMatches}

🔬 **Phase Distribution:**
${phaseBreakdown}

📈 **Average Matches per Trial:** ${totalTrials > 0 ? Math.round(totalMatches / totalTrials * 10) / 10 : 0}`;
        } else {
          return `❌ Unable to retrieve trial statistics.`;
        }
      } catch (error) {
        console.error('Error getting trial stats:', error);
        return `❌ Error retrieving trial statistics: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    },
  });
};