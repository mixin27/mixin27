// export const nodemailerConfig = {
//   service: "gmail",
//   host: process.env.EMAIL_SERVER_HOST!,
//   port: process.env.EMAIL_SERVER_PORT!,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_SERVER_USER!,
//     pass: process.env.EMAIL_SERVER_PASSWORD!,
//   },
// };

export const nodemailerConfig = {
  service: "gmail",
  auth: {
    user: "kyawzayartun.dev@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
};
