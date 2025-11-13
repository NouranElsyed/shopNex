import { InputConfig } from "../interfaces";

export const registerInputs: InputConfig[] = [
  {
    name: "name",
    type: "text",
    placeholder: "Full Name",
    tooltip: "Enter your full name",
  },
  {
    name: "email",
    type: "email",
    placeholder: "Email Address",
    tooltip: "Example: name@example.com",
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password",
    tooltip: "At least 8 characters, letters & numbers",
  },
  {
    name: "rePassword",
    type: "password",
    placeholder: "Confirm Password",
    tooltip: "Re-enter your password",
  },
  {
    name: "phone",
    type: "tel",
    placeholder: "Phone Number (EG)",
    tooltip: "Example: 01012345678",
    dir: "ltr",
  },
];

export const loginInputs: InputConfig[] = [
  {
    name: "email",
    type: "email",
    placeholder: "Email Address",
    tooltip: "Enter your email",
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password",
    tooltip: "Enter your password",
  },
];