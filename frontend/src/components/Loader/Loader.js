import { CircularProgress, Typography } from "@material-ui/core";
import React from "react";

function Loader() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
      <Typography variant="h6" style={{ marginTop: "10px" }}>
        Loading Data
      </Typography>
    </div>
  );
}

export default Loader;
