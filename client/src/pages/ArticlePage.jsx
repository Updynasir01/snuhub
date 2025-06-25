import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeftIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';

const DEFAULT_ARTICLE_IMAGE = 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80';

export default function ArticlePage() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/articles/${id}`);
        setArticle(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch article.');
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-[#f6faff]">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[#f6faff] text-red-500">
        <p>{error}</p>
        <Link to="/" className="mt-4 text-accent hover:underline">Go back home</Link>
      </div>
    );
  }

  if (!article) {
    return <div className="flex justify-center items-center h-screen bg-[#f6faff]">Article not found.</div>;
  }

  return (
    <div className="bg-[#f6faff] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-accent font-semibold text-sm hover:underline mb-6">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to all articles
        </Link>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <img
            src={article.image || DEFAULT_ARTICLE_IMAGE}
            alt={article.title}
            className="h-96 w-full object-cover"
          />
          <div className="p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-primary mb-4">{article.title}</h1>
            <div className="flex items-center text-primary-dark text-sm mb-8 space-x-4">
              {article.author && (
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-2" />
                  <span>By <Link to={`/profile/${article.author._id}`} className="hover:underline">{article.author.name}</Link></span>
                </div>
              )}
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="prose prose-lg max-w-none text-primary-dark leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
              <div>
                {article.tags && article.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    <TagIcon className="h-5 w-5 text-gray-400" />
                    {article.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-semibold">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="inline-flex items-center gap-2 text-gray-500 hover:text-accent"
              >
                <ShareIcon className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>
            {currentUser?._id === article.author?._id && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Link to={`/editor/${article._id}`} className="inline-block px-6 py-3 rounded-full bg-accent text-white font-bold shadow-lg hover:bg-accent-light transition-colors">
                  Edit Article
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 