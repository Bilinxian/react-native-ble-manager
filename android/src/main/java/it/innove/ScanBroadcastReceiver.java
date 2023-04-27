package it.innove;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothClass;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;

public class ScanBroadcastReceiver extends BroadcastReceiver {
    public static final String LOG_TAG = "ReactNativeBleManager";
    private final Handler mHandler;

    public ScanBroadcastReceiver(Handler mHandler) {
        this.mHandler = mHandler;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
        if (action != null) {
            switch (action) {
                case BluetoothAdapter.ACTION_SCAN_MODE_CHANGED:
                    Log.d(LOG_TAG, "扫描模式改变");
                    break;
                case BluetoothAdapter.ACTION_DISCOVERY_STARTED:

                    mHandler.sendEmptyMessage(BleAction.BluetoothStartScan);
                    Log.d(LOG_TAG, "扫描开始");
                    break;
                case BluetoothAdapter.ACTION_DISCOVERY_FINISHED:
                    mHandler.sendEmptyMessage(BleAction.BleManagerStopScan);
//                    bleManager.sendEvent("BleManagerStopScan", map);
                    Log.d(LOG_TAG, "扫描结束");
                    break;
                case BluetoothDevice.ACTION_FOUND:
                    //获取蓝牙设备

                    if (device != null && null != device.getName()) {
                        int rssi = -120;
                        Bundle extras = intent.getExtras();
                        if (extras != null) {
                            //获取信号强度
                            rssi = extras.getShort(BluetoothDevice.EXTRA_RSSI);
                        }
                        BleInfo bleInfo = new BleInfo();
                        String deviceBTMajorClass = getBTMajorDeviceClass(device.getBluetoothClass().getMajorDeviceClass());
                        bleInfo.setName(device.getName());
                        bleInfo.setId(device.getAddress());
                        bleInfo.setRssi(rssi);
                        bleInfo.setType(deviceBTMajorClass);
                        bleInfo.setBluetoothDevice(device);

                        Message found = Message.obtain();
                        found.obj = bleInfo;
                        found.what = BleAction.BleManagerDiscover;
                        mHandler.sendMessage(found);
                        Log.d(LOG_TAG, "发现设备：" + "name=" + device.getName() + " type=" + deviceBTMajorClass);
                    }
                    break;
                case BluetoothDevice.ACTION_ACL_CONNECTED: {
                    Log.d(LOG_TAG, "已连接");
                    break;
                }
                case BluetoothDevice.ACTION_ACL_DISCONNECTED: {
                    Log.d(LOG_TAG, "断开连接");
                    break;
                }
                case BluetoothDevice.ACTION_BOND_STATE_CHANGED:
                    Log.d(LOG_TAG, "配对状态改变");
                    if (device != null) {
                        switch (device.getBondState()){
                            case BluetoothDevice.BOND_NONE:
                                Log.d(LOG_TAG, "配对失败");
                                break;
                            case BluetoothDevice.BOND_BONDING:
                                Log.d(LOG_TAG, "配对中");
                                break;
                            case BluetoothDevice.BOND_BONDED:
                                Log.d(LOG_TAG, "配对成功");
                                break;
                        }
                    }
                    break;

                case BluetoothDevice.ACTION_PAIRING_REQUEST:
                    //配对的验证码，如果是-1侧不需要验证码
                    int key = intent.getExtras().getInt(BluetoothDevice.EXTRA_PAIRING_KEY, -1);
                    if (device.getBondState() != BluetoothDevice.BOND_BONDED) {
                        try {
                            //1.确认配对
                            boolean success;
                            if (key != -1) {
                                success = device.setPin(String.valueOf(key).getBytes());
                            } else {
                                //需要系统权限，如果没有系统权限，就点击弹窗上的按钮配对吧
                                success = device.setPairingConfirmation(true);
                            }
                            Log.d(LOG_TAG, "key=" + key + "  bond=" + success);
                            //如果没有将广播终止，则会出现一个一闪而过的配对框。
                            abortBroadcast();
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                    break;

            }
        }
    }

    private String getBTMajorDeviceClass(int major) {
        switch (major) {
            case BluetoothClass.Device.Major.AUDIO_VIDEO:
                return "AUDIO_VIDEO";
            case BluetoothClass.Device.Major.COMPUTER:
                return "COMPUTER";
            case BluetoothClass.Device.Major.HEALTH:
                return "HEALTH";
            case BluetoothClass.Device.Major.IMAGING:
                return "IMAGING";
            case BluetoothClass.Device.Major.MISC:
                return "MISC";
            case BluetoothClass.Device.Major.NETWORKING:
                return "NETWORKING";
            case BluetoothClass.Device.Major.PERIPHERAL:
                return "PERIPHERAL";
            case BluetoothClass.Device.Major.PHONE:
                return "PHONE";
            case BluetoothClass.Device.Major.TOY:
                return "TOY";
            case BluetoothClass.Device.Major.UNCATEGORIZED:
                return "UNCATEGORIZED";
            case BluetoothClass.Device.Major.WEARABLE:
                return "WEARABLE";
            default:
                return "unknown";
        }
    }
}
