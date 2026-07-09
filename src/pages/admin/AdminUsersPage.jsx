const sampleUsers = [
  { id: 'U001', name: 'Arjun Sharma', email: 'arjun@example.com', role: 'user', bookings: 5, joined: '2025-12-10', status: 'active' },
  { id: 'U002', name: 'Priya Mehta', email: 'priya@example.com', role: 'organizer', bookings: 0, joined: '2026-01-05', status: 'active' },
  { id: 'U003', name: 'Rahul Verma', email: 'rahul@example.com', role: 'user', bookings: 2, joined: '2026-01-20', status: 'active' },
  { id: 'U004', name: 'Ananya Singh', email: 'ananya@example.com', role: 'user', bookings: 8, joined: '2025-11-15', status: 'inactive' },
  { id: 'U005', name: 'Vikram Iyer', email: 'vikram@example.com', role: 'admin', bookings: 0, joined: '2025-10-01', status: 'active' },
]

const roleColors = {
  admin: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  organizer: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  user: 'bg-slate-500/10 text-fg-muted border-line/20',
}

export default function AdminUsersPage() {
  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-fg-muted text-sm font-mono mb-1">// MANAGE</p>
          <h1 className="font-display font-bold text-3xl text-fg">Users</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          Add User
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full admin-table">
            <thead>
              <tr className="border-b border-line">
                {['User', 'Email', 'Role', 'Bookings', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs text-fg-muted font-medium px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleUsers.map(u => (
                <tr key={u.id} className="border-b border-line">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {u.name[0]}
                      </div>
                      <span className="text-sm text-fg font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-fg-muted">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border capitalize font-medium ${roleColors[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-fg-muted">{u.bookings}</td>
                  <td className="px-5 py-3 text-sm text-fg-muted whitespace-nowrap">
                    {new Date(u.joined).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${u.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-fg-muted'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg text-fg-muted hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button className="p-1.5 rounded-lg text-fg-muted hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
