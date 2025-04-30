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
        .content {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 5px;
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
        <h1>Welcome to Eternal Soul</h1>
      </div>
      <div class="content">
        <p>${greeting}</p>
        <p>Thank you for joining Eternal Soul! We're excited to have you as part of our community.</p>
        <p>Your energy and presence are what make Eternal Soul special. We can't wait to see how you'll contribute to our growing community.</p>
        <p>If you have any questions or need assistance, feel free to reach out to us.</p>
        <p>With love and light,<br>The Eternal Soul Team</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Eternal Soul. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}; 
