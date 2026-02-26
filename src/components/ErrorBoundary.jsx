import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log detailed error information
    console.error('=== ERROR BOUNDARY CAUGHT ERROR ===');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Error Stack:', error.stack);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('====================================');
    
    // Also log to window for easier debugging in production
    if (typeof window !== 'undefined') {
      window.lastError = {
        error: error.toString(),
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString()
      };
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h2 style={{ color: '#FF6B35', marginBottom: '20px' }}>
            🚨 Something went wrong
          </h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            We're sorry, but something unexpected happened. Please refresh the page to try again.
          </p>
          
          <div style={{ marginBottom: '30px' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              🔄 Refresh Page
            </button>
            
            <button
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              style={{
                padding: '12px 24px',
                backgroundColor: '#1DB954',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              🔄 Retry
            </button>
          </div>
          
          {/* Always show error details for debugging */}
          <details style={{
            textAlign: 'left',
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            maxWidth: '800px',
            width: '100%'
          }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
              🐛 Error Details (Click to expand)
            </summary>
            <div style={{ fontSize: '14px', fontFamily: 'monospace' }}>
              <div style={{ marginBottom: '15px' }}>
                <strong>Error:</strong> {this.state.error && this.state.error.toString()}
              </div>
              
              {this.state.error && this.state.error.stack && (
                <div style={{ marginBottom: '15px' }}>
                  <strong>Stack Trace:</strong>
                  <pre style={{ 
                    whiteSpace: 'pre-wrap', 
                    margin: '10px 0',
                    padding: '10px',
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px',
                    maxHeight: '200px',
                    overflow: 'auto'
                  }}>
                    {this.state.error.stack}
                  </pre>
                </div>
              )}
              
              {this.state.errorInfo && this.state.errorInfo.componentStack && (
                <div style={{ marginBottom: '15px' }}>
                  <strong>Component Stack:</strong>
                  <pre style={{ 
                    whiteSpace: 'pre-wrap', 
                    margin: '10px 0',
                    padding: '10px',
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px',
                    maxHeight: '200px',
                    overflow: 'auto'
                  }}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              )}
              
              <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                <strong>💡 Debug Info:</strong>
                <br />
                • Check browser console for more details
                <br />
                • Look for "ERROR BOUNDARY CAUGHT ERROR" in console
                <br />
                • Error also stored in <code>window.lastError</code>
              </div>
            </div>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
