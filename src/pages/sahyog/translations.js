import { useLanguage } from "@/context/LanguageContext";

export const translations = {
  hi: {
    topBar: {
      helpline: "📞 हेल्पलाइन: 1100",
      available247: "24×7 / 365 दिन उपलब्ध",
      email: "ईमेल आईडी:",
      emailPlaceholder: "sahyoghelpline@bihar.gov.in",
      langSelect: "भाषा चुनें",
      noticeBadge: "सूचना",
      noticeText: "बिहार सहयोग पोर्टल एवं हेल्पलाइन 1100 (टोल-फ्री) नागरिकों की सेवा में 24×7 उपलब्ध है। अपनी शिकायत ऑनलाइन दर्ज करें अथवा स्थिति ट्रैक करें।",
    },
    header: {
      title: "बिहार सहयोग हेल्पलाइन",
      govt: "बिहार सरकार",
      citizenLogin: "नागरिक लॉगिन",
      officerLogin: "विभागीय लॉगिन",
      cceLogin: "कार्यालय लॉगिन",
    },
    navbar: {
      home: "मुख्य पृष्ठ",
      citizenServices: "नागरिक सेवाएं",
      newComplaint: "नई शिकायत दर्ज करें",
      registeredUser: "शिकायत की स्थिति देखें",
      importantLinks: "महत्वपूर्ण लिंक",
      faq: "अक्सर पूछे जाने वाले प्रश्न (FAQ)",
      rti: "आरटीआई (जानकारी पोर्टल)",
      privacy: "गोपनीयता नीति",
      accessibility: "सुलभता विवरण",
      contact: "संपर्क करें",
      sssPortal: "एसएसएस पोर्टल",
      stateLevelProgram: "राज्य स्तरीय सहयोग कार्यक्रम",
      vidyarthiProgram: "विद्यार्थी सहयोग कार्यक्रम",
    },
    stats: {
      receivedToday: "आज प्राप्त शिकायतें",
      promptlyRegistered: "त्वरित पंजीकृत",
      resolvedToday: "आज निष्पादित शिकायतें",
      actionCompleted: "कार्य पूर्ण",
      underInvestigation: "जांच / प्रक्रियाधीन",
      officerAssigned: "अधिकारी नियुक्त",
      overdueIssues: "अतिदेय मामले",
      withinDeadline: "समय सीमा के भीतर",
      totalLodged: "कुल पंजीकृत शिकायतें",
      totalResolved: "कुल निराकृत शिकायतें",
      grievanceStatus: "शिकायत की स्थिति देखें",
      registerGrievance: "शिकायत / मांग सुझाव दर्ज करें",
    },
    actionCards: {
      portalBadge: "नागरिक सेवा पोर्टल",
      heading: "प्रमुख त्वरित सेवाएं",
      card1Title: "शिकायत पंजीकरण",
      card1Desc:
        "ऑनलाइन शिकायत। हमारे डिजिटल पोर्टल के माध्यम से अपनी शिकायत दर्ज करें।",
      card1Btn: "शिकायत दर्ज करें",
      card2Title: "शिकायत की स्थिति देखें",
      card2Desc:
        "कार्यवाही का विवरण। मोबाइल के माध्यम से वर्तमान स्थिति जानें।",
      card2Btn: "स्थिति देखें",
      card3Title: "अनुस्मारक भेजें",
      card3Desc: "निर्धारित समय में कार्रवाई नहीं हुई? अनुस्मारक भेजें।",
      card3Btn: "अनुस्मारक भेजें",
      card4Title: "आपकी प्रतिक्रिया",
      card4Desc: "शिकायत के निपटारे के संबंध में अपनी प्रतिक्रिया / सुझाव दें।",
      card4Btn: "प्रतिक्रिया दें",
    },
    trackWidget: {
      heading: "शिकायत की स्थिति देखें",
      subheading:
        "स्थिति देखने के लिए अपनी शिकायत संख्या और सुरक्षा कोड दर्ज करें",
      trackingIdLabel: "शिकायत संख्या",
      trackingIdPlaceholder: "2026-000031",
      trackingIdFormat: "प्रारूप: BR-YYYY-XXXXXX (उदा. BR-2026-000031)",
      securityCodeLabel: "सुरक्षा कोड",
      securityCodePlaceholder: "सुरक्षा कोड दर्ज करें",
      btn: "स्थिति देखें",
      smsQuery: "त्वरित एसएमएस स्थिति जांच",
      downloadAtr: "कार्रवाई रिपोर्ट (ATR) डाउनलोड करें",
    },
    featuresAndFlow: {
      featuresTitle: "प्रमुख विशेषताएं",
      featuresSubtitle: "पोर्टल की मुख्य सुविधाएं एवं क्षमताएं",
      flowTitle: "यह कैसे कार्य करता है - उपयोगकर्ता प्रवाह",
      flowSubtitle: "शिकायत निवारण की संपूर्ण 4-चरणीय प्रक्रिया",
      secureBadge: "100% सुरक्षित एवं प्रमाणित रिकॉर्ड",
      slaNote: "औसत समाधान समय: 7-15 दिन",
      featuresList: [
        "शिकायतों का ऑनलाइन पंजीकरण",
        "विभागवार शिकायतों का त्वरित अग्रेषण",
        "समयबद्ध निवारण तंत्र (कानूनी समय सीमा)",
        "एसएमएस एवं ईमेल अलर्ट",
        "रियल-टाइम स्थिति ट्रैकिंग एवं ऑडिट ट्रेल",
        "नियम-आधारित बहुस्तरीय एस्केलेशन मैट्रिक्स",
        "नागरिक प्रतिक्रिया एवं संतुष्टि रेटिंग",
        "उच्चाधिकारियों द्वारा डैशबोर्ड निगरानी",
      ],
      steps: [
        {
          step: 1,
          title: "नागरिक ऑनलाइन शिकायत दर्ज करते हैं",
          desc: "नागरिक वेब पोर्टल या टोल फ्री हेल्पलाइन 1100 के माध्यम से स्थान और साक्ष्य के साथ शिकायत दर्ज करते हैं",
        },
        {
          step: 2,
          title: "विभागीय कार्रवाई एवं समाधान",
          desc: "शिकायत संबंधित विभाग को सौंपी जाती है",
        },
        {
          step: 3,
          title: "नागरिक प्रतिक्रिया एवं समापन",
          desc: "शिकायत को नागरिक की संतुष्टि की स्पष्ट पुष्टि के बाद ही बंद किया जाता है\nनोट: यदि समस्या का समाधान नहीं होता है तो नागरिक 7 दिनों के भीतर शिकायत पुनः खोल सकते हैं",
        },
        {
          step: 4,
          title: "ऑडिट, रिपोर्टिंग एवं निरंतर सुधार",
          desc: "सभी कार्रवाइयां, संचार और स्थिति परिवर्तन:\n  o सिस्टम में दर्ज (लॉग) होते हैं\n  o संपूर्ण ऑडिट ट्रेल बनाए रखने के लिए समय-मुद्रित (टाइम-स्टैम्प) होते हैं",
        },
      ],
    },
    faqs: {
      title: "अक्सर पूछे जाने वाले प्रश्न (FAQ)",
      subtitle: "बिहार सहयोग पोर्टल – दिशानिर्देश एवं आवश्यक जानकारियां",
      items: [
        {
          question: "1. बिहार सहयोग पोर्टल क्या है?",
          answer:
            "बिहार सहयोग पोर्टल बिहार सरकार का एक केंद्रीकृत डिजिटल मंच है, जो जन शिकायतों के पंजीकरण, निगरानी, ट्रैकिंग और समयबद्ध समाधान के लिए बनाया गया है।",
        },
        {
          question: "2. शिकायत कौन दर्ज करा सकता है?",
          answer:
            "कोई भी नागरिक निम्नलिखित से संबंधित शिकायत दर्ज करा सकता है:-\n• सरकारी योजनाएं\n• लोक सेवा वितरण\n• सेवाओं में अनावश्यक विलंब\n• बुनियादी ढांचा या नागरिक समस्याएं",
        },
        {
          question: "3. शिकायत किन माध्यमों से दर्ज कराई जा सकती है?",
          answer:
            "शिकायतें उपलब्ध माध्यमों से दर्ज कराई जा सकती हैं, जिनमें शामिल हैं:\n• टोल-फ्री नंबर\n• ऑनलाइन पोर्टल\n• चैटबॉट\n• आईवीआरएस (IVRS)\n• ईमेल\n• वॉयस / कॉल\n• सीसीई (कॉल सेंटर एग्जीक्यूटिव), यथोपयुक्त",
        },
        {
          question: "4. शिकायत दर्ज करने के लिए क्या जानकारी आवश्यक है?",
          answer:
            "शिकायतकर्ता को निम्नलिखित विवरण प्रदान करने की आवश्यकता हो सकती है:\n• नाम और संपर्क विवरण\n• पता / जिला / प्रखंड / पंचायत\n• संबंधित विभाग\n• शिकायत का विवरण\n• सहायक दस्तावेज, यदि लागू हो",
        },
        {
          question: "5. क्या शिकायत दर्ज करने के बाद पावती प्राप्त होगी?",
          answer:
            "हाँ। सफल पंजीकरण के बाद एक विशिष्ट शिकायत पंजीकरण संख्या (Grievance Registration Number) उत्पन्न होती है। पंजीकृत संपर्क विवरण पर एसएमएस/ईमेल के माध्यम से पावती भी भेजी जा सकती है।",
        },
        {
          question: "6. मैं अपनी शिकायत कैसे ट्रैक कर सकता हूँ?",
          answer:
            "नागरिक सहयोग पोर्टल के माध्यम से अपनी शिकायत पंजीकरण संख्या का उपयोग करके अपनी शिकायत को ट्रैक कर सकते हैं।",
        },
        {
          question: "7. क्या मैं बंद शिकायत को पुनः खोल सकता हूँ?",
          answer:
            "यदि नागरिक समाधान से संतुष्ट नहीं हैं, तो वे उपलब्ध रीओपन / अपील व्यवस्था का उपयोग कर सकते हैं।",
        },
        {
          question: "8. एस्केलेशन (अग्रेषण) व्यवस्था क्या है?",
          answer:
            "शिकायत निर्धारित एस्केलेशन पदानुक्रम के अनुसार आगे बढ़ सकती है, जैसे:\n• स्तर 1 – संबंधित अधिकारी\n• स्तर 2 – जिला प्राधिकारी\n• स्तर 3 – विभागीय प्राधिकारी / उच्च-स्तरीय निगरानी*",
        },
      ],
    },
    footer: {
      portalDesc:
        "बिहार सहयोग हेल्पलाइन बिहार सरकार का एक पारदर्शी एवं समयबद्ध डिजिटल माध्यम है, जो नागरिकों को उनकी समस्याओं के समाधान हेतु सीधे संबंधित विभागों से जोड़ता है।",
      keyLinks: "मुख्य लिंक",
      importantLinks: "महत्वपूर्ण लिंक",
      contactUs: "संपर्क करें",
      addressTitle: "आधिकारिक पता",
      tollFree: "टोल-फ्री: 1100",
      stateCallCenter: "24×7 / 365 दिन राज्य कॉल सेंटर",
      addressText: [
        "सहयोग हेल्पलाइन",
        "11वीं मंजिल, बिस्कोमान टॉवर",
        "पश्चिम गांधी मैदान",
        "पटना, बिहार - 800001",
      ],
      copyright: "© बिहार सरकार | सर्वाधिकार सुरक्षित",
      developedBy: "BSEDC (BELTRON)",
      disclaimer:
        "अस्वीकरण : इस वेबसाइट पर उपलब्ध अंग्रेजी सामग्री को आधिकारिक और प्रामाणिक संस्करण माना जाएगा। हिंदी सामग्री केवल अनुवाद और उपयोगकर्ता की सुविधा के लिए प्रदान की गई है। किसी भी विसंगति या व्याख्या में अंतर की स्थिति में अंग्रेजी संस्करण मान्य होगा।",
    },
  },
  en: {
    topBar: {
      helpline: "📞 Helpline: 1100",
      available247: "Available 24×7 / 365 Days",
      email: "Email ID:",
      emailPlaceholder: "sahyoghelpline@bihar.gov.in",
      langSelect: "Select Language",
      noticeBadge: "Notice",
      noticeText: "Bihar Sahyog Portal & Helpline 1100 (Toll-Free) is available 24×7 for citizen assistance. Register your grievance online or track grievance status in real-time.",
    },
    header: {
      title: "Bihar Sahyog Helpline",
      govt: "Government of Bihar",
      citizenLogin: "Citizen Login",
      officerLogin: "Department Login",
      cceLogin: "Office Login",
    },
    navbar: {
      home: "Home Page",
      citizenServices: "Citizen Services",
      newComplaint: "New Complaint",
      registeredUser: "Check Complaint Status",
      importantLinks: "Important Links",
      faq: "FAQ",
      rti: "RTI (Jaankari Portal)",
      privacy: "Privacy Policy",
      accessibility: "Accessibility Statement",
      contact: "Contact Us",
      sssPortal: "SSS Portal",
      stateLevelProgram: "State Level Sahyog Program",
      vidyarthiProgram: "Vidyarthi Sahyog Karyakram",
    },
    stats: {
      receivedToday: "Complaints Received Today",
      promptlyRegistered: "Promptly Registered",
      resolvedToday: "Resolved Today",
      actionCompleted: "Action Completed",
      underInvestigation: "Under Investigation",
      officerAssigned: "Officer Assigned",
      overdueIssues: "Overdue Issues",
      withinDeadline: "Within Deadline",
      totalLodged: "Total registered complaints",
      totalResolved: "Total resolved complaints",
      grievanceStatus: "Check Complaint Status",
      registerGrievance: "Register complaint / demand suggestion",
    },
    actionCards: {
      portalBadge: "Citizen Services Portal",
      heading: "Key Quick Services",
      card1Title: "Complaint Registration",
      card1Desc:
        "Complaint Online. File your complaint through our digital portal.",
      card1Btn: "Register Complaint",
      card2Title: "Check Complaint Status",
      card2Desc:
        "Details of proceedings. Know the current status through mobile.",
      card2Btn: "View Status",
      card3Title: "Send Reminder",
      card3Desc:
        "Failure to take action within stipulated time? Send a reminder.",
      card3Btn: "Send Reminder",
      card4Title: "Your Feedback",
      card4Desc:
        "Regarding disposal of complaint. Give your feedback/suggestions.",
      card4Btn: "Give Feedback",
    },
    trackWidget: {
      heading: "Check complaint status",
      subheading:
        "Enter your complaint number and security code to view status",
      trackingIdLabel: "Complaint number",
      trackingIdPlaceholder: "2026-000031",
      trackingIdFormat: "Format: BR-YYYY-XXXXXX (e.g. BR-2026-000031)",
      securityCodeLabel: "Security Code",
      securityCodePlaceholder: "Enter security code",
      btn: "Check complaint status",
      smsQuery: "Instant SMS Status Query",
      downloadAtr: "Download Action Taken Report (ATR)",
    },
    featuresAndFlow: {
      featuresTitle: "Key Features",
      featuresSubtitle: "Core platform capabilities & infrastructure",
      flowTitle: "How It Works - user flow",
      flowSubtitle: "End to end 4 step Grievance disposal lifecycle",
      secureBadge: "100% Secure & Tamper-Proof Logs",
      slaNote: "Average SLA Resolution: 7-15 Days",
      featuresList: [
        "Online Registration of Grievances",
        "Department-wise Grievance Forwarding",
        "Time-bound Disposal Mechanism (SLA Driven)",
        "Instant SMS & Email Alerts",
        "Real-Time Status Tracking & Audit Trail",
        "Rule-based Multi-tier Escalation Matrix",
        "Citizen Feedback & Rating System",
        "Centralized Dashboard & Leadership Monitoring",
      ],
      steps: [
        {
          step: 1,
          title: "Citizen register grievance online",
          desc: "Citizen submit complaint via web portal or toll free helpline 1100 with location and evidence",
        },
        {
          step: 2,
          title: "Departmental Action and Resolution",
          desc: "The grievance is assigned to the designated Department",
        },
        {
          step: 3,
          title: "Citizen Feedback and Closure",
          desc: "A grievance is closed only after explicit confirmation of citizen satisfaction\nNote: The citizen can reopen the grievance within 7 days if is not rectified",
        },
        {
          step: 4,
          title: "Audit, Reporting and Continuous Improvement",
          desc: "All actions, communications and status changes are:\no Logged in the system\no Time-stamped to maintain a complete audit trail",
        },
      ],
    },
    faqs: {
      title: "Frequently Asked Questions (FAQ)",
      subtitle: "Bihar Sahyog Portal – Guidelines & Information",
      items: [
        {
          question: "1. What is Bihar Sahyog Portal?",
          answer:
            "Bihar Sahyog Portal is a centralized digital platform of the Government of Bihar for registration, monitoring, tracking, and time-bound resolution of public grievances.",
        },
        {
          question: "2. Who can file a grievance?",
          answer:
            "Any citizen can file a grievance related to:-\n• Government schemes\n• Public services delivery\n• Delays in services\n• Infrastructure or civic issues",
        },
        {
          question: "3. Through which channels can grievances be filed?",
          answer:
            "Grievances can be registered through the available channels, including:\n• Toll free number\n• Online Portal\n• Chatbot\n• IVRS\n• Email\n• Voice/Call\n• CCE (Citizen/Call Centre Executive), as applicable",
        },
        {
          question: "4. What information is required to file a grievance?",
          answer:
            "The complainant may be required to provide:\n• Name and contact details\n• Address/District/Block/panchyat\n• Concerned Department\n• Description of the grievance\n• Supporting documents, if applicable",
        },
        {
          question: "5. Will I receive an acknowledgement after submission?",
          answer:
            "Yes. After successful registration, a unique Grievance Registration Number is generated. An acknowledgement may also be sent through SMS/Email to the registered contact details.",
        },
        {
          question: "6. How can I track my grievance?",
          answer:
            "Citizens can track their grievance by using the Grievance Registration Number through the Sahyog Portal.",
        },
        {
          question: "7. Can I reopen a closed grievance?",
          answer:
            "If the citizen is not satisfied with the resolution, they may use the available reopen/appeal mechanism.",
        },
        {
          question: "8. What is the escalation mechanism?",
          answer:
            "The grievance may move through the defined escalation hierarchy, such as:\n• Level 1 – Concerned Officer\n• Level 2 – District Authority\n• Level 3 – Departmental Authority / Higher-Level Monitoring*",
        },
      ],
    },
    footer: {
      portalDesc:
        "Bihar Sahyog Helpline provides a transparent and efficient platform for citizens to register and track complaints online. The system ensures timely resolution of grievances by connecting citizens directly with concerned departments through a structured digital workflow.",
      keyLinks: "Key Links",
      importantLinks: "Important Links",
      contactUs: "Contact Us",
      addressTitle: "Official Address",
      tollFree: "Toll Free: 1100",
      stateCallCenter: "24×7 / 365 Days State Call Center",
      addressText: [
        "Sahyog Helpline",
        "11th Floor, Biscomaun Tower",
        "West Gandhi Maidan",
        "Patna, Bihar - 800001",
      ],
      copyright: "© Government of Bihar | All Rights Reserved",
      developedBy: "BSEDC (BELTRON)",
      disclaimer:
        "Disclaimer: The English content available on this website shall be treated as the official and authentic version. The Hindi content is provided solely for translation and user convenience purposes. In case of any discrepancy, inconsistency, or difference in interpretation, the English version shall prevail.",
    },
  },
};

export function useSahyogTranslation() {
  const langContext = useLanguage();
  const rawLang = langContext?.lang || "Hindi";
  const lang = rawLang === "Hindi" || rawLang === "hi" ? "hi" : "en";
  const t = translations[lang] || translations.en;
  return {
    lang,
    t,
    setLang: langContext?.setLang,
    toggle: langContext?.toggle,
  };
}
