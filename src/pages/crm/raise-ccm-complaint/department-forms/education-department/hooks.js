

export const useGetFieldsOptions = () => {
  const isLoading = false;
  const error = null;

  const fields = {
    categoryId: [
      { label: "Teacher Absenteeism", value: 112 },
      { label: "School Infrastructure & Facilities", value: 113 },
      { label: "Mid-Day Meal (MDM) Quality", value: 114 },
      { label: "Textbook & Uniform Distribution", value: 115 },
    ],
    source: [
      { label: "Helpline (14417)", value: "HELPLINE" },
      { label: "Web Portal", value: "WEB" },
      { label: "Mobile App", value: "MOBILE_APP" },
      { label: "In-Person / Walk-in", value: "IN_PERSON" },
    ],
    districtCode: [
      { label: "Patna (1007)", value: 1007 },
      { label: "Gaya (1008)", value: 1008 },
      { label: "Muzaffarpur (1009)", value: 1009 },
      { label: "Bhagalpur (1010)", value: 1010 },
    ],
    blockCode: [
      { label: "Patna Sadar (0)", value: 0 },
      { label: "Danapur (101)", value: 101 },
      { label: "Phulwari Sharif (102)", value: 102 },
      { label: "Bikram (103)", value: 103 },
    ],
    clusterCode: [
      { label: "Cluster Center 01 (0)", value: 0 },
      { label: "Cluster Center 02 (201)", value: 201 },
      { label: "Cluster Center 03 (202)", value: 202 },
      { label: "Cluster Center 04 (203)", value: 203 },
    ],
    panchayatCode: [
      { label: "Panchayat 01 (0)", value: 0 },
      { label: "Panchayat 02 (301)", value: 301 },
      { label: "Panchayat 03 (302)", value: 302 },
      { label: "Panchayat 04 (303)", value: 303 },
    ],
    villageCode: [
      { label: "Village 01 (0)", value: 0 },
      { label: "Village 02 (401)", value: 401 },
      { label: "Village 03 (402)", value: 402 },
      { label: "Village 04 (403)", value: 403 },
    ],
    schoolCode: [
      { label: "Govt Middle School (0)", value: 0 },
      { label: "Govt High School Danapur (501)", value: 501 },
      { label: "Primary School Kankarbagh (502)", value: 502 },
      { label: "Kanya Uchha Vidyalaya (503)", value: 503 },
    ],
    teacherCode: [
      { label: "Teacher Not Assigned / General (0)", value: 0 },
      { label: "Anil Sharma - TGT Math (601)", value: 601 },
      { label: "Sunita Kumari - PRT (602)", value: 602 },
      { label: "Rakesh Verma - PGT Science (603)", value: 603 },
    ],
  };

  return { fields, isLoading, error };
};