import passport from 'passport';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  JwtFromRequestFunction,
} from 'passport-jwt';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

dotenv.config();

const jwtOptions: {
  jwtFromRequest: JwtFromRequestFunction;
  secretOrKey: string;
} = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!, // <- use your .env
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (user) return done(null, user);
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

// Export the initialized passport instance
export default passport;
