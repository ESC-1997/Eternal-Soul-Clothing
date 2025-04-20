// Subject: Your Energy Prevails 🧿

export const getWelcomeEmailTemplate = (firstName?: string) => {
  const greeting = firstName ? `Hey ${firstName},` : 'Hey there!';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Eternal Soul</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      max-width: 150px;
      margin-bottom: 20px;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 10px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #6B21A8;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="[Your Logo URL]" alt="Eternal Soul Logo" class="logo">
    <h1>Welcome to Eternal Soul</h1>
  </div>
  
  <div class="content">
    <p>${greeting}</p>
    
    <p>Welcome to the Eternal Soul family! We're thrilled to have you join our community of fashion enthusiasts and spiritual seekers.</p>
    
    <p>Here's what you can look forward to:</p>
    <ul>
      <li>Early access to new collections</li>
      <li>Exclusive member discounts</li>
      <li>Special event invitations</li>
      <li>Style inspiration and spiritual insights</li>
    </ul>
    
    <p>Ready to explore? Check out our latest collection:</p>
    
    <a href="[Your Store URL]" class="button">Shop Now</a>
    
    <p>If you have any questions, our team is here to help. Just reply to this email.</p>
    
    <p>Peace and Light,<br>The Eternal Soul Team</p>
  </div>
  
  <div class="footer">
    <p>© 2024 Eternal Soul. All rights reserved.</p>
    <p>You're receiving this email because you signed up at [Your Website URL]</p>
    <p><a href="[Unsubscribe URL]">Unsubscribe</a></p>
  </div>
</body>
</html>
  `;
};
