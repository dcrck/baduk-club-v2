import passport from 'passport'
import jwt from 'jsonwebtoken'
import Auth0Strategy from 'passport-auth0'

const JWT_SECRET = process.env.JWT_SECRET
const prod = process.env.NODE_ENV === 'production'
const dev = process.env.NODE_ENV === 'development'

// generate a JWT from data
const generateJWT = (data, expiresIn) =>
  jwt.sign(data, JWT_SECRET, { expiresIn })

export function validate(req) {
  try {
    return jwt.verify(req.cookies['auth-user'], JWT_SECRET)
  } catch (error) {
    return { unauthorized: true, message: 'Unauthorized' }
  }
}

// add a JWT as a cookie to the inbound res object
function generateJWTCookie(res, data) {
  const TEN_HOURS = 60 * 60 * 10
  res.cookie('auth-user', generateJWT(data, TEN_HOURS), {
    httpOnly: true,
    secure: prod,
    maxAge: 1000 * TEN_HOURS,
  })
}

export default app => {
  passport.use(
    new Auth0Strategy(
      {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.APP_DOMAIN + '/auth/callback',
        state: false,
      },
      (accessToken, refreshToken, { id_token }, profile, done) => {
        // accessToken is the token to call Auth0 API (not needed in the most cases)
        // id_token has the JSON Web Token
        // profile has all the information from the user
        return done(null, { ...profile, id_token })
      }
    )
  )

  app.use(passport.initialize())

  app.get('/login', (req, res, next) => {
    const { redir, test } = req.query
    const state = redir
      ? Buffer.from(
          JSON.stringify({ redir: decodeURIComponent(redir) })
        ).toString('base64')
      : undefined
    const auth = passport.authenticate('auth0', {
      scope: 'openid email profile',
      state,
    })
    if (!dev || !test) auth(req, res, next)
    else {
      generateJWTCookie(res, {
        id: process.env.DEFAULT_USER_ID,
        email_verified: true,
      })
      return res.redirect('/')
    }
  })

  // Perform the final stage of authentication and redirect
  app.get('/auth/callback', function(req, res, next) {
    passport.authenticate('auth0', { session: false }, (err, user) => {
      if (err) return next(err)
      if (!user) return res.redirect('/login')

      req.login(user, { session: false }, err => {
        if (err) return next(err)
        let { id, id_token: token } = user
        const { email, email_verified } = user['_json']
        generateJWTCookie(res, { id, token, email, email_verified })
        // extract redirect URL from req
        try {
          const { state } = req.query
          const { redir } = JSON.parse(Buffer.from(state, 'base64').toString())
          if (typeof redir === 'string' && redir.startsWith('/')) {
            return res.redirect(redir)
          }
        } catch (e) {
          // just redirect to the home page by default
        }
        return res.redirect('/')
      })
    })(req, res, next)
  })

  app.get('/auth/email_verified', async (req, res) => {
    let redirectURL = '/'
    if (req.cookies['auth-user']) {
      const { id, token, email, email_verified } = await jwt.verify(
        req.cookies['auth-user'],
        JWT_SECRET
      )
      if (!email_verified) {
        generateJWTCookie(res, { id, token, email, email_verified: true })
        redirectURL += '?email_validated=true'
      }
    }
    return res.redirect(redirectURL)
  })

  // Perform session logout and redirect to homepage
  app.get('/logout', (req, res) => {
    req.logout()
    const url = process.env.APP_DOMAIN
    const clientId = process.env.AUTH0_CLIENT_ID
    res.clearCookie('auth-user')
    res.redirect(
      `https://${process.env.AUTH0_DOMAIN}/v2/logout?returnTo=${encodeURI(
        url
      )}&client_id=${clientId}`
    )
  })
}
