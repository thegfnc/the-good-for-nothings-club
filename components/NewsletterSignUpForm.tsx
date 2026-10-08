'use client'

import { Check, Loader2 } from 'lucide-react'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { useForm } from 'react-hook-form'
import { newsletterSignUpSchema } from '../data/schemas'
import { captureEvent } from '../lib/analytics'
import { useFormTracking } from '../lib/form-tracking'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/Form'
import { Alert, AlertDescription, AlertTitle } from './ui/Alert'

export default function NewsletterSignUpForm() {
  const form = useForm<z.infer<typeof newsletterSignUpSchema>>({
    resolver: zodResolver(newsletterSignUpSchema),
    defaultValues: {
      email: '',
    },
  })

  useFormTracking('newsletter_sign_up', form)

  async function onSubmit(values: z.infer<typeof newsletterSignUpSchema>) {
    const response = await fetch('/api/newsletter-sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...values }),
    })

    if (!response.ok) {
      form.setError('root', {
        message:
          'Something went wrong. Email us at hello@thegoodfornothings.club.',
      })
      throw new Error('Newsletter sign-up failed')
    }

    captureEvent('newsletter_signed_up')
  }

  const { isSubmitting, isSubmitSuccessful, errors } = form.formState

  return isSubmitSuccessful ? (
    <Alert>
      <Check className='h-4 w-4' />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        Thank you for subscribing to our newsletter.{' '}
      </AlertDescription>
    </Alert>
  ) : (
    <Form {...form}>
      <form
        onSubmit={e =>
          form
            .handleSubmit(onSubmit)(e)
            .catch(() => {})
        }
        className='flex w-full flex-col gap-2 @sm:flex-row @sm:flex-wrap @sm:gap-0'
      >
        <FormField
          name='email'
          control={form.control}
          render={({ field }) => (
            <FormItem className='@sm:min-w-0 @sm:flex-1'>
              <FormControl>
                <Input
                  type='email'
                  id='email'
                  required
                  maxLength={256}
                  autoComplete='email'
                  placeholder='Enter your email'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          disabled={isSubmitting}
          className='w-full @sm:w-auto'
        >
          {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Subscribe
        </Button>
        {errors.root && (
          <p className='text-destructive mt-2 w-full font-sans text-sm font-medium'>
            {errors.root.message}
          </p>
        )}
      </form>
    </Form>
  )
}
