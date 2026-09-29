import instance from "../lib/axios";

export const postMakeCall = async (data) => {
  return instance.post("/telephony/call", data);
};



export const postAnswerCall = async (data) => {
  return instance.post("/telephony/call/answer", data);
};

