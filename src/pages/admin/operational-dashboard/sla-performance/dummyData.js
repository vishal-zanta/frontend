/**
 * SLA Performance Dummy Data for Operational Dashboard
 * Real-world services categorized by Bihar Government Departments
 * Sourced from departmental services directory and backend records.
 *
 * NOTE: For each department, the worst performing service (lowest SLA compliance)
 * has the shortest concise name (e.g., Road, Motor, Meter, Cyber, Seeds, Pond, Hostel, MPLADS, Pension)
 * so it displays cleanly on a single line in KPI StatCards, graphs, and tables.
 */

export const DEPARTMENTS_SLA_CONFIG = [
  {
    id: "6a673d4839d3ba640dabe9f0",
    key: "phed",
    title: "Public health engineering department(PHED)",
    titleHindi: "लोक स्वास्थ्य अभियंत्रण विभाग",
    services: [
      {
        id: "phed_1",
        service: "Motor Burnt / Defective Pump",
        serviceHindi: "पानी के मोटर का जल जाना",
        shortName: "Motor",
        shortNameHindi: "मोटर",
        withinSLA: 1420,
        beyondSLA: 230, // 86.1% - Shortest & Worst in PHED
      },
      {
        id: "phed_2",
        service: "Leakage in Pipe",
        serviceHindi: "पाइप में लीकेज/रिसाव",
        shortName: "Pipe Leakage",
        shortNameHindi: "पाइप लीकेज",
        withinSLA: 4820,
        beyondSLA: 240, // 95.3%
      },
      {
        id: "phed_3",
        service: "Operator Absent / Motor Not Running",
        serviceHindi: "ऑपरेटर अनुपस्थित / मोटर न चलाना",
        shortName: "Operator Absent",
        shortNameHindi: "ऑपरेटर अनुपस्थित",
        withinSLA: 3210,
        beyondSLA: 180, // 94.7%
      },
      {
        id: "phed_4",
        service: "No Power Supply to Motor",
        serviceHindi: "मोटर को बिजली की आपूर्ति नहीं होना",
        shortName: "Motor Power",
        shortNameHindi: "मोटर बिजली",
        withinSLA: 2450,
        beyondSLA: 135, // 94.8%
      },
      {
        id: "phed_5",
        service: "Hand Pump / Tube Well Problem",
        serviceHindi: "हैंडपंप / नलकूप संबंधी समस्या",
        shortName: "Hand Pump",
        shortNameHindi: "हैंडपंप",
        withinSLA: 3640,
        beyondSLA: 220, // 94.3%
      },
      {
        id: "phed_6",
        service: "Water Quality & Contamination Problem",
        serviceHindi: "जल गुणवत्ता एवं दूषित जल समस्या",
        shortName: "Water Quality",
        shortNameHindi: "जल गुणवत्ता",
        withinSLA: 1420,
        beyondSLA: 85, // 94.4%
      },
      {
        id: "phed_7",
        service: "Piped Water Supply Disruption",
        serviceHindi: "पाइप जलापूर्ति में व्यवधान",
        shortName: "Piped Water",
        shortNameHindi: "पाइप जलापूर्ति",
        withinSLA: 3950,
        beyondSLA: 260, // 93.8%
      },
      {
        id: "phed_8",
        service: "Water Tanker Supply Request",
        serviceHindi: "पेयजल टैंकर आपूर्ति अनुरोध",
        shortName: "Tanker Supply",
        shortNameHindi: "टैंकर मांग",
        withinSLA: 980,
        beyondSLA: 45, // 95.6%
      },
      {
        id: "phed_9",
        service: "Pipeline Extension & New Tap Request",
        serviceHindi: "पाइपलाइन विस्तार एवं नया नल कनेक्शन",
        shortName: "Tap Request",
        shortNameHindi: "नल कनेक्शन",
        withinSLA: 2150,
        beyondSLA: 140, // 93.9%
      },
      {
        id: "phed_10",
        service: "Hand Pump Reboring Request",
        serviceHindi: "हैंडपंप रीबोरिंग मांग",
        shortName: "Pump Reboring",
        shortNameHindi: "पंप रीबोरिंग",
        withinSLA: 1180,
        beyondSLA: 90, // 92.9%
      },
    ],
  },
  {
    id: "6aad1fd8153f7c5af73a7934",
    key: "energy",
    title: "Energy Department",
    titleHindi: "ऊर्जा विभाग",
    services: [
      {
        id: "energy_1",
        service: "Defective / Fast Running Energy Meter",
        serviceHindi: "खराब / तेज चलने वाले मीटर की जांच",
        shortName: "Meter",
        shortNameHindi: "मीटर",
        withinSLA: 1820,
        beyondSLA: 310, // 85.4% - Shortest & Worst in Energy
      },
      {
        id: "energy_2",
        service: "Defect in Transformer / Replacement Delay",
        serviceHindi: "ट्रांसफॉर्मर में खराबी एवं बदले जाने में विलंब",
        shortName: "Transformer",
        shortNameHindi: "ट्रांसफॉर्मर",
        withinSLA: 2850,
        beyondSLA: 240, // 92.2%
      },
      {
        id: "energy_3",
        service: "Electricity Bill Discrepancy & Overbilling",
        serviceHindi: "बिजली बिल में गड़बड़ी एवं अधिक बिलिंग",
        shortName: "Bill Dispute",
        shortNameHindi: "बिल विवाद",
        withinSLA: 5420,
        beyondSLA: 230, // 95.9%
      },
      {
        id: "energy_4",
        service: "Low Voltage & Frequent Outages",
        serviceHindi: "कम वोल्टेज एवं बार-बार बिजली कटौती",
        shortName: "Low Voltage",
        shortNameHindi: "कम वोल्टेज",
        withinSLA: 3980,
        beyondSLA: 220, // 94.8%
      },
      {
        id: "energy_5",
        service: "Delay in New Electricity Connection",
        serviceHindi: "नया बिजली कनेक्शन देने में विलंब",
        shortName: "New Connection",
        shortNameHindi: "नया कनेक्शन",
        withinSLA: 3410,
        beyondSLA: 180, // 95.0%
      },
      {
        id: "energy_6",
        service: "Hanging / Loose Overhead Wires Hazard",
        serviceHindi: "झूलते हुए बिजली तारों से खतरा",
        shortName: "Loose Wires",
        shortNameHindi: "झूलते तार",
        withinSLA: 2150,
        beyondSLA: 160, // 93.1%
      },
      {
        id: "energy_7",
        service: "Illegal Electricity Connection / Power Theft",
        serviceHindi: "गैर-कानूनी बिजली कनेक्शन / बिजली चोरी",
        shortName: "Power Theft",
        shortNameHindi: "बिजली चोरी",
        withinSLA: 1890,
        beyondSLA: 150, // 92.6%
      },
      {
        id: "energy_8",
        service: "Rural Feeder Tripping & Maintenance",
        serviceHindi: "ग्रामीण फीडर ब्रेकडाउन एवं रखरखाव",
        shortName: "Feeder Breakdown",
        shortNameHindi: "फीडर ब्रेकडाउन",
        withinSLA: 2340,
        beyondSLA: 160, // 93.6%
      },
      {
        id: "energy_9",
        service: "Phase Failure & Single Phasing Issue",
        serviceHindi: "फेज फेल्योर एवं सिंगल फेजिंग समस्या",
        shortName: "Phase Failure",
        shortNameHindi: "फेज फेल्योर",
        withinSLA: 1450,
        beyondSLA: 95, // 93.9%
      },
      {
        id: "energy_10",
        service: "Agricultural Pump Electricity Connection",
        serviceHindi: "कृषि पंप विद्युत कनेक्शन समस्या",
        shortName: "Agri Connection",
        shortNameHindi: "कृषि कनेक्शन",
        withinSLA: 2180,
        beyondSLA: 150, // 93.6%
      },
    ],
  },
  {
    id: "6aa00df530deb4f1342d84e0",
    key: "home",
    title: "Home Department",
    titleHindi: "गृह विभाग",
    services: [
      {
        id: "home_1",
        service: "Cyber Crime & Online Financial Fraud",
        serviceHindi: "साइबर अपराध एवं ऑनलाइन वित्तीय धोखाधड़ी",
        shortName: "Cyber",
        shortNameHindi: "साइबर",
        withinSLA: 1980,
        beyondSLA: 330, // 85.7% - Shortest & Worst in Home
      },
      {
        id: "home_2",
        service: "Threat / Danger to Life & Property",
        serviceHindi: "जान - माल का खतरा / धमकी से संबंधित",
        shortName: "Threat to Life",
        shortNameHindi: "धमकी",
        withinSLA: 3120,
        beyondSLA: 180, // 94.5%
      },
      {
        id: "home_3",
        service: "Extortion of Money / Threat Demands",
        serviceHindi: "अपराध-धन के लिए भयादोहन / रंगदारी",
        shortName: "Extortion",
        shortNameHindi: "रंगदारी",
        withinSLA: 2450,
        beyondSLA: 190, // 92.8%
      },
      {
        id: "home_4",
        service: "Land Dispute & Law and Order Maintenance",
        serviceHindi: "भूमि विवाद एवं विधि-व्यवस्था समस्या",
        shortName: "Land Dispute",
        shortNameHindi: "भूमि विवाद",
        withinSLA: 4890,
        beyondSLA: 380, // 92.8%
      },
      {
        id: "home_5",
        service: "Delay in Police Investigation / Charge Sheet",
        serviceHindi: "अनुसंधान / आरोप पत्र में विलंब",
        shortName: "Investigation",
        shortNameHindi: "जांच",
        withinSLA: 3260,
        beyondSLA: 310, // 91.3%
      },
      {
        id: "home_6",
        service: "Family Dispute & Domestic Grievance",
        serviceHindi: "पारिवारिक विवाद एवं घरेलू शिकायत",
        shortName: "Family Dispute",
        shortNameHindi: "पारिवारिक विवाद",
        withinSLA: 2980,
        beyondSLA: 190, // 94.0%
      },
      {
        id: "home_7",
        service: "Police Incompetence / Inaction Complaint",
        serviceHindi: "पुलिस निष्क्रियता / अक्षमता संबंधी शिकायत",
        shortName: "Police Inaction",
        shortNameHindi: "निष्क्रियता",
        withinSLA: 2150,
        beyondSLA: 210, // 91.1%
      },
      {
        id: "home_8",
        service: "Police Verification for Passport / Employment",
        serviceHindi: "पासपोर्ट / नौकरी हेतु पुलिस सत्यापन",
        shortName: "Verification",
        shortNameHindi: "सत्यापन",
        withinSLA: 6420,
        beyondSLA: 210, // 96.8%
      },
      {
        id: "home_9",
        service: "Traffic Congestion & Violation Regulation",
        serviceHindi: "यातायात जाम एवं उल्लंघन नियमन",
        shortName: "Traffic Regulation",
        shortNameHindi: "यातायात",
        withinSLA: 2650,
        beyondSLA: 145, // 94.8%
      },
      {
        id: "home_10",
        service: "Arms License Verification & Renewal",
        serviceHindi: "शस्त्र अनुज्ञप्ति सत्यापन एवं नवीनीकरण",
        shortName: "Arms License",
        shortNameHindi: "शस्त्र लाइसेंस",
        withinSLA: 1840,
        beyondSLA: 110, // 94.4%
      },
    ],
  },
  {
    id: "6aa00df330deb4f1342d84cd",
    key: "agriculture",
    title: "Agriculture Department",
    titleHindi: "कृषि विभाग",
    services: [
      {
        id: "agri_1",
        service: "Supply of Certified Seeds & Fertilizers",
        serviceHindi: "खाद / प्रमाणित बीज की आपूर्ति में कठिनाई",
        shortName: "Seeds",
        shortNameHindi: "बीज",
        withinSLA: 1920,
        beyondSLA: 320, // 85.7% - Shortest & Worst in Agriculture
      },
      {
        id: "agri_2",
        service: "Crop Damage / Disaster Compensation",
        serviceHindi: "फसल बर्बादी / प्राकृतिक आपदा क्षतिपूर्ति",
        shortName: "Crop Damage",
        shortNameHindi: "फसल क्षति",
        withinSLA: 3450,
        beyondSLA: 240, // 93.5%
      },
      {
        id: "agri_3",
        service: "Agricultural Machinery Subsidy Scheme",
        serviceHindi: "कृषि यंत्र अनुदान योजना संबंधी परिवाद",
        shortName: "Machinery",
        shortNameHindi: "कृषि यंत्र",
        withinSLA: 2890,
        beyondSLA: 180, // 94.1%
      },
      {
        id: "agri_4",
        service: "PM Kisan Samman Nidhi Verification & e-KYC",
        serviceHindi: "पीएम किसान सम्मान निधि सत्यापन एवं ई-केवाईसी",
        shortName: "PM Kisan",
        shortNameHindi: "पीएम किसान",
        withinSLA: 5620,
        beyondSLA: 290, // 95.1%
      },
      {
        id: "agri_5",
        service: "Soil Health Card & Testing Services",
        serviceHindi: "मृदा स्वास्थ्य कार्ड एवं जांच सुविधा",
        shortName: "Soil Card",
        shortNameHindi: "मृदा कार्ड",
        withinSLA: 2140,
        beyondSLA: 95, // 95.7%
      },
      {
        id: "agri_6",
        service: "Diesel Subsidy for Irrigation",
        serviceHindi: "सिंचाई हेतु डीजल अनुदान योजना",
        shortName: "Diesel Subsidy",
        shortNameHindi: "डीजल अनुदान",
        withinSLA: 3780,
        beyondSLA: 215, // 94.6%
      },
      {
        id: "agri_7",
        service: "Krishi Input Subsidy Disbursement",
        serviceHindi: "कृषि इनपुट अनुदान वितरण संबंधी समस्या",
        shortName: "Input Subsidy",
        shortNameHindi: "इनपुट अनुदान",
        withinSLA: 3150,
        beyondSLA: 190, // 94.3%
      },
      {
        id: "agri_8",
        service: "Organic Farming Promotion & Certification",
        serviceHindi: "जैविक खेती प्रोत्साहन एवं प्रमाणीकरण",
        shortName: "Organic Farming",
        shortNameHindi: "जैविक खेती",
        withinSLA: 1650,
        beyondSLA: 75, // 95.7%
      },
      {
        id: "agri_9",
        service: "Micro Irrigation (Drip/Sprinkler) Assistance",
        serviceHindi: "सूक्ष्म सिंचाई (ड्रिप/स्प्रिंकलर) सहायता",
        shortName: "Micro Irrigation",
        shortNameHindi: "सूक्ष्म सिंचाई",
        withinSLA: 1890,
        beyondSLA: 110, // 94.5%
      },
      {
        id: "agri_10",
        service: "Cold Storage & Produce Storage Linkage",
        serviceHindi: "शीतगृह एवं उपज भंडारण सहायता",
        shortName: "Cold Storage",
        shortNameHindi: "शीतगृह",
        withinSLA: 1240,
        beyondSLA: 85, // 93.6%
      },
    ],
  },
  {
    id: "6aa00df130deb4f1342d84b2",
    key: "sc_st_welfare",
    title: "SC-ST welfare Department",
    titleHindi: "अनुसूचित जाति एवं अनुसूचित जनजाति कल्याण विभाग",
    services: [
      {
        id: "scst_1",
        service: "Hostel Accommodation & Living Amenities",
        serviceHindi: "छात्रावास आवास एवं बुनियादी सुविधाएँ",
        shortName: "Hostel",
        shortNameHindi: "छात्रावास",
        withinSLA: 1850,
        beyondSLA: 290, // 86.4% - Shortest & Worst in SC-ST Welfare
      },
      {
        id: "scst_2",
        service: "Post-Matric Scholarship Disbursement",
        serviceHindi: "पोस्ट-मैट्रिक छात्रवृत्ति वितरण संबंधी समस्या",
        shortName: "Post-Matric",
        shortNameHindi: "पोस्ट-मैट्रिक",
        withinSLA: 4320,
        beyondSLA: 210, // 95.4%
      },
      {
        id: "scst_3",
        service: "Atrocities Prevention Compensation & Relief",
        serviceHindi: "अत्याचार निवारण मुआवजा एवं सहायता",
        shortName: "Atrocity Relief",
        shortNameHindi: "अत्याचार निवारण",
        withinSLA: 2180,
        beyondSLA: 180, // 92.4%
      },
      {
        id: "scst_4",
        service: "SC-ST Co-operative Development Loans",
        serviceHindi: "अनुसूचित जाति सहकारिता विकास ऋण योजना",
        shortName: "Co-op Loans",
        shortNameHindi: "सहकारिता ऋण",
        withinSLA: 2120,
        beyondSLA: 145, // 93.6%
      },
      {
        id: "scst_5",
        service: "Admission Difficulties in Educational Inst.",
        serviceHindi: "शैक्षणिक संस्थानों में नामांकन में कठिनाई",
        shortName: "Admission",
        shortNameHindi: "नामांकन",
        withinSLA: 1760,
        beyondSLA: 95, // 94.9%
      },
      {
        id: "scst_6",
        service: "Pre-Matric Scholarship Scheme for SC/ST",
        serviceHindi: "प्री-मैट्रिक छात्रवृत्ति योजना",
        shortName: "Pre-Matric",
        shortNameHindi: "प्री-मैट्रिक",
        withinSLA: 3640,
        beyondSLA: 165, // 95.7%
      },
      {
        id: "scst_7",
        service: "Mukhyamantri SC-ST Medhavritti Yojana",
        serviceHindi: "मुख्यमंत्री एससी-एसटी मेधावृत्ति योजना",
        shortName: "Medhavritti",
        shortNameHindi: "मेधावृत्ति",
        withinSLA: 2890,
        beyondSLA: 130, // 95.7%
      },
      {
        id: "scst_8",
        service: "Residential School (Ambedkar Awasiya) Mgt.",
        serviceHindi: "आवासीय विद्यालय प्रबंधन संबंधी शिकायत",
        shortName: "School Mgt",
        shortNameHindi: "विद्यालय प्रबंधन",
        withinSLA: 1940,
        beyondSLA: 115, // 94.4%
      },
      {
        id: "scst_9",
        service: "Skill Training & Placement Support",
        serviceHindi: "कौशल प्रशिक्षण एवं नियोजन सहायता",
        shortName: "Skill Training",
        shortNameHindi: "कौशल प्रशिक्षण",
        withinSLA: 1520,
        beyondSLA: 80, // 95.0%
      },
      {
        id: "scst_10",
        service: "Homestead Land Settlement (Vasgit Parcha)",
        serviceHindi: "भूमिहीन परिवारों को वासगीत पर्चा आवंटन",
        shortName: "Land Parcha",
        shortNameHindi: "वासगीत पर्चा",
        withinSLA: 2180,
        beyondSLA: 160, // 93.2%
      },
    ],
  },
  {
    id: "6aa00dee30deb4f1342d8497",
    key: "urban_development",
    title: "Urban development & housing Department",
    titleHindi: "नगर विकास एवं आवास विभाग",
    services: [
      {
        id: "urban_1",
        service: "Municipal Road & Pavement Repair",
        serviceHindi: "शहरी सड़क एवं फुटपाथ मरम्मत",
        shortName: "Road",
        shortNameHindi: "सड़क",
        withinSLA: 1980,
        beyondSLA: 380, // 83.9% - Shortest & Worst in Urban Dev AND Worst Overall
      },
      {
        id: "urban_2",
        service: "Municipal Solid Waste & Garbage Removal",
        serviceHindi: "सफाई / कचरा प्रबंधन एवं निष्पादन",
        shortName: "Sanitation",
        shortNameHindi: "सफाई",
        withinSLA: 5840,
        beyondSLA: 320, // 94.8%
      },
      {
        id: "urban_3",
        service: "Removal of Illegal Encroachment on Roads",
        serviceHindi: "सड़क / सार्वजनिक भूमि से अतिक्रमण हटाना",
        shortName: "Encroachment",
        shortNameHindi: "अतिक्रमण",
        withinSLA: 3120,
        beyondSLA: 240, // 92.9%
      },
      {
        id: "urban_4",
        service: "Water Supply System in Urban Local Bodies",
        serviceHindi: "शहरी क्षेत्रों में जलापूर्ति व्यवस्था",
        shortName: "Water Supply",
        shortNameHindi: "शहरी जलापूर्ति",
        withinSLA: 4210,
        beyondSLA: 250, // 94.4%
      },
      {
        id: "urban_5",
        service: "Street Light Installation & Fault Repair",
        serviceHindi: "स्ट्रीट लाइट अधिष्ठापन एवं मरम्मत",
        shortName: "Street Light",
        shortNameHindi: "स्ट्रीट लाइट",
        withinSLA: 4950,
        beyondSLA: 260, // 95.0%
      },
      {
        id: "urban_6",
        service: "Pradhan Mantri Awas Yojana (Urban) Housing",
        serviceHindi: "प्रधानमंत्री आवास योजना (शहरी) किस्त/स्वीकृति",
        shortName: "PMAY Urban",
        shortNameHindi: "पीएमएवाई शहरी",
        withinSLA: 3760,
        beyondSLA: 210, // 94.7%
      },
      {
        id: "urban_7",
        service: "Drainage Desilting & Waterlogging Removal",
        serviceHindi: "नाला उड़ाही एवं जलजमाव निवारण",
        shortName: "Drainage",
        shortNameHindi: "नाला उड़ाही",
        withinSLA: 3420,
        beyondSLA: 260, // 92.9%
      },
      {
        id: "urban_8",
        service: "Property Tax Assessment & Mutation",
        serviceHindi: "संपत्ति कर निर्धारण एवं दाखिल-खारिज",
        shortName: "Property Tax",
        shortNameHindi: "संपत्ति कर",
        withinSLA: 3120,
        beyondSLA: 150, // 95.4%
      },
      {
        id: "urban_9",
        service: "Trade License Issuance & Renewal",
        serviceHindi: "ट्रेड लाइसेंस निर्गमन एवं नवीनीकरण",
        shortName: "Trade License",
        shortNameHindi: "ट्रेड लाइसेंस",
        withinSLA: 2450,
        beyondSLA: 95, // 96.3%
      },
      {
        id: "urban_10",
        service: "Public Toilet Sanitation & Water Facility",
        serviceHindi: "सार्वजनिक शौचालय सफाई एवं जल सुविधा",
        shortName: "Public Toilet",
        shortNameHindi: "सामुदायिक शौचालय",
        withinSLA: 1980,
        beyondSLA: 130, // 93.8%
      },
    ],
  },
  {
    id: "6aa00ded30deb4f1342d848c",
    key: "planning_development",
    title: "Planning and development Department",
    titleHindi: "योजना एवं विकास विभाग",
    services: [
      {
        id: "plan_1",
        service: "MP Local Area Development Scheme (MPLADS)",
        serviceHindi: "सांसद स्थानीय क्षेत्र विकास योजना (एमपीलैड्स)",
        shortName: "MPLADS",
        shortNameHindi: "सांसद निधि",
        withinSLA: 1680,
        beyondSLA: 220, // 88.4% - Shortest & Worst in Planning
      },
      {
        id: "plan_2",
        service: "Chief Minister Area Development Scheme",
        serviceHindi: "मुख्यमंत्री क्षेत्र विकास योजना संबंधी",
        shortName: "CM Area Dev",
        shortNameHindi: "सीएम क्षेत्र विकास",
        withinSLA: 2480,
        beyondSLA: 120, // 95.4%
      },
      {
        id: "plan_3",
        service: "Registration of Birth and Death Certificates",
        serviceHindi: "जन्म एवं मृत्यु प्रमाण पत्र निबंधन एवं निर्गमन",
        shortName: "Birth/Death",
        shortNameHindi: "जन्म-मृत्यु",
        withinSLA: 5420,
        beyondSLA: 180, // 96.8%
      },
      {
        id: "plan_4",
        service: "Panchayat Sarkar Bhavan Construction & Mgt",
        serviceHindi: "पंचायत सरकार भवन निर्माण एवं संचालन",
        shortName: "Panchayat",
        shortNameHindi: "पंचायत भवन",
        withinSLA: 2150,
        beyondSLA: 130, // 94.3%
      },
      {
        id: "plan_5",
        service: "E-Kisan Bhavan Implementation & Handover",
        serviceHindi: "ई-किसान भवन क्रियान्वयन एवं संचालन",
        shortName: "E-Kisan Bhavan",
        shortNameHindi: "ई-किसान भवन",
        withinSLA: 1450,
        beyondSLA: 85, // 94.5%
      },
      {
        id: "plan_6",
        service: "District Decentralized Planning Projects",
        serviceHindi: "जिला विकेंद्रीकृत योजना कार्यान्वयन",
        shortName: "District Plan",
        shortNameHindi: "जिला योजना",
        withinSLA: 1780,
        beyondSLA: 95, // 94.9%
      },
      {
        id: "plan_7",
        service: "Evaluation of State Development Schemes",
        serviceHindi: "राज्य विकास योजनाओं का मूल्यांकन",
        shortName: "Scheme Eval",
        shortNameHindi: "मूल्यांकन",
        withinSLA: 1240,
        beyondSLA: 60, // 95.4%
      },
      {
        id: "plan_8",
        service: "Border Area Development Programme (BADP)",
        serviceHindi: "सीमावर्ती क्षेत्र विकास कार्यक्रम",
        shortName: "Border Dev",
        shortNameHindi: "सीमा क्षेत्र विकास",
        withinSLA: 1560,
        beyondSLA: 90, // 94.5%
      },
      {
        id: "plan_9",
        service: "Aspirational Block Development Programme",
        serviceHindi: "आकांक्षी प्रखंड विकास कार्यक्रम अनुश्रवण",
        shortName: "Aspirational",
        shortNameHindi: "आकांक्षी प्रखंड",
        withinSLA: 1980,
        beyondSLA: 105, // 95.0%
      },
      {
        id: "plan_10",
        service: "Statistical Data & Survey Verification",
        serviceHindi: "सांख्यिकी आंकड़े एवं सर्वेक्षण सत्यापन",
        shortName: "Survey Data",
        shortNameHindi: "सांख्यिकी सर्वेक्षण",
        withinSLA: 1320,
        beyondSLA: 55, // 96.0%
      },
    ],
  },
  {
    id: "6aa00dea30deb4f1342d846c",
    key: "social_welfare",
    title: "Social welfare Department",
    titleHindi: "समाज कल्याण विभाग",
    services: [
      {
        id: "soc_1",
        service: "Mukhyamantri Vridhjan Pension Yojana (Old Age)",
        serviceHindi: "मुख्यमंत्री वृद्धजन पेंशन योजना भुगतान समस्या",
        shortName: "Pension",
        shortNameHindi: "पेंशन",
        withinSLA: 2450,
        beyondSLA: 360, // 87.2% - Shortest & Worst in Social Welfare
      },
      {
        id: "soc_2",
        service: "Divyang (Disability) Pension & Aid Scheme",
        serviceHindi: "दिव्यांग पेंशन एवं सहायक उपकरण योजना",
        shortName: "Disability Aid",
        shortNameHindi: "दिव्यांग पेंशन",
        withinSLA: 4210,
        beyondSLA: 240, // 94.6%
      },
      {
        id: "soc_3",
        service: "Anganwadi Center Selection & Operations",
        serviceHindi: "आंगनवाड़ी सेविका/सहायिका चयन एवं संचालन",
        shortName: "Anganwadi",
        shortNameHindi: "आंगनवाड़ी",
        withinSLA: 3780,
        beyondSLA: 220, // 94.5%
      },
      {
        id: "soc_4",
        service: "Supplementary Nutrition (THR) Distribution",
        serviceHindi: "पोषाहार (टीएचआर) वितरण संबंधी शिकायत",
        shortName: "Nutrition",
        shortNameHindi: "पोषाहार",
        withinSLA: 4560,
        beyondSLA: 260, // 94.6%
      },
      {
        id: "soc_5",
        service: "Child Protection & Juvenile Justice Care",
        serviceHindi: "बाल संरक्षण एवं देखरेख सेवाएं",
        shortName: "Child Care",
        shortNameHindi: "बाल संरक्षण",
        withinSLA: 2180,
        beyondSLA: 110, // 95.2%
      },
      {
        id: "soc_6",
        service: "Laxmibai Social Security Pension for Widows",
        serviceHindi: "लक्ष्मीबाई सामाजिक सुरक्षा विधवा पेंशन",
        shortName: "Widow Pension",
        shortNameHindi: "विधवा पेंशन",
        withinSLA: 4120,
        beyondSLA: 220, // 94.9%
      },
      {
        id: "soc_7",
        service: "Mukhyamantri Kanya Vivah Yojana",
        serviceHindi: "मुख्यमंत्री कन्या विवाह योजना अनुदान",
        shortName: "Kanya Vivah",
        shortNameHindi: "कन्या विवाह",
        withinSLA: 3450,
        beyondSLA: 195, // 94.7%
      },
      {
        id: "soc_8",
        service: "Disability Certificate & UDID Card Support",
        serviceHindi: "दिव्यांगता प्रमाण पत्र एवं यूडीआईडी कार्ड",
        shortName: "UDID Card",
        shortNameHindi: "यूडीआईडी कार्ड",
        withinSLA: 3890,
        beyondSLA: 180, // 95.6%
      },
      {
        id: "soc_9",
        service: "Kabir Antyesti Anudan (Funeral Assistance)",
        serviceHindi: "कबीर अन्त्येष्टि अनुदान योजना",
        shortName: "Antyesti Aid",
        shortNameHindi: "अन्त्येष्टि",
        withinSLA: 2780,
        beyondSLA: 130, // 95.5%
      },
      {
        id: "soc_10",
        service: "Destitute Shelter & Senior Citizen Care Homes",
        serviceHindi: "निराश्रित एवं वृद्ध आश्रम प्रबंधन",
        shortName: "Shelter Homes",
        shortNameHindi: "आश्रय गृह",
        withinSLA: 1450,
        beyondSLA: 65, // 95.7%
      },
    ],
  },
  {
    id: "6aa0093530deb4f1342d8420",
    key: "dairy_fisheries",
    title: "Dairy fisheries and animal resources Department",
    titleHindi: "डेयरी, मत्स्य पालन एवं पशु संसाधन विभाग",
    services: [
      {
        id: "dairy_1",
        service: "Renovation of Old Government Ponds for Fishery",
        serviceHindi: "पुराने सरकारी तालाबों के जीर्णोद्धार की योजना",
        shortName: "Pond",
        shortNameHindi: "तालाब",
        withinSLA: 1850,
        beyondSLA: 290, // 86.4% - Shortest & Worst in Dairy & Fisheries
      },
      {
        id: "dairy_2",
        service: "Establishment of Milk Collection / Dairy Centers",
        serviceHindi: "दुग्ध संग्रह / डेयरी केन्द्रों की स्थापना",
        shortName: "Dairy Centers",
        shortNameHindi: "डेयरी",
        withinSLA: 2890,
        beyondSLA: 140, // 95.4%
      },
      {
        id: "dairy_3",
        service: "Artificial Insemination (AI) of Cattle",
        serviceHindi: "पशुओं में कृत्रिम गर्भाधान सेवाएं",
        shortName: "Insemination",
        shortNameHindi: "कृत्रिम गर्भाधान",
        withinSLA: 3450,
        beyondSLA: 160, // 95.6%
      },
      {
        id: "dairy_4",
        service: "Veterinary Hospital & Mobile Clinic Services",
        serviceHindi: "पशु स्वास्थ्य एवं चिकित्सा सेवाएं",
        shortName: "Vet Health",
        shortNameHindi: "पशु चिकित्सा",
        withinSLA: 3780,
        beyondSLA: 210, // 94.7%
      },
      {
        id: "dairy_5",
        service: "National Animal Disease Vaccination (FMD/HS)",
        serviceHindi: "पशु टीकाकरण कार्यक्रम (खुरपका/मुंहपका)",
        shortName: "Vaccination",
        shortNameHindi: "टीकाकरण",
        withinSLA: 4120,
        beyondSLA: 180, // 95.8%
      },
      {
        id: "dairy_6",
        service: "Integrated Poultry Development Scheme",
        serviceHindi: "समेकित कुक्कुट विकास योजना",
        shortName: "Poultry Dev",
        shortNameHindi: "कुक्कुट विकास",
        withinSLA: 2150,
        beyondSLA: 110, // 95.1%
      },
      {
        id: "dairy_7",
        service: "Integrated Goat & Sheep Farming Subsidy",
        serviceHindi: "समेकित बकरी एवं भेड़ पालन अनुदान",
        shortName: "Goat/Sheep",
        shortNameHindi: "बकरी/भेड़",
        withinSLA: 2480,
        beyondSLA: 135, // 94.8%
      },
      {
        id: "dairy_8",
        service: "High-Yield Fish Seed Distribution Scheme",
        serviceHindi: "उन्नत नस्ल के मत्स्य बीज वितरण की योजना",
        shortName: "Fish Seed",
        shortNameHindi: "मत्स्य बीज",
        withinSLA: 2680,
        beyondSLA: 125, // 95.5%
      },
      {
        id: "dairy_9",
        service: "Matsyajeevi (Fisherman) Housing Scheme",
        serviceHindi: "मत्स्यजीवी आवास योजना",
        shortName: "Fisher Housing",
        shortNameHindi: "मत्स्यजीवी आवास",
        withinSLA: 1950,
        beyondSLA: 115, // 94.4%
      },
      {
        id: "dairy_10",
        service: "Livestock Feed & Fodder Subsidy Scheme",
        serviceHindi: "पशुधन विकास एवं चारा अनुदान योजना",
        shortName: "Fodder Subsidy",
        shortNameHindi: "चारा अनुदान",
        withinSLA: 2320,
        beyondSLA: 105, // 95.7%
      },
    ],
  },
];

