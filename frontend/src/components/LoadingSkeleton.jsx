import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="flex-none w-44 md:w-56 h-64 md:h-80 bg-neutral-900/80 rounded-lg overflow-hidden border border-white/5 relative">
      <div className="absolute inset-0 shimmer-effect" />
      <div className="p-4 flex flex-col justify-between h-full">
        <div className="w-12 h-4 bg-neutral-800 rounded" />
        <div className="w-32 h-32 md:w-40 md:h-40 mx-auto bg-neutral-800/60 rounded-full my-auto" />
        <div className="space-y-2">
          <div className="w-3/4 h-5 bg-neutral-800 rounded" />
          <div className="flex gap-2">
            <div className="w-14 h-4 bg-neutral-800 rounded-full" />
            <div className="w-14 h-4 bg-neutral-800 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const RowSkeleton = ({ count = 6 }) => {
  return (
    <div className="px-6 md:px-12 my-6">
      <div className="w-48 h-6 bg-neutral-800 rounded mb-3" />
      <div className="flex gap-4 overflow-hidden">
        {[...Array(count)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export const HeroSkeleton = () => {
  return (
    <div className="relative w-full h-[75vh] md:h-[85vh] bg-neutral-900 overflow-hidden">
      <div className="absolute inset-0 shimmer-effect" />
      <div className="absolute bottom-16 left-6 md:left-12 max-w-xl space-y-4">
        <div className="w-24 h-6 bg-neutral-800 rounded" />
        <div className="w-72 md:w-96 h-12 bg-neutral-800 rounded" />
        <div className="flex gap-2">
          <div className="w-20 h-6 bg-neutral-800 rounded-full" />
          <div className="w-20 h-6 bg-neutral-800 rounded-full" />
        </div>
        <div className="w-full h-16 bg-neutral-800/80 rounded" />
        <div className="flex gap-4 pt-2">
          <div className="w-32 h-11 bg-neutral-800 rounded" />
          <div className="w-32 h-11 bg-neutral-800 rounded" />
        </div>
      </div>
    </div>
  );
};

export const GridSkeleton = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="w-full h-64 md:h-80 bg-neutral-900/80 rounded-lg overflow-hidden border border-white/5 relative"
        >
          <div className="absolute inset-0 shimmer-effect" />
          <div className="p-4 flex flex-col justify-between h-full">
            <div className="w-10 h-4 bg-neutral-800 rounded" />
            <div className="w-28 h-28 mx-auto bg-neutral-800/60 rounded-full my-auto" />
            <div className="space-y-2">
              <div className="w-3/4 h-5 bg-neutral-800 rounded" />
              <div className="flex gap-2">
                <div className="w-12 h-4 bg-neutral-800 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default {
  CardSkeleton,
  RowSkeleton,
  HeroSkeleton,
  GridSkeleton,
};
