#!/bin/bash

export TAG=$(git describe --tags)

export BUILD_REV="$(cut -d'-' -f1 <<<"$TAG")"
export BUILD_NUMBER=$TRAVIS_BUILD_NUMBER
export BUILD_ENV="$(cut -d'-' -f2 <<<"$TAG")"

if test "$(cut -d'-' -f3 <<<"$TAG")" = "native"; then
  export BUILD_NATIVE=true
else
  export BUILD_NATIVE=false
fi


echo "$BUILD_NUMBER $BUILD_ENV $BUILD_NATIVE"