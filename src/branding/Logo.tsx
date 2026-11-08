import React from 'react';
import { BRAND_CONFIG } from './brandConfig';

export interface LogoProps {
  variant?: 'full' | 'horizontal' | 'icon' | 'mark';
  theme?: 'light' | 'dark' | 'navy';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  theme = 'light',
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  // Dimensions
  const iconSizes = {
    sm: 28,
    md: 36,
    lg: 44,
    xl: 56,
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const iconDim = iconSizes[size];

  // Color mappings based on theme
  const textColor =
    theme === 'dark' || theme === 'navy' ? 'text-white' : 'text-brand-navy';
  const taglineColor =
    theme === 'dark' || theme === 'navy'
      ? 'text-slate-300'
      : 'text-slate-500';

  const Mark = (
    <svg
      width={iconDim}
      height={iconDim}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      aria-label={`${BRAND_CONFIG.name} Symbol`}
    >
      <rect
        width="64"
        height="64"
        rx="16"
        fill={theme === 'navy' ? '#1E3E6B' : '#142D4E'}
      />
      <defs>
        <linearGradient
          id={`m-grad-${size}-${theme}`}
          x1="12"
          y1="12"
          x2="52"
          y2="52"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3563E9" />
          <stop offset="1" stopColor="#0F9D8A" />
        </linearGradient>
        <linearGradient
          id={`coin-grad-${size}-${theme}`}
          x1="26"
          y1="16"
          x2="38"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#16A36A" />
        </linearGradient>
      </defs>

      {/* Geometric Letter M */}
      <path
        d="M15 48V20C15 17.7909 16.7909 16 19 16H21C22.6569 16 24 17.3431 24 19V38L32 29L40 38V19C40 17.3431 41.3431 16 43 16H45C47.2091 16 49 17.7909 49 20V48C49 49.6569 47.6569 51 46 51C44.3431 51 43 49.6569 43 48V28.5L34.1213 37.3787C32.9497 38.5503 31.0503 38.5503 29.8787 37.3787L21 28.5V48C21 49.6569 19.6569 51 18 51C16.3431 51 15 49.6569 15 48Z"
        fill={`url(#m-grad-${size}-${theme})`}
      />

      {/* Subtle Embedded Coin / Wallet Clasp */}
      <circle cx="32" cy="22" r="5" fill={`url(#coin-grad-${size}-${theme})`} />
      <circle cx="32" cy="22" r="2.2" fill="#FFFFFF" fillOpacity="0.9" />
      <path
        d="M30.5 22H33.5"
        stroke="#16A36A"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === 'icon' || variant === 'mark') {
    return <div className={`inline-flex items-center ${className}`}>{Mark}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {Mark}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight font-sans ${textSizes[size]} ${textColor}`}
          >
            {BRAND_CONFIG.name}
          </span>
          <span className="inline-block w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
        </div>
        {showTagline && (
          <span
            className={`text-xs font-medium tracking-wide mt-0.5 ${taglineColor}`}
          >
            {BRAND_CONFIG.tagline}
          </span>
        )}
      </div>
    </div>
  );
};
export default Logo;
