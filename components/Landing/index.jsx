import React from "react";
import PointsDisplay from "./PointsDisplay";
import { Box, Stack } from "@chakra-ui/react";

const index = (props) => {
  return (
    <>
      <Stack direction={"column"} m={5}>
        <PointsDisplay
          appCredit={props.appCredit}
          alpacaPoints={props.alpacaPoints}
        />
      </Stack>
    </>
  );
};

export default index;
