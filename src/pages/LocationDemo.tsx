import React from 'react'
import { LocationDisplay } from '../components/LocationDisplay'
import { useLocationOnMount } from '../hooks/useLocationOnMount'
import { useLatitude, useLongitude, useAccuracy, useTimestamp, useIsLoading, useError } from '../stores/locationStore'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { MapPin, Globe, Clock, Target } from 'lucide-react'

export const LocationDemo: React.FC = () => {
  // Auto-get location on mount
  useLocationOnMount()

  const latitude = useLatitude()
  const longitude = useLongitude()
  const accuracy = useAccuracy()
  const timestamp = useTimestamp()
  const isLoading = useIsLoading()
  const error = useError()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Location Demo</h1>
          <p className="text-lg text-gray-600">
            Demonstrating Zustand state management with geolocation and localStorage persistence
          </p>
        </div>

        {/* Main Location Display */}
        <div className="flex justify-center">
          <LocationDisplay />
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Coordinates
              </CardTitle>
            </CardHeader>
            <CardContent>
              {latitude && longitude ? (
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Latitude:</span>
                    <Badge variant="secondary" className="text-xs">
                      {latitude.toFixed(6)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Longitude:</span>
                    <Badge variant="secondary" className="text-xs">
                      {longitude.toFixed(6)}
                    </Badge>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No coordinates</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="h-4 w-4" />
                Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              {accuracy !== null ? (
                <Badge variant="outline" className="text-sm">
                  {Math.round(accuracy)} meters
                </Badge>
              ) : (
                <p className="text-sm text-muted-foreground">Unknown</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Last Updated
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timestamp ? (
                <p className="text-xs text-muted-foreground">
                  {new Date(timestamp).toLocaleTimeString()}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Never</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Store State Debug */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Store State</CardTitle>
            <CardDescription>
              Current Zustand store state (for development purposes)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-md overflow-auto">
              <pre className="text-sm">
                {JSON.stringify(
                  {
                    latitude,
                    longitude,
                    accuracy,
                    timestamp: timestamp ? new Date(timestamp).toISOString() : null,
                    isLoading,
                    error,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Features List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Features Implemented</CardTitle>
            <CardDescription>
              What this demo showcases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                Zustand global state management
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                Geolocation API integration
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                localStorage persistence with zustand/middleware
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                TypeScript interfaces and type safety
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                Error handling and loading states
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                Custom hooks for common patterns
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                Responsive UI with shadcn/ui components
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
