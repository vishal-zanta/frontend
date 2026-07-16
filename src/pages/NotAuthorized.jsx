import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotAuthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-lg p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-red-600 animate-bounce" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Access Denied
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            You do not have the necessary permissions to access this page.
            If you think this is an error, please contact your administrator.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1 gap-2 rounded-xl"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>
          <Button
            className="flex-1 gap-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white"
            onClick={() => navigate("/")}
          >
            <Home className="w-4 h-4" /> Home
          </Button>
        </div>
      </div>
    </div>
  );
}
