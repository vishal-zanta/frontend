import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Phone } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { DISTRICTS, SERVICES } from "@/lib/biharData";
import { addStoredComplaint, findComplaintById } from "@/lib/complaintStore";

const WELCOME =
  "Namaste! 🙏 Welcome to Bihar e-Grievance AI Assistant.\n\nI can help you:\n📝 File a complaint (right here in chat!)\n🔍 Track your complaint status\n💡 Get answers about services & SLA\n🛠️ Technical support\n\nHow can I help you today?";

const QUICK_ACTIONS = [
  { label: "📝 File Complaint", action: "raise" },
  { label: "🔍 Track Complaint", action: "track" },
  { label: "💡 Common Issues", action: "templates" },
  { label: "🛠️ Technical Help", action: "technical" },
];

const ISSUE_TEMPLATES = [
  {
    label: "💡 Street light not working",
    service: "street-light",
    subservice: "sl-not-working",
    desc: "Street light not working on our lane. Area is dark at night.",
  },
  {
    label: "💧 Drain overflow",
    service: "drainage",
    subservice: "dr-overflow",
    desc: "Drain is overflowing. Dirty water on the road.",
  },
  {
    label: "🚿 No water supply",
    service: "water-supply",
    subservice: "ws-no-water",
    desc: "No water supply in our area for several days.",
  },
  {
    label: "🛣️ Potholes on road",
    service: "road",
    subservice: "rd-potholes",
    desc: "Multiple potholes on the road causing accidents.",
  },
  {
    label: "🗑️ Garbage not collected",
    service: "sanitation",
    subservice: "sa-no-collection",
    desc: "Garbage not collected from our area for several days.",
  },
  {
    label: "🐕 Stray dog menace",
    service: "animal",
    subservice: "an-stray-dog",
    desc: "Aggressive stray dogs near residential area.",
  },
];

const TECH_ISSUES = [
  {
    label: "Portal not loading",
    response:
      "If the portal isn't loading:\n1. Refresh the page (Ctrl+F5)\n2. Clear browser cache\n3. Try Chrome or Firefox\n4. Check your internet connection\n\n📞 Helpline: 1800-345-6789",
  },
  {
    label: "Can't upload file",
    response:
      "For file upload issues:\n1. File must be under 10MB\n2. Supported: PNG, JPG, PDF\n3. Try a different file\n4. Check internet connection\n\n💡 You can file the complaint without a photo and add it later.",
  },
  {
    label: "Can't track complaint",
    response:
      "If you can't track your complaint:\n1. Check the Complaint ID format: BH-2026-XXXXXX\n2. Remove extra spaces\n3. The ID is case-insensitive\n4. Copy the ID directly from the confirmation page\n\n💡 I can track it for you right here! Click '🔍 Track Complaint'.",
  },
  {
    label: "Login issues",
    response:
      "For login issues:\n1. Check your email address\n2. Use 'Forgot Password' to reset\n3. Check spam folder for OTP\n4. Try Google login\n\n📞 Helpline: 1800-345-6789",
  },
];

const KB = [
  {
    keywords: ["sla", "time", "how long", "resolve"],
    response:
      "Expected resolution time by complaint type:\n• Street light: 24 hours\n• Drain overflow: 12 hours\n• Water supply: 24 hours\n• Potholes: 72 hours\n• Snake rescue: 2 hours\n\nIf not resolved within SLA, the complaint auto-escalates to L2.",
  },
  {
    keywords: ["escalat", "l1", "l2", "level"],
    response:
      "Escalation hierarchy:\nL1 Field Officer → L2 Supervisor → Zone Admin → ULB Admin → Division → SUDA\n\nEach level has a defined SLA. Breaches trigger auto-escalation with SMS notification.",
  },
  {
    keywords: ["ward", "area", "district"],
    response:
      "I can help identify your ward! Please share your district or area name, and I'll look up ward details. You can also select your district when filing a complaint - the ward auto-fills from master data.",
  },
  {
    keywords: ["document", "upload", "photo"],
    response:
      "Yes! You can upload photos and supporting documents when filing a complaint. Geo-tagged photos are especially helpful. Just click 'Raise Complaint' in the sidebar and upload on Step 3.",
  },
  {
    keywords: ["track", "status"],
    response:
      "To track a complaint, click '🔍 Track Complaint' above and enter your Complaint ID. You'll see the full timeline including submission, assignment, field visit, and resolution.",
  },
  {
    keywords: ["hello", "hi", "namaste", "hey"],
    response:
      "Namaste! 🙏 How can I help? You can file a complaint, track status, or ask about services.",
  },
  {
    keywords: ["thank"],
    response: "You're welcome! 🙏 Is there anything else I can help you with?",
  },
];

