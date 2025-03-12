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
    <Card variant="outlined">
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          sx={{ flexWrap: "nowrap", mb: 1 }}
        >
          <InsightsRoundedIcon fontSize="medium" sx={{ color: "#4caf50" }} />
          <Typography
            component="h2"
            variant="subtitle2"
            sx={{ whiteSpace: "nowrap" }}
          >
            Overall Progress
          </Typography>
          <Typography
            variant="caption"
            sx={{ pt: 0.25, color: "text.secondary", whiteSpace: "nowrap" }}
          >
            Last 30 Days
          </Typography>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
        >
          <Stack direction="column" sx={{ flexShrink: 0 }} gap={0.5}>
            <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
              Total Task {totalTasks}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
              Completed {completedTasks}
            </Typography>
          </Stack>
          <Gauge
            value={Number(overallProgress) || 0}
            max={100}
            min={0}
            startAngle={-110}
            endAngle={110}
            thickness={15}
            sx={{
              height: "100px",
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: 20,
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
