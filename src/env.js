import dotenv from "dotenv";
dotenv.config();

const env = {
  PORT: process.env.PORT,
  GoogleClientId: process.env.GoogleClientId,
  GoogleClientSecret: process.env.GoogleClientSecret,
  RedirectURL: process.env.RedirectURL,
  GoogleAPIKey:process.env.GoogleAPIKey,
};

export default env;