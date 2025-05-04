import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  react,
  subject,
}: {
  to: string;
  react: React.ReactNode;
  subject: string;
}) {
  return await resend.emails.send({
    to: process.env.NODE_ENV === "production" ? to : "delivered@resend.dev",
    from: process.env.RESEND_FROM_EMAIL,
    react,
    subject,
  });
}
