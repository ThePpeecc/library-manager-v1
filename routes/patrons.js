/**
 * This file holds the server and route functionality for the patrons
 *
 * @summary   The module holds the patrons route and server functionality, it also is the place where we render the jade files
 *
 * @since     07.11.2016
 * @requires Node.js & express
 * @NOTE     [For devs only this module also uses eslint for code quality]
 **/

//We get our required module
var express = require('express')

//We get our tables
var books = require('../models').books
var patrons = require('../models').patrons
var loans = require('../models').loans

var router  = express.Router()

/* GET patrons page. */
router.get('/allPatrons', function(req, res) {
    patrons.findAll({ //We get all the nessesary information on the patrons table
        order: [
            ['last_name', 'ASC'],
            ['first_name', 'ASC']
        ]
    }).then(function(patrons) {
        res.render('allPatrons', {
            patrons: patrons
        })
    })
})

module.exports = router
