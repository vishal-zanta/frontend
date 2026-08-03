import React, { useState, useRef, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
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
      `subdivisions_${data?.data?.address?.subdivision}`
    ],
    {
      page: 1,
      limit: MAX_LIMIT,
      subServices: data?.data?.classification?.subService?._id,
      wards : data?.data?.address?.subdivision
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
// console.log({MAX_FILE_SIZE, maxMbAllowed})

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
  useEffect(()=>{
  window.scrollTo({top: 0, behavior : "instant"});
},[])

  if (!selected) {
    return (
      <div className="lg:col-span-2 bg-card rounded-xl border border-border p-8 text-center text-muted-foreground text-sm">
        {t("Select a complaint from the list to view details.", "विवरण देखने के लिए सूची से एक शिकायत का चयन करें।")}
      </div>
    );
  }

  const detail = data?.data || data;
  const c = detail || selected;

  const displayId = c.grievanceId || c.id || "N/A";
  const displayStatus = c.status || "OPEN";
  const displayPriority = c.assignedPriority || c.priority || "NORMAL";

  const serviceText =
    c.classification?.subService?.service?.title || c.serviceName || "N/A";
  const subServiceText =
    c.classification?.subService?.title || c.subserviceName || "N/A";
    
  const departmentText =
    c.classification?.subService?.service?.department?.title ||  c.classification?.subService?.service?.department || "N/A";
  const subjectText = (c.classification?.subject || "").trim() || "N/A";

  const formattedDate =
    c.createdAt || c.createdDate
      ? new Date(c.createdAt || c.createdDate).toLocaleDateString("en-IN")
      : "N/A";
  const occurrenceDate = c.evidence?.occurrenceDate
    ? new Date(c.evidence.occurrenceDate).toLocaleDateString("en-IN")
    : "N/A";

  const citizenName = c.citizenInfo?.fullName || c.citizenName || "N/A";
  const mobileNumber = c.citizenInfo?.mobile || c.mobile || "N/A";
  const emailAddress = c.citizenInfo?.email || "N/A";
  const preferredLanguage = c.citizenInfo?.preferredLanguage || "N/A";

  const addressState = c.address?.state || "N/A";
  const addressDistrict = c.address?.district?.name || c.address?.district || c.districtName || "N/A";
  const addressSubdivision = c.address?.subdivision || "N/A";
  const addressVillageOrWard = c.address?.villageOrWard || c.ward || "N/A";
  const addressPinCode = c.address?.pinCode || "N/A";
  const addressLandmark = c.address?.landmark || "N/A";

  const description = c.evidence?.details || c.description || "N/A";
  const attachments = c.evidence?.attachments || [];
  const geotaggedImages = c.geotaggedImages || [];

  const fieldVisit = Array.isArray(c?.fieldVisits) ? c.fieldVisits?.[0] : (c?.fieldVisits || {});

  return (
    <div className="md:col-span-2 space-y-4">
      <LoaderErrWrapper
        isLoading={isLoading}
        error={error?.message || error}
        customLoader={<ComplaintViewShimmer />}
      >
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
            resolvedReason={c.status === "RESOLVED" ? c?.resolvedReason : null}
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


export const ComplaintViewShimmer = () => {
  return (
    <div className="md:col-span-2 space-y-4">
      {/* Main Details Card Shimmer */}
      <div className="bg-card rounded-xl border border-border p-3 lg:p-5 space-y-4 lg:space-y-5">
        {/* Header Section Shimmer */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-border pb-3">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 lg:gap-2 flex-wrap">
              <Skeleton className="h-6 w-32 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-56 lg:w-72" />
            <div className="flex items-center gap-2 pt-0.5">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-5 w-28 rounded-md" />
              <Skeleton className="h-5 w-28 rounded-md" />
            </div>
          </div>
          <div className="w-full sm:w-44 lg:w-56 shrink-0 space-y-1.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-4 w-36 rounded-full" />
          </div>
        </div>

        {/* Classification Section Shimmer */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-3 bg-muted/20 p-2.5 lg:p-3 rounded-lg border border-border">
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center justify-end">
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>

        {/* Complainant Section Shimmer */}
        <div className="bg-muted/30 rounded-lg p-2.5 lg:p-3 border border-border space-y-2.5">
          <Skeleton className="h-3 w-36" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-3">
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>

        {/* Location & Address Shimmer */}
        <div className="bg-muted/30 rounded-lg p-2.5 lg:p-3 border border-border space-y-2.5">
          <Skeleton className="h-3 w-32" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-3">
            <div className="space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>

        {/* Evidence Details & Description Shimmer */}
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-2.5 lg:p-3 space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="bg-muted/50 rounded-lg p-2.5 lg:p-3 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        {/* Action Section Shimmer */}
        <div className="space-y-4 pt-2">
          <div className="border-t border-border pt-4 space-y-2">
            <Skeleton className="h-3 w-24" />
            <div className="flex gap-2 items-center">
              <Skeleton className="h-9 w-48 rounded-lg" />
              <Skeleton className="h-9 w-16 rounded-lg" />
            </div>
          </div>
          <div className="border-t border-border pt-4 space-y-2">
            <Skeleton className="h-3 w-24" />
            <div className="flex gap-2 items-center">
              <Skeleton className="h-9 w-48 rounded-lg" />
              <Skeleton className="h-9 w-16 rounded-lg" />
            </div>
          </div>
          <div className="border-t border-border pt-4 mt-4 space-y-2">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        </div>
      </div>

      {/* Timeline Card Shimmer */}
      <div className="bg-card rounded-xl border border-border p-3 lg:p-5">
        <Skeleton className="h-4 w-36 mb-3 lg:mb-4" />
        <div className="relative pl-8 space-y-6">
          <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border" />
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-muted border-2 border-border" />
              <div className="bg-card border border-border rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};