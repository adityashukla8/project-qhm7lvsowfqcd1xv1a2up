import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Database, CheckCircle, AlertCircle, Info } from "lucide-react"
import { syncAppwriteData } from "@/functions"
import { useToast } from "@/hooks/use-toast"

export function AppWriteSync() {
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<any>(null)
  const { toast } = useToast()

  const handleSync = async (collection?: string) => {
    setSyncing(true)
    try {
      const result = await syncAppwriteData({ collection })
      
      if (result.success) {
        setLastSync(result.results)
        const totalSynced = Object.values(result.results).reduce((a: number, b: number) => a + b, 0)
        toast({
          title: "Sync Successful",
          description: `Synced ${totalSynced} records from AppWrite collection: ${result.collectionUsed}`,
        })
      } else {
        toast({
          title: "Sync Failed",
          description: result.error,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Sync error:', error)
      toast({
        title: "Sync Error",
        description: "Failed to sync data from AppWrite. Check console for details.",
        variant: "destructive"
      })
    } finally {
      setSyncing(false)
    }
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          AppWrite Data Sync
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => handleSync()} 
            disabled={syncing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {syncing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Sync All Data
          </Button>
          
          <Button 
            onClick={() => handleSync('patients')} 
            disabled={syncing}
            variant="outline"
          >
            Sync Patients
          </Button>
          
          <Button 
            onClick={() => handleSync('trials')} 
            disabled={syncing}
            variant="outline"
          >
            Sync Trials
          </Button>
          
          <Button 
            onClick={() => handleSync('matches')} 
            disabled={syncing}
            variant="outline"
          >
            Sync Matches
          </Button>
        </div>

        {lastSync && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Last Sync Results</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <Badge variant="outline" className="justify-center">
                Patients: {lastSync.patients}
              </Badge>
              <Badge variant="outline" className="justify-center">
                Trials: {lastSync.trials}
              </Badge>
              <Badge variant="outline" className="justify-center">
                Matches: {lastSync.matches}
              </Badge>
              <Badge variant="outline" className="justify-center">
                Summaries: {lastSync.summaries}
              </Badge>
              <Badge variant="outline" className="justify-center">
                Metrics: {lastSync.metrics}
              </Badge>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            This will sync data from your AppWrite database to the Superdev entities
          </div>
          <div className="text-xs text-blue-600 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Using collection ID: 6856f1370028a19d776b for patient data
          </div>
        </div>
      </CardContent>
    </Card>
  )
}