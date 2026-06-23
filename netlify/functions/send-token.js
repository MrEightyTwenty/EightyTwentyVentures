/* ==========================================================================
   EightyTwentyVentures — Magic Link Sender
   Generates a signed HMAC token and delivers it via Resend.
   No database required. Token is self-contained and expires in 30 minutes.

   Environment variables required:
     RESEND_API_KEY  — from resend.com dashboard
     TOKEN_SECRET    — random 64-char hex string (generate once, store in Netlify)
   ========================================================================== */

const crypto = require('crypto');

const EXPIRY_MS  = 30 * 60 * 1000;   // 30 minutes
const EMAIL_FROM = 'EightyTwentyVentures <access@eightytwentyventures.com>';

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  /* ── Parse body ─────────────────────────────────────────────── */
  let email, redirect;
  try {
    const body = JSON.parse(event.body || '{}');
    email    = (body.email    || '').trim().toLowerCase();
    redirect = (body.redirect || '/briefings.html').trim();
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailPattern.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Valid email required' }) };
  }

  /* ── Config check ───────────────────────────────────────────── */
  const secret  = process.env.TOKEN_SECRET;
  const apiKey  = process.env.RESEND_API_KEY;
  const siteUrl = (process.env.URL || 'https://eightytwentyventures.com').replace(/\/$/, '');

  if (!secret || !apiKey) {
    console.error('Missing env vars: TOKEN_SECRET or RESEND_API_KEY');
    return { statusCode: 500, body: JSON.stringify({ error: 'Server configuration error' }) };
  }

  /* ── Generate token: <timestamp>.<hmac> ─────────────────────── */
  const timestamp = Date.now();
  const payload   = `${email}|${timestamp}`;
  const hmac      = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const token     = `${timestamp}.${hmac}`;

  /* ── Build magic link ───────────────────────────────────────── */
  const qs        = new URLSearchParams({ email, token, redirect });
  const magicLink = `${siteUrl}/access.html?${qs.toString()}`;

  /* ── Send via Resend ────────────────────────────────────────── */
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from:    EMAIL_FROM,
        to:      [email],
        subject: 'Your access link — EightyTwentyVentures',
        html:    buildEmailHtml(magicLink)
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Resend error:', JSON.stringify(err));
      return { statusCode: 502, body: JSON.stringify({ error: 'Email delivery failed' }) };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true })
    };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};

/* ── Email template ─────────────────────────────────────────────── */
function buildEmailHtml (magicLink) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Your access link</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
         style="background:#0a0a0a;padding:48px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" role="presentation"
             style="background:#111111;border:1px solid #222222;border-radius:4px;
                    padding:48px 40px;max-width:520px;width:100%;">
        <tr><td>

          <p style="margin:0 0 28px;font-size:11px;letter-spacing:0.14em;
                    text-transform:uppercase;color:#555555;">
            EightyTwentyVentures
          </p>

          <h1 style="margin:0 0 16px;font-size:22px;font-weight:600;
                     color:#ffffff;line-height:1.3;">
            Your access link
          </h1>

          <p style="margin:0 0 32px;font-size:15px;line-height:1.65;color:#888888;">
            Click the button below to access EightyTwentyVentures.
            This link expires in 30 minutes.
          </p>

          <table cellpadding="0" cellspacing="0" role="presentation"
                 style="margin:0 0 36px;">
            <tr>
              <td style="background:#2dc89a;border-radius:3px;">
                <a href="${magicLink}"
                   style="display:inline-block;padding:14px 28px;font-size:14px;
                          font-weight:700;color:#000000;text-decoration:none;
                          letter-spacing:0.02em;">
                  Access EightyTwentyVentures
                </a>
              </td>
            </tr>
          </table>

          <p style="margin:0 0 8px;font-size:12px;color:#444444;">
            Or copy this URL into your browser:
          </p>
          <p style="margin:0 0 36px;font-size:11px;color:#333333;
                    line-height:1.5;word-break:break-all;">
            ${magicLink}
          </p>

          <table cellpadding="0" cellspacing="0" role="presentation"
                 style="width:100%;">
            <tr><td style="border-top:1px solid #1e1e1e;padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#3a3a3a;line-height:1.5;">
                If you did not request this, ignore this email.
                No action is required.
              </p>
            </td></tr>
          </table>

        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
