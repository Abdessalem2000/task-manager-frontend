'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../utils/supabase/client'

interface Location {
  lat: number
  lng: number
  accuracy?: number
}

interface Visit {
  id?: string
  client_id: string
  lat: number
  lng: number
  notes?: string
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
  checkin_time?: string
  checkout_time?: string
}

export default function GPSVisitTracker({ clientId }: { clientId: string }) {
  const [location, setLocation] = useState<Location | null>(null)
  const [status, setStatus] = useState<'idle' | 'tracking' | 'error' | 'visit_active'>('idle')
  const [currentVisit, setCurrentVisit] = useState<Visit | null>(null)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string>('')
  const [info, setInfo] = useState<string | null>(null)

  const supabase = createClient()

  // Check GPS support
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('GPS non supporté sur cet appareil')
      setStatus('error')
    }
  }, [])

  // Start a new visit
  const startVisit = async () => {
    if (!navigator.geolocation) {
      setError('GPS non disponible')
      return
    }

    setStatus('tracking')
    setError('')
    setInfo('Demande d\'accès à la localisation…')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const newLocation: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        }
        setLocation(newLocation)

        try {
          // Create visit record
          const { data: visit, error } = await supabase
            .from('visits')
            .insert({
              client_id: clientId,
              lat: newLocation.lat,
              lng: newLocation.lng,
              status: 'in_progress',
              checkin_time: new Date().toISOString()
            })
            .select()
            .single()

          if (error) throw error

          setCurrentVisit(visit)
          setStatus('visit_active')
          setInfo('Visite GPS enregistrée avec succès.')
        } catch (err) {
          console.error('Error starting visit:', err)
          setError('Erreur lors du démarrage de la visite')
          setInfo(null)
          setStatus('error')
        }
      },
      (error) => {
        console.error('GPS Error:', error)
        setError('Erreur GPS. Vérifiez les permissions de localisation sur votre téléphone.')
        setInfo(null)
        setStatus('error')
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  // End current visit
  const endVisit = async () => {
    if (!currentVisit) return

    try {
      const { error } = await supabase
        .from('visits')
        .update({
          status: 'completed',
          checkout_time: new Date().toISOString(),
          notes: notes || null
        })
        .eq('id', currentVisit.id)

      if (error) throw error

      setCurrentVisit(null)
      setStatus('idle')
      setNotes('')
      setLocation(null)
    } catch (err) {
      console.error('Error ending visit:', err)
      setError('Erreur lors de la fin de la visite')
    }
  }

  // Cancel visit
  const cancelVisit = async () => {
    if (!currentVisit) return

    try {
      const { error } = await supabase
        .from('visits')
        .update({
          status: 'cancelled',
          checkout_time: new Date().toISOString()
        })
        .eq('id', currentVisit.id)

      if (error) throw error

      setCurrentVisit(null)
      setStatus('idle')
      setNotes('')
      setLocation(null)
    } catch (err) {
      console.error('Error cancelling visit:', err)
      setError('Erreur lors de l\'annulation')
    }
  }

  // Get distance from client (if client has coordinates)
  const getDistanceFromClient = () => {
    // This would need client coordinates from props or API
    // For now, just show current location
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-md mx-auto">
      <div className="mb-4">
        <h2 className="font-semibold mb-2">📍 Suivi GPS Visite</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3">
            {error}
          </div>
        )}
        {info && (
          <p className="mt-2 text-xs text-gray-600">
            {info}
          </p>
        )}
      </div>

      {status === 'idle' && (
        <div className="space-y-3">
          <button
            onClick={startVisit}
            className="w-full inline-flex justify-center items-center rounded-lg bg-blue-600 px-4 py-3 text-sm md:text-base font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            🚗 Démarrer la visite (GPS)
          </button>
          <p className="text-xs text-gray-500 text-center">
            La géolocalisation sera activée pour cette visite
          </p>
        </div>
      )}

      {status === 'tracking' && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
          <p className="text-gray-600">Activation GPS en cours...</p>
        </div>
      )}

      {status === 'visit_active' && location && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-green-700 font-medium">Visite en cours</span>
            </div>
            <div className="text-sm text-gray-600">
              📍 Position: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              {location.accuracy && (
                <span className="block text-xs">
                  Précision: ±{Math.round(location.accuracy)}m
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes de visite (optionnel)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Résultats de la visite, prochaines actions..."
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={endVisit}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 rounded-lg transition-colors"
            >
              ✅ Terminer
            </button>
            <button
              onClick={cancelVisit}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-3 rounded-lg transition-colors"
            >
              ❌ Annuler
            </button>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center py-4">
          <button
            onClick={startVisit}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            🔄 Réessayer
          </button>
        </div>
      )}
    </div>
  )
}
