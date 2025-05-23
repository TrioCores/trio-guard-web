
import React from 'react';
import { Loader } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-trioguard-bg">
      <div className="text-center animate-fade-in-up">
        <div className="relative mb-6">
          <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center">
            <Loader size={30} className="text-trioguard animate-spin" />
          </div>
          <div className="absolute inset-0 rounded-full bg-trioguard-light/20 animate-ping opacity-75"></div>
        </div>
        <h2 className="text-xl font-medium text-trioguard-dark">Loading dashboard...</h2>
        <p className="text-trioguard-dark/60 mt-2">Just a moment while we prepare your experience</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
