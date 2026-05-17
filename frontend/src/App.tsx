import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Discover from './pages/Discover';
import Search from './pages/Search';
import Recommendations from './pages/Recommendations';
import UniversityDetail from './pages/UniversityDetail';
import Profile from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-slate-950">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Navigate to="/discover" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/search" element={<Search />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/universities/:id" element={<UniversityDetail />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/discover" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
