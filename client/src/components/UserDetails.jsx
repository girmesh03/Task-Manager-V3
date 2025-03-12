import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { useGetUserStatisticsQuery } from "../redux/features/apiSlice";
import { LoadingFallback } from "./LoadingFallback";
import { Box, Card, CardContent, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";

// Colors for the pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const UserDetails = () => {
  const { userId } = useParams();
  const { selectedDepartment } = useSelector((state) => state.auth);
  const { selectedDate } = useSelector((state) => state.filters);
  const { data, isLoading, isError, error } = useGetUserStatisticsQuery({
    selectedDepartment,
    userId,
    currentDate: selectedDate
      ? selectedDate
      : new Date().toISOString().split("T")[0],
  });

  if (isLoading) return <LoadingFallback />;
  if (isError)
    return <div>Error: {error?.data?.message || "Failed to load tasks"}</div>;

  // Data preparation for charts
  const {
    // assignedTasks,
    completedTasks,
    pendingTasks,
    inProgressTasks,
    toDoTasks,
    performance,
    last30DaysOverall,
    categoriesWorkedOn,
  } = data;

  // Pie chart data for task status
  const taskStatusData = [
    { name: "Completed", value: completedTasks },
    { name: "In Progress", value: inProgressTasks },
    { name: "To Do", value: toDoTasks },
    { name: "Pending", value: pendingTasks },
  ];

  // Line chart data for progress over the last 30 days
  const lineChartData = [
    {
      name: "Last 30 Days",
      completed: last30DaysOverall.completedTasks,
      total: last30DaysOverall.totalTasks,
    },
  ];

  return (
    <Box>
      {/* Header with User Info */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5">{data.fullName}</Typography>
          <Typography variant="body2">{data.email}</Typography>
          <Typography variant="subtitle1">Rank: {data.rank}</Typography>
        </CardContent>
      </Card>

      {/* Task Statistics Section */}
      <Grid container spacing={3} marginTop={2}>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Status
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height={250}
              >
                <Gauge
                  animate={performance.toString()}
                  value={Number(performance) || 0}
                  max={100}
                  min={0}
                  startAngle={-110}
                  endAngle={110}
                  thickness={15}
                  sx={{
                    // height: "100px",
                    [`& .${gaugeClasses.valueText}`]: {
                      fontSize: 40,
                      // transform: "translate(0px, 10px)", // Adjust alignment
                    },
                  }}
                  text={({ value }) => `${value}%`} // Display the percentage
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Categories Worked On
              </Typography>
              <Typography variant="body2">
                {categoriesWorkedOn.categories.join(", ")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Line Chart for Last 30 Days Task Completion */}
      <Grid container spacing={3} marginTop={3}>
        <Grid size={{ xs: 12 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Completion Over Last 30 Days
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completed" stroke="#4caf50" />
                  <Line type="monotone" dataKey="total" stroke="#f44336" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDetails;