/**
 * Returns scaling multiplier based on period descriptor.
 * E.g., daily is ~0.045 of monthly, weekly is ~0.25 of monthly, custom scales by day count.
 */
function getPeriodFactor(pd, dateRange) {
  if (dateRange?.from && dateRange?.to) {
    const diffTime = Math.abs(new Date(dateRange.to) - new Date(dateRange.from));
    const diffDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1);
    return Math.max(0.04, Number((diffDays / 30).toFixed(3)));
  }
  if (!pd) return 1.0;
  const sub = String(pd.sub || "").toLowerCase();
  const label = String(pd.label || "").toLowerCase();

  if (sub.includes("yesterday") || label.includes("today") || label.includes("आज")) {
    return 0.045; // ~1 day volume
  }
  if (sub.includes("week") || label.includes("week") || label.includes("सप्ताह")) {
    return 0.25; // ~7 days volume
  }
  return 1.0; // monthly default
}

/**
 * Formats and scales service records.
 */
function formatServiceRecord(s, dept, factor) {
  const scaledWithin = Math.max(12, Math.round(s.withinSLA * factor));
  const scaledBeyond = Math.max(1, Math.round(s.beyondSLA * factor));
  const total = scaledWithin + scaledBeyond;
  const compliance = total > 0 ? Number(((scaledWithin / total) * 100).toFixed(1)) : 0;

  return {
    id: s.id,
    service: s.service,
    serviceHindi: s.serviceHindi || s.service,
    shortName: s.shortName || s.service,
    shortNameHindi: s.shortNameHindi || s.shortName || s.serviceHindi,
    departmentId: dept.id,
    departmentKey: dept.key,
    departmentName: dept.title,
    departmentHindi: dept.titleHindi,
    withinSLA: scaledWithin,
    beyondSLA: scaledBeyond,
    compliance,
    total,
  };
}

