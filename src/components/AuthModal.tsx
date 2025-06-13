
import React, { useState } from 'react';
import { X, User, Mail, CreditCard, MapPin, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
  isDarkMode: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess, isDarkMode }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    cnic: '',
    country: '',
    accountType: 'individual',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    onAuthSuccess();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Enter your password"
              className={isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}
              required
            />
          </div>
          
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {isSignUp ? 'Create Account' : 'Sign In'}
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
      </Card>
    </div>
  );
};
