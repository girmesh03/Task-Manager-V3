import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  Card,
  TextField,
  Typography,
  Button,
  Alert,
  FormControl,
  FormLabel,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { makeRequest } from "../api/apiRequest";

const ResetPassword = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await makeRequest.post(`/auth/reset-password/${resetToken}`, {
        password: newPassword,
      });
      toast.success("Password has been reset successfully!");
      navigate("/login"); // Redirect to the login page
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to reset password. Please try again.";
      setError(errorMessage);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: 400,
        width: "100%",
        m: "0 auto",
        py: 3,
      }}
    >
      <Card
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          py: 4,
        }}
        component="form"
        autoComplete="off"
        noValidate
        onSubmit={handlePasswordReset}
      >
        <Typography variant="h5" textAlign="center">
          Reset Your Password
        </Typography>

        <Typography variant="body2" textAlign="center" color="text.secondary">
          Enter and confirm your new password below.
        </Typography>

        <FormControl fullWidth>
          <FormLabel htmlFor="newPassword">New Password</FormLabel>
          <TextField
            id="newPassword"
            placeholder="••••••"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            required
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      size="small"
                      edge="end"
                      sx={{ border: "none" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
          <TextField
            id="confirmPassword"
            placeholder="••••••"
            type={showConfirmPassword ? "text" : "password"}
            variant="outlined"
            required
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleConfirmPasswordVisibility}
                      size="small"
                      edge="end"
                      sx={{ border: "none" }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </FormControl>

        {error && <Alert severity="error">{error}</Alert>}

        <Button variant="contained" type="submit" fullWidth>
          Reset Password
        </Button>
        <Button
          variant="text"
          startIcon={<ArrowBackIosRoundedIcon />}
          onClick={() => navigate("/login", { replace: true })}
        >
          Back to login
        </Button>
      </Card>
    </Box>
  );
};

export default ResetPassword;
