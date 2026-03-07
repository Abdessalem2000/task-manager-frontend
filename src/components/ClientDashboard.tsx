'use client'

import { useState, useEffect } from 'react'
import NewClientForm from './NewClientForm'
import GPSVisitTracker from './GPSVisitTracker'
import AIScore from './AIScore'
import OrderForm, { ClientRecentOrders } from './OrderForm'
import PWARegister from './PWARegister'
import { createClient } from '../../utils/supabase/client'
import { Client } from '../types/client'

function getStatusClasses(status: Client['status']) {
  switch (status) {
    case 'new':
      return 'bg-blue-100 text-blue-700'
    case 'contacted':
      return 'bg-yellow-100 text-yellow-700'
    case 'visited':
      return 'bg-green-100 text-green-700'
    case 'closed':
      return 'bg-gray-200 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

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
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-900">
          Clients / Points de vente
        </h2>
        <button
          type="button"
          onClick={onAddNew}
          className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
        >
          + Nouveau
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-2">
        <input
          type="text"
          placeholder="Rechercher un client…"
          className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* List content */}
      <div className="flex-1 overflow-auto border rounded">
        {clients.length === 0 && (
          <div className="p-3 text-sm text-slate-500">
            Aucun client pour l'instant. Ajoutez votre premier prospect.
          </div>
        )}
        <ul>
          {clients.map((c) => (
            <li
              key={c.id}
              onClick={() => onSelectClient(c.id)}
              className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer border-b hover:bg-slate-50 ${
                selectedClientId === c.id ? 'bg-blue-50' : ''
              }`}
            >
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-slate-500">{c.address}</div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={
                    'text-xs px-2 py-1 rounded-full ' +
                    getStatusClasses(c.status)
                  }
                >
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
  const [todayStats, setTodayStats] = useState<{
    clientsToday: number
    visitsToday: number
    ordersToday: number
  }>({ clientsToday: 0, visitsToday: 0, ordersToday: 0 })

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

  const fetchTodayStats = async () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const isoStart = today.toISOString()

    const { count: visitsCount } = await supabase
      .from('visits')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', isoStart)

    const { count: ordersCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', isoStart)

    const { count: newClientsCount } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', isoStart)

    setTodayStats({
      clientsToday: newClientsCount || 0,
      visitsToday: visitsCount || 0,
      ordersToday: ordersCount || 0,
    })
  }

  useEffect(() => {
    fetchClients()
    fetchTodayStats()
  }, [])

  const selectedClient = clients.find((c) => c.id === selectedClientId) || null

  return (
  <div className="min-h-screen bg-gray-50">
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <PWARegister />
      
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">
          TaskForce Mobile – Tournée du jour
        </h1>
        <p className="text-sm text-slate-600">
          Distributeur / Pré-vente – suivez vos points de vente, visites terrain et actions du jour.
        </p>
      </header>

      {/* "Aujourd'hui" Summary Cards */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase mb-1">Nouveaux clients</p>
          <p className="text-2xl font-semibold text-slate-900">
            {todayStats?.clientsToday ?? 0}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Points de vente ajoutés aujourd'hui.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase mb-1">Visites du jour</p>
          <p className="text-2xl font-semibold text-slate-900">
            {todayStats?.visitsToday ?? 0}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Visites terrain enregistrées avec GPS.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase mb-1">Pré-commandes</p>
          <p className="text-2xl font-semibold text-slate-900">
            {todayStats?.ordersToday ?? 0}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Pré-commandes créées aujourd'hui.
          </p>
        </div>
      </section>

      {/* Main Grid Layout */}
      <main className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] items-start">
        {/* LEFT COLUMN: clients list + new client */}
        <section className="space-y-4">
          {showNewClient && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-900">Nouveau client</h2>
                <button
                  type="button"
                  onClick={() => setShowNewClient(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
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
        </section>

        {/* RIGHT COLUMN: client details + GPS + IA */}
        <section className="space-y-4">
          {selectedClient ? (
            <>
              {/* Fiche point de vente */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                <h2 className="text-sm font-semibold text-slate-900 mb-1">
                  Point de vente: {selectedClient.name}
                </h2>
                <p className="text-sm text-slate-600">
                  Adresse: {selectedClient.address || '—'}
                </p>
                <p className="text-sm text-slate-600">
                  Tél: {selectedClient.phone || '—'}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Statut: <span className="font-medium">{selectedClient.status}</span> -  Score:{' '}
                  <span className="font-medium">{selectedClient.score ?? '—'}</span> / 100
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Dernière visite: (à implémenter) – pour l'instant, utilisez la liste des visites dans Supabase.
                </p>
              </div>

              {/* GPS + IA side by side on desktop, stacked on mobile */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                  <GPSVisitTracker clientId={selectedClient.id} />
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                  <AIScore client={selectedClient} />
                </div>
              </div>

              {/* Pré-vente section */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                <OrderForm clientId={selectedClient.id} />
              </div>
              
              {/* Historique commandes */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                <ClientRecentOrders clientId={selectedClient.id} />
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-sm text-slate-600">
              Aucun client sélectionné. Choisissez un point de vente à gauche pour voir les détails,
              enregistrer une visite GPS et calculer le score.
            </div>
          )}
        </section>
      </main>
    </div>
  </div>
)
}
