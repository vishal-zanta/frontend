import React, { useState, useRef } from "react";
import ComplaintTimeline from "@/components/ComplaintTimeline";
import {
  useGetComplaintById,
  useGetComplaintByIdForOfficer,
} from "@/hooks/query/useGetComplaints";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  uploadGeotaggedImage,
  assignOfficer,
  updateComplaintStatus,
  updateComplaintPriority,
} from "@/api/complaint.api";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import { QUERY_KEYS } from "@/utils/constants";
import { useGetUsers } from "@/pages/admin/user-management/hooks";

// Import sub-components
import ComplaintDetailHeader from "./ComplaintDetailHeader";
import ComplaintClassificationSection from "./ComplaintClassificationSection";
import ComplaintComplainantSection from "./ComplaintComplainantSection";
import ComplaintLocationSection from "./ComplaintLocationSection";
import ComplaintEvidenceSection from "./ComplaintEvidenceSection";
import ComplaintActionSection from "./ComplaintActionSection";

export default function ComplaintDetailView({
  selected,
  statusUpdate,
  setStatusUpdate,
  isCCE = false,
}) {
  const selectedId = selected?._id || selected?.id;
  const [selectedFiles, setSelectedFiles] = useState([]); // array of { file, preview }
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const officerQuery = useGetComplaintByIdForOfficer(selectedId, {
    enabled: !!selectedId && !isCCE,
  });

  const cceQuery = useGetComplaintById(selectedId, {
    enabled: !!selectedId && isCCE,
  });

  const { data, isLoading, error } = isCCE ? cceQuery : officerQuery;

  const postMutation = useMutation({
    mutationFn: uploadGeotaggedImage,
    onSuccess: () => {
      getSuccessToast("Geo-tagged photo uploaded successfully");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPLAINT_DETAIL],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPLAINT_DETAIL_OFFICER],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPLAINTS_OFFICER],
      });
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const assignOfficerMutation = useMutation({
    mutationFn: assignOfficer,
    onSuccess: () => {
      getSuccessToast("Officer assigned/transferred successfully");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPLAINT_DETAIL],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPLAINT_DETAIL_OFFICER],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPLAINTS_OFFICER],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPLAINTS_ALL] });
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateComplaintStatus,
    onSuccess: (updatedData, variables) => {
      getSuccessToast(`Status updated to ${variables.status} successfully`);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPLAINT_DETAIL],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPLAINT_DETAIL_OFFICER],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPLAINTS_OFFICER],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPLAINTS_ALL] });
      setStatusUpdate(variables.status);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const updatePriorityMutation = useMutation({
    mutationFn: updateComplaintPriority,
    onSuccess: (updatedData, variables) => {
      getSuccessToast(
        `Priority updated to ${variables.assignedPriority} successfully`,
      );
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPLAINT_DETAIL],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPLAINT_DETAIL_OFFICER],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPLAINTS_OFFICER],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPLAINTS_ALL] });
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const { data: usersData } = useGetUsers(
    [
      "cce-officer-list",
      `subService_${data?.data?.classification?.subService?._id}`,
    ],
    {
      page: 1,
      limit: 100,
      subService: data?.data?.classification?.subService?._id,
    },
    isCCE,
  );
  const userOptions = (
    usersData?.data?.data?.docs ||
    usersData?.data?.docs ||
    usersData?.docs ||
    []
  ).map((u) => ({
    label: u.name,
    value: u._id,
  }));

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFiles((prev) => [...prev, { file, preview: reader.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;
    const formData = new FormData();
    selectedFiles.forEach((item) => {
      formData.append("files", item.file);
    });
    postMutation.mutate({ id: selectedId, formData });
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!selected) {
    return (
      <div className="lg:col-span-2 bg-white rounded-xl border border-border p-8 text-center text-muted-foreground text-sm">
        Select a complaint from the list to view details.
      </div>
    );
  }

  const detail = data?.data || data;
  const c = detail || selected;

  const displayId = c.grievanceId || c.id || "—";
  const displayStatus = c.status || "OPEN";
  const displayPriority = c.assignedPriority || c.priority || "NORMAL";

  const serviceText =
    c.classification?.subService?.service?.title || c.serviceName || "—";
  const subServiceText =
    c.classification?.subService?.title || c.subserviceName || "—";
  const departmentText =
    c.classification?.subService?.service?.department || "—";
  const subjectText = c.classification?.subject || "—";

  const formattedDate =
    c.createdAt || c.createdDate
      ? new Date(c.createdAt || c.createdDate).toLocaleDateString("en-IN")
      : "—";
  const occurrenceDate = c.evidence?.occurrenceDate
    ? new Date(c.evidence.occurrenceDate).toLocaleDateString("en-IN")
    : "—";

  const citizenName = c.citizenInfo?.fullName || c.citizenName || "—";
  const mobileNumber = c.citizenInfo?.mobile || c.mobile || "—";
  const emailAddress = c.citizenInfo?.email || "—";
  const preferredLanguage = c.citizenInfo?.preferredLanguage || "—";

  const addressState = c.address?.state || "—";
  const addressDistrict = c.address?.district || c.districtName || "—";
  const addressSubdivision = c.address?.subdivision || "—";
  const addressVillageOrWard = c.address?.villageOrWard || c.ward || "—";
  const addressPinCode = c.address?.pinCode || "—";
  const addressLandmark = c.address?.landmark || "—";

  const description = c.evidence?.details || c.description || "—";
  const attachments = c.evidence?.attachments || [];
  const geotaggedImages = c.geotaggedImages || [];

  return (
    <div className="lg:col-span-2 space-y-4">
      <LoaderErrWrapper isLoading={isLoading} error={error?.message || error}>
        <div className="bg-white rounded-xl border border-border p-5 space-y-5">
          {/* Header Section */}
          <ComplaintDetailHeader
            c={c}
            displayId={displayId}
            displayStatus={displayStatus}
            displayPriority={displayPriority}
            serviceText={serviceText}
            subServiceText={subServiceText}
            isCCE={isCCE}
            formattedDate={formattedDate}
            userOptions={userOptions}
            assignOfficerMutation={assignOfficerMutation}
            selectedId={selectedId}
          />

          {/* Classification details */}
          <ComplaintClassificationSection
            departmentText={departmentText}
            subjectText={subjectText}
            occurrenceDate={occurrenceDate}
          />

          {/* Citizen Details */}
          <ComplaintComplainantSection
            citizenName={citizenName}
            mobileNumber={mobileNumber}
            emailAddress={emailAddress}
            preferredLanguage={preferredLanguage}
          />

          {/* Location details */}
          <ComplaintLocationSection
            addressVillageOrWard={addressVillageOrWard}
            addressSubdivision={addressSubdivision}
            addressDistrict={addressDistrict}
            addressState={addressState}
            addressLandmark={addressLandmark}
            addressPinCode={addressPinCode}
          />

          {/* Evidence Details, Description, and Attachments */}
          <ComplaintEvidenceSection
            description={description}
            attachments={attachments}
            geotaggedImages={geotaggedImages}
          />

          {/* Actions (Status change, Priority change, Geotag upload) */}
          <ComplaintActionSection
            isCCE={isCCE}
            selectedId={selectedId}
            statusUpdate={statusUpdate}
            updateStatusMutation={updateStatusMutation}
            updatePriorityMutation={updatePriorityMutation}
            selectedFiles={selectedFiles}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
            handleUpload={handleUpload}
            removeFile={removeFile}
            postMutation={postMutation}
          />
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4">Complaint Timeline</h3>
          <ComplaintTimeline events={c.timeline || []} />
        </div>
      </LoaderErrWrapper>
    </div>
  );
}
