#!/bin/bash

TAG=$(git describe --tags)

export BUILD_NUMBER="$(cut -d'-' -f1 <<<"$TAG")"
export BUILD_ENV="$(cut -d'-' -f2 <<<"$TAG")"

if test "$(cut -d'-' -f3 <<<"$TAG")" = "native"; then
  BUILD_NATIVE=true
else
  BUILD_NATIVE=false
fi


echo "$BUILD_NUMBER $BUILD_ENV $BUILD_NATIVE"