import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import EmailTemplate from "@/templates/EmailTemplate";

export async function POST(request: NextRequest) {
  const { email, message, name, phone, service } = await request.json();

  if (!message || !email || !name || !phone || !service) {
    return NextResponse.json(
      {
        error: "Missing required fields",
      },
      { status: 400 }
    );
  }
  const chooseService =
    service === "mobile-development"
      ? "Mobile development"
      : service === "web-development"
      ? "Web development"
      : "Application deployment";
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: `Kyaw Zayar Tun<info@kyawzayartun.com>`,
      to: "kyawzayartun.dev@gmail.com",
      subject: `Message from portfolio site.`,
      react: EmailTemplate({
        email,
        message,
        name,
        phone,
        service: chooseService,
      }),
    });

    if (error) {
      return NextResponse.json(
        { message: "Email sending failed", error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Email sent successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Failed to send email", error },
      { status: 500 }
    );
  }
}
