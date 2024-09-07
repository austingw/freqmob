import mg from "./mg";

export default async function sendPasswordResetEmail(
  email: string,
  verificationLink: string,
) {
  let res = false;
  await mg.messages
    .create("mail.freqmob.com", {
      from: "Freqmob <fm@mail.freqmob.com>",
      to: [email],
      subject: "Password Reset",
      text: `Please use the following link to reset your password: ${verificationLink}`,
      html: `<p>Please use the following link to reset your password: <a href="${verificationLink}">${verificationLink}</a></p>`,
    })
    .then(() => {
      res = true;
    })
    .catch((err) => {
      res = false;
      console.error(err);
    });

  return res;
}
