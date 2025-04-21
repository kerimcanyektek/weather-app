
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WeatherDisplay from "../components/WeatherDisplay";
import { Toaster } from "../components/ui/toaster";

const queryClient = new QueryClient();

const Index = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 flex flex-col">
        <header className="py-6 px-4 sm:px-6 backdrop-blur-md bg-white/10 border-b border-white/20">
          <div className="max-w-5xl mx-auto flex items-center">
            <div className="flex flex-col gap-0.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Hava Durumu</h1>
              <p className="text-blue-50 text-sm">Güncel hava durumunuzu bir bakışta görün</p>
            </div>
          </div>
        </header>
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <WeatherDisplay />
        </main>
        
        <footer className="py-4 backdrop-blur-md bg-indigo-900/40 text-white text-center text-sm border-t border-white/10">
          <p className="max-w-5xl mx-auto">© 2025 Hava Durumu - Konum Tabanlı Hava Durumu Uygulaması</p>
        </footer>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
};

export default Index;
