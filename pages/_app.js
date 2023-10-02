import "../styles/globals.css";
import Head from "next/head";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { extendTheme, ColorModeScript, ChakraProvider } from "@chakra-ui/react";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  const theme = extendTheme({
    config: {
      initialColorMode: "dark",
      useSystemColorMode: false,
    },
  });
  const [colorScheme, setColorScheme] = useState("dark");
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <>
      <Head>
        <title>PurchasePal</title>
        <meta property="og:title" content="PurchasePal" />
        <meta
          property="og:description"
          content="PurchasePal | Purchasing Made Simple"
        />
        <meta property="og:image" content="./purchase-pal.png" />
        <link rel="icon" href="./purchase-pal.png" />
      </Head>

      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{ colorScheme }}
        >
          <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <Component {...pageProps} />
          </ChakraProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

export default MyApp;
