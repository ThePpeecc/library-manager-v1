/**
 * This file holds the primary server and route functionality
 *
 * @summary   The module holds the primary route and server functionality, it also is the place where we render the jade files
 *
 * @since     04.12.2016
 * @requires Node.js, express, body-parser & sequelize
 * @NOTE     [For devs only this module also uses eslint for code quality]
 **/

'use strict'

//We get our required module
var express = require('express')
var sequelize = require('./models').sequelize
var bodyParser = require('body-parser')


//we get our routes
var books = require('./routes/books')
var loans = require('./routes/loans')
var patrons = require('./routes/patrons')

var app = express()

//We setup our static server
app.use('/static', express.static(__dirname + '/public'))
app.use( bodyParser.json() )       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}))

//We specifi where to find our templates
app.set('view engine', 'jade')
app.set('views', __dirname + '/views')


/* GET home page. */
app.get('/', function(req, res) {
    res.render('index')
})

/*We refer to our routes*/
app.use('/books', books)
app.use('/loans', loans)
app.use('/patrons', patrons)

/* We connect to the database and set the server to litsten at 127.0.0.1:3000*/
sequelize.sync().then(function() {
    app.listen(3000)
})

module.exports = app
