import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import "./styles.css";
import { getSender, getSenderFull } from "../config/chatLogic";
import {useRef, useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { ProfileModal } from "./miscellaneous/ProfileModal";
import { ScrollableChat } from "./ScrollableChat";
import Lottie from "lottie-react";
import animationData from "../animations/typing.json";

import io from "socket.io-client";
import { UpdateGroupChatModal } from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/chatProvider";


const ENDPOINT = "http://localhost:5000"; 
var socket, selectedChatCompare;

 export const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [typingUserId, setTypingUserId] = useState(null);

  const toast = useToast();

  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
         console.log("Send message error:", error.response?.data || error.message);
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    // 1) Connect socket
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    // 2) Listen for “typing” and “stop typing”
 socket.on("typing", (payload) => {
      // payload could be { userId: "...", chatId: "..." } if you send that
      setIsTyping(true);
      setTypingUserId(payload.userId); // store who is typing
    });
    socket.on("stop typing", (payload) =>{
       setIsTyping(false);
       setTypingUserId(null);
  });
  return () => {
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
    };
  }, []);

  useEffect(() => {
  // Whenever selectedChat changes, fetch messages & join the room

    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
        // 3) Listen for “message received” (note the exact event name)
    socket.on("message received", (newMessageRecieved) => {
       // If the incoming message is for the current chat, append it
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
         // If it's for **a different** chat, push it into notifications
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
return () => {
      socket.off("message received");
    };

  });

  const typingTimeout = useRef(null);
const lastTypingTime = useRef(0);

const typingHandler = (e) => {
  setNewMessage(e.target.value);

  if (!socketConnected) return;

  if (!typing) {
    setTyping(true);
    socket.emit("typing", { roomId: selectedChat._id, userId: user._id });
  }

  lastTypingTime.current = Date.now();

  if (typingTimeout.current) clearTimeout(typingTimeout.current);

  typingTimeout.current = setTimeout(() => {
    const timeNow = Date.now();
    const timeDiff = timeNow - lastTypingTime.current;
    if (timeDiff >= 3000 && typing) {
      socket.emit("stop typing", { roomId: selectedChat._id, userId: user._id });
      setTyping(false);
    }
  }, 3000);
};

useEffect(() => {
  return () => {
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
  };
}, []);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
               /* ONLY show the typing animation when someone else (typingUserId) is typing */
            >
              {istyping && selectedChat && typingUserId !== user._id && (
  <div 
   style={{
    backgroundColor: "#f1f1f1",          // softer background
    borderRadius: "20px",                // pill shape
    padding: "6px 12px",                 // enough breathing space
    marginBottom: "8px",                 // separates it from input
    marginLeft: "8px",                   // some left margin
    alignSelf: "flex-start",             // aligns to start in chat
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)", // soft shadow
    display: "inline-block",
  }}
  >
    <Lottie
    animationData={animationData}
  loop={true}
  autoplay={true}
  style={{ width: 50, height: 25 }} />
  </div>
)}

              <Input
                variant="filled"
                background="#bfc1c2"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
  <Text 
    fontSize="3xl" 
    pb={3} 
    fontFamily="Work sans" 
    fontWeight="bold"          // bold font weight
    color="black"              // strong black color
    letterSpacing="normal"     // normal letter spacing for readability
  >
    Click on a user to start chatting
  </Text>
</Box>


      )}
    </>
  );
};

