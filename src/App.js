import './App.css';
import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router';
import { getLocalStorage } from "./utils/local.js";
import LoginPage from './login/LoginPage.js';
import Dashboard from './home/Dashboard.js';
import DashLayout from './components/DashLayout.js';
import Students from './home/Students.js';
import Vaccines from './home/Vaccines.js';
import Reports from './home/Reports.js';
import PageLoader from './components/PageLoader.js';
import SnackbarAlerts from './components/SnackbarAlerts.js';

function App() {
  let navigate = useNavigate();

  useEffect(() => {
    const token = getLocalStorage("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
    <PageLoader />
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<DashLayout/>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/vaccines" element={<Vaccines />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
    <SnackbarAlerts />
    </>
  );
}

export default App;
