// Minimal SMTP client for Workers (TCP sockets, implicit TLS on 465): EHLO, AUTH LOGIN, one message, QUIT.
// Used to hand demo requests to our own Zoho mailbox, authenticated as that mailbox — we never send "as" the visitor.
import { connect } from 'cloudflare:sockets';

const enc = new TextEncoder(), dec = new TextDecoder();
const b64 = (s) => btoa(String.fromCharCode(...enc.encode(s)));

// RFC 2047 for headers with non-ASCII text; header values are already stripped of CR/LF by the caller.
export const word = (s) => (/^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${b64(s)}?=`);

export async function sendMail({ host, port = 465, user, pass, from, envelopeFrom = user, to, replyTo, subject, text, heloDomain }) {
  const socket = connect({ hostname: host, port }, { secureTransport: 'on', allowHalfOpen: false });
  const writer = socket.writable.getWriter(), reader = socket.readable.getReader();
  let buf = '';
  const read = async () => {               // one full reply: lines until "NNN " (space after the code)
    for (;;) {
      const lines = buf.split('\r\n');
      for (let i = 0; i < lines.length - 1; i++) {
        if (!/^\d{3} /.test(lines[i])) continue;
        const reply = lines.slice(0, i + 1).join('\n');
        buf = lines.slice(i + 1).join('\r\n');
        return { code: +lines[i].slice(0, 3), text: reply };
      }
      const { value, done } = await reader.read();
      if (done) throw new Error('smtp: connection closed');
      buf += dec.decode(value, { stream: true });
    }
  };
  // errors name the step and quote the server's reply, never the line we sent (AUTH lines carry the credentials)
  const cmd = async (step, line, expect) => {
    if (line != null) await writer.write(enc.encode(line + '\r\n'));
    const r = await read();
    if (!expect.includes(r.code)) throw new Error(`smtp ${step} → ${r.text.replace(/\s+/g, ' ').slice(0, 140)}`);
    return r;
  };
  try {
    await cmd('greeting', null, [220]);
    await cmd('ehlo', `EHLO ${heloDomain}`, [250]);
    await cmd('auth', 'AUTH LOGIN', [334]);
    await cmd('auth-user', b64(user), [334]);
    await cmd('auth-pass', b64(pass), [235]);
    await cmd('mail-from', `MAIL FROM:<${envelopeFrom}>`, [250]);
    for (const r of to) await cmd('rcpt', `RCPT TO:<${r}>`, [250, 251]);
    await cmd('data', 'DATA', [354]);
    const id = `<${crypto.randomUUID()}@${heloDomain}>`;
    const head = [
      `From: ${from}`, `To: ${to.join(', ')}`, replyTo ? `Reply-To: ${replyTo}` : null, `Subject: ${word(subject)}`,
      `Date: ${new Date().toUTCString().replace('GMT', '+0000')}`, `Message-ID: ${id}`, 'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64',
    ].filter(Boolean).join('\r\n');
    const body = b64(text.replace(/\r?\n/g, '\r\n')).replace(/.{76}/g, '$&\r\n');
    const accepted = await cmd('message', `${head}\r\n\r\n${body}\r\n.`, [250]);
    await writer.write(enc.encode('QUIT\r\n')).catch(() => {});
    return { messageId: id, server: accepted.text.slice(0, 200) };
  } finally {
    try { await socket.close(); } catch {}
  }
}
