import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import StatisticsCard from "../components/StatisticsCard";
import OverallBarChart from "../components/OverallBarChart";
import LeaderBoard from "../components/LeaderBoard";
import { LoadingFallback } from "../components/LoadingFallback";
import { useGetDashboardQuery } from "../redux/features/apiSlice";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { selectedDepartment } = useSelector((state) => state.auth);
  const { selectedDate } = useSelector((state) => state.filters);

  const { data, isLoading, isError, isSuccess } = useGetDashboardQuery({
    selectedDepartment,
    limit: 5,
    currentDate: selectedDate,
  });

  if (isLoading) return <LoadingFallback />;
  if (isError || !isSuccess) return null;

  const {
    statData,
    seriesData,
    lastSixMonths,
    daysInLast30,
    performance,
    leaderboard,
  } = data;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography component="h2" variant="h6" gutterBottom>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {statData?.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatisticsCard {...card} daysInLast30={daysInLast30} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, md: 6 }}>
          <OverallBarChart
            performance={performance}
            seriesData={seriesData}
            lastSixMonths={lastSixMonths}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <LeaderBoard leadersData={leaderboard || []} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
