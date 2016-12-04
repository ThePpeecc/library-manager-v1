/**
 * This file holds the server and route functionality for the loans
 *
 * @summary   The module holds the loans route and server functionality, it also is the place where we render the jade files
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

/* GET loans page. */
router.get('/allLoans', function(req, res) {
    loans.findAll({ //We get all the nessesary information on the loans table
        include: [{
            model: books,
            as: "book"
        }, {
            model: patrons,
            as: "patron"
        }], //we also need information from books and patrons, so we include them here
        order: [
            ['loaned_on', 'DESC'],
            ['return_by', 'DESC']
        ]
    }).then(function(loans) {
        res.render('allLoans', {
            loans: loans
        })
    })
})

module.exports = router
