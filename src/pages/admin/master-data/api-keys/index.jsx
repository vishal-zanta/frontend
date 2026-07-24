import React, { useState, useEffect } from "react";
import { Plus, Trash2, Copy, ToggleLeft, ToggleRight, Loader2, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import MyTable from "@/components/MyTable";
import Pagination from "@/components/Pagination";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import usePagination from "@/hooks/usePagination";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGetApiKeys } from "../hooks";
import { postApiKey, toggleApiKeyStatus, deleteApiKey } from "../api";
import { QUERY_KEYS } from "@/utils/constants";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import clsx from "clsx";

export default function ApiKeysTab() {
  const queryClient = useQueryClient();
  const { page, limit, ...paginationProps } = usePagination();

  const { data, isLoading, error } = useGetApiKeys([page, limit], { page, limit });
  const rawKeys = data?.data?.data?.docs ||data?.data?.data ||  [];
  const totalPages = data?.data?.data?.pagination?.totalPages || 1;

  const [dialog, setDialog] = useState(null); // { type: "add" | "delete", item? }
  const [formData, setFormData] = useState({ name: "" });
  const [errors, setErrors] = useState({ name: "" });

  useEffect(() => {
    if (dialog) {
      setErrors({ name: "" });
      if (dialog.type === "add") {
        setFormData({ name: "" });
      }
    }
  }, [dialog]);

  // Create API Key Mutation
  const postMutation = useMutation({
    mutationFn: postApiKey,
    onSuccess: () => {
      getSuccessToast("API Key created successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.API_KEYS] });
      setDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  // Toggle API Key Status Mutation
  const toggleMutation = useMutation({
    mutationFn: toggleApiKeyStatus,
    onSuccess: () => {
      getSuccessToast("API Key status updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.API_KEYS] });
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  // Delete API Key Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteApiKey,
    onSuccess: () => {
      getSuccessToast("API Key deleted successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.API_KEYS] });
      setDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const handleSave = () => {
    if (dialog?.type === "delete") {
      deleteMutation.mutate(dialog.item._id);
      return;
    }

    if (!formData.name.trim()) {
      setErrors({ name: "API Key name is required" });
      return;
    }

    setErrors({ name: "" });
    postMutation.mutate({ name: formData.name.trim() });
  };

  const tableHeaders = [
    { id: "name", label: "Name" },
    { id: "createdBy", label: "Created By (Name, Role)" },
    { id: "key", label: "API Key" },
    { id: "status", label: "Status" },
    { id: "actions", label: "Actions", className: "text-right" },
  ];

  const tableBody = rawKeys.map((item) => {
    const isToggling =
      toggleMutation.isPending && toggleMutation.variables === item._id;

    return {
      name: { value: item.name },
      createdBy: {
        value: item.createdBy
          ? `${item.createdBy.name || "N/A"} (${item.createdBy.role || item.createdBy.userCode || "N/A"})`
          : "-",
      },
      key: {
        render: () => (
          <div className="flex items-center gap-2">
            <code className="font-mono text-xs bg-muted px-2 py-1 rounded border max-w-[220px] truncate inline-block">
              {item.key}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(item.key);
                getSuccessToast("API Key copied to clipboard");
              }}
              title="Copy Key"
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>
          </div>
        ),
      },
      status: {
        render: () => (
          <span
            className={clsx(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
              item.active
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-muted text-muted-foreground border-border",
            )}
          >
            {item.active ? "Active" : "Inactive"}
          </span>
        ),
      },
      actions: {
        render: () => (
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={isToggling}
              onClick={() => toggleMutation.mutate(item._id)}
              className={clsx(
                "relative w-11 h-6 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0",
                item.active ? "bg-emerald-600" : "bg-muted border border-border",
              )}
              title={item.active ? "Deactivate API Key" : "Activate API Key"}
            >
              <span
                className={clsx(
                  "absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm flex items-center justify-center",
                  item.active ? "translate-x-5" : "translate-x-0",
                )}
              >
                {isToggling && (
                  <Loader2 className="w-3 h-3 text-muted-foreground animate-spin" />
                )}
              </span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              disabled={deleteMutation.isPending && deleteMutation.variables === item._id}
              onClick={() => setDialog({ type: "delete", item })}
              className="h-8 w-8 text-destructive hover:bg-destructive/10 cursor-pointer"
              title="Delete API Key"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    };
  });

  return (
    <>
      <div className="bg-card rounded-xl border border-border  space-y-0">
        <div className="flex items-center justify-between py-4 px-5">
          <div>
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" /> API Keys
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage system API keys for external integrations and authentication.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setDialog({ type: "add" })}
            className="bg-primary hover:bg-primary/90 animate-fade-in cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1" /> Generate API Key
          </Button>
        </div>

        <LoaderErrWrapper isLoading={isLoading} error={error}>
          {rawKeys.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border">
              No API Keys generated yet. Click "Generate API Key" to create one.
            </div>
          ) : (
            <>
              <MyTable tableHeaders={tableHeaders} tableBody={tableBody} />
              <Pagination
                page={page}
                limit={limit}
                totalPage={totalPages}
                isLoading={isLoading}
                {...paginationProps}
              />
            </>
          )}
        </LoaderErrWrapper>
      </div>

      {/* Delete Confirmation Dialog */}
      {dialog && dialog.type === "delete" && (
        <DeleteDialog
          title={dialog.item?.name || "API Key"}
          onDelete={handleSave}
          onClose={() => setDialog(null)}
          deleting={deleteMutation.isPending}
        />
      )}

      {/* Create API Key Dialog */}
      {dialog && dialog.type === "add" && (
        <EditDialog
          title="Generate New API Key"
          onClose={() => setDialog(null)}
          onSave={handleSave}
          saving={postMutation.isPending}
        >
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="apiKeyName">API Key Name *</Label>
              <Input
                id="apiKeyName"
                placeholder="e.g. Mobile App Gateway, Partner Integration"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ name: e.target.value });
                  if (errors.name) setErrors({ name: "" });
                }}
              />
              {errors.name && (
                <p className="text-xs text-destructive font-medium">{errors.name}</p>
              )}
            </div>
          </div>
        </EditDialog>
      )}
    </>
  );
}
