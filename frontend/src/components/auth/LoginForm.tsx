import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [formData, setFormData] = useState({
    identifier: '', // email or username
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.identifier || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Determine if identifier is email or username
      const isEmail = formData.identifier.includes('@');
      const credentials = isEmail
        ? { email: formData.identifier, password: formData.password }
        : { username: formData.identifier, password: formData.password };

      await login(credentials);
      onSuccess?.();
      navigate('/feed');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="identifier" className="block text-sm font-medium text-[#e5e7eb] mb-2">
          Email or Username
        </label>
        <input
          id="identifier"
          type="text"
          value={formData.identifier}
          onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
          className="w-full px-4 py-3 glass-card rounded-lg text-[#e5e7eb] placeholder-[#9ca3af] focus:outline-none focus:border-[rgba(168,85,247,0.5)] focus:ring-2 focus:ring-[rgba(168,85,247,0.2)] transition-all duration-200"
          placeholder="Enter your email or username"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#e5e7eb] mb-2">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 glass-card rounded-lg text-[#e5e7eb] placeholder-[#9ca3af] focus:outline-none focus:border-[rgba(168,85,247,0.5)] focus:ring-2 focus:ring-[rgba(168,85,247,0.2)] transition-all duration-200 pr-12"
            placeholder="Enter your password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#e5e7eb] transition-colors"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-lg font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Entering Orbit...
          </>
        ) : (
          'Enter Orbit'
        )}
      </button>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-[#9ca3af] hover:text-[#e5e7eb] transition-colors"
          disabled={isLoading}
        >
          Forgot password?
        </button>
      </div>
    </form>
  );
}

