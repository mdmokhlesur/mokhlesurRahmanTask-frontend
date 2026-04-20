import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../utils/validation';
import type { LoginFormValues } from '../utils/validation';
import './auth.css';

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
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrapper">
              <input 
                type="email" 
                className={`auth-input ${errors.email ? 'error' : ''}`}
                placeholder="Email"
                {...register('email')}
              />
              {errors.email && <p className="error-message">{errors.email.message}</p>}
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                className={`auth-input has-right-icon ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="input-icon-right"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="auth-button"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          New to Splitter? <Link to="/register" className="auth-link">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
