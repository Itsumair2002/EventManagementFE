import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { registerUser } from '../store/slices/authSlice.js'

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirm: '',
      terms: false
    }
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector(s => s.auth)

  const passwordValue = watch('password')

  const onSubmit = async (data) => {
    // Exclude confirm and terms from sending to API
    const { confirm, terms, ...payload } = data;
    const resultAction = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(resultAction)) {
       // Registration might not login automatically depending on the backend, 
       // but typically we can redirect to login page for them to login.
       navigate('/login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-hero-gradient">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-3xl p-8 border border-line">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center text-white font-display font-bold text-lg mx-auto mb-4">V</div>
            <h1 className="font-display font-bold text-2xl text-fg mb-1">Create Account</h1>
            <p className="text-fg-muted text-sm">Join 50,000+ event lovers on Vibe Check</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs text-fg-muted mb-1.5 font-medium">Full Name</label>
              <input
                type="text"
                {...register("fullName", { required: "Full Name is required" })}
                placeholder="John Doe"
                className="input-brand w-full px-4 py-3 rounded-xl bg-elevated border border-line text-fg placeholder-fg-subtle text-sm outline-none transition-all"
              />
              {errors.fullName && <span className="text-red-400 text-xs mt-1 block">{errors.fullName.message}</span>}
            </div>

            <div>
              <label className="block text-xs text-fg-muted mb-1.5 font-medium">Email Address</label>
              <input
                type="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" } 
                })}
                placeholder="you@example.com"
                className="input-brand w-full px-4 py-3 rounded-xl bg-elevated border border-line text-fg placeholder-fg-subtle text-sm outline-none transition-all"
              />
              {errors.email && <span className="text-red-400 text-xs mt-1 block">{errors.email.message}</span>}
            </div>

            <div>
              <label className="block text-xs text-fg-muted mb-1.5 font-medium">Phone Number</label>
              <input
                type="text"
                {...register("phoneNumber", { required: "Phone number is required" })}
                placeholder="+1234567890"
                className="input-brand w-full px-4 py-3 rounded-xl bg-elevated border border-line text-fg placeholder-fg-subtle text-sm outline-none transition-all"
              />
              {errors.phoneNumber && <span className="text-red-400 text-xs mt-1 block">{errors.phoneNumber.message}</span>}
            </div>

            <div>
              <label className="block text-xs text-fg-muted mb-1.5 font-medium">Password</label>
              <input
                type="password"
                {...register("password", { 
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" }
                })}
                placeholder="Min 8 characters"
                className="input-brand w-full px-4 py-3 rounded-xl bg-elevated border border-line text-fg placeholder-fg-subtle text-sm outline-none transition-all"
              />
              {errors.password && <span className="text-red-400 text-xs mt-1 block">{errors.password.message}</span>}
            </div>

            <div>
              <label className="block text-xs text-fg-muted mb-1.5 font-medium">Confirm Password</label>
              <input
                type="password"
                {...register("confirm", { 
                  required: "Please confirm your password",
                  validate: val => val === passwordValue || "Passwords do not match"
                })}
                placeholder="••••••••"
                className="input-brand w-full px-4 py-3 rounded-xl bg-elevated border border-line text-fg placeholder-fg-subtle text-sm outline-none transition-all"
              />
              {errors.confirm && <span className="text-red-400 text-xs mt-1 block">{errors.confirm.message}</span>}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("terms", { required: "You must accept the terms" })}
                className="mt-0.5 accent-brand-500"
              />
              <span className="text-xs text-fg-muted">
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </span>
            </label>
            {errors.terms && <span className="text-red-400 text-xs block -mt-2">{errors.terms.message}</span>}

            {error && <div className="text-red-400 text-sm mt-2 text-center bg-red-400/10 py-2 rounded-lg">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-400 text-white font-semibold transition-all hover:shadow-glow-sm mt-2 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <hr className="border-line my-6" />
          <p className="text-center text-fg-muted text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
