import express from "express";
import session from "express-session";
import * as Controller from "./controllers.js";
import expressAsyncHandler from "express-async-handler";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    }, // Set secure to true if using HTTPS
  })
);
app.use(
  cors({
    origin: "http://localhost:3000", // or the actual domain of your React app
    credentials: true,
  })
);
app.get("/google", expressAsyncHandler(Controller.createRedirectUrl));
app.get("/google/auth", expressAsyncHandler(Controller.setTokens));

app.post("/event", expressAsyncHandler(Controller.scheduleEvent));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.get("/test-session", (req, res) => {
  req.session.test = { thisis: "kd" };
  res.send("Session set");
});

app.get("/check-session", (req, res) => {
  res.send(req.session.test || "No session value set");
});

app.listen(process.env.PORT, () => {
  console.log(`server is running at ${process.env.PORT}`);
});
