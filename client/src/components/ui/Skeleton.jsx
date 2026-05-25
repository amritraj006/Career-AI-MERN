import React from 'react';

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse rounded bg-slate-200/80 ${className}`}
      {...props}
    />
  );
};

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-premium space-y-4">
    <div className="flex items-center space-x-4">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <div className="space-y-2 pt-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
    </div>
  </div>
);

export const StatsSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-premium flex flex-col justify-between h-32">
    <div className="flex justify-between items-start">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="w-8 h-8 rounded-lg" />
    </div>
    <Skeleton className="h-8 w-2/3" />
  </div>
);

export const ListSkeleton = ({ rows = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center space-x-3 py-2 border-b border-slate-50 last:border-0">
        <Skeleton className="w-5 h-5 rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-2 w-1/4" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
