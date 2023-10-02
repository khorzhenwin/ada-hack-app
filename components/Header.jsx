import {
  Box,
  Flex,
  Avatar,
  MenuItem,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Text,
  Image,
  Link,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useMantineColorScheme } from "@mantine/core";
import { FaSpotify } from "react-icons/fa";

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const iconSource = "./recycle-bin.png";
  const avatarSource = "./profile.png";

  return (
    <>
      <Box bg={useColorModeValue("green.600", "green.600")} px={4}>
        <Flex h={14} alignItems={"center"} justifyContent={"space-between"}>
          <Box>
            <Link href="/">
              <Image src={iconSource} alt="Natsukashii" w={"100%"} h={10} />
            </Link>
          </Box>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <Button
                onClick={() => {
                  toggleColorMode();
                  toggleColorScheme();
                }}
              >
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>

              <Menu>
                <>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar size={"sm"} src={avatarSource} />
                  </MenuButton>
                  <MenuList alignItems={"center"}>
                    <Stack direction={"column"} spacing={2} mt={5}>
                      <Center>
                        <Avatar size={"2xl"} src={avatarSource} />
                      </Center>
                      <Center>
                        <Stack direction={"row"} alignItems={"center"}>
                          <p>John Doe</p>
                        </Stack>
                      </Center>
                      <MenuDivider />
                      <MenuItem>Logout</MenuItem>
                    </Stack>
                  </MenuList>
                </>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
