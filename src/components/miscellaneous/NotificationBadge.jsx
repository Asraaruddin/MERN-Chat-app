// src/components/misc/NotificationBadge.jsx
import {
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/chatProvider";
import { useEffect } from "react";

export const NotificationBadge = ({ onNotificationClick }) => {
  const {
    notification,
    setNotification,
    setSelectedChat,
    user,
    socket,
    selectedChat,
  } = ChatState();

  // Play a notification sound when a new message is received
  useEffect(() => {
    if (!socket) return;

    socket.on("message received", (newMessage) => {
      if (
        !selectedChat || // no chat is selected
        selectedChat._id !== newMessage.chat._id // different chat
      ) {
        // prevent duplicates
        if (!notification.some((n) => n._id === newMessage._id)) {
          setNotification((prev) => [newMessage, ...prev]);

          // Play sound
          const audio = new Audio("/notification.mp3"); // Put the audio file in your public folder
          audio.play().catch((e) => console.warn("Notification sound failed:", e));
        }
      }
    });

    return () => socket.off("message received");
  }, [socket, selectedChat, notification, setNotification]);

  const getSender = (loggedUser, users) => {
    return users.find((u) => u._id !== loggedUser._id)?.name;
  };

  const handleNotificationClick = (notif) => {
    setSelectedChat(notif.chat);
    setNotification(notification.filter((n) => n !== notif));
    onNotificationClick?.();
  };

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<BellIcon fontSize="2xl" />}
        variant="ghost"
        aria-label="Notifications"
        position="relative"
      >
        {notification?.length > 0 && (
          <Badge
            colorScheme="red"
            borderRadius="full"
            position="absolute"
            top="-1"
            right="-1"
            px={2}
            fontSize="0.7em"
          >
            {notification.length}
          </Badge>
        )}
      </MenuButton>

      <MenuList pl={2}>
        {notification?.length === 0 ? (
          <Text fontSize="sm" px={3} color="gray.500">
            No new messages
          </Text>
        ) : (
          notification.map((notif) => (
            <MenuItem
              key={notif._id}
              onClick={() => handleNotificationClick(notif)}
              _hover={{ bg: "teal.50" }}
            >
              {notif.chat.isGroupChat
                ? `New message in ${notif.chat.chatName}`
                : `New message from ${getSender(user, notif.chat.users)}`}
            </MenuItem>
          ))
        )}
      </MenuList>
    </Menu>
  );
};
