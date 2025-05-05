import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  console.log('Welcome email API called with:', req.body);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, name } = req.body;

  if (!to) {
    return res.status(400).json({ error: 'Recipient email is required' });
  }

  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL, // Set this in your .env.local
    subject: 'Welcome to Our App!',
    text: `Hi${name ? ' ' + name : ''}, welcome to our app!`,
    html: `<strong>Hi${name ? ' ' + name : ''}, welcome to our app!</strong>`,
  };

  console.log('Attempting to send email with config:', {
    to: msg.to,
    from: msg.from,
    subject: msg.subject
  });

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
    return res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    console.error('SendGrid error:', error);
    if (error.response) {
      console.error('SendGrid error details:', error.response.body);
    }
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
} 