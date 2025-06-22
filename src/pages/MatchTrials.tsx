import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Upload } from "lucide-react"

const MatchTrials = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Match Trials</h1>
            <p className="text-gray-600">Find suitable clinical trials for patients</p>
          </div>
        </div>
      </header>
      
      <main className="p-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input id="patientId" placeholder="Enter patient ID" />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="Patient age" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Input id="gender" placeholder="Male/Female/Other" />
                </div>
                <div>
                  <Label htmlFor="condition">Primary Condition</Label>
                  <Input id="condition" placeholder="Medical condition" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea 
                  id="medicalHistory" 
                  placeholder="Enter detailed medical history, current medications, and relevant clinical information..."
                  rows={4}
                />
              </div>
              
              <div className="flex gap-4">
                <Button className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Find Matching Trials
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Patient File
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Matching Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Enter patient information above to find matching clinical trials</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default MatchTrials