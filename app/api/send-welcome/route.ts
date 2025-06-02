import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();
    console.log('Received welcome email request:', { email, name });
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    await sgMail.send({
      to: email,
      from: {
        email: 'info@eternalsoul.co', // your verified sender
        name: 'Eternal Soul Clothing',
      },
      subject: 'Your Energy Prevails 🔮',
      html: `
        <div style="background:#DADBE4;padding:32px 0;">
          <div style="max-width:420px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 2px 12px 0 rgba(0,0,0,0.10);padding:32px;">
            <div style="text-align:center;">
              <img src="https://www.eternalsoul.co/images/Phoenix_ES_1B1F3B.png" alt="Eternal Soul Logo" style="height:60px;margin-bottom:16px;" />
              <h1 style="color:#9F2FFF;font-family:'Bebas Neue',Arial,sans-serif;font-size:2rem;margin-bottom:8px;font-weight:bold;">
                Welcome${name ? ', ' + name : ''}!
              </h1>
              <p style="color:#1B1F3B;font-family:'Lato',Arial,sans-serif;font-size:1.1rem;margin-bottom:24px;">
                We're all about more than just clothes — we're about energy, expression, and wearing your soul on your sleeve (literally). You'll be the first to know about exclusive drops, limited-time promo codes, and behind-the-scenes updates from the brand.
              </p>
              <p style="color:#1B1F3B;font-family:'Lato',Arial,sans-serif;font-size:1rem;">
                We're just getting started — and we're glad you're here.
              </p>
              <p style="color:#9F2FFF;font-size:0.9rem;margin-top:32px;">
                Eternal Soul Clothing &copy; ${new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      `,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
} 