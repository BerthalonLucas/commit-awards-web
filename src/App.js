import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CommitList from './components/CommitList';
import CommitAwards from './components/CommitAwards';
import DataImporter from './components/DataImporter';
import { CommitProvider } from './context/CommitContext';

function AppContent() {
  useEffect(() => {
    // Forcer le mode sombre
    document.body.classList.add('dark');
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<CommitList />} />
          <Route path="/awards" element={<CommitAwards />} />
          <Route path="/import" element={<DataImporter />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <CommitProvider>
      <Router>
        <AppContent />
      </Router>
    </CommitProvider>
  );
}

export default App;