import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import MenuContent from "./MenuContent";
import CardAlert from "./CardAlert";
import OptionsMenu from "./OptionsMenu";
import CustomLogo from "./CustomLogo";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useGetUserStatisticsQuery } from "../redux/features/apiSlice";
import DepartmentMenu from "./DepartmentMenu";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

const SideMenu = () => {
  const { currentUser, selectedDepartment } = useSelector(
    (state) => state.auth
  );
  const { selectedDate } = useSelector((state) => state.filters);

  const {
    data: userStat,
    isLoading,
    isError,
  } = useGetUserStatisticsQuery({
    selectedDepartment,
    userId: currentUser?._id,
    currentDate: selectedDate,
  });

  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
          overflow: "hidden",
          position: "relative",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
          mt: "calc(var(--template-frame-height, 0px) + 2px)",
          p: 1.5,
          boxShadow:
            "0 1px 2px 0 rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)",
          cursor: "pointer",
        }}
        onClick={() => navigate("/dashboard")}
      >
        <CustomLogo />
        <Typography variant="h4" component="h1" sx={{ color: "text.primary" }}>
          Taskmanager
        </Typography>
      </Box>
      <Divider />
      <Stack
        direction="column"
        spacing={1}
        sx={{ p: 1, flexGrow: 1, overflowY: "auto" }}
      >
        <DepartmentMenu />
        <MenuContent />
        {!isError ? (
          <CardAlert userStat={userStat} loading={isLoading} />
        ) : null}
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          px: 1,
          py: 3,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Avatar
          sizes="small"
          alt={`${currentUser?.firstName} ${currentUser?.lastName}`}
          src={currentUser?.avatar}
          sx={{
            width: 36,
            height: 36,
            // bgcolor: deepOrange[500],
            // color: "white",
          }}
        >
          {currentUser?.firstName[0]}
        </Avatar>
        <Box sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, lineHeight: "16px" }}
          >
            {`${currentUser?.firstName} ${currentUser?.lastName}`}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {currentUser?.email}
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
};

export default SideMenu;
