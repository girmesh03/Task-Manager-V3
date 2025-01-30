import { useLocation, Link } from "react-router";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

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

const NavbarBreadcrumbs = () => {
  const path = useLocation().pathname.split("/")[1];

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography
        component={Link}
        to="/dashboard"
        variant="body1"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        Dashboard
      </Typography>
      <Typography
        component={Link}
        to={`/${path}`}
        variant="body1"
        sx={{
          color: "text.primary",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        {path}
      </Typography>
    </StyledBreadcrumbs>
  );
};

export default NavbarBreadcrumbs;
