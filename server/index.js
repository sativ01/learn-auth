const express = require('express')
const passport = require('passport')
const session = require('express-session')
const cors = require('cors')

const { Strategy: TwitterStrategy } = require('passport-twitter')

const GitHubStrategy = require('passport-github').Strategy;

const config = require('./config')

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);


const PORT = process.env['PORT'] || 3000
const HTTPS = process.env['HTTPS'] || false
const HOST = process.env['HOST'] || 'localhost'

const HOME_URL = `${HTTPS ? 'https' : 'http'}://${HOST}:${PORT}`
const WEB_CLIENT_URL = 'http://localhost:3001'

app.use(express.json())

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize())
app.use(passport.session());

//allow us to save the user into the session
passport.serializeUser((user, cb) => cb(null, user))
passport.deserializeUser((obj, cb) => cb(null, obj))

passport.use(new GitHubStrategy(
  config.GITHUB,
  (accessToken, refreshToken, profile, cb) => {
    const user = {
      name: profile.username,
      photo: profile.photos[0].value
    }
    console.log(`User ${user.name} is aithenticated`)
    return cb(null, user);
  }
));

app.use(cors({
  origin: WEB_CLIENT_URL
}))

// saveUninitialized: true allows us to attach the socket id
// to the session before we have authenticated with Twitter  
app.use(session({
  secret: config.SOCKET.secert,
  resave: true,
  saveUninitialized: true
}))

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
})

const addSocketIdtoSession = (req, res, next) => {
  req.session.socketId = req.query.socketId
  next()
}


app.get('/auth/github',
  addSocketIdtoSession,
  passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, emmit socket io data
    io.in(req.session.socketId).emit('user', req.user)
    res.end()
  });

http.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});