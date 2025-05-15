
import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface LogoProps {
  variant?: 'default' | 'white';
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ variant = 'default', showIcon = true, size = 'md' }: LogoProps) => {
  const textColor = variant === 'white' ? 'text-white' : 'text-trioguard';
  
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };
  
  const iconSizes = {
    sm: 18,
    md: 24,
    lg: 30,
  };

  return (
    <div className="flex items-center">
      {showIcon && (
        <div className={`mr-2 ${variant === 'white' ? 'text-white' : 'text-trioguard'}`}>
          <ShieldCheck size={iconSizes[size]} className="animate-pulse-soft" />
        </div>
      )}
      <span className={`font-bold ${textColor} ${sizeClasses[size]} tracking-tight`}>
        <span>Trio</span>
        <span className="font-extrabold">Guard</span>
      </span>
    </div>
  );
};

export default Logo;
