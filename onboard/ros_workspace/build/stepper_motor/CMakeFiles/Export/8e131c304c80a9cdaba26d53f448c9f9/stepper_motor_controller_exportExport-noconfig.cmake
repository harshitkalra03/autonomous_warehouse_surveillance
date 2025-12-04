#----------------------------------------------------------------
# Generated CMake target import file.
#----------------------------------------------------------------

# Commands may need to know the format version.
set(CMAKE_IMPORT_FILE_VERSION 1)

# Import target "stepper_motor::stepper_motor_controller" for configuration ""
set_property(TARGET stepper_motor::stepper_motor_controller APPEND PROPERTY IMPORTED_CONFIGURATIONS NOCONFIG)
set_target_properties(stepper_motor::stepper_motor_controller PROPERTIES
  IMPORTED_LINK_INTERFACE_LANGUAGES_NOCONFIG "CXX"
  IMPORTED_LOCATION_NOCONFIG "${_IMPORT_PREFIX}/lib/libstepper_motor_controller.a"
  )

list(APPEND _cmake_import_check_targets stepper_motor::stepper_motor_controller )
list(APPEND _cmake_import_check_files_for_stepper_motor::stepper_motor_controller "${_IMPORT_PREFIX}/lib/libstepper_motor_controller.a" )

# Commands beyond this point should not need to know the version.
set(CMAKE_IMPORT_FILE_VERSION)
