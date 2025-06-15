import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function WritingEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const articleId = searchParams.get('id');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/articles/${articleId}`);
      const article = response.data;
      setTitle(article.title);
      setContent(article.content);
      setStatus(article.status);
    } catch (error) {
      setError('Failed to fetch article');
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const articleData = {
        title,
        content,
        status
      };

      if (articleId) {
        await axios.patch(`/api/articles/${articleId}`, articleData);
      } else {
        await axios.post('/api/articles', articleData);
      }

      navigate('/dashboard');
    } catch (error) {
      setError('Failed to save article');
      console.error('Error saving article:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAiAssist = async () => {
    try {
      setIsAiLoading(true);
      const response = await axios.post(
        '/api/ai/assist',
        {
          prompt: content,
          context: 'Improve this writing while maintaining the original meaning and style.'
        }
      );
      setAiSuggestion(response.data.suggestion);
    } catch (error) {
      setError('Failed to get AI assistance');
      console.error('Error getting AI assistance:', error);
    } finally {
      setIsAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            rows={15}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleAiAssist}
            disabled={isAiLoading || !content}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isAiLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              'Get AI Assistance'
            )}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !title || !content}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              'Save Article'
            )}
          </button>
        </div>

        {aiSuggestion && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">AI Suggestions</h3>
            <div className="mt-2 p-4 bg-gray-50 rounded-md">
              <p className="text-gray-700 whitespace-pre-wrap">{aiSuggestion}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 