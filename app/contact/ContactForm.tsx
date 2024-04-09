'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Button } from '../components/ui/Button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/Form'

const formSchema = z.object({
  name: z.string().max(256),
  email: z.string().email(),
  phone: z.string().max(256).optional(),
  website: z.string().url().optional(),
  subject: z.string().max(256),
  message: z.string().max(5000),
})

export default function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      website: '',
      subject: '',
      message: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
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
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  )
}
