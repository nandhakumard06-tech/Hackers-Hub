import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

function getEmailDocId(email: string): string {
  return email.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
}

// Custom Vite plugin to handle /api/register and /api/send-registration-email locally during development
function localRegisterApiPlugin(): Plugin {
  return {
    name: 'local-register-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if ((req.url === '/api/register' || req.url === '/api/send-registration-email') && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              const { name, email, mobile, hackingLevel, attendedWolfCTF, attendedWolfHackathons, hackathonCount } = data;

              if (!name || !email) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: 'Missing required parameters (name, email).' }));
              }

              const projectId = process.env.FIREBASE_PROJECT_ID || 'hacker-hub-720b0';
              const apiKey = process.env.FIREBASE_API_KEY || '';
              const docId = getEmailDocId(email);

              // 1. Check duplicate in Firestore
              const checkUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/registrations/${docId}${apiKey ? `?key=${apiKey}` : ''}`;
              const checkRes = await fetch(checkUrl);
              if (checkRes.status === 200) {
                res.statusCode = 409;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: 'This email is already registered with TVM Hackers Hub.' }));
              }

              // 2. Save document to Firestore
              const documentBody = {
                fields: {
                  name: { stringValue: name.trim() },
                  email: { stringValue: email.trim().toLowerCase() },
                  mobile: { stringValue: (mobile || '').trim() },
                  hackingLevel: { stringValue: hackingLevel || 'basic' },
                  attendedWolfCTF: { stringValue: attendedWolfCTF || 'no' },
                  attendedWolfHackathons: { stringValue: attendedWolfHackathons || 'no' },
                  hackathonCount: { stringValue: hackathonCount || '' },
                  createdAt: { timestampValue: new Date().toISOString() }
                }
              };

              const saveRes = await fetch(checkUrl, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(documentBody)
              });

              if (!saveRes.ok) {
                console.warn('[Local Dev DB Note] Firestore REST save status:', saveRes.status);
              }

              // 3. Send confirmation email
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

              try {
                const info = await transporter.sendMail({
                  from: fromAddress,
                  to: email,
                  subject: 'Welcome to TVM Hacker Hub - Registration Confirmed',
                  html: htmlTemplate,
                });
                console.log(`[Email Dispatch] Confirmation sent to ${email} (ID: ${info.messageId})`);
              } catch (mailErr) {
                console.error('[Email Dispatch Error (Non-Fatal)]', mailErr);
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, id: docId }));
            } catch (err: any) {
              console.error('[Local Register API Error]', err);
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
  plugins: [react(), localRegisterApiPlugin()],
  server: {
    port: 5173,
    host: true,
  },
});
