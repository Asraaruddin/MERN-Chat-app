import { ChatState } from "../Context/chatProvider";
import { SideDrawer } from "../components/miscellaneous/SideDrawer";
import { MyChats } from "../components/MyChats";
import { ChatBox } from "../components/ChatBox";

import { Box, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";

export const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain,setFetchAgain] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div style={{ width: "100%" }}>
      {user && (
        <SideDrawer isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
      )}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
};
