import { BrowserRouter, Routes, Route } from "react-router";
import { Suspense, lazy } from "react";
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

import AppTheme from "./shared-theme/AppTheme";
import { LoadingFallback } from "./components/LoadingFallback";

// Lazy loading layouts
const RootLayout = lazy(() => import("./layout/RootLayout"));
const AuthLayout = lazy(() => import("./layout/AuthLayout"));
const AppLayout = lazy(() => import("./layout/AppLayout"));

// Lazy loading pages
const Home = lazy(() => import("./pages/Home"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Tasks = lazy(() => import("./pages/Tasks"));
const CreateTask = lazy(() => import("./pages/CreateTask"));
const TaskDetails = lazy(() => import("./pages/TaskDetails"));
const UpdateTask = lazy(() => import("./pages/UpdateTask"));
const Projects = lazy(() => import("./pages/Projects"));
const Team = lazy(() => import("./pages/Team"));
const Reports = lazy(() => import("./pages/Reports"));

const UserDetails = lazy(() => import("./components/UserDetails"));
const UpdateUser = lazy(() => import("./components/UpdateUser"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));

import ErrorHandler from "./components/ErrorHandler";

function App() {
  return (
    <BrowserRouter>
      <AppTheme themeComponents={xThemeComponents}>
        <CssBaseline enableColorScheme />
        <ErrorHandler />
        <Suspense fallback={<LoadingFallback height="100vh" />}>
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
                <Route path="tasks/create" element={<CreateTask />} />
                <Route path="tasks/:taskId/details" element={<TaskDetails />} />
                <Route path="tasks/:taskId/update" element={<UpdateTask />} />
                <Route path="projects" element={<Projects />} />
                <Route path="team" element={<Team />} />
                <Route path="reports" element={<Reports />} />
                <Route path="users/:userId/details" element={<UserDetails />} />
                <Route path="users/:userId/update" element={<UpdateUser />} />
                <Route path="users/:userId/admin" element={<AdminPanel />} />
              </Route>
              <Route path="/error" element={<ErrorPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </AppTheme>
    </BrowserRouter>
  );
}

export default App;
