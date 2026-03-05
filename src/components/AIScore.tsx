'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../utils/supabase/client'

interface Client {
  id: string
  name: string
  status: 'new' | 'contacted' | 'visited' | 'closed'
  score: number
  lat?: number
  lng?: number
  created_at: string
  notes?: string
}

interface AIScoreResult {
  score: number
  factors: {
    status_weight: number
    proximity_weight: number
    history_weight: number
    recency_weight: number
  }
  recommendation: 'hot' | 'warm' | 'cold'
  reasoning: string
}

export default function AIScore({ client, userLocation }: { client: Client; userLocation?: { lat: number; lng: number } }) {
  const [scoring, setScoring] = useState(false)
  const [result, setResult] = useState<AIScoreResult | null>(null)
  const [error, setError] = useState('')

  const supabase = createClient()

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // AI scoring logic
  const calculateAIScore = async (): Promise<AIScoreResult> => {
    const factors = {
      status_weight: 0,
      proximity_weight: 0,
      history_weight: 0,
      recency_weight: 0
    }

    // Status scoring (40% weight)
    const statusScores = {
      'new': 20,
      'contacted': 40,
      'visited': 70,
      'closed': 90
    }
    factors.status_weight = statusScores[client.status] * 0.4

    // Proximity scoring (25% weight) if user location available
    if (userLocation && client.lat && client.lng) {
      const distance = calculateDistance(
        userLocation.lat, userLocation.lng,
        client.lat, client.lng
      )
      // Closer = higher score (within 50km max)
      const proximityScore = Math.max(0, 100 - (distance * 2))
      factors.proximity_weight = proximityScore * 0.25
    } else {
      factors.proximity_weight = 50 * 0.25 // Average if no location
    }

    // History scoring (20% weight) - based on visit history
    // This would require fetching visit history from database
    factors.history_weight = 60 * 0.2 // Placeholder

    // Recency scoring (15% weight) - newer clients get higher score
    const daysSinceCreation = Math.floor(
      (Date.now() - new Date(client.created_at).getTime()) / (1000 * 60 * 60 * 24)
    )
    const recencyScore = Math.max(0, 100 - (daysSinceCreation * 2))
    factors.recency_weight = recencyScore * 0.15

    // Calculate total score
    const totalScore = Math.round(
      factors.status_weight + 
      factors.proximity_weight + 
      factors.history_weight + 
      factors.recency_weight
    )

    // Determine recommendation
    let recommendation: 'hot' | 'warm' | 'cold'
    let reasoning: string

    if (totalScore >= 70) {
      recommendation = 'hot'
      reasoning = 'Priorité élevée: Client prêt pour conversion immédiate'
    } else if (totalScore >= 40) {
      recommendation = 'warm'
      reasoning = 'Potentiel moyen: Nécessite suivi régulier'
    } else {
      recommendation = 'cold'
      reasoning = 'Priorité basse: Qualification supplémentaire requise'
    }

    return {
      score: totalScore,
      factors,
      recommendation,
      reasoning
    }
  }

  // Score the client
  const scoreClient = async () => {
    setScoring(true)
    setError('')

    try {
      const aiResult = await calculateAIScore()

      // Update client score in database
      const { error: updateError } = await supabase
        .from('clients')
        .update({ score: aiResult.score })
        .eq('id', client.id)

      if (updateError) throw updateError

      // Log AI scoring
      await supabase
        .from('ai_scoring_logs')
        .insert({
          client_id: client.id,
          score: aiResult.score,
          factors: aiResult.factors,
          model_version: 'v1.0'
        })

      setResult(aiResult)
    } catch (err) {
      console.error('AI scoring error:', err)
      setError('Erreur lors du scoring IA')
    } finally {
      setScoring(false)
    }
  }

  // Get color based on recommendation
  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'hot': return 'text-red-600 bg-red-50'
      case 'warm': return 'text-yellow-600 bg-yellow-50'
      case 'cold': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          🤖 IA Scoring
        </h3>
        <div className="text-2xl font-bold text-gray-700">
          {client.score || '?'}
          <span className="text-sm text-gray-500">/100</span>
        </div>
      </div>

      {result && (
        <div className={`p-3 rounded-lg mb-4 ${getRecommendationColor(result.recommendation)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium capitalize">
              {result.recommendation === 'hot' ? '🔥 Chaud' : 
               result.recommendation === 'warm' ? '🌡️ Tiède' : '❄️ Froid'}
            </span>
            <span className="font-bold">{result.score}/100</span>
          </div>
          <p className="text-sm">{result.reasoning}</p>
        </div>
      )}

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Statut:</span>
          <span className="font-medium capitalize">{client.status}</span>
        </div>
        
        {userLocation && client.lat && client.lng && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Distance:</span>
            <span className="font-medium">
              {calculateDistance(
                userLocation.lat, userLocation.lng,
                client.lat, client.lng
              ).toFixed(1)} km
            </span>
          </div>
        )}

        {result && (
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Poids Statut:</span>
              <span>{Math.round(result.factors.status_weight)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Poids Proximité:</span>
              <span>{Math.round(result.factors.proximity_weight)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Poids Historique:</span>
              <span>{Math.round(result.factors.history_weight)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Poids Récence:</span>
              <span>{Math.round(result.factors.recency_weight)}%</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3">
          {error}
        </div>
      )}

      <button
        onClick={scoreClient}
        disabled={scoring}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
      >
        {scoring ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Scoring en cours...
          </span>
        ) : (
          '🎯 Calculer Score IA'
        )}
      </button>
    </div>
  )
}
