/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import { AnimatedButton } from "@/src/components/ui/custom/MotionButton";
import { AnyObjectSchema } from "yup";
import { InputConfig } from "@/src/interfaces";
import Link from "next/link";
import Image from "next/image";

interface AuthFormProps {
  title: string;
  inputs: InputConfig[];
  schema: AnyObjectSchema;
  onSubmit: (values: any) => Promise<void>;
  submitText: string;
  loadingText?: string;
  linkText: string;
  linkHref: string;
  linkLabel: string;
}

export const AuthForm = ({
  title,
  inputs,
  schema,
  onSubmit,
  submitText,
  loadingText = "...loading",
  linkText,
  linkHref,
  linkLabel,
}: AuthFormProps) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: Object.fromEntries(inputs.map((i) => [i.name, ""])),
  });

  const onSubmitForm = async (values: any) => {
    setIsLoading(true);
    try {
      await onSubmit(values);
    } catch (error: any) {
      toast.error(error.message || "It looks like something went wrong, please try again.", {
        position: "top-right",
        theme: "colored",
        style: { backgroundColor: "#EF5350", color: "white" },
      });
    } finally {
      setIsLoading(false);
    }
  };


  // const sanitizeInput = (value: string) => {
  //   return value.replace(/["'<>]/g, "").trim();
  // };

  return (
    <div className="flex-1 w-full flex justify-center items-center py-10 px-4">
      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border border-[#79ac31]/20">
        <h1 className="text-3xl font-bold text-center text-[#79ac31] mb-8">{title}</h1>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-5" noValidate>
          {inputs.map((input) => (
            <div key={input.name}>
              <div
                className="flex items-center border-2 border-gray-300 rounded-lg focus-within:border-[#79ac31] transition h-12"
                dir={input.dir || "ltr"}
              >
                <Controller
                  name={input.name}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type={input.type}
                      placeholder={input.placeholder}
                      autoFocus={input.name === "name"}
                      className="flex-1 px-4 text-base outline-none bg-transparent"
                      onChange={(e) => {
                        // const cleanValue = sanitizeInput(e.target.value);
                        const cleanValue = e.target.value;

                        field.onChange(cleanValue);
                        setValue(input.name, cleanValue, { shouldValidate: true });
                      }}
                    />
                  )}
                />
              </div>

             
              {errors[input.name] && touchedFields[input.name] && (
                <p className="mt-1 text-sm text-red-600 text-left">
                  {errors[input.name]?.message as string}
                </p>
              )}
            </div>
          ))}

          <AnimatedButton
            type="submit"
            disabled={isLoading || !isValid}
            className="w-full h-12 text-lg font-semibold"
            loading={isLoading}
          >
            {isLoading ? loadingText : submitText}
          </AnimatedButton>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-sm text-gray-500">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex items-center justify-center gap-3 w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
        >
          <Image width={24} height={24} alt="Google" src="/google.png" />
          continue with google
        </button>

        <p className="text-center text-sm mt-6 text-gray-600">
          {linkText}{" "}
          <Link href={linkHref} className="underline text-[#79ac31] font-medium">
            {linkLabel}
          </Link>
        </p>
      </div>
    </div>
  );
};