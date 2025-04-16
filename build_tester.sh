#!/bin/sh

# Delete the current server build
rm -rf ./server/out

# Move tester to out
cp -R ./tester ./server/out