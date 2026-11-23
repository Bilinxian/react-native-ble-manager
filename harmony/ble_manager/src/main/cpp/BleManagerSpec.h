//
// Created on 2024/11/12.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#include <ReactCommon/TurboModule.h>
#include "RNOH/ArkTSTurboModule.h"

namespace rnoh {
class JSI_EXPORT NativeBleManagerSpecJSI : public ArkTSTurboModule {
public:
    NativeBleManagerSpecJSI(const ArkTSTurboModule::Context ctx, const std::string name);
};
}