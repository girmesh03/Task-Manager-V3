import { Outlet } from "react-router";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import AppNavbar from "../components/AppNavbar";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";

const AppLayout = () => {
  return (
    <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
      <SideMenu />
      <AppNavbar />
      {/* Main content */}
      <Box
        height="100%"
        component="main"
        sx={{
          flexGrow: 1,
          maxWidth: { xs: "100%", md: "calc(100% - 240px)" },
        }}
      >
        <Stack
          direction="column"
          sx={{ pt: { xs: "3.75rem", md: 0 }, height: "100%" }}
        >
          <Header />
          <Box
            width="100%"
            height="100%"
            sx={{
              overflow: "auto",
              py: 2,
              px: { xs: 1, md: 2 },
            }}
          >
            <Outlet />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default AppLayout;
