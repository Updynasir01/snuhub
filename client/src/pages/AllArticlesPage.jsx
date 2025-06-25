import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const DEFAULT_ARTICLE_IMAGE = 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80';

export default function AllArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/articles/public');
        setArticles(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch articles.');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const categorizedArticles = articles.reduce((acc, article) => {
    const category = article.tags && article.tags.length > 0 ? article.tags[0] : 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(article);
    return acc;
  }, {});

  // Helper to get the first line or snippet from HTML content
  function getExcerpt(html) {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.split('\n')[0].slice(0, 120) + (text.length > 120 ? '...' : '');
  }

  if (loading) {
    return <div className="text-center py-20">Loading articles...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-[#f6faff] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-extrabold text-primary mb-10 text-center">All Articles</h1>
        {Object.keys(categorizedArticles).length === 0 ? (
          <p className="text-center text-primary-dark">No articles found.</p>
        ) : (
          Object.entries(categorizedArticles).map(([category, articlesInCategory]) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold text-accent mb-6 capitalize border-b-2 border-accent/20 pb-2">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articlesInCategory.map((article) => (
                  <div key={article._id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:scale-105 transition-transform border border-[#eaf2fb]">
                    <Link to={`/articles/${article._id}`} className="block">
                      <img src={article.image || DEFAULT_ARTICLE_IMAGE} alt={article.title} className="h-48 w-full object-cover" />
                    </Link>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="inline-block bg-accent/10 text-accent font-bold text-xs px-3 py-1 rounded-full mb-2 w-fit">{article.status || 'Published'}</span>
                        <Link to={`/articles/${article._id}`} className="block">
                            <h3 className="font-serif text-lg font-bold text-primary mb-2 hover:text-accent transition-colors">{article.title}</h3>
                            <p className="text-primary-dark text-sm mb-2">{getExcerpt(article.content)}</p>
                        </Link>
                        {article.author && (
                          <div className="flex items-center gap-2 mt-2">
                            {article.author.profilePicture && (
                              <Link to={`/profile/${article.author._id}`}>
                                <img
                                  src={article.author.profilePicture}
                                  alt={article.author.name}
                                  className="h-6 w-6 rounded-full object-cover border"
                                />
                              </Link>
                            )}
                            <Link to={`/profile/${article.author._id}`} className="hover:underline">
                              By {article.author.name}
                            </Link>
                          </div>
                        )}
                      </div>
                      <Link
                        to={`/articles/${article._id}`}
                        className="mt-4 inline-flex items-center text-accent font-semibold text-sm hover:underline"
                      >
                        Read more
                        <ArrowRightIcon className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 