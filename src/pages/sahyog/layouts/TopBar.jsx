import React from "react";
import { Mail, Megaphone } from "lucide-react";
import Marquee from "react-fast-marquee";
import { useSahyogTranslation } from "../translations";
import LangSelector from "@/components/LangSelector";

export default function TopBar() {
  const { t, lang } = useSahyogTranslation();

  const noticeBadge =
    t.topBar.noticeBadge || (lang === "hi" ? "सूचना" : "Notice");
  const noticeText =
    t.topBar.noticeText ||
    (lang === "hi"
      ? "बिहार सहयोग पोर्टल एवं हेल्पलाइन 1100 (टोल-फ्री) नागरिकों की सेवा में 24×7 उपलब्ध है। अपनी शिकायत ऑनलाइन दर्ज करें अथवा स्थिति ट्रैक करें।"
      : "Bihar Sahyog Portal & Helpline 1100 (Toll-Free) is available 24×7 for citizen assistance. Register your grievance online or track grievance status in real-time.");

  return (
    <div className="w-full">
      {/* Top Notice Marquee Bar */}
      <div className="bg-[#1C4D8D] text-white text-xs py-1.5 px-4 sm:px-8 flex items-center gap-2.5 sm:gap-3 overflow-hidden border-b border-blue-900/40">
        <div className="flex items-center gap-1.5 bg-amber-500 text-slate-950 font-bold text-[10px] sm:text-[11px] px-2 py-0.5 rounded shrink-0 uppercase tracking-wide shadow-sm z-10">
          <Megaphone className="w-3 h-3 animate-pulse" />
          <span>{noticeBadge}</span>
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <Marquee
            pauseOnHover={true}
            speed={45}
            gradient={false}
            className="text-white/95 font-medium text-[11px] sm:text-xs"
          >
            <span className="mr-12">{noticeText}</span>
          </Marquee>
        </div>
      </div>

      {/* Main TopBar */}
      <div className="bg-[#f8fafc] text-slate-700 text-xs py-2 px-4 sm:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left Side: Helpline Details */}
          <div className="flex flex-wrap items-center gap-3 font-medium">
            <a
              href="tel:1100"
              className="flex items-center gap-1.5 text-[#1C4D8D] font-bold hover:text-blue-800 transition-colors"
            >
              <span>{t.topBar.helpline}</span>
            </a>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {t.topBar.available247}
            </span>
          </div>

          {/* Right Side: Email placeholder & Language Select */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-1.5 text-slate-600 hidden sm:flex">
              <Mail className="w-3.5 h-3.5 text-[#0066B3]" />
              <span className="font-semibold text-[#0066B3]">
                {t.topBar.email}
              </span>
              <a
                href="mailto:sahyoghelpline@bihar.gov.in"
                className="text-slate-700 hover:text-[#1C4D8D] hover:underline font-medium"
              >
                sahyoghelpline@bihar.gov.in
              </a>
            </div>

            <span className="text-slate-300">|</span>

            {/* LangSelector Component */}
            <LangSelector />
          </div>
        </div>
      </div>
    </div>
  );
}
