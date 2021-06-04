from picamera.array import PiRGBArray
from picamera import PiCamera
import time
import cv2
import numpy as np
import face_recognition
import pickle
import requests
import os

url = "http://192.168.1.10:3000/mark"
FILE_ENC = "known_encodings.pkl"
FILE_LBL = "known_labels.pkl"
knownEncodings = []
knownLabels = []

def handshake():
	try:
		print("Attepting to connect")
		secKey = requests.post(url, json={"handshake": True })
		secKey = requests.post(url, json={ "SEC_KEY": secKey.text})
		print("handshake successful!")
		return secKey.text
	except:
		return

def post(rollno):
	try:
		send = requests.post(url, json={"rno": rollno, "SEC_KEY": secKey})
		return send.text
	except:
		return

def save(file, lst):
	save = open(file, "wb")
	pickle.dump(lst, save, protocol=pickle.HIGHEST_PROTOCOL)
	save.close()
	
def load(file):
	load = open(file, "rb")
	lst = pickle.load(load)
	load.close()
	return lst

if(not os.path.exists("known_encodings.pkl")):
	save(FILE_ENC, knownEncodings)
	save(FILE_LBL, knownLabels)
	print("Created non-existing files")

knownEncodings = load(FILE_ENC)
knownLabels = load(FILE_LBL)
print("Loaded knownfaces")
secKey = handshake()
while(not secKey):
	secKey = handshake()
print("Connected")

camera = PiCamera()
camera.resolution = (640, 480)
camera.framerate = 30
rawCapture = PiRGBArray(camera, size=(640, 480))
time.sleep(3)

for frame in camera.capture_continuous(rawCapture, format="bgr", use_video_port=True):
	
	image = frame.array
	imgSmall = cv2.resize(image,(0,0),None,0.25,0.25)
	imgSmall = cv2.cvtColor(imgSmall, cv2.COLOR_BGR2RGB)
	facesCurrFrame = face_recognition.face_locations(imgSmall)
	encodeCurrFrame = face_recognition.face_encodings(imgSmall,facesCurrFrame)
	for encodeFace, faceLoc in zip(encodeCurrFrame,facesCurrFrame):
		try:
			matches = face_recognition.compare_faces(knownEncodings,encodeFace)
			faceDistance = face_recognition.face_distance(knownEncodings,encodeFace)
			matchIndex = np.argmin(faceDistance)
			secKey = post(knownLabels[matchIndex])
			while(not secKey):
				secKey = handshake()
		except:
			pass
	cv2.imshow("Frame", image)
	key = cv2.waitKey(1) & 0xFF
	rawCapture.truncate(0)
	knownEncodings = load(FILE_ENC)
	knownLabels = load(FILE_LBL)
	if key == ord("q"):
		break
        
