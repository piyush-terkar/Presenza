import numpy as np
import socket
import cv2
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

server.bind((('127.0.0.1'), 5000))
server.listen(1)

print("model listening on port 5000")
express, addr = server.accept()
print("express connected")
try:
    while True:
        data = express.recv(1024)
        print(data.decode('utf-8'))
        # to show the original image
        # cv2.imshow('stream', cv2.VideoCapture(data.decode('utf-8')).read())
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break
finally:
    server.close()
