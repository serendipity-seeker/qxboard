import { useSocketIO } from "./useSocketIO";
import { useEffect } from "react";
import toast from "react-hot-toast";

// Default server URL - should be configurable
const DEFAULT_SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export function useNotificationSocket() {
  const {
    isConnected,
    socket,
    emit,
    connect,
    disconnect
  } = useSocketIO({
    url: DEFAULT_SOCKET_URL,
    autoConnect: true,
    onConnect: () => {
      toast.success("Connected to notification server");
    },
    onDisconnect: () => {
      toast.error("Disconnected from notification server");
    },
    onError: (error) => {
      // toast.error(`Connection error: ${error.message}`);
    }
  });

  // Subscribe to user-specific notifications when connected
  useEffect(() => {
    if (isConnected && socket) {
      // You can subscribe to specific channels or rooms here
      // For example, if you have a user ID:
      // const userId = "user123";
      // emit("subscribe", { userId });
      
      console.log("Subscribed to notifications");
    }
  }, [isConnected, socket, emit]);

  return {
    isConnected,
    socket,
    emit,
    connect,
    disconnect
  };
} 