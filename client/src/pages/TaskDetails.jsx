import React, { useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import dayjs from "dayjs";

import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";

import ListIcon from "@mui/icons-material/List";
import TimelineIcon from "@mui/icons-material/TimelineOutlined";
import AddIcon from "@mui/icons-material/Add";

import {
  useGetTaskQuery,
  useUpdateTaskMutation,
} from "../redux/features/apiSlice";

import TaskDetailCard from "../components/TaskDetailCard";
import { LoadingFallback } from "../components/LoadingFallback";
import TaskTimeLineCard from "../components/TaskTimeLineCard";
import MuiTextField from "../components/MuiTextField";
import MuiAutocomplete from "../components/MuiAutocomplete";
import MuiMobileDatePicker from "../components/MuiMobileDatePicker";

const ActivityForm = ({ control, options, isNoneMobile }) => {
  return (
    <Stack direction="column" spacing={2} sx={{ flexGrow: 1 }}>
      <MuiTextField
        name="action"
        control={control}
        placeholder="Add Your Action Here"
        rules={{ required: "Action is required" }}
      />
      <Stack spacing={2} direction={!isNoneMobile ? "column" : "row"}>
        <MuiAutocomplete
          name="performedBy"
          control={control}
          options={options}
          placeholder="Eg. John Doe"
          fullWidth
          rules={{ required: "Performed by is required" }}
        />
        <MuiMobileDatePicker
          name="timestamp"
          control={control}
          type="date"
          rules={{ required: "Timestamp is required" }}
        />
      </Stack>
      <MuiTextField
        name="notes"
        control={control}
        rules={{ required: "Notes are required" }}
        placeholder="Eg. Inspect Refrigerators"
        multiline
        rows={4}
      />
    </Stack>
  );
};

ActivityForm.propTypes = {
  control: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  isNoneMobile: PropTypes.bool,
};

const TaskDetails = () => {
  const { taskId } = useParams();
  const { data, isLoading, isError, error } = useGetTaskQuery(taskId);
  const [updateTask] = useUpdateTaskMutation();

  const [tabIndex, setTabIndex] = useState("1");
  const [openDialog, setOpenDialog] = useState(false);
  const [activityAction, setActivityAction] = useState("");
  const [activityActionId, setActivityActionId] = useState(null);

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      action: "",
      performedBy: [],
      timestamp: dayjs().format("YYYY-MM-DD"),
      notes: "",
    },
  });

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setActivityActionId(null);
    setActivityAction("");
  };

  const confirmActivityAction = (activityId, action) => {
    setActivityActionId(activityId);
    setActivityAction(action);
  };

  const cancelActivityAction = () => {
    setActivityActionId(null);
    setActivityAction("");
  };

  const updateActivityItem = () => {
    const activityToUpdate = data?.task?.activities?.find(
      (activity) => activity._id === activityActionId
    );

    if (!activityToUpdate) {
      toast.error("Activity not found.");
      return;
    }

    reset({
      action: activityToUpdate.action,
      performedBy: activityToUpdate.performedBy.map((user) => user._id),
      timestamp: dayjs(activityToUpdate.timestamp).format("YYYY-MM-DD"),
      notes: activityToUpdate.notes,
    });

    setOpenDialog(true);
  };

  const deleteActivityItem = async () => {
    try {
      const updatedActivities = data.task.activities.filter(
        (activity) => activity._id !== activityActionId
      );
      await updateTask({
        taskId,
        activities: updatedActivities,
      }).unwrap();
      toast.success("Activity deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message || "An error occurred");
    } finally {
      cancelActivityAction();
    }
  };

  const onSubmit = async (formData) => {
    try {
      let updatedActivities;

      if (activityActionId) {
        // Updating an existing activity
        updatedActivities = data.task.activities.map((activity) =>
          activity._id === activityActionId ? formData : activity
        );
        toast.success("Activity Updated Successfully");
      } else {
        // Creating a new activity
        updatedActivities = [...data.task.activities, formData];
        toast.success("Activity Added Successfully");
      }

      await updateTask({ taskId, activities: updatedActivities }).unwrap();

      handleCloseDialog();
      reset();
    } catch (error) {
      toast.error(error?.data?.message || "An error occurred");
    }
  };

  if (isLoading) return <LoadingFallback />;
  if (isError) return <div>{error?.data?.message || "An error occurred"}</div>;

  const { task, users } = data;
  const { activities } = task || [];

  return (
    <React.Fragment>
      <TabContext value={tabIndex}>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <TabList
            aria-label="task panels"
            selectionFollowsFocus
            onChange={(event, newValue) => setTabIndex(newValue)}
            sx={{
              "& .MuiButtonBase-root:focus": {
                outline: "none",
              },
            }}
          >
            <Tab
              label="Details"
              value="1"
              icon={<ListIcon />}
              iconPosition="start"
            />
            <Tab
              label="Timeline"
              value="2"
              icon={<TimelineIcon />}
              iconPosition="start"
            />
          </TabList>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ display: tabIndex === "1" ? "none" : "inline-flex", mr: 2 }}
          >
            Activity
          </Button>
        </Stack>
        <TabPanel value="1">
          <TaskDetailCard task={task} />
        </TabPanel>
        <TabPanel value="2">
          <TaskTimeLineCard
            activities={activities}
            handleAction={confirmActivityAction}
          />
        </TabPanel>
      </TabContext>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              handleSubmit(onSubmit)();
            },
            sx: {
              backgroundImage: "none",
              maxWidth: "500px",
              width: "100%",
              padding: 2,
              mx: 1,
            },
          },
        }}
      >
        <DialogTitle id="dialog-title">New Activity</DialogTitle>
        <DialogContent id="dialog-form" sx={{ p: 2 }}>
          <ActivityForm control={control} options={users || []} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            color="secondary"
            size="small"
            variant="contained"
          >
            Add Activity
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(activityActionId)}
        onClose={cancelActivityAction}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{`Confirm To ${activityAction}`}</DialogTitle>
        <DialogContent>
          <Typography>
            {`Are you sure you want to ${activityAction} this activity?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelActivityAction} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={
              activityAction === "Update"
                ? updateActivityItem
                : deleteActivityItem
            }
            variant="contained"
            color="error"
            loading={isSubmitting}
            loadingPosition="start"
            loadingIndicator={<CircularProgress size={20} />}
          >
            {activityAction === "Update" ? "Update" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default TaskDetails;
