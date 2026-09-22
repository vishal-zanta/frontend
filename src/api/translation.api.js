import instance from "../lib/axios";

export const postTranslate = async ({ text, targetLanguage }) => {
  return instance.post("/translate", { text, targetLanguage });
};

export const translateText = postTranslate;
