import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";

import MenuButton from "./MenuButton";
import MenuContent from "./MenuContent";
import CardAlert from "./CardAlert";

import { makeRequest } from "../api/apiRequest";
import { logout } from "../redux/features/authSlice";
import { useGetUserStatisticsQuery } from "../redux/features/apiSlice";
import DepartmentMenu from "./DepartmentMenu";

const drawerWidth = 270;

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

const SideMenuMobile = ({ open, toggleDrawer }) => {
  const today = new Date();
  const localDate =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  const { currentUser, selectedDepartment } = useSelector(
    (state) => state.auth
  );
  const {
    data: userStat,
    isLoading,
    isError,
    error,
  } = useGetUserStatisticsQuery({
    selectedDepartment,
    userId: currentUser?._id,
    currentDate: localDate,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await makeRequest.get("/auth/logout");
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundImage: "none",
          backgroundColor: "background.paper",
          overflow: "hidden",
        },
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ p: 1 }}
        onClick={toggleDrawer(false)}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            flexGrow: 1,
            p: 1,
            overflowX: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <Avatar
            sizes="small"
            alt={currentUser?.firstName}
            sx={{ width: 36, height: 36 }}
          />
          <Typography
            variant="body2"
            onClick={() => navigate(`/users/${currentUser?._id}/details`)}
            sx={{
              overflowX: "hidden",
              textOverflow: "ellipsis",
              cursor: "pointer",
            }}
          >
            {`${currentUser?.firstName} ${currentUser?.lastName}`}
          </Typography>
        </Stack>
        <MenuButton showBadge>
          <NotificationsRoundedIcon />
        </MenuButton>
      </Stack>

      <Divider />

      <Stack
        direction="column"
        spacing={1}
        onClick={toggleDrawer(false)}
        sx={{ p: 1, flexGrow: 1, overflowY: "auto" }}
      >
        <DepartmentMenu />
        <MenuContent />
        <Divider />
        <CardAlert
          userStat={userStat}
          loading={isLoading}
          isError={isError}
          error={error}
        />
      </Stack>

      <Stack
        direction="row"
        sx={{
          p: 1,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button
          variant="outlined"
          fullWidth
          startIcon={<LogoutRoundedIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Stack>
    </Drawer>
  );
};

SideMenuMobile.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
};

export default SideMenuMobile;
