
import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

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

// Keep all protected pages inside this wrapper.
function PrivatePage({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page: always opens at "/" */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />

        {/* Public authentication pages */}
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

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivatePage>
              <Dashboard />
            </PrivatePage>
          }
        />

        {/* Polls */}
        <Route
          path="/polls"
          element={
            <PrivatePage>
              <PollList />
            </PrivatePage>
          }
        />

        <Route
          path="/polls/create"
          element={
            <PrivatePage>
              <CreatePoll />
            </PrivatePage>
          }
        />

        <Route
          path="/polls/:id"
          element={
            <PrivatePage>
              <PollDetails />
            </PrivatePage>
          }
        />

        {/* Teams */}
        <Route
          path="/teams"
          element={
            <PrivatePage>
              <TeamList />
            </PrivatePage>
          }
        />

        <Route
          path="/teams/create"
          element={
            <PrivatePage>
              <CreateTeam />
            </PrivatePage>
          }
        />

        <Route
          path="/teams/:id"
          element={
            <PrivatePage>
              <TeamDetails />
            </PrivatePage>
          }
        />

        {/* Profile and reports */}
        <Route
          path="/profile"
          element={
            <PrivatePage>
              <Profile />
            </PrivatePage>
          }
        />

        <Route
          path="/reports"
          element={
            <PrivatePage>
              <Reports />
            </PrivatePage>
          }
        />

        {/* Admin */}
        <Route
          path="/manage-users"
          element={
            <PrivatePage>
              <ManageUsers />
            </PrivatePage>
          }
        />

        <Route
          path="/admin-feedbacks"
          element={
            <PrivatePage>
              <AdminFeedbacks />
            </PrivatePage>
          }
        />

        {/* Communities: preserve the original URL casing */}
        <Route
          path="/Communities"
          element={
            <PrivatePage>
              <CommunityList />
            </PrivatePage>
          }
        />

        <Route
          path="/Community/:id"
          element={
            <PrivatePage>
              <CommunityDetails />
            </PrivatePage>
          }
        />

        <Route
          path="/Communities/create"
          element={
            <PrivatePage>
              <CreateCommunity />
            </PrivatePage>
          }
        />

        <Route
          path="/communities/:id/hub"
          element={
            <PrivatePage>
              <CommunityHub />
            </PrivatePage>
          }
        />

        {/* Other application pages */}
        <Route
          path="/comments"
          element={
            <PrivatePage>
              <Comments />
            </PrivatePage>
          }
        />

        <Route
          path="/notifications"
          element={
            <PrivatePage>
              <Notifications />
            </PrivatePage>
          }
        />

        <Route
          path="/option-comparison"
          element={
            <PrivatePage>
              <OptionComparison />
            </PrivatePage>
          }
        />

        <Route
          path="/feedback"
          element={
            <PrivatePage>
              <Feedback />
            </PrivatePage>
          }
        />

        <Route
          path="/analytics"
          element={
            <PrivatePage>
              <Analytics />
            </PrivatePage>
          }
        />

        {/* Unknown URLs return to the landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
