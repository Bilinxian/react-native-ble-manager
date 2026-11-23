cmake_minimum_required(VERSION 3.13)
set(rnoh_ble_manager_dir "${CMAKE_CURRENT_SOURCE_DIR}/generated")

file(GLOB_RECURSE rnoh_ble_manager_SRC "${rnoh_ble_manager_dir}/*.cpp")
file(GLOB rnoh_ble_SRC CONFIGURE_DEPENDS *.cpp)
add_library(rnoh_ble_manager SHARED
            ${rnoh_ble_SRC}
            ${rnoh_ble_manager_SRC}
)

target_include_directories(rnoh_ble_manager PUBLIC
                           ${CMAKE_CURRENT_SOURCE_DIR}
                           ${rnoh_ble_manager_dir}
)

target_link_libraries(rnoh_ble_manager PUBLIC rnoh)