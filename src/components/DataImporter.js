import React, { useState, useRef } from 'react';
import { 
  CloudArrowUpIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useCommits } from '../context/CommitContext';

const DataImporter = () => {
  const { setCommits, setDetailedCommits } = useCommits();
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [importedData, setImportedData] = useState({
    commits: null,
    authors: null
  });

  const commitsInputRef = useRef(null);
  const authorsInputRef = useRef(null);

  // Fonction pour extraire le nom d'utilisateur du nom du repo
  const extractUsername = (repoName) => {
    if (!repoName) return '';
    
    // Extraire tout ce qui se trouve avant "_c"
    const parts = repoName.split('_c');
    const username = parts[0] || '';
    
    // Nettoyer le nom d'utilisateur (enlever les espaces et caractères indésirables)
    return username.trim();
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0], type);
    }
  };

  const handleFileInput = (e, type) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0], type);
    }
  };

  const handleFile = async (file, type) => {
    if (!file.name.endsWith('.json')) {
      setStatus({
        type: 'error',
        message: 'Veuillez sélectionner un fichier JSON valide.'
      });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!Array.isArray(data)) {
        throw new Error('Le fichier JSON doit contenir un tableau.');
      }

      if (type === 'commits') {
        // Validation des commits
        const isValidCommits = data.every(item => 
          item.hasOwnProperty('sha') && 
          item.hasOwnProperty('message') && 
          item.hasOwnProperty('probability') &&
          item.hasOwnProperty('is_funny')
        );

        if (!isValidCommits) {
          throw new Error('Format de commits invalide. Chaque commit doit avoir: sha, message, probability, is_funny');
        }

        // Enrichir les commits avec des propriétés pour l'interface
        const enrichedCommits = data.map(commit => ({
          ...commit,
          isFavorite: false,
          userVotes: 0
        }));

        setImportedData(prev => ({ ...prev, commits: enrichedCommits }));
        setStatus({
          type: 'success',
          message: `${data.length} commits importés avec succès!`
        });

      } else if (type === 'authors') {
        // Validation des auteurs
        const isValidAuthors = data.every(item => 
          item.hasOwnProperty('sha') && 
          item.hasOwnProperty('author') &&
          item.hasOwnProperty('repo')
        );

        if (!isValidAuthors) {
          throw new Error('Format d\'auteurs invalide. Chaque entrée doit avoir: sha, author, repo');
        }

        // Traiter les données d'auteurs pour extraire les vrais noms d'utilisateur
        const processedAuthors = data.map(authorData => {
          const username = extractUsername(authorData.repo?.name);
          
          return {
            ...authorData,
            author: {
              ...authorData.author,
              name: username || authorData.author.name // Remplacer par le login extrait, ou garder l'original si extraction échoue
            },
            extractedUsername: username // Garder aussi le nom extrait séparément pour référence
          };
        });

        setImportedData(prev => ({ ...prev, authors: processedAuthors }));
        setStatus({
          type: 'success',
          message: `${data.length} informations d'auteurs importées avec succès! Noms d'utilisateur extraits automatiquement.`
        });
      }

    } catch (error) {
      setStatus({
        type: 'error',
        message: `Erreur lors de l'importation: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const mergeAndApplyData = () => {
    if (!importedData.commits) {
      setStatus({
        type: 'error',
        message: 'Veuillez d\'abord importer les données de commits.'
      });
      return;
    }

    setLoading(true);

    try {
      let finalCommits = [...importedData.commits];

      // Fusionner avec les données d'auteurs si disponibles
      if (importedData.authors) {
        const authorsMap = new Map(
          importedData.authors.map(author => [author.sha, author])
        );

        finalCommits = finalCommits.map(commit => {
          const authorData = authorsMap.get(commit.sha);
          if (authorData) {
            return {
              ...commit,
              author: authorData.author, // Le nom d'utilisateur est déjà traité
              committer: authorData.committer,
              repo: authorData.repo,
              username: authorData.extractedUsername || authorData.author.name // Utiliser le nom extrait
            };
          }
          return commit;
        });

        setDetailedCommits(importedData.authors);
      }

      setCommits(finalCommits);
      setStatus({
        type: 'success',
        message: `Application réussie! ${finalCommits.length} commits sont maintenant disponibles.`
      });

      // Réinitialiser les données importées
      setTimeout(() => {
        setImportedData({ commits: null, authors: null });
      }, 2000);

    } catch (error) {
      setStatus({
        type: 'error',
        message: `Erreur lors de l'application des données: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const StatusMessage = ({ type, message }) => {
    if (!message) return null;

    const styles = {
      success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700/50 dark:text-green-300',
      error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700/50 dark:text-red-300',
      info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700/50 dark:text-blue-300'
    };

    const icons = {
      success: CheckCircleIcon,
      error: ExclamationTriangleIcon,
      info: InformationCircleIcon
    };

    const Icon = icons[type];

    return (
      <div className={`border rounded-lg p-4 ${styles[type]}`}>
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5" />
          <span>{message}</span>
        </div>
      </div>
    );
  };

  const FileDropZone = ({ type, title, description, inputRef, accept = ".json" }) => (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
        dragActive 
          ? 'border-blue-400 bg-blue-50/10 dark:border-blue-500 dark:bg-blue-900/20 scale-105' 
          : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500 hover:shadow-lg'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={(e) => handleDrop(e, type)}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFileInput(e, type)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg">
            <CloudArrowUpIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            {title}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            {description}
          </p>
          
          <button
            type="button"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            onClick={() => inputRef.current?.click()}
          >
            <CloudArrowUpIcon className="w-5 h-5 mr-2" />
            Choisir un fichier
          </button>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            ou glissez-déposez votre fichier JSON ici
          </p>
        </div>
      </div>
      
      {importedData[type] && (
        <div className="absolute top-4 right-4">
          <div className="p-2 bg-green-500 rounded-full shadow-lg">
            <CheckCircleIcon className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* En-tête */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full">
            <DocumentTextIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Importer des Données
        </h2>
        <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Importez vos fichiers JSON contenant les commits humoristiques et les informations des auteurs 
          pour commencer à explorer et récompenser les meilleurs commits.
        </p>
      </div>

      {/* Instructions */}
      <div className="card p-6 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700/50">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
          Instructions d'importation
        </h3>
        <div className="space-y-2 text-blue-800 dark:text-blue-300">
          <p>1. <strong>Commits humoristiques :</strong> Fichier JSON contenant les commits avec leurs probabilités d'humour</p>
          <p>2. <strong>Informations auteurs :</strong> Fichier JSON optionnel avec les détails des auteurs et dépôts</p>
          <p>3. <strong>Extraction automatique :</strong> Les vrais noms d'utilisateur sont automatiquement extraits du champ <code>repo.name</code></p>
          <p>4. Cliquez sur "Appliquer les données" une fois les fichiers importés</p>
        </div>
      </div>

      {/* Zones de drop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FileDropZone
          type="commits"
          title="Commits Humoristiques"
          description="Fichier JSON contenant les commits avec probabilités (requis)"
          inputRef={commitsInputRef}
        />
        
        <FileDropZone
          type="authors"
          title="Informations Auteurs"
          description="Fichier JSON avec les détails des auteurs (optionnel)"
          inputRef={authorsInputRef}
        />
      </div>

      {/* Statut */}
      <StatusMessage type={status.type} message={status.message} />

      {/* Résumé des données importées */}
      {(importedData.commits || importedData.authors) && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Données importées
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Commits</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {importedData.commits ? importedData.commits.length : 0}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Auteurs</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {importedData.authors ? importedData.authors.length : 0}
              </span>
            </div>
          </div>

          <button
            onClick={mergeAndApplyData}
            disabled={loading || !importedData.commits}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Application en cours...' : 'Appliquer les données'}
          </button>
        </div>
      )}

      {/* Exemples de format */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Formats JSON attendus
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Commits humoristiques
            </h4>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm overflow-x-auto text-gray-800 dark:text-gray-200">
{`[
  {
    "sha": "78b545ce7f32d2435e9f1c15d41da9404582cb16",
    "is_funny": false,
    "message": "k",
    "probability": 0.02181917428970337
  }
]`}
            </pre>
          </div>
          
          <div className="card p-6">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Informations auteurs
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-400 mb-3">
              Le nom d'utilisateur sera automatiquement extrait de <code>repo.name</code> (avant "_c")
            </p>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm overflow-x-auto text-gray-800 dark:text-gray-200">
{`[
  {
    "sha": "c8a64cd03c404e9260612ef51cfe5a5e82ab71fe",
    "repo": {
      "org": "exam-2025-07-11",
      "name": "xwenger_c-piscine-exam-00_exam_17h24m53s"
    },
    "author": {
      "name": "Exam 42",
      "email": "exam-no-reply@42.fr",
      "date": "2025-07-11T17:59:36+02:00"
    }
  }
]

// Résultat après traitement :
// author.name sera remplacé par "xwenger"`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataImporter;