import PropTypes from "prop-types";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";

import MenuButton from "./MenuButton";
import MenuContent from "./MenuContent";
import CardAlert from "./CardAlert";

const SideMenuMobile = ({ open, toggleDrawer }) => {
  const handleLogout = async () => {};
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: "none",
          backgroundColor: "background.paper",
        },
      }}
    >
      <Stack sx={{ maxWidth: "70dvw", flexGrow: 1 }}>
        <Stack
          direction="row"
          sx={{
            p: 2,
            pb: 0,
            gap: 1,
            alignItems: "center",
          }}
        >
          <Stack
            direction="row"
            sx={{
              gap: 1,
              alignItems: "center",
              flexGrow: 1,
              p: 1,
              overflowX: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <Avatar
              sizes="small"
              // alt={currentUser?.firstName}
              alt="name"
              // src="/static/images/avatar/7.jpg"
              sx={{ width: 36, height: 36 }}
            />

            <Typography
              variant="body2"
              sx={{ overflowX: "hidden", textOverflow: "ellipsis" }}
            >
              {/* {`${currentUser?.firstName} ${currentUser?.lastName}`} */}
              name
            </Typography>
          </Stack>
          <MenuButton showBadge>
            <NotificationsRoundedIcon />
          </MenuButton>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }} onClick={toggleDrawer(false)}>
          <MenuContent />
          <Divider />
        </Stack>
        <CardAlert />
        <Stack sx={{ p: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<LogoutRoundedIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
};

SideMenuMobile.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
};

export default SideMenuMobile;
