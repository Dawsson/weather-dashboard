import { WeatherDashboard } from './components/weather-dashboard';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-800">
      <WeatherDashboard />
    </div>
  );
}
