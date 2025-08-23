
/**
 * Minimal Express backend for booking requests.
 * Usage:
 *   1) npm install
 *   2) Set environment variables (see below)
 *   3) npm start
 */
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // serve static site

app.post('/api/bookings', async (req, res) => {
  const booking = req.body || {};
  try {
    // Configure transporter using env vars (works with many SMTP providers)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    const toEmail = process.env.BOOKINGS_EMAIL || 'hello@streakssalon.com';
    const text = Object.entries(booking).map(([k,v]) => `${k}: ${v}`).join('\n');

    await transporter.sendMail({
      from: `Streaks Salon Bookings <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'New Booking Request — Streaks Salon',
      text
    });

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'Failed to send' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on http://localhost:' + PORT));
