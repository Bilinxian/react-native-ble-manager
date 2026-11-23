/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

import { BleTurboModule, TurboModuleContext } from './BleTurboModule';
import { BleScanMode, ScanOptions, BleScanMatchMode, BleStopScanEvent } from './types';
import ble from '@ohos.bluetooth.ble';
import access from '@ohos.bluetooth.access';
import { BusinessError } from '@ohos.base';
import PeripheralData from './PeripheralData';
import Logger from './BleManagerLogger';

const TAG = 'BleTurboModule';

export default class DefaultScanManager {
  private isScanning: boolean = false;
  private context: TurboModuleContext | undefined = undefined;
  private bleManager: BleTurboModule | undefined = undefined;
  private scanTimeoutId: number = -1;

  constructor(context: TurboModuleContext, bleManagerBleTurboModule: BleTurboModule) {
    this.context = context;
    this.bleManager = bleManagerBleTurboModule;
  }


  scan(serviceUUIDs: string[], seconds: number, scanningOptions: ScanOptions) {
    this.clearScanTimeout();
    this.offBLEDeviceFind();
    this.stopPreviousScan();
    if (!this.startScanning(serviceUUIDs, scanningOptions)) {
      return;
    }
    if (seconds > 0) {
      this.scanTimeoutId = setTimeout(() => {
        this.handleScanTimeout();
      }, seconds * 1000);
    }
  }

  private clearScanTimeout() {
    if (this.scanTimeoutId !== -1) {
      clearTimeout(this.scanTimeoutId);
      this.scanTimeoutId = -1;
    }
  }

  private stopPreviousScan() {
    if (!this.isScanning) {
      return;
    }
    try {
      ble.stopBLEScan();
    } catch (err) {
      this.bleManager?.logger.info('stopBLEScan before restart errCode: ' + (err as BusinessError).code +
      ', errMessage: ' + (err as BusinessError).message);
    }
    this.isScanning = false;
  }

  private startScanning(serviceUUIDs: string[], scanningOptions: ScanOptions): boolean {
    try {
      this.onBLEDeviceFind();
      const scanMode = scanningOptions.scanMode != null ? scanningOptions.scanMode : BleScanMode.LowPower;
      const matchMode = scanningOptions.matchMode != null ? scanningOptions.matchMode : BleScanMatchMode.Aggressive;
      const reportDelay = scanningOptions.reportDelay != null ? scanningOptions.reportDelay : 0;
      const exactAdvertisingName = scanningOptions.exactAdvertisingName;
      let filters = this.setFilters(serviceUUIDs, exactAdvertisingName);
      let scanOptions = this.setScanOptions(scanMode, matchMode, reportDelay);
      ble.startBLEScan(filters, scanOptions);
      this.isScanning = true;
      return true;
    } catch (err) {
      this.offBLEDeviceFind();
      this.isScanning = false;
      let bleStopScanEvent: BleStopScanEvent = {
        status: (err as BusinessError).code
      };
      this.bleManager.sendEvent('BleManagerStopScan', bleStopScanEvent);
      this.bleManager?.logger.info('startBLEScan errCode: ' + (err as BusinessError).code + ', errMessage: ' +
      (err as BusinessError).message);
      return false;
    }
  }

  private handleScanTimeout() {
    this.scanTimeoutId = -1;
    if (!this.isScanning) {
      this.offBLEDeviceFind();
      return;
    }
    this.isScanning = false;
    this.stopScanIfBluetoothOn();
    this.offBLEDeviceFind();
    let bleStopScanEvent: BleStopScanEvent = {
      status: 10
    };
    this.bleManager.sendEvent('BleManagerStopScan', bleStopScanEvent);
  }

  private stopScanIfBluetoothOn() {
    try {
      if (access.getState() === access.BluetoothState.STATE_ON) {
        ble.stopBLEScan();
      }
    } catch (err) {
      this.bleManager?.logger.info('stopBLEScan errCode: ' + (err as BusinessError).code + ', errMessage: ' +
      (err as BusinessError).message);
    }
  }

  setScanOptions(scanMode, matchMode, reportDelay) {
    const scanOptions: ble.ScanOptions = {
      dutyMode: ble.ScanDuty.SCAN_MODE_LOW_POWER,
      matchMode: ble.MatchMode.MATCH_MODE_AGGRESSIVE,
    };
    scanOptions.interval = reportDelay;
    switch (scanMode) {
      case BleScanMode.Opportunistic:
        this.bleManager?.logger.info('Opportunistic scan mode is not supported on OHOS, fallback to SCAN_MODE_LOW_POWER');
        scanOptions.dutyMode = ble.ScanDuty.SCAN_MODE_LOW_POWER;
        break;
      case BleScanMode.LowPower:
        scanOptions.dutyMode = ble.ScanDuty.SCAN_MODE_LOW_POWER;
        break;
      case BleScanMode.Balanced:
        scanOptions.dutyMode = ble.ScanDuty.SCAN_MODE_BALANCED;
        break;
      case BleScanMode.LowLatency:
        scanOptions.dutyMode = ble.ScanDuty.SCAN_MODE_LOW_LATENCY;
        break;
      default:
        scanOptions.dutyMode = ble.ScanDuty.SCAN_MODE_LOW_POWER;
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
      });
    } else {
      let scanFilter: ble.ScanFilter = {};
      filters.push(scanFilter);
    }
    if (exactAdvertisingName) {
      let exactAdvertisingNames: string[] = Array.isArray(exactAdvertisingName)
        ? exactAdvertisingName
        : [exactAdvertisingName];
      exactAdvertisingNames.forEach((deviceName: string) => {
        let scanFilter: ble.ScanFilter = {
          name: deviceName
        };
        filters.push(scanFilter);
      });
    }
    return filters;
  }

  onBLEDeviceFind() {
    ble.on('BLEDeviceFind', (data: Array<ble.ScanResult>) => {
      if (data.length === 0) {
        return;
      }
      data.forEach(result => {
        this.onDiscoveredPeripheral(result);
      });
    });
  }

  offBLEDeviceFind() {
    try {
      ble.off('BLEDeviceFind');
    } catch (err) {
      this.bleManager?.logger.info('offBLEDeviceFind errCode: ' + (err as BusinessError).code +
      ', errMessage: ' + (err as BusinessError).message);
    }
  }

  onDiscoveredPeripheral(result: ble.ScanResult) {
    const info = result.deviceName;
    this.bleManager?.logger.info('DiscoverPeripheral: ' + info);
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
    Logger.info(TAG, 'device name===' + result.deviceName);
    ble.createGattClientDevice(result.deviceId).getDeviceName((err: BusinessError, data: string) => {
      Logger.info(TAG, 'device name err ' + JSON.stringify(err));
      Logger.info(TAG, 'device name' + JSON.stringify(data));
    });
    this.bleManager?.savePeripheral(peripheral);
    let peripheralData = peripheral.asPeripheral();
    this.bleManager?.sendEvent('BleManagerDiscoverPeripheral', peripheralData);
  }

  getIsScanning() {
    return this.isScanning;
  }

  setIsScanning() {
    this.clearScanTimeout();
    this.offBLEDeviceFind();
    return this.isScanning = false;
  }
}