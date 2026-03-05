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
            <div style={styles.logoBox}>TM</div>
            <span style={{ fontWeight: '600', letterSpacing: '-0.025em' }}>TaskMetrics</span>
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
            Analytics dashboard for busy teams
          </p>
          <h1 style={styles.title}>
            Give your team a clear, actionable view of tasks and habits.
          </h1>
          <p style={styles.subtitle}>
            TaskMetrics turns your daily work into a simple analytics dashboard, so agency owners and team leads always know what's done, what's blocked, and what needs attention next.
          </p>
          <div style={styles.ctaButtons}>
            <Link href="/working-app" style={styles.primaryButton}>
              See the live dashboard
            </Link>
            <Link href="#features" style={styles.secondaryButton}>
              How it works ↓
            </Link>
          </div>
          <p style={styles.note}>
            No credit card required • See your dashboard in under 60 seconds
          </p>
        </div>

        {/* Fake analytics preview */}
        <div style={styles.preview}>
          <div style={styles.previewBg1} />
          <div style={styles.previewBg2} />
          <div style={styles.previewCard}>
            <p style={{ fontSize: '12px', fontWeight: '500', color: '#9CA3AF', marginBottom: '12px' }}>Weekly overview</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px', fontSize: '12px' }}>
              <div style={{ borderRadius: '16px', backgroundColor: 'rgba(31, 41, 55, 0.8)', padding: '12px' }}>
                <p style={{ color: '#9CA3AF', marginBottom: '4px' }}>Tasks done</p>
                <p style={{ fontSize: '18px', fontWeight: '600', color: '#10B981' }}>28</p>
                <p style={{ fontSize: '10px', color: '#10B981', marginTop: '4px' }}>+14% vs last week</p>
              </div>
              <div style={{ borderRadius: '16px', backgroundColor: 'rgba(31, 41, 55, 0.8)', padding: '12px' }}>
                <p style={{ color: '#9CA3AF', marginBottom: '4px' }}>Habits streak</p>
                <p style={{ fontSize: '18px', fontWeight: '600', color: '#06B6D4' }}>7 days</p>
                <p style={{ fontSize: '10px', color: '#06B6D4', marginTop: '4px' }}>Focus & journaling</p>
              </div>
              <div style={{ borderRadius: '16px', backgroundColor: 'rgba(31, 41, 55, 0.8)', padding: '12px' }}>
                <p style={{ color: '#9CA3AF', marginBottom: '4px' }}>AI insights</p>
                <p style={{ fontSize: '18px', fontWeight: '600', color: '#8B5CF6' }}>3</p>
                <p style={{ fontSize: '10px', color: '#8B5CF6', marginTop: '4px' }}>New suggestions</p>
              </div>
            </div>
            <div style={{ borderRadius: '16px', backgroundColor: 'rgba(31, 41, 55, 0.8)', padding: '12px', fontSize: '12px', color: '#D1D5DB' }}>
              <p style={{ marginBottom: '8px', fontWeight: '500' }}>"If you complete 4 more tasks today, you&apos;ll hit 40% higher output than last Monday."</p>
              <p style={{ fontSize: '10px', color: '#6B7280' }}>AI assistant · Focus mode</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={styles.section}>
        <h2 style={styles.sectionTitle}>Everything in one dashboard.</h2>
        <p style={styles.sectionSubtitle}>
          Tasks, habits, and AI recommendations — organized in one clean interface so you don&apos;t waste time managing your productivity tools.
        </p>
        <div style={{ ...styles.features, ...styles.featuresDesktop }}>
          <div style={styles.featureCard}>
            <p style={{ ...styles.featureTitle, color: '#06B6D4' }}>Task pipeline overview</p>
            <p style={styles.featureDescription}>Give your team a single place to see what's in progress, what's done, and what's falling behind across clients and projects.</p>
            <p style={styles.featureSubtext}>Ideal for agencies and squads that manage multiple workstreams.</p>
          </div>
          <div style={styles.featureCard}>
            <p style={{ ...styles.featureTitle, color: '#10B981' }}>Habit & routine tracking</p>
            <p style={styles.featureDescription}>Track daily routines like prospecting, content, or reporting so you can see consistency, not just tasks completed.</p>
            <p style={styles.featureSubtext}>Helps teams build reliable, repeatable habits.</p>
          </div>
          <div style={styles.featureCard}>
            <p style={{ ...styles.featureTitle, color: '#8B5CF6' }}>AI-powered focus</p>
            <p style={styles.featureDescription}>Let AI surface the 3–5 most important tasks for today based on your patterns instead of a long, noisy backlog.</p>
            <p style={styles.featureSubtext}>Make prioritization easier for everyone on the team.</p>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section id="why-us" style={styles.section}>
        <h2 style={styles.sectionTitle}>Why choose TaskMetrics?</h2>
        <p style={{ ...styles.sectionSubtitle, marginBottom: '20px' }}>
          Unlike generic todo apps, TaskMetrics is built for people who want clear analytics on how they actually spend their time.
        </p>
        <ul style={{ ...styles.whyList, ...styles.whyListDesktop }}>
          <li style={styles.whyItem}>
            <span style={styles.bullet} />
            See tasks and habits for your whole team in a single analytics view.
          </li>
          <li style={styles.whyItem}>
            <span style={styles.bullet} />
            Spot blockers early with simple completion and streak metrics, not complex reports.
          </li>
          <li style={styles.whyItem}>
            <span style={styles.bullet} />
            Use AI insights to decide what your team should focus on each day.
          </li>
          <li style={styles.whyItem}>
            <span style={styles.bullet} />
            Start as a simple dashboard, then extend it with your own automations and integrations.
          </li>
        </ul>
      </section>

      {/* About & Contact */}
      <section id="about" style={styles.section}>
        <div style={{ ...styles.aboutSection, ...styles.aboutSectionDesktop }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#FFFFFF' }}>About</h3>
            <p style={{ fontSize: '14px', color: '#D1D5DB', lineHeight: '1.6' }}>
              TaskMetrics started as a personal dashboard for managing client work and daily habits, and evolved into a reusable SaaS template for teams and agencies. It's built by an independent developer focused on clean UI, simple analytics, and fast iteration — not bloated project management.
            </p>
          </div>
          <div id="contact">
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#FFFFFF' }}>Contact</h3>
            <p style={{ fontSize: '14px', color: '#D1D5DB', marginBottom: '4px' }}>Want a custom version of this dashboard for your team or agency?</p>
            <p style={{ fontSize: '14px', color: '#D1D5DB' }}>Email: <span style={{ color: '#E5E7EB' }}>your-email@example.com</span> (or connect on LinkedIn to discuss your use case).</p>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        © {new Date().getFullYear()} TaskMetrics. All rights reserved.
      </footer>
    </div>
  );
}
