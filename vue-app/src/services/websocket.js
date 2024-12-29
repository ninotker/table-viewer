// src/services/websocket.js
export default class WebSocketService {
    constructor(url) {
      this.url = url;
      this.socket = null;
    }
  
    connect() {
      this.socket = new WebSocket(this.url);
  
      this.socket.onopen = () => {
        console.log("WebSocket connection established.");
      };
  
      this.socket.onclose = () => {
        console.log("WebSocket connection closed.");
      };
  
      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }
  
    sendMessage(message) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(message));
      } else {
        console.error("WebSocket is not open.");
      }
    }
  
    onMessage(callback) {
      if (this.socket) {
        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          callback(data);
        };
      }
    }
  
    disconnect() {
      if (this.socket) {
        this.socket.close();
      }
    }
  }