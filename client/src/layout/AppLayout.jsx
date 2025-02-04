import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import AppNavbar from "../components/AppNavbar";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";

const AppLayout = () => {
  const { currentUser } = useSelector((state) => state.auth);
  // const [searchText, setSearchText] = useState("");
  // const [selectedDate, setSelectedDate] = useState(null);
  const location = useLocation();

  return (
    <React.Fragment>
      {currentUser ? (
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
              <Header
              // setSearchText={setSearchText}
              // selectedDate={selectedDate}
              // setSelectedDate={setSelectedDate}
              />
              <Box
                width="100%"
                height="100%"
                sx={{
                  overflow: "auto",
                  py: 2,
                  px: { xs: 1, md: 2 },
                }}
              >
                <Outlet
                // context={{
                //   searchText,
                //   setSearchText,
                //   selectedDate,
                //   setSelectedDate,
                // }}
                />
              </Box>
            </Stack>
          </Box>
        </Box>
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      )}
    </React.Fragment>
  );
};

export default AppLayout;
