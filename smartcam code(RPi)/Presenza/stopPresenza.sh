#!/usr/bin/bash

echo "Getting processes"
ps a | grep python3
echo "Stopping smartcam and servcam"
killall python3
echo "Smart camera stopped successfully"
