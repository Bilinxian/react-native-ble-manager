# Changelog

### v11.5.4-beta.3 - 2026-10-21

- feat: Add the upstream v.11.5.2 example into the example app for behavior comparison ([#60](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/pull/60))
- feat: Rework the example entry into Upstream Example / Library Example home buttons with a SafeAreaView back bar ([#60](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/pull/60))
- feat: Sync the latest rnt BleManagerTestDemo cases into example/src/demo ([#60](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/pull/60))
- feat: Add the example/jest XTS suite and raise the coverage threshold to 100% ([#60](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/pull/60))
- fix: requestMTU resolves via the requested mtu and listens for BLEMtuChange; off BLEMtuChange on disconnect to avoid leaks ([#60](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/pull/60))
- fix: Use BleManager.addListener in the upstream demo (comment unsupported v12 onXxx) so the example opens and scanning works on OHOS ([#60](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/pull/60))
- chore: Align example scripts with the 0.77 branch by removing precodegen ohpm install ([#60](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/pull/60))
- chore: Prefer explicit value re-exports + `export type *` in src/index.ts for V8 coverage ([#60](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/pull/60))
- chore: Bump the package version to 11.5.4-beta.3 and align the example tgz filename ([#60](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/pull/60))
- chore: Rename the npm / ohpm package from `@react-native-oh-tpl/react-native-ble-manager` to `@react-native-ohos/react-native-ble-manager` ([#60](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/pull/60))
- feat: Emit BLECharacteristicChange to JS when a notification characteristic changes, aligned with the 0.77 branch ([#60](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/pull/60))

## HarmonyOS Log

### v11.5.4-beta.2 - 2026-09-20

- chore: Align the package.json files field with the template, adding index.js, index.d.ts, index.harmony.js, CHANGELOG.md and README.OpenSource while excluding build ([#54](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/pull/54))
- fix: Align the tgz filename version referenced by the example with the root package to fix the pipeline dependency install failure after npm pack ([#54](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/pull/54))

### v11.5.4-beta.1

- fix: fix the crash caused by the BLE scan timeout ([#39](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/pull/39))
- fix: fix the resource leak where the scan timeout callback returns early after stopScan without unregistering the BLEDeviceFind listener ([#39](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/pull/39))
- fix: guard offBLEDeviceFind with a try/catch so that ble.off throwing while Bluetooth is off no longer interrupts the scan flow ([#39](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/pull/39))
- feat: add the example project that was missing from this branch (RN 0.72) ([#39](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/pull/39))
- fix: fix the memory leak and duplicated callbacks caused by the BleManagerDiscoverPeripheral subscription not being cleaned up in the example ([#39](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/pull/39))
- refactor: split DefaultScanManager.scan() to clear the CodeCheck oversized-function and excessive-nesting-depth warnings ([#39](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/pull/39))
- style: add the missing semicolons and unify double-quoted strings to single quotes to clear the CodeCheck warnings ([#39](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/pull/39))
- fix: upgrade typescript to 5.5.4 to fix the pipeline compile failure caused by @types/node using const type parameters ([#39](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/pull/39))
- fix: normalise exactAdvertisingName in setFilters so that a string[] produces one ScanFilter per device name, instead of a single filter whose name is the whole array ([#39](https://gitcode.com/CPF-RN/rntpc_react-native-ble-manager/pull/39))
