import React, { useMemo } from "react";
import PortalLayout from "@/components/PortalLayout";
import RhfWrapper from "@/components/RhfWrapper";
import RhfInput from "@/components/rhfinputs/RhfInput";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/ChartCard";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { profileSchema } from "./schema";
import { useUpdateProfile } from "./hooks";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import { useQueryClient } from "@tanstack/react-query";
import { User, Lock, Info, Loader2, Save } from "lucide-react";

export default function Profile() {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const updateMutation = useUpdateProfile();

  const initialValues = useMemo(
    () => ({
      name: profile?.name || "",
      password: "",
      confirmPassword: "",
    }),
    [profile?.name],
  );

  const onSubmit = (data, methods) => {
    const payload = {
      name: data?.name?.trim(),
    };

    if (data?.password && data?.password?.trim() !== "") {
      payload.password = data.password.trim();
    }

    updateMutation.mutate(payload, {
      onSuccess: (res) => {
        getSuccessToast(
          res?.data?.message ||
            t("Profile updated successfully", "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई"),
        );
        queryClient.invalidateQueries({ queryKey: ["auth-profile"] });
        methods.reset({
          name: data?.name?.trim(),
          password: "",
          confirmPassword: "",
        });
      },
      onError: (err) => {
        getErrorToast(err);
      },
    });
  };

  return (
    <PortalLayout>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <SectionTitle
          title={t("My Profile", "मेरी प्रोफ़ाइल")}
          subtitle={t(
            "Manage your personal information and update credentials",
            "अपनी व्यक्तिगत जानकारी प्रबंधित करें और क्रेडेंशियल अपडेट करें",
          )}
        />

        {/* Edit Form Card */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-3.5 sm:px-6 border-b border-border flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-foreground">
              {t("Edit Profile Details", "प्रोफ़ाइल विवरण संपादित करें")}
            </h3>
          </div>

          <RhfWrapper
            initialValues={initialValues}
            validationSchema={profileSchema}
            isValidation={true}
            onSubmit={onSubmit}
          >
            {/* Name Field Section */}
            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RhfInput
                  name="name"
                  label={t("Full Name", "पूरा नाम")}
                  placeholder={t("Enter full name", "पूरा नाम दर्ज करें")}
                  required
                />
              </div>
            </div>

            {/* Password Section */}
            <div className="p-5 sm:p-6 border-t border-border space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-500" />
                <h4 className="font-semibold text-sm text-foreground">
                  {t("Change Password", "पासवर्ड बदलें")}
                </h4>
              </div>

              {/* Password Note */}
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-lg p-3 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900 dark:text-amber-200">
                  <span className="font-semibold">{t("Note:", "नोट:")}</span>{" "}
                  {t(
                    "Only fill password if you want to change it.",
                    "पासवर्ड तभी भरें जब आप इसे बदलना चाहते हों।",
                  )}
                </p>
              </div>

              {/* Password Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RhfInput
                  name="password"
                  type="password"
                  label={t("New Password", "नया पासवर्ड")}
                  placeholder={t("Enter new password", "नया पासवर्ड दर्ज करें")}
                />

                <RhfInput
                  name="confirmPassword"
                  type="password"
                  label={t("Confirm Password", "पासवर्ड की पुष्टि करें")}
                  placeholder={t("Confirm new password", "नए पासवर्ड की पुष्टि करें")}
                />
              </div>
            </div>

            {/* Submit Button Section */}
            <div className="px-5 py-3.5 sm:px-6 border-t border-border flex justify-end">
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    {t("Saving...", "सहेज रहा है...")}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1.5" />
                    {t("Save Changes", "परिवर्तन सहेजें")}
                  </>
                )}
              </Button>
            </div>
          </RhfWrapper>
        </div>
      </div>
    </PortalLayout>
  );
}
