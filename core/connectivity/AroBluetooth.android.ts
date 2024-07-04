import BleManager from "react-native-ble-manager";
import { Peripheral } from "react-native-ble-manager";
import {
  AppState,
  NativeModules,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { AroDevice } from "./AroDevice";
import BackgroundService from "react-native-background-actions";
import {
  onLocationPermissionStatus,
  onNfcToggle,
  emitBluetoothStatus,
} from "../EventBroker";
import { toByteArray } from "./Base64";
import {
  ARO_BTLE_SERVICE_GUID,
  BTLE_POWER_CHARACTERISTIC_UUID,
  DeviceType,
  State,
} from "../../constants/Bluetooth";
import Constants from "expo-constants";
import { sleep } from "../sleep";
import { GlobalState } from "../GlobalState";
import { logger as baseLogger } from "../logger";

const logger = baseLogger.extend("BTLE");

const requiredBluetoothPermissions =
  Platform.Version > 30
    ? [
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]
    : [];
const bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager);
const knownAroDevices = new Map<string, AroDevice>();
const scanSeconds = 60 * 60; // 1 hour
const defaultNotificationDescription = "Life is greater than your phone";

let scanning: boolean;
let bluetoothState: State = State.Unknown;
let connectedPeripheral: Peripheral | undefined;
let pendingLandmarkConnections: boolean;

// https://developer.android.com/reference/android/bluetooth/le/ScanCallback
enum ScanStopStatus {
  MANUAL = 0,
  SCAN_FAILED_ALREADY_STARTED = 1,
  SCAN_FAILED_APPLICATION_REGISTRATION_FAILED = 2,
  SCAN_FAILED_FEATURE_UNSUPPORTED = 3,
  SCAN_FAILED_INTERNAL_ERROR = 4,
  SCAN_FAILED_OUT_OF_HARDWARE_RESOURCES = 5,
  SCAN_FAILED_SCANNING_TOO_FREQUENTLY = 6,
  TIMEOUT = 10,
}

// Checking if permissions have changed (https://github.com/zoontek/react-native-permissions/issues/535#issuecomment-719422583)
AppState.addEventListener("change", async () => {
  await checkBluetoothPermissions();
});

onNfcToggle((toggle: boolean) => {
  if (toggle) {
    destroy();
  } else {
    init();
  }
});

// React to location permission changes to start/stop scanning
onLocationPermissionStatus(async (foreground, background) => {
  if (!BackgroundService.isRunning()) {
    return;
  }

  if (foreground && background) {
    if (!scanning) {
      await scan();
    }
  } else if (scanning) {
    await BleManager.stopScan();
  }
});

const checkBluetoothPermissions = async () => {
  if (requiredBluetoothPermissions.length === 0) return true;

  const results = await Promise.all(
    requiredBluetoothPermissions.map(PermissionsAndroid.check)
  );
  const granted = results.every((r) => r);

  emitBluetoothStatus(!granted ? State.Unauthorized : bluetoothState);

  return granted;
};

const requestBluetoothPermissions = async () => {
  if (requiredBluetoothPermissions.length === 0) return true;

  // the permissions API can only be used in foreground
  if (AppState.currentState !== "active") {
    return await checkBluetoothPermissions();
  }

  try {
    const status = await PermissionsAndroid.requestMultiple(
      requiredBluetoothPermissions
    );

    for (const permission of requiredBluetoothPermissions) {
      if (status[permission] === PermissionsAndroid.RESULTS.GRANTED) {
        logger.info(`Bluetooth permission ${permission} granted`);
      } else {
        logger.info(`Bluetooth permission ${permission} denied`);
      }
    }
  } catch (err) {
    logger.warn(err);
  }

  return await checkBluetoothPermissions();
};

const onStateChange = async ({ state: newState }: { state: string }) => {
  bluetoothState = newState as State;

  logger.info(`New state: ${bluetoothState}`);

  // Power `useBluetoothState`
  emitBluetoothStatus(bluetoothState);

  await BleManager.stopScan();

  if (bluetoothState === State.On) {
    await scan();
  }
};

const scan = async () => {
  const hasPermissions = await requestBluetoothPermissions();
  if (!hasPermissions) {
    logger.error("[scan] Failed to start: missing Bluetooth permissions");
    return;
  }

  if (scanning || connectedPeripheral || pendingLandmarkConnections) {
    return;
  }

  if (bluetoothState !== State.On) {
    logger.info(
      `[scan] Bluetooth adapter state is ${bluetoothState}, ignoring scan request`
    );
    return;
  }

  try {
    scanning = true;
    await BleManager.scan([ARO_BTLE_SERVICE_GUID], scanSeconds);
  } catch (error) {
    scanning = false;
    logger.error("[scan] Error caught:", error);

    // Rerty in 10 seconds
    await sleep(1000 * 10);
    await scan();

    return;
  }

  await BackgroundService.updateNotification({
    taskDesc: defaultNotificationDescription,
  });

  logger.info("[scan] Scan started");
};

