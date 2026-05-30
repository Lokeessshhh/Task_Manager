import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Board from './pages/Board';

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1814',
            color: '#fff',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.875rem',
            borderRadius: '8px',
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/board" 
          element={
            <ProtectedRoute>
              <Board />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/board" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
