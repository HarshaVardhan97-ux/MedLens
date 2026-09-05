import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PatientProvider } from './context/PatientContext';
import { AppRoutes } from './router/AppRoutes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PatientProvider>
          <AppRoutes />
        </PatientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
