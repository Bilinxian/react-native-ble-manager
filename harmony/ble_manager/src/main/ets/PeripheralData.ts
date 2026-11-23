import ble from '@ohos.bluetooth.ble';
import socket from '@ohos.bluetooth.socket';
import { JSON, util } from '@kit.ArkTS';
import constant from '@ohos.bluetooth.constant';
import { TurboModuleContext } from './BleManagerTurboModule';
import {
  AdvertisingData,
  BleConnectPeripheralEvent,
  CustomAdvertisingData,
  Peripheral,
  TransportType
} from './types';
import { BusinessError } from "@kit.BasicServicesKit"
import Logger from "./BleManagerLogger"

const TAG = 'BleTurboModule'
const SPP_UUID = '00001101-0000-1000-8000-00805f9b34fb'

export default class PeripheralData {
  private device: ble.GattClientDevice;
  private transport: TransportType = TransportType.BLE;
  private sppSocketId: number = -1;
  private context: TurboModuleContext;
  private connected: boolean = false;
  private connecting: boolean = false;
  private deviceId: string;
  private deviceName: string;
  private advertisingRSSI: number;
  private advertisingDataBytes: ArrayBuffer;

  constructor(context: TurboModuleContext, bleDevice?: ble.GattClientDevice) {
    this.context = context;
    if (bleDevice) {
      this.device = bleDevice;
    }
  }

  sendEvent(eventName: string, payload: any) {
    this.context.rnInstance.emitDeviceEvent(eventName, payload)
  }

  sendConnectionEvent(deviceId: string, eventName: string, status: number) {
    let bleConnectPeripheralEvent: BleConnectPeripheralEvent = {
      id: deviceId
    }
    if (status != -1) {
      bleConnectPeripheralEvent.status = status
    }
    this.sendEvent(eventName, bleConnectPeripheralEvent);
  }

  asPeripheral() {
    let advertising: AdvertisingData = this.getAdvertising(this.deviceName, this.connected, this.advertisingDataBytes)
    let peripheral: Peripheral = {
      id: this.deviceId,
      name: this.deviceName,
      rssi: this.advertisingRSSI,
      advertising: advertising
    }
    return peripheral;
  }

  getAdvertising(name: string, isConnectable: boolean, advertisingDataBytes: ArrayBuffer) {
    let advertising: AdvertisingData = {}
    if (name) {
      advertising.localName = name;
    }
    advertising.isConnectable = isConnectable;
    advertising.rawData = this.getCustomAdvertisingData(advertisingDataBytes);
    return advertising;
  }

  getCustomAdvertisingData(advertisingDataBytes: ArrayBuffer) {
    let base64Helper = new util.Base64Helper;
    let customAdvertisingData: CustomAdvertisingData = {
      CDVType: 'ArrayBuffer',
      data: advertisingDataBytes ? base64Helper.encodeToStringSync(new Uint8Array(advertisingDataBytes)) : '',
      bytes: advertisingDataBytes ? advertisingDataBytes : null,
    }
    return customAdvertisingData;
  }

  setRssi(rssi: number) {
    this.advertisingRSSI = rssi;
  }

  getRssi() {
    return this.advertisingRSSI;
  }

  setData(data: ArrayBuffer) {
    this.advertisingDataBytes = data
  }

  connect(): boolean {
    if (!this.connected && this.device) {
      this.onBLEConnectionStateChange(this.device)
      try {

        this.device.connect();
        this.connecting = true;
        return true
      } catch (error) {
        Logger.error(TAG, JSON.stringify(error))
        this.connecting = false;
        return false
      }
    }
    return true
  }

  /**
   * 通过经典蓝牙 RFCOMM/SPP 连接已配对打印机。
   */
  connectSppAsync(): Promise<void> {
    if (this.connected && this.sppSocketId >= 0) {
      try {
        socket.sppCloseClientSocket(this.sppSocketId);
      } catch (_error) {
      }
      this.connected = false;
      this.sppSocketId = -1;
    }
    return new Promise((resolve, reject) => {
      let settled = false;
      const timer = setTimeout(() => {
        if (settled) {
          return;
        }
        settled = true;
        this.connected = false;
        this.sppSocketId = -1;
        Logger.error(TAG, 'SPP connect timeout, deviceId=' + this.deviceId);
        reject('SPP connect timeout');
      }, 10000);
      try {
        socket.sppConnect(this.deviceId, {
          uuid: SPP_UUID,
          secure: true,
          type: socket.SppType.SPP_RFCOMM
        }, (error: BusinessError, socket_id: number) => {
          if (settled) {
            if (!error && socket_id >= 0) {
              socket.sppCloseClientSocket(socket_id);
            }
            return;
          }
          settled = true;
          clearTimeout(timer);
          if (error) {
            reject(error);
            return;
          }
          this.sppSocketId = socket_id;
          this.connected = true;
          this.sendConnectionEvent(this.deviceId, "BleManagerConnectPeripheral",
            constant.ProfileConnectionState.STATE_CONNECTED);
          resolve();
        });
      } catch (error) {
        settled = true;
        clearTimeout(timer);
        Logger.error(TAG, 'SPP connect exception, deviceId=' + this.deviceId +
          ', error=' + JSON.stringify(error));
        reject(error);
      }
    });
  }

