/**
 * This file holds the server and route functionality
 *
 * @summary   The module holds the route and server functionality, it also is the place where we render the jade files
 *
 * @since     07.11.2016
 * @requires Node.js & express
 * @NOTE     [For devs only this module also uses eslint for code quality]
 **/

//We get our required module
var express = require('express')

var app = express()

//We setup our static server
app.use('/static', express.static(__dirname + '/public'))

//We specifi where to find our templates
app.set('view engine', 'jade')
app.set('views', __dirname + '/views')


/* GET home page. */
app.get('/', function(req, res) {
  res.render('index')
})

/* GET books page. */
app.get('/books', function(req, res) {
  res.render('index')
})

/* GET patrons page. */
app.get('/patrons', function(req, res) {
  res.render('index')
})

/* GET loans page. */
app.get('/loans', function(req, res) {
  res.render('index')
})



/* We set the server to litsten at 127.0.0.1:3000*/
app.listen(3000)
