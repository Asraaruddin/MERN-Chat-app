import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("userInfo")));
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
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
