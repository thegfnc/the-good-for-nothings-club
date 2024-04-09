import { newsletterSignUpSchema } from '@/app/data/schemas'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const body = await request.json()

  try {
    newsletterSignUpSchema.parse(body)
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

  return Response.json({ success: true })
}
