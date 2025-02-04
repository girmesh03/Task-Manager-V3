import { Outlet } from "react-router";
import { useColorScheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import { ToastContainer } from "react-toastify";

const RootLayout = () => {
  const { mode } = useColorScheme();
  return (
    <Box
      sx={(theme) => ({
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        margin: "0 auto",
        height: "100dvh",
        overflow: "hidden",
        "&::before": {
          content: '""',
          display: "block",
          position: "absolute",
          zIndex: -1,
          inset: 0,
          backgroundImage:
            "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
          backgroundRepeat: "no-repeat",
          ...theme.applyStyles("dark", {
            backgroundImage:
              "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
          }),
        },
      })}
    >
      <Outlet />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={mode === "dark" ? "dark" : "light"}
        limit={3}
      />
    </Box>
  );
};

export default RootLayout;
