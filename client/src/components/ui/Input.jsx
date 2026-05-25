import React from 'react';

export const Input = React.forwardRef(({
  className = '',
  type = 'text',
  label = '',
  description = '',
  error = '',
  leftIcon = null,
  rightIcon = null,
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col space-y-1.5">
      {label && (
        <label className="text-sm font-semibold text-slate-800 tracking-tight">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:bg-slate-50
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-red-300 focus:ring-red-200 focus:border-red-500' : 'border-slate-200 focus:ring-primary/20 focus:border-primary'}
            ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 text-slate-400 flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {!error && description && <p className="text-xs text-slate-400 font-medium">{description}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
