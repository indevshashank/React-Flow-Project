import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    
  service: 'gmail',
  auth: {
    user: 'indev.shashank@gmail.com',
    pass: 'frckyxxpyrdezach',
  },
});

const sendMail = (to, subject, text) => {
  const mailOptions = {
    from: 'indev.shashank@gmail.com',
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

export default sendMail;