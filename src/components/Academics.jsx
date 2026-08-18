import React, { useState, useEffect } from 'react';
import { databases, ID } from '../lib/appwrite';

const DATABASE_ID = 'vortex_db';
const GRADES_TABLE_ID = 'grades';

export default function Academics() {
  const [grades, setGrades] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [score, setScore] = useState('');
  const [maxScore, setMaxScore] = useState('100');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, GRADES_TABLE_ID);
      setGrades(response.documents);
    } catch (err) {
      console.error('Error fetching grades:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGrade = async (e) => {
    e.preventDefault();
    try {
      await databases.createDocument(DATABASE_ID, GRADES_TABLE_ID, ID.unique(), {
        studentId,
        score: parseFloat(score),
        maxScore: parseFloat(maxScore),
        remarks,
        term: 'Term 1'
      });
      alert('Grade submitted successfully!');
      setStudentId('');
      setScore('');
      setRemarks('');
      fetchGrades();
    } catch (err) {
      alert('Error submitting grade: ' + err.message);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-400">Loading academic records...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <h2 className="text-2xl font-bold text-white mb-2">Vortex SIS — Academics & Gradebook</h2>
      <p className="text-gray-400 mb-6">Manage student continuous assessments and term exams.</p>
      
      {/* Grade Submission Form */}
      <form onSubmit={handleAddGrade} className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800 mb-8 space-y-4 max-w-xl">
        <h3 className="text-lg font-semibold text-white">Record Student Assessment</h3>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Student ID / Name</label>
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
            <label className="block text-sm font-medium text-gray-300 mb-1">Score Obtained</label>
            <input
              type="number"
              placeholder="e.g. 85"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              required
              className="w-full p-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Max Score</label>
            <input
              type="number"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              required
              className="w-full p-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-white focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Teacher Remarks</label>
          <input
            type="text"
            placeholder="e.g. Excellent performance in algebra"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            required
            className="w-full p-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-white focus:outline-none"
          />
        </div>
        <button type="submit" className="w-full py-2.5 px-4 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition">
          Save Grade Entry
        </button>
      </form>

      {/* Grade Records Table */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Recorded Grades</h3>
        {grades.length === 0 ? (
          <p className="text-gray-400">No grade records found yet. Once students are evaluated, scores will appear here.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800 border-b border-gray-700 text-xs font-semibold text-gray-300 uppercase">
                  <th className="p-3">Student ID</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-sm text-gray-300">
                {grades.map((grade) => (
                  <tr key={grade.$id} className="hover:bg-gray-800">
                    <td className="p-3 font-medium text-white">{grade.studentId}</td>
                    <td className="p-3 font-semibold text-white">{grade.score} / {grade.maxScore}</td>
                    <td className="p-3 text-gray-400">{grade.remarks}</td>
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