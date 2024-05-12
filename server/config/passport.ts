import {
  Strategy as JwtStrategy,
  ExtractJwt,
  JwtFromRequestFunction,
} from 'passport-jwt';
import { PassportStatic } from 'passport';
// import mongoose from 'mongoose';
// import { keys } from './keys.ts';

import { User } from '../models/User';

const opts: {
  jwtFromRequest: JwtFromRequestFunction;
  secretOrKey: string;
} = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret',
};

export default (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(
      opts,
      (
        jwt_payload: any,
        done: (error: any, user?: any, options?: any) => void
      ) => {
        User.findById(jwt_payload.id)
          .then((user) => {
            if (user) {
              return done(null, user);
            }
            return done(null, false);
          })
          .catch((err) => console.log(err));
      }
    )
  );
};
