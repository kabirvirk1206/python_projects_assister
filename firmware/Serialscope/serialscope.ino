// firmware for esp32 / arduino uno
// streams the analog value on A0 as a float over serial
// also listens for "I2C_SCAN" and replies with each address it finds

#include <Wire.h>

#define ANALOG_PIN   A0
#define SERIAL_BAUD  115200
#define SAMPLE_DELAY 50

#ifdef ESP32
  #define VREF       3.3f
  #define ADC_BITS   12
#else
  #define VREF       5.0f
  #define ADC_BITS   10
#endif


void runI2CScan() {
  for (uint8_t addr = 1; addr < 127; addr++) {
    Wire.beginTransmission(addr);
    uint8_t err = Wire.endTransmission();
    if (err == 0) {
      Serial.print("FOUND:0x");
      if (addr < 16) {
        Serial.print("0");
      }
      Serial.println(addr, HEX);
    }
  }
  Serial.println("SCAN_DONE");
}


void setup() {
  Serial.begin(SERIAL_BAUD);
  Wire.begin();
  delay(200);
}


void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd == "I2C_SCAN") {
      runI2CScan();
      return;
    }
  }

  int raw = analogRead(ANALOG_PIN);
  float voltage = (float)raw / ((1 << ADC_BITS) - 1) * VREF;

  Serial.println(voltage, 4);

  delay(SAMPLE_DELAY);
}
