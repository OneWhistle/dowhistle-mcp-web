import React, { useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { MapPin, RefreshCw, X, AlertCircle } from 'lucide-react'
import { useLatitude, useLongitude, useAccuracy, useTimestamp, useIsLoading, useError, useLocationStore } from '../stores/locationStore'

export const LocationDisplay: React.FC = () => {
  const latitude = useLatitude()
  const longitude = useLongitude()
  const accuracy = useAccuracy()
  const timestamp = useTimestamp()
  const isLoading = useIsLoading()
  const error = useError()
  const getCurrentLocation = useLocationStore((state) => state.getCurrentLocation)
  const resetLocation = useLocationStore((state) => state.resetLocation)

  // Get location on component mount
  useEffect(() => {
    if (!latitude && !longitude) {
      getCurrentLocation()
    }
  }, []) // Empty dependency array - only run once on mount

  const formatTimestamp = (timestamp: number | null) => {
    if (!timestamp) return 'Never'
    return new Date(timestamp).toLocaleString()
  }

  const formatCoordinates = (lat: number | null, lng: number | null) => {
    if (lat === null || lng === null) return 'Not available'
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  }

  const formatAccuracy = (accuracy: number | null) => {
    if (accuracy === null) return 'Unknown'
    return `${Math.round(accuracy)} meters`
  }

  const handleRefresh = () => {
    getCurrentLocation()
  }

  const handleReset = () => {
    resetLocation()
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Current Location
        </CardTitle>
        <CardDescription>
          Your device's current geographical position
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Getting location...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-destructive">{error}</span>
          </div>
        )}

        {/* Location Data */}
        {!isLoading && !error && (latitude !== null || longitude !== null) && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Coordinates:</span>
              <Badge variant="secondary" className="font-mono text-xs">
                {formatCoordinates(latitude, longitude)}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Accuracy:</span>
              <Badge variant="outline">
                {formatAccuracy(accuracy)}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Last Updated:</span>
              <span className="text-sm text-muted-foreground">
                {formatTimestamp(timestamp)}
              </span>
            </div>
          </div>
        )}

        {/* No Location State */}
        {!isLoading && !error && latitude === null && longitude === null && (
          <div className="text-center py-4 text-muted-foreground">
            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No location data available</p>
            <p className="text-sm">Click refresh to get your current location</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleRefresh} 
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Getting...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleReset}
            disabled={isLoading}
            className="px-3"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer">Debug Info</summary>
            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
              {JSON.stringify(
                { latitude, longitude, accuracy, timestamp, isLoading, error },
                null,
                2
              )}
            </pre>
          </details>
        )}
      </CardContent>
    </Card>
  )
}
