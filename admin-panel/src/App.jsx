import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { LocationsModuleProvider } from './context/LocationsModuleContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import LoginPage from './pages/LoginPage';
import PropertiesPage from './pages/PropertiesPage';
import LocationsLayout from './pages/locations/LocationsLayout';
import LocationStatesPage from './pages/locations/LocationStatesPage';
import LocationCitiesPage from './pages/locations/LocationCitiesPage';
import LocationLocalitiesPage from './pages/locations/LocationLocalitiesPage';
import PlansPage from './pages/PlansPage';
import BrokersPage from './pages/BrokersPage';

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/properties" replace />} />
            <Route path="properties" element={<PropertiesPage />} />
            <Route path="brokers" element={<BrokersPage />} />
            <Route
              path="locations"
              element={
                <LocationsModuleProvider>
                  <LocationsLayout />
                </LocationsModuleProvider>
              }
            >
              <Route index element={<Navigate to="states" replace />} />
              <Route path="states" element={<LocationStatesPage />} />
              <Route path="cities" element={<LocationCitiesPage />} />
              <Route path="localities" element={<LocationLocalitiesPage />} />
            </Route>
            <Route path="plans" element={<PlansPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
