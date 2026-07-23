import React, { useState, useRef } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { MAX_LIMIT, QUERY_KEYS } from "@/utils/constants";
import { useGetUsers } from "@/pages/admin/user-management/hooks";
import { useLanguage } from "@/context/LanguageContext";

// Import sub-components
import ComplaintDetailHeader from "./ComplaintDetailHeader";
import ComplaintClassificationSection from "./ComplaintClassificationSection";
import ComplaintComplainantSection from "./ComplaintComplainantSection";
import ComplaintLocationSection from "./ComplaintLocationSection";
import ComplaintEvidenceSection from "./ComplaintEvidenceSection";
import ComplaintActionSection from "./ComplaintActionSection";
import useGetFileSize from "@/hooks/query/useGetFileSize";
// import { useAuth } from "@/context/AuthContext";

export default function ComplaintDetailView({
  selected,
  statusUpdate,
  setStatusUpdate,
  isCCE = false,
}) {
  const { t } = useLanguage();
  const selectedId = selected?._id || selected?.id;
  const [selectedFiles, setSelectedFiles] = useState([]); // array of { file, preview }
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  // const {profiledata} = useAuth();

  const officerQuery = useGetComplaintByIdForOfficer(selectedId, {
    enabled: !!selectedId && !isCCE,
  });

  const cceQuery = useGetComplaintById(selectedId, {
    enabled: !!selectedId && isCCE,
  });

  const { data, isLoading, error } = isCCE ? cceQuery : officerQuery;

  const { data: fileSizeData } = useGetFileSize();
  
  const maxMbAllowed = fileSizeData?.data?.fieldVisitMaxUploadSizeMB ?? 0;
  const MAX_FILE_SIZE = maxMbAllowed * 1024 * 1024;
  const postMutation = useMutation({
    mutationFn: uploadGeotaggedImage,
    onSuccess: () => {
      getSuccessToast(t("Geo-tagged photo uploaded successfully", "जियो-टैग फोटो सफलतापूर्वक अपलोड की गई"));
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
      getSuccessToast(t("Officer assigned/transferred successfully", "अधिकारी सफलतापूर्वक नियुक्त/स्थानांतरित किया गया"));
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
      getSuccessToast(`${t("Status updated to", "स्थिति को अपडेट किया गया")} ${variables.status} ${t("successfully", "सफलतापूर्वक")}`);
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
        `${t("Priority updated to", "प्राथमिकता को अपडेट किया गया")} ${variables.assignedPriority} ${t("successfully", "सफलतापूर्वक")}`,
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

  const { data: usersData, isLoading :  userLoading} = useGetUsers(
    [
      "cce-officer-list",
      `subServices_${data?.data?.classification?.subService?._id}`,
    ],
    {
      page: 1,
      limit: MAX_LIMIT,
      subServices: data?.data?.classification?.subService?._id,
    },
    isCCE && !!data?.data?.classification?.subService?._id,
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
console.log({MAX_FILE_SIZE, maxMbAllowed})

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;
    // Validate that each file is within MAX_FILE_SIZE
    const oversizedFiles = selectedFiles.filter((item) => item.file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      getErrorToast(
        t(
          `File(s) exceed the ${maxMbAllowed} MB limit`,
          `फ़ाइल(ओं) का आकार ${maxMbAllowed} MB की सीमा से अधिक है`
        )
      );
      return;
    }

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
      <div className="lg:col-span-2 bg-card rounded-xl border border-border p-8 text-center text-muted-foreground text-sm">
        {t("Select a complaint from the list to view details.", "विवरण देखने के लिए सूची से एक शिकायत का चयन करें।")}
      </div>
    );
  }

  const detail = data?.data || data;
  const c = detail || selected;

  const displayId = c.grievanceId || c.id || "-";
  const displayStatus = c.status || "OPEN";
  const displayPriority = c.assignedPriority || c.priority || "NORMAL";

  const serviceText =
    c.classification?.subService?.service?.title || c.serviceName || "-";
  const subServiceText =
    c.classification?.subService?.title || c.subserviceName || "-";
  const departmentText =
    c.classification?.subService?.service?.department?.title ||  c.classification?.subService?.service?.department || "-";
  const subjectText = (c.classification?.subject || "").trim() || "-";

  const formattedDate =
    c.createdAt || c.createdDate
      ? new Date(c.createdAt || c.createdDate).toLocaleDateString("en-IN")
      : "-";
  const occurrenceDate = c.evidence?.occurrenceDate
    ? new Date(c.evidence.occurrenceDate).toLocaleDateString("en-IN")
    : "-";

  const citizenName = c.citizenInfo?.fullName || c.citizenName || "-";
  const mobileNumber = c.citizenInfo?.mobile || c.mobile || "-";
  const emailAddress = c.citizenInfo?.email || "-";
  const preferredLanguage = c.citizenInfo?.preferredLanguage || "-";

  const addressState = c.address?.state || "-";
  const addressDistrict = c.address?.district?.name || c.address?.district || c.districtName || "-";
  const addressSubdivision = c.address?.subdivision || "-";
  const addressVillageOrWard = c.address?.villageOrWard || c.ward || "-";
  const addressPinCode = c.address?.pinCode || "-";
  const addressLandmark = c.address?.landmark || "-";

  const description = c.evidence?.details || c.description || "-";
  const attachments = c.evidence?.attachments || [];
  const geotaggedImages = c.geotaggedImages || [];

  const fieldVisit = Array.isArray(c?.fieldVisits) ? c.fieldVisits?.[0] : (c?.fieldVisits || {});

  return (
    <div className="md:col-span-2 space-y-4">
      <LoaderErrWrapper isLoading={isLoading} error={error?.message || error}>
        <div className="bg-card rounded-xl border border-border p-3 lg:p-5 space-y-4 lg:space-y-5">
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
            userLoading={userLoading}
            assignOfficerMutation={assignOfficerMutation}
            selectedId={selectedId}
          />


          {/* Classification details */}
          <ComplaintClassificationSection
            departmentText={departmentText}
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
            subjectText={subjectText}
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
            currentStatus={displayStatus}
            currentPriority={displayPriority}
            fieldVisit={fieldVisit}
            geotaggedImages={geotaggedImages}
            maxMbAllowed={maxMbAllowed}
          />
        </div>

        {/* Timeline */}
        <div className="bg-card rounded-xl border border-border p-3 lg:p-5">
          <h3 className="font-bold text-foreground text-xs lg:text-sm mb-3 lg:mb-4">{t("Complaint Timeline", "शिकायत समयरेखा")}</h3>
          <ComplaintTimeline events={c.timeline || []} />
        </div>
      </LoaderErrWrapper>
    </div>
  );
}
