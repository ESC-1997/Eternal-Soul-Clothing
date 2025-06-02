import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { ratelimit, getIP } from '../../../lib/rate-limit';

// Initialize SendGrid
if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not defined');
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(request: Request) {
  try {
    // Rate limiting - only if Upstash credentials are available
    const hasUpstashConfig = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;
    let rateLimitInfo = { remaining: 0, limit: 0 };

    if (hasUpstashConfig && ratelimit) {
      const ip = getIP(request);
      const { success, limit, reset, remaining } = await ratelimit.limit(ip);
      rateLimitInfo = { remaining, limit };

      if (!success) {
        return NextResponse.json(
          { 
            error: 'Too many requests',
            message: `Please try again in ${Math.ceil((reset - Date.now()) / 1000 / 60)} minutes`,
            remaining,
            limit
          },
          { status: 429 }
        );
      }
    }

    const { name, email, orderNumber, reason } = await request.json();

    if (!process.env.SENDGRID_FROM_EMAIL) {
      throw new Error('SENDGRID_FROM_EMAIL is not defined');
    }

    // Email content
    const msg = {
      to: 'returns@eternalsoul.co',
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `Return Request - Order #${orderNumber}`,
      html: `
        <h2>New Return Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Reason for Return:</strong> ${reason}</p>
      `,
    };

    // Send email
    await sgMail.send(msg);

    return NextResponse.json({ 
      success: true,
      ...(hasUpstashConfig && rateLimitInfo)
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send return request' },
      { status: 500 }
    );
  }
} 