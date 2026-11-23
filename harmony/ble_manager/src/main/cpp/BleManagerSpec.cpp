//
// Created on 2024/11/12.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

// NOTE: This entire file should be codegen'ed.

#include "BleManagerSpec.h"

using namespace rnoh;
using namespace facebook;

static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_read(jsi::Runtime &rt,
                                                                              react::TurboModule &turboModule,
                                                                              const jsi::Value *args, size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "read", args, count));
}

static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_readDescriptor(jsi::Runtime &rt,
                                                                                  react::TurboModule &turboModule,
                                                                                  const jsi::Value *args,
                                                                                  size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "readDescriptor", args, count));
}
static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_writeDescriptor(jsi::Runtime &rt,
                                                                                    react::TurboModule &turboModule,
                                                                                    const jsi::Value *args,
                                                                                    size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "writeDescriptor", args, count));
}
static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_write(jsi::Runtime &rt,
                                                                                    react::TurboModule &turboModule,
                                                                                    const jsi::Value *args,
                                                                                    size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "write", args, count));
}
static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_startNotification(jsi::Runtime &rt,
                                                                                    react::TurboModule &turboModule,
                                                                                    const jsi::Value *args,
                                                                                    size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "startNotification", args, count));
}
static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_getConnectedPeripherals(jsi::Runtime &rt,
                                                                                    react::TurboModule &turboModule,
                                                                                    const jsi::Value *args,
                                                                                    size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "getConnectedPeripherals", args, count));
}
static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_getBondedPeripherals(jsi::Runtime &rt,
                                                                                    react::TurboModule &turboModule,
                                                                                    const jsi::Value *args,
                                                                                    size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "getBondedPeripherals", args, count));
}
static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_getDiscoveredPeripherals(jsi::Runtime &rt,
                                                                                    react::TurboModule &turboModule,
                                                                                    const jsi::Value *args,
                                                                                    size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "getDiscoveredPeripherals", args, count));
}
static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_requestMTU(jsi::Runtime &rt,
                                                                                    react::TurboModule &turboModule,
                                                                                    const jsi::Value *args,
                                                                                    size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "requestMTU", args, count));
}
static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_retrieveServices(jsi::Runtime &rt,
                                                                                    react::TurboModule &turboModule,
                                                                                    const jsi::Value *args,
                                                                                    size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "retrieveServices", args, count));
}
static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_checkState(jsi::Runtime &rt,
                                                                                    react::TurboModule &turboModule,
                                                                                    const jsi::Value *args,
                                                                                    size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "checkState", args, count));
}
static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_start(jsi::Runtime &rt,
                                                                                    react::TurboModule &turboModule,
                                                                                    const jsi::Value *args,
                                                                                    size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "start", args, count));
}
static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_enableBluetooth(jsi::Runtime &rt,
                                                                                    react::TurboModule &turboModule,
                                                                                    const jsi::Value *args,
                                                                                    size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "enableBluetooth", args, count));
}
static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_scan(jsi::Runtime &rt,
                                                                                    react::TurboModule &turboModule,
                                                                                    const jsi::Value *args,
                                                                                    size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "scan", args, count));
}

static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_stopScan(jsi::Runtime &rt,
                                                                                    react::TurboModule &turboModule,
                                                                                    const jsi::Value *args,
                                                                                    size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "stopScan", args, count));
}
static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_createBond(jsi::Runtime &rt,
                                                                                    react::TurboModule &turboModule,
                                                                                    const jsi::Value *args,
                                                                                    size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "createBond", args, count));
}
static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_connect(jsi::Runtime &rt,
                                                                                    react::TurboModule &turboModule,
                                                                                    const jsi::Value *args,
                                                                                    size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "connect", args, count));
}
static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_disconnect(jsi::Runtime &rt,
                                                                                    react::TurboModule &turboModule,
                                                                                    const jsi::Value *args,
                                                                                    size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "disconnect", args, count));
}
static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_removePeripheral(jsi::Runtime &rt,
                                                                                    react::TurboModule &turboModule,
                                                                                    const jsi::Value *args,
                                                                                    size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "removePeripheral", args, count));
}
static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_isScanning(jsi::Runtime &rt,
                                                                                    react::TurboModule &turboModule,
                                                                                    const jsi::Value *args,
                                                                                    size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "isScanning", args, count));
}
static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_isPeripheralConnected(jsi::Runtime &rt,
                                                                                    react::TurboModule &turboModule,
                                                                                    const jsi::Value *args,
                                                                                    size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "isPeripheralConnected", args, count));
}
static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_readRSSI(jsi::Runtime &rt,
                                                                                    react::TurboModule &turboModule,
                                                                                    const jsi::Value *args,
                                                                                    size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "readRSSI", args, count));
}
static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_removeBond(jsi::Runtime &rt,
                                                                                     react::TurboModule &turboModule,
                                                                                     const jsi::Value *args,
                                                                                     size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "removeBond", args, count));
}
static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_addListener(jsi::Runtime &rt,
                                                                                     react::TurboModule &turboModule,
                                                                                     const jsi::Value *args,
                                                                                     size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).call(rt, "addListener", args, count));
}
static jsi::Value __hostFunction_NativeBleManagerCxxModuleSpecJSI_removeListeners(jsi::Runtime &rt,
                                                                                     react::TurboModule &turboModule,
                                                                                     const jsi::Value *args,
                                                                                     size_t count) {
    return jsi::Value(static_cast<ArkTSTurboModule &>(turboModule).call(rt, "removeListeners", args, count));
}


