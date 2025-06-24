// backend/src/templates/emailVerification.template.js

/**
 * @param {string} verificationCode - The 6-digit code to be sent.
 * @returns {string} - The full HTML content for the verification email.
 */
export const createVerificationEmailTemplate = (verificationCode) => {
    const primaryColor = '#2DD4BF';
    const backgroundColor = '#0F172A';
    const textColor = '#E2E8F0';
    const mutedTextColor = '#94A3B8'; 
  
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
          body {
              margin: 0;
              padding: 0;
              background-color: #E5E7EB; /* Tashqi fon, email klient uchun */
              font-family: 'Poppins', sans-serif;
          }
          .email-container {
              background-color: ${backgroundColor};
              color: ${textColor};
              padding: 40px 20px;
              max-width: 600px;
              margin: 20px auto;
              border-radius: 16px;
          }
          .content {
              text-align: center;
          }
          .header {
              font-size: 28px;
              font-weight: 700;
              line-height: 1.3;
              margin: 0 0 16px;
              color: #FFFFFF;
          }
          /* Shimmer effekti uchun animatsiya va stil */
          @keyframes shimmer {
              0% { background-position: 200% center; }
              100% { background-position: -200% center; }
          }
          .shimmer-text {
              font-weight: 700;
              background: linear-gradient(110deg, ${primaryColor} 40%, #FFFFFF 50%, ${primaryColor} 60%);
              background-size: 200% 100%;
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
              animation: shimmer 4s linear infinite;
          }
          .sub-header {
              font-size: 16px;
              color: ${mutedTextColor};
              margin-bottom: 32px;
              line-height: 1.5;
          }
          .code-box {
              background-color: rgba(13, 148, 136, 0.1);
              border: 1px dashed ${primaryColor};
              border-radius: 12px;
              padding: 24px;
              margin: 32px auto;
              max-width: 320px;
          }
          .code {
              font-size: 40px;
              font-weight: 700;
              color: #FFFFFF;
              letter-spacing: 12px;
              margin: 0;
              text-shadow: 0 0 15px ${primaryColor};
          }
          .footer-text {
              font-size: 12px;
              color: #64748B;
          }
          .logo {
              font-weight: 600;
              color: ${primaryColor};
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="content">
              <h1 class="header">
                  Your verification <span class="shimmer-text">code</span>
              </h1>
              <p class="sub-header">
                  Enter this code in your browser to complete your registration.
              </p>
              <div class="code-box">
                  <p class="code">${verificationCode}</p>
              </div>
              <p class="footer-text">
                  This code will expire in 10 minutes. If you didn't request this, please ignore this email.
              </p>
              <p class="footer-text" style="margin-top: 32px;">
                  Thank you, <br>
                  The <span class="logo">Trello.</span> Team
              </p>
          </div>
      </div>
  </body>
  </html>
    `;
  };