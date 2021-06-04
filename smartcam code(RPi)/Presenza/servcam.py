from flask import Flask, request
from werkzeug import secure_filename
import numpy as np
import face_recognition
import recognitionutils as ru
import cv2
import os

FILE_ENC = "known_encodings.pkl"
FILE_LBL = "known_labels.pkl"
knownEncodings = []
knownLabels = []
if(not os.path.exists("known_encodings.pkl")):
	ru.save(FILE_ENC, knownEncodings)
	ru.save(FILE_LBL, knownLabels)
	print("Created non-existing files")

knownEncodings = ru.load(FILE_ENC)
knownLabels = ru.load(FILE_LBL)
app = Flask(__name__)

def generateEncoding(img, rno):
    print("encoding" + str(rno))
    img = cv2.resize(img,(0,0),None,0.25,0.25)
    img = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
    locate = face_recognition.face_locations(img)
    encode = face_recognition.face_encodings(img, locate)[0]
    print("encoded" + str(rno))
    knownEncodings.append(encode)
    knownLabels.append(rno)

@app.route('/', methods = ['POST'])
def isEnrolled():
	img = request.files['img']
	rno = request.form['rollno']
	img.save(os.path.join("knownfaces",secure_filename(img.filename)))
	for file in os.listdir('knownfaces'):
		generateEncoding(cv2.imread(f'knownfaces/{file}'), int(rno))
	ru.save(FILE_ENC, knownEncodings)
	ru.save(FILE_LBL, knownLabels)
	os.remove('knownfaces/' + os.listdir('knownfaces')[0])
	print(img.filename)
	print(rno)
	return 'true'

if __name__ == '__main__':
	app.run(host='192.168.1.26', port=8000)