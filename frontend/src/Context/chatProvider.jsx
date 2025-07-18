import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

// ✅ Automatically select correct backend URL
const ENDPOINT =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://talkify-5m26.onrender.com"
    : "http://localhost:5000");

const ChatContext = createContext(null);
let socketRef = null;

export const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);

  const navigate = useNavigate();
  const reconnecting = useRef(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    if (!socketRef) {
      socketRef = io(ENDPOINT, {
        transports: ["websocket", "polling"],
        withCredentials: true,
      });

      socketRef.emit("setup", user);
      socketRef.on("connected", () => setSocketConnected(true));

      socketRef.on("disconnect", () => {
        setSocketConnected(false);
        if (!reconnecting.current) {
          reconnecting.current = true;
          socketRef.connect();
        }
      });
    }

    return () => {
      if (socketRef) {
        socketRef.disconnect();
        socketRef = null;
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
        socket: socketRef,
        socketConnected,
        ENDPOINT, // expose to make API calls
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
