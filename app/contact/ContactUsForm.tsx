'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Button } from '../../components/ui/Button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/Form'
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/Alert'
import { contactUsSchema } from '../../data/schemas'
import { Check, Loader2 } from 'lucide-react'

export default function ContactUsForm() {
  const form = useForm<z.infer<typeof contactUsSchema>>({
    resolver: zodResolver(contactUsSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      website: '',
      subject: '',
      message: '',
    },
  })

  async function onSubmit(values: z.infer<typeof contactUsSchema>) {
    const response = await fetch('/api/contact-us', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...values }),
    })

    if (response.ok) {
      console.log('Success!')
    } else {
      console.error('Failed to send contact us')
    }
  }

  const { isSubmitting, isSubmitSuccessful } = form.formState

  return isSubmitSuccessful ? (
    <Alert>
      <Check className='h-4 w-4' />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        Thank you for contacting us. We will get back to you as soon as
        possible.
      </AlertDescription>
    </Alert>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          name='name'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='name'>Name</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  id='name'
                  required
                  maxLength={256}
                  autoComplete='name'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='email'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='email'>Email Address</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  id='email'
                  required
                  maxLength={256}
                  autoComplete='email'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='phone'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='phone'>Phone Number (optional)</FormLabel>
              <FormControl>
                <Input
                  type='tel'
                  id='phone'
                  maxLength={256}
                  autoComplete='tel'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='website'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='website'>Website (optional)</FormLabel>
              <FormControl>
                <Input
                  type='url'
                  id='website'
                  maxLength={256}
                  autoComplete='url'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='subject'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='subject'>Subject</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  id='subject'
                  required
                  maxLength={256}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='message'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='message'>Message</FormLabel>
              <FormControl>
                <Textarea
                  id='message'
                  required
                  maxLength={4096}
                  {...field}
                  rows={8}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Submit
        </Button>
      </form>
    </Form>
  )
}
