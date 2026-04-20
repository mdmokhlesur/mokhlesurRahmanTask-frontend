import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../utils/validation';
import type { RegisterFormValues } from '../utils/validation';



const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    const fullName = `${values.firstName} ${values.lastName}`;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: fullName, 
          email: values.email, 
          password: values.password 
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Account created! Please sign in.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (err) {
      toast.error('Connection to backend failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-[500px] bg-white rounded-3xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] p-10 border border-slate-100 transition-all duration-300">
        <div className="text-center mb-10">
          <h2 className="text-[2rem] font-bold text-slate-900 tracking-tight mb-3">Create an account</h2>
          <p className="text-sm text-slate-500 font-medium">
            Already have an account? <Link to="/login" className="text-primary font-semibold no-underline ml-1 hover:underline">Log in</Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">First name</label>
              <div className="relative">
                <input 
                  type="text" 
                  className={`w-full px-4 py-3.5 rounded-xl border ${errors.firstName ? 'border-red-500' : 'border-slate-200'} outline-none transition-all duration-200 bg-slate-50 text-slate-900 text-[15px] placeholder-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10`}
                  placeholder="Fletcher"
                  {...register('firstName')}
                />
                {errors.firstName && <p className="text-xs text-red-500 mt-1 font-medium">{errors.firstName.message}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Last name</label>
              <div className="relative">
                <input 
                  type="text" 
                  className={`w-full px-4 py-3.5 rounded-xl border ${errors.lastName ? 'border-red-500' : 'border-slate-200'} outline-none transition-all duration-200 bg-slate-50 text-slate-900 text-[15px] placeholder-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10`}
                  placeholder="Last name"
                  {...register('lastName')}
                />
                {errors.lastName && <p className="text-xs text-red-500 mt-1 font-medium">{errors.lastName.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <div className="relative">
              <input 
                type="email" 
                className={`w-full px-4 py-3.5 rounded-xl border ${errors.email ? 'border-red-500' : 'border-slate-200'} outline-none transition-all duration-200 bg-slate-50 text-slate-900 text-[15px] placeholder-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10`}
                placeholder="Email"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Enter your password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                className={`w-full px-4 py-3.5 pr-12 rounded-xl border ${errors.password ? 'border-red-500' : 'border-slate-200'} outline-none transition-all duration-200 bg-slate-50 text-slate-900 text-[15px] placeholder-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10`}
                placeholder="Enter your password"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 flex items-center bg-none border-none cursor-pointer p-0 transition-colors duration-200 hover:text-primary"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && <p className="text-xs text-red-500 mt-1 font-medium">{errors.password.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded border-slate-200 cursor-pointer accent-primary"
                {...register('agreeToTerms')}
              />
              <span className="text-sm text-slate-500 select-none">I agree to the Terms & Conditions</span>
            </label>
            {errors.agreeToTerms && <p className="text-xs text-red-500 mt-1 font-medium">{errors.agreeToTerms.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl border-none cursor-pointer transition-all duration-200 text-base mt-4 enabled:hover:bg-primary-dark enabled:hover:-translate-y-0.5 enabled:hover:shadow-lg enabled:hover:shadow-primary/25 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>

  );
};

export default Register;
