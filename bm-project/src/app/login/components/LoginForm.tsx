'use client';

import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Briefcase, Users, User, Building } from 'lucide-react';
type LoginCredentials = {
  email: string;
  password: string;
  userType: 'jobSeeker' | 'company';
};

const themeColors = {
  jobSeeker: {
    primary: 'bg-gradient-to-r from-[#a87955] to-[#7e471d]',
    secondary: 'text-[#7e471d]',
    border: 'border-[#7e471d]',
    focus: 'focus:border-[#7e471d] focus:ring-[#7e471d]',
    bg: 'bg-[#fdfaf5]',
    icon: 'text-[#7e471d]',
    selected: 'bg-[#f5f0e6] border-[#7e471d] text-[#4b2e2d]'
  },
  company: {
    primary: 'bg-gradient-to-r from-[#7e471d] to-[#4b2e2d]',
    secondary: 'text-[#4b2e2d]',
    border: 'border-[#4b2e2d]',
    focus: 'focus:border-[#4b2e2d] focus:ring-[#4b2e2d]',
    bg: 'bg-[#f5f0e6]',
    icon: 'text-[#4b2e2d]',
    selected: 'bg-[#e6d8c4] border-[#4b2e2d] text-[#2d1b1a]'
  }
};

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  isLoading: boolean;
  error: string;
}

export default function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
    userType: 'jobSeeker'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const userTypeInfo = {
    jobSeeker: {
      title: 'باحث عن عمل',
      description: 'ابحث عن الوظائف والفرص التدريبية المناسبة لك',
      icon: <User className="w-5 h-5" />
    },
    company: {
      title: 'شركة',
      description: 'ابحث عن المواهب وانشر الوظائف الشاغرة',
      icon: <Building className="w-5 h-5" />
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Type Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 text-right">
          نوع الحساب
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, userType: 'jobSeeker' }))}
            className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
              formData.userType === 'jobSeeker'
                ? themeColors.jobSeeker.selected
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="font-medium">باحث عن عمل</span>
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, userType: 'company' }))}
            className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
              formData.userType === 'company'
                ? themeColors.company.selected
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">شركة</span>
          </button>
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-right">
          البريد الإلكتروني
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            value={formData.email}
            name="email"
            onChange={handleInputChange}
            className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 ${themeColors[formData.userType].focus} focus:border-transparent text-right ${
               errors.email ? 'border-red-500' : 'border-gray-300'
             }`}
            placeholder="أدخل بريدك الإلكتروني"
            dir="rtl"
          />
          <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm text-right">{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-right">
          كلمة المرور
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            name="password"
            onChange={handleInputChange}
            className={`w-full px-4 py-3 pr-12 pl-12 border rounded-lg focus:ring-2 ${themeColors[formData.userType].focus} focus:border-transparent text-right ${
               errors.password ? 'border-red-500' : 'border-gray-300'
             }`}
            placeholder="أدخل كلمة المرور"
            dir="rtl"
          />
          <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm text-right">{errors.password}</p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm text-right">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
          formData.userType === 'jobSeeker' 
            ? `${themeColors.jobSeeker.primary} hover:from-[#7e471d] hover:to-[#4b2e2d] focus:ring-2 focus:ring-[#7e471d] focus:ring-offset-2`
            : `${themeColors.company.primary} hover:from-[#4b2e2d] hover:to-[#2d1b1a] focus:ring-2 focus:ring-[#4b2e2d] focus:ring-offset-2`
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
      </button>

      {/* Forgot Password Link */}
      <div className="text-center">
        <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
          نسيت كلمة المرور؟
        </a>
      </div>
    </form>
  );
}