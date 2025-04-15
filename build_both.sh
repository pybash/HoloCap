#!/bin/sh

# Go into our next app and build it.
echo "Going into nextapp"
cd nextapp;
echo "Building"
npm run build;

# Return to the repository, remove the current build from server, and move the 
echo "Going back"
cd ..
echo "Removing current server build"
rm -rf ./server/out
echo "Moving the latest build into the server"
mv ./nextapp/out ./server/out

# Move the HoloLens compatiable file to server as well
echo "Copying the holocap compatiable app into server as well"
cp -r ./tester/. ./server/out