
import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";

import DashboardLayout from "./components/DashboardLayout";

import LandingPage from "./pages/Auth/LandingPage";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import VerifyResetOTP from "./pages/Auth/VerifyResetOTP";
import ResetPassword from "./pages/Auth/ResetPassword";

import Dashboard from "./pages/Dashboard/Dashboard";
import Comments from "./pages/Dashboard/Comments";

import PollList from "./pages/Polls/PollList";
import CreatePoll from "./pages/Polls/CreatePoll";
import PollDetails from "./pages/Polls/PollDetails";

import TeamList from "./pages/Teams/TeamList";
import CreateTeam from "./pages/Teams/CreateTeam";
import TeamDetails from "./pages/Teams/TeamDetails";

import Profile from "./pages/Profile/Profile";
import Reports from "./pages/Profile/Reports";

import ManageUsers from "./pages/Admin/ManageUsers";

import CommunityList from "./pages/Communities/CommunityList";
import CommunityDetails from "./pages/Communities/CommunityDetails";
import CreateCommunity from "./pages/Communities/CreateCommunity";
import CommunityHub from "./pages/Communities/CommunityHub";

import Notifications from "./pages/Notification/Notifications";
import OptionComparison from "./pages/Decision/OptionComparison";

import Feedback from "./pages/Feedback/Feedback";
import AdminFeedbacks from "./pages/Feedback/AdminFeedbacks";

import Analytics from "./pages/Analytics/analytics";

import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";

// Protect dashboard routes and render the shared layout only once.
function PrivateLayout() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />

        {/* Authentication pages */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/verify-reset-otp"
          element={
            <PublicRoute>
              <VerifyResetOTP />
            </PublicRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* All protected pages share one DashboardLayout */}
        <Route element={<PrivateLayout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Polls */}
          <Route path="/polls" element={<PollList />} />
          <Route
            path="/polls/create"
            element={<CreatePoll />}
          />
          <Route
            path="/polls/:id"
            element={<PollDetails />}
          />

          {/* Teams */}
          <Route path="/teams" element={<TeamList />} />
          <Route
            path="/teams/create"
            element={<CreateTeam />}
          />
          <Route
            path="/teams/:id"
            element={<TeamDetails />}
          />

          {/* Profile and reports */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/reports" element={<Reports />} />

          {/* Administration */}
          <Route
            path="/manage-users"
            element={<ManageUsers />}
          />
          <Route
            path="/admin-feedbacks"
            element={<AdminFeedbacks />}
          />

          {/* Communities */}
          <Route
            path="/Communities"
            element={<CommunityList />}
          />
          <Route
            path="/Community/:id"
            element={<CommunityDetails />}
          />
          <Route
            path="/Communities/create"
            element={<CreateCommunity />}
          />
          <Route
            path="/communities/:id/hub"
            element={<CommunityHub />}
          />

          {/* Other application pages */}
          <Route path="/comments" element={<Comments />} />
          <Route
            path="/notifications"
            element={<Notifications />}
          />
          <Route
            path="/option-comparison"
            element={<OptionComparison />}
          />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>

        {/* Unknown URLs */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
