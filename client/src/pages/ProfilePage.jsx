import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRightIcon, AcademicCapIcon, BriefcaseIcon, StarIcon } from '@heroicons/react/24/solid';

const DEFAULT_PROFILE_IMAGE = 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=200&q=80';
const DEFAULT_ARTICLE_IMAGE = 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80';

export default function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/users/profile/${id}`);
        setProfile(res.data);
      } catch (err) {
        setError('Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  // Helper to get the first line or snippet from HTML content
  function getExcerpt(html) {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.split('\n')[0].slice(0, 120) + (text.length > 120 ? '...' : '');
  }

  if (loading) return <div className="text-center py-20">Loading profile...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!profile) return <div className="text-center py-20">Profile not found.</div>;

  const { user, articles } = profile;

  return (
    <div className="bg-[#f6faff] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 flex flex-col md:flex-row items-center gap-8">
          <img
            src={user.profilePicture || DEFAULT_PROFILE_IMAGE}
            alt={user.name}
            className="h-32 w-32 rounded-full object-cover border-4 border-accent"
          />
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-serif font-extrabold text-primary">{user.name}</h1>
            <p className="text-primary-dark mt-2">{user.bio}</p>
            <div className="flex justify-center md:justify-start gap-4 mt-4 text-sm text-gray-600">
              {user.faculty && <div className="flex items-center"><AcademicCapIcon className="h-5 w-5 mr-1.5 text-accent" /> {user.faculty}</div>}
              {user.year && <div className="flex items-center"><BriefcaseIcon className="h-5 w-5 mr-1.5 text-accent" /> {user.year}</div>}
            </div>
          </div>
        </div>

        {user.awards && user.awards.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-accent mb-6">Awards & Recognitions</h2>
            <div className="space-y-4">
              {user.awards.map((award, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow">
                  <h3 className="font-bold text-lg text-primary">{award.title} ({award.year})</h3>
                  <p className="text-sm text-gray-600">{award.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <h2 className="text-2xl font-bold text-accent mb-6">Published Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div key={article._id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:scale-105 transition-transform">
                <Link to={`/articles/${article._id}`}>
                  <img src={article.image || DEFAULT_ARTICLE_IMAGE} alt={article.title} className="h-48 w-full object-cover" />
                </Link>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mt-2">
                      {article.author && article.author.profilePicture && (
                        <Link to={`/profile/${article.author._id}`}>
                          <img
                            src={article.author.profilePicture}
                            alt={article.author.name}
                            className="h-6 w-6 rounded-full object-cover border"
                          />
                        </Link>
                      )}
                      <Link to={`/profile/${article.author._id}`} className="hover:underline">
                        By {article.author && article.author.name}
                      </Link>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-primary mb-2">{article.title}</h3>
                    <p className="text-primary-dark text-sm mb-2">{getExcerpt(article.content)}</p>
                  </div>
                  <Link to={`/articles/${article._id}`} className="mt-4 inline-flex items-center text-accent font-semibold text-sm hover:underline">
                    Read more <ArrowRightIcon className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 