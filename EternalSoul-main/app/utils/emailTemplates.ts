export const getWelcomeEmailTemplate = (firstName?: string) => {
  const greeting = firstName ? `Hey ${firstName},` : 'Hey there!';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Eternal Soul</title>
  <style>
    body {
      font-family: Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .greeting {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .content {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .signature {
      text-align: center;
      margin: 40px 0;
    }
    .signature-name {
      font-style: italic;
      font-size: 18px;
      margin-bottom: 5px;
    }
    .signature-title {
      font-size: 16px;
      margin-bottom: 5px;
    }
    .signature-email {
      font-size: 16px;
    }
    .logo {
      text-align: center;
      margin-top: 20px;
    }
    .logo img {
      max-width: 200px;
      height: auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="greeting">${greeting}</div>
    
    <div class="content">
      <p>Welcome to the Eternal Soul family.</p>
      
      <p>We're all about more than just clothes — we're about energy, expression, and wearing your soul on your sleeve (literally). You'll be the first to know about exclusive drops, limited-time promo codes, and behind-the-scenes updates from the brand.</p>
      
      <p>We're just getting started — and we're glad you're here.</p>
      
      <p>Stay grounded. Stay limitless.</p>
      
      <p>– Eternal Soul</p>
    </div>
    
    <div class="signature">
      <div class="signature-name">Izaiah Rivera</div>
      <div class="signature-title">Founder | Eternal Soul</div>
      <div class="signature-email">📧 info@eternalsoul.co</div>
    </div>
    
    <div class="logo">
      <img src="https://eternalsoul.co/images/eternal_soul_purple.png" alt="Eternal Soul Logo">
    </div>
  </div>
</body>
</html>
  `;
};
