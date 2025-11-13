
"use client";
import { AuthForm } from "@/src/components/auth/AuthForm";
import { loginInputs } from "@/src/config/authInputs";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/src/validation/authSchema";
import { useAuthRedirect } from "@/src/hooks/useAuthRedirect";

const LoginPage = () => {
  const router = useRouter();
useAuthRedirect({ requireAuth: false, redirectTo: "/" });
  const handleLogin = async (values: { email: string; password: string }) => {
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (!result?.ok) throw new Error(result?.error || "Login failed");

    toast.success("Welcome back!", {
      position: "top-center",
      autoClose: 1500,
      theme: "colored",
      style: { backgroundColor: "#79ac31", color: "white" },
    });

    router.push("/");
    router.refresh();
  };

  return (
    <AuthForm
      title="Login"
      inputs={loginInputs}
      schema={loginSchema}
      onSubmit={handleLogin}
      submitText="Login"
      linkText="Don't have an account?"
      linkHref="/register"
      linkLabel="Sign up"
    />
  );
};

export default LoginPage;