const COMPLAINT_KEYWORDS = [
  "not working",
  "broken",
  "overflow",
  "dirty",
  "blocked",
  "damaged",
  "leak",
  "pothole",
  "garbage",
  "stray",
  "snake",
  "cattle",
  "complaint",
  "issue",
  "problem",
  "street light",
  "drain",
  "water",
  "road",
  "footpath",
  "dog",
  "toilet",
  "wiring",
  "spark",
];

function getKBResponse(input) {
  const lower = input.toLowerCase();
  for (const entry of KB) {
    if (entry.keywords.some((k) => lower.includes(k))) return entry.response;
  }
  return null;
}

function genComplaintId() {
  return `BH-2026-${Math.floor(100000 + Math.random() * 899999)}`;
}

export default function Chatbot({ role = "citizen" }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: WELCOME, actions: "quick" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [mode, setMode] = useState("default");
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState({});
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const addBot = (text, actions = null) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { role: "bot", text, actions }]);
    }, 600);
  };

  const addUser = (text) => {
    setMessages((prev) => [...prev, { role: "user", text }]);
  };

  const resetToDefault = () => {
    setMode("default");
    setStep(0);
    setDraft({});
    addBot("Is there anything else I can help you with?", "quick");
  };

  const startRaise = (template = null) => {
    setMode("raise");
    setStep(0);
    const initialDraft = template
      ? {
          service: template.service,
          subservice: template.subservice,
          description: template.desc,
          template: true,
        }
      : {};
    setDraft(initialDraft);
    addBot(
      "Great! I'll help you file a complaint. 📝\n\nWhat's your full name?",
    );
  };

  const startTrack = () => {
    setMode("track");
    addBot("Please enter your Complaint ID (e.g., BH-2026-047821):");
  };

  const handleSend = async (text) => {
    if (!text.trim()) return;
    addUser(text);
    setInput("");

    if (mode === "raise") {
      handleRaiseStep(text);
    } else if (mode === "track") {
      handleTrack(text);
    } else {
      handleFreeText(text);
    }
  };

  const handleRaiseStep = (text) => {
    if (step === 0) {
      setDraft((d) => ({ ...d, name: text }));
      setStep(1);
      addBot(
        `Thank you, ${text}! 📱\n\nPlease share your 10-digit mobile number.`,
      );
    } else if (step === 1) {
      const mobile = text.replace(/\D/g, "");
      if (mobile.length < 10) {
        addBot("⚠️ Please enter a valid 10-digit mobile number.");
        return;
      }
      setDraft((d) => ({ ...d, mobile: text }));
      setStep(2);
      addBot("Perfect! 📍 Which district are you in?", "districts");
    } else if (step === 3) {
      setDraft((d) => ({ ...d, description: text }));
      setStep(4);
      showSummary({ ...draft, description: text });
    }
  };

  const handleDistrictSelect = (districtId) => {
    const dist = DISTRICTS.find((d) => d.id === districtId);
    setDraft((d) => ({
      ...d,
      district: districtId,
      districtName: dist?.name || "",
    }));
    setStep(3);
    if (draft.template) {
      addBot(
        `Great! You selected: ${dist?.name}\n\nPlease describe your issue in detail. (A template description is pre-filled - you can edit it.)`,
      );
      setInput(draft.description || "");
    } else {
      addBot(
        `Great! You selected: ${dist?.name}\n\nWhat type of issue are you facing?`,
        "services",
      );
    }
  };

  const handleServiceSelect = (serviceId) => {
    const svc = SERVICES.find((s) => s.id === serviceId);
    const subservice = svc?.subservices[0];
    setDraft((d) => ({
      ...d,
      service: serviceId,
      subservice: subservice?.id || "",
    }));
    setStep(3);
    addBot(`Selected: ${svc?.name}\n\nPlease describe your issue in detail.`);
  };

  const showSummary = (d) => {
    const svc = SERVICES.find((s) => s.id === d.service);
    const subservice = svc?.subservices.find((ss) => ss.id === d.subservice);
    const slaHours = subservice?.slaHours || 24;
    setDraft(d);
    addBot(
      `📋 Complaint Summary\n\n` +
        `Name: ${d.name}\n` +
        `Mobile: ${d.mobile}\n` +
        `District: ${d.districtName}\n` +
        `Service: ${svc?.name || ""}\n` +
        `Sub-service: ${subservice?.name || ""}\n` +
        `Description: ${d.description}\n\n` +
        `Expected SLA: ${slaHours} hours\n\n` +
        `Click "✅ Confirm & Submit" to register your complaint.`,
      "confirm",
    );
  };

  const submitComplaint = () => {
    const svc = SERVICES.find((s) => s.id === draft.service);
    const subservice = svc?.subservices.find(
      (ss) => ss.id === draft.subservice,
    );
    const slaHours = subservice?.slaHours || 24;
    const complaintId = genComplaintId();

    const complaint = {
      id: complaintId,
      citizenName: draft.name,
      mobile: draft.mobile,
      address: "",
      district: draft.district,
      districtName: draft.districtName,
      ulb: "",
      ulbName: "",
      ward: "",
      landmark: "",
      service: draft.service,
      serviceName: svc?.name || "",
      subservice: draft.subservice,
      subserviceName: subservice?.name || "",
      description: draft.description,
      priority: "Normal",
      status: "Pending",
      source: "chatbot",
      createdDate: new Date().toISOString(),
      slaHours,
      resolvedDate: null,
      l1Officer: null,
      l1OfficerName: null,
      timeline: [
        {
          type: "Complaint Filed via Chatbot",
          actor: "Citizen",
          timestamp: new Date().toISOString(),
          icon: "FilePlus2",
          notes: "Filed via AI Assistant",
        },
      ],
    };

    addStoredComplaint(complaint);

    const expectedDays = Math.ceil(slaHours / 24);
    addBot(
      `✅ Complaint Registered Successfully!\n\n` +
        `Your Complaint ID: ${complaintId}\n` +
        `Expected Resolution: ${expectedDays} day(s) (${slaHours} hours)\n\n` +
        `💡 Save this ID! You'll need it to track your complaint.\n\n` +
        `You can track it on the Track Complaint page or ask me to track it for you.`,
      "after_submit",
    );
    setMode("default");
    setStep(0);
    setDraft({});
  };

  const handleTrack = (id) => {
    const found = findComplaintById(id);
    if (found) {
      addBot(
        `✅ Found your complaint!\n\n` +
          `ID: ${found.id}\n` +
          `Status: ${found.status}\n` +
          `Service: ${found.serviceName}\n` +
          `Description: ${found.description}\n` +
          (found.l1OfficerName ? `Officer: ${found.l1OfficerName}\n` : "") +
          (found.resolvedDate
            ? `Resolved: ${new Date(found.resolvedDate).toLocaleDateString("en-IN")}\n`
            : "") +
          `\nView full details on the Track Complaint page.`,
        "quick",
      );
    } else {
      addBot(
        `❌ No complaint found with ID "${id}".\n\nPlease check the ID (format: BH-2026-XXXXXX) and try again.`,
        "track_retry",
      );
    }
    setMode("default");
  };

  const handleFreeText = async (text) => {
    const lower = text.toLowerCase();
    const isComplaint = COMPLAINT_KEYWORDS.some((k) => lower.includes(k));

    const kbResponse = getKBResponse(text);
    if (kbResponse) {
      addBot(kbResponse, "quick");
      return;
    }

    if (isComplaint) {
      addBot(
        `It sounds like you want to file a complaint about: "${text}"\n\nWould you like me to help you file a complaint right here in chat? Click "📝 File Complaint" below.`,
        "quick",
      );
      return;
    }

    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are the AI Assistant for the Bihar e-Grievance Portal (BUCGP). The user asked: "${text}". Provide a helpful, concise response (max 3 sentences) about Bihar government grievance services. Be friendly and practical. If the user seems to want to file a complaint, suggest clicking "File Complaint".`,
      });
      addBot(res, "quick");
    } catch {
      addBot(
        `I understand you're asking about "${text}". I can help you with:\n• Filing a complaint\n• Tracking your complaint\n• Service & SLA info\n• Technical support\n\nClick a quick action below or type your question.`,
        "quick",
      );
    }
  };

  const renderActions = (actions) => {
    if (!actions) return null;

    if (actions === "quick") {
      return (
        <div className="flex flex-wrap gap-2 mt-2">
          {QUICK_ACTIONS.map((a, i) => (
            <button
              key={i}
              onClick={() => {
                if (a.action === "raise") startRaise();
                else if (a.action === "track") startTrack();
                else if (a.action === "templates")
                  addBot("Select a common issue template below:", "templates");
                else if (a.action === "technical")
                  addBot("What technical issue are you facing?", "tech_list");
              }}
              className="px-3 py-1.5 text-xs rounded-lg bg-white border border-primary/30 text-primary hover:bg-blue-50 transition-colors"
            >
              {a.label}
            </button>
          ))}
        </div>
      );
    }

    if (actions === "districts") {
      return (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {DISTRICTS.slice(0, 8).map((d) => (
            <button
              key={d.id}
              onClick={() => handleDistrictSelect(d.id)}
              className="px-2.5 py-1 text-xs rounded-lg bg-white border border-border hover:border-primary hover:bg-blue-50 transition-colors"
            >
              {d.name}
            </button>
          ))}
        </div>
      );
    }

    if (actions === "services") {
      return (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              onClick={() => handleServiceSelect(s.id)}
              className="px-2.5 py-1 text-xs rounded-lg bg-white border border-border hover:border-primary hover:bg-blue-50 transition-colors"
            >
              {s.name}
            </button>
          ))}
        </div>
      );
    }

    if (actions === "confirm") {
      return (
        <div className="flex gap-2 mt-2">
          <button
            onClick={submitComplaint}
            className="px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium"
          >
            ✅ Confirm & Submit
          </button>
          <button
            onClick={() => {
              setMode("default");
              setStep(0);
              setDraft({});
              addBot("Complaint cancelled. How can I help you?", "quick");
            }}
            className="px-4 py-2 text-sm rounded-lg bg-white border border-border hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      );
    }

    if (actions === "after_submit") {
      return (
        <div className="flex flex-wrap gap-2 mt-2">
          <button
            onClick={startTrack}
            className="px-3 py-1.5 text-xs rounded-lg bg-white border border-primary/30 text-primary hover:bg-blue-50"
          >
            🔍 Track this complaint
          </button>
          <button
            onClick={() => startRaise()}
            className="px-3 py-1.5 text-xs rounded-lg bg-white border border-primary/30 text-primary hover:bg-blue-50"
          >
            📝 File another
          </button>
          <button
            onClick={resetToDefault}
            className="px-3 py-1.5 text-xs rounded-lg bg-white border border-border hover:bg-muted"
          >
            🏠 Main Menu
          </button>
        </div>
      );
    }

    if (actions === "templates") {
      return (
        <div className="grid grid-cols-1 gap-1.5 mt-2">
          {ISSUE_TEMPLATES.map((tmpl, i) => (
            <button
              key={i}
              onClick={() => startRaise(tmpl)}
              className="px-3 py-2 text-xs text-left rounded-lg bg-white border border-border hover:border-primary hover:bg-blue-50 transition-colors"
            >
              {tmpl.label}
            </button>
          ))}
        </div>
      );
    }

    if (actions === "tech_list") {
      return (
        <div className="grid grid-cols-1 gap-1.5 mt-2">
          {TECH_ISSUES.map((tech, i) => (
            <button
              key={i}
              onClick={() => addBot(tech.response, "quick")}
              className="px-3 py-2 text-xs text-left rounded-lg bg-white border border-border hover:border-primary hover:bg-blue-50 transition-colors"
            >
              {tech.label}
            </button>
          ))}
        </div>
      );
    }

    if (actions === "track_retry") {
      return (
        <div className="flex gap-2 mt-2">
          <button
            onClick={startTrack}
            className="px-3 py-1.5 text-xs rounded-lg bg-white border border-primary/30 text-primary hover:bg-blue-50"
          >
            🔍 Try again
          </button>
          <button
            onClick={resetToDefault}
            className="px-3 py-1.5 text-xs rounded-lg bg-white border border-border hover:bg-muted"
          >
            🏠 Main Menu
          </button>
        </div>
      );
    }

    return null;
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
      >
        <div className="relative">
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="font-semibold text-sm">AI Grievance Assistant</div>
            <div className="text-[11px] text-white/80 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-300 rounded-full"></span> Online
              - AI-powered
            </div>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="p-1.5 hover:bg-white/20 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3 bg-muted/30">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-white rounded-br-sm"
                  : "bg-white border border-border text-foreground rounded-bl-sm"
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
              {msg.role === "bot" && renderActions(msg.actions)}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-white border border-border rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-3 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder="Type your question or describe your issue..."
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-input bg-muted/30 outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={() => handleSend(input)}
            className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={() =>
            addBot(
              "I'll connect you to a Customer Care Executive. Your chat history will be preserved. Please hold... (Estimated wait: 2 minutes)\n\n📞 Helpline: 1800-345-6789",
              "quick",
            )
          }
          className="mt-2 w-full flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-primary py-1"
        >
          <Phone className="w-3 h-3" /> Request transfer to live agent
        </button>
      </div>
    </div>
  );
}