const onStopScan = async ({ status }: { status: number }) => {
  const logMessage = `[onStopScan] Scanning stopped: ${
    ScanStopStatus[status] || status
  }`;

  scanning = false;

  switch (status) {
    case ScanStopStatus.MANUAL:
      logger.info(logMessage);
      break;
    case ScanStopStatus.TIMEOUT:
      logger.info(logMessage);
      await scan();
      break;
    case ScanStopStatus.SCAN_FAILED_ALREADY_STARTED:
      logger.warn(logMessage);
      break;
    case ScanStopStatus.SCAN_FAILED_SCANNING_TOO_FREQUENTLY:
      logger.warn(logMessage);

      // Android has an internal limit of 5 startScan(…) method calls every 30 seconds per app
      await sleep(60000);
      await scan();
      break;
    default:
      logger.error(logMessage);
      break;
  }
};

const onDiscoverPeripheral = async (peripheral: Peripheral) => {
  try {
    if (bluetoothState !== State.On) {
      // for some bizarre reason, Android will let the scanning continue when the Bluetooth is off without an ability to stop it
      return;
    }

    logger.info(
      `[onDiscoverPeripheral] New device: ${peripheral.name} [${peripheral.id}]`
    );

    if (!peripheral.advertising.manufacturerData) {
      logger.error(
        `[onDiscoverPeripheral] Missing manufacturer data: ${peripheral.name} [${peripheral.id}]`
      );
      return;
    }

    // Identify Landmark
    const [deviceType, aroDevice] = identifyLandmark(peripheral);

    if (!aroDevice) {
      logger.error("[onDiscoverPeripheral] Unable to establish an Aro Device");
      return;
    }

    // Connect to Landmark
    logger.info(
      `[onDiscoverPeripheral] Initial connection to device: ${peripheral.name} [${peripheral.id}] {${deviceType}} <${aroDevice.AroDeviceId}>`
    );
    if (
      (await BleManager.isPeripheralConnected(peripheral.id, [
        ARO_BTLE_SERVICE_GUID,
      ])) === false
    ) {
      logger.info(
        `[connectToLandmark] Connecting to device: ${peripheral.name} [${peripheral.id}] {${deviceType}} <${aroDevice.AroDeviceId}>`
      );

      // Connected Periphercal Exists
      if (connectedPeripheral) {
        logger.info(
          `[connectToLandmark] Already connected to another peripheral ${connectedPeripheral.name} [${connectedPeripheral.id}], skipping. ${peripheral.name} [${peripheral.id}] {${deviceType}} <${aroDevice.AroDeviceId}>`
        );
        return;
      }

      // Connection Already Pending
      if (pendingLandmarkConnections) {
        logger.info(
          `[connectToLandmark] Already connecting, skipping. ${peripheral.name} [${peripheral.id}] {${deviceType}} <${aroDevice.AroDeviceId}>`
        );
        return;
      }

      // Lock & connect
      pendingLandmarkConnections = true;
      await BleManager.stopScan();
      await BleManager.connect(peripheral.id);
      connectedPeripheral = peripheral;
      pendingLandmarkConnections = false;
    } else {
      logger.info(
        `[connectToLandmark] Already connected: ${peripheral.name} [${peripheral.id}] {${deviceType}} <${aroDevice.AroDeviceId}>`
      );
    }
  } catch (error) {
    logger.error("[onDiscoverPeripheral] Error caught:", error);

    pendingLandmarkConnections = false;

    await scan();
  }
};

const identifyLandmark = (
  peripheral: Peripheral
): [DeviceType, AroDevice] | [null, null] => {
  if (!peripheral.advertising.manufacturerData) return [null, null];

  const unit8bytes = toByteArray(peripheral.advertising.manufacturerData.data);
  const firmwareVersion = `${unit8bytes[4]}.${unit8bytes[5]}.${unit8bytes[6]}`;
  const dataview = new DataView(unit8bytes.buffer);
  const boxId = dataview.getUint32(0, true) & 0x0000ffff;
  /**
   * const hardwareVersion = `${unit8bytes[7]}`
   * const _ = dataview.getUint32(0, true) & 0xffff0000;
   */
  const deviceTypeIdentifier = Math.abs(dataview.getUint32(0, true) >> 30);

  let deviceType =
    deviceTypeIdentifier === 1
      ? DeviceType.Landmark1
      : deviceTypeIdentifier === 2
      ? DeviceType.Landmark2
      : DeviceType.Unknown;

  const relatedAroDevice = getAroDevice(`${boxId}`, firmwareVersion);

  return [deviceType, relatedAroDevice];
};

