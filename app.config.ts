import { ExpoConfig, ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  let extra = {
    eas: {
      projectId: "", //projectId
    },
    baseURL: "", // API Base URL
  };

  // Load local development configuration
  // https://docs.expo.dev/build-reference/variables/#how-do-environment-variables-work-for-my
  if (process.env.EAS_BUILD_PROFILE !== "appstore") {
    const { readFileSync, existsSync } = require("node:fs");

    if (existsSync(".env")) {
      const devConfig = require("dotenv").parse(readFileSync(".env", "utf8"));
      extra = { ...extra, ...devConfig };
    } else {
      console.error(
        "\n⛔️ Provide a development `.env` file by copying `.env.sample`.\n"
      );
      // extra.baseURL = '' // Clear BaseURL
    }

    // console.log('✅App running with config:\n', JSON.stringify(Config, undefined, 2), '\n')
  }

  return {
    ...config,

    name: "Aro",
    slug: "aro-mobile",
    owner: "aro-technology",
    version: "0.1.20",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    notification: {
      icon: "./assets/images/notification-icon.png",
      color: "#0b0805",
    },
    scheme: "goaro",
    userInterfaceStyle: "automatic",
    jsEngine: "hermes",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#0b0805",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      associatedDomains: [
        "applinks:example.page.link",
        "applinks:applink.example.com",
      ],
      supportsTablet: false,
      bundleIdentifier: "com.aro.mobile.dev",
      googleServicesFile: "./GoogleService-Info.plist",
      infoPlist: {
        UIBackgroundModes: [
          "bluetooth-central",
          "location",
          "fetch",
          "processing",
        ],
        NSLocationAlwaysUsageDescription:
          "Aro uses your location to detect placement in the Aro smart box.",
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "Aro uses your location to detect placement in the Aro smart box.",
        NSLocationWhenInUseUsageDescription:
          "Aro uses your location to detect placement in the Aro smart box.",
        NSCameraUsageDescription:
          "Aro lets you upload a profile picture to your account.",
        NSPhotoLibraryUsageDescription:
          "Aro lets you upload a profile picture to your account.",
        FirebaseDynamicLinksCustomDomains: [
          "https://applink.example.com/",
          "https://example.page.link/",
        ],
        BGTaskSchedulerPermittedIdentifiers: [
          "com.transistorsoft.fetch",
          "com.transistorsoft.customtask",
        ],
      },
      buildNumber: "3",
    },
    android: {
      package: "com.aro.mobile.dev",
      versionCode: 53,
      googleServicesFile: "./google-services.json",
      permissions: [
        "ACCESS_BACKGROUND_LOCATION",
        "ACCESS_FINE_LOCATION",
        "BLUETOOTH_SCAN",
        "BLUETOOTH_ADMIN",
        "BLUETOOTH_CONNECT",
        "RECEIVE_BOOT_COMPLETED",
        "SCHEDULE_EXACT_ALARM",
      ],
      icon: "./assets/images/icon.png",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#0b0805",
      },
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "https",
              host: "applink.example.com",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },
    androidNavigationBar: {
      backgroundColor: "#121212",
    },
    plugins: [
      "react-native-background-fetch",
      [
        "react-native-background-geolocation",
        {
          license:
            "53575542fcde5eb5780ffc610112e546df6e6882eb34e87488c9389139b14f3c",
        },
      ],
      "./plugins/react-native-background-actions",
      "./plugins/react-native-beacons-manager",
      [
        "@config-plugins/react-native-ble-plx",
        {
          isBackgroundEnabled: true,
          modes: ["central"],
          bluetoothAlwaysPermission:
            "Allow $(PRODUCT_NAME) to connect to Aro smart box devices",
          bluetoothPeripheralPermission:
            "Allow $(PRODUCT_NAME) to connect to Aro smart box devices",
        },
      ],
      "react-native-email-link",
      "@react-native-firebase/app",
      "@react-native-firebase/crashlytics",
      [
        "expo-gradle-ext-vars",
        {
          googlePlayServicesLocationVersion: "20.0.0",
          appCompatVersion: "1.4.2",
        },
      ],
      "react-native-nfc-manager",
      [
        "expo-notifications",
        {
          sounds: [
            "./assets/sounds/session_end.wav",
            "./assets/sounds/session_start.wav",
          ],
        },
      ],
      [
        "expo-sensors",
        {
          motionPermission:
            "Allow $(PRODUCT_NAME) to detect placement in the Aro smart box",
        },
      ],
    ],

    // Environment variables accessed via `Constants.manifest.extra['variable']
    extra,
  };
};
