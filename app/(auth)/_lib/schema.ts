import { z } from "zod";

export const emailSchema = z
  .string()
  .email("Please enter a valid email address.");

export const nameSchema = z
  .string()
  .min(1, { message: "Please enter a name." })
  .refine(
    (name) => {
      const words = name.trim().split(/\s+/);
      return words.length >= 2;
    },
    { message: "Please enter your full name (first and last name)." },
  );

export const passwordRequirements = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[0-9]/, text: "At least 1 number" },
  { regex: /[a-z]/, text: "At least 1 lowercase letter" },
  { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
  { regex: /[@$!%*?&]/, text: "At least 1 special character" },
];

export const passwordSchema = z
  .string()
  .min(1, { message: "Please enter a password." })
  .refine((val) => passwordRequirements.every((req) => req.regex.test(val)));