const getAroDevice = (id: string, firmwareVersion: string): AroDevice => {
  if (!knownAroDevices.has(id)) {
    knownAroDevices.set(id, new AroDevice(id, logger.info, firmwareVersion));
  }

  return knownAroDevices.get(id) as AroDevice;
};

const onConnectPeripheral = async ({
  peripheral: peripheralId,
  status,
}: {
  peripheral: string;
  status: number;
}) => {
  try {
    logger.info(
      `[onConnectPeripheral] Connected to peripheral ${peripheralId} (status=${status})`
    );

    await BackgroundService.updateNotification({
      taskDesc: "Connected to Aro!",
    });

    if (!connectedPeripheral) {
      logger.error(
        `[onConnectPeripheral] Could not find connected peripheral ${peripheralId}`
      );
      return;
    }

    if (connectedPeripheral.id !== peripheralId) {
      logger.warn(
        `[onConnectPeripheral] Unexpected connected peripheral ${peripheralId}`
      );
      return;
    }

    // Identify Landmark
    const [deviceType, aroDevice] = identifyLandmark(connectedPeripheral);

    if (!aroDevice) {
      logger.error("[onConnectPeripheral] Unable to establish an Aro Device");
      return;
    }

    // Success, register device and notify
    aroDevice.addLandmark(
      connectedPeripheral.id,
      connectedPeripheral,
      async () =>
        await BleManager.isPeripheralConnected(peripheralId, [
          ARO_BTLE_SERVICE_GUID,
        ])
    );
    logger.info(
      `[onConnectPeripheral] Updating aro status: ${connectedPeripheral.name} [${connectedPeripheral.id}] {${deviceType}} <${aroDevice.AroDeviceId}>`
    );
    await aroDevice.updateStatus();
  } catch (error) {
    logger.error("[onConnectPeripheral] Error caught:" + error);
  }
};

const onDisconnectPeripheral = async ({
  peripheral: peripheralId,
  status,
}: {
  peripheral: string;
  status: number;
}) => {
  logger.info(
    `[onDisconnectPeripheral] Disconnected from peripheral ${peripheralId} (status=${status})`
  );

  if (peripheralId !== connectedPeripheral?.id) {
    logger.warn(
      `[onDisconnectPeripheral] Peripheral ${peripheralId} is not active. Currently active peripheral: ${connectedPeripheral?.name} [${connectedPeripheral?.id}]`
    );
    return;
  }

  // Identify Landmark
  const [deviceType, aro] = identifyLandmark(connectedPeripheral);

  if (!aro) {
    logger.error("[onDisconnectPeripheral] Unable to establish an Aro Device");
    return;
  }

  // Re-Start Scan
  logger.info(`[onDisconnectPeripheral] Restarting scan`);
  const disconnectedPeripheral = connectedPeripheral;
  connectedPeripheral = undefined;
  await scan();

  try {
    const nap = randomIntFromInterval(1000, 2500);

    logger.info(
      `[onDisconnectPeripheral] Napping for ${nap}: ${disconnectedPeripheral.name} [${disconnectedPeripheral.id}] {${deviceType}} <${aro.AroDeviceId}>`
    );

    // Take a breath, give the device a chance to reconnent in case this was an intermittent issue
    await sleep(nap);

    // Update Device Status
    logger.info(
      `[onDisconnectPeripheral] Updating aro status: ${disconnectedPeripheral.name} [${disconnectedPeripheral.id}] {${deviceType}} <${aro.AroDeviceId}>`
    );
    await aro.updateStatus();
  } catch (error) {
    logger.error(`[onDisconnectPeripheral] Error caught:`, error);
  }
};

const randomIntFromInterval = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getDebugBoxId = () => {
  const boxIds = Array.from(knownAroDevices.keys());
  if (!boxIds.length) return "";
  return boxIds[0]; // todo: multi-box support
};

