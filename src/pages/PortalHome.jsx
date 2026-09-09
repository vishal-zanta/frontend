import React from "react";
import { PORTAL_META, DASHBOARD_KPIS } from "@/lib/biharData";
import Login from "./Login";
import biharGovtLogo from "@/assets/bihar_govt.png";
import cmPhoto from "@/assets/cm_photo.jpg";
import LangSelector from "@/components/LangSelector";
import { useLanguage } from "@/context/LanguageContext";

export default function PortalHome() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-x-hidden transition-colors">
      {/* Header */}
      <div className="relative z-20 bg-gradient-to-r from-blue-950 via-blue-800 to-blue-600 dark:from-slate-900 dark:via-blue-950 dark:to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-sm">
              <img
                src={biharGovtLogo}
                alt={t("Government of Bihar", "बिहार सरकार")}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-xl font-bold">
                {t(PORTAL_META.name, "सहयोग हेल्पलाइन पोर्टल")}
              </div>
              {PORTAL_META.dept ? (
                <div className="text-sm text-white/70">{PORTAL_META.dept}</div>
              ) : null}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {DASHBOARD_KPIS.totalComplaints.toLocaleString("en-IN")}
              </div>
              <div className="text-[11px] text-white/60">
                {t("Total Complaints", "कुल शिकायतें")}
              </div>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {DASHBOARD_KPIS.resolved.toLocaleString("en-IN")}
              </div>
              <div className="text-[11px] text-white/60">
                {t("Resolved", "निस्तारित")}
              </div>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {DASHBOARD_KPIS.citizenSatisfaction}/5
              </div>
              <div className="text-[11px] text-white/60">
                {t("Satisfaction", "संतुष्टि")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tagline banner */}
      <div className="relative z-20 bg-blue-50 dark:bg-slate-900/80 border-b border-blue-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between text-sm">
          <span className="text-blue-800 dark:text-blue-300 font-medium">
            {t(PORTAL_META.tagline, "सुशासन ही जनसेवा - बिहार सरकार")}
          </span>
          <LangSelector />
        </div>
      </div>

      {/* Main content - CM card on left, Login form on right */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          {/* Dignitary / CM Card */}
          <div className="flex flex-col items-center text-center p-4 w-full max-w-sm">
            <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden bg-white/80 dark:bg-slate-900/80 shadow-md border border-slate-200/80 dark:border-slate-800 mb-4 flex items-center justify-center">
              <img
                src={cmPhoto}
                alt={t("Shri Samrat Choudhary", "श्री सम्राट चौधरी")}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <h2 className="text-2xl font-bold text-[#00388c] dark:text-blue-400 tracking-tight">
              {t("Shri Samrat Choudhary", "श्री सम्राट चौधरी")}
            </h2>
            <p className="text-base font-semibold text-[#b82218] dark:text-red-400 mt-1">
              {t("Honourable Chief Minister", "माननीय मुख्यमंत्री")}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5 font-medium">
              {t("Government of Bihar", "माननीय मुख्यमंत्री, बिहार")}
            </p>
          </div>

          {/* Right Side - Login */}
          <div className="w-full max-w-md flex flex-col items-center">
            <Login />
          </div>
        </div>

        <div className="text-center mt-12 text-xs text-muted-foreground">
          {t(
            `${PORTAL_META.name} - ${PORTAL_META.version} - Government of Bihar - All Rights Reserved`,
            `सहयोग हेल्पलाइन पोर्टल - ${PORTAL_META.version} - बिहार सरकार - सर्वाधिकार सुरक्षित`,
          )}
        </div>
      </div>
    </div>
  );
}
