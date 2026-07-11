"use client"

import { useActionState } from "react"
import { submitContactForm, type ContactFormState } from "@/actions/contact/actions"
import { cn } from "@/lib/utils"

const initialState: ContactFormState = {
  success: false,
  message: "",
}

export function ContactForm() {
  const [state, formAction, isPending] = useActionState<
    ContactFormState,
    FormData
  >(submitContactForm, initialState)

  if (state?.success) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card/60 py-16 text-center shadow-sm">
        <span className="mb-5 text-5xl">✓</span>
        <h3 className="mb-2 text-xl font-semibold text-foreground">
          Message Sent!
        </h3>
        <p className="mb-6 max-w-xs text-sm text-muted-foreground">
          {state.message}
        </p>
        <p className="text-sm text-muted-foreground">
          I&apos;ll get back to you within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-border bg-card/60 p-8 shadow-sm"
    >
      <h3 className="mb-6 text-lg font-semibold text-foreground">
        Send a Message
      </h3>

      {state && !state.success && state.message && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
          {state.message}
        </div>
      )}

      {/* Honeypot */}
      <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />

      {/* Name + Email row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name" error={state?.errors?.name?.errors?.[0]}>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            autoComplete="name"
            required
            className={inputClass(!!state?.errors?.name)}
          />
        </Field>
        <Field label="Email" error={state?.errors?.email?.errors?.[0]}>
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            autoComplete="email"
            required
            className={inputClass(!!state?.errors?.email)}
          />
        </Field>
      </div>

      {/* Project type */}
      <Field label="Project Type">
        <select
          name="projectType"
          defaultValue=""
          className={inputClass(false)}
        >
          <option value="">Select project type</option>
          <option value="flutter">Flutter App</option>
          <option value="android">Android App</option>
          <option value="react-native">React Native App</option>
          <option value="web">Web Application</option>
          <option value="consultation">Consultation</option>
          <option value="other">Other</option>
        </select>
      </Field>

      {/* Budget */}
      <Field label="Budget Range">
        <select
          name="budget"
          defaultValue=""
          className={inputClass(false)}
        >
          <option value="">Select budget range</option>
          <option value="1k-5k">$1k – $5k</option>
          <option value="5k-15k">$5k – $15k</option>
          <option value="15k-30k">$15k – $30k</option>
          <option value="30k+">$30k+</option>
          <option value="discuss">Let&apos;s discuss</option>
        </select>
      </Field>

      {/* Message */}
      <Field label="Message" error={state?.errors?.message?.errors?.[0]}>
        <textarea
          name="message"
          placeholder="Tell me about your project..."
          rows={5}
          required
          className={cn(inputClass(!!state?.errors?.message), "resize-y")}
        />
      </Field>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-500 py-3.5 font-semibold text-white transition-colors hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <>
            <svg
              className="size-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Sending...
          </>
        ) : (
          <>
            Send Message
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </>
        )}
      </button>
    </form>
  )
}

function inputClass(hasError: boolean) {
  return cn(
    "w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground transition-all outline-none placeholder:text-muted-foreground",
    hasError
      ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
      : "focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
        {label}
      </label>
      {children}
      {error && (
        <p className="font-mono text-[11px] text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
