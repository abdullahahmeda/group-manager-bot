const express = require('express')
const nunjucks = require('nunjucks')
const path = require('path')
const jsonfile = require('jsonfile')
const { paths } = require('../constants')

const app = express()

app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'public')))

nunjucks.configure(path.resolve(__dirname, 'views'), {
  autoescape: true,
  express: app,
  noCache: true
})

app.get('/', async (req, res) => {
  const automaticReplies = await jsonfile.readFile(paths.automaticReplies)
  res.render('index.html', {
    automaticReplies
  })
})

app.post('/save', (req, res) => {
  jsonfile.writeFile(paths.automaticReplies, req.body)
    .then(() => res.json({ ok: true, message: 'تم تحديث الردود بنجاح' }))
    .catch((error) => {
      console.log(error)
      res.json({ ok: false, message: 'حدث خطأ ما. يرجى إعادة المحاولة' })
    })
})

module.exports = app
