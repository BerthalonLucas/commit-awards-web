import React from 'react';
import { 
  TrophyIcon,
  StarIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useCommits } from '../context/CommitContext';
import CommitCard from './CommitCard';

const CommitAwards = () => {
  const { commits } = useCommits();

  // Commits favoris
  const favoriteCommits = commits.filter(commit => commit.isFavorite);

  // Top commits par probabilité
  const topFunnyCommits = commits
    .filter(commit => commit.is_funny)
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 10);

  // Top commits par votes
  const topVotedCommits = commits
    .filter(commit => commit.userVotes > 0)
    .sort((a, b) => b.userVotes - a.userVotes)
    .slice(0, 10);

  const categories = [
    {
      title: 'Vos Favoris',
      description: 'Les commits que vous avez marqués comme favoris',
      icon: StarIcon,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/20',
      borderColor: 'border-yellow-500/30',
      commits: favoriteCommits,
      emptyMessage: 'Aucun commit favori. Ajoutez des commits à vos favoris depuis la page principale.'
    },
    {
      title: 'Top Drôles',
      description: 'Les commits avec la plus haute probabilité d\'humour',
      icon: FireIcon,
      color: 'text-red-400',
      bgColor: 'bg-red-900/20',
      borderColor: 'border-red-500/30',
      commits: topFunnyCommits,
      emptyMessage: 'Aucun commit drôle trouvé.'
    },
    {
      title: 'Plus Votés',
      description: 'Les commits avec le plus de votes positifs',
      icon: TrophyIcon,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-500/30',
      commits: topVotedCommits,
      emptyMessage: 'Aucun commit voté. Votez pour vos commits préférés!'
    }
  ];

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full">
            <TrophyIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-100 mb-2">
          Commit Awards
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Découvrez les commits les plus drôles, les plus votés et vos favoris. 
          Une sélection des meilleurs moments d'humour dans le code.
        </p>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">
            {favoriteCommits.length}
          </div>
          <div className="text-gray-300">Favoris</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-red-400 mb-2">
            {topFunnyCommits.length}
          </div>
          <div className="text-gray-300">Commits drôles</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {topVotedCommits.length}
          </div>
          <div className="text-gray-300">Commits votés</div>
        </div>
      </div>

      {/* Catégories d'awards */}
      {categories.map((category, index) => {
        const Icon = category.icon;
        
        return (
          <div key={index} className="space-y-4">
            {/* En-tête de catégorie */}
            <div className={`card p-6 ${category.bgColor} border-2 ${category.borderColor}`}>
              <div className="flex items-center space-x-3">
                <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gray-700 shadow-sm`}>
                  <Icon className={`w-6 h-6 ${category.color}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-100">
                    {category.title}
                  </h3>
                  <p className="text-gray-300">
                    {category.description}
                  </p>
                </div>
                <div className="ml-auto">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-200`}>
                    {category.commits.length} commit{category.commits.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Liste des commits */}
            <div className="space-y-4">
              {category.commits.length === 0 ? (
                <div className="card p-8 text-center">
                  <div className="text-gray-500 mb-4">
                    <Icon className="w-12 h-12 mx-auto" />
                  </div>
                  <p className="text-gray-400">
                    {category.emptyMessage}
                  </p>
                </div>
              ) : (
                category.commits.map((commit, commitIndex) => (
                  <div key={commit.sha} className="relative">
                    {/* Badge de position pour les tops */}
                    {(category.title.includes('Top') || category.title.includes('Plus')) && commitIndex < 3 && (
                      <div className="absolute -left-2 -top-2 z-10">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold ${
                          commitIndex === 0 ? 'bg-yellow-500' :
                          commitIndex === 1 ? 'bg-gray-400' :
                          'bg-yellow-600'
                        }`}>
                          {commitIndex + 1}
                        </div>
                      </div>
                    )}
                    <CommitCard commit={commit} />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}

      {/* Message d'encouragement */}
      {commits.length === 0 && (
        <div className="card p-12 text-center">
          <div className="text-gray-500 mb-6">
            <TrophyIcon className="w-20 h-20 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-100 mb-4">
            Aucune donnée disponible
          </h3>
          <p className="text-gray-400 mb-6">
            Importez des données de commits pour voir les awards et commencer à voter pour vos favoris.
          </p>
          <a
            href="/import"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>Importer des données</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default CommitAwards;