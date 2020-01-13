import sirv from 'sirv'
import express from 'express'
import compression from 'compression'
import * as sapper from '@sapper/server'
import cookieParser from 'cookie-parser'

import './tailwind.css'

import setupAuth, { validate } from './auth'
import { setupMail } from './mailer'
import { scheduleTasks } from './scheduler'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

const app = express()

// caching disabled for every route
function disableCache(...[, res, next]) {
  const cacheControl = vars => ['Cache-Control', vars.join(', ')]
  const defaultControl = [
    'no-cache',
    'private',
    'no-store',
    'must-revalidate',
    'max-stale=0',
    'post-check=0',
    'pre-check=0',
  ]
  res.set(...cacheControl(defaultControl))
  if (!dev) {
    const origSetHeader = res.setHeader
    res.setHeader = function(key, value) {
      return key === 'Cache-Control' && value === 'max-age=600'
        ? origSetHeader.apply(this, cacheControl([...defaultControl, value]))
        : origSetHeader.apply(this, arguments)
    }
  }
  next()
}

app.use(
  disableCache,
  compression({ threshold: 0 }),
  sirv('static', { dev }),
  cookieParser()
)

setupAuth(app)
setupMail()
scheduleTasks()

app
  .use(
    sapper.middleware({
      session: req => {
        const user = validate(req)
        return { user: user.unauthorized ? null : user }
      },
    })
  )
  .listen(PORT, err => {
    /* eslint-disable no-console */
    if (err) console.log('error', err)
  })
