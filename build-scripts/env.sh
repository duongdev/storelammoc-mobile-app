#!/bin/bash

# export TAG=$(git describe --tags)

export BUILD_REV=$TRAVIS_TAG
export BUILD_NUMBER=$TRAVIS_BUILD_NUMBER
export BUILD_ENV="$(cut -d'-' -f2 <<<"$TAG")"

if test "$(cut -d'-' -f3 <<<"$TAG")" = "native"; then
  export BUILD_NATIVE=true
else
  export BUILD_NATIVE=false
fi


echo "$TAG $BUILD_ENV $BUILD_NATIVE"