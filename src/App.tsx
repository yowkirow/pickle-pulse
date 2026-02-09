import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { TournamentManager } from './pages/TournamentManager';
import { RefereeMode } from './pages/RefereeMode';
import { CourtManager } from './pages/CourtManager';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/admin" replace />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/courts" element={<CourtManager />} />
          <Route path="tournaments" element={<TournamentManager />} />
          <Route path="referee" element={<RefereeMode />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
