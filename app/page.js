'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://129.158.234.76:30008';

  const showStatus = (text) => {
    setStatus(text);
    setTimeout(() => setStatus(''), 3000);
  };

  // READ
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      showStatus('Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // CREATE
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent }),
      });
      if (res.ok) {
        setNewContent('');
        showStatus('Record added successfully');
        fetchMessages();
      }
    } catch (err) {
      console.error('Create error:', err);
      showStatus('Error saving record');
    }
  };

  // UPDATE
  const handleUpdate = async (id) => {
    if (!editContent.trim()) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      });
      if (res.ok) {
        setEditingId(null);
        setEditContent('');
        showStatus(`Record #${id} updated`);
        fetchMessages();
      }
    } catch (err) {
      console.error('Update error:', err);
      showStatus('Error updating record');
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!confirm(`Are you sure you want to delete record #${id}?`)) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/messages/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showStatus(`Record #${id} deleted`);
        fetchMessages();
      }
    } catch (err) {
      console.error('Delete error:', err);
      showStatus('Error deleting record');
    }
  };

  return (
    <div style={styles.container}>
      {/* Top Banner */}
      <header style={styles.header}>
        <div style={styles.badge}>OCI Kubernetes Cluster</div>
        <h1 style={styles.title}>PostgreSQL CRUD Manager</h1>
        <p style={styles.subtitle}>
          Next.js 14 <span style={{ color: '#0ea5e9' }}>➔</span> FastAPI <span style={{ color: '#0ea5e9' }}>➔</span> Persistent PostgreSQL
        </p>
      </header>

      {/* Status Toast */}
      {status && <div style={styles.toast}>{status}</div>}

      {/* Create Card */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Add New Record</h2>
        <form onSubmit={handleCreate} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Type your message here..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <button style={styles.primaryBtn} type="submit">
            Add to Postgres
          </button>
        </form>
      </div>

      {/* Messages List Card */}
      <div style={styles.card}>
        <div style={styles.listHeader}>
          <h2 style={styles.cardTitle}>Stored Records ({messages.length})</h2>
          <button style={styles.secondaryBtn} onClick={fetchMessages}>
            {loading ? 'Refreshing...' : '↻ Refresh'}
          </button>
        </div>

        {messages.length === 0 ? (
          <p style={styles.empty}>No records stored in the database yet. Add one above.</p>
        ) : (
          <div style={styles.list}>
            {messages.map((item) => (
              <div key={item.id} style={styles.listItem}>
                {editingId === item.id ? (
                  <div style={styles.editRow}>
                    <input
                      style={styles.input}
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      autoFocus
                    />
                    <button style={styles.saveBtn} onClick={() => handleUpdate(item.id)}>
                      Save
                    </button>
                    <button style={styles.cancelBtn} onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={styles.itemText}>
                      <span style={styles.idTag}>#{item.id}</span>
                      <span style={styles.content}>{item.content}</span>
                    </div>
                    <div style={styles.actionButtons}>
                      <button
                        style={styles.editBtn}
                        onClick={() => {
                          setEditingId(item.id);
                          setEditContent(item.content);
                        }}
                      >
                        Edit
                      </button>
                      <button style={styles.deleteBtn} onClick={() => handleDelete(item.id)}>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '820px',
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#0f172a',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    background: '#e0f2fe',
    color: '#0284c7',
    fontSize: '12px',
    fontWeight: '600',
    borderRadius: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    margin: '4px 0',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '15px',
    margin: 0,
  },
  toast: {
    padding: '10px 16px',
    background: '#0f172a',
    color: '#fff',
    borderRadius: '8px',
    textAlign: 'center',
    marginBottom: '16px',
    fontSize: '14px',
  },
  card: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    margin: '0 0 16px 0',
  },
  form: {
    display: 'flex',
    gap: '12px',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    outline: 'none',
  },
  primaryBtn: {
    padding: '10px 20px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  secondaryBtn: {
    padding: '6px 12px',
    background: '#f1f5f9',
    color: '#475569',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  listHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #f1f5f9',
  },
  itemText: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    overflow: 'hidden',
  },
  idTag: {
    fontSize: '12px',
    fontWeight: '700',
    background: '#e2e8f0',
    color: '#475569',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  content: {
    fontSize: '15px',
    color: '#1e293b',
    wordBreak: 'break-word',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  editBtn: {
    padding: '6px 12px',
    background: '#eff6ff',
    color: '#2563eb',
    border: '1px solid #bfdbfe',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '6px 12px',
    background: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  editRow: {
    display: 'flex',
    gap: '8px',
    width: '100%',
  },
  saveBtn: {
    padding: '6px 14px',
    background: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  cancelBtn: {
    padding: '6px 14px',
    background: '#94a3b8',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  empty: {
    color: '#94a3b8',
    fontSize: '14px',
    textAlign: 'center',
    margin: '20px 0',
  },
};