import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import EventMateChat from '../ai/EventMateChat.jsx'

export default function OuterLayout() {
  return (
    <div className="min-h-screen bg-canvas noise-bg flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <EventMateChat />
    </div>
  )
}
