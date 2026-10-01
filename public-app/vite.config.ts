import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// Custom Vite plugin to handle /api/send-registration-email locally during development
function localEmailApiPlugin(): Plugin {
  return {
    name: 'local-email-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/send-registration-email' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              const { name, email, hackingLevel, attendedWolfCTF, attendedWolfHackathons } = data;

              if (!name || !email) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: 'Missing required parameters (name, email).' }));
              }

              const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
              const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
              const smtpUser = process.env.SMTP_USER || 'tvmhackershub@gmail.com';
              const rawPass = process.env.SMTP_PASS || 'plyq zckw ntld hslm';
              const smtpPass = rawPass.replace(/\s+/g, '');
              const fromAddress = process.env.EMAIL_FROM || `"TVM Hacker Hub" <${smtpUser}>`;

              const transporter = nodemailer.createTransport({
                host: smtpHost,
                port: smtpPort,
                secure: smtpPort === 465,
                auth: {
                  user: smtpUser,
                  pass: smtpPass,
                },
              });

              const levelCapitalized = hackingLevel ? hackingLevel.toUpperCase() : 'BASIC';
              const ctfStatus = attendedWolfCTF?.toLowerCase() === 'yes' ? 'YES' : 'NO';
              const hackStatus = attendedWolfHackathons?.toLowerCase() === 'yes' ? 'YES' : 'NO';

              const htmlTemplate = `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="utf-8">
                <style>
                  body { margin: 0; padding: 0; background-color: #000000; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif; color: #FFFFFF; }
                  .container { max-width: 600px; margin: 0 auto; background-color: #080808; border: 1px solid #2A2A2A; border-top: 4px solid #FF1A1A; border-radius: 8px; overflow: hidden; }
                  .header { padding: 32px 24px; text-align: center; background-color: #111111; border-bottom: 1px solid #2A2A2A; }
                  .title { font-size: 24px; font-weight: 900; letter-spacing: 2px; color: #FFFFFF; text-transform: uppercase; margin: 0; }
                  .tagline { font-size: 11px; font-weight: 700; color: #FF1A1A; letter-spacing: 3px; margin-top: 8px; text-transform: uppercase; }
                  .body-content { padding: 32px 24px; font-size: 15px; line-height: 1.6; color: #E5E5E5; }
                  .greeting { font-size: 18px; font-weight: bold; color: #FFFFFF; margin-bottom: 16px; }
                  .details-box { background-color: #111111; border: 1px solid #2A2A2A; border-left: 3px solid #FF1A1A; border-radius: 4px; padding: 18px; margin: 24px 0; }
                  .detail-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #1a1a1a; font-family: 'Courier New', monospace; font-size: 13px; }
                  .detail-label { color: #888888; text-transform: uppercase; }
                  .detail-val { color: #FFFFFF; font-weight: bold; }
                  .footer { padding: 24px; text-align: center; font-size: 12px; color: #666666; background-color: #050505; border-top: 1px solid #2A2A2A; }
                </style>
              </head>
              <body>
                <div style="padding: 20px 10px;">
                  <div class="container">
                    <div class="header">
                      <h1 class="title">TVM <span style="color:#FF1A1A;">HACKER HUB</span></h1>
                      <p class="tagline">LEARN • HACK • BUILD • SECURE</p>
                    </div>
                    
                    <div class="body-content">
                      <p class="greeting">Hello ${name},</p>
                      <p>Welcome to <strong>TVM Hacker Hub</strong>!</p>
                      <p>Your registration has been successfully received.</p>
                      
                      <div class="details-box">
                        <div style="font-family: monospace; font-weight: bold; color: #FF1A1A; margin-bottom: 10px; text-transform: uppercase; font-size: 12px;">
                          Registration Details:
                        </div>
                        <div class="detail-row">
                          <span class="detail-label">Name:</span>
                          <span class="detail-val">${name}</span>
                        </div>
                        <div class="detail-row">
                          <span class="detail-label">Email:</span>
                          <span class="detail-val">${email}</span>
                        </div>
                        <div class="detail-row">
                          <span class="detail-label">Ethical Hacking Level:</span>
                          <span class="detail-val" style="color: #FF1A1A;">${levelCapitalized}</span>
                        </div>
                        <div class="detail-row">
                          <span class="detail-label">Wolf CTF:</span>
                          <span class="detail-val">${ctfStatus}</span>
                        </div>
                        <div class="detail-row" style="border-bottom: none;">
                          <span class="detail-label">Wolf Hackathons:</span>
                          <span class="detail-val">${hackStatus}</span>
                        </div>
                      </div>

                      <p>We look forward to seeing you in the community. You will receive updates about upcoming CTF challenges, workshops, and meetups.</p>
                      
                      <p style="margin-top: 30px; font-family: monospace; font-size: 12px; color: #FF1A1A; font-weight: bold;">
                        LEARN • HACK • BUILD • SECURE<br>
                        <span style="color: #FFFFFF;">TVM Hacker Hub Team</span>
                      </p>
                    </div>

                    <div class="footer">
                      <p style="margin: 0 0 6px 0;">This is an automated confirmation from TVM Hacker Hub.</p>
                      <p style="margin: 0; font-family: monospace; font-size: 10px;">DISCLAIMER: For ethical cybersecurity education & research.</p>
                    </div>
                  </div>
                </div>
              </body>
              </html>
              `;

              const info = await transporter.sendMail({
                from: fromAddress,
                to: email,
                subject: 'Welcome to TVM Hacker Hub - Registration Confirmed',
                html: htmlTemplate,
              });

              console.log(`[Email Dispatch] Confirmation sent to ${email} (ID: ${info.messageId})`);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, messageId: info.messageId }));
            } catch (err: any) {
              console.error('[Email Dispatch Error]', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localEmailApiPlugin()],
  server: {
    port: 5173,
    host: true,
  },
});
