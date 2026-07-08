import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ManagementLayout } from './components/ManagementLayout';
import { JobRouteManager } from './components/JobRouteManager';
import { GlobalLoading } from './components/GlobalLoading';

// Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { CandidateApplicationsPage } from './pages/CandidateApplicationsPage';
import { EmployerDashboardPage } from './pages/EmployerDashboardPage';
import { EmployerJobsPage } from './pages/EmployerJobsPage';
import { CreateJobPage } from './pages/CreateJobPage';
import { EditJobPage } from './pages/EditJobPage';
import { JobApplicationsPage } from './pages/JobApplicationsPage';
import { NotFound } from './pages/NotFound';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Main Layout routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<JobRouteManager />} />
            <Route path="/jobs" element={<Navigate to="/" replace />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute allowedRoles={['CANDIDATE']} />}>
              <Route path="/applications" element={<CandidateApplicationsPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['EMPLOYER', 'ADMIN']} />}>
              <Route path="/employer" element={<ManagementLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<EmployerDashboardPage />} />
                <Route path="jobs" element={<EmployerJobsPage />} />
                <Route path="jobs/create" element={<CreateJobPage />} />
                <Route path="jobs/:id/edit" element={<EditJobPage />} />
                <Route path="jobs/:id/applications" element={<JobApplicationsPage />} />
              </Route>
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin" element={<ManagementLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<EmployerDashboardPage />} />
                <Route path="jobs" element={<EmployerJobsPage />} />
                <Route path="jobs/create" element={<CreateJobPage />} />
                <Route path="jobs/:id/edit" element={<EditJobPage />} />
                <Route path="jobs/:id/applications" element={<JobApplicationsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
      <GlobalLoading />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </AuthProvider>
  );
}

export default App;
