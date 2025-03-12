import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import {
  FormControl,
  FormLabel,
  Typography,
  Stack,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import HighPriorityIcon from "@mui/icons-material/PriorityHigh";
import MediumPriorityIcon from "@mui/icons-material/ImportExport";
import LowPriorityIcon from "@mui/icons-material/ArrowDownward";
import ListIcon from "@mui/icons-material/List";
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import PlumbingIcon from "@mui/icons-material/Plumbing";
import FormatPaintIcon from "@mui/icons-material/FormatPaint";
import BuildIcon from "@mui/icons-material/Build";
import CarpenterIcon from "@mui/icons-material/Carpenter";
import EngineeringIcon from "@mui/icons-material/Engineering";
import CategoryIcon from "@mui/icons-material/Category";
import MuiTextField from "../components/MuiTextField";
import MuiAutocomplete from "../components/MuiAutocomplete";

import {
  useCreateTaskMutation,
  useGetUsersQuery,
} from "../redux/features/apiSlice";

import DropdownMenu from "../components/DropdownMenu";
import MuiMobileDatePicker from "../components/MuiMobileDatePicker";
import { LoadingFallback } from "../components/LoadingFallback";
import { useSelector } from "react-redux";

const taskCategories = [
  { label: "Electrical", icon: <ElectricalServicesIcon /> },
  { label: "HVAC", icon: <AcUnitIcon /> },
  { label: "Plumbing", icon: <PlumbingIcon /> },
  { label: "Painting", icon: <FormatPaintIcon /> },
  { label: "Mechanical", icon: <BuildIcon /> },
  { label: "Wood-Working", icon: <CarpenterIcon /> },
  { label: "Civil", icon: <EngineeringIcon /> },
  { label: "Other", icon: <CategoryIcon /> },
];

const statusTypes = [
  { label: "Completed", icon: <CheckCircleIcon /> },
  { label: "Pending", icon: <HourglassEmptyIcon /> },
  { label: "In Progress", icon: <PendingActionsIcon /> },
  { label: "To Do", icon: <ListIcon /> },
];

const priorityTypes = [
  { label: "High", icon: <HighPriorityIcon /> },
  { label: "Medium", icon: <MediumPriorityIcon /> },
  { label: "Low", icon: <LowPriorityIcon /> },
];

const CreateTask = () => {
  const { selectedDepartment } = useSelector((state) => state.auth);
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useGetUsersQuery({ selectedDepartment });
  const [createTask] = useCreateTaskMutation();
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      assignedTo: [],
      location: "",
      date: dayjs().format("YYYY-MM-DD"),
      description: "",
      status: "To Do",
      priority: "Medium",
      category: [],
    },
  });

  const onSubmit = async (data) => {
    try {
      data.departmentId = selectedDepartment;
      await createTask(data).unwrap();
      reset();
      navigate(-1, { replace: true });
      toast.success("Task created successfully");
    } catch (error) {
      console.log("error", error);
      toast.error(error.data.message || "An error occurred");
    }
  };

  if (isLoading) return <LoadingFallback />;
  if (isError) return <div>{error.data.message || "An error occurred"}</div>;

  return (
    <Paper
      variant="outlined"
      sx={{ maxWidth: 700, width: "100%", mx: "auto", px: 2.5, py: 1.5 }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 3, pt: 2, borderBottom: 1, borderColor: "divider" }}
      >
        Create Task
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <FormLabel htmlFor="title">Title</FormLabel>
              <MuiTextField
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                placeholder="Eg. Inspect Refrigerators"
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack direction="column" justifyContent="center" spacing={1}>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Category
              </Typography>
              <DropdownMenu
                name="category"
                control={control}
                options={taskCategories}
                rules={{ required: "Category field is required" }}
                multiple
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack direction="column" justifyContent="center" spacing={1}>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Assigned To
              </Typography>
              <MuiAutocomplete
                name="assignedTo"
                control={control}
                options={users || []}
                rules={{ required: "At least one user must be assigned" }}
                fullWidth
              />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack direction="column" justifyContent="center" spacing={1}>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Date
              </Typography>
              <MuiMobileDatePicker
                name="date"
                control={control}
                rules={{ required: "Date is required" }}
              />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <FormLabel htmlFor="location">Location</FormLabel>
              <MuiTextField
                name="location"
                control={control}
                rules={{ required: "Location is required" }}
                placeholder="Eg. Main Kitchen"
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Stack direction="column" justifyContent="center" spacing={1}>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Status
              </Typography>
              <DropdownMenu
                name="status"
                control={control}
                options={statusTypes}
                rules={{ required: "Status is required" }}
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Stack direction="column" justifyContent="center" spacing={1}>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Priority
              </Typography>
              <DropdownMenu
                name="priority"
                control={control}
                options={priorityTypes}
                rules={{ required: "Priority is required" }}
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel htmlFor="description">Description</FormLabel>
              <MuiTextField
                name="description"
                placeholder="Eg. Check and repair refrigerators in the main kitchen."
                control={control}
                rules={{ required: "Description is required" }}
                multiline
                rows={4}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={2}
          sx={{ mt: 2, px: 2, py: 1.5, borderTop: 1, borderColor: "divider" }}
        >
          <Button
            onClick={() => navigate(-1, { replace: true })}
            color="secondary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            size="small"
            loading={isSubmitting}
            loadingPosition="start"
            loadingIndicator={
              <CircularProgress size={20} sx={{ color: "white" }} />
            }
          >
            Create
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default CreateTask;
