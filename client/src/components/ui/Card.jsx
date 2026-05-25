import React from 'react';

export const Card = React.forwardRef(({ className = '', variant = 'default', hover = false, ...props }, ref) => {
  const baseStyle = 'rounded-2xl border bg-white text-slate-900 transition-all duration-300';
  const variants = {
    default: 'border-slate-100 shadow-premium',
    ghost: 'border-transparent bg-transparent',
    glass: 'glass border-slate-100 shadow-premium',
    borderGlow: 'border-slate-200 shadow-premium hover:border-primary/20 hover:shadow-primary/5',
  };
  const hoverStyle = hover ? 'hover:shadow-premium-hover hover:-translate-y-0.5' : '';

  return (
    <div
      ref={ref}
      className={`${baseStyle} ${variants[variant]} ${hoverStyle} ${className}`}
      {...props}
    />
  );
});
Card.displayName = 'Card';

export const CardHeader = ({ className = '', ...props }) => (
  <div className={`p-6 pb-3 flex flex-col space-y-1.5 ${className}`} {...props} />
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = ({ className = '', ...props }) => (
  <h3 className={`text-lg font-bold tracking-tight text-slate-950 ${className}`} {...props} />
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = ({ className = '', ...props }) => (
  <p className={`text-sm text-slate-500 font-medium ${className}`} {...props} />
);
CardDescription.displayName = 'CardDescription';

export const CardContent = ({ className = '', ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props} />
);
CardContent.displayName = 'CardContent';

export const CardFooter = ({ className = '', ...props }) => (
  <div className={`p-6 pt-0 flex items-center border-t border-slate-50 mt-4 ${className}`} {...props} />
);
CardFooter.displayName = 'CardFooter';

export default Card;
