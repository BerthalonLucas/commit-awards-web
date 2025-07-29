import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  StarIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  HeartIcon,
  EnvelopeIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid
} from '@heroicons/react/24/solid';
import { useCommits } from '../context/CommitContext';

const CommitCard = ({ commit }) => {
  const { toggleFavorite, voteForCommit } = useCommits();

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    try {
      return format(new Date(dateString), 'dd MMM yyyy à HH:mm', { locale: fr });
    } catch {
      return 'Date invalide';
    }
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 0.7) return 'bg-funny-500';
    if (probability >= 0.5) return 'bg-funny-400';
    if (probability >= 0.3) return 'bg-yellow-400';
    return 'bg-gray-300';
  };

  const getProbabilityLabel = (probability) => {
    if (probability >= 0.8) return 'Très drôle';
    if (probability >= 0.6) return 'Drôle';
    if (probability >= 0.4) return 'Amusant';
    if (probability >= 0.2) return 'Peu drôle';
    return 'Sérieux';
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-500/50">
      {/* En-tête avec probabilité et actions */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          {/* Probabilité d'humour */}
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-300">
                Niveau d'humour:
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                commit.is_funny 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900' 
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-200'
              }`}>
                {getProbabilityLabel(commit.probability)}
              </span>
            </div>
            <div className="text-sm font-semibold text-blue-400">
              {(commit.probability * 100).toFixed(1)}%
            </div>
          </div>
          
          {/* Barre de probabilité */}
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4 shadow-inner">
            <div
              className={`h-3 rounded-full transition-all duration-500 shadow-sm ${
                commit.probability >= 0.7 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                commit.probability >= 0.5 ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                commit.probability >= 0.3 ? 'bg-gradient-to-r from-yellow-300 to-yellow-400' :
                'bg-gradient-to-r from-gray-500 to-gray-600'
              }`}
              style={{ width: `${commit.probability * 100}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 ml-4">
          {/* Favoris */}
          <button
            onClick={() => toggleFavorite(commit.sha)}
            className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 ${
              commit.isFavorite
                ? 'text-red-400 bg-red-900/30 hover:bg-red-900/50 shadow-lg'
                : 'text-gray-400 hover:text-red-400 hover:bg-red-900/20'
            }`}
            title={commit.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            {commit.isFavorite ? (
              <HeartIconSolid className="w-5 h-5" />
            ) : (
              <HeartIcon className="w-5 h-5" />
            )}
          </button>

          {/* Votes */}
          <div className="flex items-center space-x-2 bg-gray-700/50 rounded-lg px-3 py-2">
            <button
              onClick={() => voteForCommit(commit.sha, 1)}
              className="p-1 rounded text-gray-400 hover:text-green-400 hover:bg-green-900/20 transition-all duration-200 transform hover:scale-110"
              title="Voter positivement"
            >
              <HandThumbUpIcon className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-gray-200 min-w-[2rem] text-center">
              {commit.userVotes || 0}
            </span>
            <button
              onClick={() => voteForCommit(commit.sha, -1)}
              className="p-1 rounded text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-all duration-200 transform hover:scale-110"
              title="Voter négativement"
            >
              <HandThumbDownIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Message du commit */}
      <div className="mb-6">
        <div className="bg-gray-700/30 rounded-lg p-4 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-100 leading-relaxed">
            "{commit.message}"
          </h3>
        </div>
      </div>

      {/* Informations sur l'auteur et le commit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        {/* Auteur */}
        {commit.author && (
          <div className="bg-gray-700/20 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-gray-200 mb-2">Auteur</h4>
            <div className="flex items-center space-x-2">
              <UserIcon className="w-4 h-4 text-blue-400" />
              <span className="font-medium text-gray-300">{commit.author.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <EnvelopeIcon className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400">{commit.author.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400">{formatDate(commit.author.date)}</span>
            </div>
          </div>
        )}

        {/* Informations techniques */}
        <div className="bg-gray-700/20 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-gray-200 mb-2">Détails techniques</h4>
          <div className="flex items-center space-x-2">
            <CodeBracketIcon className="w-4 h-4 text-blue-400" />
            <span className="font-mono text-xs bg-gray-600 text-gray-200 px-3 py-1 rounded-md">
              {commit.sha?.substring(0, 8)}
            </span>
          </div>
          {commit.repo && (
            <>
              <div className="text-xs text-gray-400">
                <span className="font-medium text-gray-300">Organisation:</span> {commit.repo.org}
              </div>
              <div className="text-xs text-gray-400">
                <span className="font-medium text-gray-300">Dépôt:</span> {commit.repo.name}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Badge drôle */}
      {commit.is_funny && (
        <div className="mt-6 flex justify-end">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-lg">
            😄 Commit drôle
          </span>
        </div>
      )}
    </div>
  );
};

export default CommitCard;