  setConnected(connected: boolean) {
    this.connected = connected;
  }

  setDevice(bleDevice: ble.GattClientDevice) {
    this.device = bleDevice;
  }

  /**
   * 设置设备传输类型。
   */
  setTransport(transport: TransportType) {
    this.transport = transport;
  }

  /**
   * 判断设备是否使用经典蓝牙 SPP。
   */
  isSpp() {
    return this.transport === TransportType.SPP;
  }

  getDevice() {
    return this.device;
  }

  setDeviceId(deviceId: string) {
    this.deviceId = deviceId;
  }

  getDeviceId() {
    return this.deviceId;
  }

  setDeviceName(deviceName: string) {
    this.deviceName = deviceName;
  }

  getDeviceName() {
    return this.deviceName;
  }

  isConnected() {
    return this.connected
  }

  readRSSI(): Promise<number> {
    if (!this.isConnected()) {
      return Promise.reject('Device is not connected')
    }
    if (!this.device) {
      return Promise.reject('Device is null')
    }
    return this.device.getRssiValue();
  }

  disconnect() {
    try {
      const wasConnected = this.connected;
      this.connected = false;
      if (this.isSpp()) {
        if (this.sppSocketId >= 0) {
          socket.sppCloseClientSocket(this.sppSocketId);
          this.sppSocketId = -1;
        }
        if (wasConnected) {
          this.sendConnectionEvent(this.deviceId, "BleManagerDisconnectPeripheral",
            constant.ProfileConnectionState.STATE_DISCONNECTED);
        }
        return;
      }
      if (this.device) {
        this.offConnectStateChanged()
        this.device.disconnect();
        this.device.close()
      }
    } catch (error) {
      Logger.error('errCode: ' + (error as BusinessError).code + ', errMessage: ' + (error as BusinessError).message);
    }
  }

  onBLEConnectionStateChange(device: ble.GattClientDevice) {
    device.on('BLEConnectionStateChange', (state: ble.BLEConnectionChangeState) => {
      let connectState: ble.ProfileConnectionState = state.state;
      let deviceId: string = state.deviceId;
      this.connecting = false;
      if (connectState === constant.ProfileConnectionState.STATE_CONNECTED) {
        this.setConnected(true);
        this.sendConnectionEvent(deviceId, "BleManagerConnectPeripheral", connectState);
      } else if (connectState === constant.ProfileConnectionState.STATE_DISCONNECTED) {
        this.setConnected(false);
        this.sendConnectionEvent(deviceId, "BleManagerDisconnectPeripheral", connectState)
      }
    })
  }

  offConnectStateChanged() {
    if (this.device) {
      this.device.off('BLEConnectionStateChange')
    }
  }

  requestMTU(mtu: number): Promise<number> {
    if (!this.isConnected()) {
      return Promise.reject("Device is not connected")
    }
    if (!this.device) {
      return Promise.reject("device is null")
    }
    if (mtu) {
      try {
        this.device.setBLEMtuSize(128);
        return Promise.resolve(mtu)
      } catch (err) {
        return Promise.reject('errCode: ' + (err as BusinessError).code + ', errMessage: ' +
          (err as BusinessError).message)
      }
    }
  }

  retrieveServices(peripheralId: string, serviceUUIDs: string[]): Promise<Array<ble.GattService>> {
    return new Promise((resolve, reject) => {
      try {
        if (!this.connected) {
          this.device.connect();
          this.device.on('BLEConnectionStateChange', (state: ble.BLEConnectionChangeState) => {
            let connectState: ble.ProfileConnectionState = state.state;
            let deviceId: string = state.deviceId;
            if (connectState === constant.ProfileConnectionState.STATE_CONNECTED) {
              this.device.getServices().then((result: Array<ble.GattService>) => {
                const array = []
                const itemArray = []
                for (let i = 0; i < result.length; i++) {
                  const item = result[i];
                  if (!array.includes(item.serviceUuid)) {
                    array.push(item.serviceUuid)
                    itemArray.push(item)
                  }
                }
                resolve(itemArray)
              });
              this.setConnected(true);
              this.sendEvent("BleManagerConnectPeripheral", connectState);
            } else if (connectState === constant.ProfileConnectionState.STATE_DISCONNECTED) {
              this.setConnected(false);
              this.sendEvent("BleManagerDisconnectPeripheral", connectState)
            }
          })
        } else {
          this.device.getServices().then((result: Array<ble.GattService>) => {
            const array = []
            const itemArray = []
            for (let i = 0; i < result.length; i++) {
              const item = result[i];
              if (!array.includes(item.serviceUuid)) {
                array.push(item.serviceUuid)
                itemArray.push(item)
              }
            }
            resolve(itemArray)
          }).catch((err) => {
            reject(err)
          });
        }
      } catch (error) {
        reject(new Error("failed"));
      }
    });
  }

