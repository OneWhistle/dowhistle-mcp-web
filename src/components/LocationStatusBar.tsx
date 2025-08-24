import React from 'react'
import { Badge } from './ui/badge'
import { MapPin, AlertCircle, Loader2 } from 'lucide-react'
import { useLatitude, useLongitude, useIsLoading, useError } from '../stores/locationStore'

export const LocationStatusBar: React.FC = () => {
  const latitude = useLatitude()
  const longitude = useLongitude()
  const isLoading = useIsLoading()
  const error = useError()

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
        <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
        <span className="text-xs text-blue-700">Getting location...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full">
        <AlertCircle className="h-3 w-3 text-red-600" />
        <span className="text-xs text-red-700">Location error</span>
      </div>
    )
  }

  if (latitude && longitude) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
        <MapPin className="h-3 w-3 text-green-600" />
        <span className="text-xs text-green-700">
          {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full">
      <MapPin className="h-3 w-3 text-gray-500" />
      <span className="text-xs text-gray-600">No location</span>
    </div>
  )
}
