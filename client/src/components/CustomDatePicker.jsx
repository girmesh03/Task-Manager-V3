import { useState } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function ButtonField(props) {
  const {
    setOpen,
    label,
    id,
    disabled,
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
};

const CustomDatePicker = () => {
  const [value, setValue] = useState(null); // Initial date
  const [open, setOpen] = useState(false);

  const handleChange = (newValue) => {
    setValue(newValue); // Update local state
  };

  const handleOnAccept = () => {
    if (dayjs.isDayjs(value)) {
      // const formattedDate = value.format("YYYY-MM-DD"); // Format as "YYYY-MM-DD"
      // setSelectedDate(formattedDate); // Pass formatted date to parent
      setValue(null); // Optional: Clear local state
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={value}
        label={value ? value.format("YYYY-MM-DD") : "Pick a date"} // Check value validity
        onChange={handleChange} // Call handleChange when a new date is selected
        onAccept={handleOnAccept}
        slots={{ field: ButtonField }}
        slotProps={{
          field: { setOpen },
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
