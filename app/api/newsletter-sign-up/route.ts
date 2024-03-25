import { Resend } from 'resend'
import { z, ZodError } from 'zod'

const NewsletterSignUp = z.object({
  email: z.string().email(),
})

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const body = await request.json()

  try {
    NewsletterSignUp.parse(body)
  } catch (error) {
    return Response.json(
      { error },
      {
        status: 400,
      }
    )
  }

  const { error } = await resend.contacts.create({
    email: body.email,
    unsubscribed: false,
    audienceId: '0e260e13-cbce-463c-963e-258ca972c31b',
  })

  if (error) {
    return Response.json(
      { error },
      {
        status: 400,
      }
    )
  }

  return Response.json({ subscribed: true })
}
