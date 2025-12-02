import * as mailer from "nodemailer";

export async function sendSmtpOtp(otp: string, email: string) {
  let smtpPassword = process.env.SMTP;
  let smtpEmail = process.env.EMAIL;
  let m = mailer.createTransport({
    service: "gmail",
    auth: {
      user: smtpEmail,
      pass: smtpPassword,
    },
  });
  await m.sendMail({
    to: email,
    subject: "Otp",
    text: `Your OTP code is: ${otp}`,
    html: `<p>Your OTP code is: <b>${otp}</b></p>`,
  });
}
