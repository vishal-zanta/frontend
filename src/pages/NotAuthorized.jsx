import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotAuthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-lg p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-red-600 animate-bounce" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Access Denied
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
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
            className="flex-1 gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => navigate("/")}
          >
            <Home className="w-4 h-4" /> Home
          </Button>
        </div>
      </div>
    </div>
  );
}
