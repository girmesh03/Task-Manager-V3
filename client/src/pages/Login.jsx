import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import AuthCard from "../components/AuthCard";
import MuiTextField from "../components/MuiTextField";
import { SitemarkIcon } from "../components/CustomIcons";
import Content from "../components/Content";

import { makeRequest } from "../api/apiRequest";
import { setCurrentUser } from "../redux/features/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleSubmit, control, reset, watch, setValue } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (formData) => {
    try {
      const { data } = await makeRequest.post("/auth/login", formData);
      // const { currentUser, departments, selectedDepartment } = data;
      dispatch(setCurrentUser(data));
      toast.success(data.message);
      reset();
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Stack
      direction={{ xs: "column-reverse", md: "row" }}
      sx={{
        justifyContent: { xs: "flex-end", md: "center" },
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
            Log in
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
            <FormControl fullWidth>
              <FormLabel htmlFor="email">Email</FormLabel>
              <MuiTextField
                name="email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                control={control}
                rules={{ required: "Email is required" }}
              />
            </FormControl>
            <FormControl fullWidth>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Link
                  component={Link}
                  to="/forgot-password"
                  variant="body2"
                  style={{
                    alignSelf: "baseline",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  Forgot your password?
                </Link>
              </Box>
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
            <FormControlLabel
              control={
                <Checkbox
                  id="remember"
                  name="remember"
                  value="remember"
                  color="primary"
                  checked={watch("rememberMe")}
                  onChange={(e) => setValue("rememberMe", e.target.checked)}
                />
              }
              label="Remember me"
            />
            <Button type="submit" fullWidth variant="contained">
              Log in
            </Button>
            <Typography sx={{ textAlign: "center" }}>
              Don&apos;t have an account?{" "}
              <span style={{ color: "hsl(210, 98%, 42%)" }}>
                <Link
                  component={Link}
                  to={{
                    pathname: "/signup",
                    state: { from: "/login" },
                  }}
                  style={{
                    alignSelf: "center",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  Sign up
                </Link>
              </span>
            </Typography>
          </Box>
        </AuthCard>
      </Stack>
    </Stack>
  );
};

export default Login;
