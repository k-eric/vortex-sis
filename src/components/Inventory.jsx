import React, { useState, useEffect } from 'react';
import { databases, ID } from '../lib/appwrite';

const DATABASE_ID = 'vortex_db';
const INVENTORY_TABLE_ID = 'inventory';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('library');
  const [quantity, setQuantity] = useState('');
  const [condition, setCondition] = useState('good');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, INVENTORY_TABLE_ID);
      setItems(response.documents);
    } catch (err) {
      console.error('Error fetching inventory:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await databases.createDocument(DATABASE_ID, INVENTORY_TABLE_ID, ID.unique(), {
        itemName,
        category,
        quantity: parseInt(quantity, 10),
        condition
      });
      alert('Asset added successfully!');
      setItemName('');
      setQuantity('');
      fetchInventory();
    } catch (err) {
      alert('Error adding asset: ' + err.message);
    }
  };

  if (loading) return <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>Loading inventory records...</div>;

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h2>Vortex SIS — Library & Inventory Tracking</h2>
      <p>Manage textbooks, library books, laboratory apparatus, and school equipment.</p>
      
      {/* Add Asset Form */}
      <form onSubmit={handleAddItem} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '600px' }}>
        <h3>Add School Asset</h3>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Item Name</label>
          <input
            type="text"
            placeholder="e.g. Mathematics Grade 10 Textbook"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '10px' }}>
              <option value="library">Library / Textbooks</option>
              <option value="laboratory">Laboratory</option>
              <option value="sports">Sports Equipment</option>
              <option value="general">General Asset</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Quantity</label>
            <input
              type="number"
              placeholder="e.g. 50"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
            />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Condition</label>
          <select value={condition} onChange={(e) => setCondition(e.target.value)} style={{ width: '100%', padding: '10px' }}>
            <option value="new">New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="damaged">Damaged</option>
          </select>
        </div>
        <button type="submit" style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
          Save Asset
        </button>
      </form>

      {/* Asset List */}
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h3>Asset Inventory Registry</h3>
        {items.length === 0 ? (
          <p>No inventory items recorded yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ background: '#eee', textAlign: 'left' }}>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Item Name</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Category</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Quantity</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Condition</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.$id}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>{item.itemName}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee', textTransform: 'uppercase' }}>{item.category}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{item.quantity}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      background: '#e2e3e5',
                      color: '#383d41',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {item.condition}
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