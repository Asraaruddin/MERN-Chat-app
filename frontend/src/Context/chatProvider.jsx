import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const ChatContext = createContext(null);

// Use environment variable or fallback to localhost
const ENDPOINT = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);

  const socketRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    if (!socketRef.current) {
      socketRef.current = io(ENDPOINT, {
        transports: ["websocket", "polling"],
        withCredentials: true,
      });

      socketRef.current.emit("setup", user);

      socketRef.current.on("connected", () => setSocketConnected(true));

      socketRef.current.on("disconnect", () => {
        setSocketConnected(false);
        socketRef.current.connect(); // Auto-reconnect
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, navigate]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        socket: socketRef.current,
        socketConnected,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("ChatState must be used within a ChatProvider");
  }
  return context;
};
