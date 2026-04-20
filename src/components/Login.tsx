import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../utils/validation';
import type { LoginFormValues } from '../utils/validation';



const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Welcome back!');
        login(data.data.token, data.data.user);
        navigate('/');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (err) {
      toast.error('Connection to backend failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-[420px] bg-white rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] p-8 border border-slate-100 transition-all duration-300">
        {/* Login page title */}
        <div className="mb-6">
          <h2 className="text-[1.8rem] font-semibold text-slate-900 tracking-tight mb-1">Welcome back</h2>
          <p className="text-sm text-slate-500 font-light">Please enter your details to sign in</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <div className="relative">
              <input 
                type="email" 
                className={`w-full px-3 py-2.5 rounded border ${errors.email ? 'border-red-500' : 'border-slate-200'} outline-none transition-all duration-200 text-slate-900 text-[15px] placeholder-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10`}
                placeholder="Email"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>}
            </div>
          </div>
          
          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <div>
          
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                className={`w-full px-3 py-2.5 rounded border ${errors.password ? 'border-red-500' : 'border-slate-200'} outline-none transition-all duration-200 text-slate-900 text-[15px] placeholder-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10`}
                placeholder="••••••••"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 flex items-center bg-none border-none cursor-pointer p-0 transition-colors duration-200 hover:text-primary"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1 font-medium">{errors.password.message}</p>}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary text-white font-semibold py-2.5 rounded-md border-none cursor-pointer transition-all duration-200 text-base mt-2 enabled:hover:bg-primary-dark enabled:hover:-translate-y-0.5 enabled:hover:shadow-lg enabled:hover:shadow-primary/25 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          New to Splitter? <Link to="/register" className="text-primary font-medium no-underline ml-1 hover:underline">Create an account</Link>
        </p>
      </div>
    </div>

  );
};

export default Login;
