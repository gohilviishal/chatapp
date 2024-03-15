import React from "react";
import { Box } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      fontSize={12}
      bg="#ffe6ff"
      cursor="pointer"
      onClick={handleFunction}
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
    >
      {user.name}
      <CloseIcon pl={1} pb={1} ml={1} />
    </Box>
  );
};

export default UserBadgeItem;
