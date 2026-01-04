import React, { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState({ name: 'yahia', email: 'yahia@example.com' });
  const [tasks, setTasks] = useState([]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Task Manager</h1>
      <p>User Name</p>
      <p>Tasks: {tasks?.length || 0}</p>
    </div>
  );
}

export default App;
