
#include <SPI.h>
#include <WiFiNINA.h>

char ssid[] = "1171 rue beaudry";        //network SSID (name)
char pass[] = "1234567890";    //network password (use for WPA, or use as key for WEP)

int status = WL_IDLE_STATUS;
unsigned int MAX_WIFI_ATTEMPTS = 10; 

WiFiClient client;
char server[] = "10.0.0.33";
unsigned int port = 8080; 

void setup() {

  //Initialize serial and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {;}

  // check for the WiFi module:
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    while (true);
  }
  
}

boolean wifi_connect(){
  int attempts = 0; 
  while (status != WL_CONNECTED && attempts <= MAX_WIFI_ATTEMPTS) {
      Serial.print("Connecting to network: ");
      Serial.println(ssid);   
      status = WiFi.begin(ssid, pass);
      // wait 10 seconds for connection:
      delay(10000);
  }
  return (status == WL_CONNECTED);
}

void loop() {
  
  if (wifi_connect()) {
    Serial.print("Connected to network: ");
    Serial.println(ssid);


    //take temperature data
    delay(1000); 
    String dummy = "{\n  \"value\": 500\n}";
    //send post req
    if (post_data(dummy)) {
      Serial.print("Sent data successfully to network: ");
      Serial.println(ssid);
    }else{
      Serial.print("Could not post data to network: ");
      Serial.println(ssid);
    }

    //disconnect from wifi

   
  }else {
    Serial.print("Could not connect to network: ");
    Serial.println(ssid);
  }
  //sleep
  delay(10000); 
}

// this method makes a HTTP connection to the server:
boolean post_data(String body) {

  client.stop();

  if (client.connect(server, port)) {

    // send the HTTP POST request:

    client.println("POST / HTTP/1.1");
    client.println("Host: 10.0.0.33:8080");
    client.println("User-Agent: ArduinoWiFi/1.1");
    client.println("Content-Type: application/json");
    client.println("Connection: close");
    client.println("Content-Length: " + String(body.length()));
    client.println();

    client.println(body);

    return true; 
    
  } else {
    
    return false; 
    
  }
}
