// Subject: Your Energy Prevails 🧿

export const getWelcomeEmailTemplate = (firstName?: string) => {
  const greeting = firstName ? `Hey ${firstName},` : 'Hey there!';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to Eternal Soul Clothing</title>
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
          padding: 20px 0;
        }
        .content {
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 5px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Welcome to Eternal Soul Clothing</h1>
      </div>
      <div class="content">
        <p>${greeting}</p>
        <p>Thank you for joining Eternal Soul Clothing! We're excited to have you as part of our community.</p>
        <p>Your journey to expressing your unique style begins here. Explore our collection of handcrafted, soulful clothing that tells your story.</p>
        <p>Stay tuned for exclusive offers, new arrivals, and style inspiration.</p>
        <p>With love,<br>The Eternal Soul Team</p>
      </div>
      <div class="footer">
        <p>© 2024 Eternal Soul Clothing. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};
