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

export const passwordSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val) return true; // allow empty or missing passwords (for passkey/OAuth)
      if (val.length < 8) return false;
      if (!/[a-z]/.test(val)) return false;
      if (!/[A-Z]/.test(val)) return false;
      if (!/\d/.test(val)) return false;
      if (!/[@$!%*?&]/.test(val)) return false;
      return true;
    },
    {
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    },
  );
