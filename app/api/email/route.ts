import EmailTemplateClient from "@/templates/EmailTemplateClient";
import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  const { email, message, name, phone } = await request.json();

  if (!message || !email || !name || !phone) {
    return NextResponse.json(
      {
        error: "Missing required fields",
      },
      { status: 400 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: `Kyaw Zayar Tun <info@kyawzayartun.com>`,
      to: email,
      subject: `Message from Kyaw Zayar Tun`,
      react: EmailTemplateClient({ name }),
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

// const { email, name } = await request.json();

//   const transport = nodemailer.createTransport({
//     service: "gmail",
//     /*
//       setting service as 'gmail' is same as providing these setings:
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true
//       If you want to use a different email provider other than gmail, you need to provide these manually.
//       Or you can go use these well known services and their settings at
//       https://github.com/nodemailer/nodemailer/blob/master/lib/well-known/services.json
//   */
//     auth: {
//       user: process.env.MY_EMAIL,
//       pass: process.env.MY_PASSWORD,
//     },
//   });

//   const mailOptions: Mail.Options = {
//     from: `"Kyaw Zayar Tun 👻" <${process.env.MY_EMAIL}>`,
//     to: email,
//     // cc: email, (uncomment this line if you want to send a copy to the sender)
//     subject: `Message from ${name} (${email})`,
//     text: `
//     Hello ${name},

//     We received your message. We will contact you soon.

//     Thanks for your consideration.

//     Best regards,
//     Kyaw Zayar Tun,
//     ${process.env.MY_EMAIL}
//     +95 979 996 7189
//     `,
//   };

//   const sendMailPromise = () =>
//     new Promise<string>((resolve, reject) => {
//       transport.sendMail(mailOptions, function (err) {
//         if (!err) {
//           resolve("Email sent");
//         } else {
//           console.log(err);
//           reject(err.message);
//         }
//       });
//     });

//   try {
//     await sendMailPromise();
//     return NextResponse.json({ message: "Email sent" });
//   } catch (err) {
//     return NextResponse.json({ error: err }, { status: 500 });
//   }
