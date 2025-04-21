
import { useState, useEffect } from "react";
import { toast } from "../components/ui/use-toast";

interface Location {
  latitude: number;
  longitude: number;
  error?: string;
  isLoading: boolean;
}

export function useGeolocation() {
  const [location, setLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
    isLoading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({
        ...location,
        error: "Tarayıcınız konum özelliğini desteklemiyor",
        isLoading: false,
      });
      toast({
        title: "Konum Hatası",
        description: "Tarayıcınız konum özelliğini desteklemiyor",
        variant: "destructive",
      });
      return;
    }

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    const geoSuccess = (position: GeolocationPosition) => {
      console.log("Geolocation success:", position.coords);
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        isLoading: false,
      });
      toast({
        title: "Konum Bulundu",
        description: "Konumunuz başarıyla alındı",
      });
    };

    const geoError = (error: GeolocationPositionError) => {
      console.error("Geolocation error:", error);
      setLocation({
        ...location,
        error: `Konumunuz alınamıyor: ${error.message}`,
        isLoading: false,
      });
      toast({
        title: "Konum Hatası",
        description: `Konumunuz alınamıyor: ${error.message}`,
        variant: "destructive",
      });
    };

    // Konum isteği gönder
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);

    // Temizleme fonksiyonu
    return () => {
      // getCurrentPosition için temizlemeye gerek yok
      console.log("Geolocation hook cleanup");
    };
  }, []);

  return location;
}
