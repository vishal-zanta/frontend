import { Toaster } from "@/components/ui/toaster";
import { Toaster as HotToaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useRouteError,
  useNavigate,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "./api/auth.api";
import FullScreenLoader from "./components/FullScreenLoader";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider } from "@/lib/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
// Page imports
import PortalHome from "./pages/PortalHome";
import OfficerDashboard from "./pages/officer/officer-dashboard";
import OfficerComplaints from "./pages/officer/officer-complaints";
import CRMDashboard from "./pages/crm/CRMDashboard";
import CRMRaiseComplaint from "./pages/crm/raise-ccm-complaint";
import CallTracker from "./pages/crm/CallTracker";
import ShiftManagement from "./pages/crm/ShiftManagement";
import IncomingCall from "./pages/crm/IncomingCall";
import CallHistoryLog from "./pages/crm/CallHistoryLog";
import TrackCCMComplaint from "./pages/crm/track-ccm-complaint";
import AdminDashboard from "./pages/admin/dashboard";
import OperationalDashboards from "./pages/admin/operational-dashboard";
import AIReports from "./pages/admin/AIReports";
import PerformanceDashboard from "./pages/admin/PerformanceDashboard";
import MISReports from "./pages/admin/mis";
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
import Login from "./pages/Login";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import ErrorPage from "./components/ErrorPage";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import PermissionChecker from "./components/PermissionChecker";
import NotAuthorized from "./pages/NotAuthorized";

const RootLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
};

const AdminProtectedRoute = ({ children }) => {
  const {setProfile} = useAuth();
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

  useEffect(()=> {
    if (isLoading || error || !data) return;
    setProfile(data?.data?.data);
    
  },[isLoading, error, data, setProfile])

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

const RouteErrorPage = () => {
  const err = useRouteError();
  const navigate = useNavigate();
  return <ErrorPage error={err} resetErrorBoundary={() => navigate(0)} />;
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
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
        path: "unauthorized",
        element: <NotAuthorized />,
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
                element: (
                  <PermissionChecker permission={["ALL_GRIEVANCE"]}>
                    <OfficerComplaints />
                  </PermissionChecker>
                ),
              },
              {
                path: "field-visits",
                element: (
                  <PermissionChecker permission={["ALL_GRIEVANCE", "UPDATE_GRIEVANCE"]}>
                    <FieldVisits />
                  </PermissionChecker>
                ),
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
                element: (
                  <PermissionChecker permission={["CREATE_GRIEVANCE", "ALL_GRIEVANCE"]}>
                    <CRMRaiseComplaint />
                  </PermissionChecker>
                ),
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
                element: (
                  <PermissionChecker permission={["ALL_GRIEVANCE"]}>
                    <TrackCCMComplaint />
                  </PermissionChecker>
                ),
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
                element: (
                  <PermissionChecker permission={["ALL"]}>
                    <AIReports />
                  </PermissionChecker>
                ),
              },
              {
                path: "performance",
                element: (
                  <PermissionChecker permission={["ALL"]}>
                    <PerformanceDashboard />
                  </PermissionChecker>
                ),
              },
              {
                path: "mis",
                element: (
                  <PermissionChecker permission={["MIS_REPORT"]}>
                    <MISReports />
                  </PermissionChecker>
                ),
              },
              {
                path: "workflow",
                element: (
                  <PermissionChecker permission={["WORKFLOW_MANAGEMENT"]}>
                    <WorkflowConfig />
                  </PermissionChecker>
                ),
              },
              {
                path: "sla",
                element: (
                  <PermissionChecker permission={["SLA_CONFIGURATION"]}>
                    <SLAConfig />
                  </PermissionChecker>
                ),
              },
              {
                path: "officer-tagging",
                element: (
                  <PermissionChecker permission={["OFFICER_TAGGING"]}>
                    <OfficerTagging />
                  </PermissionChecker>
                ),
              },
              {
                path: "master-data",
                element: (
                  <PermissionChecker permission={["ROLE_MANAGEMENT", "OPTION_MANAGEMENT", "SERVICE_MANAGEMENT", "DEMOGRAPHY_MANAGEMENT", "SOURCE_MANAGEMENT"]}>
                    <MasterData />
                  </PermissionChecker>
                ),
              },
              {
                path: "users",
                element: (
                  <PermissionChecker permission={["USER_MANAGEMENT"]}>
                    <UserManagement />
                  </PermissionChecker>
                ),
              },
              {
                path: "manage-links",
                element: (
                  <PermissionChecker permission={["ROLE_MANAGEMENT"]}>
                    <ManageLinks />
                  </PermissionChecker>
                ),
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
