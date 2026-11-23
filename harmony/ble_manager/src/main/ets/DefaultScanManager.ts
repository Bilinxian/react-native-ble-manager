import { BleManagerTurboModule, TurboModuleContext } from './BleManagerTurboModule';
import { BleScanMode, ScanOptions, BleScanMatchMode, BleStopScanEvent, TransportType } from './types';
import ble from '@ohos.bluetooth.ble';
import access from '@ohos.bluetooth.access';
import connection from '@ohos.bluetooth.connection';
import { BusinessError } from '@ohos.base';
import PeripheralData from './PeripheralData';

const SPP_UUID = '00001101-0000-1000-8000-00805f9b34fb'

export default class DefaultScanManager {
  private isScanning: boolean = false;
  private context: TurboModuleContext | undefined = undefined;
  private bleManager: BleManagerTurboModule | undefined = undefined;

  constructor(context: TurboModuleContext, bleManagerBleTurboModule: BleManagerTurboModule) {
    this.context = context
    this.bleManager = bleManagerBleTurboModule
  }


  scan(serviceUUIDs: string[], seconds: number, scanningOptions: ScanOptions) {
    try {
      this.onBLEDeviceFind();
      this.onClassicDeviceFind();
      this.emitPairedClassicDevices();
      const scanMode = scanningOptions.scanMode ? scanningOptions.scanMode : ble.ScanDuty.SCAN_MODE_LOW_POWER;
      const matchMode = scanningOptions.matchMode ? scanningOptions.matchMode : ble.MatchMode.MATCH_MODE_AGGRESSIVE;
      const reportDelay = scanningOptions.reportDelay ? scanningOptions.reportDelay : 500;
      const exactAdvertisingName = scanningOptions.exactAdvertisingName;
      let filters = this.setFilters(serviceUUIDs, exactAdvertisingName);
      let scanOptions = this.setScanOptions(scanMode, matchMode, reportDelay)
      ble.startBLEScan(filters, scanOptions);
      try {
        connection.startBluetoothDiscovery();
      } catch (_error) {
      }
      this.isScanning = true

    } catch (err) {
      this.offBLEDeviceFind()
      this.isScanning = false;
      let bleStopScanEvent: BleStopScanEvent = {
        status: (err as BusinessError).code
      };
      this.bleManager.sendEvent("BleManagerStopScan", bleStopScanEvent);
      this.bleManager?.logger.info('errCode: ' + (err as BusinessError).code + ', errMessage: ' +
        (err as BusinessError).message);
    }
    if (seconds > 0) {
      let timeoutID = setTimeout(() => {
        if (access.getState() === access.BluetoothState.STATE_ON) {
          ble.stopBLEScan()
          ble.off('BLEDeviceFind')
          try {
            if (connection.isBluetoothDiscovering()) {
              connection.stopBluetoothDiscovery();
            }
          } catch (_error) {
          }
          this.offClassicDeviceFind();
          this.isScanning = false;
          clearTimeout(timeoutID);
        }
        let bleStopScanEvent: BleStopScanEvent = {
          status: 10
        };
        this.bleManager.sendEvent("BleManagerStopScan", bleStopScanEvent);
      }, seconds * 1000);

    }
  }

  setScanOptions(scanMode, matchMode, reportDelay) {
    const scanOptions: ble.ScanOptions = {
      dutyMode: ble.ScanDuty.SCAN_MODE_LOW_POWER,
      matchMode: ble.MatchMode.MATCH_MODE_AGGRESSIVE,
    };
    scanOptions.interval = reportDelay
    switch (scanMode) {
      case BleScanMode.Balanced:
        scanOptions.dutyMode = ble.ScanDuty.SCAN_MODE_BALANCED;
        break;
      case BleScanMode.LowLatency:
        scanOptions.dutyMode = ble.ScanDuty.SCAN_MODE_LOW_LATENCY;
        break;
      case BleScanMode.Opportunistic:
        break;
    }
    switch (matchMode) {
      case BleScanMatchMode.Aggressive:
        scanOptions.matchMode = ble.MatchMode.MATCH_MODE_AGGRESSIVE;
        break;
      case BleScanMatchMode.Sticky:
        scanOptions.matchMode = ble.MatchMode.MATCH_MODE_STICKY;
        break;
    }
    return scanOptions;
  }

