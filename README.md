> 文档模板：v0.4.2

<p align="center">
  <h1 align="center"> <code>react-native-ble-manager</code> </h1>
</p>

本项目基于 [react-native-ble-manager](https://github.com/innoveit/react-native-ble-manager) 开发。

该第三方库的仓库已迁移至 GitCode，且支持直接从 npm 下载，新的包名为：`@react-native-ohos/react-native-ble-manager` 版本所属关系如下：

| 三方库名称    | 三方库版本（npm地址）    | 发布信息     | 支持RN版本    | Autolink     | 编译API版本     | 社区基线版本    |  源码地址   |
| ------------ | ------------ | ------------------------------ | ------------- | ------------- |------------------------ | ------------- | ------------- |
| @react-native-ohos/react-native-ble-manager | [~11.5.3](https://www.npmjs.com/package/@react-native-ohos/react-native-ble-manager)   | [GitCode Releases](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/releases) | 0.72.* | 否 | API12+ | 11.5.2 | [br_rnoh0.72](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/tree/br_rnoh0.72) |

## 简介

react-native-ble-manager 是用于 React Native 的蓝牙低功耗（BLE）通信管理库。<br/>
支持扫描、连接外围设备，获取外围设备的服务与特征，以及特征的读取、写入、开启通知等操作。

## 下载安装

对于未发布到npm的旧版本，请参考[安装指南](https://gitcode.com/CPF-RN/usage-docs/blob/master/zh-cn/tgz-usage.md)安装tgz包。

进入到工程目录并输入以下命令：

**npm**

```bash
npm install @react-native-ohos/react-native-ble-manager
```

**yarn**

```bash
yarn add @react-native-ohos/react-native-ble-manager
```

## Link

|                                      | 是否支持autolink | RN框架版本 |
|--------------------------------------|-----------------|------------|
| ~11.5.3                              |  No              |  0.72     |

使用AutoLink的工程需要根据该文档配置，Autolink框架指导文档：https://gitcode.com/CPF-RN/ohos_react_native/blob/master/docs/zh-cn/Autolinking.md

如您使用的版本支持 Autolink，并且工程已接入 Autolink，可跳过ManualLink配置。

ManualLink: 此步骤为手动配置原生依赖项的指导。
首先需要使用 DevEco Studio 打开项目里的 HarmonyOS 工程 `harmony`。

### 1. Overrides RN SDK

为了让工程依赖同一个版本的 RN SDK，需要在工程根目录的 `oh-package.json5` 添加 overrides 字段，指向工程需要使用的 RN SDK 版本。替换的版本既可以是一个具体的版本号，也可以是一个模糊版本，还可以是本地存在的 HAR 包或源码目录。

关于该字段的作用请阅读[官方说明](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/ide-oh-package-json5-V5#zh-cn_topic_0000001792256137_overrides)

```json
{
  "overrides": {
    "@rnoh/react-native-openharmony": "^0.72.38" // ohpm 在线版本
    // "@rnoh/react-native-openharmony" : "./react_native_openharmony.har" // 指向本地 har 包的路径
    // "@rnoh/react-native-openharmony" : "./react_native_openharmony" // 指向源码路径
  }
}
```

### 2. 引入原生端代码

目前有两种方法：

- 通过 har 包引入；
- 直接链接源码。

方法一：通过 har 包引入（推荐）

> [!TIP] har 包位于三方库安装路径的 `harmony` 文件夹下。

打开 `entry/oh-package.json5`，添加以下依赖

```json
"dependencies": {
    "@rnoh/react-native-openharmony": "file:../react_native_openharmony",
    "@react-native-ohos/react-native-ble-manager": "file:../../node_modules/@react-native-ohos/react-native-ble-manager/harmony/ble_manager.har",
  }
```

点击右上角的 `sync` 按钮

或者在终端执行：

```bash
cd entry
ohpm install
```

方法二：直接链接源码

> [!TIP] 如需使用直接链接源码，请参考[直接链接源码说明](https://gitcode.com/CPF-RN/usage-docs/blob/master/zh-cn/link-source-code.md)

### 3. 配置 CMakeLists 和引入 BleManagerPackage

打开 `entry/src/main/cpp/CMakeLists.txt`，添加：

```diff
project(rnapp)
cmake_minimum_required(VERSION 3.4.1)
set(CMAKE_SKIP_BUILD_RPATH TRUE)
set(RNOH_APP_DIR "${CMAKE_CURRENT_SOURCE_DIR}")
set(NODE_MODULES "${CMAKE_CURRENT_SOURCE_DIR}/../../../../../node_modules")
+ set(OH_MODULES "${CMAKE_CURRENT_SOURCE_DIR}/../../../oh_modules")
set(RNOH_CPP_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../../../../../../react-native-harmony/harmony/cpp")
set(LOG_VERBOSITY_LEVEL 1)
set(CMAKE_ASM_FLAGS "-Wno-error=unused-command-line-argument -Qunused-arguments")
set(CMAKE_CXX_FLAGS "-fstack-protector-strong -Wl,-z,relro,-z,now,-z,noexecstack -s -fPIE -pie")
set(WITH_HITRACE_SYSTRACE 1) # for other CMakeLists.txt files to use
add_compile_definitions(WITH_HITRACE_SYSTRACE)

add_subdirectory("${RNOH_CPP_DIR}" ./rn)

# RNOH_BEGIN: manual_package_linking_1
add_subdirectory("../../../../sample_package/src/main/cpp" ./sample-package)
+ add_subdirectory("${OH_MODULES}/@react-native-ohos/react-native-ble-manager/src/main/cpp" ./rnoh_ble_manager)


# RNOH_END: manual_package_linking_1

file(GLOB GENERATED_CPP_FILES "./generated/*.cpp")

add_library(rnoh_app SHARED
    ${GENERATED_CPP_FILES}
    "./PackageProvider.cpp"
    "${RNOH_CPP_DIR}/RNOHAppNapiBridge.cpp"
)
target_link_libraries(rnoh_app PUBLIC rnoh)

# RNOH_BEGIN: manual_package_linking_2
target_link_libraries(rnoh_app PUBLIC rnoh_sample_package)
+ target_link_libraries(rnoh_app PUBLIC rnoh_ble_manager)
# RNOH_END: manual_package_linking_2
```

打开 `entry/src/main/cpp/PackageProvider.cpp`，添加：

```diff
#include "RNOH/PackageProvider.h"
#include "generated/RNOHGeneratedPackage.h"
#include "SamplePackage.h"
+ #include "BleManagerPackage.h"

using namespace rnoh;

std::vector<std::shared_ptr<Package>> PackageProvider::getPackages(Package::Context ctx) {
    return {
      std::make_shared<RNOHGeneratedPackage>(ctx),
      std::make_shared<SamplePackage>(ctx),
+     std::make_shared<BleManagerPackage>(ctx)
    };
}
```

### 4. 在 ArkTs 侧引入 BlePackage

打开 `entry/src/main/ets/RNPackagesFactory.ts`，添加：

```diff
  ...
+ import { BlePackage } from '@react-native-ohos/react-native-ble-manager/ts';


export function createRNPackages(ctx: RNPackageContext): RNPackage[] {
  return [
    new SamplePackage(ctx),
+    new BlePackage(ctx)
  ];
}
```

### 运行

点击右上角的 `sync` 按钮

或者在终端执行：

```bash
cd entry
ohpm install
```

然后编译、运行即可。

## 约束与限制

### 兼容性

本文档内容基于以下版本验证通过：

1. RNOH: 0.72.27; SDK: HarmonyOS-Next-DB1 5.0.0.29(SP1); IDE: DevEco Studio 5.0.3.403; ROM: 3.0.0.25;
2. RNOH：0.72.33; SDK：OpenHarmony 5.0.0.71(API Version 12 Release); IDE：DevEco Studio 5.0.3.900; ROM：NEXT.0.0.71;

### 权限要求

- 由于此库涉及蓝牙系统控制功能，使用对应接口时则需要配置对应的权限，权限需配置在entry/src/main目录下module.json5文件中。其中部分权限需弹窗向用户申请授权。具体权限配置见文档：[程序访问控制](https://gitee.com/openharmony/docs/blob/master/zh-cn/application-dev/security/AccessToken/Readme-CN.md#/openharmony/docs/blob/master/zh-cn/application-dev/security/AccessToken/app-permission-mgmt-overview.md)。

- 此库部分功能与接口需要normal权限：ohos.permission.ACCESS_BLUETOOTH。

### 编译运行API要求

> [!TIP] 当前三方库所有版本均已实现版本隔离，支持在 `API12+` 工程编译，及 `API12+` ROM运行。

## 使用示例

> [!WARNING] 使用时 import 的库名不变。

```js
import BleManager from 'react-native-ble-manager';

async function demo(peripheralId: string, serviceUUID: string, characteristicUUID: string) {
  await BleManager.start();

  const discoverListener = BleManager.addListener(
    'BleManagerDiscoverPeripheral',
    (peripheral) => {
      console.log('发现设备:', peripheral.id, peripheral.name);
    },
  );

  await BleManager.scan([serviceUUID], 5, true);

  await BleManager.connect(peripheralId);
  await BleManager.retrieveServices(peripheralId);
  const value = await BleManager.read(peripheralId, serviceUUID, characteristicUUID);
  console.log('read:', value);
  await BleManager.write(peripheralId, serviceUUID, characteristicUUID, [1]);

  await BleManager.startNotification(peripheralId, serviceUUID, characteristicUUID);

  await BleManager.disconnect(peripheralId);
  discoverListener.remove();
}
```

## 构建 Harmony 示例工程

在 `example/` 目录下运行 `npm run fast:pkg`（需确保 `ohpm` 已在 `PATH` 中）。

`precodegen` 钩子会在 codegen 向已安装的 RNOH 模块写入生成代码之前，先安装鸿蒙侧依赖。
若在首次 `ohpm install` 之前运行 codegen，依赖目录被替换时会丢失已生成的 `TM` 定义。

## 接口说明

> [!TIP] "Platform"列表示该属性在原三方库上支持的平台。

> [!TIP] "OpenHarmony Support"列为 yes 表示 OpenHarmony平台支持 该属性；no 则表示不支持；partially 表示部分支持。使用方法跨平台一致，效果对标 iOS 或 Android 的效果。

### API

| 名称                                         | 描述                                                         | 类型                    | 必填     | 平台        | OpenHarmony平台支持 |
| -------------------------------------------- | ------------------------------------------------------------ | ----------------------- | -------- | ----------- | ----------------- |
| `start`                                        | 初始化模块。返回一个 Promise 对象。请勿多次调用此方法。      | Promise                 | No       | IOS/Android | Yes               |
| `scan`                                         | 扫描可用的外围设备                                           | Promise                 | No       | IOS/Android | Yes               |
| `stopScan`                                     | 停止扫描                                                     | Promise\<void\>         | No       | IOS/Android | Yes               |
| `connect`                                      | 尝试连接到外围设备。多数情况下，如果无法连接，你需要先扫描外围设备。 | Promise                 | No       | IOS/Android | Yes               |
| `disconnect`                                   | 断开与外围设备的连接                                         | Promise\<void\>         | No       | IOS/Android | Yes               |
| `enableBluetooth`                              | 创建 ACTION_REQUEST_ENABLE 以请求用户开启蓝牙                | Promise\<void\>         | No       | Android     | Yes               |
| `checkState`                                   | 强制模块检查原生 BLE 管理器的状态，并触发 BleManagerDidUpdateState 事件 | Promise\<BleState\>     | No       | IOS/Android | Yes               |
| `readRSSI`                                     | 读取当前 RSSI 值                                             | Promise                 | No       | IOS/Android | Yes               |
| `createBond`                                   | 启动与远程设备的绑定（配对）过程                             | Promise                 | No       | Android     | Yes               |
| `retrieveServices`                             | 获取外围设备的服务和特征                                     | Promise                 | No       | IOS/Android | Yes               |
| `startNotification`                            | 在指定特征上开启通知                                         | Promise                 | No       | IOS/Android | Yes               |
| `read`                                         | 读取指定特征的当前值                                         | Promise                 | No       | IOS/Android | Yes               |
| `write`                                        | 向指定特征写入（带响应）                                     | Promise                 | No       | IOS/Android | Yes               |
| `readDescriptor`                               | 读取指定描述符的当前值                                       | Promise                 | No       | IOS/Android | Yes               |
| `writeDescriptor`                              | 向指定描述符写入值                                           | Promise                 | No       | IOS/Android | Yes               |
| `requestMTU`                                   | 请求指定连接所使用的 MTU 大小                                | Promise                 | No       | Android     | Yes               |
| `getConnectedPeripherals`                      | 返回已连接的外围设备                                         | Promise\<Peripheral[]\> | No       | IOS/Android | Yes               |
| `getBondedPeripherals`                         | 返回已绑定的外围设备                                         | Promise\<Peripheral[]\> | No       | IOS/Android | Yes               |
| `getDiscoveredPeripherals`                     | 返回扫描后已发现的外围设备                                   | Promise\<Peripheral[]\> | No       | IOS/Android | Yes               |
| `removeBond`                                   | 移除已配对的设备                                             | Promise                 | No       | Android     | No                |
| `refreshCache`                                 | 刷新外围设备的服务和特征缓存                                 | Promise                 | No       | Android     | No                |
| `requestConnectionPriority`                    | 请求连接参数更新                                             | Promise                 | No       | Android     | No                |
| `startNotificationUseBuffer`                        | 在指定特征上开启通知（使用缓冲区）。                           | Promise                 | No       | IOS/Android | No               |
| `removePeripheral`                             | 从缓存列表中移除已断开连接的外围设备                         | Promise                 | No       | Android     | Yes               |
| `CompanionScan`                                | 扫描配套设备                                                 | Promise                 | No       | Android     | No                |
| `getAssociatedPeripherals`                     | 获取关联的外围设备（来自配套设备管理器）                     | Promise\<Peripheral[]\> | No       | Android     | No                |
| `removeAssociatedPeripheral`                   | 移除已关联的外围设备                                         | Promise                 | No       | Android     | No                |
| `setName`                                      | 创建设置蓝牙适配器名称的请求                                 | void                    | No       | Android     | No                |
| `isScanning`                                   | 检查扫描是否正在进行，返回 true 或 false                     | Promise\<boolean\>      | No       | IOS/Android | Yes               |
| `writeWithoutResponse`                         | 向指定特征写入（不带响应）                                   | Promise                 | No       | IOS/Android | No                |
| `getMaximumWriteValueLengthForWithoutResponse` | 返回无响应写入的最大值长度                                   | Promise\<number\>       | No       | IOS         | No                |
| `getMaximumWriteValueLengthForWithResponse`    | 返回带响应写入的最大值长度                                   | Promise\<number\>       | No       | IOS         | No                |
| `isPeripheralConnected`                        | 检查指定外围设备是否已连接，返回 true 或 false               | Promise\<boolean\>      | No       | IOS         | Yes               |
| `supportsCompanion`                            | 检查当前设备是否支持配套设备管理器                           | Promise\<boolean\>      | No       | Android     | No                |
| `stopNotification`                             | 停止指定特征上的通知                                         | Promise                 | No       | IOS/Android | No                |

## 遗留问题

- refreshCache 用于清理和刷新蓝牙设备缓存的一部分 [issue#3](https://github.com/react-native-oh-library/react-native-ble-manager/issues/3)
- requestConnectionPriority 用于请求蓝牙连接优先级 [issue#4](https://github.com/react-native-oh-library/react-native-ble-manager/issues/4)
- startNotificationUseBuffer 用来启动一个带缓冲区的通知服务 [issue#6](https://github.com/react-native-oh-library/react-native-ble-manager/issues/6)
- CompanionScan 扫描配套设备[issue#5](https://github.com/react-native-oh-library/react-native-ble-manager/issues/5)
- getAssociatedPeripherals 检索相关外围设备（从配套管理器） [issue#7](https://github.com/react-native-oh-library/react-native-ble-manager/issues/7)
- removeAssociatedPeripheral 移除相关外围设备  [issue#8](https://github.com/react-native-oh-library/react-native-ble-manager/issues/8)
- setName 创建设置蓝牙适配器名称  [issue#9](https://github.com/react-native-oh-library/react-native-ble-manager/issues/9)
- supportsCompanion 检查当前设备是否支持配套设备管理器 [issue#10](https://github.com/react-native-oh-library/react-native-ble-manager/issues/10)
- stopNotification 停止指定特征的通知 [issue#11](https://github.com/react-native-oh-library/react-native-ble-manager/issues/11)
- writeWithoutResponse 写入不响应指定特性 [issue#12](https://github.com/react-native-oh-library/react-native-ble-manager/issues/12)
- removeBond 删除已配对的设备 [issue#13](https://github.com/react-native-oh-library/react-native-ble-manager/issues/13)
- getMaximumWriteValueLengthForWithoutResponse 用于获取在不带响应的情况下可以写入的最大数据长度 [issue#14](https://github.com/react-native-oh-library/react-native-ble-manager/issues/14)
- getMaximumWriteValueLengthForWithResponse 它用于获取在带有响应的情况下可以写入的最大数据长度  [issue#15](https://github.com/react-native-oh-library/react-native-ble-manager/issues/15)

## 其他

无

## 目录结构

````
/rntpc_react-native-ble-manager  # 项目根目录
├── harmony                        # 鸿蒙适配代码
│    ├─ ble_manager.har            # har包
│    ├─ ble_managerGatt.har        # GATT har包
│    ├─ ble_managerServers.har     # Servers har包
│    └─ ble_manager                # 鸿蒙适配核心代码
│         ├─ index.ets             # 鸿蒙适配代码入口
│         └─ src/main/ets          # 鸿蒙适配源码
│              ├─ BlePackage.ts    # 包入口，注册 BleTurboModule
│              ├─ BleTurboModule.ts # TurboModule 实现，桥接 JS 与原生 BLE 接口
│              ├─ DefaultScanManager.ts # 扫描管理实现
│              ├─ PeripheralData.ts # 外围设备数据封装
│              ├─ BleManagerLogger.ts # 日志工具
│              ├─ types.ts         # 鸿蒙侧类型定义
│              └─ utils/Util.ts    # 工具类
├── src                            # RN代码
│    ├─ index.ts                   # 入口文件
│    ├─ types.ts                   # 类型文件
│    └─ NativeGeneratedBleManagerTurboModule.ts # codegen类型文件
├── docs                           # 原库文档
├── README.md                      # 中文安装使用方法
└── README_en.md                   # 英文安装使用方法
````

## 贡献代码

使用过程中发现任何问题都可以提交 [Issue](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/issues)，当然，也非常欢迎提交 [PR](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/pulls) 。

## 开源协议

本项目基于 [The MIT License (MIT)](https://github.com/innoveit/react-native-ble-manager/blob/master/LICENSE) ，请自由地享受和参与开源。
