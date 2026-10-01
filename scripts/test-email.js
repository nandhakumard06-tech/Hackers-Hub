import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function testEmail() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');
  const from = process.env.EMAIL_FROM || user;

  console.log('Testing SMTP with User:', user, 'Host:', host, 'Port:', port);

  const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: port === 465,
    auth: {
      user: user,
      pass: pass,
    },
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP Connection verified successfully!');

    const info = await transporter.sendMail({
      from: from,
      to: user,
      subject: 'Test Email - TVM Hackers Hub',
      text: 'This is a verification test from TVM Hackers Hub.',
    });
    console.log('✅ Test email sent successfully! Message ID:', info.messageId);
  } catch (err) {
    console.error('❌ SMTP Error:', err);
  }
}

testEmail();
