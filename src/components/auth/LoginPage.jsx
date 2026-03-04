import { useState } from 'react';

export function LoginPage({ onSignIn, onGoToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSignIn(email, password);
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8 font-sans">
      <div className="bg-white border border-black shadow-lg p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-wider mb-1">PSP Tracker</h1>
          <div className="w-full h-0.5 bg-black mb-4" />
          <p className="text-sm text-gray-500 uppercase tracking-wide">Iniciar Sesión</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-black px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-black px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm border border-red-400 bg-red-50 px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white font-bold uppercase tracking-wide py-2 px-4 text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          ¿No tienes cuenta?{' '}
          <button
            onClick={onGoToRegister}
            className="font-bold text-black underline hover:no-underline"
          >
            Regístrate
          </button>
        </div>
      </div>
    </div>
  );
}
