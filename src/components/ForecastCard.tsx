
import React from "react";
import { Cloud, CloudRain, CloudSun, Sun } from "lucide-react";

interface ForecastCardProps {
  date: number;
  minTemp: number;
  maxTemp: number;
  icon: string;
  description: string;
}

const ForecastCard: React.FC<ForecastCardProps> = ({
  date,
  minTemp,
  maxTemp,
  icon,
  description,
}) => {
  // Gün adını almak için fonksiyon
  const getDayName = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('tr-TR', { weekday: "short" });
  };

  // Uygun hava durumu ikonunu seçmek için fonksiyon
  const getWeatherIcon = () => {
    if (icon.includes("day/113")) { // Açık gündüz
      return <Sun className="h-10 w-10 text-yellow-300" />;
    } else if (icon.includes("night/113")) { // Açık gece
      return <Sun className="h-10 w-10 text-blue-200" />;
    } else if (icon.includes("day/116") || icon.includes("day/119")) { // Parçalı bulutlu gündüz
      return <CloudSun className="h-10 w-10 text-blue-300" />;
    } else if (icon.includes("rain") || icon.includes("drizzle")) { // Yağmurlu
      return <CloudRain className="h-10 w-10 text-blue-400" />;
    } else {
      return <Cloud className="h-10 w-10 text-gray-300" />;
    }
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
    <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/20 overflow-hidden shadow-lg transition-transform hover:scale-105">
      <div className="p-4 flex flex-col items-center">
        <span className="text-sm font-medium text-white bg-indigo-700/40 px-3 py-1 rounded-full mb-3">
          {getDayName(date)}
        </span>
        <div className="bg-indigo-600/20 rounded-full p-2.5 my-2 border border-white/10">
          {getWeatherIcon()}
        </div>
        <p className="text-xs text-blue-50 capitalize my-2.5 text-center h-8 flex items-center">
          {translateDescription(description)}
        </p>
        <div className="flex justify-between w-full mt-2 items-baseline">
          <span className="text-blue-200 text-xs">{minTemp.toFixed(0)}°</span>
          <span className="text-white font-medium text-lg">{maxTemp.toFixed(0)}°</span>
        </div>
      </div>
    </div>
  );
};

export default ForecastCard;
