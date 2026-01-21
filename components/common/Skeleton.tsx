
import React from 'react';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
};

export const TurfCardSkeleton = () => (
  <div className="bg-white dark:bg-darkcard rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden h-[380px]">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-5 space-y-4">
       <div className="flex justify-between">
         <Skeleton className="h-6 w-3/4" />
         <Skeleton className="h-6 w-10" />
       </div>
       <Skeleton className="h-4 w-1/2" />
       <div className="flex gap-2">
         <Skeleton className="h-6 w-16" />
         <Skeleton className="h-6 w-16" />
       </div>
       <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
         <Skeleton className="h-8 w-24" />
         <Skeleton className="h-10 w-28 rounded-xl" />
       </div>
    </div>
  </div>
);

export const LeaderboardSkeleton = () => (
    <div className="flex items-center p-4 border-b border-gray-50 dark:border-gray-800">
        <Skeleton className="w-8 h-8 mr-4" />
        <Skeleton className="w-10 h-10 rounded-full mr-4" />
        <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-6 w-12" />
    </div>
);

export const MatchSkeleton = () => (
    <div className="bg-white dark:bg-darkcard p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-24 flex items-center gap-4">
         <Skeleton className="w-14 h-14 rounded-xl" />
         <div className="flex-1 space-y-2">
             <Skeleton className="h-5 w-40" />
             <Skeleton className="h-3 w-24" />
         </div>
    </div>
);

export default Skeleton;
