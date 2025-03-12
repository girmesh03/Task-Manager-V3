import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useGetTasksQuery } from "../redux/features/apiSlice";
import {
  Button,
  Card,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import ListIcon from "@mui/icons-material/List";
import TaskCard from "../components/TaskCard";
import DoneIcon from "@mui/icons-material/Done";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PendingIcon from "@mui/icons-material/Pending";
import { LoadingFallback } from "../components/LoadingFallback";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const Tasks = () => {
  const { currentUser, selectedDepartment } = useSelector(
    (state) => state.auth
  );
  // const { searchText } = useSelector((state) => state.filters);
  // console.log("tasks searchText", searchText);

  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data = {},
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useGetTasksQuery({ status, page, limit, selectedDepartment });

  const { tasks = [], pagination = { totalTasks: 0 } } = data;
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const observer = useRef();

  // Status menu (memoized)
  const statusMenu = useMemo(
    () => [
      { id: 1, label: "Completed", icon: <DoneIcon sx={{ mr: 1 }} /> },
      {
        id: 2,
        label: "In Progress",
        icon: <HourglassEmptyIcon sx={{ mr: 1 }} />,
      },
      { id: 3, label: "Pending", icon: <PendingIcon sx={{ mr: 1 }} /> },
      { id: 4, label: "To Do", icon: <ListIcon sx={{ mr: 1 }} /> },
    ],
    []
  );

  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handleStatusSelect = (newStatus) => {
    setStatus(newStatus);
    setPage(1); // Reset to the first page when status is changed
    handleMenuClose();
  };

  const handleClearFilters = () => {
    setStatus("");
    setPage(1);
  };

  // Infinite scrolling logic
  const lastTaskRef = useCallback(
    (node) => {
      if (isFetching || tasks.length >= pagination.totalTasks) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetching, pagination.totalTasks, tasks.length]
  );

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  if (isLoading) return <LoadingFallback />;
  if (isError || !isSuccess) return null;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Stack direction="row" alignItems="center">
          <Button
            size="small"
            variant="outlined"
            disabled={
              currentUser.role !== "admin" || currentUser.role === "manager"
            }
            startIcon={<AddIcon />}
            onClick={() => navigate("/tasks/create")}
          >
            Add Task
          </Button>

          {status && (
            <Button
              size="small"
              variant="outlined"
              onClick={handleClearFilters}
              startIcon={<ClearIcon />}
              sx={{ mx: 1 }}
            >
              Clear
            </Button>
          )}

          <Button
            size="small"
            variant="outlined"
            onClick={handleMenuOpen}
            startIcon={<ListIcon />}
            sx={{ ml: "auto" }}
          >
            Status
          </Button>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={() => handleStatusSelect("")}>
              <Typography>
                <em>All</em>
              </Typography>
            </MenuItem>
            {statusMenu.map((item) => (
              <MenuItem
                key={item.id}
                onClick={() => handleStatusSelect(item.label)}
              >
                {item.icon}
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Stack>
      </Grid>

      {tasks.length > 0 ? (
        tasks.map((task, index) => (
          <Grid
            size={{ xs: 12, md: 6, lg: 4 }}
            key={task._id}
            ref={index === tasks.length - 1 ? lastTaskRef : null}
          >
            {isFetching && index === tasks.length - 1 ? (
              <Card variant="outlined" sx={{ p: 0, height: 318 }}>
                <Skeleton variant="rectangular" height="100%" width="100%" />
              </Card>
            ) : (
              <TaskCard task={task} />
            )}
          </Grid>
        ))
      ) : (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{ width: "100%", height: "70vh" }}
        >
          {isFetching ? (
            <LoadingFallback />
          ) : status ? (
            <Typography variant="h6" color="textSecondary">
              No tasks match the applied filters
            </Typography>
          ) : tasks.length === 0 ? (
            <Typography variant="h6" color="textSecondary">
              No tasks found
            </Typography>
          ) : (
            <LoadingFallback />
          )}
        </Stack>
      )}
    </Grid>
  );
};

export default Tasks;
