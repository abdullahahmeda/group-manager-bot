const express = require('express')
const nunjucks = require('nunjucks')
const path = require('path')
const jsonfile = require('jsonfile')
const session = require('express-session')
const { paths } = require('../constants')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.resolve(__dirname, 'public')))

app.use(session({
  secret: 'h6[pSJQ>"mgWx&7j',
  resave: false,
  saveUninitialized: true
}))

nunjucks.configure(path.resolve(__dirname, 'views'), {
  autoescape: true,
  express: app,
  noCache: true
})

app.get('/', async (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login')
  }
  const automaticReplies = await jsonfile.readFile(paths.automaticReplies)
  res.render('index.html', {
    automaticReplies
  })
})

app.get('/mentions', async (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login?r=mentions')
  }
  const mentionReplies = await jsonfile.readFile(paths.mentionReplies)
  res.render('mentions.html', {
    mentionReplies
  })
})

app.get('/login', (req, res) => {
  res.render('login.html', {
    r: req.query.r ? `/${req.query.r}` : undefined
  })
})

app.post('/login', (req, res) => {
  if (req.body.email === 'Nomani1993@gmail.com' && req.body.password === 'Aa112233') {
    req.session.isLoggedIn = true
    return req.session.save((_) => res.redirect(req.body.r ? req.body.r : '/'))
  }
  res.render('login.html', {
    error: 'الإيميل أو كلمة السر غير صحيحين'
  })
})

app.post('/save', (req, res) => {
  jsonfile.writeFile(req.body.type === 'automatic' ? paths.automaticReplies : paths.mentionReplies, req.body.replies)
    .then(() => res.json({ ok: true, message: 'تم تحديث الردود بنجاح' }))
    .catch((error) => {
      console.log(error)
      res.json({ ok: false, message: 'حدث خطأ ما. يرجى إعادة المحاولة' })
    })
})

module.exports = app
