import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../utils/validation';
import type { RegisterFormValues } from '../utils/validation';
import './auth.css';

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
    <div className="auth-container">
      <div className="auth-card wide">
        <div className="auth-header">
          <h2 className="auth-title">Create an account</h2>
          <p className="auth-subtitle">
            Already have an account? <Link to="/login" className="auth-link">Log in</Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First name</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  className={`auth-input ${errors.firstName ? 'error' : ''}`}
                  placeholder="Fletcher"
                  {...register('firstName')}
                />
                {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Last name</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  className={`auth-input ${errors.lastName ? 'error' : ''}`}
                  placeholder="Last name"
                  {...register('lastName')}
                />
                {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
              </div>
            </div>
          </div>

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
            <label className="form-label">Enter your password</label>
            <div className="input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                className={`auth-input has-right-icon ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
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

          <div className="form-group">
            <label className="checkbox-group">
              <input 
                type="checkbox" 
                className="auth-checkbox"
                {...register('agreeToTerms')}
              />
              <span className="checkbox-label">I agree to the Terms & Conditions</span>
            </label>
            {errors.agreeToTerms && <p className="error-message">{errors.agreeToTerms.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="auth-button"
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
