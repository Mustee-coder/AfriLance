import { Route, Routes } from "react-router-dom";

import Landing from "@/pages/Landing";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ProtectedRoute from "@/routes/ProtectedRoute";

// Developer
import DeveloperDashboard from "@/pages/developer/DeveloperDashboard";
import BrowseJobs from "@/pages/developer/BrowseJobs";
import Applications from "@/pages/developer/Applications";
import MyProfile from "@/pages/developer/MyProfile";
import Settings from "@/pages/developer/Settings";
import DeveloperPublicProfile from "@/pages/developer/DeveloperPublicProfile";

// Jobs
import JobDetails from "@/pages/jobs/JobDetails";
import ApplyJob from "@/pages/jobs/ApplyJob";

// Client
import ClientDashboard from "@/pages/client/ClientDashboard";
import PostJob from "@/pages/client/PostJob";
import MyJobs from "@/pages/client/MyJobs";
import EditJob from "@/pages/client/EditJob";
import JobApplications from "@/pages/client/JobApplications";
import ClientProfile from "@/pages/client/ClientProfile";

const AppRoutes = () => {
return (
<Routes>
{/* Public routes */}
<Route path="/" element={<Landing />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />

  {/* Protected routes */}
  <Route element={<ProtectedRoute />}>
    {/* Developer dashboard */}
    <Route
      path="/dashboard"
      element={<DeveloperDashboard />}
    />

    {/* Marketplace */}
    <Route
      path="/jobs"
      element={<BrowseJobs />}
    />

    <Route
      path="/jobs/:id"
      element={<JobDetails />}
    />

    <Route
      path="/jobs/:id/apply"
      element={<ApplyJob />}
    />

    {/* Developer applications */}
    <Route
      path="/applications"
      element={<Applications />}
    />

    {/* Developer profile */}
    <Route
      path="/profile"
      element={<MyProfile />}
    />

    {/* Public developer profile */}
    <Route
      path="/developers/:userId"
      element={<DeveloperPublicProfile />}
    />

    {/* Developer settings */}
    <Route
      path="/settings"
      element={<Settings />}
    />

    {/* Client profile */}
    <Route
      path="/client/profile"
      element={<ClientProfile />}
    />
  </Route>

  {/* Client routes */}
  <Route
    element={
      <ProtectedRoute allowedRoles={["client"]} />
    }
  >
    <Route
      path="/client/dashboard"
      element={<ClientDashboard />}
    />

    <Route
      path="/client/jobs/new"
      element={<PostJob />}
    />

    <Route
      path="/client/jobs"
      element={<MyJobs />}
    />

    <Route
      path="/client/jobs/:id/edit"
      element={<EditJob />}
    />

    <Route
      path="/client/jobs/:id/applications"
      element={<JobApplications />}
    />
  </Route>

  {/* Fallback */}
  <Route
    path="*"
    element={<div>404 - Page Not Found</div>}
  />
</Routes>

);
};

export default AppRoutes;