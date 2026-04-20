import React from 'react';



// Loading skeleton component for the Splitter workspace
const Skeleton: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50">
      {/* Header skeleton */}
      <header className="h-16 bg-white flex items-center justify-between px-6 border-b border-slate-200">
        <div className="w-32 h-6 rounded bg-slate-100 animate-pulse" />
        <div className="flex gap-4">
          <div className="w-24 h-9 rounded-lg bg-slate-100 animate-pulse" />
          <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" />
        </div>
      </header>
      
      {/* Workspace partitions skeleton */}
      <div className="flex-1 flex p-6 gap-6">
        <div className="flex-1 rounded-2xl bg-white border border-slate-200 shadow-sm animate-pulse" />
        <div className="flex-1 rounded-2xl bg-white border border-slate-200 shadow-sm animate-pulse" />
      </div>
    </div>
  );
};

export default Skeleton;