  //修改后
  async write(serviceUUID: string, characteristicUUID: string, data: number[], maxByteSize: number,
              writeType: number): Promise<void> {
    if (this.isSpp()) {
      return this.writeSpp(data);
    }
    if (!this.isConnected() || this.device === null) {
      return Promise.reject('Device is not connected')
    }
    let result: Array<ble.GattService> = await this.device.getServices();
    let gattService: ble.GattService = result.find((gattService) => gattService.serviceUuid === serviceUUID)
    if (gattService === null || gattService === undefined) {
      return Promise.reject(`serviceUUID + ${serviceUUID} + not found.`)
    }
    let characteristic: ble.BLECharacteristic =
      this.findWritableCharacteristic(gattService, characteristicUUID, writeType);
    if (characteristic === null || characteristic === undefined) {
      return Promise.reject(`Characteristic + ${characteristicUUID} + not found.`)
    }
    const uint8Data = data
    let dataLength = uint8Data.length;
    if (dataLength <= maxByteSize) {
      const isDoWriteSuccess = await this.doWrite(characteristic, new Uint8Array(data).buffer);
      if (!isDoWriteSuccess) {
        return Promise.reject("Write failed")
      } else {
        return Promise.resolve();
      }
    } else {

      let count = 0;

      const splittedMessage = [];
      for (; count < dataLength; count += maxByteSize) {
        const chunk = uint8Data.slice(count, count + maxByteSize);
        splittedMessage.push(chunk)
      }
      // if (count < dataLength) {
      //   splittedMessage.push(uint8Data.buffer.slice(count, dataLength))
      // }
      //harmonyOS 默认writeType ==  ble.GattWriteType.WRITE
      if (splittedMessage.length <= 0) {
        return Promise.reject("firstMessage length is 0")
      }
      let writeError: boolean = false;
      const isDoWriteSuccess = await this.doWrite(characteristic, new Uint8Array(splittedMessage[0]).buffer);
      if (!isDoWriteSuccess) {
        writeError = true;
        return Promise.reject('Write failed')
      }
      if (!writeError) {
        for (let i = 1; i < splittedMessage.length; i++) {
          let message = new Uint8Array(splittedMessage[i]).buffer;
          const isDoWriteSuccess = await this.doWrite(characteristic, message);
          if (!isDoWriteSuccess) {
            writeError = true;
            return Promise.reject('Write failed')
          }
        }
      }
    }
    return Promise.resolve();
  }

  /**
   * 通过 RFCOMM socket 分片发送打印数据。
   */
  private async writeSpp(data: number[]): Promise<void> {
    if (!this.connected || this.sppSocketId < 0) {
      return Promise.reject('SPP device is not connected');
    }
    try {
      for (let offset = 0; offset < data.length; offset += 512) {
        const buffer = new Uint8Array(data.slice(offset, offset + 512)).buffer;
        socket.sppWrite(this.sppSocketId, buffer);
        await new Promise<void>((resolve) => setTimeout(resolve, 20));
      }
    } catch (error) {
      this.connected = false;
      try {
        socket.sppCloseClientSocket(this.sppSocketId);
      } catch (_close_error) {
      }
      this.sppSocketId = -1;
      this.sendConnectionEvent(this.deviceId, "BleManagerDisconnectPeripheral",
        constant.ProfileConnectionState.STATE_DISCONNECTED);
      return Promise.reject(error);
    }
  }

  async doWrite(characteristic: ble.BLECharacteristic, buffer: ArrayBuffer): Promise<boolean> {
    try {
      const characteristicObj: ble.BLECharacteristic = {
        ...characteristic,
        characteristicValue: buffer
      }
      await this.device.writeCharacteristicValue(characteristicObj, ble.GattWriteType.WRITE_NO_RESPONSE)
      return Promise.resolve(true)
    } catch (error) {
      return Promise.resolve(false);
    }
  }


  findWritableCharacteristic(gattService: ble.GattService, characteristicUUID: string,
                             writeType: number): ble.BLECharacteristic {
    let writeProperty = ble.GattWriteType.WRITE;
    if (writeType == ble.GattWriteType.WRITE_NO_RESPONSE) {
      writeProperty = ble.GattWriteType.WRITE_NO_RESPONSE
    }
    let characteristics: Array<ble.BLECharacteristic> = gattService.characteristics;
    try {
      let chara = characteristics.find((characteristic) => {
        let properties = characteristic.properties?.write ? 1 : 0
        return ((properties & writeProperty) != 0 && characteristic.characteristicUuid === characteristicUUID) ?
          characteristic : null
      })
      return chara;
    } catch (error) {
      Logger.error(TAG, "Error on findWritableCharacteristic", error);
      return null;
    }
  }
}