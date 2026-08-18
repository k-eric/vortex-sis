import React, { useState, useEffect } from 'react';
import { databases, ID } from '../lib/appwrite';

const DATABASE_ID = 'vortex_db';
const LOGS_TABLE_ID = 'communication_logs';

export default function Communication() {
  const [logs, setLogs] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState('sms');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, LOGS_TABLE_ID);
      setLogs(response.documents);
    } catch (err) {
      console.error('Error fetching communication logs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await databases.createDocument(DATABASE_ID, LOGS_TABLE_ID, ID.unique(), {
        recipient,
        channel,
        message,
        status: 'sent',
        sentAt: new Date().toISOString()
      });
      alert('Message logged and queued successfully!');
      setRecipient('');
      setMessage('');
      fetchLogs();
    } catch (err) {
      alert('Error sending message: ' + err.message);
    }
  };

  if (loading) return <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>Loading communication logs...</div>;

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h2>Vortex SIS — Communication & Alerts</h2>
      <p>Send broadcast announcements, fee reminders, or attendance alerts via SMS and Email.</p>
      
      {/* Send Message Form */}
      <form onSubmit={handleSendMessage} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '600px' }}>
        <h3>Broadcast Alert</h3>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Channel</label>
          <select value={channel} onChange={(e) => setChannel(e.target.value)} style={{ width: '100%', padding: '10px' }}>
            <option value="sms">SMS</option>
            <option value="email">Email</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Recipient (Phone / Email)</label>
          <input
            type="text"
            placeholder={channel === 'sms' ? '+254712345678' : 'parent@example.com'}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Message</label>
          <textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
          Send Broadcast
        </button>
      </form>

      {/* Message Logs */}
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h3>Communication History</h3>
        {logs.length === 0 ? (
          <p>No messages sent yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ background: '#eee', textAlign: 'left' }}>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Channel</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Recipient</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Message</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.$id}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee', textTransform: 'uppercase', fontWeight: 'bold' }}>{log.channel}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{log.recipient}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{log.message}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      background: '#d4edda',
                      color: '#155724',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {log.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}