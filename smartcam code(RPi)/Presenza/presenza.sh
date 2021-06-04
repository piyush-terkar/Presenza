#!/usr/bin/bash

cd ~
cd Presenza
python3 servcam.py &
echo "Started server going to sleep"
sleep 5
echo "Woke up"
python3 smartcam.py &
echo "started smart cam, done!"
