#!/bin/sh

# Go into our next app and build it.
cd nextapp;
npm run build;

# Return to the repository, remove the current build from server, and move the 
cd ..
rm -rf ./server/out
mv ./nextapp/out ./server/out
