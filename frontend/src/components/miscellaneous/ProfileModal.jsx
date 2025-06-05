import React from "react";
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
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";

 export const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen} style={{ cursor: "pointer" }}>{children}</span>
      ) : (
        <IconButton
          icon={<ViewIcon />}
          onClick={onOpen}
          aria-label="View Profile"
          display={{ base: "flex" }}
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent maxH="90vh">
          <ModalHeader
            fontSize="2xl"
            fontWeight="bold"
            textAlign="center"
            fontFamily="Work Sans"
          >
            {user?.name || "User Name"}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={4}
            py={4}
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user?.pic || "https://via.placeholder.com/150"}
              alt={user?.name || "User"}
              objectFit="cover"
            />
            <Text fontSize={{ base: "lg", md: "xl" }} fontFamily="Work Sans">
              Email: {user?.email || "Not available"}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} colorScheme="teal">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};


