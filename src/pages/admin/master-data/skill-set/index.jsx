import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import { useGetSkills } from "../hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postSkill, putSkill, deleteSkill } from "../api";
import { QUERY_KEYS } from "@/utils/constants";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import SkillTable from "./components/SkillTable";
import SkillForm from "./components/SkillForm";
import { useLanguage } from "@/context/LanguageContext";

export default function SkillSetTab() {
  const { t } = useLanguage();
  const { page, limit, ...paginationProps } = usePagination();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useGetSkills([page, limit], { page, limit });

  const rawSkills = data?.data?.data?.docs || [];
  const totalPages = data?.data?.data?.pagination?.totalPages || 1;

  const [dialog, setDialog] = useState(null); // { type: "add"|"edit"|"delete", item? }
  const [formData, setFormData] = useState({ name: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (dialog && (dialog.type === "add" || dialog.type === "edit")) {
      setFormData({
        name: dialog.item ? dialog.item.name || "" : "",
      });
      setErrors({});
    }
  }, [dialog]);

  const postMutation = useMutation({
    mutationFn: postSkill,
    onSuccess: () => {
      getSuccessToast("Skill set added successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SKILLS] });
      setDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const putMutation = useMutation({
    mutationFn: putSkill,
    onSuccess: () => {
      getSuccessToast("Skill set updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SKILLS] });
      setDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      getSuccessToast("Skill set deleted successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SKILLS] });
      setDialog(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const handleSave = () => {
    if (dialog.type === "delete") {
      deleteMutation.mutate(dialog.item._id);
      return;
    }

    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Skill name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({ name: "" });

    if (dialog.type === "add") {
      postMutation.mutate(formData);
    } else {
      putMutation.mutate({
        skillId: dialog.item._id,
        skill: formData,
      });
    }
  };

  return (
    <>
      <div className="bg-card rounded-xl border border-border px-5 py-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground">{t("Skill Sets", "कौशल सेट")}</h3>
          <Button
            size="sm"
            onClick={() => setDialog({ type: "add" })}
            className="bg-primary hover:bg-primary/90 animate-fade-in cursor-pointer text-white"
          >
            <Plus className="w-4 h-4 mr-1" /> {t("Add Skill", "कौशल जोड़ें")}
          </Button>
        </div>
        <LoaderErrWrapper isLoading={isLoading} error={error}>
          {rawSkills.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border col-span-full">
              {t("No skill sets configured yet.", "अभी तक कोई कौशल सेट कॉन्फ़िगर नहीं किया गया है।")}
            </div>
          ) : (
            <>
              <SkillTable
                rawSkills={rawSkills}
                setDialog={setDialog}
              />
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

      {dialog && dialog.type === "delete" && (
        <DeleteDialog
          title={dialog.item.name}
          onDelete={handleSave}
          onClose={() => setDialog(null)}
          deleting={deleteMutation.isPending}
        />
      )}
      {dialog && dialog.type !== "delete" && (
        <EditDialog
          title={dialog.type === "add" ? "Add Skill" : `Edit ${dialog.item?.name || "Record"}`}
          onClose={() => setDialog(null)}
          onSave={handleSave}
          saving={postMutation.isPending || putMutation.isPending}
        >
          <SkillForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
        </EditDialog>
      )}
    </>
  );
}