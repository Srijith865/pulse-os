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
        // Register mode
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (data.session) {
          navigate('/brief');
        } else {
          // If session is null but no error, usually means "Confirm Email" is still enabled.
          // Fallback just in case.
          setError('Registration successful. If you cannot log in, please ensure "Confirm email" is disabled in Supabase, or check your email.');
        }
      } else {
        // Login mode
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (data.session) {
          navigate('/brief');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md text-body-md antialiased flex items-center justify-center p-md">
      <div className="w-full max-w-md bg-surface black-border p-0 flex flex-col shadow-2xl">
        
        <div className="p-lg editorial-divider flex flex-col items-center">
          <h1 className="font-headline-md text-headline-md font-bold text-primary mb-xs">
            {isRegister ? 'Initialize Access' : 'System Authentication'}
          </h1>
          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">
            Pulse OS Protocol
          </p>
        </div>

        <div className="p-lg">
          {error && (
            <div className="mb-md p-sm bg-error-container text-on-error-container text-sm black-border">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-md">
            
            <div className="flex flex-col gap-xs">
              <label htmlFor="email" className="font-label-caps text-label-caps text-primary uppercase">
                Identity (Email)
              </label>
              <div className="flex items-center black-border bg-white px-sm focus-within:ring-1 focus-within:ring-primary transition-all">
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
              <div className="flex items-center black-border bg-white px-sm focus-within:ring-1 focus-within:ring-primary transition-all">
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
              className="w-full bg-primary text-on-primary py-sm px-md font-label-caps text-label-caps uppercase hover:bg-secondary-container hover:text-primary transition-colors duration-200 ease-in-out black-border cursor-pointer flex items-center justify-center gap-sm disabled:opacity-50 disabled:cursor-not-allowed mt-xs"
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

        <div className="p-sm editorial-divider border-t border-primary bg-surface-container-low text-center mt-4">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="font-label-caps text-label-caps text-primary hover:bg-secondary-container hover:text-primary transition-colors uppercase cursor-pointer border-b-2 border-primary pb-1 tracking-widest font-bold inline-flex items-center gap-1"
          >
            {isRegister ? 'Switch to Authentication' : 'Establish New Identity'}
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

      </div>
    </div>
  );
}
