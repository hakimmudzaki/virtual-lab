(async ()=>{
  try {
    const base = process.argv[2] || 'http://localhost:3000';
    console.log('Testing against', base);

    // Register
    let res = await fetch(base + '/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'del_flow_user', password: 'DelFlow123!' })
    });
    console.log('/api/auth/register', res.status);
    console.log(await res.text());

    // Login
    res = await fetch(base + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'del_flow_user', password: 'DelFlow123!' })
    });
    console.log('/api/auth/login', res.status);
    const j = await res.json();
    const token = j.token;
    if (!token) { console.error('No token returned'); process.exit(1); }

    // Create two simulations
    for (const d of [7.7, 8.8]) {
      res = await fetch(base + '/api/simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ angle: 45, velocity: 20, height: 5, distance: d })
      });
      console.log('/api/simulation', res.status, await res.text());
    }

    // Fetch history
    res = await fetch(base + '/api/history', { headers: { 'Authorization': `Bearer ${token}` } });
    console.log('/api/history (before delete)', res.status, await res.text());

    // Delete all history
    res = await fetch(base + '/api/history', { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    console.log('/api/history DELETE', res.status, await res.text());

    // Fetch history again
    res = await fetch(base + '/api/history', { headers: { 'Authorization': `Bearer ${token}` } });
    console.log('/api/history (after delete)', res.status, await res.text());

  } catch (e) {
    console.error('ERROR', e);
  }
})();