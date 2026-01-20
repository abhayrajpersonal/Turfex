
import React from 'react';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`} />
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

export default Skeleton;
