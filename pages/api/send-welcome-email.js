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
    from: process.env.SENDGRID_FROM_EMAIL,
    templateId: 'd-845ddb0e9a1a4db4af466fc168fbb98a',
    dynamic_template_data: {
      first_name: name,
    },
  };

  console.log('Attempting to send email with config:', {
    to: msg.to,
    from: msg.from,
    templateId: msg.templateId,
    dynamic_template_data: msg.dynamic_template_data,
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