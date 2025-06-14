
import React from 'react';

interface SocialMediaIconsProps {
  isDarkMode: boolean;
  onLanguageSelect?: (lang: string) => void;
  selectedLanguage?: string;
}

const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
];

export const SocialMediaIcons: React.FC<SocialMediaIconsProps> = ({ 
  isDarkMode, 
  onLanguageSelect,
  selectedLanguage = 'en'
}) => {
  return (
    <div className="flex justify-center items-center mb-8">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="squircleClip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.5 C 0,0 0,0 0.5,0 S 1,0 1,0.5 1,1 0.5,1 0,1 0,0.5"></path>
          </clipPath>
        </defs>
      </svg>

      <div className="relative">
        <div className={`absolute inset-0 backdrop-blur-xl rounded-2xl border shadow-2xl ${
          isDarkMode 
            ? 'bg-black/20 border-white/10' 
            : 'bg-white/20 border-gray-200/30'
        }`}></div>

        <div className="relative flex items-end gap-x-2 p-2">
          {supportedLanguages.map((lang) => (
            <div key={lang.code} className="relative">
              <div
                style={{ clipPath: 'url(#squircleClip)' }}
                className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg border cursor-pointer transform transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-2 hover:shadow-2xl ${
                  selectedLanguage === lang.code
                    ? 'bg-gradient-to-br from-blue-600 to-blue-800 border-blue-500/50'
                    : 'bg-gradient-to-br from-gray-700 to-gray-900 border-gray-600/50'
                }`}
                onClick={() => onLanguageSelect?.(lang.code)}
              >
                <div className="text-2xl">
                  {lang.flag}
                </div>
              </div>
              <div className={`text-xs text-center mt-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {lang.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
