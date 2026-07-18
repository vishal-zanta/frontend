import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
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
import ShiftManagement from "./pages/crm/shift-management";
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
import { PERMISSIONS } from "./utils/constants";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

const RootLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
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
        element: <Navigate to={"/"} replace />,
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
                element: (
                  <PermissionChecker permission={PERMISSIONS.OFFICER_DASHBOARD}>
                    <OfficerDashboard />
                  </PermissionChecker>
                ),
              },
              {
                path: "complaints",
                element: (
                  <PermissionChecker permission={PERMISSIONS.MY_COMPLAINTS}>
                    <OfficerComplaints />
                  </PermissionChecker>
                ),
              },
              {
                path: "field-visits",
                element: (
                  <PermissionChecker permission={PERMISSIONS.FIELD_VISITS}>
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
                element: (
                  <PermissionChecker permission={PERMISSIONS.CCE_DASHBOARD}>
                    <CRMDashboard />
                  </PermissionChecker>
                ),
              },
              {
                path: "raise",
                element: (
                  <PermissionChecker permission={PERMISSIONS.RAISE_COMPLAINTS}>
                    <CRMRaiseComplaint />
                  </PermissionChecker>
                ),
              },
              {
                path: "calls",
                element: (
                  <PermissionChecker permission={PERMISSIONS.CALL_TRACKER}>
                    <CallTracker />
                  </PermissionChecker>
                ),
              },
              {
                path: "shift",
                element: (
                  <PermissionChecker permission={PERMISSIONS.SHIFT_AGENT}>
                    <ShiftManagement />
                  </PermissionChecker>
                ),
              },
              {
                path: "incoming-call",
                element: (
                  <PermissionChecker permission={PERMISSIONS.INCOMING_CALL}>
                    <IncomingCall />
                  </PermissionChecker>
                ),
              },
              {
                path: "history",
                element: (
                  <PermissionChecker permission={PERMISSIONS.CALL_HISTORY_LOG}>
                    <CallHistoryLog />
                  </PermissionChecker>
                ),
              },
              {
                path: "track-complaint",
                element: (
                  <PermissionChecker permission={PERMISSIONS.TRACK_COMPLAINTS}>
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
                element: (
                  <PermissionChecker permission={PERMISSIONS.ADMIN_DASHBOARD}>
                    <AdminDashboard />
                  </PermissionChecker>
                ),
              },
              {
                path: "operational",
                element: (
                  <PermissionChecker
                    permission={PERMISSIONS.OPERATIONAL_DASHBOARD}
                  >
                    <OperationalDashboards />
                  </PermissionChecker>
                ),
              },
              {
                path: "ai-reports",
                element: (
                  <PermissionChecker permission={PERMISSIONS.AI_REPORTS}>
                    <AIReports />
                  </PermissionChecker>
                ),
              },
              {
                path: "performance",
                element: (
                  <PermissionChecker
                    permission={PERMISSIONS.PERFORMANCE_DASHBOARD}
                  >
                    <PerformanceDashboard />
                  </PermissionChecker>
                ),
              },
              {
                path: "mis",
                element: (
                  <PermissionChecker permission={PERMISSIONS.MIS_REPORTS}>
                    <MISReports />
                  </PermissionChecker>
                ),
              },
              {
                path: "workflow",
                element: (
                  <PermissionChecker
                    permission={PERMISSIONS.WORKFLOW_MANAGEMENT}
                  >
                    <WorkflowConfig />
                  </PermissionChecker>
                ),
              },
              {
                path: "sla",
                element: (
                  <PermissionChecker permission={PERMISSIONS.SLA_CONFIGURATION}>
                    <SLAConfig />
                  </PermissionChecker>
                ),
              },
              {
                path: "officer-tagging",
                element: (
                  <PermissionChecker permission={PERMISSIONS.OFFICER_TAGGING}>
                    <OfficerTagging />
                  </PermissionChecker>
                ),
              },
              {
                path: "master-data",
                element: (
                  <PermissionChecker permission={PERMISSIONS.MASTER_DATA}>
                    <MasterData />
                  </PermissionChecker>
                ),
              },
              {
                path: "users",
                element: (
                  <PermissionChecker permission={PERMISSIONS.USER_MANAGEMENT}>
                    <UserManagement />
                  </PermissionChecker>
                ),
              },
              {
                path: "manage-links",
                element: (
                  <PermissionChecker permission={PERMISSIONS.MANAGE_LINKS}>
                    <ManageLinks />
                  </PermissionChecker>
                ),
              },
              {
                path: "audit",
                element: (
                  <PermissionChecker permission={PERMISSIONS.AUDIT_TRAIL}>
                    <AuditTrail />
                  </PermissionChecker>
                ),
              },
              {
                path: "call-history",
                element: (
                  <PermissionChecker permission={PERMISSIONS.CALL_HISTORY}>
                    <AdminCallHistory />
                  </PermissionChecker>
                ),
              },
              {
                path: "officers",
                element: (
                  <PermissionChecker permission={PERMISSIONS.MANAGE_OFFICERS}>
                    <ManageOfficers />
                  </PermissionChecker>
                ),
              },
              {
                path: "agents",
                element: (
                  <PermissionChecker permission={PERMISSIONS.MANAGE_AGENTS}>
                    <ManageAgents />
                  </PermissionChecker>
                ),
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
          {/* <Toaster /> */}
          <SonnerToaster richColors position="top-center" />
        </QueryClientProvider>
      </GoogleReCaptchaProvider>
    </AuthProvider>
  );
}

export default App;
