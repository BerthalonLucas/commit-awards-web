import React, { createContext, useContext, useState, useEffect } from 'react';

const CommitContext = createContext();

export const useCommits = () => {
  const context = useContext(CommitContext);
  if (!context) {
    throw new Error('useCommits must be used within a CommitProvider');
  }
  return context;
};

export const CommitProvider = ({ children }) => {
  const [commits, setCommits] = useState([]);
  const [detailedCommits, setDetailedCommits] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [votes, setVotes] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'funny', 'serious'
  const [sortBy, setSortBy] = useState('probability'); // 'probability', 'date', 'votes'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('commitFavorites');
    const savedVotes = localStorage.getItem('commitVotes');
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    if (savedVotes) {
      setVotes(JSON.parse(savedVotes));
    }

    // Forcer le mode sombre au démarrage
    document.body.classList.add('dark');
    document.documentElement.classList.add('dark');
  }, []);

  // Sauvegarder les favoris dans localStorage
  useEffect(() => {
    localStorage.setItem('commitFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Sauvegarder les votes dans localStorage
  useEffect(() => {
    localStorage.setItem('commitVotes', JSON.stringify(votes));
  }, [votes]);

  // Extraire le nom d'utilisateur depuis le nom du repo
  const extractUsername = (repoName) => {
    if (!repoName) return null;
    // Extraire tout ce qui est avant "_c"
    const match = repoName.match(/^([^_]+)_c/);
    return match ? match[1] : null;
  };

  // Fusionner les données des commits avec les détails
  const mergedCommits = commits.map(commit => {
    const details = detailedCommits.find(d => d.sha === commit.sha);
    const mergedCommit = {
      ...commit,
      ...details,
      isFavorite: favorites.includes(commit.sha),
      userVotes: votes[commit.sha] || 0
    };

    // Si on a des détails d'auteur mais pas de nom d'utilisateur extrait, on l'extrait
    if (details && details.repo && !mergedCommit.username) {
      mergedCommit.username = extractUsername(details.repo.name);
    }

    return mergedCommit;
  });

  // Filtrer les commits
  const filteredCommits = mergedCommits.filter(commit => {
    const matchesSearch = commit.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (commit.author?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (commit.username || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'funny' && commit.is_funny) ||
                         (filterType === 'serious' && !commit.is_funny);
    
    return matchesSearch && matchesFilter;
  });

  // Trier les commits
  const sortedCommits = [...filteredCommits].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'probability':
        aValue = a.probability || 0;
        bValue = b.probability || 0;
        break;
      case 'date':
        aValue = new Date(a.author?.date || 0);
        bValue = new Date(b.author?.date || 0);
        break;
      case 'votes':
        aValue = a.userVotes || 0;
        bValue = b.userVotes || 0;
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const toggleFavorite = (sha) => {
    setFavorites(prev => 
      prev.includes(sha) 
        ? prev.filter(id => id !== sha)
        : [...prev, sha]
    );
  };

  const voteForCommit = (sha, vote) => {
    setVotes(prev => ({
      ...prev,
      [sha]: (prev[sha] || 0) + vote
    }));
  };



  const value = {
    commits: sortedCommits,
    favorites,
    votes,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,

    toggleFavorite,
    voteForCommit,
    setCommits,
    setDetailedCommits,
    stats: {
      total: commits.length,
      funny: commits.filter(c => c.is_funny).length,
      serious: commits.filter(c => !c.is_funny).length,
      favorites: favorites.length
    }
  };

  return (
    <CommitContext.Provider value={value}>
      {children}
    </CommitContext.Provider>
  );
};