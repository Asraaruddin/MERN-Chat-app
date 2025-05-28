import { ChatState } from "../Context/chatProvider";
import { SideDrawer } from "../components/miscellaneous/SideDrawer";
import { MyChats } from "../components/MyChats";
import { ChatBox } from "../components/ChatBox";
import { Box, useDisclosure } from "@chakra-ui/react";

export const ChatPage = () => {
  const { user } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div style={{ width: "100%" }}>
      {user && (
        <SideDrawer isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
      )}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};
