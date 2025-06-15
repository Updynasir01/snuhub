import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { PencilSquareIcon, NewspaperIcon, UserGroupIcon, ChartBarIcon, ArrowSmRightIcon } from '@heroicons/react/24/outline';

const FEATURES = [
  {
    icon: <PencilSquareIcon className="h-7 w-7 text-accent" />,
    title: 'Powerful Editor',
    desc: 'A beautiful, distraction-free writing experience with AI-powered feedback.',
  },
  {
    icon: <UserGroupIcon className="h-7 w-7 text-accent" />,
    title: 'Collaborative Community',
    desc: 'Connect with other student journalists, share your work, and grow together.',
  },
  {
    icon: <ChartBarIcon className="h-7 w-7 text-accent" />,
    title: 'Track Your Progress',
    desc: 'See your writing stats, milestones, and growth as a journalist.',
  },
  {
    icon: <NewspaperIcon className="h-7 w-7 text-accent" />,
    title: 'Publish with Pride',
    desc: 'Showcase your articles in a professional, student-focused newsroom.',
  },
];

const AVATARS = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
];

const DEFAULT_ARTICLE_IMAGE = 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80';

export default function LandingPage() {
  const { currentUser } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('/api/articles/featured');
        setArticles(response.data);
      } catch (error) {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-[#f6faff]">
      {/* Hero Section */}
      <div className="relative px-4 pt-16 pb-24 flex flex-col items-center text-center bg-[#eaf2fb] overflow-hidden rounded-b-3xl">
        {/* Geometric shapes */}
        <div className="absolute left-0 top-10 w-32 h-32 bg-accent/10 rounded-full -z-10" />
        <div className="absolute right-0 top-32 w-40 h-40 bg-accent/20 rounded-full -z-10" />
        <div className="absolute left-1/2 bottom-0 w-96 h-32 bg-accent/5 rounded-t-full -translate-x-1/2 -z-10" />
        {/* Avatars */}
        <div className="flex justify-center gap-8 mb-8">
          {AVATARS.map((src, idx) => (
            <img key={idx} src={src} alt="Student journalist" className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover" />
          ))}
        </div>
        <h1 className="text-5xl md:text-6xl font-serif font-extrabold mb-4 text-primary tracking-tight">
          Bring impact<br />
          <span className="text-accent">to your journalism.</span>
        </h1>
        <p className="text-lg md:text-xl text-primary-dark mb-8 max-w-2xl mx-auto">
          JournoHub is the digital newsroom for student journalists. Write, publish, and make your mark with a modern, collaborative platform.
        </p>
        {currentUser ? (
          <Link
            to="/dashboard"
            className="inline-block px-8 py-3 rounded-full bg-accent text-white font-bold shadow-lg hover:bg-accent-light transition-colors text-lg"
          >
            Go to Dashboard
          </Link>
        ) : (
          <Link
            to="/login"
            className="inline-block px-8 py-3 rounded-full bg-accent text-white font-bold shadow-lg hover:bg-accent-light transition-colors text-lg"
          >
            Start Writing
          </Link>
        )}
      </div>

      {/* Why JournoHub? */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-accent font-bold text-base uppercase tracking-widest mb-2">Why JournoHub?</h2>
          <p className="text-3xl font-serif font-extrabold text-primary mb-4">A Modern Platform for Student Journalism</p>
          <p className="text-primary-dark max-w-2xl mx-auto">
            Everything you need to write, publish, and grow as a journalist. Designed for students, inspired by the world's best newsrooms.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow p-8 flex flex-col items-center text-center border border-[#eaf2fb] hover:shadow-xl transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="font-serif text-lg font-bold text-primary mb-2">{feature.title}</h3>
              <p className="text-primary-dark text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Articles */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-accent font-bold text-base uppercase tracking-widest mb-2">Showcase</h2>
          <p className="text-3xl font-serif font-extrabold text-primary mb-4">Featured Student Articles</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-3 text-center text-primary-dark">Loading articles...</div>
          ) : articles.length === 0 ? (
            <div className="col-span-3 text-center text-primary-dark">No published articles yet.</div>
          ) : (
            articles.map((article) => (
              <div key={article._id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:scale-105 transition-transform border border-[#eaf2fb]">
                <img src={article.image || DEFAULT_ARTICLE_IMAGE} alt={article.title} className="h-48 w-full object-cover" />
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="inline-block bg-accent/10 text-accent font-bold text-xs px-3 py-1 rounded-full mb-2 w-fit">{article.status || 'Published'}</span>
                    <h3 className="font-serif text-lg font-bold text-primary mb-2">{article.title}</h3>
                    {article.author && (
                      <p className="text-sm text-gray-600">By {article.author.name}</p>
                    )}
                  </div>
                  <Link
                    to={`/articles/${article._id}`}
                    className="mt-4 inline-flex items-center text-accent font-semibold text-sm hover:underline"
                  >
                    Read more
                    <ArrowSmRightIcon className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}