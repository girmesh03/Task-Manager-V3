import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";

function AreaGradient({ color, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

AreaGradient.propTypes = {
  color: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

const StatisticsCard = ({
  title,
  value,
  previous30DaysCount,
  trendChange,
  interval,
  trend,
  data,
  daysInLast30,
}) => {
  const theme = useTheme();

  const trendColors = {
    up:
      theme.palette.mode === "light"
        ? theme.palette.success.main
        : theme.palette.success.dark,
    down:
      theme.palette.mode === "light"
        ? theme.palette.error.main
        : theme.palette.error.dark,
    neutral:
      theme.palette.mode === "light"
        ? theme.palette.grey[400]
        : theme.palette.grey[700],
  };

  const labelColors = {
    up: "success",
    down: "error",
    neutral: "default",
  };

  const color = labelColors[trend];
  const chartColor = trendColors[trend];
  const trendValues = {
    up: `${trendChange}`,
    down: `${trendChange}`,
    neutral: trendChange,
  };

  return (
    <Card variant="outlined">
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Typography component="h2" variant="subtitle2">
          {title}
        </Typography>
        <Typography variant="caption" sx={{ pt: 0.1, color: "text.secondary" }}>
          {interval}
        </Typography>
      </Stack>
      <Stack direction="column" spacing={1}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Stack direction="row" spacing={0.5}>
            <Typography variant="h4">{value}</Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", alignSelf: "flex-end", pb: 0.5 }}
            >
              {previous30DaysCount}
            </Typography>
          </Stack>
          <Chip size="small" color={color} label={trendValues[trend]} />
        </Stack>
        {/* <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Previous {`${interval}: ${previous30DaysCount}`}
        </Typography> */}
        <SparkLineChart
          colors={[chartColor]}
          data={data}
          area
          showHighlight
          showTooltip
          curve="natural"
          height={30}
          xAxis={{
            scaleType: "band",
            data: daysInLast30,
          }}
          sx={{
            [`& .${areaElementClasses.root}`]: {
              fill: `url(#area-gradient-${value})`,
            },
          }}
        >
          <AreaGradient color={chartColor} id={`area-gradient-${value}`} />
        </SparkLineChart>
      </Stack>
    </Card>
  );
};

StatisticsCard.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  interval: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  trend: PropTypes.oneOf(["down", "neutral", "up"]).isRequired,
  value: PropTypes.string.isRequired,
  previous30DaysCount: PropTypes.string.isRequired,
  trendChange: PropTypes.string.isRequired,
  daysInLast30: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default StatisticsCard;
