import PropTypes from "prop-types";
import { Box, CircularProgress } from "@mui/material";

export const RootFallback = () => {
  return (
    <Box
      width="100%"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress size={50} />
    </Box>
  );
};

export const LoadingFallback = ({ height = "100%" }) => {
  return (
    <Box
      width="100%"
      height={height}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress size={50} />
    </Box>
  );
};

LoadingFallback.propTypes = {
  height: PropTypes.string,
};
