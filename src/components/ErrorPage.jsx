import React, { useState } from "react";
import { AlertOctagon, RefreshCw, Home, ChevronRight, ChevronDown, Copy, Check } from "lucide-react";

const ErrorPage = ({ error, resetErrorBoundary }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const errorText = `${error?.toString()}\n\nStack Trace:\n${error?.stack || "No stack trace available"}`;
      await navigator.clipboard.writeText(errorText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy error details:", err);
    }
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4 antialiased">
      {/* Background decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-2xl w-full bg-white border border-slate-200/80 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-sm">
        {/* Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-900 via-blue-600 to-indigo-600" />

        <div className="p-8 md:p-10 text-center flex flex-col items-center">
          {/* Pulsing Warning Icon */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-red-100 rounded-full scale-150 animate-ping opacity-75" />
            <div className="relative w-16 h-16 bg-red-50 border-2 border-red-200 rounded-full flex items-center justify-center text-red-600">
              <AlertOctagon className="w-8 h-8" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mb-3">
            System Error Occurred
          </h1>
          
          <p className="text-base text-slate-600 max-w-md mx-auto mb-8">
            The Bihar e-Grievance portal encountered an unexpected application issue.
            We apologize for the inconvenience.
          </p>

          {/* Call-to-action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-8">
            <button
              onClick={resetErrorBoundary}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 shadow-md shadow-blue-900/10 transition-all active:scale-[0.98]"
            >
              <RefreshCw className="w-4 h-4 animate-spin-hover" />
              Refresh Page
            </button>
            <button
              onClick={handleGoHome}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 hover:border-slate-300 text-sm font-semibold rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 shadow-sm transition-all active:scale-[0.98]"
            >
              <Home className="w-4 h-4" />
              Go to Dashboard
            </button>
          </div>

          {/* Developer / Admin error accordion */}
          {error && (
            <div className="w-full border border-slate-200/60 rounded-xl bg-slate-50/50 text-left overflow-hidden">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between p-4 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100/50 transition-colors border-b border-slate-200/40"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>Technical Diagnostics (Code: 500)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {showDetails ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </button>

              {showDetails && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                      Error details
                    </span>
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-md shadow-sm transition-all"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-green-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy log
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="p-3 bg-slate-900 rounded-lg overflow-x-auto border border-slate-950 shadow-inner">
                    <p className="text-xs font-mono text-red-400 font-bold leading-normal mb-2">
                      {error.toString()}
                    </p>
                    {error.stack && (
                      <pre className="text-[10px] font-mono text-slate-300 leading-relaxed max-h-48 overflow-y-auto whitespace-pre">
                        {error.stack}
                      </pre>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-400">
          <span>e-Grievance Resolution System</span>
          <span>Government of Bihar</span>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;