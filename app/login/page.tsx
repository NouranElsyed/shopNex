"use client";
import React from "react";
import { HelpCircle, InfoIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { api } from "@/config/api.config";
import { AnimatedButton } from "@/components/ui/customButton/MotionButton";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { IAxiosError } from "@/interfaces";
import Link from "next/link";
import { useUserStore } from "@/store/user.store";
interface MyFormValues {
  email: string;
  password: string;
}
const Login = () => {
  const router = useRouter();
  const {setUser} = useUserStore()
  const formik = useFormik<MyFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        console.log(values);
        const res = await api.post("/auth/signin", values);
        const user = res.data.user;
        console.log(user);
        const token = res.data.token;
        console.log(token);
        await fetch("/api/set-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, user }),
        });
        setUser(user)
        router.push("/");
        toast("Welcome back 🎉", {
          position: "top-center",
          autoClose: 300,
          theme: "colored",
          style: {
            width: "100%",
            textAlign: "center",
            backgroundColor: "#79ac31b7",
            color: "white",
            fontWeight: "500",
            margin: "7px 0px ",
          },
        });
      } catch (error) {
        console.log(error)
        const AxiosErr = error as AxiosError<IAxiosError>;
        console.log(AxiosErr?.response);
        toast(
          `❕${AxiosErr?.response?.data?.message || "Something went wrong"}`,
          {
            position: "top-right",
            autoClose: 4000,
            theme: "colored",
            style: {
              width: "100%",
              textAlign: "center",
              backgroundColor: "#EF5350",
              color: "white",
              fontWeight: "500",
              margin: "7px 0px ",
            },
          }
        );
      }
    },
  });

  return (
    <div className="flex-1 max-h-screen  w-full flex justify-center items-center">
      <div className="flex flex-col  justify-center items-center w-full mx-5 sm:w-9/10 md:w-4/5 lg:w-3/7 p-10 bg-[#79ac310b] shadow-md shadow-[#4c70195e]">
        <h1 className="text-3xl font-semibold text-[#79ac31]">Login</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
          className="flex flex-col justify-center items-center w-full  gap-6 mt-10"
        >
          <InputGroup className="h-12 text-md border-2 ">
            <InputGroupInput
              name="email"
              type="email"
              placeholder="Your email address"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            <InputGroupAddon align="inline-end">
              <Tooltip>
                <TooltipTrigger asChild>
                  <InputGroupButton
                    variant="ghost"
                    aria-label="Help"
                    size="icon-xs"
                  >
                    <HelpCircle />
                  </InputGroupButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>please write your email</p>
                </TooltipContent>
              </Tooltip>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup className="h-12 text-md border-2 ">
            <InputGroupInput
              name="password"
              placeholder="Enter password"
              type="password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <InputGroupAddon align="inline-end">
              <Tooltip>
                <TooltipTrigger asChild>
                  <InputGroupButton
                    variant="ghost"
                    aria-label="Info"
                    size="icon-xs"
                  >
                    <InfoIcon />
                  </InputGroupButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Password must be at least 8 characters</p>
                </TooltipContent>
              </Tooltip>
            </InputGroupAddon>
          </InputGroup>
          <AnimatedButton type="submit">submit</AnimatedButton>
        </form>
        <p className="text-sm mt-5">
          I haven&apos;t an account{" "}
          <Link href="/register" className="underline text-[#79ac31]">
            signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
