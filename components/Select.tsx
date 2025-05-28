import React from 'react';
import { ChevronDownIcon } from 'lucide-react'; // Example

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string | number; label: string }[];
  containerClassName?: string;
  icon?: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, options, id, className, containerClassName, icon, ...props }) => {
  return (
    <div className={`flex flex-col ${containerClassName || ''}`}>
      {label && <label htmlFor={id} className="mb-1.5 text-sm font-medium text-slate-600">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">{icon}</div>}
        <select
          id={id}
          className={`appearance-none block w-full ${icon ? 'pl-10' : 'pl-3.5'} pr-10 py-2.5 text-base text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed disabled:border-slate-200 ${className || ''}`}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
          {/* Using a simple SVG chevron, or replace with Lucide/Heroicon */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </div>
  );
};

export default Select;