import nodemailer from 'nodemailer';

interface RegistrationEmailPayload {
  name: string;
  email: string;
  mobile?: string;
  hackingLevel?: string;
  attendedWolfCTF?: string;
  attendedWolfHackathons?: string;
}

export async function sendEmailDirectly(payload: RegistrationEmailPayload) {
  const {
    name,
    email,
    mobile,
    hackingLevel,
    attendedWolfCTF,
    attendedWolfHackathons,
  } = payload;

  if (!name || !email) {
    throw new Error('Missing required parameters (name, email).');
  }

  const smtpHost = process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || 'tvmhackershub@gmail.com';
  const rawPass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD || 'plyq zckw ntld hslm';
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

  // Cyber HTML Email Template (Black, White, Red)
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

  // Plain text fallback
  const textContent = `Hello ${name},

Welcome to TVM Hacker Hub!

Your registration has been successfully received.

Registration Details:

Name: ${name}
Email: ${email}
Ethical Hacking Level: ${levelCapitalized}
Wolf CTF: ${ctfStatus}
Wolf Hackathons: ${hackStatus}

We look forward to seeing you in the community.

LEARN • HACK • BUILD • SECURE

TVM Hacker Hub`;

  return await transporter.sendMail({
    from: fromAddress,
    to: email,
    subject: 'Welcome to TVM Hacker Hub - Registration Confirmed',
    text: textContent,
    html: htmlTemplate,
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const payload: RegistrationEmailPayload = req.body || {};
    const info = await sendEmailDirectly(payload);
    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error('Email dispatch error:', error);
    return res.status(500).json({
      error: 'Failed to dispatch confirmation email',
      details: error.message,
    });
  }
}
