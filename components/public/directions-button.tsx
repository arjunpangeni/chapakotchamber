'use client'

import { useState } from 'react'
import { Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'

const DESTINATION = '27.8877989,83.820377'

export default function DirectionsButton() {
  const [loading, setLoading] = useState(false)

  const openDirections = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleClick = () => {
    setLoading(true)

    if (!navigator.geolocation) {
      openDirections(`https://www.google.com/maps/dir/?api=1&destination=${DESTINATION}&travelmode=driving`)
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const origin = `${coords.latitude},${coords.longitude}`
        openDirections(
          `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${DESTINATION}&travelmode=driving`
        )
        setLoading(false)
      },
      () => {
        // Fallback when location access is denied or unavailable.
        openDirections(`https://www.google.com/maps/dir/?api=1&destination=${DESTINATION}&travelmode=driving`)
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="h-11 rounded-full px-5 text-sm font-semibold shadow-md shadow-blue-500/20"
    >
      <Navigation className="h-4 w-4" />
      {loading ? 'Opening map...' : 'Navigate From My Location'}
    </Button>
  )
}
