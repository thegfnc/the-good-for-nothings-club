'use client'

import { Check, Loader2 } from 'lucide-react'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import SocialMediaLinks from './SocialMediaLinks'
import { useForm } from 'react-hook-form'
import { newsletterSignUpSchema } from '../data/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/Form'
import { Alert, AlertDescription, AlertTitle } from './ui/Alert'

function NewsletterSignUpForm() {
  const form = useForm<z.infer<typeof newsletterSignUpSchema>>({
    resolver: zodResolver(newsletterSignUpSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof newsletterSignUpSchema>) {
    const response = await fetch('/api/newsletter-sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...values }),
    })

    if (response.ok) {
      console.log('Success!')
    } else {
      console.error('Failed to subscribe')
    }
  }

  const { isSubmitting, isSubmitSuccessful } = form.formState

  return isSubmitSuccessful ? (
    <Alert className='max-w-96'>
      <Check className='h-4 w-4' />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        Thank you for subscribing to our newsletter.{' '}
      </AlertDescription>
    </Alert>
  ) : (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-full max-w-96 flex-grow'
      >
        <FormField
          name='email'
          control={form.control}
          render={({ field }) => (
            <FormItem className='flex-grow'>
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
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Subscribe
        </Button>
      </form>
    </Form>
  )
}

export default function Footer() {
  return (
    <footer className='pb-8 pt-8 font-sans md:px-8 md:pt-16 xl:px-16 xl:pb-16'>
      <div className='mx-auto max-w-[1576px] border-y-2 border-black bg-background px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
        <div className='flex flex-col items-center justify-between gap-5 bg-black/5 p-5 text-center text-xl sm:p-10 md:text-left md:text-2xl lg:flex-row lg:p-12'>
          <div className=''>Subscribe to our newsletter</div>
          <NewsletterSignUpForm />
        </div>
        <div className='mt-10 flex flex-col-reverse items-center justify-between gap-6 md:flex-row'>
          <div className='text-center'>
            &copy; {new Date().getFullYear()} The Good for Nothings Club LLC.
            All rights reserved.
          </div>
          <div className='text-2xl'>
            <SocialMediaLinks />
          </div>
        </div>
      </div>
    </footer>
  )
}
