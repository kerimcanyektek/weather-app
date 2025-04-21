
import React from "react";
import { MapPin } from "lucide-react";

interface LocationBannerProps {
  lat: number;
  lon: number;
  timezone_offset?: number;
}

const LocationBanner: React.FC<LocationBannerProps> = ({ lat, lon, timezone_offset = 0 }) => {
  // Konumun yerel saatini formatla
  const getLocalTime = () => {
    const date = new Date();
    const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
    const localTime = new Date(utcTime + timezone_offset * 1000);
    return localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-3 flex items-center justify-between gap-3 shadow-lg mb-6">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600/40 p-2.5 rounded-full">
          <MapPin className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="font-medium text-white text-sm">Konumunuz</span> 
          <span className="text-xs text-blue-100 ml-1.5 opacity-80">
            ({lat.toFixed(4)}, {lon.toFixed(4)})
          </span>
        </div>
      </div>
      <div className="text-right">
        <div className="bg-indigo-900/30 py-1.5 px-3 rounded-full border border-indigo-400/20">
          <span className="text-xs font-medium text-blue-100 opacity-90">Yerel saat:</span>
          <span className="ml-1.5 text-sm font-bold text-white">{getLocalTime()}</span>
        </div>
      </div>
    </div>
  );
};

export default LocationBanner;
