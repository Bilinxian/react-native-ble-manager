//
// Created on 2024/11/12.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#include "BleManagerPackage.h"
#include "BleManagerSpec.h"


using namespace rnoh;
using namespace facebook;

class BleManagerPackageFactoryDelegate : public TurboModuleFactoryDelegate {

    public:
    SharedTurboModule createTurboModule(Context ctx, const std::string &name) const override {
        if (name == "BleManager") {
            return std::make_shared<NativeBleManagerSpecJSI>(ctx, name);
        }
        return nullptr;
    };
};

std::unique_ptr<TurboModuleFactoryDelegate> BleManagerPackage::createTurboModuleFactoryDelegate() {
    return std::make_unique<BleManagerPackageFactoryDelegate>();
}