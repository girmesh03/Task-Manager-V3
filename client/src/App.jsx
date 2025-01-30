import { BrowserRouter, Routes, Route } from "react-router";
import CssBaseline from "@mui/material/CssBaseline";

import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "./theme/customizations";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

import RootLayout from "./layout/RootLayout";
import AuthLayout from "./layout/AuthLayout";
import AppLayout from "./layout/AppLayout";
import AppTheme from "./shared-theme/AppTheme";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <AppTheme themeComponents={xThemeComponents}>
        <CssBaseline enableColorScheme />
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route element={<AuthLayout />}>
              <Route index element={<Home />} />
              <Route path="signup" element={<Signup />} />
              <Route path="login" element={<Login />} />
              <Route path="verify-email" element={<VerifyEmail />} />
              <Route
                path="reset-password/:resetToken"
                element={<ResetPassword />}
              />
              <Route path="forgot-password" element={<ForgotPassword />} />
            </Route>
            <Route element={<AppLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="projects" element={<Projects />} />
              <Route path="team" element={<Team />} />
              <Route path="reports" element={<Reports />} />
            </Route>
          </Route>
        </Routes>
      </AppTheme>
    </BrowserRouter>
  );
}

export default App;
