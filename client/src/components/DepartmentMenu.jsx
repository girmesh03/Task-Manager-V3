import { useDispatch, useSelector } from "react-redux";
import { setSelectedDepartment } from "../redux/features/authSlice";
import MuiAvatar from "@mui/material/Avatar";
import MuiListItemAvatar from "@mui/material/ListItemAvatar";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListSubheader from "@mui/material/ListSubheader";
import Select, { selectClasses } from "@mui/material/Select";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";

const Avatar = styled(MuiAvatar)(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  border: `1px solid ${theme.palette.divider}`,
}));

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 0,
  marginRight: 12,
});

const DepartmentMenu = () => {
  const { currentUser, departments, selectedDepartment } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const newDepartment = event.target.value;
    // Dispatch action to update the selected department in auth state
    dispatch(setSelectedDepartment(newDepartment));
  };

  return (
    <Select
      labelId="department-select"
      id="company-department-select"
      value={selectedDepartment || currentUser?.department?._id || ""}
      onChange={handleChange}
      displayEmpty
      inputProps={{ "aria-label": "Select department" }}
      fullWidth
      disabled={currentUser.role !== "admin"}
      sx={{
        maxHeight: 56,
        "&.MuiList-root": {
          p: "8px",
        },
        [`& .${selectClasses.select}`]: {
          display: "flex",
          alignItems: "center",
          gap: "2px",
          pl: 1,
        },
      }}
    >
      <ListSubheader sx={{ pt: 0 }}>Departments</ListSubheader>
      {departments?.map((dept) => (
        <MenuItem key={dept._id} value={dept._id}>
          <ListItemAvatar>
            <Avatar alt={dept.name}>
              <DevicesRoundedIcon sx={{ fontSize: "1rem" }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={dept.name} secondary={dept.name} />
        </MenuItem>
      ))}
      <Divider sx={{ mx: -1 }} />
      <MenuItem value="add">
        <ListItemIcon>
          <AddRoundedIcon />
        </ListItemIcon>
        <ListItemText primary="Add department" />
      </MenuItem>
    </Select>
  );
};

export default DepartmentMenu;
