import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

import { ChatState } from "../../Context/chatProvider";
import { UserBadgeItem } from "../UserAvatar/UserBadgeItem";
import { UserListItem } from "../UserAvatar/userListItem";


export const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  // Chakra UI modal control
  const { isOpen, onOpen, onClose } = useDisclosure();
  

  // Local state for group chat name, user search, results, and loading states
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);


  const toast = useToast();

  // Global chat and user context
  const { selectedChat, setSelectedChat, user } = ChatState();

  // Search users handler
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setSearchResult(data);
    } catch {
      toast({
        title: "Error Occurred!",
        description: "Failed to load search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setLoading(false);
    }
  };

  // Rename group chat handler
  const handleRename = async () => {
  if (!groupChatName) return;

  try {
    setRenameLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const { data } = await axios.put("/api/chat/rename", {
      chatId: selectedChat._id,
      chatName: groupChatName,
    }, config);

    setSelectedChat(data); // updated chat
    setFetchAgain(!fetchAgain); // trigger refresh
    fetchMessages(); // reload messages
    setRenameLoading(false);
    setGroupChatName("");
  } catch (error) {
    toast({
      title: "Error Occurred!",
      description: "Failed to rename chat",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setRenameLoading(false);
  }
};

  // Add user to group handler
  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      return toast({
        title: "User already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      return toast({
        title: "Only admins can add users!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        { 
          chatId: selectedChat._id, 
          userId: userToAdd._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || "Failed to add user",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  // Remove user from group handler (including leaving group)
  
const handleRemove = async (user1) => {
  if(selectedChat.groupAdmin._id !==user._id && user1._id !==user._id){
    toast({
      title:"Only admins can remove someone!",
      status:"error",
      duration:5000,
      isClosable:true,
      position:"bottom",
    });
    return
  }
  try {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const {data} = await axios.put(`/api/chat/groupremove`, {
      chatId: selectedChat._id,
      userId: user1._id,
    }, config);

 user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    setLoading(false)
  } catch (error) {
    console.error("handleRemove error:", error.response?.data || error.message);

    toast({
      title: "Error Occurred!",
      description: error.response?.data?.message || "Failed to remove user",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }
};


 



  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
        aria-label="Open Group Chat Settings"
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily="Work sans" textAlign="center">
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            {/* Display users as badges with remove option */}
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>

            {/* Rename chat input and button */}
            <FormControl display="flex" mb={3}>
              <Input
                placeholder="Chat Name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            {/* Search user input */}
            <FormControl mb={2}>
              <Input
                placeholder="Add user to group"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {/* Show spinner while searching */}
            {loading ? (
              <Spinner size="lg" />
            ) : (
              // Display search results with add user option
              searchResult.map((u) => (
                <UserListItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleAddUser(u)}
                />
              ))
            )}
          </ModalBody>

          {/* Footer with leave group button */}
          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
