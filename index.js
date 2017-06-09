const express = require('express')
const app = express()
const bodyParser= require('body-parser')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
const MongoClient = require('mongodb').MongoClient

var App = require('./public/App.js')
var db

app.get('/', function (req, res) {
  console.log('-------')
  // db.collection('quotes').find().toArray((err, result) => {
  //   if (err) return console.log(err)
  //   // renders index.ejs
  //   res.render('index.ejs', {quotes: result})
  // })
  // res.send('Hello Hooks!')
})

app.post('/screen1', function (req, res) {
  App.screen1()
  res.send('Screen1')
})

app.get('/screen2', function (req, res) {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {quotes: result})
  })
})

// app.post('/screen3', function (req, res) {
//    res.send('Screen3')
// })

app.post('/quotes', function (req, res, err) {
  console.log(req.body)
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/screen2')
  })
  // res.send('Screen1')
})
app.post('/searchQuotes', function (req, res) {
  console.log(req.body.name)
  db.collection("quotes").findOne({name: req.body.name}, function(err, result) {
    if (err) throw err
    console.log(result)
  })
})
app.post('/updateQuote', function (req, res) {
  console.log(req.body.name)
  db.collection("quotes").update({name: req.body.name}, {$set:{'quote':'Hello milan'}}, function(err, result) {
    if (err) throw err
  })
})

app.post('/sendMail', function (req, res) {
  var api_key = 'key-0906ebb53f9b270b4661b46a7d40fdfd';
  var domain = 'sandbox3cb6ba5bf0b546f7b1676ca01f0b3402.mailgun.org';
  var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

  var data = {
    from: 'From Milan Mail Gun <postmaster@sandbox3cb6ba5bf0b546f7b1676ca01f0b3402.mailgun.org>',
    to: 'tarunsaisuvvada@gmail.com',
    subject: 'Hello Milan',
    text: 'Testing some Mailgun awesomness!'
  };

  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  })
})
MongoClient.connect('mongodb://milan:milan123@ds163681.mlab.com:63681/star-war-quotes', (err, database) => {
  uri_decode_auth: true
  if (err) return console.log(err)
  db = database
  app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
  })
})
