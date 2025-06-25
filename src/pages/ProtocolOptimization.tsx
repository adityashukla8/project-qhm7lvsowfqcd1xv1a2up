import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"

const ProtocolOptimization = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Protocol Optimization</h1>
            <p className="text-gray-600">Optimize trial protocols and matching algorithms</p>
          </div>
        </div>
      </header>
      
      <main className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Match Accuracy</span>
                    <span className="text-sm font-medium">94.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Processing Speed</span>
                    <span className="text-sm font-medium">1.2s avg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Success Rate</span>
                    <span className="text-sm font-medium">87.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  Optimization Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                    Low match rate for oncology trials
                  </div>
                  <div className="text-sm text-blue-700 bg-blue-50 p-2 rounded">
                    Consider expanding age criteria
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Recent Optimizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-green-700 bg-green-50 p-2 rounded">
                    Updated matching algorithm v2.1
                  </div>
                  <div className="text-sm text-green-700 bg-green-50 p-2 rounded">
                    Improved eligibility parsing
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Algorithm Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Matching Parameters</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Age Range Tolerance</span>
                      <span className="text-sm font-medium">±5 years</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Condition Similarity Threshold</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Geographic Radius</span>
                      <span className="text-sm font-medium">50 miles</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Agent Configuration</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Agents</span>
                      <span className="text-sm font-medium">6</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Processing Threads</span>
                      <span className="text-sm font-medium">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cache Duration</span>
                      <span className="text-sm font-medium">24 hours</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <Button className="mr-4">Apply Optimizations</Button>
                <Button variant="outline">Reset to Defaults</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default ProtocolOptimization