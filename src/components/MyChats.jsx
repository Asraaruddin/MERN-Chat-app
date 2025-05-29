import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text, useToast, Button } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/chatLogic";
import { ChatLoading } from "./chatLoading";
import { GroupChatModal } from "./miscellaneous/GroupChatModal";
import { ChatState } from "../Context/chatProvider";

 export const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
  <Box
  display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
  flexDir="column"
  alignItems="center"
  p={4}
  bg="whiteAlpha.600" // slightly transparent white
  w={{ base: "100%", md: "30%" }}
  borderRadius="2xl"
  borderWidth="1px"
  borderColor="gray.200"
  boxShadow="xl"
  backdropFilter="blur(6px)" // optional: enhances glassmorphism
>
  {/* Header */}
  <Box
    pb={3}
    px={2}
    display="flex"
    width="100%"
    justifyContent="space-between"
    alignItems="center"
  >
    <Text
      fontSize={{ base: "18px", md: "22px" }}
      fontFamily="Work Sans"
      fontWeight="bold"
      color="gray.700"
    >
      My Chats
    </Text>
    <GroupChatModal>
      <Button
        fontSize={{ base: "14px", md: "16px" }}
        rightIcon={<AddIcon />}
        colorScheme="teal"
        variant="solid"
        size="sm"
      >
        New Group Chat
      </Button>
    </GroupChatModal>
  </Box>

  {/* Chat List */}
  <Box
    display="flex"
    flexDir="column"
    p={3}
    bg="whiteAlpha.600" // lighter semi-transparent white
    w="100%"
    h="100%"
    borderRadius="lg"
    boxShadow="md"
    backdropFilter="blur(6px)" // stronger blur for glass effect
    overflowY="auto"
  >
    {chats ? (
      <Stack
        spacing={3}
        overflowY="auto"
        maxH="calc(100vh - 250px)"
        pr={2}
        css={{
          scrollbarWidth: "thin",
          scrollbarColor: "#CBD5E0 #EDF2F7",
        }}
      >
        {chats.map((chat) => {
          const isSelected = selectedChat === chat;

          return (
            <Box
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              cursor="pointer"
              bg={isSelected ? "teal.500" : "gray.50"}
              color={isSelected ? "white" : "gray.800"}
              px={4}
              py={3}
              borderRadius="lg"
              _hover={{
                bg: isSelected ? "teal.600" : "gray.100",
                transform: "scale(1.02)",
                transition: "all 0.2s ease",
              }}
              transition="all 0.2s ease"
            >
              <Text fontWeight="semibold" fontSize="md" noOfLines={1}>
                {!chat.isGroupChat
                  ? getSender(loggedUser, chat.users)
                  : chat.chatName}
              </Text>
              {chat.latestMessage && (
                <Text fontSize="sm" mt={1} noOfLines={1}>
                  <b>{chat.latestMessage.sender.name}:</b>{" "}
                  {chat.latestMessage.content.length > 50
                    ? chat.latestMessage.content.substring(0, 51) + "..."
                    : chat.latestMessage.content}
                </Text>
              )}
            </Box>
          );
        })}
      </Stack>
    ) : (
      <ChatLoading />
    )}
  </Box>
</Box>


  );
};

