require("dotenv").config();
const express = require("express");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const app = express();
const passportSetup = require("./passport");
const cors = require("cors");
const connection = require("./db");
const routes = require("./routes/routes");
const passport = require("passport");
//database connection
connection();

//session
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.JWTPRIVATEKEY],
    maxAge: 24 * 60 * 60 * 100,
    secure:true,
    // httpOnly:true,
    // sameSite:true
  })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
//middlewares
app.use(
  cors({
    origin: [process.env.CLIENT_ORIGIN],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//routes
app.use("/", routes);
const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`✅ Listening on port ${port}...`));
