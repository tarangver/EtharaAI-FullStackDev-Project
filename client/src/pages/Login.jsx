import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, ShieldCheck, Eye, EyeOff, Sparkles, Terminal, ArrowRight, ShieldAlert } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'member' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.role) newErrors.role = 'Role is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', formData);
      login(response.data);
      toast.success('Login successful!');
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row overflow-x-hidden relative font-sans transition-colors duration-300">
      
      {/* BACKGROUND DECORATIONS (Global) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.03),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.02),transparent_50%)] pointer-events-none" />

      {/* LEFT PANEL - SaaS Hero Section (Hidden on mobile/tablet) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 xl:p-16 relative overflow-hidden bg-slate-50 dark:bg-slate-950 border-r border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
        
        {/* Subtle Tech Grid overlay */}
        <div className="absolute inset-0 tech-grid-overlay opacity-[0.12] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />
        
        {/* Decorative Glowing Blobs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/[0.04] rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-violet-600/[0.04] rounded-full blur-[80px] animate-pulse-slow" />

        {/* Top Header/Brand Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white font-extrabold shadow-md shadow-indigo-600/20">
            E
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-slate-800 to-slate-950 dark:from-slate-100 dark:to-slate-350 bg-clip-text text-transparent tracking-tight">
            EtharaAI
          </span>
        </div>

        {/* Middle Feature Highlights */}
        <div className="relative z-10 my-auto max-w-lg space-y-8 animate-float">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Workspace
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              Empower your team. <br/>
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                Accelerate delivery.
              </span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              Experience the visual task manager crafted for fast-paced development cycles. Align objectives, track progress, and ship products on time.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-850">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
                <span className="text-xs font-bold">1</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">Sprint & Task Orchestration</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
                <span className="text-xs font-bold">2</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">Role-based Secure Environments</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
                <span className="text-xs font-bold">3</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">Advanced Performance Insights</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright/Footer branding */}
        <div className="relative z-10 text-slate-400 dark:text-slate-500 text-xs flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <span>Secured with high-fidelity workspace cryptography.</span>
        </div>
      </div>

      {/* RIGHT PANEL - Login interactive form container */}
      <div className="w-full lg:w-1/2 min-h-screen lg:h-screen lg:overflow-y-auto flex items-center justify-center p-6 sm:p-12 relative z-10 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        
        {/* Responsive glowing orb behind card */}
        <div className="absolute w-[350px] h-[350px] bg-indigo-600/[0.03] dark:bg-indigo-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

        {/* Outer glassmorphism login frame */}
        <div className="w-full max-w-md glassmorphism rounded-3xl p-8 sm:p-10 shadow-2xl relative">
          
          {/* Top Logo visible on mobile/tablet */}
          <div className="flex justify-center mb-6 lg:hidden">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-indigo-600/20">
                E
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">EtharaAI</span>
            </div>
          </div>

          {/* Form titles */}
          <div className="text-center sm:text-left mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
              Sign in to manage projects and track tasks
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input - EMAIL */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-405 uppercase tracking-widest">
                Email Address
              </label>
              <div className="premium-input-container">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Mail className="w-5 h-5 transition-colors group-focus-within:text-indigo-600" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`premium-input ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' 
                      : 'focus:border-indigo-500 focus:ring-indigo-500/10'
                  }`}
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && (
                <div className="flex items-center gap-1.5 text-red-500 dark:text-red-400 text-xs mt-1.5 pl-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Input - PASSWORD */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-405 uppercase tracking-widest">
                Password
              </label>
              <div className="premium-input-container">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`premium-input pr-12 ${
                    errors.password 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' 
                      : 'focus:border-indigo-500 focus:ring-indigo-500/10'
                  }`}
                  placeholder="••••••••"
                />
                
                {/* Show/Hide password toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-650 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-1.5 text-red-500 dark:text-red-400 text-xs mt-1.5 pl-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Input - ROLE */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-405 uppercase tracking-widest">
                Account Profile Role
              </label>
              <div className="premium-input-container">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`premium-input appearance-none ${
                    errors.role 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' 
                      : 'focus:border-indigo-500 focus:ring-indigo-500/10'
                  }`}
                >
                  <option value="member" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Member Workspace</option>
                  <option value="admin" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Admin Control</option>
                </select>
                
                {/* Custom arrow indicator */}
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.role && (
                <div className="flex items-center gap-1.5 text-red-500 dark:text-red-400 text-xs mt-1.5 pl-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{errors.role}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-4 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Registration link */}
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-8">
            New to the platform?{' '}
            <Link 
              to="/register" 
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-semibold transition-colors underline underline-offset-4"
            >
              Create free account
            </Link>
          </p>

          {/* Preserved Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/80 relative">
            <p className="text-[11px] uppercase tracking-widest text-slate-400 dark:text-slate-500 text-center font-bold mb-3">
              Developer Node Credentials
            </p>
            <div className="bg-slate-50/80 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-800/40 p-3.5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Admin Portal:</span>
                <code className="text-indigo-600 dark:text-indigo-400 select-all font-mono bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-850 text-center">admin@demo.com</code>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Member Portal:</span>
                <code className="text-indigo-600 dark:text-indigo-400 select-all font-mono bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-850 text-center">member@demo.com</code>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-slate-200/50 dark:border-slate-800/50 pt-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Default Password:</span>
                <code className="text-violet-605 dark:text-violet-400 select-all font-mono bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-855 text-center">Admin@123 / Member@123</code>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
