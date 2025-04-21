
import React from "react";
import { Cloud, Sun } from "lucide-react";

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="relative mb-12">
        <div className="animate-pulse absolute inset-0 rounded-full bg-blue-400/30 backdrop-blur-sm scale-150"></div>
        <div className="flex items-center gap-2 relative">
          <div className="animate-bounce-slow delay-150">
            <Sun className="h-16 w-16 text-yellow-300 drop-shadow-lg" />
          </div>
          <div className="animate-bounce-slow">
            <Cloud className="h-20 w-20 text-white drop-shadow-lg" />
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold text-white mb-2">Hava Durumu Yükleniyor</h2>
      <p className="text-blue-100 mb-8">Lütfen istenirse konum erişimine izin verin</p>
      
      <div className="mt-8 space-y-4 w-full max-w-md bg-white/10 p-6 rounded-xl backdrop-blur-md border border-white/20 shadow-xl">
        <div className="h-8 bg-white/20 rounded-md animate-pulse"></div>
        <div className="h-32 bg-white/20 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="h-24 bg-white/20 rounded-md animate-pulse"></div>
          <div className="h-24 bg-white/20 rounded-md animate-pulse"></div>
          <div className="h-24 bg-white/20 rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
