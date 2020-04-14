const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendAccountMessage = (to, subject, text) => {
    const msg = {
      to,
      from: 'juancollado.dev@gmail.com',
      subject,
      text,
    };
    sgMail.send(msg);
}

const welcomeEmail = (to, name) => {
    return sendAccountMessage(to,
        'Welcome to the app',
        `Thank for joining in, ${name}. Let me now how you get along with the app`
    )
}

const cancelationEmail = (to, name) => {
    return sendAccountMessage(to,
        'Deleted Account',
        `Good bye, ${name}.`)
}

module.exports = {
    welcomeEmail,
    cancelationEmail
}
