import {
  Chip,
  Tooltip,
  Typography,
  Stack,
  Avatar,
  Rating,
  LinearProgress,
} from "@mui/material";

export const TaskColumns = [
  {
    field: "date",
    headerName: "Date",
    type: "date",
    flex: 0.8,
    minWidth: 90,
    headerAlign: "left",
    align: "left",
    valueGetter: (params) => {
      return params ? new Date(params) : null;
    },
    valueFormatter: (params) => {
      if (!params) return "N/A";
      return new Date(params).toLocaleDateString("en-US");
    },
  },
  {
    field: "title",
    headerName: "Title",
    flex: 1.5,
    minWidth: 80,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1.75,
    minWidth: 120,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "priority",
    headerName: "Priority",
    flex: 0.9,
    minWidth: 75,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const priority = params.row.priority;

      const getPriorityColor = () => {
        switch (priority) {
          case "High":
            return "error"; // Red
          case "Medium":
            return "warning"; // Yellow/Orange
          case "Low":
            return "success"; // Green
          default:
            return "default"; // Grey
        }
      };

      return (
        <Chip
          label={priority}
          color={getPriorityColor()}
          variant="outlined"
          size="small"
        />
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    flex: 0.9,
    minWidth: 90,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const status = params.row.status;

      const getStatusColor = () => {
        switch (status) {
          case "Completed":
            return "success"; // Green
          case "In Progress":
            return "primary"; // Blue
          case "Pending":
            return "warning"; // Yellow
          default:
            return "default"; // Grey
        }
      };

      return (
        <Chip
          label={status}
          color={getStatusColor()}
          variant="outlined"
          size="small"
        />
      );
    },
  },
  {
    field: "assignedTo",
    headerName: "Assigned To",
    flex: 1,
    minWidth: 100,
    headerAlign: "left",
    align: "left",
    renderCell: (params) =>
      params.row.assignedTo.map((user) => user.firstName).join(", "),
  },
];

export const UserColumns = [
  {
    field: "avatar",
    headerName: "Avatar",
    flex: 1,
    minWidth: 60,
    maxWidth: 80,
    renderCell: (params) => (
      <Stack direction="row" alignItems="center" sx={{ height: "100%" }}>
        <Avatar src={params.row.avatar || ""} sx={{ width: 30, height: 30 }} />
      </Stack>
    ),
  },
  {
    field: "fullName",
    headerName: "Full Name",
    flex: 1.5,
    minWidth: 130,
    maxWidth: 180,
  },
  {
    field: "assignedTasks",
    headerName: "Assigned",
    flex: 0.9,
    minWidth: 80,
    maxWidth: 100,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "completedTasks",
    headerName: "Completed",
    flex: 0.9,
    minWidth: 80,
    maxWidth: 100,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "categoriesWorkedOn",
    headerName: "Categories",
    flex: 0.9,
    minWidth: 80,
    maxWidth: 100,
    align: "center",
    renderCell: (params) => (
      <Tooltip title={params.value.categories.join(", ")} arrow>
        <Typography variant="caption" sx={{ cursor: "pointer" }}>
          {params.value.size}
        </Typography>
      </Tooltip>
    ),
  },
  {
    field: "prioritization",
    headerName: "Prioritization",
    flex: 0.9,
    minWidth: 80,
    maxWidth: 100,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <Chip
        label={params.value}
        color={
          params.value === "High"
            ? "error"
            : params.value === "Medium"
            ? "warning"
            : "success"
        }
        size="small"
      />
    ),
  },
  {
    field: "rating",
    headerName: "Rating",
    flex: 1.2,
    minWidth: 90,
    maxWidth: 120,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <Rating
        name="rating"
        value={parseFloat(params.value)}
        readOnly
        size="small"
      />
    ),
  },
  {
    field: "performance",
    headerName: "Performance",
    flex: 1.5,
    minWidth: 140,
    maxWidth: 200,
    renderCell: (params) => {
      const performanceValue = parseFloat(params.value.replace("%", ""));
      return (
        <Stack
          direction="row"
          alignItems="center"
          sx={{ height: "100%", width: "100%" }}
        >
          <LinearProgress
            variant="determinate"
            value={performanceValue}
            sx={{ height: 8, borderRadius: 5, flexGrow: 1 }}
          />
          <Typography variant="caption" sx={{ ml: 1 }}>
            {`${params.value}%`}
          </Typography>
        </Stack>
      );
    },
  },
  {
    field: "rank",
    headerName: "Rank",
    flex: 0.6,
    minWidth: 50,
    maxWidth: 70,
    align: "center",
    headerAlign: "center",
  },
];
