import { WeatherDashboard } from './dashboard/components/weather-dashboard';
import { EmailVerificationHandler } from './email-verification-handler';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <EmailVerificationHandler />
      <WeatherDashboard />
    </div>
  );
}
