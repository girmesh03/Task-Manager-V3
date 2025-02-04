import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useGetDashboardQuery } from "../redux/features/apiSlice";
import StatisticsCard from "../components/StatisticsCard";
import OverallProgressCard from "../components/OverallProgressCard";
import OverallBarChart from "../components/OverallBarChart";
import LeaderBoard from "../components/LeaderBoard";
import { LoadingFallback } from "../components/LoadingFallback";

const Dashboard = () => {
  const { data, isLoading } = useGetDashboardQuery();

  if (isLoading) {
    return <LoadingFallback />;
  }

  const {
    statData,
    // chartData, // unused
    seriesData,
    lastSixMonths,
    daysInLast30,
    last30DaysOverall,
    performance,
  } = data;
  // console.log("daysInLast30", daysInLast30);

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
        {statData.map(
          (card, index) =>
            card.title !== "To Do" && (
              <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
                <StatisticsCard {...card} daysInLast30={daysInLast30} />
              </Grid>
            )
        )}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <OverallProgressCard last30DaysOverall={last30DaysOverall} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <OverallBarChart
            performance={performance}
            seriesData={seriesData}
            lastSixMonths={lastSixMonths}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <LeaderBoard />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
