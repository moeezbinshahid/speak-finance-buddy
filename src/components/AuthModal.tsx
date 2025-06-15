import React, { useState } from 'react';
import { X, User, Mail, CreditCard, MapPin, Building, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
  isDarkMode: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess, isDarkMode }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    cnic: '',
    country: '',
    accountType: 'individual',
  });
  const [passwordError, setPasswordError] = useState('');

  const validatePassword = (password: string) => {
    if (password.length !== 8) {
      return 'Password must be exactly 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError('Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Account not found. Please sign up first, then sign in with your credentials.');
        } else {
          setError(error.message);
        }
      } else {
        onAuthSuccess();
      }
    } catch (err) {
      console.error('Email sign-in error:', err);
      setError('Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    const passwordValidationError = validatePassword(formData.password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            username: formData.username,
            cnic: formData.cnic,
            country: formData.country,
            accountType: formData.accountType,
          }
        }
      });
      
      if (error) {
        if (error.message.includes('User already registered')) {
          setError('Account already exists. Please sign in instead.');
        } else {
          setError(error.message);
        }
      } else {
        onAuthSuccess();
      }
    } catch (err) {
      console.error('Email sign-up error:', err);
      setError('Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      handleEmailSignUp();
    } else {
      handleEmailSignIn();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user starts typing
    
    if (field === 'password') {
      const error = validatePassword(value);
      setPasswordError(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-md ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          
          {/* Google Sign In Button */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
            variant="outline"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className={`bg-white px-2 ${isDarkMode ? 'text-gray-400 bg-gray-900' : 'text-gray-500'}`}>
                Or continue with email
              </span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                    <User className="h-4 w-4 inline mr-2" />
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="Enter your username"
                    className={isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cnic" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                    <CreditCard className="h-4 w-4 inline mr-2" />
                    CNIC / ID Number
                  </Label>
                  <Input
                    id="cnic"
                    type="text"
                    value={formData.cnic}
                    onChange={(e) => handleInputChange('cnic', e.target.value)}
                    placeholder="Enter your CNIC or ID number"
                    className={isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Country
                  </Label>
                  <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger className={isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pk">🇵🇰 Pakistan</SelectItem>
                      <SelectItem value="in">🇮🇳 India</SelectItem>
                      <SelectItem value="bd">🇧🇩 Bangladesh</SelectItem>
                      <SelectItem value="af">🇦🇫 Afghanistan</SelectItem>
                      <SelectItem value="tr">🇹🇷 Turkey</SelectItem>
                      <SelectItem value="fr">🇫🇷 France</SelectItem>
                      <SelectItem value="es">🇪🇸 Spain</SelectItem>
                      <SelectItem value="sa">🇸🇦 Saudi Arabia</SelectItem>
                      <SelectItem value="ir">🇮🇷 Iran</SelectItem>
                      <SelectItem value="us">🇺🇸 United States</SelectItem>
                      <SelectItem value="other">🌍 Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accountType" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                    <Building className="h-4 w-4 inline mr-2" />
                    Account Type
                  </Label>
                  <Select value={formData.accountType} onValueChange={(value) => handleInputChange('accountType', value)}>
                    <SelectTrigger className={isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">👤 Individual</SelectItem>
                      <SelectItem value="organization">🏢 Organization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                <Mail className="h-4 w-4 inline mr-2" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                className={isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="8 chars: A-Z, a-z, 0-9"
                  className={`pr-10 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } ${passwordError ? 'border-red-500' : ''}`}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-xs mt-1">{passwordError}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading || (!!passwordError && formData.password.length > 0)}
            >
              {isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>
            
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className={isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};
