'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { ClerkAuthWrapper } from '../../src/components/ClerkAuthWrapper';
import GPSVisitTracker from '../../src/components/GPSVisitTracker';
import AIScore from '../../src/components/AIScore';
import { createClient } from '../../utils/supabase/client';

type Client = {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  status: 'new' | 'contacted' | 'visited' | 'closed';
  score: number;
  lat?: number;
  lng?: number;
  created_at: string;
  notes?: string;
};

// Clients List Component
function ClientsList({
  clients,
  selectedClientId,
  onSelectClient,
}: {
  clients: Client[];
  selectedClientId?: string;
  onSelectClient: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-lg">Clients / Prospects</h2>
        <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded">
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
  );
}

export default function WorkingApp() {
  // Check if Clerk is available
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkAvailable = clerkPublishableKey && 
      clerkPublishableKey !== 'pk_test_YOUR_CLERK_KEY_HERE' && 
      clerkPublishableKey.startsWith('pk_test_');
  
  // Only use useUser if Clerk is available
  const clerkUser = isClerkAvailable ? useUser() : { isLoaded: true, isSignedIn: false, user: null };
  const { isLoaded = true, isSignedIn = false, user = null } = clerkUser;
  
  // State management
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Theme management
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme) {
          setDarkMode(JSON.parse(savedTheme));
        }
      } catch (e) {
        // Theme loading failed
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
      } catch (e) {
        // Failed to save theme preference
      }
    }
  }, [darkMode]);

  // Load clients from Supabase
  useEffect(() => {
    if (mounted && isLoaded) {
      loadClients();
    }
  }, [mounted, isLoaded]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading clients:', error);
        // Load demo data if Supabase fails
        const demoClients: Client[] = [
          {
            id: '1',
            name: 'Société Alger Telecom',
            phone: '+213 21 23 45 67',
            address: 'Alger, Algérie',
            status: 'new',
            score: 45,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Distribution SA',
            phone: '+213 23 45 67 89',
            address: 'Blida, Algérie',
            status: 'contacted',
            score: 72,
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Entreprise Construction',
            phone: '+213 34 56 78 90',
            address: 'Oran, Algérie',
            status: 'visited',
            score: 89,
            created_at: new Date().toISOString()
          }
        ];
        setClients(demoClients);
        if (demoClients.length > 0) {
          setSelectedClientId(demoClients[0].id);
        }
      } else {
        setClients(data || []);
        if (data && data.length > 0) {
          setSelectedClientId(data[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  // Theme object
  const theme = darkMode ? {
    bg: '#0F0F0F',
    cardBg: '#1A1A1A', 
    text: '#FFFFFF',
    border: '#2A2A2A',
    hoverBg: '#252525',
    subtext: '#9CA3AF',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    primary: '#6366F1',
    secondary: '#8B5CF6',
    inputBg: '#1F2937',
    inputText: '#F3F4F6',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    textSecondary: '#9CA3AF'
  } : {
    bg: '#FFFFFF',
    cardBg: '#F9FAFB',
    text: '#1F2937',
    border: '#E5E7EB',
    hoverBg: '#F3F4F6',
    subtext: '#6B7280',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    primary: '#6366F1',
    secondary: '#8B5CF6',
    inputBg: '#FFFFFF',
    inputText: '#1F2937',
    shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    textSecondary: '#6B7280'
  };

  // Show loading state during initial load
  if (!isLoaded) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.bg,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚗</div>
          <h1 style={{ fontSize: '24px', margin: 0, color: theme.text }}>Chargement...</h1>
        </div>
      </div>
    );
  }

  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <ClerkAuthWrapper>
      <div style={{
        minHeight: '100vh',
        backgroundColor: theme.bg,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: theme.cardBg,
          padding: isMobile ? '16px' : '24px',
          borderBottom: `1px solid ${theme.border}`
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h1 style={{ 
                margin: 0, 
                fontSize: isMobile ? '1.5em' : '2em', 
                fontWeight: 'bold', 
                color: theme.text 
              }}>
                🚗 TaskForce Mobile – GPS Sales Tracker
              </h1>
              <p style={{ 
                margin: '4px 0 0 8px', 
                fontSize: '0.9em', 
                color: theme.subtext 
              }}>
                Suivez vos visites terrain en temps réel, même offline, et priorisez vos prospects avec le scoring automatique.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowProfileSettings(!showProfileSettings)}
                style={{
                  backgroundColor: theme.hoverBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: theme.text,
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                👤 Profile
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  backgroundColor: theme.hoverBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: theme.text,
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: isMobile ? '16px' : '24px'
        }}>
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              backgroundColor: theme.cardBg,
              padding: '20px',
              borderRadius: '12px',
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadow
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: theme.text, fontSize: '1.1em' }}>
                👥 Total Clients
              </h3>
              <p style={{ margin: '0', fontSize: '2em', fontWeight: 'bold', color: theme.primary }}>
                {clients.length}
              </p>
            </div>

            <div style={{
              backgroundColor: theme.cardBg,
              padding: '20px',
              borderRadius: '12px',
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadow
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: theme.text, fontSize: '1.1em' }}>
                📍 Visites Aujourd'hui
              </h3>
              <p style={{ margin: '0', fontSize: '2em', fontWeight: 'bold', color: theme.success }}>
                0
              </p>
            </div>

            <div style={{
              backgroundColor: theme.cardBg,
              padding: '20px',
              borderRadius: '12px',
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadow
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: theme.text, fontSize: '1.1em' }}>
                🎯 Prospects Chauds
              </h3>
              <p style={{ margin: '0', fontSize: '2em', fontWeight: 'bold', color: theme.warning }}>
                {clients.filter(c => (c.score || 0) >= 70).length}
              </p>
            </div>

            <div style={{
              backgroundColor: theme.cardBg,
              padding: '20px',
              borderRadius: '12px',
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadow
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: theme.text, fontSize: '1.1em' }}>
                📊 Taux Conversion
              </h3>
              <p style={{ margin: '0', fontSize: '2em', fontWeight: 'bold', color: theme.secondary }}>
                {clients.length > 0 ? Math.round((clients.filter(c => c.status === 'closed').length / clients.length) * 100) : 0}%
              </p>
            </div>
          </div>

          {/* Main Dashboard Layout */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Left: Clients list */}
            <div className="lg:col-span-1 h-full">
              {loading ? (
                <div className="bg-white rounded-lg shadow p-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">Chargement des clients...</p>
                </div>
              ) : (
                <ClientsList
                  clients={clients}
                  selectedClientId={selectedClientId}
                  onSelectClient={setSelectedClientId}
                />
              )}
            </div>

            {/* Right: GPS + AI */}
            <div className="lg:col-span-2 space-y-4">
              {selectedClient ? (
                <>
                  <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="font-semibold mb-1">
                      Détails client: {selectedClient.name}
                    </h2>
                    <p className="text-sm text-gray-600">{selectedClient.address}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Statut: {selectedClient.status} - Score:{' '}
                      {selectedClient.score ?? '—'}
                    </p>
                    {selectedClient.phone && (
                      <p className="text-xs text-gray-500 mt-1">
                        📞 {selectedClient.phone}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <GPSVisitTracker clientId={selectedClient.id} />
                    <AIScore client={selectedClient} />
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-600">
                  Aucun client sélectionné. Ajoutez au moins un client pour commencer à suivre les visites terrain.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Settings Modal */}
        {showProfileSettings && (
          <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: theme.cardBg,
              padding: '30px',
              borderRadius: '12px',
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadow,
              width: '90%',
              maxWidth: '500px'
            }}>
              <h2 style={{ color: theme.text, marginBottom: '20px' }}>Profile Settings</h2>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="userName" style={{ display: 'block', color: theme.textSecondary, marginBottom: '5px' }}>Name:</label>
                <input
                  id="userName"
                  type="text"
                  value={user?.firstName || (!isClerkAvailable ? 'Commercial Agent' : '')}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.inputBg,
                    color: theme.inputText,
                    fontSize: '1em',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowProfileSettings(false)}
                  style={{
                    backgroundColor: theme.cardBg,
                    border: `1px solid ${theme.border}`,
                    color: theme.text,
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowProfileSettings(false)}
                  style={{
                    backgroundColor: theme.primary,
                    border: 'none',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notifications */}
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              backgroundColor: toast.type === 'error' ? theme.error : toast.type === 'success' ? theme.success : theme.primary,
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              boxShadow: theme.shadow,
              zIndex: 1000,
              fontSize: '14px',
              maxWidth: '300px'
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ClerkAuthWrapper>
  );
}
