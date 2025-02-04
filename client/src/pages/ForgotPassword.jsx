import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  Card,
  TextField,
  Typography,
  Button,
  Alert,
  FormControl,
  FormLabel,
  Box,
} from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";

import { makeRequest } from "../api/apiRequest";

const ForgotPassword = () => {
  const [userEmail, setUserEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const resetPassword = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      await makeRequest.post("/auth/forgot-password", {
        email: userEmail,
      });
      toast.success("Password reset link sent to your email");
    } catch (err) {
      if (err.response.status === 404) {
        navigate("/signup", { replace: true });
      } else {
        const errorMessage =
          err.response?.data?.message ||
          "Something went wrong. Please try again.";
        setError(errorMessage);
      }
    }
  };

  return (
    <Box
      width="100%"
      height="100%"
      p={1}
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
    >
      <Card variant="outlined" sx={{ maxWidth: 400, width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 2,
          }}
          component="form"
          autoComplete="off"
          noValidate
          onSubmit={resetPassword}
        >
          <Typography variant="h5" align="center">
            Forgot Password
          </Typography>

          <FormControl fullWidth>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              id="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
              placeholder="Enter your email"
              variant="outlined"
              aria-label="Email Address"
            />
          </FormControl>

          {error && (
            <Alert severity="error" role="alert" aria-live="polite">
              {error}
            </Alert>
          )}

          <Button variant="contained" type="submit" fullWidth>
            Get Reset Link
          </Button>
          <Button
            variant="text"
            component={Link}
            to="/login"
            startIcon={<ArrowBackIosRoundedIcon />}
            aria-label="Back to Login"
          >
            Back to Login
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default ForgotPassword;
