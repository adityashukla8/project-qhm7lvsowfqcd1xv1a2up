import { useCopilotAction } from "@copilotkit/react-core";
import { fetchPatients } from "@/functions";

export function useCopilotActions() {
  useCopilotAction({
    name: "searchPatients",
    description: "Search for patient information by patient ID or get all patients",
    parameters: [
      {
        name: "patientId",
        type: "string",
        description: "The patient ID to search for (optional - if not provided, returns all patients)",
        required: false,
      },
    ],
    handler: async ({ patientId }) => {
      try {
        console.log('CopilotKit: Searching for patients with ID:', patientId);
        
        const response = await fetchPatients({ 
          patientId: patientId || undefined 
        });
        
        if (response.success) {
          if (patientId && response.patient) {
            // Single patient search
            const patient = response.patient;
            return `Found patient: ${patient.patient_name} (ID: ${patient.patient_id})
            
Details:
- Age: ${patient.age}
- Gender: ${Array.isArray(patient.gender) ? patient.gender.join(', ') : patient.gender}
- Condition: ${patient.condition}
- Country: ${patient.country}
- ECOG Score: ${patient.ecog_score}
- Histology: ${patient.histology}
- Biomarker: ${patient.biomarker}
- Chemotherapy: ${Array.isArray(patient.chemotherapy) ? patient.chemotherapy.join(', ') : patient.chemotherapy}
- Radiotherapy: ${Array.isArray(patient.radiotherapy) ? patient.radiotherapy.join(', ') : patient.radiotherapy}
- Metastasis: ${Array.isArray(patient.metastasis) ? patient.metastasis.join(', ') : patient.metastasis}
- Status: ${patient.status}
- Matched Trials: ${patient.matched_trials_count || 0}`;
          } else if (response.patients) {
            // Multiple patients search
            const patients = Array.isArray(response.patients) ? response.patients : [];
            if (patients.length === 0) {
              return "No patients found in the system.";
            }
            
            const patientList = patients.map(p => 
              `- ${p.patient_name} (ID: ${p.patient_id}) - ${p.condition}, Age: ${p.age}, Country: ${p.country}`
            ).join('\n');
            
            return `Found ${patients.length} patients in the system:\n\n${patientList}`;
          }
        }
        
        return `Error searching for patients: ${response.error || 'Unknown error'}`;
      } catch (error) {
        console.error('CopilotKit: Error in searchPatients:', error);
        return `Error searching for patients: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    },
  });

  useCopilotAction({
    name: "getPatientStats",
    description: "Get statistics about patients in the system",
    parameters: [],
    handler: async () => {
      try {
        const response = await fetchPatients({});
        
        if (response.success && response.patients) {
          const patients = Array.isArray(response.patients) ? response.patients : [];
          const totalPatients = patients.length;
          const processedPatients = patients.filter(p => p.status === 'processed').length;
          const matchedPatients = patients.filter(p => p.matched).length;
          const totalMatches = patients.reduce((sum, p) => sum + (p.matched_trials_count || 0), 0);
          
          const conditionCounts = patients.reduce((acc, p) => {
            acc[p.condition] = (acc[p.condition] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          const topConditions = Object.entries(conditionCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([condition, count]) => `- ${condition}: ${count} patients`)
            .join('\n');
          
          return `Patient Statistics:

Total Patients: ${totalPatients}
Processed Patients: ${processedPatients}
Patients with Matches: ${matchedPatients}
Total Trial Matches: ${totalMatches}
Average Matches per Patient: ${totalPatients > 0 ? (totalMatches / totalPatients).toFixed(1) : 0}

Top Conditions:
${topConditions}`;
        }
        
        return "Error retrieving patient statistics.";
      } catch (error) {
        console.error('CopilotKit: Error in getPatientStats:', error);
        return `Error retrieving patient statistics: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    },
  });
}