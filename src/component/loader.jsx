import React from "react";
import { trio } from "ldrs";
import { Box } from "@mui/material";

function Preloader() {
  trio.register();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#4F42B5",
        zIndex: 9999,
      }}
    >
      <l-trio size="70" speed="1.3" color="white"></l-trio>
    </Box>
  );
}

export default Preloader;
