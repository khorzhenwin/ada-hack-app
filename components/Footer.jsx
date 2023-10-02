import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
  Link,
  Image,
  Center,
} from "@chakra-ui/react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const SocialButton = ({ children, label, href }) => {
  return (
    <>
      <chakra.button
        bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
        rounded={"full"}
        w={8}
        h={8}
        cursor={"pointer"}
        as={"div"}
        href={href}
        display={"inline-flex"}
        alignItems={"center"}
        justifyContent={"center"}
        transition={"background 0.3s ease"}
        _hover={{
          bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
        }}
      >
        <VisuallyHidden>{label}</VisuallyHidden>
        {children}
      </chakra.button>
    </>
  );
};

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue("green.600", "green.600")}
      color={useColorModeValue("gray.800", "gray.200")}
    >
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
      >
        <Stack direction={"row"} spacing={2}>
          <Text>© 2023 Alpacaverse </Text>
          <Link href={"https://github.com/Alpacaverse"} isExternal>
            <Center>
              <Image src={"./alpacaverse.png"} alt="Spotify" height={8} />
            </Center>
          </Link>
        </Stack>
        <Stack direction={"row"} spacing={6}>
          <Link href={"https://github.com/Alpacaverse"} isExternal>
            <SocialButton label={"GitHub"}>
              <FaGithub />
            </SocialButton>
          </Link>
          <Link href={"#"}>
            <SocialButton label={"LinkedIn"}>
              <FaLinkedin />
            </SocialButton>
          </Link>
          <SocialButton
            label={"Email"}
            href={"mailto:tp056059@apu.edu.my"}
            isExternal
          >
            <FaEnvelope />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
}
