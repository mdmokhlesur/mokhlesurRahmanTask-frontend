import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.success) {
        login(data.data.token, data.data.user);
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection to backend failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-12">
      <div className="w-full max-w-md space-y-8 bg-white rounded-2xl shadow-xl p-10 border border-slate-100">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-200">
              <Layout className="text-white" size={32} />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900 tracking-tight">Splitter Login</h2>
          <p className="mt-2 text-sm text-slate-500">Welcome back! Please enter your details.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-medium animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">Email</label>
              <input 
                type="email" 
                required 
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-black bg-slate-50/50"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">Password</label>
              <input 
                type="password" 
                required 
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-black bg-slate-50/50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]">
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm">
          New to Splitter? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
