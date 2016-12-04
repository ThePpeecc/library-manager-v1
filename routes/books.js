/**
 * This file holds the server and route functionality for the books
 *
 * @summary   The module holds the books route and server functionality, it also is the place where we render the jade files
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

/* GET books page. */
router.get('/allBooks', function(req, res) {
    books.findAll({ //We get all the nessesary information on the books table
        order: [
            ['title', 'ASC']
        ]
    }).then(function(books) {
        res.render('allBooks', { //We render the table with all the books
            books: books,
            title: 'Books'
        })
    })
})

/* GET books overdue page. */
router.get('/overdueBooks', function(req, res) {
    loans.findAll({ //We get all the nessesary information on the books table
        include: [{
            model: books
        }],
        where: {
            return_by: {
                lte: new Date()
            },
            returned_on: null
        },
        order: [
            [{
                model: books
            }, 'title', 'ASC']
        ]
    }).then(function(loans) {

        var books = []

        loans.forEach(loan => {
            books.push(loan.book)
        })
        res.render('allBooks', { //We render the table with all the books
            books: books,
            title: 'Overdue Books'
        })
    })
})

/* GET books overdue page. */
router.get('/checkedBooks', function(req, res) {
    loans.findAll({ //We get all the nessesary information on the books table
        include: [{
            model: books
        }],
        where: {
            returned_on: null
        },
        order: [
            [{
                model: books
            }, 'title', 'ASC']
        ]
    }).then(function(loans) {

        var books = []

        loans.forEach(loan => {
            books.push(loan.book)
        })
        console.log(books);
        res.render('allBooks', { //We render the table with all the books
            books: books,
            title: 'Checked Books'
        })
    })
})

module.exports = router
