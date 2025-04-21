
import { useQuery } from "@tanstack/react-query";
import { toast } from "../components/ui/use-toast";

/* Open-Meteo API:
   https://open-meteo.com/en/docs
   Hava durumu verileri için toplu günlük veriler (5 gün) alınacak.
*/

interface WeatherData {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    dt: number;
  };
  daily: {
    dt: number;
    temp: {
      min: number;
      max: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
  }[];
  timezone_offset: number;
}

// Hava durumu ID ve açıklamaları için yardımcı fonksiyonlar
const getWeatherMeta = (code: number) => {
  // Open-Meteo WMO kodları: https://open-meteo.com/en/docs#api-formats
  // En popüler olanları eşleştiriyoruz:
  const meta: Record<number, {main: string; description: string; icon: string}> = {
    0: { main: "Clear", description: "Açık", icon: "sun" },
    1: { main: "Mainly Clear", description: "Az bulutlu", icon: "cloud-sun" },
    2: { main: "Partly Cloudy", description: "Parçalı bulutlu", icon: "cloud-sun" },
    3: { main: "Cloudy", description: "Çok bulutlu", icon: "cloud" },
    45: { main: "Fog", description: "Sisli", icon: "cloud" },
    48: { main: "Depositing rime fog", description: "Dona Dönüşen Sis", icon: "cloud" },
    51: { main: "Light Drizzle", description: "Çisenti", icon: "cloud-rain" },
    53: { main: "Drizzle", description: "Çisenti", icon: "cloud-rain" },
    55: { main: "Dense Drizzle", description: "Yoğun Çisenti", icon: "cloud-rain" },
    61: { main: "Slight Rain", description: "Hafif yağmur", icon: "cloud-rain" },
    63: { main: "Rain", description: "Yağmurlu", icon: "cloud-rain" },
    65: { main: "Heavy Rain", description: "Şiddetli yağmur", icon: "cloud-rain" },
    80: { main: "Rain Showers", description: "Sağanak yağmurlu", icon: "cloud-rain" },
    81: { main: "Heavy Showers", description: "Kuvvetli sağanak", icon: "cloud-rain" },
    82: { main: "Violent Showers", description: "Şiddetli sağanak", icon: "cloud-rain" },
    71: { main: "Light Snow", description: "Hafif kar", icon: "cloud" },
    73: { main: "Snow", description: "Karlı", icon: "cloud" },
    75: { main: "Heavy Snow", description: "Yoğun kar", icon: "cloud" },
    95: { main: "Thunderstorm", description: "Gök gürültülü fırtına", icon: "cloud" },
    96: { main: "Thunderstorm with Hail", description: "Dolu fırtına", icon: "cloud" },
    99: { main: "Thunderstorm with Heavy Hail", description: "Şiddetli dolu fırtına", icon: "cloud" },
  };
  return meta[code] ?? { main: "Unknown", description: "Bilinmeyen", icon: "cloud" };
};

function transformWeatherData(apiData: any): WeatherData {
  // Günlük dizi uzunluğu minimum 5 günü kapsar.
  // open-meteo şu günlük endpointleri sağlar: temperature_2m_max, min, weathercode, precipitation_sum, windspeed_10m_max
  const currentIdx = 0; // ilk gün

  const currentWeather = {
    temp: apiData.current.temperature_2m,
    feels_like: apiData.current.apparent_temperature,
    humidity: apiData.current.relative_humidity_2m,
    wind_speed: apiData.current.wind_speed_10m,
    weather: [
      {
        id: apiData.current.weather_code,
        main: getWeatherMeta(apiData.current.weather_code).main,
        description: getWeatherMeta(apiData.current.weather_code).description,
        icon: getWeatherMeta(apiData.current.weather_code).icon,
      },
    ],
    dt: Date.parse(apiData.current.time) / 1000,
  };

  const dailyForecast = apiData.daily.time.map((date: string, i: number) => {
    return {
      dt: Date.parse(date) / 1000,
      temp: {
        min: apiData.daily.temperature_2m_min[i],
        max: apiData.daily.temperature_2m_max[i],
      },
      weather: [
        {
          id: apiData.daily.weather_code[i],
          main: getWeatherMeta(apiData.daily.weather_code[i]).main,
          description: getWeatherMeta(apiData.daily.weather_code[i]).description,
          icon: getWeatherMeta(apiData.daily.weather_code[i]).icon,
        },
      ],
    };
  });

  // Open-Meteo'dan timezone offset'i alabiliyoruz (saniye cinsinden)
  const timezone_offset =
    apiData.utc_offset_seconds !== undefined
      ? apiData.utc_offset_seconds
      : new Date().getTimezoneOffset() * -60;

  return {
    current: currentWeather,
    daily: dailyForecast,
    timezone_offset,
  };
}

export function useWeather(latitude: number, longitude: number) {
  const fetchWeather = async (): Promise<WeatherData> => {
    if (!latitude || !longitude) throw new Error("Geçersiz konum");

    // open-meteo api dökümanı: https://open-meteo.com/en/docs
    // Günlük ve mevcut hava durumu endpointleri birlikte request ediliyor.
    // "Turkey" timezone örnek: "Europe/Istanbul"
    const params = [
      `latitude=${latitude}`,
      `longitude=${longitude}`,
      "current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m",
      "hourly=temperature_2m,apparent_temperature,precipitation,weather_code",
      "daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,windspeed_10m_max",
      "forecast_days=6",
      "timezone=auto",
    ].join("&");

    const url = `https://api.open-meteo.com/v1/forecast?${params}`;
    const response = await fetch(url, { headers: {} });

    if (!response.ok) {
      throw new Error("Open-Meteo'dan hava durumu verileri alınamıyor");
    }
    const data = await response.json();

    // Open-Meteo arayüzü bazen eksik veri getirebilir. Validasyon:
    if (
      !data.current ||
      !data.daily ||
      !Array.isArray(data.daily.temperature_2m_min)
    ) {
      throw new Error("Hava durumu verileri eksik");
    }

    return transformWeatherData(data);
  };

  return useQuery({
    queryKey: ["weather-open-meteo", latitude, longitude],
    queryFn: fetchWeather,
    enabled: latitude !== 0 && longitude !== 0,
    retry: 1,
    refetchOnWindowFocus: false,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Hava Durumu Veri Hatası",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  });
}

// src/hooks/useWeather.tsx dosyası oldukça uzamaya başladı (150+ satır). Bir sonraki düzenlemede küçük parçalara ayırmanızı öneririm.
