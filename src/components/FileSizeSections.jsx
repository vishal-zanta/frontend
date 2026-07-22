import React, { useState, useEffect } from "react";
import { useAuth } from '@/context/AuthContext';
import { PERMISSIONS, QUERY_KEYS } from '@/utils/constants';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useGetFileSize from "@/hooks/query/useGetFileSize";
import instance from "@/lib/axios";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorToast, getSuccessToast, isValidNumber } from "@/utils/helpers";
import { Save, FileUp } from "lucide-react";

const FileSizeSections = () => {
  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useGetFileSize();

  // Log data of useQuery as requested
  console.log("Config Query Data in FileSizeSections:", data?.data);

  const defaultMaxUploadSizeMB = data?.data?.defaultMaxUploadSizeMB || 10;

  const [grievanceSize, setGrievanceSize] = useState("");
  const [fieldVisitSize, setFieldVisitSize] = useState("");
  const [chatSize, setChatSize] = useState("");

  useEffect(() => {
    if (data) {
      const configObj = data?.data;
      setGrievanceSize(configObj?.grievanceMaxUploadSizeMB ?? "");
      setFieldVisitSize(configObj?.fieldVisitMaxUploadSizeMB ?? "");
      setChatSize(configObj?.chatMaxUploadSizeMB ?? "");
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      return instance.put("/config", payload).then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONFIG] });
      getSuccessToast("File size configuration updated successfully!");
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  if (!hasPermission(PERMISSIONS.FILE_MANAGEMENT)) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      grievanceMaxUploadSizeMB: Number(grievanceSize),
      fieldVisitMaxUploadSizeMB: Number(fieldVisitSize),
      chatMaxUploadSizeMB: Number(chatSize),
    });
  };

  return (
    <div className="bg-white dark:bg-card rounded-xl border border-border p-6 w-full">
      <div className="flex items-center gap-2 mb-6">
        <FileUp className="w-5 h-5 text-blue-500" />
        <div>
          <h3 className="font-bold text-foreground">File Size Limits</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure individual upload limits across different modules (Max {defaultMaxUploadSizeMB} MB per input)
          </p>
        </div>
      </div>

      <LoaderErrWrapper isLoading={isLoading} error={error}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="grievanceSize">Citizen Attachment Max Upload Size (MB) <span className="text-red-500">*</span></Label>
              <Input
                id="grievanceSize"
                type="text"
                required
                value={grievanceSize}
                onChange={(e) => {
                  const val = e.target.value;
                  if (isValidNumber(val, 1, defaultMaxUploadSizeMB || 10)) {
                    setGrievanceSize(val);
                  }
                  else{
                    getErrorToast(`Allowed size between 1 to ${defaultMaxUploadSizeMB} MB`)
                  }
                }}
                placeholder={`e.g. ${defaultMaxUploadSizeMB}`}
                className="bg-white dark:bg-zinc-950 text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fieldVisitSize">Field Visit Max Upload Size (MB) <span className="text-red-500">*</span></Label>
              <Input
                id="fieldVisitSize"
                type="text"
                required
                value={fieldVisitSize}
                onChange={(e) => {
                  const val = e.target.value;
                  if (isValidNumber(val, 1, defaultMaxUploadSizeMB || 10)) {
                    setFieldVisitSize(val);
                  }
                   else{
                    getErrorToast(`Allowed size between 1 to ${defaultMaxUploadSizeMB} MB`)
                  }
                }}
                placeholder={`e.g. ${defaultMaxUploadSizeMB}`}
                className="bg-white dark:bg-zinc-950 text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="chatSize">Chat Max Upload Size (MB) <span className="text-red-500">*</span></Label>
              <Input
                id="chatSize"
                type="text"
                required
                value={chatSize}
                onChange={(e) => {
                  const val = e.target.value;
                  if (isValidNumber(val, 1, defaultMaxUploadSizeMB || 10)) {
                    setChatSize(val);
                  }
                   else{
                    getErrorToast(`Allowed size between 1 to ${defaultMaxUploadSizeMB} MB`)
                  }
                }}
                placeholder={`e.g. ${defaultMaxUploadSizeMB}`}
                className="bg-white dark:bg-zinc-950 text-foreground"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-border mt-4">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={mutation.isPending}
            >
              <Save className="w-4 h-4 mr-1.5" />
              {mutation.isPending ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </LoaderErrWrapper>
    </div>
  );
};

export default FileSizeSections;