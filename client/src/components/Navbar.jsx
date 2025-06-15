import { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '../context/AuthContext';
import { PencilSquareIcon, NewspaperIcon } from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2">
            <NewspaperIcon className="h-8 w-8 text-primary" />
            <Link to="/" className="text-2xl font-serif font-bold text-primary tracking-tight">
              JournoHub
            </Link>
            <span className="ml-2 px-2 py-0.5 rounded bg-accent-light text-xs font-semibold text-accent uppercase hidden sm:inline">Student Edition</span>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="font-medium hover:text-accent transition-colors">Home</Link>
            <Link to="/about" className="font-medium hover:text-accent transition-colors">About</Link>
            {currentUser && (
              <Link to="/dashboard" className="font-medium hover:text-accent transition-colors">Dashboard</Link>
            )}
            {currentUser && (
              <Link to="/write" className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-primary text-white font-semibold hover:bg-primary-light transition-colors">
                <PencilSquareIcon className="h-5 w-5" /> Write
              </Link>
            )}
            {currentUser && currentUser.role === 'admin' && (
              <Link to="/admin" className="font-medium hover:text-accent transition-colors">Admin</Link>
            )}
          </div>

          {/* Profile/Sign In */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <Menu as="div" className="relative">
                <div>
                  <Menu.Button className="flex items-center rounded-full bg-primary text-white w-10 h-10 justify-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-accent">
                    {currentUser.email?.[0]?.toUpperCase()}
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block w-full px-4 py-2 text-left text-sm text-primary-dark'
                          )}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-1.5 rounded bg text-blue-500 font-semibold hover:border-2 hover:border-blue-500 transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 