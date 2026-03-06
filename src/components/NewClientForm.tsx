'use client'

import { useState } from 'react'
import { createClient } from '../../utils/supabase/client'

type Props = {
  onCreated?: () => void
}

export default function NewClientForm({ onCreated }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [status, setStatus] = useState<'new' | 'contacted' | 'visited' | 'closed'>('new')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Le nom du client est obligatoire.')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: insertError } = await supabase.from('clients').insert({
        name: name.trim(),
        phone: phone.trim() || null,
        address: address.trim() || null,
        status,
      })

      if (insertError) {
        console.error(insertError)
        setError('Erreur lors de la création du client.')
      } else {
        setName('')
        setPhone('')
        setAddress('')
        setStatus('new')
        if (onCreated) onCreated()
      }
    } catch (err) {
      console.error(err)
      setError('Erreur inattendue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Nom du client *
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-2 py-1.5 text-sm border rounded"
            placeholder="Ex: Épicerie El Baraka"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Téléphone
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-2 py-1.5 text-sm border rounded"
            placeholder="Ex: 0550 00 00 00"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Adresse
        </label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-2 py-1.5 text-sm border rounded"
          placeholder="Ex: Cité 200 Logements, Blida"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Statut
        </label>
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as 'new' | 'contacted' | 'visited' | 'closed')
          }
          className="w-full px-2 py-1.5 text-sm border rounded"
        >
          <option value="new">Nouveau</option>
          <option value="contacted">Contacté</option>
          <option value="visited">Visité</option>
          <option value="closed">Fermé</option>
        </select>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-3 py-2 text-sm rounded bg-green-600 text-white disabled:opacity-60"
      >
        {loading ? 'Création...' : 'Enregistrer le client'}
      </button>
    </form>
  )
}
