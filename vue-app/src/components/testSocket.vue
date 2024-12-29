<template>
    <div style="display: flex; justify-content: center; flex-direction: column; align-items: center;">
      <h1>Live Table</h1>
      <table style="width: 500px;">
        <thead>
          <tr>
            <th v-for="(col, colIndex) in columns" :key="colIndex">Column {{ colIndex + 1 }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
            <td
              v-for="(cell, colIndex) in row"
              :key="colIndex"
              :class="{ flash: updatedCells.has(`${rowIndex}-${colIndex}`) }"
            >
              {{ cell }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from "vue";
  import axios from "axios";
  
  const rows = ref(
    Array.from({ length: 10 }, () => Array(10).fill(0)) // Initialize a 10x10 table with 0s
  );
  const columns = Array.from({ length: 10 }, (_, i) => `Column ${i + 1}`); // Define 10 columns
  const updatedCells = ref(new Set()); // Track updated cells
  let socket = null;
  
  const fetchTable = async () => {
    try {
      const response = await axios.get("http://localhost:3002/api/table");
      rows.value = response.data.table; // Populate the table with the fetched data
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };
  
  // Connect WebSocket for real-time updates
  const connectWebSocket = () => {
    socket = new WebSocket("ws://localhost:3002");
  
    socket.onopen = () => {
      console.log("WebSocket connection established.");
    };
  
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { rowIndex, colIndex, value } = data;
  
      // Update the specific cell in the table
      if (rows.value[rowIndex]) {
        rows.value[rowIndex][colIndex] = value;
  
        // Add the cell to the updatedCells set
        const cellKey = `${rowIndex}-${colIndex}`;
        updatedCells.value.add(cellKey);
  
        // Remove the cell from the updatedCells set after a delay
        setTimeout(() => {
          updatedCells.value.delete(cellKey);
        }, 500); // Flash duration: 1 second
      }
    };
  
    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };
  
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };
  
  const disconnectWebSocket = () => {
    if (socket) {
      socket.close();
      socket = null;
    }
  };
  
  // Initialize on component mount
  onMounted(async () => {
    await fetchTable(); // Fetch initial table
    connectWebSocket(); // Start listening for updates
  });
  
  // Cleanup on component unmount
  onUnmounted(() => {
    disconnectWebSocket();
  });
  </script>
  
  <style lang="scss" scoped>
  .flash {
    color: red;
    animation: fadeOut 1s ease-in-out;
  }
  
  @keyframes fadeOut {
    0% {
      color: red;
    }
    100% {
    color: inherit;
    }
  }
  </style>