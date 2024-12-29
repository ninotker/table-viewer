// src/composables/useWebSocket.js
import { ref, onUnmounted } from "vue";

export function useWebSocket(url) {
  const socket = ref(null);
  const intVariable = ref(0); // Simple integer variable to update

  const connect = () => {
    socket.value = new WebSocket(url);

    socket.value.onopen = () => {
      console.log("WebSocket connection established.");
    };

    socket.value.onmessage = (event) => {
      const data = JSON.parse(event.data);
      intVariable.value = data.value; // Update the variable with incoming data
    };

    socket.value.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    socket.value.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.close();
    }
  };

  onUnmounted(() => {
    disconnect();
  });

  return { intVariable, connect, disconnect };
}