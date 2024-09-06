import Mailgun from "mailgun.js";
const mailgun = new Mailgun.default(FormData);
const mg = mailgun.client({
  username: process.env.MG_USERNAME!,
  key: process.env.MG_API_KEY!,
});

export default mg;
