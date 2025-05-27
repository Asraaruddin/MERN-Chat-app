import { ChatState } from "../Context/chatProvider";
import { SideDrawer } from "../components/miscellaneous/SideDrawer";
import { MyChats } from "../components/MyChats";
import { ChatBox } from "../components/ChatBox";
 import { Box } from "@chakra-ui/react";

export const ChatPage = () => {
const {user} =   ChatState()
  return (
  <div style={{width:"100%"}}>
    {user && <SideDrawer/>}
    <Box d="flex" justifyContent="space-between" w="100%" h="91.5" p='10px'  >
          {user && <MyChats/>}
            {user && <ChatBox/>}
    </Box>
    
      
  </div>
);

};