/**
 * Get services list filtered by department and scaled by time period.
 * Sorts services with lowest compliance % first so worst performing services
 * are always prominent in graphs, stat cards, and tables.
 *
 * @param {string} departmentFilter - Department ID or name or empty for all.
 * @param {object} pd - Period configuration object from operational dashboard.
 * @param {Array} departmentDataList - Optional list of department objects for resilient label matching.
 * @param {object} dateRange - Optional custom date range { from, to }.
 * @returns {Array} List of service SLA records sorted with worst compliance first.
 */
export function getDepartmentSlaServices(
  departmentFilter,
  pd,
  departmentDataList = [],
  dateRange = null,
) {
  const factor = getPeriodFactor(pd, dateRange);

  let result = [];
  if (departmentFilter && departmentFilter !== "" && departmentFilter !== "all") {
    const filterLower = String(departmentFilter).trim().toLowerCase();

    // Look for resolved title from passed departmentDataList if available
    const resolvedFromList = departmentDataList.find(
      (d) => d.value === departmentFilter || d.id === departmentFilter,
    );
    const resolvedTitle = resolvedFromList
      ? String(resolvedFromList.label || "").toLowerCase()
      : "";

    const matchedDept = DEPARTMENTS_SLA_CONFIG.find(
      (d) =>
        d.id === departmentFilter ||
        d.key.toLowerCase() === filterLower ||
        d.title.toLowerCase() === filterLower ||
        d.title.toLowerCase().includes(filterLower) ||
        filterLower.includes(d.key.toLowerCase()) ||
        (resolvedTitle &&
          (d.title.toLowerCase().includes(resolvedTitle) ||
            resolvedTitle.includes(d.key.toLowerCase()))),
    );

    if (matchedDept) {
      result = matchedDept.services.map((s) =>
        formatServiceRecord(s, matchedDept, factor),
      );
    }
  }

  // If no specific department matched or "All" is selected, combine all department services
  if (result.length === 0) {
    DEPARTMENTS_SLA_CONFIG.forEach((dept) => {
      dept.services.forEach((s) => {
        result.push(formatServiceRecord(s, dept, factor));
      });
    });
  }

  // Sort by compliance ascending so worst services (lowest compliance %) appear first.
  // Tie-breaker: shortest name first, then highest breach count.
  result.sort((a, b) => {
    if (a.compliance !== b.compliance) {
      return a.compliance - b.compliance;
    }
    const lenA = (a.shortName || a.service || "").length;
    const lenB = (b.shortName || b.service || "").length;
    if (lenA !== lenB) return lenA - lenB;
    return (b.beyondSLA || 0) - (a.beyondSLA || 0);
  });

  return result;
}

