
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.430a97ab74954e4ab297aa7eb9223156',
  appName: 'learnwave-social-academy',
  webDir: 'dist',
  server: {
    url: 'https://430a97ab-7495-4e4a-b297-aa7eb9223156.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
