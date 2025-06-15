import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, loading: authLoading } = useAuth();
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/stats/overview');
        setStats(response.data);
      } catch (error) {
        setError('Failed to fetch statistics');
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && currentUser) {
      fetchStats();
    } else if (!authLoading && !currentUser) {
      setStats(null);
      setLoading(false);
    }
  }, [currentUser, authLoading]);

  // Fetch students
  useEffect(() => {
    if (!authLoading && currentUser) {
      fetchStudents();
    }
  }, [currentUser, authLoading]);

  async function fetchStudents() {
    setLoading(true);
    try {
      const res = await axios.get(`/api/users?_t=${Date.now()}`);
      setStudents(res.data);
    } catch (err) {
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }

  // Add student
  async function handleAddStudent(e) {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    try {
      await axios.post('/api/users', form);
      setForm({ name: '', email: '', password: '' });
      setFormSuccess('Student added!');
      fetchStudents();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add student');
    }
  }

  // Delete student
  async function handleDelete(id) {
    if (!window.confirm('Delete this student?')) return;
    try {
      await axios.delete(`/api/users/${id}`);
      fetchStudents();
    } catch (err) {
      alert('Failed to delete student');
    }
  }

  // Reset password
  async function handleResetPassword(id) {
    const password = prompt('Enter new password:');
    if (!password) return;
    try {
      await axios.post(`/api/users/${id}/reset-password`, { password });
      alert('Password reset!');
    } catch (err) {
      alert('Failed to reset password');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Overview of platform statistics and user activity.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {stats && (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Articles */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Articles
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalArticles}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Users
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.activeUsers}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Published Articles */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Published Articles
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.publishedArticles}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {stats?.recentActivity?.map((activity, index) => (
              <li key={index}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {activity.action}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {activity.user}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {activity.details}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>{new Date(activity.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-2xl shadow p-8">
        <h2 className="text-xl font-bold mb-4 text-primary">Add Student</h2>
        <form className="flex flex-col md:flex-row gap-4 items-center" onSubmit={handleAddStudent}>
          <input
            type="text"
            placeholder="Name"
            className="border rounded px-3 py-2 flex-1"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="border rounded px-3 py-2 flex-1"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded px-3 py-2 flex-1"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          <button
            type="submit"
            className="px-6 py-2 rounded bg-accent text-white font-bold hover:bg-accent-light transition-colors"
          >
            Add
          </button>
        </form>
        {formError && <div className="text-red-500 mt-2">{formError}</div>}
        {formSuccess && <div className="text-green-600 mt-2">{formSuccess}</div>}
      </div>

      <div className="mt-8 bg-white rounded-2xl shadow p-8">
        <h2 className="text-xl font-bold mb-4 text-primary">Student Accounts</h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : students.length === 0 ? (
          <div>No students found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id} className="border-b">
                  <td className="px-4 py-2">{student.name}</td>
                  <td className="px-4 py-2">{student.email}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleResetPassword(student._id)}
                      className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200"
                    >
                      Reset Password
                    </button>
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="px-3 py-1 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200"
                    >
                      Delete
                    </button>
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