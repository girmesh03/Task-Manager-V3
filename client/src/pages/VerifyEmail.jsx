import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { Card, TextField, Typography, Button, Alert, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";

import { makeRequest } from "../api/apiRequest";

const VerifyEmail = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerification = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      await makeRequest.post("/auth/verify-email", {
        code: String(verificationCode),
      });

      toast.success("Email verified successfully!");
      navigate("/login", { replace: true }); // Redirect to a relevant page on success
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Invalid verification code. Please try again.";
      setError(errorMessage);
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
          onSubmit={handleVerification}
        >
          <Typography variant="h5" textAlign="center">
            Verify Your Email
          </Typography>

          <Typography variant="body2" textAlign="center" color="text.secondary">
            Please enter the 6-digit code sent to your email.
          </Typography>

          <Grid container spacing={1}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid size={{ xs: 2 }} key={index}>
                <TextField
                  variant="outlined"
                  required
                  value={verificationCode[index] || ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
                    if (value) {
                      const updatedCode = verificationCode.split("");
                      updatedCode[index] = value;
                      setVerificationCode(updatedCode.join(""));
                    }
                  }}
                  slotProps={{
                    htmlInput: {
                      style: { textAlign: "center" },
                      pattern: "[0-9]*",
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {error && <Alert severity="error">{error}</Alert>}

          <Button variant="contained" type="submit" fullWidth>
            Verify
          </Button>
          <Button
            variant="text"
            startIcon={<ArrowBackIosRoundedIcon />}
            onClick={() => navigate("/signup", { replace: true })} // Navigate back to login
          >
            Back to Signup
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default VerifyEmail;
