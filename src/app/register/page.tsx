/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AuthForm } from "@/src/components/auth/AuthForm";
import { registerInputs } from "@/src/config/authInputs";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/src/validation/authSchema";
import { useAuthRedirect } from "@/src/hooks/useAuthRedirect";

const RegisterPage = () => {
  const router = useRouter();
  useAuthRedirect({ requireAuth: false, redirectTo: "/" });

  const handleRegister = async (values: any) => {
    const result = await signIn("credentials", {
      ...values,
      mode: "signup",
      redirect: false,
    });

if (!result?.ok) {
  toast.error(result?.error || "Login failed", {
    position: "top-center",
    theme: "colored",
  });
  return;
}


    toast.success("Account created successfully! 🎉", {
      position: "top-center",
      autoClose: 2000,
      theme: "colored",
      style: { backgroundColor: "#79ac31", color: "white", fontWeight: 600 },
    });

    router.push("/");
    router.refresh();
  };

  return (
    <AuthForm
      title="Create Account"
      inputs={registerInputs}
      schema={registerSchema}
      onSubmit={handleRegister}
      submitText="Sign Up"
      loadingText="Creating Account..."
      linkText="Already have an account?"
      linkHref="/login"
      linkLabel="Log in"
    />
  );
};

export default RegisterPage;
