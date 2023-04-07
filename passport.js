const GithubStrategy = require("passport-github2").Strategy;
const passport = require("passport");
const { User } = require("./models/user");
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const name = profile?.displayName?.split(" ");
        let user = new User({
          FirstName: name[0],
          LastName: name[1],
          Email: profile.emails[0].value,
          Provider: profile.provider,
          Verified: true,
        });
        const userexist = await User.findOne({
          Email: profile.emails[0].value,
        });
        if (!userexist) {
          await user.save();
          return done(null, user);
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(null, err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  let userexist = await User.findOne({ Email: user.Email });
  if (userexist) {
    done(null, user);
  }
});
