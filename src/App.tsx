import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoutes';
import RouteLoadingFallback from './components/RouteLoadingFallback';

const Dashboard = lazy(() => import('./components/Dashboard'));
const Inventory = lazy(() => import('./components/Inventory'));
const InventoryLayout = lazy(() => import('./Layouts/InventoryLayout'));



function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} /> 
      <Route element={<ProtectedRoute />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <InventoryLayout />
            </Suspense>
          }
          
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<RouteLoadingFallback />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="/inventory"
            element={
              <Suspense fallback={<RouteLoadingFallback />}>
                <Inventory />
              </Suspense>
            }
          />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
