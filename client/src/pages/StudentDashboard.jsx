import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProfileEditor from '../components/ProfileEditor';

export default function StudentDashboard() {
  const { currentUser, loading: authLoading } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Axios is configured globally to send the token, no need for manual headers here.
        const res = await axios.get('/api/articles', {
          params: { author: currentUser.id }, // Filter by current user's ID
        });
        setArticles(res.data);
      } catch (err) {
        setError('Failed to fetch articles');
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && currentUser) {
      fetchArticles();
    } else if (!authLoading && !currentUser) {
      // If not authenticated, set loading to false and clear articles
      setArticles([]);
      setLoading(false);
    }
  }, [currentUser, authLoading]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold text-primary mb-8">My Articles</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="bg-white rounded-2xl shadow p-8">
        {loading ? (
          <div>Loading...</div>
        ) : articles.length === 0 ? (
          <div>No articles found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article._id} className="border-b">
                  <td className="px-4 py-2">{article.title}</td>
                  <td className="px-4 py-2">{article.status}</td>
                  <td className="px-4 py-2">{new Date(article.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ProfileEditor />
    </div>
  );
} 