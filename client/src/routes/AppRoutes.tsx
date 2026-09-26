import { Route, Routes } from "react-router-dom";


import Landing from "@/pages/Landing";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import ProtectedRoute from "@/routes/ProtectedRoute";


// Developer
import DeveloperDashboard from "@/pages/developer/DeveloperDashboard";
import BrowseJobs from "@/pages/developer/BrowseJobs";
import Applications from "@/pages/developer/Applications";
import MyProfile from "@/pages/developer/MyProfile";
import Settings from "@/pages/developer/Settings";
import DeveloperPublicProfile from "@/pages/developer/DeveloperPublicProfile";
import JobRecommendations from "@/pages/developer/JobRecommendations";

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
import JobMatches from "@/pages/client/JobMatches";

import ClientPublicProfile from "@/pages/client/ClientPublicProfile";


import ResumeBuilder from "@/pages/developer/ResumeBuilder";

const AppRoutes = () => {
return (
<Routes>
{/* Public routes */}
<Route path="/" element={<Landing />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
    <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

<Route
  path="/clients/:userId"
  element={<ClientPublicProfile />}
/>

  {/* Protected routes */}
  <Route element={<ProtectedRoute />}>
    {/* Developer dashboard */}
    <Route
      path="/dashboard"
      element={<DeveloperDashboard />}
    />
    <Route
  path="/reset-password/:token"
  element={<ResetPassword />}
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
<Route
  path="/developer/jobs/recommendations"
  element={<JobRecommendations />}
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

     <Route
     path="/resume"
     element={<ResumeBuilder />}
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
    <Route
  path="/client/jobs/:id/matches"
  element={<JobMatches />}
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
