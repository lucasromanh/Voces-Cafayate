import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ProfessionalDashboard from './pages/professional/Dashboard';
import FamilyPortal from './pages/family/Portal';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={
            user?.rol?.toUpperCase() === 'ADMIN' ? '/admin' :
              user?.rol?.toUpperCase() === 'PROFESIONAL' ? '/profesional' : '/familia'
          } replace />} />

          {/* Protected Routes */}
          <Route path="/admin/*" element={isAuthenticated && user?.rol?.toUpperCase() === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/login" replace />} />
          <Route path="/profesional/*" element={isAuthenticated && user?.rol?.toUpperCase() === 'PROFESIONAL' ? <ProfessionalDashboard /> : <Navigate to="/login" replace />} />
          <Route path="/familia/*" element={isAuthenticated && user?.rol?.toUpperCase() === 'PACIENTE_TUTOR' ? <FamilyPortal /> : <Navigate to="/login" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
