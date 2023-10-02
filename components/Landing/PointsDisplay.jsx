import React from "react";
import {
  Stack,
  Box,
  Text,
  Center,
  Image,
  Grid,
  GridItem,
} from "@chakra-ui/react";

const PointsDisplay = (props) => {
  return (
    <>
      <Grid
        templateColumns={"repeat(4,1fr)"}
        fontSize={"sm"}
        h={20}
        alignItems={"center"}
      >
        <GridItem colSpan={3}>
          <Stack direction={"column"} spacing={0}>
            <Text>
              RM{" "}
              <Box as={"span"} fontWeight={"bold"} fontSize={"xl"}>
                {props.appCredit.toFixed(2)}
              </Box>
            </Text>
            <Text>
              <Box as={"span"} fontWeight={"bold"} fontSize={"xl"}>
                {props.alpacaPoints}{" "}
              </Box>
              AlpacaPoints
            </Text>
          </Stack>
        </GridItem>
        <GridItem colSpan={1}>
          <Center>
            <Image
              src={"./recycling.png"}
              w={"70%"}
              h={"70%"}
              objectFit={"cover"}
            />
          </Center>
          <Text fontSize={"2xs"} textAlign={"center"}>
            Rookie Recycler
          </Text>
        </GridItem>
      </Grid>
    </>
  );
};

export default PointsDisplay;
