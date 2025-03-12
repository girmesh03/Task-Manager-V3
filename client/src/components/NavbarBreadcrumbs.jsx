import { Link as RouterLink, useLocation } from "react-router";
import { styled } from "@mui/material/styles";
import { Link, Typography } from "@mui/material";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

// Styled Breadcrumbs
const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
  },
}));

// Static breadcrumb names
const breadcrumbNameMap = {
  "/dashboard": "Dashboard",
  "/tasks": "Tasks",
  "/tasks/create": "Create Task",
  "/projects": "Projects",
  "/team": "Team",
  "/reports": "Reports",
  "/users": "Users",
};

// Check if a segment is an ID (MongoDB ObjectID)
const isId = (segment) => /^[a-fA-F0-9]{24}$/.test(segment);

const getBreadcrumbs = (pathnames) => {
  const breadcrumbs = [];
  let builtPath = "";

  for (let i = 0; i < pathnames.length; i++) {
    let segment = pathnames[i];
    let prevSegment = pathnames[i - 1]; // The previous path segment
    let nextSegment = pathnames[i + 1]; // The next path segment

    // Handle Tasks (Hide Task ID and show meaningful names)
    if (prevSegment === "tasks" && isId(segment)) {
      if (nextSegment === "update") {
        breadcrumbs.push({ name: "Update Task", path: `${builtPath}/update` });
        i++; // Skip "update"
      } else if (nextSegment === "details") {
        breadcrumbs.push({
          name: "Task Details",
          path: `${builtPath}/details`,
        });
        i++; // Skip "details"
      }
      continue; // Skip the ID itself
    }

    // Handle Users (Hide User ID and show meaningful names)
    if (prevSegment === "users" && isId(segment)) {
      if (nextSegment === "update") {
        breadcrumbs.push({ name: "Update User", path: `${builtPath}/update` });
        i++; // Skip "update"
      } else if (nextSegment === "details") {
        breadcrumbs.push({
          name: "User Details",
          path: `${builtPath}/details`,
        });
        i++; // Skip "details"
      }
      continue; // Skip the ID itself
    }

    // Build path
    builtPath += `/${segment}`;

    // Fetch label from static map, or use the segment itself
    const label = breadcrumbNameMap[builtPath] || segment.replace(/-/g, " ");

    breadcrumbs.push({ name: label, path: builtPath });
  }

  return breadcrumbs;
};

const NavbarBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const breadcrumbs = getBreadcrumbs(pathnames);

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {/* Home Link */}
      <Link component={RouterLink} to="/" underline="hover" color="inherit">
        Home
      </Link>

      {breadcrumbs.map(({ name, path }, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return isLast ? (
          <Typography color="text.primary" key={path}>
            {name}
          </Typography>
        ) : (
          <Link
            component={RouterLink}
            to={path}
            underline="hover"
            color="inherit"
            key={path}
          >
            {name}
          </Link>
        );
      })}
    </StyledBreadcrumbs>
  );
};

export default NavbarBreadcrumbs;
