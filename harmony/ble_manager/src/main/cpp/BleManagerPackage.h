//
// Created on 2024/11/12.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#include "RNOH/Package.h"
namespace rnoh {
    class BleManagerPackage : public Package {
    public:
        BleManagerPackage(Package::Context ctx) : Package(ctx) {}
        std::unique_ptr<TurboModuleFactoryDelegate> createTurboModuleFactoryDelegate()
        override;
    };
} // namespace rnoh