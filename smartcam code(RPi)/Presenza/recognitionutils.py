import cv2
import numpy as np
import face_recognition
import pickle
import os
def generateEncoding(img, rno, lst1, lst2):
    print("encoding" + str(rno))
    img = cv2.resize(img,(0,0),None,0.25,0.25)
    img = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
    locate = face_recognition.face_locations(img)
    encode = face_recognition.face_encodings(img, locate)[0]
    print("encoded" + str(rno))
    lst1.append(encode)
    lst2.append(rno)
def save(file, lst):
	save = open(file, "wb")
	pickle.dump(lst, save, protocol=pickle.HIGHEST_PROTOCOL)
	save.close()
def load(file):
	print("loaded " + file)
	load = open(file, "rb")
	lst = pickle.load(load)
	load.close()
	return lst
