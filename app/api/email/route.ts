import { sendEmail } from "@/lib/mail/send-mail";
import { type NextRequest, NextResponse } from "next/server";

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

  try {
    await sendEmail({
      to: email,
      subject: `Message from Kyaw Zayar Tun`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 10px 0;
            border-bottom: 1px solid #eaeaea;
        }
        .header h1 {
            margin: 0;
            color: #333;
        }
        .content {
            padding: 20px;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
            color: #555;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            background-color: #28a745;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            padding: 10px 0;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Thank You</h1>
        </div>
        <div class="content">
            <p>Hi ${name},</p>
            <p>
              Thanks you for contacting us regarding software services. We appreciate your interest and would be happy to discuss how we can assit you with your project.
            </p>

            <p>
              Could you please provide more details about your requirements, such as type of software you&apos;re looking for, the features you&apos;d like included, and any specific goals or deadlines? This will help us better understand your needs and propose an ideal solution.
            </p>

            <p>
              Once we have this information, we can schedule a call or meeting to explore further.
            </p>

            <p>
              Looking forward to hearing from you!
            </p>

            <p>Best regards,<br>Kyaw Zayar Tun</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Kyaw Zayar Tun. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
      `,
    });

    return NextResponse.json(
      { message: "Email sent successfully" },
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
