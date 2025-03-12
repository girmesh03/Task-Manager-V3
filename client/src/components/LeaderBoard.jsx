import PropTypes from "prop-types";
import {
  Card,
  LinearProgress,
  Typography,
  Avatar,
  Stack,
  Rating,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

const LeaderBoard = ({ leadersData }) => {
  return (
    <Card variant="outlined" sx={{ height: "100%", maxHeight: 327 }}>
      <Stack direction="column" spacing={1} sx={{ height: "100%", px: 2 }}>
        <Typography component="h2" variant="subtitle2">
          {`Leaderboard (${leadersData.length})`}
        </Typography>
        <Stack direction="column" sx={{ flexGrow: 1, overflowY: "auto" }}>
          {leadersData.length > 0 ? (
            <Grid container spacing={1}>
              {leadersData.map((leader, index) => (
                <Grid key={index} size={{ xs: 12 }}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar
                      src={leader?.avatar || ""}
                      sx={{ width: 35, height: 35, cursor: "pointer" }}
                    />
                    <Stack direction="column" sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {leader.fullName}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={Number(leader.performance) || 0}
                        sx={{ borderRadius: "4px" }}
                      />
                      <Rating
                        name="read-only"
                        value={leader.rating}
                        readOnly
                        size="small"
                      />
                    </Stack>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", alignSelf: "center" }}
                    >
                      {`${leader.performance}%`}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="center"
              sx={{ height: "80%", width: "100%" }}
            >
              <Typography variant="h6" color="textSecondary">
                No Leaderboard data
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};

LeaderBoard.propTypes = {
  leadersData: PropTypes.array.isRequired,
};

export default LeaderBoard;
