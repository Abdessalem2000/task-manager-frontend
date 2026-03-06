'use client';

import Link from 'next/link';

export default function LandingPage() {
  const styles = {
    main: {
      minHeight: '100vh',
      backgroundColor: '#0F0F0F',
      color: '#FFFFFF',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    header: {
      borderBottom: '1px solid #2A2A2A',
      backgroundColor: 'rgba(15, 15, 15, 0.8)',
      backdropFilter: 'blur(10px)',
      position: 'sticky' as const,
      top: 0,
      zIndex: 20
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    logoBox: {
      height: '28px',
      width: '28px',
      borderRadius: '8px',
      backgroundColor: '#06B6D4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#0F172A'
    },
    nav: {
      display: 'none',
      alignItems: 'center',
      gap: '24px',
      fontSize: '14px',
      color: '#D1D5DB'
    },
    navMobile: {
      '@media (min-width: 768px)': {
        display: 'flex'
      }
    },
    authButtons: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '14px'
    },
    signInLink: {
      color: '#D1D5DB',
      textDecoration: 'none',
      cursor: 'pointer'
    },
    signUpButton: {
      borderRadius: '9999px',
      backgroundColor: '#06B6D4',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#0F172A',
      textDecoration: 'none',
      cursor: 'pointer'
    },
    hero: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '64px 24px 80px',
      display: 'grid',
      gap: '40px',
      gridTemplateColumns: '1fr',
      alignItems: 'center'
    },
    heroDesktop: {
      '@media (min-width: 768px)': {
        gridTemplateColumns: '1fr 1fr'
      }
    },
    heroContent: {},
    tagline: {
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.3em',
      color: '#06B6D4',
      marginBottom: '12px'
    },
    title: {
      fontSize: 'clamp(2rem, 5vw, 3rem)',
      fontWeight: 'bold',
      lineHeight: '1.2',
      marginBottom: '16px',
      color: '#FFFFFF'
    },
    subtitle: {
      color: '#D1D5DB',
      fontSize: '14px',
      lineHeight: '1.6',
      marginBottom: '24px'
    },
    ctaButtons: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      alignItems: 'center',
      gap: '12px'
    },
    primaryButton: {
      borderRadius: '9999px',
      backgroundColor: '#06B6D4',
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#0F172A',
      textDecoration: 'none',
      cursor: 'pointer'
    },
    secondaryButton: {
      fontSize: '14px',
      color: '#D1D5DB',
      textDecoration: 'none',
      cursor: 'pointer'
    },
    note: {
      marginTop: '12px',
      fontSize: '12px',
      color: '#6B7280'
    },
    preview: {
      position: 'relative' as const
    },
    previewBg1: {
      position: 'absolute' as const,
      top: '-24px',
      left: '-24px',
      height: '128px',
      width: '128px',
      borderRadius: '50%',
      backgroundColor: 'rgba(6, 182, 212, 0.2)',
      filter: 'blur(48px)'
    },
    previewBg2: {
      position: 'absolute' as const,
      bottom: '-40px',
      right: '-40px',
      height: '160px',
      width: '160px',
      borderRadius: '50%',
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      filter: 'blur(48px)'
    },
    previewCard: {
      position: 'relative' as const,
      borderRadius: '24px',
      border: '1px solid #2A2A2A',
      backgroundColor: 'rgba(26, 26, 26, 0.8)',
      padding: '20px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    section: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 24px 64px'
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '8px',
      color: '#FFFFFF'
    },
    sectionSubtitle: {
      fontSize: '14px',
      color: '#D1D5DB',
      marginBottom: '24px',
      lineHeight: '1.6'
    },
    features: {
      display: 'grid',
      gap: '20px',
      gridTemplateColumns: '1fr'
    },
    featuresDesktop: {
      '@media (min-width: 768px)': {
        gridTemplateColumns: 'repeat(3, 1fr)'
      }
    },
    featureCard: {
      borderRadius: '16px',
      border: '1px solid #2A2A2A',
      backgroundColor: 'rgba(26, 26, 26, 0.8)',
      padding: '16px',
      fontSize: '14px'
    },
    featureTitle: {
      fontSize: '12px',
      fontWeight: '600',
      marginBottom: '4px'
    },
    featureDescription: {
      color: '#E5E7EB',
      marginBottom: '8px'
    },
    featureSubtext: {
      fontSize: '12px',
      color: '#9CA3AF'
    },
    whyList: {
      display: 'grid',
      gap: '16px',
      gridTemplateColumns: '1fr',
      fontSize: '14px',
      color: '#D1D5DB'
    },
    whyListDesktop: {
      '@media (min-width: 768px)': {
        gridTemplateColumns: '1fr 1fr'
      }
    },
    whyItem: {
      display: 'flex',
      gap: '8px'
    },
    bullet: {
      marginTop: '6px',
      height: '6px',
      width: '6px',
      borderRadius: '50%',
      backgroundColor: '#10B981',
      flexShrink: 0
    },
    aboutSection: {
      display: 'grid',
      gap: '32px',
      gridTemplateColumns: '1fr'
    },
    aboutSectionDesktop: {
      '@media (min-width: 768px)': {
        gridTemplateColumns: '1fr 1fr'
      }
    },
    footer: {
      borderTop: '1px solid #2A2A2A',
      padding: '16px',
      textAlign: 'center' as const,
      fontSize: '12px',
      color: '#6B7280'
    }
  };

  return (
    <div style={styles.main}>
      {/* Navbar */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <div style={styles.logoBox}>🚗</div>
            <span style={{ fontWeight: '600', letterSpacing: '-0.025em' }}>TaskForce Mobile</span>
          </div>
          <nav style={{ ...styles.nav, ...styles.navMobile }}>
            <a href="#features" style={{ cursor: 'pointer', color: 'inherit' }}>Features</a>
            <a href="#analytics" style={{ cursor: 'pointer', color: 'inherit' }}>Analytics</a>
            <a href="#why-us" style={{ cursor: 'pointer', color: 'inherit' }}>Why us</a>
            <a href="#about" style={{ cursor: 'pointer', color: 'inherit' }}>About</a>
            <a href="#contact" style={{ cursor: 'pointer', color: 'inherit' }}>Contact</a>
          </nav>
          <div style={styles.authButtons}>
            <Link href="/sign-in" style={styles.signInLink}>
              Sign in
            </Link>
            <Link href="/sign-up" style={styles.signUpButton}>
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ ...styles.hero, ...styles.heroDesktop }}>
        <div style={styles.heroContent}>
          <p style={styles.tagline}>
            TaskForce Mobile - GPS Sales Tracker pour Agences DZ
          </p>
          <h1 style={styles.title}>
            Suivi GPS visites commerciales, offline sync, IA scoring prospects
          </h1>
          <p style={styles.subtitle}>
            Comme Silwane mais 5x moins cher - 15$/mois. GPS tracking chaque visite, offline mode, IA score prospects, dashboard realtime équipe.
          </p>
          <div style={styles.ctaButtons}>
            <Link href="/working-app" style={styles.primaryButton}>
              🚗 Essai Gratuit - Voir Démo
            </Link>
            <Link href="#features" style={styles.secondaryButton}>
              Comment ça marche ↓
            </Link>
          </div>
          <p style={styles.note}>
            📱 Compatible Android/iOS • Installation PWA • Pas de carte crédit
          </p>
        </div>

        {/* Fake analytics preview */}
        <div style={styles.preview}>
          <div style={styles.previewBg1} />
          <div style={styles.previewBg2} />
          <div style={styles.previewCard}>
            <p style={{ fontSize: '12px', fontWeight: '500', color: '#9CA3AF', marginBottom: '12px' }}>Aperçu Dashboard</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px', fontSize: '12px' }}>
              <div style={{ borderRadius: '16px', backgroundColor: 'rgba(31, 41, 55, 0.8)', padding: '12px' }}>
                <p style={{ color: '#9CA3AF', marginBottom: '4px' }}>Clients actifs</p>
                <p style={{ fontSize: '18px', fontWeight: '600', color: '#10B981' }}>24</p>
                <p style={{ fontSize: '10px', color: '#10B981', marginTop: '4px' }}>+8 ce mois</p>
              </div>
              <div style={{ borderRadius: '16px', backgroundColor: 'rgba(31, 41, 55, 0.8)', padding: '12px' }}>
                <p style={{ color: '#9CA3AF', marginBottom: '4px' }}>Visites aujourd'hui</p>
                <p style={{ fontSize: '18px', fontWeight: '600', color: '#06B6D4' }}>12</p>
                <p style={{ fontSize: '10px', color: '#06B6D4', marginTop: '4px' }}>GPS tracking</p>
              </div>
              <div style={{ borderRadius: '16px', backgroundColor: 'rgba(31, 41, 55, 0.8)', padding: '12px' }}>
                <p style={{ color: '#9CA3AF', marginBottom: '4px' }}>Prospects chauds</p>
                <p style={{ fontSize: '18px', fontWeight: '600', color: '#8B5CF6' }}>8</p>
                <p style={{ fontSize: '10px', color: '#8B5CF6', marginTop: '4px' }}>Score IA &gt; 70</p>
              </div>
            </div>
            <div style={{ borderRadius: '16px', backgroundColor: 'rgba(31, 41, 55, 0.8)', padding: '12px', fontSize: '12px', color: '#D1D5DB' }}>
              <p style={{ marginBottom: '8px', fontWeight: '500' }}>"3 prospects chauds à Alger nécessitent suivi prioritaire. Score IA élevé + proximité GPS."</p>
              <p style={{ fontSize: '10px', color: '#6B7280' }}>AI scoring · GPS tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={styles.section}>
        <h2 style={styles.sectionTitle}>🚗 GPS Sales Tracker - Fonctionnalités Clés</h2>
        <p style={styles.sectionSubtitle}>
          ✅ GPS tracking chaque visite (smartphone) • ✅ Offline mode (sync auto) • ✅ IA score prospects (hot/tiède/froid) • ✅ Dashboard realtime équipe • ✅ Export rapports conformes DZ
        </p>
        <div style={{ ...styles.features, ...styles.featuresDesktop }}>
          <div style={styles.featureCard}>
            <p style={{ ...styles.featureTitle, color: '#06B6D4' }}>📍 GPS Tracking Visites</p>
            <p style={styles.featureDescription}>Géolocalisation automatique chaque visite client. Suivi temps réel des commerciaux sur terrain.</p>
            <p style={styles.featureSubtext}>Compatible tous smartphones Android/iOS</p>
          </div>
          <div style={styles.featureCard}>
            <p style={{ ...styles.featureTitle, color: '#10B981' }}>📱 Offline Mode</p>
            <p style={styles.featureDescription}>Fonctionne sans internet. Synchronisation automatique dès la connexion disponible.</p>
            <p style={styles.featureSubtext}>Parfait pour zones couverture 4G limitée</p>
          </div>
          <div style={styles.featureCard}>
            <p style={{ ...styles.featureTitle, color: '#8B5CF6' }}>🤖 IA Scoring Prospects</p>
            <p style={styles.featureDescription}>Score automatique 0-100 basé sur historique, GPS proximité, taux de conversion.</p>
            <p style={styles.featureSubtext}>Focus sur prospects chauds (score &gt; 70)</p>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section id="why-us" style={styles.section}>
        <h2 style={styles.sectionTitle}>Pourquoi TaskForce Mobile vs les solutions traditionnelles?</h2>
        <p style={{ ...styles.sectionSubtitle, marginBottom: '20px' }}>
          🇩🇿 Conçu spécifiquement pour le marché algérien. 5x moins cher que les solutions classiques de gestion de force de vente et d'ERP.
        </p>
        <ul style={{ ...styles.whyList, ...styles.whyListDesktop }}>
          <li style={styles.whyItem}>
            <span style={styles.bullet} />
            💰 15$/mois vs solutions ERP traditionnelles (75$+)
          </li>
          <li style={styles.whyItem}>
            <span style={styles.bullet} />
            📱 PWA installable (pas besoin App Store/Play Store)
          </li>
          <li style={styles.whyItem}>
            <span style={styles.bullet} />
            🤖 IA scoring prospects inclus (option payante dans les ERP classiques)
          </li>
          <li style={styles.whyItem}>
            <span style={styles.bullet} />
            🇩🇿 Support local et rapports conformes réglementation DZ
          </li>
        </ul>
      </section>

      {/* About & Contact */}
      <section id="about" style={styles.section}>
        <div style={{ ...styles.aboutSection, ...styles.aboutSectionDesktop }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#FFFFFF' }}>About</h3>
            <p style={{ fontSize: '14px', color: '#D1D5DB', lineHeight: '1.6' }}>
              TaskForce Mobile est la solution algérienne alternative aux ERP lourds. Développé pour les réalités du terrain DZ: connexion 4G limitée, besoin de mode offline, prix adapté au marché local.
            </p>
          </div>
          <div id="contact">
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#FFFFFF' }}>Contact</h3>
            <p style={{ fontSize: '14px', color: '#D1D5DB', marginBottom: '4px' }}>🚗 Version démo gratuite pour votre agence?</p>
            <p style={{ fontSize: '14px', color: '#D1D5DB' }}>📱 WhatsApp: +213 5XX XXX XXX (ou LinkedIn: @votre-profil)</p>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        © {new Date().getFullYear()} TaskForce Mobile. All rights reserved.
      </footer>
    </div>
  );
}
