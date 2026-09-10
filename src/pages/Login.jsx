import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LogIn,
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  User,
  Shield,
  Headphones,
} from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { postLogin, getProfile } from "@/api/auth.api";
import { sidebarSections } from "@/components/Sidebar";
import { checkPermissionManual } from "@/utils/helpers";
import { useLanguage } from "@/context/LanguageContext";
// import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function Login() {
  const { state } = useLocation();
  const { t } = useLanguage();

  // const {executeRecaptcha} = useGoogleReCaptcha();
  const navigate = useNavigate();
  const [loginMode, setLoginMode] = useState("email"); // "email" or "loginId"
  const [email, setEmail] = useState("");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fullScreenLoader, setFullScreenLoader] = useState(false);

  const handleModeChange = (mode) => {
    setLoginMode(mode);
    setEmail("");
    setLoginId("");
    setPassword("");
    setError("");
  };

  const getRouteAfterLogin = (permission) => {
    const allPaths = sidebarSections.map((s) => s.items).flat();
    let path = null;
    for (let i = 0; i < allPaths.length; i++) {
      if (checkPermissionManual(permission, allPaths[i]?.permissions)) {
        path = allPaths[i];
        break;
      }
    }

    return path?.path || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // if(!executeRecaptcha){
    //   console.log("reCAPTCHA has not loaded yet");
    // }
    try {
      const payload =
        loginMode === "email" ? { email, password } : { loginId, password };
      const res = await postLogin(payload);

      const token = res?.data?.data?.token;
      if (token) {
        localStorage.setItem("usertoken", token);
        const path = getRouteAfterLogin(
          res?.data?.data?.role?.permissions || [],
        );
        // sessionStorage.setItem("usertoken", token);
        console.log("After login path : ", path, {
          permission: res?.data?.data?.role?.permissions || [],
        });
        if (!path) {
          throw new Error(
            t(
              "Ask admin to give some permissions for this role",
              "कृपया व्यवस्थापक से इस भूमिका के लिए अनुमति प्राप्त करें",
            ),
          );
        }
        setTimeout(() => {
          navigate(path);
        }, 0);
      } else {
        throw new Error(t("token not found", "टोकन नहीं मिला"));
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          t("Invalid email or password", "अमान्य ईमेल या पासवर्ड"),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer = null;
    const token = localStorage.getItem("usertoken");
    if (!!token) {
      console.log("Login profile");
      setFullScreenLoader(true);
      getProfile()
        .then((res) => {
          const path = getRouteAfterLogin(
            res?.data?.data?.role?.permissions || [],
          );
          setFullScreenLoader(false);
          console.log("After login path : ", path);
          if (!path) {
            throw new Error(
              t(
                "Ask admin to give some permissions for this role",
                "कृपया व्यवस्थापक से इस भूमिका के लिए अनुमति प्राप्त करें",
              ),
            );
          }
          timer = setTimeout(() => {
            navigate(path);
          }, 0);
        })
        .catch((err) => {
          console.error("Failed to auto-login from profile API: ", err);
          setFullScreenLoader(false);
        });
    }
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <AuthLayout
      icon={LogIn}
      title={t("Sahyog Helpline Portal", "सहयोग हेल्पलाइन पोर्टल")}
      subtitle={t("Log in to your account", "अपने खाते में लॉग इन करें")}
      footer={null}
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      {/* Mode Selection Boxes */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <button
          type="button"
          onClick={() => handleModeChange("email")}
          className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
            loginMode === "email"
              ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20 shadow-sm"
              : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          }`}
        >
          <div
            className={`p-2 rounded-lg shrink-0 ${
              loginMode === "email"
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Shield className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold leading-tight truncate">
              {t("Admin / Officer", "प्रशासक / अधिकारी")}
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("loginId")}
          className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
            loginMode === "loginId"
              ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20 shadow-sm"
              : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          }`}
        >
          <div
            className={`p-2 rounded-lg shrink-0 ${
              loginMode === "loginId"
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Headphones className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold leading-tight truncate">
              {t("CCE Agent", "सीसीई एजेंट")}
            </div>
          </div>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {loginMode === "email" ? (
          <div className="space-y-2">
            <Label htmlFor="email">{t("Email Address", "ईमेल पता")}</Label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                placeholder={t("you@bihar.gov.in", "you@bihar.gov.in")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12"
                required
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="loginId">{t("User ID", "यूज़र आईडी")}</Label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="loginId"
                type="text"
                autoComplete="username"
                autoFocus
                placeholder={t(
                  "Enter your User ID",
                  "अपनी यूज़र आईडी दर्ज करें",
                )}
                value={loginId}
                onChange={(e) =>
                  setLoginId((e.target.value || "").toUpperCase())
                }
                className="pl-10 h-12"
                required
              />
            </div>
          </div>
        )}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t("Password", "पासवर्ड")}</Label>
          </div>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 h-12"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Eye className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full h-12 font-medium cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("Logging in...", "लॉगिन हो रहा है...")}
            </>
          ) : (
            t("Log in", "लॉग इन करें")
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
