import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import AuthCard from "../components/AuthCard";
import MuiTextField from "../components/MuiTextField";
import { SitemarkIcon } from "../components/CustomIcons";
import { makeRequest } from "../api/apiRequest";
import Content from "../components/Content";

const positions = [
  { id: 1, value: "Chief Engineer" },
  { id: 2, value: "Electrician" },
  { id: 3, value: "HVAC Technician" },
  { id: 4, value: "Plumber" },
  { id: 5, value: "Painter" },
  { id: 6, value: "General Mechanic" },
  { id: 7, value: "Woodwork Technician" },
  { id: 8, value: "Civil Work Technician" },
  { id: 9, value: "Lift Attendant" },
];

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      position: "",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    try {
      const response = await makeRequest.post("/auth/signup", data);
      toast.success(response.data.message, { autoClose: 10000 });
      reset();
      navigate("/verify-email", { replace: true });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Stack
      direction={{ xs: "column-reverse", md: "row" }}
      sx={{
        justifyContent: "center",
        gap: { xs: 6, sm: 12 },
        p: 1,
        mx: "auto",
      }}
    >
      <Stack
        direction={{ xs: "column-reverse", md: "row" }}
        sx={{
          justifyContent: "center",
          gap: { xs: 6, sm: 12 },
          p: { xs: 0, sm: 4 },
          m: "auto",
        }}
      >
        <Content />
        <AuthCard>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <SitemarkIcon />
          </Box>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <Stack
              rowGap={2}
              columnGap={2}
              direction={{ xs: "column", lg: "row" }}
            >
              <FormControl fullWidth>
                <FormLabel htmlFor="firstName">First Name</FormLabel>
                <MuiTextField
                  name="firstName"
                  placeholder="First name"
                  control={control}
                  rules={{ required: "First name is required" }}
                />
              </FormControl>
              <FormControl fullWidth>
                <FormLabel htmlFor="lastName">Last Name</FormLabel>
                <MuiTextField
                  name="lastName"
                  placeholder="Last name"
                  control={control}
                  rules={{ required: "Last name is required" }}
                />
              </FormControl>
            </Stack>
            <Stack
              rowGap={2}
              columnGap={2}
              alignItems="flex-start"
              direction={{ xs: "column", lg: "row" }}
            >
              <FormControl fullWidth>
                <FormLabel htmlFor="email">Email</FormLabel>
                <MuiTextField
                  name="email"
                  type="email"
                  placeholder="your@gmail.com"
                  autoComplete="email"
                  control={control}
                  rules={{ required: "Email is required" }}
                />
              </FormControl>
              <Box width="100%">
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Position
                </Typography>
                <Controller
                  name="position"
                  control={control}
                  rules={{ required: "Position is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Select
                        {...field}
                        id="position"
                        displayEmpty
                        fullWidth
                        MenuProps={{
                          PaperProps: {
                            style: { maxHeight: 300 },
                          },
                        }}
                        inputProps={{ "aria-label": "Position" }}
                        sx={{
                          "& .MuiSelect-select": {
                            color: field.value
                              ? "inherit"
                              : (theme) => theme.palette.text.secondary,
                          },
                        }}
                      >
                        <MenuItem disabled value="">
                          <em>Select your position</em>
                        </MenuItem>

                        {positions.map((position) => (
                          <MenuItem key={position.id} value={position.value}>
                            {position.value}
                          </MenuItem>
                        ))}
                      </Select>
                      {/* Display error message */}
                      {error && (
                        <Typography
                          variant="body2"
                          color="error"
                          sx={{
                            mx: "1.25rem",
                            mt: "0.4rem",
                            fontSize: "0.75rem",
                          }}
                        >
                          {error.message}
                        </Typography>
                      )}
                    </>
                  )}
                />
              </Box>
            </Stack>
            <FormControl fullWidth>
              <FormLabel htmlFor="password">Password</FormLabel>
              <MuiTextField
                name="password"
                placeholder="••••••"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                control={control}
                rules={{ required: "Password is required" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      onClick={togglePasswordVisibility}
                      sx={{ cursor: "pointer" }}
                    >
                      {showPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
            <Button type="submit" fullWidth variant="contained">
              Sign up
            </Button>
            <Typography sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <span>
                <Link
                  component={Link}
                  to={{
                    pathname: "/login",
                    state: { from: "/signup" },
                  }}
                  style={{
                    alignSelf: "center",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  Log in
                </Link>
              </span>
            </Typography>
          </Box>
        </AuthCard>
      </Stack>
    </Stack>
  );
};

export default Signup;
