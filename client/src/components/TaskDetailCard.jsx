import PropTypes from "prop-types";
import dayjs from "dayjs";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

const TaskDetailCard = ({ task }) => {
  return (
    <Card variant="outlined" sx={{ maxWidth: 700, mx: "auto", p: 3 }}>
      <CardContent>
        {/* Title */}
        <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
          {task.title}
        </Typography>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          gutterBottom
          // noWrap
          sx={{
            whiteSpace: "pre-wrap",
            textAlign: "justify",
          }}
        >
          {task.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Task Details in Grid Layout */}
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack direction="row" spacing={2}>
              <Typography variant="subtitle2">Status:</Typography>
              <Chip label={task.status} color="info" size="small" />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack direction="row" spacing={2}>
              <Typography variant="subtitle2">Priority:</Typography>
              <Chip label={task.priority} color="error" size="small" />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">
              Date: {dayjs(task.date).format("YYYY-MM-DD")}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">
              Location: {task.location}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          {/* Categories */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">Category:</Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
              {task.category.map((cat, index) => (
                <Chip key={index} label={cat} size="small" color="primary" />
              ))}
            </Box>
          </Grid>

          {/* Assigned People */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">Assigned To:</Typography>
            <Stack direction="column" spacing={1} mt={1}>
              {task.assignedTo.map((person) => (
                <Stack direction="row" alignItems="center" key={person._id}>
                  <Avatar sx={{ width: 36, height: 36, mr: 1 }} />
                  <Typography variant="caption">
                    {person.firstName} {person.lastName} - {person.position}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Activity Log */}
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Activity Log:
        </Typography>
        <Stack direction="column" spacing={1}>
          {task.activities.map((activity) => (
            <Box key={activity._id} sx={{ borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">
                <Typography component="span">
                  {activity.performedBy.map((user) => user.firstName)}:
                </Typography>{" "}
                {activity.action}
              </Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

TaskDetailCard.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    category: PropTypes.arrayOf(PropTypes.string).isRequired,
    assignedTo: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        position: PropTypes.string.isRequired,
      })
    ).isRequired,
    activities: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        action: PropTypes.string.isRequired,
        performedBy: PropTypes.arrayOf(
          PropTypes.shape({
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default TaskDetailCard;
