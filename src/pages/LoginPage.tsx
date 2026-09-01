import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { navigate } from '@/lib/router';

export function LoginPage() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-white text-center">
          Admin Login
        </h1>

        <p className="text-zinc-400 text-center mt-2 mb-8">
          EvoVision Films
        </p>

        <div className="mb-4">
          <label className="block text-sm text-zinc-300 mb-2">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white outline-none focus:border-red-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-zinc-300 mb-2">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white outline-none focus:border-red-500"
          />
        </div>

        {error && (
          <div className="mb-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}