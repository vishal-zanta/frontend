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

const LangSelector = ({triggerClassName}) => {
  const { lang, setLang } = useLanguage();
  return (
    <Select  value={lang} onValueChange={(v) => setLang(v)}>
      <SelectTrigger className={clsx("w-28 self-start sm:self-auto ", triggerClassName)}>
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

export default LangSelector;
