const { AuthenticationError } = require('apollo-server-express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function setCookie({ tokenName, token, res }) {
  res.cookie(tokenName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 2 /* 2h */
  });
}


function generateToken(user, secret) {
  const { id, email} = user; /* Omit the password from the token */
  return jwt.sign({ id, email }, secret, {
    expiresIn: '2h'
  });
}

module.exports = (app) => {
  return {
    async signup(parent, {user: { fullname, email, password }}, context) {
      try {

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await context.pgResource.createUser({
          fullname: fullname,
          email: email,
          password: hashedPassword
        });

        setCookie({
          tokenName: app.get('JWT_COOKIE_NAME'),
          token: generateToken(user, app.get('JWT_SECRET')),
          res: context.req.res
        });

        return {
          id: user.id
        };
      } catch (e) {
        console.log(e)
        throw new AuthenticationError(e);
      }
    },

    async login(parent, {user: { email, password }}, context) {
      try {
        const user = await context.pgResource.getUserAndPasswordForVerification(email);

        const valid = await bcrypt.compare(password, user.password);

    
        if (!valid || !user) throw 'User was not found.';

        setCookie({
          tokenName: app.get('JWT_COOKIE_NAME'),
          token: generateToken(user, app.get('JWT_SECRET')),
          res: context.req.res
        });

        return {
          id: user.id
        };
      } catch (e) {
        throw new AuthenticationError(e);
      }
    },

    logout(parent, args, context) {
      context.req.res.clearCookie(app.get('JWT_COOKIE_NAME'));
      return true;
    }
  };
};
