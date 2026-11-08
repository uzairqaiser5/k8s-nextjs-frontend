import { useState, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // NodePort 30008 points to FastAPI on any cluster node IP
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://129.158.234.76:30008';

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/messages`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;
    await fetch(`${BACKEND_URL}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: input }),
    });
    setInput('');
    fetchMessages();
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Kubernetes 3-Tier Web App</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter messages uzair to store in Postgres..."
          style={{ padding: '0.5rem', width: '300px' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', marginLeft: '0.5rem' }}>
          Save to DB
        </button>
      </form>
      <h2>Messages in PostgreSQL:</h2>
      <ul>
        {messages.map((m) => (
          <li key={m.id}>
            <strong>#{m.id}:</strong> {m.content}
          </li>
        ))}
      </ul>
    </div>
  );
}