import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import config from 'config';

class GoogleAuthService {
  public initializeGoogleAuth = () => {
    try {
      passport.use(
        new GoogleStrategy(
          {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.FRONTEND_HOST_NAME}/auth/google/callback`,
            passReqToCallback: true,
          },
          function (request, accessToken, refreshToken, profile, done) {
            return done(null, profile);
          },
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  public serializeUser = () => {
    passport.serializeUser((user, done) => {
      done(null, user);
    });
  };

  public deserializeUser = () => {
    passport.deserializeUser((user, done) => {
      done(null, user);
    });
  };
}

export default GoogleAuthService;
