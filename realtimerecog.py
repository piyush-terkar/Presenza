import cv2
import numpy as np
import face_recognition
import os
import marktoexcel as me
path = 'knownfaces'
images = []
labels = []
myList = os.listdir(path)
print(myList)

for cls in myList:
    curImg = cv2.imread(f'{path}/{cls}')
    images.append(curImg)
    labels.append(os.path.splitext(cls)[0]) #to remove the .jpg extension
print(labels)

#encoding the images
def findEncodings(images):
    encodeList = []
    for img in images:
        #first convert the images into rgb
        img = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
        #finding the encodings
        encode = face_recognition.face_encodings(img)[0]
        #appending the encodings to the list
        encodeList.append(encode)
    return encodeList

knownEncodings = findEncodings(images)
print('Encoding Completed')

#comparing the images
capture = cv2.VideoCapture(0)  #input from web cam

while True:
    success,img = capture.read()
    imgSmall = cv2.resize(img,(0,0),None,0.25,0.25) #resizing images
    imgSmall = cv2.cvtColor(imgSmall, cv2.COLOR_BGR2RGB) #converting the new image into rgb

    facesCurrFrame = face_recognition.face_locations(imgSmall) #finding the locations as there are multiple images
    #finding the encodings for the input images
    encodeCurrFrame = face_recognition.face_encodings(imgSmall,facesCurrFrame)

    #finding the match
    for encodeFace, faceLoc in zip(encodeCurrFrame,facesCurrFrame):
        matches = face_recognition.compare_faces(knownEncodings,encodeFace)
        faceDistance = face_recognition.face_distance(knownEncodings,encodeFace)
        #print(faceDistance)
        matchIndex = np.argmin(faceDistance)
        if matches[matchIndex]:
            name = labels[matchIndex].upper()
            print(name)
            try:
                facesCurrFrame = face_recognition.face_locations(img)
                top_left = (facesCurrFrame[0][3], facesCurrFrame[0][0])
                bottom_right = (facesCurrFrame[0][1], facesCurrFrame[0][2])
                color = [0, 255, 0]

                cv2.rectangle(img, top_left, bottom_right, color, 3)

                top_left = (facesCurrFrame[0][3], facesCurrFrame[0][2])
                bottom_right = (facesCurrFrame[0][1], facesCurrFrame[0][2] + 22)
                cv2.rectangle(img, top_left, bottom_right, color, cv2.FILLED)
                cv2.putText(img, name, (facesCurrFrame[0][3] + 10, facesCurrFrame[0][2] + 15), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                        (0,0,0), 2)
            except:
                pass
            me.markAttendance(int(name)-1, "attendance.xlsx")
    cv2.imshow('webcam',img) #to show the original image
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break
