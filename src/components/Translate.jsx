import React from "react";
import { useMutation } from "@tanstack/react-query";
import { Languages, Loader2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { useLanguage } from "@/context/LanguageContext";
import { postTranslate } from "@/api/translation.api";
import { getErrorToast } from "@/utils/helpers";

const Translate = ({ name, control, onTranslateDone }) => {
  const formContext = useFormContext();
  const effectiveControl = control || formContext?.control;
  const currValue = useWatch({ name, control: effectiveControl });
  const { lang } = useLanguage();

  const targetLanguage = lang?.toLowerCase()?.startsWith("hi") ? "hi" : "en";

  const translateMutation = useMutation({
    mutationFn: async ({ text, targetLanguage }) => {
      return postTranslate({ text, targetLanguage });
    },
    onSuccess: (res) => {
      const translatedText = res?.data?.data?.translatedText;
      if (onTranslateDone) {
        onTranslateDone(translatedText);
      } else if (name && formContext?.setValue && translatedText) {
        formContext.setValue(name, translatedText, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const handleTranslate = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (!currValue || translateMutation.isPending) return;

    translateMutation.mutate({
      text: currValue,
      targetLanguage,
    });
  };

  return translateMutation.isPending ? (
    <Loader2 className="w-4 h-4 animate-spin text-primary" />
  ) : (
    <Languages
      className="w-4 h-4 cursor-pointer hover:text-primary transition-colors"
      onClick={handleTranslate}
    />
  );
};

export default Translate;
