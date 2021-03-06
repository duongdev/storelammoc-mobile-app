#!/bin/bash

export TAG=$TRAVIS_TAG

export BUILD_REV="$(cut -d'-' -f1 <<<"$TAG")"
export BUILD_NUMBER=$TRAVIS_BUILD_NUMBER
export BUILD_ENV="$(cut -d'-' -f2 <<<"$TAG")"
export BUILD_VERSION="$(cat version.txt)"

if test "$(cut -d'-' -f3 <<<"$TAG")" = "native"; then
  export BUILD_NATIVE=true
else
  export BUILD_NATIVE=false
fi


echo "$TAG $BUILD_ENV $BUILD_NATIVE"