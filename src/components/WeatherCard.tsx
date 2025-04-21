
import React from "react";
import { Cloud, CloudRain, CloudSun, Sun, Wind, Droplets, Thermometer } from "lucide-react";

interface WeatherCardProps {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  dt: number;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  temp,
  feelsLike,
  humidity,
  windSpeed,
  description,
  icon,
  dt,
}) => {
  // Uygun hava durumu ikonunu getir
  const getWeatherIcon = () => {
    if (icon.includes("day/113")) { // Açık gündüz
      return <Sun className="h-20 w-20 text-yellow-300 drop-shadow-lg" />;
    } else if (icon.includes("night/113")) { // Açık gece
      return <Sun className="h-20 w-20 text-blue-200 drop-shadow-lg" />;
    } else if (icon.includes("day/116") || icon.includes("day/119")) { // Parçalı bulutlu gündüz
      return <CloudSun className="h-20 w-20 text-blue-300 drop-shadow-lg" />;
    } else if (icon.includes("rain") || icon.includes("drizzle")) { // Yağmurlu
      return <CloudRain className="h-20 w-20 text-blue-400 drop-shadow-lg" />;
    } else {
      return <Cloud className="h-20 w-20 text-gray-300 drop-shadow-lg" />;
    }
  };

  // Tarihi formatla
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('tr-TR', {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  // Türkçe hava durumu açıklamaları
  const translateDescription = (desc: string) => {
    const translations: {[key: string]: string} = {
      "Clear": "Açık",
      "Sunny": "Güneşli",
      "Partly cloudy": "Parçalı Bulutlu",
      "Cloudy": "Bulutlu",
      "Overcast": "Kapalı",
      "Mist": "Sisli",
      "Patchy rain nearby": "Bölgesel Yağmur",
      "Patchy snow nearby": "Bölgesel Kar",
      "Patchy sleet nearby": "Bölgesel Karla Karışık Yağmur",
      "Patchy freezing drizzle nearby": "Bölgesel Dondurucu Çisenti",
      "Thundery outbreaks nearby": "Bölgesel Gök Gürültülü Fırtına",
      "Fog": "Sisli",
      "Freezing fog": "Dondurucu Sis",
      "Light rain": "Hafif Yağmurlu",
      "Moderate rain": "Orta Şiddetli Yağmur",
      "Heavy rain": "Şiddetli Yağmur",
      "Light snow": "Hafif Kar",
      "Moderate snow": "Orta Şiddetli Kar",
      "Heavy snow": "Yoğun Kar",
      "Light rain shower": "Hafif Sağanak Yağış",
      "Moderate or heavy rain shower": "Orta/Şiddetli Sağanak",
      "Light snow shower": "Hafif Kar Sağanağı",
      "Moderate or heavy snow shower": "Orta/Şiddetli Kar Sağanağı",
      "Partly Cloudy ": "Parçalı Bulutlu",
    };
    
    return translations[desc] || desc;
  };

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 overflow-hidden shadow-xl">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm font-medium text-blue-100">{formatDate(dt)}</p>
            <h2 className="text-5xl font-bold text-white mt-1.5 tracking-tight">{temp.toFixed(1)}°C</h2>
            <p className="text-blue-50 capitalize mt-1 text-lg font-medium">{translateDescription(description)}</p>
          </div>
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-indigo-600/30 to-blue-400/20 p-4 rounded-full shadow-inner border border-white/20">
              {getWeatherIcon()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="flex flex-col items-center backdrop-blur-md bg-white/5 p-3 rounded-xl border border-white/10 shadow-lg">
            <Thermometer className="h-6 w-6 text-orange-300 mb-1.5" />
            <span className="text-xs text-blue-100 mb-0.5">Hissedilen</span>
            <span className="font-medium text-lg text-white">{feelsLike.toFixed(1)}°C</span>
          </div>
          <div className="flex flex-col items-center backdrop-blur-md bg-white/5 p-3 rounded-xl border border-white/10 shadow-lg">
            <Droplets className="h-6 w-6 text-blue-300 mb-1.5" />
            <span className="text-xs text-blue-100 mb-0.5">Nem</span>
            <span className="font-medium text-lg text-white">{humidity}%</span>
          </div>
          <div className="flex flex-col items-center backdrop-blur-md bg-white/5 p-3 rounded-xl border border-white/10 shadow-lg">
            <Wind className="h-6 w-6 text-blue-200 mb-1.5" />
            <span className="text-xs text-blue-100 mb-0.5">Rüzgar</span>
            <span className="font-medium text-lg text-white">{windSpeed.toFixed(1)} m/s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