export const init = async () => {
  if (GlobalState.nfc.toggle) {
    logger.info("[init] NFC enabled, ignoring Bluetooth");
    return;
  }

  if (BackgroundService.isRunning()) {
    logger.info("[init] Background service already running");
    return;
  }

  const permissionsGranted = await requestBluetoothPermissions();
  if (!permissionsGranted) {
    logger.error("[init] Failed: missing Bluetooth permissions");
    return;
  }

  const options = {
    taskName: "aro",
    taskTitle: "Aro",
    taskDesc: defaultNotificationDescription,
    taskIcon: {
      name: "notification_icon",
      type: "drawable",
    },
    color: Constants.manifest?.notification?.color,
    linkingURI: "https://applink.example.com",
  };

  try {
    logger.info("[init] Starting foreground service");

    await BackgroundService.start(async () => {
      try {
        logger.info("[BackgroundService] Starting BleManager");
        await BleManager.start();

        // Trigger Initial BleManagerDidUpdateState Event
        BleManager.checkState();

        // Unsubscribe (mainly for dev client hot reloads)
        bleManagerEmitter.removeAllListeners("BleManagerDidUpdateState");
        bleManagerEmitter.removeAllListeners("BleManagerStopScan");
        bleManagerEmitter.removeAllListeners("BleManagerDiscoverPeripheral");
        bleManagerEmitter.removeAllListeners("BleManagerConnectPeripheral");
        bleManagerEmitter.removeAllListeners("BleManagerDisconnectPeripheral");

        // Subscribe
        bleManagerEmitter.addListener(
          "BleManagerDidUpdateState",
          onStateChange
        );
        bleManagerEmitter.addListener("BleManagerStopScan", onStopScan);
        bleManagerEmitter.addListener(
          "BleManagerDiscoverPeripheral",
          onDiscoverPeripheral
        );
        bleManagerEmitter.addListener(
          "BleManagerConnectPeripheral",
          onConnectPeripheral
        );
        bleManagerEmitter.addListener(
          "BleManagerDisconnectPeripheral",
          onDisconnectPeripheral
        );

        // Run Indefinitely
        while (true) {
          await sleep(1000 * 60 * 60); // 1 hour

          // if scanning is already in progress or we're already connected, this will be a no-op
          // this is a failsafe to keep running in the background in case scanning is not active when it should be
          await scan();
        }
      } catch (error) {
        logger.error("[BackgroundService] Error caught:", error);
      }
    }, options);
  } catch (error) {
    logger.error("[init] Error caught:", error);
  }
};

const destroy = async () => {
  logger.info("[destroy] Stopping BLE operations");

  await BleManager.stopScan();
  await BackgroundService.stop();
};

export const errorDevices: string[] = [];

export const noAroConnectionActive = () => {
  return !connectedPeripheral && !pendingLandmarkConnections;
};

export const getState = () => {
  checkBluetoothPermissions();
  return bluetoothState;
};

const powerLevels = [
  "-12 dBm",
  "-9 dBm",
  "-6 dBm",
  "-3 dBm",
  "0 dBm",
  "3 dBm",
  "6 dBm",
  "9 dBm",
];
export const readPowerLevels = async (boxId?: string) => {
  boxId = boxId || getDebugBoxId();
  if (!boxId) return;

  const aroDevice = getAroDevice(boxId, "");
  if (!aroDevice) return;

  const lighthouse = aroDevice.getLighthouse<Peripheral>();
  if (!lighthouse) return;

  if (
    !(await BleManager.isPeripheralConnected(lighthouse.id, [
      ARO_BTLE_SERVICE_GUID,
    ]))
  )
    return;

  const peripheralInfo = await BleManager.retrieveServices(lighthouse.id, [
    ARO_BTLE_SERVICE_GUID,
  ]);
  const lighthouseService = peripheralInfo.services?.find(
    (s) => s.uuid === ARO_BTLE_SERVICE_GUID
  );
  if (!lighthouseService) return;

  const data = await BleManager.read(
    lighthouse.id,
    lighthouseService.uuid,
    BTLE_POWER_CHARACTERISTIC_UUID
  );
  if (!data.value) return;

  const unit8bytes = toByteArray(data?.value);

  return {
    lha: powerLevels[unit8bytes[0]],
    lhc: powerLevels[unit8bytes[1]],
    lm1a: powerLevels[unit8bytes[2]],
    lm1c: powerLevels[unit8bytes[3]],
    lm2a: powerLevels[unit8bytes[4]],
    lm2c: powerLevels[unit8bytes[5]],
  };
};

export const connectedLandmarks = async (boxId?: string) => {
  boxId = boxId || getDebugBoxId();
  if (!boxId) return;

  const connected = [];

  const aroDevice = getAroDevice(boxId, "");
  if (!aroDevice) return;

  for (const peripheral of aroDevice.getLandmarks<Peripheral>()) {
    if (
      (await BleManager.isPeripheralConnected(peripheral.id, [
        ARO_BTLE_SERVICE_GUID,
      ])) ??
      false
    ) {
      connected.push(peripheral.name);
    }
  }

  return connected;
};

export const readDeviceState = (boxId?: string) => {
  boxId = boxId || getDebugBoxId();
  if (!boxId) return;

  const aroDevice = getAroDevice(boxId, "");
  return aroDevice?.ConnectionStatus;
};
