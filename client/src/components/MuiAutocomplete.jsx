import { memo } from "react";
import { Controller } from "react-hook-form";
import PropTypes from "prop-types";
import { Autocomplete, TextField } from "@mui/material";

const MuiAutocomplete = memo(
  ({ name, control, rules, label, options, ...props }) => {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules} // Pass validation rules
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Autocomplete
            multiple
            options={options}
            size="small"
            getOptionLabel={(option) => option.firstName || ""}
            value={options.filter((user) => value?.includes(user._id)) || []}
            onChange={(_, selectedUsers) =>
              onChange(selectedUsers.map((user) => user._id))
            }
            {...props} // Forward additional props
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                fullWidth
                placeholder={params?.value ? "" : "Select users"}
                size="small"
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
            slotProps={{
              popupIndicator: {
                sx: {
                  border: "none",
                  height: "auto",
                },
              },
              clearIndicator: {
                sx: {
                  border: "none",
                  height: "auto",
                },
              },
            }}
          />
        )}
      />
    );
  }
);

MuiAutocomplete.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  rules: PropTypes.object,
  label: PropTypes.string,
  options: PropTypes.array.isRequired,
};

export default MuiAutocomplete;
