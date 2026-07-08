import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
// Page imports
import PortalHome from './pages/PortalHome';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import RaiseComplaint from './pages/citizen/RaiseComplaint';
import TrackComplaint from './pages/citizen/TrackComplaint';
import OfficerDashboard from './pages/officer/OfficerDashboard';
import OfficerComplaints from './pages/officer/OfficerComplaints';
import CRMDashboard from './pages/crm/CRMDashboard';
import CRMRaiseComplaint from './pages/crm/CRMRaiseComplaint';
import CallTracker from './pages/crm/CallTracker';
import ShiftManagement from './pages/crm/ShiftManagement';
import IncomingCall from './pages/crm/IncomingCall';
import CallHistoryLog from './pages/crm/CallHistoryLog';
import AdminDashboard from './pages/admin/AdminDashboard';
import OperationalDashboards from './pages/admin/OperationalDashboards';
import AIReports from './pages/admin/AIReports';
import PerformanceDashboard from './pages/admin/PerformanceDashboard';
import MISReports from './pages/admin/MISReports';
import WorkflowConfig from './pages/admin/WorkflowConfig';
import SLAConfig from './pages/admin/SLAConfig';
import OfficerTagging from './pages/admin/OfficerTagging';
import MasterData from './pages/admin/MasterData';
import UserManagement from './pages/admin/UserManagement';
import ManageLinks from './pages/admin/ManageLinks';
import AuditTrail from './pages/admin/AuditTrail';
import AdminCallHistory from './pages/admin/AdminCallHistory';
import ManageOfficers from './pages/admin/ManageOfficers';
import ManageAgents from './pages/admin/ManageAgents';
import OfficerSettings from './pages/officer/OfficerSettings';
import CRMSettings from './pages/crm/CRMSettings';
import FieldVisits from './pages/officer/FieldVisits';
import CitizenFeedback from './pages/citizen/CitizenFeedback';
import CitizenSettings from './pages/citizen/CitizenSettings';

const AuthenticatedApp = () => {
  return (
    <Routes>
      <Route path="/" element={<PortalHome />} />
      {/* Citizen Portal */}
      <Route path="/citizen" element={<CitizenDashboard />} />
      <Route path="/citizen/raise" element={<RaiseComplaint role="citizen" />} />
      <Route path="/citizen/track" element={<TrackComplaint role="citizen" />} />
      <Route path="/citizen/feedback" element={<CitizenFeedback />} />
      <Route path="/citizen/settings" element={<CitizenSettings />} />
      {/* Officer Portal */}
      <Route path="/officer" element={<OfficerDashboard />} />
      <Route path="/officer/complaints" element={<OfficerComplaints />} />
      <Route path="/officer/field-visits" element={<FieldVisits />} />
      <Route path="/officer/settings" element={<OfficerSettings />} />
      {/* CRM Portal */}
      <Route path="/crm" element={<CRMDashboard />} />
      <Route path="/crm/raise" element={<CRMRaiseComplaint />} />
      <Route path="/crm/calls" element={<CallTracker />} />
      <Route path="/crm/shift" element={<ShiftManagement />} />
      <Route path="/crm/incoming-call" element={<IncomingCall />} />
      <Route path="/crm/history" element={<CallHistoryLog />} />
      <Route path="/crm/settings" element={<CRMSettings />} />
      {/* Super Admin Portal */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/operational" element={<OperationalDashboards />} />
      <Route path="/admin/ai-reports" element={<AIReports />} />
      <Route path="/admin/performance" element={<PerformanceDashboard />} />
      <Route path="/admin/mis" element={<MISReports />} />
      <Route path="/admin/workflow" element={<WorkflowConfig />} />
      <Route path="/admin/sla" element={<SLAConfig />} />
      <Route path="/admin/officer-tagging" element={<OfficerTagging />} />
      <Route path="/admin/master-data" element={<MasterData />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/manage-links" element={<ManageLinks />} />
      <Route path="/admin/audit" element={<AuditTrail />} />
      <Route path="/admin/call-history" element={<AdminCallHistory />} />
      <Route path="/admin/officers" element={<ManageOfficers />} />
      <Route path="/admin/agents" element={<ManageAgents />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App