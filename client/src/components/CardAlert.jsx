import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Stack,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";

const gaugeStyles = {
  height: "100px",
  [`& .${gaugeClasses.valueText}`]: { fontSize: 20 },
};

const PerformanceCard = ({ title, value, interval, icon }) => {
  return (
    <Card variant="outlined" sx={{ py: 0, flexShrink: 0 }}>
      <CardContent>
        <Stack direction="row" spacing={1} sx={{ pt: 1.5 }}>
          {icon}
          <Box>
            <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {interval}
            </Typography>
          </Box>
        </Stack>

        <Gauge
          value={value}
          max={100}
          min={0}
          startAngle={-110}
          endAngle={110}
          thickness={15}
          sx={gaugeStyles}
          text={({ value }) => `${value}%`}
        />
      </CardContent>
    </Card>
  );
};

PerformanceCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  interval: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};

const CardAlert = ({ userStat = {}, loading }) => {
  const {
    performance: userPerformance = 0,
    last30DaysOverall: { overallProgress = 0 } = {},
    interval = "",
  } = userStat;

  // if (isError) return <Typography>{error?.data?.message}</Typography>;

  return loading ? (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
    >
      <CircularProgress size={20} disableShrink />
    </Stack>
  ) : (
    <>
      <PerformanceCard
        title="Overall Progress"
        value={Number(overallProgress) || 0}
        interval={interval}
        icon={
          <InsightsRoundedIcon fontSize="medium" sx={{ color: "#4caf50" }} />
        }
      />
      <PerformanceCard
        title="Your Performance"
        value={Number(userPerformance) || 0}
        interval={interval}
        icon={
          <AutoAwesomeRoundedIcon
            fontSize="small"
            sx={{ color: "success.main" }}
          />
        }
      />
    </>
  );
};

CardAlert.propTypes = {
  userStat: PropTypes.object,
  loading: PropTypes.bool,
  // isError: PropTypes.bool,
  // error: PropTypes.object,
};

export default CardAlert;
