#!/bin/bash
# sysinfo_page  - A script to communicate with Oblique backend and create shortened URLs.

## Arguments
URLTOSHORTEN=""
BASE_URL="http://mybox:1338/short"
AUTH_KEY=""

if [ "$1" != "" ]; then
    URLTOSHORTEN="$1"
else
    echo "Please provide a long URL that you wish to shorten."
fi

## Shortening
RESP=$(curl -s -d "auth=$AUTH_KEY&link=$URLTOSHORTEN" -X POST $BASE_URL) || exit

echo "${RESP/o.prashant.me/shorted.tk}"