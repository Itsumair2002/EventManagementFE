import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { loginUser } from '../store/slices/authSlice'


export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector(s => s.auth)

  const onSubmit = async (data) => {
    const resultAction = await dispatch(loginUser(data))
    if (loginUser.fulfilled.match(resultAction)) {
      const role = resultAction.payload?.user?.role || 'user'
      navigate(role === 'admin' ? '/admin/dashboard' : '/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-hero-gradient">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="glass-card rounded-3xl p-8 border border-line">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center text-white font-display font-bold text-lg mx-auto mb-4">
              V
            </div>
            <h1 className="font-display font-bold text-2xl text-fg mb-1">Welcome back</h1>
            <p className="text-fg-muted text-sm">Sign in to your Vibe Check account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs text-fg-muted mb-1.5 font-medium">Email Address</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder="you@example.com"
                className="input-brand w-full px-4 py-3 rounded-xl bg-elevated border border-line text-fg placeholder-fg-subtle text-sm outline-none transition-all"
              />
              {errors.email && <span className="text-red-400 text-xs mt-1 block">{errors.email.message}</span>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs text-fg-muted font-medium">Password</label>
              </div>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                placeholder="••••••••"
                className="input-brand w-full px-4 py-3 rounded-xl bg-elevated border border-line text-fg placeholder-fg-subtle text-sm outline-none transition-all"
              />
              {errors.password && <span className="text-red-400 text-xs mt-1 block">{errors.password.message}</span>}
            </div>

            {error && <div className="text-red-400 text-sm mt-2 text-center bg-red-400/10 py-2 rounded-lg">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-400 text-white font-semibold transition-all hover:shadow-glow-sm mt-2 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <hr className="border-line my-6" />

          <p className="text-center text-fg-muted text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
