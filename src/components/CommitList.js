import React from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';
import { useCommits } from '../context/CommitContext';
import CommitCard from './CommitCard';

const CommitList = () => {
  const {
    commits,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    stats
  } = useCommits();

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec titre et statistiques */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-100 mb-2">
          Explorez les Commits
        </h2>
        <p className="text-gray-300 mb-6">
          Découvrez les messages de commit les plus drôles et les plus créatifs
        </p>
        
        {/* Statistiques rapides */}
        <div className="flex justify-center space-x-8 mb-8">
          <div className="text-center p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-blue-100">Commits analysés</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-white">{stats.funny}</div>
            <div className="text-sm text-green-100">Commits drôles</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-white">{stats.serious}</div>
            <div className="text-sm text-purple-100">Commits sérieux</div>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="card p-6 shadow-lg rounded-xl border-0 bg-gradient-to-r from-gray-800 to-gray-700">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative group">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder="Rechercher dans les messages, auteurs, emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border-2 border-gray-600 text-gray-100 placeholder-gray-400 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none"
              />
            </div>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-3">
            <div className="relative group">
              <FunnelIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-12 pr-10 py-3 bg-gray-900/50 border-2 border-gray-600 text-gray-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none appearance-none cursor-pointer min-w-[180px]"
              >
                <option value="all">Tous les commits</option>
                <option value="funny">Commits drôles</option>
                <option value="serious">Commits sérieux</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Tri */}
            <div className="flex gap-2">
              <button
                onClick={() => handleSortChange('probability')}
                className={`inline-flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  sortBy === 'probability' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                <span>Probabilité</span>
                {sortBy === 'probability' && (
                  <ArrowsUpDownIcon className="w-4 h-4 ml-2" />
                )}
              </button>
              <button
                onClick={() => handleSortChange('date')}
                className={`inline-flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  sortBy === 'date' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                <span>Date</span>
                {sortBy === 'date' && (
                  <ArrowsUpDownIcon className="w-4 h-4 ml-2" />
                )}
              </button>
              <button
                onClick={() => handleSortChange('votes')}
                className={`inline-flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  sortBy === 'votes' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                <span>Votes</span>
                {sortBy === 'votes' && (
                  <ArrowsUpDownIcon className="w-4 h-4 ml-2" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des commits */}
      <div className="space-y-4">
        {commits.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MagnifyingGlassIcon className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun commit trouvé
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterType !== 'all' 
                ? 'Essayez de modifier vos critères de recherche ou de filtrage.'
                : 'Importez des données de commits pour commencer.'}
            </p>
          </div>
        ) : (
          commits.map((commit) => (
            <CommitCard key={commit.sha} commit={commit} />
          ))
        )}
      </div>

      {/* Pagination ou chargement */}
      {commits.length > 0 && (
        <div className="text-center py-6">
          <p className="text-gray-500">
            Affichage de {commits.length} commit{commits.length > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default CommitList;