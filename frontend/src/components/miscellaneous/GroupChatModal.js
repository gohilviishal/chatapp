import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const toast = useToast();
  const { user, chats, setChats } = ChatState();

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
      const { data } = await axios.get(
        `/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        status: "error",
        description: "Failed to load the search users",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Error Occured",
        status: "error",
        description: "Please fill all the fields",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    try {
      setLoadingSubmit(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setLoadingSubmit(false)
      onClose();
      toast({
        title: "New chat is created",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      setLoadingSubmit(false)
      toast({
        title: "Failed to create chat",
        status: "error",
        description: error.response.data.message,
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== delUser._id));
  };
  const handleGroup = (userToAdd) => {
    if (selectedUsers.some((user) => user._id === userToAdd._id)) {
      toast({
        title: "Users already added",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="25px"
            display="flex"
            fontFamily="Work sans"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalBody display="flex" alignItems="center" flexDir="column">
            <FormControl>
              <Input
                type="text"
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                type="text"
                placeholder="Add Users"
                value={search}
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box display="flex" w="100%" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <>Loading</>
            ) : (
              searchResult
                ?.slice(0, 3)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button isLoading={loadingSubmit} colorScheme="blue" onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
