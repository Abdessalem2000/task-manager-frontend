'use client'

import { useState, useEffect } from 'react'
import NewClientForm from './NewClientForm'
import GPSVisitTracker from './GPSVisitTracker'
import AIScore from './AIScore'
import { createClient } from '../../utils/supabase/client'
import { Client } from '../types/client'

function ClientsList({
  clients,
  selectedClientId,
  onSelectClient,
  onAddNew,
}: {
  clients: Client[]
  selectedClientId?: string
  onSelectClient: (id: string) => void
  onAddNew: () => void
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-lg">Clients / Prospects</h2>
        <button
          type="button"
          onClick={onAddNew}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
        >
          + Nouveau
        </button>
      </div>
      <div className="flex-1 overflow-auto border rounded">
        {clients.length === 0 && (
          <div className="p-3 text-sm text-gray-500">
            Aucun client pour l'instant. Ajoutez votre premier prospect.
          </div>
        )}
        <ul>
          {clients.map((c) => (
            <li
              key={c.id}
              onClick={() => onSelectClient(c.id)}
              className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer border-b hover:bg-gray-50 ${
                selectedClientId === c.id ? 'bg-blue-50' : ''
              }`}
            >
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-gray-500">{c.address}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                  {c.status}
                </span>
                {typeof c.score === 'number' && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                    {c.score}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function ClientDashboard() {
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [showNewClient, setShowNewClient] = useState(false)

  const supabase = createClient()

  const fetchClients = async () => {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
    setClients((data || []) as Client[])
    if (!selectedClientId && data && data.length > 0) {
      setSelectedClientId(data[0].id)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const selectedClient = clients.find((c) => c.id === selectedClientId) || null

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold mb-2">
        TaskForce Mobile – Distributeur / Pré-vente
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        Gérez vos clients, enregistrez les visites terrain (GPS) et préparez vos
        pré-commandes pour vos tournées de distribution.
      </p>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left: Clients list */}
        <div className="lg:col-span-1 h-full flex flex-col gap-3">
          {showNewClient && (
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-sm">Nouveau client</h2>
                <button
                  type="button"
                  onClick={() => setShowNewClient(false)}
                  className="text-xs text-gray-500 hover:text-gray-800"
                >
                  Fermer
                </button>
              </div>
              <NewClientForm
                onCreated={() => {
                  setShowNewClient(false)
                  fetchClients()
                }}
              />
            </div>
          )}
          <ClientsList
            clients={clients}
            selectedClientId={selectedClientId || undefined}
            onSelectClient={(id) => setSelectedClientId(id)}
            onAddNew={() => setShowNewClient(true)}
          />
        </div>

        {/* Right: GPS + AI + simple pre-sale section */}
        <div className="lg:col-span-2 space-y-4">
          {selectedClient ? (
            <>
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="font-semibold mb-1">
                  {selectedClient.name}
                </h2>
                <p className="text-sm text-gray-600">{selectedClient.address}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Tél: {selectedClient.phone || '—'} -  Statut: {selectedClient.status} -  Score:{' '}
                  {selectedClient.score ?? '—'}
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <GPSVisitTracker clientId={selectedClient.id} />
                <AIScore client={selectedClient} />
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="font-semibold mb-2">Pré-vente (démo)</h2>
                <p className="text-xs text-gray-600 mb-2">
                  Prochaine étape: ajouter un vrai formulaire de pré-commande (produits, quantités).
                  Pour l'instant, cette section peut afficher les futures pré-commandes.
                </p>
                <p className="text-xs text-gray-400">
                  (Vous pouvez montrer cette section aux distributeurs et leur demander exactement
                  quelles infos ils veulent voir ici.)
                </p>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-600">
              Aucun client sélectionné. Ajoutez un client à gauche pour commencer.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
