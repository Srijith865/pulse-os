import { useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) {
          navigate('/app/brief');
        } else {
          setError('Registration successful. If you cannot log in, please ensure "Confirm email" is disabled in Supabase, or check your email.');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session) {
          navigate('/app/brief');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-on-background font-body-md text-body-md antialiased flex items-center justify-center p-md relative overflow-hidden dot-grid">

      {/* Ambient blobs */}
      <div className="gradient-blob" style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)', top: '-200px', right: '-100px' }} />
      <div className="gradient-blob" style={{ background: 'linear-gradient(135deg, #f59e0b, #ec4899)', bottom: '-300px', left: '-200px', animationDelay: '-10s' }} />

      <div className="w-full max-w-md relative z-10 stagger-children">

        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-lg">
          <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center mb-sm glow-md">
            <span className="material-symbols-outlined text-[28px]">shield</span>
          </div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">
            {isRegister ? 'Initialize Access' : 'System Authentication'}
          </h1>
          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-xs">
            Pulse OS Protocol
          </p>
        </div>

        {/* Card */}
        <div className="glass-card-lg rounded-3xl p-lg">

          {error && (
            <div className="mb-md p-sm bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-md">

            <div className="flex flex-col gap-xs">
              <label htmlFor="email" className="font-label-caps text-label-caps text-primary uppercase">
                Identity (Email)
              </label>
              <div className="flex items-center bg-white/70 border border-black/10 rounded-xl px-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <span className="material-symbols-outlined text-secondary mr-sm text-[20px]">person</span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pulse.os"
                  required
                  className="w-full bg-transparent border-none outline-none py-sm font-body-md text-primary placeholder-on-surface-variant"
                />
              </div>
            </div>

            <div className="flex flex-col gap-xs">
              <label htmlFor="password" className="font-label-caps text-label-caps text-primary uppercase">
                Passcode
              </label>
              <div className="flex items-center bg-white/70 border border-black/10 rounded-xl px-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <span className="material-symbols-outlined text-secondary mr-sm text-[20px]">key</span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-transparent border-none outline-none py-sm font-body-md text-primary placeholder-on-surface-variant"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="press-feedback w-full bg-primary text-on-primary py-sm px-md font-label-caps text-label-caps uppercase rounded-xl cursor-pointer flex items-center justify-center gap-sm disabled:opacity-50 disabled:cursor-not-allowed mt-xs hover:opacity-90 transition-opacity glow-sm"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">
                    {isRegister ? 'person_add' : 'login'}
                  </span>
                  {isRegister ? 'Register Identity' : 'Authenticate'}
                </>
              )}
            </button>

          </form>
        </div>

        {/* Toggle */}
        <div className="text-center mt-md">
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="font-label-caps text-label-caps text-primary hover:text-indigo-600 transition-colors uppercase cursor-pointer inline-flex items-center gap-1 border-b border-primary/30 pb-0.5"
          >
            {isRegister ? 'Switch to Authentication' : 'Establish New Identity'}
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

      </div>
    </div>
  );
}
