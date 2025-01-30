import { useState } from "react";
import { Outlet } from "react-router";

import { Box, Menu, MenuItem, Stack, Typography } from "@mui/material";
import { paperClasses } from "@mui/material/Paper";
import { listClasses } from "@mui/material/List";
import { dividerClasses } from "@mui/material/Divider";

import ListIcon from "@mui/icons-material/List";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import ColorModeIconDropdown from "../shared-theme/ColorModeIconDropdown";
import CustomLogo from "../components/CustomLogo";
import MenuButton from "../components/MenuButton";

const AuthLayout = () => {
  const currentUser = null;
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleLogout = async () => {};

  return (
    <Box width="100%" height="100%" sx={{ pt: 8 }}>
      <Stack
        direction="row"
        sx={{
          display: "flex",
          width: "100%",
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          maxWidth: { sm: "100%", md: "1700px" },
          p: 1.5,
          px: { md: 4 },
          position: "fixed",
          top: 0,
          backgroundColor: "background.default",
          zIndex: 1,
          boxShadow:
            "0 1px 2px 0 rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          onClick={() => {}}
          sx={{ cursor: "pointer" }}
        >
          <CustomLogo />
          <Typography
            variant="h4"
            component="h1"
            sx={{ color: "text.primary" }}
          >
            Taskmanager
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <ColorModeIconDropdown />
          <MenuButton aria-label="Open menu" onClick={handleMenuOpen}>
            <ListIcon />
          </MenuButton>
          <Menu
            id="auth-menu"
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            sx={{
              [`& .${listClasses.root}`]: {
                padding: "4px",
              },
              [`& .${paperClasses.root}`]: {
                padding: 0,
              },
              [`& .${dividerClasses.root}`]: {
                margin: "4px -4px",
              },
              "& .MuiMenuItem-root": {
                "& .MuiSvgIcon-root": {
                  fontSize: 18,
                  color: (theme) => theme.palette.text.secondary,
                  marginRight: (theme) => theme.spacing(1.5),
                },
              },
            }}
          >
            {currentUser ? (
              <MenuItem onClick={handleLogout}>
                <LogoutIcon /> Logout
              </MenuItem>
            ) : (
              <>
                <MenuItem onClick={() => {}}>
                  <LoginIcon /> Login
                </MenuItem>
                <MenuItem onClick={() => {}}>
                  <AccountCircleIcon /> Register
                </MenuItem>
              </>
            )}
          </Menu>
        </Stack>
      </Stack>
      <Box width="100%" height="100%" sx={{ px: { md: 4 }, overflow: "auto" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AuthLayout;
