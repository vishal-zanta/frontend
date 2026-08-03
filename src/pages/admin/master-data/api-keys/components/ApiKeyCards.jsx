import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Loader2, Key } from "lucide-react";
import { getSuccessToast } from "@/utils/helpers";
import { useLanguage } from "@/context/LanguageContext";
import clsx from "clsx";

export default function ApiKeyCards({
  rawKeys = [],
  setDialog,
  toggleMutation,
  deleteMutation,
}) {
  const { t } = useLanguage();

  if (!rawKeys || rawKeys.length === 0) {
    return (
      <div className="p-6 text-center text-xs xs:text-sm text-muted-foreground">
        {t("No API Keys generated yet.", "अभी तक कोई एपीआई कुंजी जनरेट नहीं की गई है।")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 xs:p-4">
      {rawKeys.map((item) => (
        <Card
          key={item._id}
          item={item}
          setDialog={setDialog}
          toggleMutation={toggleMutation}
          deleteMutation={deleteMutation}
          t={t}
        />
      ))}
    </div>
  );
}

function Card({ item, setDialog, toggleMutation, deleteMutation, t }) {
  const isToggling =
    toggleMutation.isPending && toggleMutation.variables === item._id;

  const createdByText = item.createdBy
    ? `${item.createdBy.name || "N/A"} (${item.createdBy.role || item.createdBy.userCode || "N/A"})`
    : "N/A";

  return (
    <div className="rounded-xl border border-border bg-background dark:bg-[#0c1427] shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="p-3 xs:p-3.5 sm:p-4 border-b border-border/60 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-semibold text-sm text-foreground flex items-center gap-1.5 truncate">
            <Key className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">{item.name || "N/A"}</span>
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
            {t("By:", "द्वारा:")} {createdByText}
          </div>
        </div>

        <span
          className={clsx(
            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border shrink-0",
            item.active
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : "bg-muted text-muted-foreground border-border"
          )}
        >
          {item.active ? t("Active", "सक्रिय") : t("Inactive", "निष्क्रिय")}
        </span>
      </div>

      <div className="p-3 xs:p-3.5 sm:p-4">
        <div className="bg-muted/40 p-2.5 rounded-lg border border-border/50 space-y-1">
          <span className="text-muted-foreground block text-[10px] uppercase font-medium">
            {t("API Key", "API कुंजी")}
          </span>
          <div className="flex items-center gap-2">
            <code className="font-mono text-xs bg-background px-2 py-1 rounded border max-w-full truncate inline-block flex-1">
              {item.key || "N/A"}
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
        </div>
      </div>

      <div className="p-3 xs:p-3.5 border-t border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {item.active ? t("Enabled", "सक्षम") : t("Disabled", "अक्षम")}
          </span>
          <button
            type="button"
            disabled={isToggling}
            onClick={() => toggleMutation.mutate(item._id)}
            className={clsx(
              "relative w-11 h-6 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0",
              item.active ? "bg-emerald-600" : "bg-muted border border-border"
            )}
            title={item.active ? "Deactivate API Key" : "Activate API Key"}
          >
            <span
              className={clsx(
                "absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm flex items-center justify-center",
                item.active ? "translate-x-5" : "translate-x-0"
              )}
            >
              {isToggling && (
                <Loader2 className="w-3 h-3 text-muted-foreground animate-spin" />
              )}
            </span>
          </button>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={deleteMutation.isPending && deleteMutation.variables === item._id}
          onClick={() => setDialog({ type: "delete", item })}
          className="h-8 text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
          title="Delete API Key"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          {t("Delete", "हटाएं")}
        </Button>
      </div>
    </div>
  );
}
