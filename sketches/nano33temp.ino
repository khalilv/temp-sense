
#include <SPI.h>
#include <WiFiNINA.h>

char ssid[] = "1171 rue beaudry";        //network SSID (name)
char pass[] = "1234567890";    //network password (use for WPA, or use as key for WEP)
int status = WL_IDLE_STATUS;
char server[] = "10.0.0.33";
char port[] = "8080";

WiFiClient client;
byte MAX_WIFI_ATTEMPTS = 10;
byte MAX_POST_ATTEMPTS = 5; 

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
  byte attempts = 0; 
  while (status != WL_CONNECTED && attempts <= MAX_WIFI_ATTEMPTS) {
      Serial.print("Connecting to network: ");
      Serial.println(ssid);   
      attempts++;
      status = WiFi.begin(ssid, pass);
      // wait 5 seconds for connection:
      delay(5000);
  }
  return (status == WL_CONNECTED);
}

void loop() {
  
  if (wifi_connect()) {
    Serial.print("Connected to network: ");
    Serial.println(ssid);
    

    //take temperature data
    delay(1000); 
    char dummy [] = "temp:200//humidity:33";

    //send post req
    if (post_data(dummy, str_len(dummy))) {
      Serial.print("Sent data successfully to server: ");
      Serial.println(server);
    }else{
      Serial.print("Could not post data to server: ");
      Serial.println(server);
    }

    //disconnect from wifi
    WiFi.end();
       
  }else {
    Serial.print("Could not connect to network: ");
    Serial.println(ssid);
  }
  //sleep
  delay(10000); 
}

// this method makes a HTTP connection to the server:
boolean post_data(char body[], int len) {
  byte attempts = 0;
  int port_num = atoi(port);
  char host[100] = {0};
  char content_length[25] = {0};
  char body_length[5] = {0};

  client.stop();
  
  strcat(host, "Host: "); 
  strcat(host, server);
  strcat(host, ":");
  strcat(host, port);
  
  itoa(len, body_length, 10);
  strcat(content_length, "Content-Length: ");
  strcat(content_length, body_length);  

  while (attempts <= MAX_POST_ATTEMPTS){
    if (client.connect(server, port_num)) {
      client.println("POST / HTTP/1.1");;
      client.println(host);
      client.println("User-Agent: ArduinoWiFi/1.1");
      client.println("Content-Type: text/plain");
      client.println("Connection: close");
      client.println(content_length);
      client.println();
      client.println(body);
      return true;
    }
    attempts++;
  }
  return false; 
}

int str_len(char str[]){
  int len = 0;
  while(str[len]!= '\0'){ len++; }
  return len;
}
