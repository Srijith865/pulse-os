import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Layout from './Layout';
import PulseBrief from './PulseBrief';
import PulseDecide from './PulseDecide';
import PulseSearch from './PulseSearch';
import PulseDocs from './PulseDocs';
import Login from './Login';

function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-[32px] text-primary">sync</span>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/brief" replace />} />
        <Route path="brief" element={<PulseBrief />} />
        <Route path="decide" element={<PulseDecide />} />
        <Route path="search" element={<PulseSearch />} />
        <Route path="docs" element={<PulseDocs />} />
      </Route>
    </Routes>
  );
}

export default App;
