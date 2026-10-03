import React from "react";
import { UserCheck, User, Headphones } from "lucide-react";
import { Link } from "react-router-dom";
import { useSahyogTranslation } from "../translations";
import { CITIZEN_URL } from "@/utils/constants";

export default function HeaderBranding() {
  const { t } = useSahyogTranslation();

  const cceLoginUrl = "/?role=cce";
  const citizenLoginUrl = CITIZEN_URL
    ? `${CITIZEN_URL.endsWith("/") ? CITIZEN_URL : CITIZEN_URL + "/"}login`
    : "/login";

  return (
    <header className="bg-white py-3.5 px-4 sm:px-8 border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Branding Group */}
        <a
          href={CITIZEN_URL || "/"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col sm:flex-row items-center gap-3.5 text-center sm:text-left group"
        >
          {/* Bihar Govt Official Logo */}
          <div className="relative w-14 h-16 shrink-0 flex items-center justify-center">
            <img
              src="/bihar-logo.png"
              alt="Government of Bihar"
              width={56}
              height={68}
              className="object-contain"
            />
          </div>

          {/* Title & Tagline */}
          <div className="border-l-0 sm:border-l-2 border-slate-200 sm:pl-4">
            <h1 className="text-xl sm:text-2xl font-black text-[#1C4D8D] tracking-tight leading-tight group-hover:text-blue-900 transition-colors">
              {t.header.title}
            </h1>
            <p className="text-xs font-extrabold text-[#C35504] tracking-wide mt-0.5">
              {t.header.govt}
            </p>
          </div>
        </a>

        {/* Right Side: Login Buttons (Citizen Login, CCE Login & Officer Login) */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap justify-center">
          {/* Citizen Login Button */}
          <a
            href={citizenLoginUrl}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>{t.header.citizenLogin}</span>
          </a>

          {/* Officer Login Button */}
          <Link
            to="/"
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-[#1C4D8D] to-[#163c6f] hover:from-[#163c6f] hover:to-[#0F2A52] text-white font-bold text-xs shadow-xs hover:shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>{t.header.officerLogin}</span>
          </Link>

          {/* CCE Login Button */}
          <Link
            to={cceLoginUrl}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Headphones className="w-4 h-4" />
            <span>{t.header.cceLogin}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
