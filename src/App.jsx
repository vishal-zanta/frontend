import { Toaster } from "@/components/ui/toaster";
import { Toaster as HotToaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "./api/auth.api";
import FullScreenLoader from "./components/FullScreenLoader";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider } from "@/lib/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
// Page imports
import PortalHome from "./pages/PortalHome";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import RaiseComplaint from "./pages/citizen/RaiseComplaint";
import TrackComplaint from "./pages/citizen/TrackComplaint";
import OfficerDashboard from "./pages/officer/officer-dashboard";
import OfficerComplaints from "./pages/officer/officer-complaints";
import CRMDashboard from "./pages/crm/CRMDashboard";
import CRMRaiseComplaint from "./pages/crm/raise-ccm-complaint";
import CallTracker from "./pages/crm/CallTracker";
import ShiftManagement from "./pages/crm/ShiftManagement";
import IncomingCall from "./pages/crm/IncomingCall";
import CallHistoryLog from "./pages/crm/CallHistoryLog";
import TrackCCMComplaint from "./pages/crm/track-ccm-complaint";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OperationalDashboards from "./pages/admin/OperationalDashboards";
import AIReports from "./pages/admin/AIReports";
import PerformanceDashboard from "./pages/admin/PerformanceDashboard";
import MISReports from "./pages/admin/MISReports";
import WorkflowConfig from "./pages/admin/workflow-levels";
import SLAConfig from "./pages/admin/sla-config";
import OfficerTagging from "./pages/admin/officer-tagging";
import MasterData from "./pages/admin/master-data";
import UserManagement from "./pages/admin/user-management";
import ManageLinks from "./pages/admin/ManageLinks";
import AuditTrail from "./pages/admin/AuditTrail";
import AdminCallHistory from "./pages/admin/AdminCallHistory";
import ManageOfficers from "./pages/admin/ManageOfficers";
import ManageAgents from "./pages/admin/ManageAgents";
import OfficerSettings from "./pages/officer/OfficerSettings";
import CRMSettings from "./pages/crm/CRMSettings";
import FieldVisits from "./pages/officer/field-visits";
import CitizenFeedback from "./pages/citizen/CitizenFeedback";
import CitizenSettings from "./pages/citizen/CitizenSettings";
import Login from "./pages/Login";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const RootLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
};

const AdminProtectedRoute = ({ children }) => {
  const token =
    localStorage.getItem("usertoken") || sessionStorage.getItem("usertoken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["auth-profile"],
    queryFn: getProfile,
    retry: false,
  });

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (error || !data) {
    localStorage.removeItem("usertoken");
    sessionStorage.removeItem("usertoken");

    return <Navigate to="/login" replace state={{ redirect: false }} />;
  }

  return children;
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <PortalHome />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        element: (
          <AdminProtectedRoute>
            <Outlet />
          </AdminProtectedRoute>
        ),
        children: [
          {
            path: "officer",
            children: [
              {
                path: "",
                element: <OfficerDashboard />,
              },
              {
                path: "complaints",
                element: <OfficerComplaints />,
              },
              {
                path: "field-visits",
                element: <FieldVisits />,
              },
              {
                path: "settings",
                element: <OfficerSettings />,
              },
            ],
          },
          {
            path: "crm",
            children: [
              {
                path: "",
                element: <CRMDashboard />,
              },
              {
                path: "raise",
                element: <CRMRaiseComplaint />,
              },
              {
                path: "calls",
                element: <CallTracker />,
              },
              {
                path: "shift",
                element: <ShiftManagement />,
              },
              {
                path: "incoming-call",
                element: <IncomingCall />,
              },
              {
                path: "history",
                element: <CallHistoryLog />,
              },
              {
                path: "track-complaint",
                element: <TrackCCMComplaint />,
              },
              {
                path: "settings",
                element: <CRMSettings />,
              },
            ],
          },
          {
            path: "admin",
            children: [
              {
                path: "",
                element: <AdminDashboard />,
              },
              {
                path: "operational",
                element: <OperationalDashboards />,
              },
              {
                path: "ai-reports",
                element: <AIReports />,
              },
              {
                path: "performance",
                element: <PerformanceDashboard />,
              },
              {
                path: "mis",
                element: <MISReports />,
              },
              {
                path: "workflow",
                element: <WorkflowConfig />,
              },
              {
                path: "sla",
                element: <SLAConfig />,
              },
              {
                path: "officer-tagging",
                element: <OfficerTagging />,
              },
              {
                path: "master-data",
                element: <MasterData />,
              },
              {
                path: "users",
                element: <UserManagement />,
              },
              {
                path: "manage-links",
                element: <ManageLinks />,
              },
              {
                path: "audit",
                element: <AuditTrail />,
              },
              {
                path: "call-history",
                element: <AdminCallHistory />,
              },
              {
                path: "officers",
                element: <ManageOfficers />,
              },
              {
                path: "agents",
                element: <ManageAgents />,
              },
            ],
          },
        ],
      },

      {
        path: "citizen",
        children: [
          {
            path: "",
            element: <CitizenDashboard />,
          },
          {
            path: "raise",
            element: <RaiseComplaint role="citizen" />,
          },
          {
            path: "track",
            element: <TrackComplaint role="citizen" />,
          },
          {
            path: "feedback",
            element: <CitizenFeedback />,
          },
          {
            path: "settings",
            element: <CitizenSettings />,
          },
        ],
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_SITE_KEY}>
        <QueryClientProvider client={queryClientInstance}>
          <RouterProvider router={router} />
          <Toaster />
          <HotToaster />
        </QueryClientProvider>
      </GoogleReCaptchaProvider>
    </AuthProvider>
  );
}

export default App;
