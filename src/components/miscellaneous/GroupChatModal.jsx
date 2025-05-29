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
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/chatProvider";
// import UserBadgeItem from "../userAvatar/UserBadgeItem";
import { UserListItem } from "../UserAvatar/userListItem";

  export const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
<Modal onClose={onClose} isOpen={isOpen} isCentered size="lg">
  <ModalOverlay />
  <ModalContent borderRadius="lg" boxShadow="lg" p={4}>
    <ModalHeader
      fontSize="28px"
      fontWeight="bold"
      fontFamily="Work sans"
      textAlign="center"
      color="gray.700"
    >
      Create Group Chat
    </ModalHeader>
    <ModalCloseButton />
    <ModalBody display="flex" flexDir="column" gap={4} px={6} py={2}>
      <FormControl>
        <Input
          placeholder="Group Name"
          onChange={(e) => setGroupChatName(e.target.value)}
          borderRadius="md"
          borderColor="gray.300"
          focusBorderColor="blue.400"
        />
      </FormControl>

      <FormControl>
        <Input
          placeholder="Add users (e.g. John, Jane)"
          onChange={(e) => handleSearch(e.target.value)}
          borderRadius="md"
          borderColor="gray.300"
          focusBorderColor="blue.400"
        />
      </FormControl>

      <Box w="100%" display="flex" flexWrap="wrap" gap={2}>
        {selectedUsers.map((u) => (
          // Uncomment and style the UserBadgeItem here if you use it
          // <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
          <Box
            key={u._id}
            px={3}
            py={1}
            bg="blue.100"
            borderRadius="full"
            fontSize="sm"
            color="blue.800"
            cursor="pointer"
            onClick={() => handleDelete(u)}
          >
            {u.name} &times;
          </Box>
        ))}
      </Box>

      {loading ? (
        <Box textAlign="center" mt={2}>Loading...</Box>
      ) : (
        searchResult
          ?.slice(0, 4)
          .map((user) => (
            <UserListItem
              key={user._id}
              user={user}
              handleFunction={() => handleGroup(user)}
            />
          ))
      )}
    </ModalBody>

    <ModalFooter justifyContent="center">
      <Button
        onClick={handleSubmit}
        colorScheme="blue"
        w="100%"
        borderRadius="md"
        fontWeight="semibold"
      >
        Create Chat
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>

    </>
  );
};
