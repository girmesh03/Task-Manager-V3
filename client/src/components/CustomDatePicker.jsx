import { useState } from "react";
import PropTypes from "prop-types";
// import dayjs from "dayjs";
import Button from "@mui/material/Button";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import ClearIcon from "@mui/icons-material/Clear";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useDispatch } from "react-redux";
import { setSelectedDate, clearFilters } from "../redux/features/filtersSlice";

function ButtonField(props) {
  const {
    setOpen,
    label,
    id,
    disabled,
    initialDate, // added to receive selectedDate prop
    onClear, // added to handle clear
    InputProps: { ref } = {},
    inputProps: { "aria-label": ariaLabel } = {},
  } = props;

  return (
    <Button
      variant="outlined"
      id={id}
      disabled={disabled}
      ref={ref}
      aria-label={ariaLabel}
      size="small"
      onClick={() => setOpen?.((prev) => !prev)}
      startIcon={<CalendarTodayRoundedIcon fontSize="small" />}
      sx={{ minWidth: "fit-content" }}
      endIcon={
        initialDate ? <ClearIcon fontSize="small" onClick={onClear} /> : null
      } // Clear icon appears if date is selected
    >
      {label ? `${label}` : "Pick a date"}
    </Button>
  );
}

ButtonField.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string,
  inputProps: PropTypes.shape({
    "aria-label": PropTypes.string,
  }),
  InputProps: PropTypes.shape({
    endAdornment: PropTypes.node,
    startAdornment: PropTypes.node,
  }),
  label: PropTypes.node,
  setOpen: PropTypes.func,
  initialDate: PropTypes.object, // added selectedDate prop
  onClear: PropTypes.func, // added onClear prop
};

const CustomDatePicker = () => {
  const [initialDate, setInitialDate] = useState(null); // Initial date
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const handleOnAccept = (newDate) => {
    const formattedDate = newDate.format("YYYY-MM-DD"); // Format as "YYYY-MM-DD"
    dispatch(setSelectedDate(formattedDate));
    setInitialDate(newDate);
  };

  const handleClearSelectedDate = (event) => {
    event.stopPropagation(); // Prevent the button from toggling the calendar
    dispatch(clearFilters());
    setInitialDate(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={initialDate}
        label={initialDate ? initialDate.format("DD-MM-YYYY") : "Pick a date"} // Check value validity
        onAccept={handleOnAccept}
        slots={{ field: ButtonField }}
        slotProps={{
          field: { setOpen, initialDate, onClear: handleClearSelectedDate },
          nextIconButton: { size: "small" },
          previousIconButton: { size: "small" },
        }}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        views={["day", "month", "year"]}
      />
    </LocalizationProvider>
  );
};

CustomDatePicker.propTypes = {};

export default CustomDatePicker;
