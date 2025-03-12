import PropTypes from "prop-types";
import { Box, Backdrop, CircularProgress } from "@mui/material";

export const RootFallback = () => {
  return (
    <Box
      width="100%"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress size={50} disableShrink />
    </Box>
  );
};

export const CustomBackdrop = ({ open, handleClose = () => {} }) => {
  return (
    <Backdrop
      sx={(theme) => ({
        color: theme.palette.primary.main,
        zIndex: theme.zIndex.drawer + 1,
      })}
      open={open}
      onClick={handleClose}
    >
      <CircularProgress size={50} disableShrink />
    </Backdrop>
  );
};

CustomBackdrop.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
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
      <CircularProgress size={50} disableShrink />
    </Box>
  );
};

LoadingFallback.propTypes = {
  height: PropTypes.string,
};
