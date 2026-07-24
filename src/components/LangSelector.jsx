import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGES } from "../utils/constants";
import clsx from "clsx";

const LangSelector = ({ triggerClassName }) => {
  const { lang, setLang } = useLanguage();
  return (
    <Select value={lang} onValueChange={(v) => setLang(v)}>
      <SelectTrigger
        className={clsx(
          "w-28 self-start sm:self-auto bg-background",
          triggerClassName,
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((l) => (
          <SelectItem value={l.value}>{l.label}</SelectItem>
        ))}
        {/* <SelectItem value="hi">हिन्दी</SelectItem> */}
      </SelectContent>
    </Select>
  );
};

export const LangSelectorSmall = ({ className }) => {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-1 p-0.5 bg-muted/40 border border-border/60 rounded-md text-[11px] font-medium leading-none select-none",
        className,
      )}
    >
      {LANGUAGES.map((l, i) => {
        return (
          <>
            <button
              type="button"
              onClick={() => setLang(l.value)}
              className={clsx(
                "px-1.5 py-0.5 rounded transition-all cursor-pointer font-semibold",
                lang === l.value
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {l.labelSmall}
            </button>
            {i != LANGUAGES.length - 1 && (
              <span className="text-border text-[10px] select-none">|</span>
            )}
          </>
        );
      })}
      {/* <button
        type="button"
        onClick={() => setLang("hi")}
        className={clsx(
          "px-1.5 py-0.5 rounded transition-all cursor-pointer font-semibold",
          lang === "hi"
            ? "bg-blue-600 text-white shadow-2xs"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        हि
      </button> */}
    </div>
  );
};

export default LangSelector;
