import { useEffect, useState } from "react";
import axios from "axios";

export const ChatPage = () => {
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/chat");
      setChats(response.data);
    } catch (error) {
      console.error("Axios error:", error.message);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
  <div>
    {chats.map((chat) => (
      <div key={chat._id}>
        <strong>{chat.sender.name}:</strong> {chat.content}
      </div>
    ))}
  </div>
);

};
