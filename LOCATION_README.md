# Location Management System with Zustand

This implementation provides a complete global state management solution for handling user location in a React application using Zustand.

## Features

- ✅ **Zustand Store**: Global state management with TypeScript
- ✅ **Geolocation API**: Automatic location detection on app load
- ✅ **localStorage Persistence**: State persistence using `zustand/middleware`
- ✅ **Error Handling**: Comprehensive error handling for geolocation failures
- ✅ **Loading States**: UI feedback during location requests
- ✅ **Custom Hooks**: Reusable hooks for common patterns
- ✅ **TypeScript**: Full type safety and interfaces

## File Structure

```
src/
├── stores/
│   └── locationStore.ts          # Main Zustand store
├── hooks/
│   └── useLocationOnMount.ts     # Custom hooks for location
├── components/
│   ├── LocationDisplay.tsx       # Main location display component
│   └── LocationStatusBar.tsx     # Status indicator component
└── pages/
    └── LocationDemo.tsx          # Demo page showcasing features
```

## Usage

### 1. Basic Store Usage

```tsx
import { useLocationStore } from './stores/locationStore'

function MyComponent() {
  const { latitude, longitude, getCurrentLocation } = useLocationStore()
  
  return (
    <div>
      <p>Lat: {latitude}, Lng: {longitude}</p>
      <button onClick={getCurrentLocation}>Get Location</button>
    </div>
  )
}
```

### 2. Using Selector Hooks (Recommended)

```tsx
import { useLocation, useLocationStatus, useLocationActions } from './stores/locationStore'

function MyComponent() {
  const { latitude, longitude } = useLocation()
  const { isLoading, error } = useLocationStatus()
  const { getCurrentLocation, resetLocation } = useLocationActions()
  
  // Component logic...
}
```

### 3. Auto-location on Mount

```tsx
import { useLocationOnMount } from './hooks/useLocationOnMount'

function MyApp() {
  useLocationOnMount() // Automatically gets location when component mounts
  
  return <div>My App</div>
}
```

### 4. With Auto-refresh

```tsx
import { useLocationWithAutoRefresh } from './hooks/useLocationOnMount'

function MyApp() {
  useLocationWithAutoRefresh(true) // Refreshes every 5 minutes
  
  return <div>My App</div>
}
```

## Store API

### State Properties

- `latitude: number | null` - User's latitude
- `longitude: number | null` - User's longitude  
- `accuracy: number | null` - Location accuracy in meters
- `timestamp: number | null` - When location was last updated
- `isLoading: boolean` - Whether location request is in progress
- `error: string | null` - Any error message

### Actions

- `setLocation(lat: number, lng: number, accuracy?: number)` - Set location manually
- `getCurrentLocation()` - Get current location from device
- `resetLocation()` - Clear all location data
- `setLoading(loading: boolean)` - Set loading state
- `setError(error: string | null)` - Set error state

## Geolocation Configuration

The store uses the following geolocation options:

```tsx
{
  enableHighAccuracy: true,  // Best accuracy
  timeout: 10000,           // 10 second timeout
  maximumAge: 60000         // Cache for 1 minute
}
```

## Error Handling

The system handles various geolocation errors:

- **Permission Denied**: User denied location access
- **Position Unavailable**: Location information unavailable
- **Timeout**: Request took too long
- **Browser Support**: Geolocation not supported

## Persistence

Location data is automatically persisted to localStorage using the key `location-storage`. Only location coordinates and timestamp are persisted (not loading states or errors).

## Components

### LocationDisplay

Main component showing:
- Current coordinates
- Accuracy information
- Last updated timestamp
- Refresh and reset buttons
- Error states and loading indicators

### LocationStatusBar

Compact status indicator for use in headers/navigation:
- Shows location status at a glance
- Different colors for different states
- Compact design for limited space

## Best Practices

1. **Use Selector Hooks**: Use `useLocation()`, `useLocationStatus()`, etc. instead of the full store to prevent unnecessary re-renders
2. **Handle Errors Gracefully**: Always check for errors and provide fallback UI
3. **Respect User Privacy**: Only request location when necessary
4. **Cache Appropriately**: Don't request location too frequently
5. **Provide Feedback**: Show loading states and error messages

## Browser Compatibility

- **Modern Browsers**: Full support with high accuracy
- **HTTPS Required**: Geolocation API requires secure context
- **Mobile Devices**: Better accuracy with GPS
- **Fallbacks**: Graceful degradation for unsupported browsers

## Security Considerations

- Location data is stored locally in localStorage
- No location data is sent to external servers
- User must explicitly grant permission
- Consider privacy implications of storing location data

## Performance

- Store updates are optimized with Zustand's selective subscriptions
- Geolocation requests are cached for 1 minute
- Components only re-render when relevant state changes
- localStorage operations are non-blocking
