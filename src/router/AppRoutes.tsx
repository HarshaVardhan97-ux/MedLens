import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';
import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';
import { EncounterOverview } from '../pages/EncounterOverview';
import { PatientDetails } from '../pages/PatientDetails';
import { DiagnosticLabs } from '../pages/DiagnosticLabs';
import { ImagingRadiology } from '../pages/ImagingRadiology';
import { AiInsights } from '../pages/AiInsights';
import { ClinicalNotes } from '../pages/ClinicalNotes';
import { useAuth } from '../context/AuthContext';

// Protected Route wrapper component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<SignIn />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/sign-up" element={<SignUp />} />

      {/* Protected Clinical Workspace Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<EncounterOverview />} />
        <Route path="clinical-dashboard" element={<EncounterOverview />} />
        <Route path="patient" element={<PatientDetails />} />
        <Route path="patient-details" element={<PatientDetails />} />
        <Route path="diagnostic-labs" element={<DiagnosticLabs />} />
        <Route path="imaging-radiology" element={<ImagingRadiology />} />
        <Route path="ai-insights" element={<AiInsights />} />
        <Route path="ai-differential" element={<AiInsights />} />
        <Route path="clinical-notes" element={<ClinicalNotes />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
