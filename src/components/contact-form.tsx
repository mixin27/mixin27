'use client'

import {
  submitContactForm,
  type ContactFormState,
} from '@/actions/contact/actions'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useActionState } from 'react'

export function ContactForm() {
  const [state, formAction, isPending] = useActionState<
    ContactFormState | null,
    FormData
  >(submitContactForm, null)

  return (
    <div className="rounded-lg border bg-card p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Send a Message</h2>

      {/* Success Message */}
      {state?.success && (
        <div className="mb-6 rounded-lg bg-green-500/10 border border-green-500/20 p-4 flex items-start gap-3">
          <CheckCircle className="size-5 text-green-600 shrink-0 mt-0.5" />
          <p className="text-sm text-green-600 dark:text-green-400">
            {state.message}
          </p>
        </div>
      )}

      {/* Error Message */}
      {state && !state.success && state.message && (
        <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 p-4 flex items-start gap-3">
          <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{state.message}</p>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Your name"
            required
          />
          {state?.errors?.name && (
            <p className="text-sm text-destructive mt-1">
              {state.errors.name[0]}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="your.email@example.com"
            required
          />
          {state?.errors?.email && (
            <p className="text-sm text-destructive mt-1">
              {state.errors.email[0]}
            </p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-2">
            Subject <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="What's this about?"
            required
          />
          {state?.errors?.subject && (
            <p className="text-sm text-destructive mt-1">
              {state.errors.subject[0]}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Message <span className="text-destructive">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Tell me about your project..."
            required
          />
          {state?.errors?.message && (
            <p className="text-sm text-destructive mt-1">
              {state.errors.message[0]}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Message'
          )}
        </button>
      </form>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        By submitting this form, you agree to our{' '}
        <a href="/legal/privacy" className="text-primary hover:underline">
          privacy policy
        </a>
        .
      </p>
    </div>
  )
}
