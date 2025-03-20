import nodemailer from "nodemailer";
// import { nodemailerConfig } from "./node-mailer-config";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST!,
    port: parseInt(process.env.EMAIL_SERVER_PORT!) || 587,
    auth: {
      user: process.env.EMAIL_SERVER_USER!,
      pass: process.env.EMAIL_SERVER_PASSWORD!,
    }
  });

  const info = await transporter.sendMail({
    from: `Kyaw Zayar Tun <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  });
  // eslint-disable-next-line no-console
  console.log({ info });
}
