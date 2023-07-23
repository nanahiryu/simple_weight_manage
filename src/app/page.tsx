"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { userAtom } from "@/globalState/user";
import { logout } from "@/lib/auth";

export default function Home() {
  const user = useAtomValue(userAtom);
  return (
    <Flex direction="column">
      <Text>Home Page</Text>
      <Text>{user?.name}</Text>
      <Button onClick={logout}>log out</Button>
    </Flex>
  );
}
