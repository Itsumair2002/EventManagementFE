import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProfile, updateProfile, changePassword, clearError } from '../store/slices/authSlice'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const { user, loading, error } = useSelector(s => s.auth)
  const [activeTab, setActiveTab] = useState('personal')
  const [successMsg, setSuccessMsg] = useState('')
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    city: '',
    state: ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })

  useEffect(() => {
    dispatch(fetchProfile())
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  useEffect(() => {
    setSuccessMsg('')
    dispatch(clearError())
    // Reset password form when tab changes
    if (activeTab !== 'security') {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        })
    }
  }, [activeTab, dispatch])

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        city: user.city || '',
        state: user.state || ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setSuccessMsg('')
    const resultAction = await dispatch(updateProfile(formData))
    if (updateProfile.fulfilled.match(resultAction)) {
      setSuccessMsg('Profile updated successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setSuccessMsg('')
    dispatch(clearError())
    
    // Client-side Validation
    const { currentPassword, newPassword, confirmNewPassword } = passwordData
    
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert("All password fields are required")
      return
    }

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters")
      return
    }

    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match")
      return
    }

    const resultAction = await dispatch(changePassword({ 
      currentPassword, 
      newPassword, 
      confirmPassword: confirmNewPassword 
    }))

    if (changePassword.fulfilled.match(resultAction)) {
      setSuccessMsg('Password changed successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      })
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-primary text-sm font-mono mb-1">// MY ACCOUNT</p>
        <h1 className="font-display font-bold text-3xl text-fg">Profile Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl p-5 border border-line text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3">
              {user?.firstName?.[0] || user?.fullName?.[0] || 'U'}
            </div>
            <h3 className="font-semibold text-fg">{user?.fullName || 'User Name'}</h3>
            <p className="text-fg-muted text-sm">{user?.email || 'user@email.com'}</p>
            {user?.isVerified && (
              <span className="mt-2 inline-block text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                Verified
              </span>
            )}
            {!user?.isVerified && (
              <span className="mt-2 inline-block text-xs px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                Unverified
              </span>
            )}
          </div>

          <nav className="mt-3 space-y-1">
            {['personal', 'security', 'notifications', 'payments'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all text-left ${
                  activeTab === tab ? 'bg-brand-500/10 text-primary border border-brand-500/20' : 'text-fg-muted hover:bg-fg/5 hover:text-fg'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 glass-card rounded-2xl p-6 border border-line">
          {activeTab === 'personal' && (
            <div>
              <h2 className="font-semibold text-fg text-lg mb-5">Personal Information</h2>
              
              {successMsg && (
                <div className="mb-4 p-3 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 text-sm">
                  {successMsg}
                </div>
              )}
              
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleProfileSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-fg-muted mb-1.5">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First name"
                      className="input-brand w-full px-4 py-3 rounded-xl bg-elevated border border-line text-fg placeholder-fg-subtle text-sm outline-none transition-all focus:border-brand-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-fg-muted mb-1.5">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last name"
                      className="input-brand w-full px-4 py-3 rounded-xl bg-elevated border border-line text-fg placeholder-fg-subtle text-sm outline-none transition-all focus:border-brand-500/50"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-fg-muted mb-1.5">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      placeholder="Email"
                      className="input-brand w-full px-4 py-3 rounded-xl bg-elevated border border-line text-fg-muted placeholder-fg-subtle text-sm outline-none transition-all opacity-60 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-fg-muted mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Phone"
                      className="input-brand w-full px-4 py-3 rounded-xl bg-elevated border border-line text-fg placeholder-fg-subtle text-sm outline-none transition-all focus:border-brand-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-fg-muted mb-1.5">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Your city"
                      className="input-brand w-full px-4 py-3 rounded-xl bg-elevated border border-line text-fg placeholder-fg-subtle text-sm outline-none transition-all focus:border-brand-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-fg-muted mb-1.5">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="input-brand w-full px-4 py-3 rounded-xl bg-elevated border border-line text-fg placeholder-fg-subtle text-sm outline-none transition-all focus:border-brand-500/50"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex items-center gap-4">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-line border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                  {successMsg && <span className="text-green-400 text-xs">All changes saved.</span>}
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 className="font-semibold text-fg text-lg mb-5">Change Password</h2>
              
              {successMsg && (
                <div className="mb-4 p-3 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 text-sm">
                  {successMsg}
                </div>
              )}
              
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-sm">
                <div>
                  <label className="block text-xs text-fg-muted mb-1.5">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="••••••••"
                    className="input-brand w-full px-4 py-3 rounded-xl bg-elevated border border-line text-fg placeholder-fg-subtle text-sm outline-none transition-all focus:border-brand-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-fg-muted mb-1.5">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="••••••••"
                    className="input-brand w-full px-4 py-3 rounded-xl bg-elevated border border-line text-fg placeholder-fg-subtle text-sm outline-none transition-all focus:border-brand-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-fg-muted mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="••••••••"
                    className="input-brand w-full px-4 py-3 rounded-xl bg-elevated border border-line text-fg placeholder-fg-subtle text-sm outline-none transition-all focus:border-brand-500/50"
                  />
                </div>
                
                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-line border-t-white rounded-full animate-spin" />
                        Updating...
                      </>
                    ) : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 className="font-semibold text-fg text-lg mb-5">Notification Preferences</h2>
              <div className="space-y-3">
                {[
                  { label: 'Email Notifications', desc: 'Booking confirmations and reminders' },
                  { label: 'SMS Alerts', desc: 'Upcoming event reminders' },
                  { label: 'Promotional Offers', desc: 'Deals and new events near you' },
                  { label: 'QR Code Delivery', desc: 'Send QR code via email' },
                ].map((n, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-fg/[0.02] border border-line">
                    <div>
                      <p className="text-fg text-sm font-medium">{n.label}</p>
                      <p className="text-fg-muted text-xs">{n.desc}</p>
                    </div>
                    <button className={`w-11 h-6 rounded-full transition-all relative ${i < 2 ? 'bg-brand-500' : 'bg-fg/10'}`}>
                      <span className={`absolute top-0.5 w-5 h-5 bg-surface rounded-full shadow transition-all ${i < 2 ? 'right-0.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div>
              <h2 className="font-semibold text-fg text-lg mb-5">Payment Methods</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl glass-card border border-brand-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-7 rounded bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white text-xs font-bold">VISA</div>
                    <div>
                      <p className="text-fg text-sm">•••• •••• •••• 4242</p>
                      <p className="text-fg-muted text-xs">Expires 12/28</p>
                    </div>
                  </div>
                  <span className="text-xs text-primary bg-brand-500/10 px-2 py-0.5 rounded">Default</span>
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-line text-fg-muted text-sm hover:border-brand-500/30 hover:text-primary transition-all">
                  + Add Payment Method
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
