import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, User, CheckCircle, XCircle, Activity } from "lucide-react"
import { matchTrials } from '@/functions'

interface MatchResult {
  trial_id: string
  match_score: number
  match_reason: string
  eligibility_status: string
}

interface TrialMatchingDetailsProps {
  trialId: string
}

const TrialMatchingDetails = ({ trialId }: TrialMatchingDetailsProps) => {
  const [patientId, setPatientId] = useState('')
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
  const [isMatching, setIsMatching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleCheckMatch = async () => {
    if (!patientId.trim()) {
      alert('Please enter a patient ID')
      return
    }

    setIsMatching(true)
    setHasSearched(false)

    try {
      console.log('Checking match for patient:', patientId.trim())
      const response = await matchTrials({ patient_id: patientId.trim() })
      console.log('Match response:', response)
      
      if (response.success && response.matches) {
        // Find the match for this specific trial
        const trialMatch = response.matches.find((match: MatchResult) => match.trial_id === trialId)
        setMatchResult(trialMatch || null)
      } else {
        console.error('Match API error:', response)
        setMatchResult(null)
      }
      
      setHasSearched(true)
    } catch (error) {
      console.error('Error checking match:', error)
      setMatchResult(null)
      setHasSearched(true)
    } finally {
      setIsMatching(false)
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const getEligibilityIcon = (status: string) => {
    return status.toLowerCase() === 'eligible' ? 
      <CheckCircle className="w-5 h-5 text-green-600" /> : 
      <XCircle className="w-5 h-5 text-red-600" />
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
        <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          Patient Matching
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-8 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="patientId" className="text-sm font-semibold text-gray-700">Patient ID</Label>
            <Input 
              id="patientId" 
              placeholder="Enter patient ID to check match (e.g., P001, P002, etc.)"
              className="h-10 sm:h-12 border-0 bg-gray-50 rounded-xl"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button 
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 rounded-xl px-6 h-10 sm:h-12 shadow-lg w-full sm:w-auto"
              onClick={handleCheckMatch}
              disabled={isMatching}
            >
              <Search className="w-4 h-4 mr-2" />
              {isMatching ? 'Checking...' : 'Check Match'}
            </Button>
          </div>
        </div>

        {isMatching && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking patient match...</p>
          </div>
        )}

        {hasSearched && (
          <div className="mt-6">
            {matchResult ? (
              <div className="border border-gray-200 rounded-2xl p-6 bg-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Patient {patientId}</h3>
                    <p className="text-sm text-gray-600">Match Analysis Results</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Match Score</Label>
                    <Badge className={`${getMatchScoreColor(matchResult.match_score)} border font-medium px-3 py-2 text-base`}>
                      {matchResult.match_score}% Match
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Eligibility Status</Label>
                    <div className="flex items-center gap-2">
                      {getEligibilityIcon(matchResult.eligibility_status)}
                      <span className={`font-medium ${matchResult.eligibility_status.toLowerCase() === 'eligible' ? 'text-green-700' : 'text-red-700'}`}>
                        {matchResult.eligibility_status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-gray-500 uppercase tracking-wide">Match Reason</Label>
                  <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {matchResult.match_reason}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">No Match Found</h3>
                <p className="text-gray-500">This patient does not match this trial or the patient ID was not found.</p>
              </div>
            )}
          </div>
        )}

        {!hasSearched && !isMatching && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Check Patient Match</h3>
            <p className="text-gray-500">Enter a patient ID to see if they match this clinical trial</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TrialMatchingDetails