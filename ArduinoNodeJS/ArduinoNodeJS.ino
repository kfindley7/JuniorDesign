#include <SoftwareSerial.h> 
// Arduino pin 9 rx connect to xbee tx, Arduino pin 8 tx connect to xbee rx
//uint8_t rx = 9;
//uint8_t tx = 8;
//SoftwareSerial Serial_xbee(rx,tx);

void setup() {
  // initialize serial:
  Serial.begin(9600);
  //Serial_xbee.begin(19200);
}

void loop() {
  // read the input on analog pin 0:
  int sensorValue = analogRead(A0);
  Serial.print(sensorValue * (5.0 / 1023.0));
  Serial.print(" ");
  int sensorValue1 = analogRead(A1);
  Serial.print(sensorValue1 * (5.0 / 1023.0));
  Serial.print(" ");
  int sensorValue2 = analogRead(A2);
  // print out the value you read:
  Serial.println(sensorValue2 * (5.0 / 1023.0));

  /*if (sensorValue > 0) {
    Serial.println(sensorValue);
  } else if (sensorValue1 > 0) {
    Serial.println(sensorValue1);
  } else if (sensorValue2 > 0) {
    Serial.println(sensorValue2);
  } else {
    Serial.println(0);
  }*/
  delay(1); 
}

