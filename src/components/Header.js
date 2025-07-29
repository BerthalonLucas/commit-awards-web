import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  TrophyIcon, 
  ArrowUpTrayIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useCommits } from '../context/CommitContext';

const Header = () => {
  const location = useLocation();
  const { stats } = useCommits();

  const navigation = [
    { name: 'Accueil', href: '/', icon: HomeIcon },
    { name: 'Awards', href: '/awards', icon: TrophyIcon },
    { name: 'Importer', href: '/import', icon: ArrowUpTrayIcon },
  ];

  return (
    <header className="shadow-lg border-b bg-gray-800 border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo et titre */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Commit Awards</h1>
              <p className="text-sm text-gray-400">Explorez les commits les plus drôles</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 shadow-sm'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Statistiques */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="text-center">
              <div className="font-bold text-white">{stats.total}</div>
              <div className="text-gray-400">Total</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-funny-600">{stats.funny}</div>
              <div className="text-gray-400">Drôles</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-primary-600">{stats.favorites}</div>
              <div className="text-gray-400">Favoris</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;