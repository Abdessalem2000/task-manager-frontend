import React, { useState, useEffect } from 'react';

export default function TestAPI() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔍 Testing API call...');
        const response = await fetch('/api/tasks');
        const result = await response.json();
        console.log('📊 API Response:', result);
        
        // Parse the response
        const tasksData = Array.isArray(result) ? result : (result.tasks || []);
        const isConnected = result.dbConnected !== undefined ? result.dbConnected : true;
        
        console.log('✅ Parsed Data:', { tasks: tasksData.length, connected: isConnected });
        
        setData({
          raw: result,
          parsed: {
            tasks: tasksData,
            count: tasksData.length,
            connected: isConnected
          }
        });
      } catch (error) {
        console.error('❌ Error:', error);
        setData({ error: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'monospace',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1>🧪 API Integration Test</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : data ? (
        <div>
          <h2>✅ API Response:</h2>
          <pre style={{
            backgroundColor: '#fff',
            padding: '15px',
            borderRadius: '5px',
            overflow: 'auto',
            border: '1px solid #ddd'
          }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ) : (
        <p>No data loaded</p>
      )}
    </div>
  );
}
