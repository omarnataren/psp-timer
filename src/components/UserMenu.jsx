import { useState, useRef, useEffect } from 'react';

function getInitials(email) {
  if (!email) return '?';
  return email[0].toUpperCase();
}

export function UserMenu({ user, onSignOut, compact = false }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setOpen(false);
    await onSignOut();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 border border-black px-3 py-1.5 hover:bg-gray-100 transition-colors"
        title={user?.email}
      >
        <span className="w-7 h-7 bg-black text-white flex items-center justify-center text-xs font-bold rounded-full select-none">
          {getInitials(user?.email)}
        </span>
        {!compact && (
          <span className="text-xs font-medium max-w-[150px] truncate hidden sm:block">
            {user?.email}
          </span>
        )}
        {!compact && (
          <svg
          className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-52 bg-white border border-black shadow-md z-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Cuenta</p>
            <p className="text-sm text-gray-800 truncate mt-0.5">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2.5 text-sm font-bold uppercase tracking-wide hover:bg-gray-100 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}
