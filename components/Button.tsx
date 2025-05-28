import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'alert' | 'ghost' | 'subtle' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children?: React.ReactNode; // Children are optional if it's an icon button
  icon?: React.ReactNode; // Can be a Heroicon component or any JSX
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  loading = false,
  ...props
}) => {
  const baseStyles = "font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 ease-in-out flex items-center justify-center group active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow hover:shadow-md";
  
  let variantStyles = "";
  switch (variant) {
    case 'primary':
      variantStyles = "bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500 disabled:bg-sky-400";
      break;
    case 'secondary':
      variantStyles = "bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-400 disabled:bg-teal-300";
      break;
    case 'alert':
      variantStyles = "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400";
      break;
    case 'ghost':
      variantStyles = "bg-transparent text-sky-600 border border-sky-500 hover:bg-sky-50 focus:ring-sky-500 shadow-none hover:shadow-none";
      break;
    case 'subtle':
      variantStyles = "bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-slate-400 shadow-none";
      break;
    case 'link':
      variantStyles = "bg-transparent text-sky-600 hover:text-sky-700 hover:underline focus:ring-sky-500 shadow-none";
      break;
  }

  let sizeStyles = "";
  let iconSizeClasses = "w-5 h-5"; // Default for md
  switch (size) {
    case 'sm':
      sizeStyles = "px-3 py-1.5 text-sm";
      iconSizeClasses = "w-4 h-4";
      break;
    case 'md':
      sizeStyles = "px-5 py-2.5 text-base";
      break;
    case 'lg':
      sizeStyles = "px-7 py-3.5 text-lg";
      iconSizeClasses = "w-6 h-6";
      break;
    case 'icon':
      sizeStyles = "p-2.5"; // Square padding for icon-only buttons
      break;
  }
  
  const widthStyles = fullWidth ? "w-full" : "";

  const iconMarkup = loading ? (
    <svg className={`animate-spin ${iconPosition === 'left' ? 'mr-2' : 'ml-2'} ${iconSizeClasses} text-white`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ) : icon ? (
    <span className={`${iconSizeClasses} ${children && size !== 'icon' ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : ''} group-hover:scale-110 transition-transform`}>{icon}</span>
  ) : null;

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${widthStyles} ${className || ''}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {iconPosition === 'left' && iconMarkup}
      {size !== 'icon' && children}
      {iconPosition === 'right' && iconMarkup}
    </button>
  );
};

export default Button;