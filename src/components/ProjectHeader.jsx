import { useState } from 'react';

export function ProjectHeader({
  projects,
  currentProject,
  setCurrentProject,
  headerDate,
  setHeaderDate,
  createProject,
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const name = newName.trim();
    if (!name || projects.includes(name)) return;
    setSaving(true);
    try {
      await createProject(name);
      setCurrentProject(name);
      setNewName('');
      setIsCreating(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex-1 min-w-[300px]">
          <div className="flex items-center gap-2 mb-2">
            <label className="font-bold text-lg whitespace-nowrap">Project:</label>
            {!isCreating ? (
              <div className="flex gap-2 w-full">
                <select
                  className="flex-1 border-b-2 border-black bg-transparent px-2 py-1 outline-none appearance-none"
                  value={currentProject}
                  onChange={(e) => setCurrentProject(e.target.value)}
                >
                  {projects.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <button
                  onClick={() => setIsCreating(true)}
                  className="px-3 py-1 bg-black text-white text-sm hover:bg-gray-800"
                >
                  New
                </button>
              </div>
            ) : (
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  className="flex-1 border-b-2 border-black px-2 py-1 outline-none"
                  placeholder="New project name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-3 py-1 bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => { setIsCreating(false); setNewName(''); }}
                  className="px-3 py-1 bg-red-600 text-white text-sm hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-bold text-lg">Date:</label>
          <input
            type="date"
            className="border-b-2 border-black bg-transparent px-2 py-1 outline-none"
            value={headerDate}
            onChange={(e) => setHeaderDate(e.target.value)}
          />
        </div>
      </div>
      <div className="w-full h-0.5 bg-black mt-2"></div>
    </div>
  );
}
