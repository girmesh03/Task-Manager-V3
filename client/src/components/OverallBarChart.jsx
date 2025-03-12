import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
// import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { BarChart } from "@mui/x-charts/BarChart";

const OverallBarChart = ({ performance, seriesData, lastSixMonths }) => {
  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Performance
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {performance}
            </Typography>
            {/* <Chip
              size="small"
              color={lastChange > 0 ? "success" : "error"}
              label={`${lastChange}%`}
            /> */}
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Last 6 months
          </Typography>
        </Stack>
        <BarChart
          borderRadius={8}
          // colors={colorPalette}
          xAxis={[
            {
              scaleType: "band",
              categoryGapRatio: 0.5,
              data: lastSixMonths,
            },
          ]}
          series={[
            {
              id: "completed",
              label: "Completed",
              data: seriesData.Completed,
              stack: "A",
            },
            {
              id: "in-progress",
              label: "In Progress",
              data: seriesData["In Progress"],
              stack: "A",
            },
            {
              id: "pending",
              label: "Pending",
              data: seriesData.Pending,
              stack: "A",
            },
            {
              id: "to-do",
              label: "To Do",
              data: seriesData["To Do"],
              stack: "A",
            },
          ]}
          height={210}
          margin={{ left: 30, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
      </CardContent>
    </Card>
  );
};

OverallBarChart.propTypes = {
  performance: PropTypes.string,
  seriesData: PropTypes.object,
  lastSixMonths: PropTypes.array,
};

export default OverallBarChart;
