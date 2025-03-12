import { Link, useLocation } from "react-router";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
// import CategoryIcon from "@mui/icons-material/Category";
// import ProjectIcon from "@mui/icons-material/ListAlt";

const mainListItems = [
  { text: "Dashboard", icon: <HomeRoundedIcon />, path: "/dashboard" },
  { text: "Tasks", icon: <AssignmentRoundedIcon />, path: "/tasks" },
  { text: "Team", icon: <PeopleRoundedIcon />, path: "/team" },
  { text: "Reports", icon: <InfoRoundedIcon />, path: "/reports" },
  // { text: "Projects", icon: <ProjectIcon />, path: "/projects" },
  // { text: "Categories", icon: <CategoryIcon />, path: "/categories" },
];

const MenuContent = () => {
  const route = useLocation().pathname;
  return (
    <List dense>
      {mainListItems.map((item, index) => (
        <ListItem key={index} disablePadding sx={{ display: "block" }}>
          <ListItemButton
            selected={route === item.path}
            component={Link}
            to={item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default MenuContent;
