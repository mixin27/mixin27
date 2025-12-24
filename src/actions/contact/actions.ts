"use server"

import { z } from "zod"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// Contact form schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  company: z.string(),
})

export type ContactFormState = {
  success: boolean
  message: string
  errors?: {
    name?:
      | {
          errors: string[]
        }
      | undefined
    email?:
      | {
          errors: string[]
        }
      | undefined
    subject?:
      | {
          errors: string[]
        }
      | undefined
    message?:
      | {
          errors: string[]
        }
      | undefined
  }
}

export async function submitContactForm(
  prevState: ContactFormState | null,
  formData: FormData,
): Promise<ContactFormState> {
  // Extract form data
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    company: formData.get("company"),
  }

  // Validate form data
  const result = contactSchema.safeParse(data)

  if (!result.success) {
    return {
      success: false,
      message: "Please fix the errors below",
      errors: z.treeifyError(result.error).properties,
    }
  }

  if (result.data.company) {
    return {
      success: false,
      message: "You are not allowed to send message.",
    }
  }

  try {
    const { error } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: [process.env.CONTACT_EMAIL!],
      subject: `Contact Form: ${result.data.subject}`,
      replyTo: result.data.email,
      html: `
    <!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 10px 10px;
    }
    .field {
      margin-bottom: 20px;
    }
    .label {
      font-weight: bold;
      color: #667eea;
      margin-bottom: 5px;
    }
    .value {
      background: white;
      padding: 10px;
      border-radius: 5px;
      border-left: 3px solid #667eea;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Contact Form Submission</h1>
      <p>You have received a new message from your portfolio website</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Name</div>
        <div class="value">${result.data.name}</div>
      </div>
      <div class="field">
        <div class="label">Email</div>
        <div class="value">${result.data.email}</div>
      </div>
      <div class="field">
        <div class="label">Subject</div>
        <div class="value">${result.data.subject}</div>
      </div>
      <div class="field">
        <div class="label">Message</div>
        <div class="value">${result.data.message.replace(/\n/g, "<br>")}</div>
      </div>
    </div>
  </div>
</body>
</html>
  `,
    })

    if (error) {
      throw new Error("Failed to send email")
    }

    return {
      success: true,
      message: "Thank you for your message! I will get back to you soon.",
    }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return {
      success: false,
      message:
        "Something went wrong. Please try again later or email me directly.",
    }
  }
}
