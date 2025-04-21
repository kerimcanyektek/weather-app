
import React from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import { useWeather } from "../hooks/useWeather";
import LoadingState from "./LoadingState";
import WeatherCard from "./WeatherCard";
import ForecastCard from "./ForecastCard";
import LocationBanner from "./LocationBanner";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

const WeatherDisplay: React.FC = () => {
  const location = useGeolocation();
  const { data: weatherData, isLoading, isError, error, refetch, isFetching } = useWeather(
    location.latitude,
    location.longitude
  );

  console.log("Weather data:", weatherData);
  console.log("Location:", location);
  
  if (location.isLoading || isLoading) {
    return <LoadingState />;
  }

  if (location.error || isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <div className="backdrop-blur-md bg-red-500/20 border border-red-400/30 rounded-xl p-8 max-w-md shadow-lg">
          <AlertCircle className="text-red-400 h-12 w-12 mb-4 mx-auto" />
          <h2 className="text-xl font-semibold text-white mb-2 text-center">Hava Durumu Yüklenemiyor</h2>
          <p className="text-center text-red-100 mb-6">
            {location.error || (error as Error)?.message || "Bilinmeyen bir hata oluştu."}
          </p>
          <div className="flex justify-center">
            <Button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-600">
              Tekrar Dene
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (weatherData) {
    // İlk gün bugünün kendisi, kalanlar tahmin (API bazen 2-3 günlük döndürebiliyor)
    const forecastDays = weatherData.daily.length > 1
      ? weatherData.daily.slice(1, Math.min(6, weatherData.daily.length)) // En çok 5 gün, bugünkü hariç
      : [];

    return (
      <div className="py-6 max-w-4xl mx-auto">
        <LocationBanner 
          lat={location.latitude} 
          lon={location.longitude} 
          timezone_offset={weatherData.timezone_offset}
        />

        <div className="mb-8">
          <WeatherCard
            temp={weatherData.current.temp}
            feelsLike={weatherData.current.feels_like}
            humidity={weatherData.current.humidity}
            windSpeed={weatherData.current.wind_speed}
            description={weatherData.current.weather[0].description}
            icon={weatherData.current.weather[0].icon}
            dt={weatherData.current.dt}
          />
        </div>

        <div className="mt-10">
          <h3 className="font-medium text-white text-lg mb-5 px-1">
            <span className="bg-indigo-700/40 backdrop-blur-sm py-2 px-4 rounded-lg border-t border-white/20 shadow-md">5 Günlük Tahmin</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {forecastDays.length === 0 ? (
              <div className="col-span-5 text-center text-blue-200 text-sm py-7 bg-white/10 rounded-xl">
                Yeterli tahmin verisi yok.
              </div>
            ) : (
              forecastDays.map((day) => (
                <ForecastCard
                  key={day.dt}
                  date={day.dt}
                  minTemp={day.temp.min}
                  maxTemp={day.temp.max}
                  icon={day.weather[0].icon}
                  description={day.weather[0].description}
                />
              ))
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button 
            variant="outline" 
            onClick={() => refetch()} 
            className="backdrop-blur-md bg-white/10 hover:bg-white/20 text-white border-white/20 gap-2"
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Hava Durumunu Güncelle
          </Button>
          <p className="text-xs text-white/80 mt-4 backdrop-blur-sm bg-indigo-900/30 inline-block py-1.5 px-3 rounded-full border border-indigo-400/20">
            Hava Durumu verileri Open-Meteo API tarafından sağlanmaktadır
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default WeatherDisplay;

