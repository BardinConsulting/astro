import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.astrovision.app",
  appName: "AstroVision",
  webDir: "out",
  // For production: point to your deployed URL instead of localhost
  server: {
    // Uncomment for live development:
    // url: "http://192.168.1.100:3000",
    // cleartext: true,
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    backgroundColor: "#0a0015",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#0a0015",
      androidSplashResourceName: "splash",
      showSpinner: false,
    },
    StatusBar: {
      style: "Dark",
      backgroundColor: "#0a0015",
    },
  },
};

export default config;
