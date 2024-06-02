import { google } from "googleapis";
import env from "./env.js";

const oauth2Client = new google.auth.OAuth2(
  env.GoogleClientId,
  env.GoogleClientSecret,
  env.RedirectURL
);

const calendar = google.calendar({
  version: "v3",
  auth: env.GoogleAPIKey,
});

const scopes = ["https://www.googleapis.com/auth/calendar"];

export const createRedirectUrl = async (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  res.send(url);
};

export const setTokens = async (req, res) => {

  const { code } = req.query;
  console.log("this is code : ", code);

  const { tokens } = await oauth2Client.getToken(code);

  req.session.tokens = tokens;
  console.log("this is the session", req.session);
  oauth2Client.setCredentials(tokens);
  await req.session.save();
  console.log('cookie check:', req.cookies);
  res.send({ success: true, message: "user logged in" });
};

export const scheduleEvent = async (req, res) => {
  const { tokens } = req.session;
  console.log("this is cookes:", req.cookies);
  console.log("this is the session: ", req.session);
  console.log("this is token: ", tokens);
  // oauth2Client.setCredentials(tokens);

  const event = {
    summary: req.body.title,
    description: req.body.description,
    start: {
      dateTime: req.body.startTime,
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: req.body.endTime,
      timeZone: "Asia/Kolkata",
    },
  };


  // const event = {
  //   summary: "req.body.title",
  //   description: "req.body.description",
  //   start: {
  //     dateTime: new Date().toISOString(),
  //     timeZone: "Asia/Kolkata",
  //   },
  //   end: {
  //     dateTime: new Date(Date.now() + 86400000).toISOString(),
  //     timeZone: "Asia/Kolkata",
  //   },
  // };


  await calendar.events.insert({
    auth: oauth2Client,
    calendarId: "primary",
    resource: event,
  });
  res.send("done");
};
