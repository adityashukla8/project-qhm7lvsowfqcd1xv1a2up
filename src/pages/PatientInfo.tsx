import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Plus, Search } from "lucide-react"

const PatientInfo = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Information</h1>
            <p className="text-gray-600">Manage patient data and profiles</p>
          </div>
        </div>
      </header>
      
      <main className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search patients..." 
                  className="pl-10 w-80"
                />
              </div>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Patient
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Patient Registry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No patients found</h3>
                <p className="mb-4">Start by adding patient information to the system</p>
                <Button variant="outline" className="flex items-center gap-2 mx-auto">
                  <Plus className="w-4 h-4" />
                  Add First Patient
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default PatientInfo