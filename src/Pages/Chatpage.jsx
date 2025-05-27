import { useEffect, useState } from "react";
import axios from "axios";

export const ChatPage = () => {
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
