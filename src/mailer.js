import mailer from '@sendgrid/mail'

export function setupMail() {
  mailer.setApiKey(process.env.SENDGRID_API_KEY)
}

export function send({
  to,
  subject,
  html,
  text,
  from = 'support',
  label = 'BadukClub Admins',
}) {
  mailer.send({
    to,
    subject,
    text,
    ...(html ? { html } : {}),
    from: `${label} <${from}@baduk.club>`,
  })
}