/**
 * Computes aggregate summary statistics for the current SLA dataset.
 * Identifies the worst and best performing services.
 *
 * @param {Array} servicesList - Array of service records.
 * @returns {object} Calculated stats (withinSLA, beyondSLA, total, complianceRate, worstService, bestService).
 */
export function computeSlaStats(servicesList = []) {
  if (!servicesList || servicesList.length === 0) {
    return {
      withinSLA: 0,
      beyondSLA: 0,
      total: 0,
      complianceRate: "0.0",
      worstService: null,
      bestService: null,
    };
  }

  const withinSLA = servicesList.reduce((sum, s) => sum + (s.withinSLA || 0), 0);
  const beyondSLA = servicesList.reduce((sum, s) => sum + (s.beyondSLA || 0), 0);
  const total = withinSLA + beyondSLA;
  const complianceRate = total > 0 ? ((withinSLA / total) * 100).toFixed(1) : "0.0";

  // Worst service: lowest compliance percentage (tie breaker: shortest name)
  const sortedByCompliance = [...servicesList].sort((a, b) => {
    if (a.compliance !== b.compliance) {
      return a.compliance - b.compliance;
    }
    const lenA = (a.shortName || a.service || "").length;
    const lenB = (b.shortName || b.service || "").length;
    if (lenA !== lenB) return lenA - lenB;
    return (b.beyondSLA || 0) - (a.beyondSLA || 0);
  });
  const worstService = sortedByCompliance[0] || null;
  const bestService = sortedByCompliance[sortedByCompliance.length - 1] || null;

  return {
    withinSLA,
    beyondSLA,
    total,
    complianceRate,
    worstService,
    bestService,
  };
}
