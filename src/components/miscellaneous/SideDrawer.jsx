import {
  Box,
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon, ViewIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/chatProvider";
import { ProfileModal } from "./ProfileModal";
import NotificationBadge, { Effect } from "react-notification-badge";
import { ChatLoading } from "../chatLoading";
import { UserListItem } from "../UserAvatar/userListItem";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const ChatContext = createContext()

export const SideDrawer = ({ isOpen, onOpen, onClose }) => {
    
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const toast = useToast();

  const navigate = useNavigate();
  const { user, notification, setNotification, setSelectedChat } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
const handleSearch = async () => {
  if (!search) return;

  try {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const { data } = await axios.get(`/api/user?search=${search}`, config);
    setLoading(false);
    setSearchResult(data); // ← Must update this correctly
  } catch (error) {
    console.error(error);
    toast({
      title: "Failed to Load Search Results",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    setLoading(false);
  }
};


  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      setSelectedChat(data);
      onClose();
    } catch (error) {
      console.error("Access chat error:", error);
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <>
      {/* Top Navbar */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        px={4}
        py={2}
        boxShadow="sm"
        borderBottom="1px solid #e2e8f0"
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" colorScheme="teal" onClick={onOpen} leftIcon={<i className="fas fa-search"></i>}>
            <Text display={{ base: "none", md: "inline" }}>Search User</Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontWeight="bold" fontFamily="Work Sans" color="teal.600">
          Chat-A-Tive
        </Text>

        <Box display="flex" alignItems="center" gap={4}>
          {/* Notifications */}
          <Menu>
            <MenuButton p={1} position="relative">
              <NotificationBadge count={notification.length} effect={Effect.SCALE} />
              <BellIcon fontSize="2xl" />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && (
                <Text fontSize="sm" color="gray.500" px={3}>
                  No new messages
                </Text>
              )}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                  _hover={{ bg: "teal.50" }}
                >
                  New message notification
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          {/* Profile */}
          <Menu>
            <MenuButton as={Button} variant="ghost" rightIcon={<ChevronDownIcon />}>
              <Avatar size="sm" name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem icon={<ViewIcon />}>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem icon={<ArrowForwardIcon />} onClick={logoutHandler}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      {/* Drawer */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
  <DrawerOverlay />
  <DrawerContent>
    <DrawerHeader borderBottomWidth="1px" fontSize="lg" fontWeight="bold" color="teal.600">
      Search Users
    </DrawerHeader>
    <DrawerBody bg="gray.50">
      <Box display="flex" pb={4}>
        <Input
          placeholder="Search by name or email"
          mr={2}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          focusBorderColor="teal.400"
        />
        <Button colorScheme="teal" onClick={handleSearch}>
          Go
        </Button>
      </Box>

      {loading ? (
        <ChatLoading />
      ) : (
        searchResult.map((u) => (
          <UserListItem key={u._id} user={u} handleFunction={() => accessChat(u._id)} />
        ))
      )}

      {loadingChat && <Spinner ml="auto" display="flex" color="teal.500" />}
    </DrawerBody>
  </DrawerContent>
</Drawer>

    </>
  );
};
