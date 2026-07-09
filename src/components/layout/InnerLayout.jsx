import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import EventMateChat from '../ai/EventMateChat.jsx'

export default function InnerLayout() {
  return (
    <div className="min-h-screen bg-canvas noise-bg flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
      <Footer />
      <EventMateChat />
    </div>
  )
}
