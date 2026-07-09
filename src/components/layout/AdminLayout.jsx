import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar.jsx'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-canvas flex">
      <AdminSidebar />
      <main className="flex-1 ml-60 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
