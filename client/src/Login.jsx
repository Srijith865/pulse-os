import { useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

const getPasswordStrength = (pass) => {
  let score = 0;
  if (!pass) return 0;
  if (pass.length >= 8) score += 1;
  if (/[A-Z]/.test(pass)) score += 1;
  if (/[a-z]/.test(pass)) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;
  return score;
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const strength = getPasswordStrength(password);
  const isStrong = strength >= 4;

  const getStrengthLabel = () => {
    if (strength === 0) return '';
    if (strength <= 2) return 'Weak';
    if (strength === 3) return 'Fair';
    if (strength === 4) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (strength <= 2) return 'bg-red-500';
    if (strength === 3) return 'bg-yellow-500';
    if (strength >= 4) return 'bg-green-500';
    return 'bg-black/10';
  };

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

              {isRegister && password.length > 0 && (
                <div className="mt-1 flex flex-col gap-1">
                  <div className="flex gap-1 h-1.5 w-full">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div 
                        key={level} 
                        className={`flex-1 rounded-full ${strength >= level ? getStrengthColor() : 'bg-black/10'} transition-colors duration-300`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-xs mt-0.5">
                    <span className={`font-label-caps font-bold ${strength >= 4 ? 'text-green-600' : 'text-secondary'}`}>
                      {getStrengthLabel()}
                    </span>
                    {!isStrong && (
                      <span className="text-secondary text-[10px]">Use 8+ chars, upper, lower, number, symbol</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password || (isRegister && !isStrong)}
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
            className="press-feedback font-label-caps text-label-caps bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors uppercase cursor-pointer inline-flex items-center gap-2 px-md py-sm rounded-xl font-bold shadow-sm"
          >
            {isRegister ? 'Switch to Login' : 'Register Now'}
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

      </div>
    </div>
  );
}