  setFilters(serviceUUIDs: string[], exactAdvertisingName: string | string[]) {
    let filters: Array<ble.ScanFilter> = new Array<ble.ScanFilter>();
    if (serviceUUIDs.length > 0) {
      serviceUUIDs.forEach(serviceUUID => {
        let scanFilter: ble.ScanFilter = {
          serviceUuid: serviceUUID
        };
        filters.push(scanFilter);
      })
    } else {
      let scanFilter: ble.ScanFilter = {};
      filters.push(scanFilter)
    }
    if (exactAdvertisingName) {
      let exactAdvertisingNames = []
      exactAdvertisingNames.push(exactAdvertisingName)
      exactAdvertisingNames.forEach(deviceName => {
        let scanFilter: ble.ScanFilter = {
          name: deviceName
        };
        filters.push(scanFilter);
      });
    }
    return filters
  }

  onBLEDeviceFind() {
    this.offBLEDeviceFind();
    ble.on("BLEDeviceFind", (data: Array<ble.ScanResult>) => {
      if (data.length === 0) {
        return;
      }
      data.forEach(result => {
        this.onDiscoveredPeripheral(result);
      });
    });
  }

  offBLEDeviceFind() {
    ble.off("BLEDeviceFind");
  }

  /**
   * 监听经典蓝牙设备发现事件。
   */
  onClassicDeviceFind() {
    this.offClassicDeviceFind();
    connection.on("bluetoothDeviceFind", (device_ids: Array<string>) => {
      device_ids.forEach((device_id) => this.onDiscoveredClassicPeripheral(device_id));
    });
  }

  /**
   * 移除经典蓝牙设备发现监听。
   */
  offClassicDeviceFind() {
    connection.off("bluetoothDeviceFind");
  }

  /**
   * 将已配对经典蓝牙设备加入当前列表。
   */
  emitPairedClassicDevices() {
    try {
      connection.getPairedDevices().forEach((device_id) => {
        this.onDiscoveredClassicPeripheral(device_id);
      });
    } catch (_error) {
    }
  }

  /**
   * 将经典蓝牙设备转换为现有 Peripheral 事件。
   */
  async onDiscoveredClassicPeripheral(device_id: string) {
    let device_name = '';
    try {
      device_name = connection.getRemoteDeviceName(device_id);
    } catch (_error) {
      return;
    }
    if (!device_name) {
      return;
    }
    const isPrinterName = /(^gp[-_ ]|gprinter|printer|佳博)/i.test(device_name);
    try {
      const profileUUIDs = await connection.getRemoteProfileUuids(device_id);
      const supportsSpp = profileUUIDs.some((uuid) => String(uuid).toLowerCase() === SPP_UUID);
      if (!supportsSpp && !isPrinterName) {
        return;
      }
    } catch (_error) {
      if (!isPrinterName) {
        return;
      }
    }
    let peripheral = this.bleManager?.getPeripheralById(device_id);
    if (!peripheral || !peripheral.isSpp()) {
      peripheral = new PeripheralData(this.context);
      peripheral.setDeviceId(device_id);
    }
    peripheral.setDeviceName(device_name);
    peripheral.setRssi(0);
    peripheral.setTransport(TransportType.SPP);
    this.bleManager?.savePeripheral(peripheral);
    this.bleManager?.sendEvent("BleManagerDiscoverPeripheral", peripheral.asPeripheral());
  }

  onDiscoveredPeripheral(result: ble.ScanResult) {
    let peripheral = this.bleManager?.getPeripheral(result);
    if (peripheral == null) {
      peripheral = new PeripheralData(this.context, ble.createGattClientDevice(result.deviceId));
      peripheral.setDeviceId(result.deviceId);
      peripheral.setDeviceName(result.deviceName);
      peripheral.setRssi(result.rssi);
      peripheral.setData(result.data);
    } else {
      peripheral.setRssi(result.rssi);
      peripheral.setData(result.data);
    }
    this.bleManager?.savePeripheral(peripheral)
    let peripheralData = peripheral.asPeripheral();
    this.bleManager?.sendEvent("BleManagerDiscoverPeripheral", peripheralData);
  }

  getIsScanning() {
    return this.isScanning
  }

  setIsScanning() {
    return this.isScanning = false
  }
}