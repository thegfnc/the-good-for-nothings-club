import { contactUsSchema } from '@/data/schemas'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const body = await request.json()

  try {
    contactUsSchema.parse(body)
  } catch (error) {
    return Response.json(
      { error },
      {
        status: 400,
      }
    )
  }

  const { error } = await resend.emails.send({
    from: `GFNC Contact Us Form <no-reply@updates.thegoodfornothings.club>`,
    to: ['hello@thegoodfornothings.club'],
    subject:
      'Contact Us Form Submission @ https://www.thegoodfornothings.club/contact',
    text: `Name: ${body.name}\nEmail: ${body.email}\nPhone: ${body.phone}\nWebsite: ${body.website}\nSubject: ${body.subject}\nMessage: ${body.message}`,
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
