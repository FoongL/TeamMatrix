const FacebookStrategy = require('passport-facebook').Strategy;

require('dotenv').config();

const knex = require('knex')({
  client: 'postgresql',
  connection: {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
});

module.exports = passport => {
  passport.use(
    'facebook',
    new FacebookStrategy(
      {
        clientID: process.env.AppId,

        clientSecret: process.env.AppSecret,

        callbackURL: `/auth/facebook/callback`,

        profileFields: [
          'id',
          'email',
          'name',
          'gender',
          'displayName',
          'profileUrl'
        ]
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);

        let userResult = await knex('users').where({ facebookID: profile.id });

        if (userResult == 0) {
          let user = {
            f_name: profile.name.givenName,
            l_name:profile.name.familyName,
            username: profile.displayName,
            facebookID: profile.id,
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
