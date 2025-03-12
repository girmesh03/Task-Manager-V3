import PropTypes from "prop-types";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import {
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const TaskTimeLineCard = ({ activities, handleAction }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Timeline
      position={isMobile ? "right" : "alternate"}
      sx={{
        maxWidth: 800,
        mt: 0,
        padding: 0,
        [`& .${timelineItemClasses.root}:before`]: {
          flex: isMobile ? 0 : 1,
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2, ml: 1, textAlign: isMobile ? "left" : "center" }}
      >
        Timeline
      </Typography>
      {activities?.length > 0 ? (
        activities.map((activity, index) => (
          <TimelineItem key={activity._id}>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ overflow: "hidden" }}>
              <Typography
                variant="body1"
                sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
              >
                <strong>Action:</strong> {activity.action}
              </Typography>
              <Typography
                variant="body2"
                sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
              >
                <strong>Notes:</strong> {activity.notes}
              </Typography>
              <Stack
                direction="row"
                justifyContent={
                  index % 2 === 0 || isMobile ? "flex-start" : "flex-end"
                }
                spacing={1}
                sx={{ mt: 2 }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleAction(activity._id, "Delete")}
                >
                  Delete
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleAction(activity._id, "Update")}
                >
                  Update
                </Button>
              </Stack>
            </TimelineContent>
          </TimelineItem>
        ))
      ) : (
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color="primary" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant="body1" color="text.secondary">
              No activities
            </Typography>
          </TimelineContent>
        </TimelineItem>
      )}
    </Timeline>
  );
};

TaskTimeLineCard.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleAction: PropTypes.func.isRequired,
};

export default TaskTimeLineCard;
