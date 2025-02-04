import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { Stack } from "@mui/material";

const OverallProgressCard = ({ last30DaysOverall }) => {
  const { overallProgress, totalTasks, completedTasks } = last30DaysOverall;

  return (
    <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" gap={1}>
          <InsightsRoundedIcon fontSize="large" sx={{ color: "#4caf50" }} />
          <Typography component="h2" variant="subtitle2">
            Overall Progress
          </Typography>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
        >
          <Stack direction="column" sx={{ flexShrink: 0 }} gap={1}>
            <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
              Completed {completedTasks}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
              Total Task {totalTasks}
            </Typography>
          </Stack>
          <Gauge
            value={overallProgress}
            max={100}
            min={0}
            startAngle={-110}
            endAngle={110}
            thickness={15}
            sx={{
              height: "100px",
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: 30,
                // transform: "translate(0px, 10px)", // Adjust alignment
              },
            }}
            text={({ value }) => `${value}%`} // Display the percentage
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

OverallProgressCard.propTypes = {
  last30DaysOverall: PropTypes.object.isRequired,
};

export default OverallProgressCard;
