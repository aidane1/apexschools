const nodeMailer = require ('nodemailer');

module.exports = async (
  account,
  to,
  //   from,
  subject,
  text,
  attachments = [],
  callback = () => {}
) => {
  let accounts = {
    Announcements: '"Apexschools" <announcements@apexschools.co>',
  };
  try {
    account = accounts[account];
    console.log (account);
    if (account) {
      let transponder = nodeMailer.createTransport ({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: global.server_info.keys.email_username,
          pass: global.server_info.keys.email_password,
        },
      });
      let mailOptions = {
        from: account,
        // from,
        to, // list of receivers
        subject,
        text,
        attachments,
      };
      transponder.sendMail (mailOptions, (err, info) => {
        if (err) {
          console.log (err);
        } else {
          console.log (info);
        }
      });
    } else {
      console.log ('Account not found.');
    }
  } catch (e) {
    console.log (e);
  }
};
