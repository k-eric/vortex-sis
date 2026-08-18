import React, { useState, useEffect } from 'react';
import { databases, ID } from '../lib/appwrite';

const DATABASE_ID = 'vortex_db';
const INVOICES_TABLE_ID = 'invoices';

export default function Finance() {
  const [invoices, setInvoices] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [term, setTerm] = useState('Term 1');
  const [totalAmount, setTotalAmount] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, INVOICES_TABLE_ID);
      setInvoices(response.documents);
    } catch (err) {
      console.error('Error fetching invoices:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      await databases.createDocument(DATABASE_ID, INVOICES_TABLE_ID, ID.unique(), {
        studentId,
        term,
        totalAmount: parseFloat(totalAmount),
        paidAmount: parseFloat(paidAmount || 0),
        status,
      });
      alert('Invoice created successfully!');
      setStudentId('');
      setTotalAmount('');
      setPaidAmount('');
      setStatus('pending');
      fetchInvoices();
    } catch (err) {
      alert('Error creating invoice: ' + err.message);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-400">Loading financial records...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <h2 className="text-2xl font-bold text-white mb-2">Vortex SIS — Finance & Fee Billing</h2>
      <p className="text-gray-400 mb-6">Monitor student fee statements, balances, and payment tracking.</p>

      {/* Invoice Generation Form */}
      <form onSubmit={handleCreateInvoice} className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800 mb-8 space-y-4 max-w-xl">
        <h3 className="text-lg font-semibold text-white">Generate Fee Invoice</h3>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Student ID</label>
          <input
            type="text"
            placeholder="e.g. STU-2026-001"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
            className="w-full p-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-white focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Academic Term</label>
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full p-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-white focus:outline-none"
            >
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Payment Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-white focus:outline-none"
            >
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Total Amount (KES)</label>
            <input
              type="number"
              placeholder="e.g. 45000"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              required
              className="w-full p-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Paid Amount (KES)</label>
            <input
              type="number"
              placeholder="e.g. 15000"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              className="w-full p-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-white focus:outline-none"
            />
          </div>
        </div>
        <button type="submit" className="w-full py-2.5 px-4 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition">
          Create Invoice
        </button>
      </form>

      {/* Fee Invoices Table */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Fee Invoices</h3>
        {invoices.length === 0 ? (
          <p className="text-gray-400">No invoices generated yet. Create fee structures and invoices to begin tracking balances.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800 border-b border-gray-700 text-xs font-semibold text-gray-300 uppercase">
                  <th className="p-3">Student ID</th>
                  <th className="p-3">Term</th>
                  <th className="p-3">Total (KES)</th>
                  <th className="p-3">Paid (KES)</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-sm text-gray-300">
                {invoices.map((inv) => (
                  <tr key={inv.$id} className="hover:bg-gray-800">
                    <td className="p-3 font-medium text-white">{inv.studentId}</td>
                    <td className="p-3 text-gray-400">{inv.term}</td>
                    <td className="p-3 text-white font-semibold">{inv.totalAmount}</td>
                    <td className="p-3 text-white font-semibold">{inv.paidAmount}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        inv.status === 'paid' ? 'bg-green-900 text-green-300' :
                        inv.status === 'partial' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'
                      }`}>
                        {inv.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}