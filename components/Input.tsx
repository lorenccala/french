import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, id, type = "text", className, containerClassName, icon, ...props }) => {
  return (
    <div className={`flex flex-col ${containerClassName || ''}`}>
      {label && <label htmlFor={id} className="mb-1.5 text-sm font-medium text-slate-600">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">{icon}</div>}
        <input
          id={id}
          type={type}
          className={`block w-full ${icon ? 'pl-10' : 'pl-3.5'} pr-3.5 py-2.5 text-base text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed disabled:border-slate-200 ${className || ''}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;