import React, { useEffect, useMemo, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { focusErrorElement, getFirstErrorEl } from "@/utils/helpers";

const RhfWrapper = ({
  children,
  initialValues,
  onSubmit,
  onError,
  isValidation,
  validationSchema,
  className,
  schemaKey, // Add a key to track schema changes
  resetForm,
  validationOn = "onChange",
}) => {
  const lastFocusedEl = useRef(null);
  // Create resolver that updates when validationSchema changes
  const resolver = useMemo(() => {
    if (!isValidation || !validationSchema) return undefined;
    return zodResolver(validationSchema);
  }, [isValidation, validationSchema]);

  const defaultValues = useMemo(
    () => initialValues || {},
    [JSON.stringify(initialValues)],
  );

  const methods = useForm({
    defaultValues: defaultValues,
    resolver,
    mode: validationOn,
  });

  // Reset form with initial values when they change
  useEffect(() => {
    console.log("RESET", { initialValues });
    methods.reset(initialValues, { keepDefaultValues: false });
  }, [JSON.stringify(initialValues), resetForm]);

  // Only clear errors when validation schema changes (don't trigger validation)
  useEffect(() => {
    if (isValidation && validationSchema) {
      // Clear all errors when schema changes so old errors don't persist
      methods.clearErrors();
    }
  }, [validationSchema, schemaKey]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(
          (data) => onSubmit(data, methods),
          (err) => {
            onError?.(err, methods.getValues(), methods);
            focusErrorElement(methods, err);
          },
        )}
        id="rhf-form"
        className={className}
      >
        {children}
      </form>
    </FormProvider>
  );
};

export default RhfWrapper;