NativeBleManagerSpecJSI::NativeBleManagerSpecJSI(const ArkTSTurboModule::Context ctx,
                                                               const std::string name)
    : ArkTSTurboModule(ctx, name) {
    methodMap_["read"] = MethodMetadata{3, __hostFunction_NativeBleManagerCxxModuleSpecJSI_read};
    methodMap_["readDescriptor"] = MethodMetadata{4, __hostFunction_NativeBleManagerCxxModuleSpecJSI_readDescriptor};
    methodMap_["writeDescriptor"] = MethodMetadata{5, __hostFunction_NativeBleManagerCxxModuleSpecJSI_writeDescriptor};
    methodMap_["write"] = MethodMetadata{5, __hostFunction_NativeBleManagerCxxModuleSpecJSI_write};
    methodMap_["startNotification"] = MethodMetadata{3, __hostFunction_NativeBleManagerCxxModuleSpecJSI_startNotification};
    methodMap_["getConnectedPeripherals"] = MethodMetadata{1, __hostFunction_NativeBleManagerCxxModuleSpecJSI_getConnectedPeripherals};
    methodMap_["getBondedPeripherals"] = MethodMetadata{0, __hostFunction_NativeBleManagerCxxModuleSpecJSI_getBondedPeripherals};
    methodMap_["getDiscoveredPeripherals"] = MethodMetadata{0, __hostFunction_NativeBleManagerCxxModuleSpecJSI_getDiscoveredPeripherals};
    methodMap_["requestMTU"] = MethodMetadata{2, __hostFunction_NativeBleManagerCxxModuleSpecJSI_requestMTU};
    methodMap_["retrieveServices"] = MethodMetadata{2, __hostFunction_NativeBleManagerCxxModuleSpecJSI_retrieveServices};
    methodMap_["checkState"] = MethodMetadata{0, __hostFunction_NativeBleManagerCxxModuleSpecJSI_checkState};
    methodMap_["start"] = MethodMetadata{1, __hostFunction_NativeBleManagerCxxModuleSpecJSI_start};
    methodMap_["enableBluetooth"] = MethodMetadata{0, __hostFunction_NativeBleManagerCxxModuleSpecJSI_enableBluetooth};
    methodMap_["scan"] = MethodMetadata{4, __hostFunction_NativeBleManagerCxxModuleSpecJSI_scan};
    methodMap_["stopScan"] = MethodMetadata{0, __hostFunction_NativeBleManagerCxxModuleSpecJSI_stopScan};
    methodMap_["createBond"] = MethodMetadata{2, __hostFunction_NativeBleManagerCxxModuleSpecJSI_createBond};
    methodMap_["connect"] = MethodMetadata{1, __hostFunction_NativeBleManagerCxxModuleSpecJSI_connect};
    methodMap_["disconnect"] = MethodMetadata{2, __hostFunction_NativeBleManagerCxxModuleSpecJSI_disconnect};
    methodMap_["removePeripheral"] = MethodMetadata{1, __hostFunction_NativeBleManagerCxxModuleSpecJSI_removePeripheral};
    methodMap_["isScanning"] = MethodMetadata{0, __hostFunction_NativeBleManagerCxxModuleSpecJSI_isScanning};
    methodMap_["isPeripheralConnected"] = MethodMetadata{1, __hostFunction_NativeBleManagerCxxModuleSpecJSI_isPeripheralConnected};
    methodMap_["readRSSI"] = MethodMetadata{1, __hostFunction_NativeBleManagerCxxModuleSpecJSI_readRSSI};
    methodMap_["removeBond"] = MethodMetadata{1, __hostFunction_NativeBleManagerCxxModuleSpecJSI_removeBond};
    methodMap_["addListener"] = MethodMetadata{1, __hostFunction_NativeBleManagerCxxModuleSpecJSI_addListener};
    methodMap_["removeListeners"] = MethodMetadata{1, __hostFunction_NativeBleManagerCxxModuleSpecJSI_removeListeners};
}