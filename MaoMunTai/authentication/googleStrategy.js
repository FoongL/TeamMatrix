var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
require('dotenv').config();

const knex = require('knex')({
  client: 'postgresql',
  connection: {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
});

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.
module.exports = passport => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GoogleId,
        clientSecret: process.env.GoogleSecret,
        callbackURL: '/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        console.log(profile._json.email);

        let userResult = await knex('users').where({ googleID: profile.id });

        if (userResult == 0) {
          let user = {
            f_name: profile.name.givenName,
            l_name:profile.name.familyName,
            username: profile.displayName,
            googleID: profile.id,
            email: profile._json.email,
            accessToken: accessToken
          };

          let query = await knex('users')
            .insert(user)
            .returning('id');

          user.id = query[0];

          done(null, user);
        } else {
          done(null, userResult[0]);
        }
      }
    )
  );
};
