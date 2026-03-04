import { useState } from 'react';

export function RegisterPage({ onSignUp, onGoToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await onSignUp(email, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8 font-sans">
        <div className="bg-white border border-black shadow-lg p-10 w-full max-w-md text-center">
          <div className="text-4xl mb-4">✉️</div>
          <h2 className="text-xl font-bold uppercase tracking-wider mb-2">Verifica tu correo</h2>
          <div className="w-full h-0.5 bg-black mb-4" />
          <p className="text-sm text-gray-600 mb-6">
            Te enviamos un enlace de confirmación a <strong>{email}</strong>. Por favor revisa tu
            bandeja de entrada y confirma tu cuenta para continuar.
          </p>
          <button
            onClick={onGoToLogin}
            className="bg-black text-white font-bold uppercase tracking-wide py-2 px-6 text-sm hover:bg-gray-800 transition-colors"
          >
            Ir a Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8 font-sans">
      <div className="bg-white border border-black shadow-lg p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-wider mb-1">PSP Tracker</h1>
          <div className="w-full h-0.5 bg-black mb-4" />
          <p className="text-sm text-gray-500 uppercase tracking-wide">Crear Cuenta</p>
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
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-1">
              Confirmar contraseña
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <button
            onClick={onGoToLogin}
            className="font-bold text-black underline hover:no-underline"
          >
            Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
}
