
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-trioguard-bg">
      <div className="text-center">
        <div className="animate-pulse-soft inline-flex items-center justify-center p-4 bg-white rounded-full shadow-md mb-4">
          <div className="w-8 h-8 text-trioguard">Loading...</div>
        </div>
        <h2 className="text-xl font-medium text-trioguard-dark">Loading dashboard...</h2>
      </div>
    </div>
  );
};

export default LoadingScreen;
