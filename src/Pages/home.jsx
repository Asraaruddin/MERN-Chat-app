import {
  Container,
  Box,
  Text,
  Icon,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import { MdChatBubbleOutline } from "react-icons/md";
import {Login} from "../components/Authentication/login"
import { SignUp } from "../components/Authentication/signup";

export const HomePage = () => {
  return (
    <Container
      maxW="full"
      minH="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      pt={12}
      bg="transparent"
    >
      {/* Top Header */}
      <Box
        d="flex"
        bg="white"
        w={["90%", "40%"]}
        m="40px 0 15px 0"
        p={1}
       borderRadius="lg"
        boxShadow="md"
        textAlign="center"
        mb={4}
      >
        <Text fontSize="3xl" fontWeight="bold" fontFamily="Work Sans" color="blue.900">
          Chat App
        </Text>
        <Icon as={MdChatBubbleOutline} w={10} h={10} color="blue.900" mt={1} />
      </Box>

      {/* Tabs Section */}
      <Box
        bg="white"
        w={["90%", "500px"]}
        p={6}
        borderRadius="xl"
        boxShadow="lg"
      >
        <Tabs isFitted variant="soft-rounded" colorScheme="blue">
          <TabList mb="4">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};
