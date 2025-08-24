import { vi } from 'vitest'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock GeolocationPositionError
class GeolocationPositionError extends Error {
  code: number
  message: string
  
  constructor(code: number, message: string) {
    super(message)
    this.code = code
    this.message = message
  }
  
  static PERMISSION_DENIED = 1
  static POSITION_UNAVAILABLE = 2
  static TIMEOUT = 3
}

// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(),
  clearWatch: vi.fn(),
}
Object.defineProperty(navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
})

// Make GeolocationPositionError globally available
global.GeolocationPositionError = GeolocationPositionError

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
