
import React from 'react';
import { Turf } from '../../../lib/types';
import TurfCard from '../../../components/TurfCard';
import { TurfCardSkeleton } from '../../../components/common/Skeleton';

interface TurfGridProps {
  turfs: Turf[];
  isLoading: boolean;
  onBook: (turf: Turf) => void;
  onClearFilters: () => void;
}

const TurfGrid: React.FC<TurfGridProps> = ({ turfs, isLoading, onBook, onClearFilters }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array(6).fill(0).map((_, i) => <TurfCardSkeleton key={i} />)}
      </div>
    );
  }

  if (turfs.length === 0) {
    return (
      <div className="col-span-full text-center py-20 bg-white dark:bg-darkcard rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
        <p className="text-gray-400 font-bold">No turfs found matching your filters.</p>
        <button onClick={onClearFilters} className="text-blue-500 text-sm font-bold mt-2">Clear all filters</button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {turfs.map(turf => (
        <TurfCard key={turf.id} turf={turf} onBook={() => onBook(turf)} />
      ))}
    </div>
  );
};

export default TurfGrid;
