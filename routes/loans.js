/**
 * This file holds the server and route functionality for the loans
 *
 * @summary   The module holds the loans route and server functionality, it also is the place where we render the jade files
 *
 * @since     04.12.2016
 * @requires Node.js & express
 * @NOTE     [For devs only this module also uses eslint for code quality]
 **/

'use strict'

//We get our required module
var express = require('express')

//We get our tables
var books = require('../models').books
var patrons = require('../models').patrons
var loans = require('../models').loans

var router = express.Router()

/* GET loans page. */
router.get('/allLoans', function(req, res) {
    loans.findAll({ //We get all the nessesary information on the loans table
        include: [{
            model: books,
            as: 'book'
        }, {
            model: patrons,
            as: 'patron'
        }], //we also need information from books and patrons, so we include them here
        order: [
            ['loaned_on', 'DESC'],
            ['return_by', 'DESC']
        ]
    }).then(function(loans) {
        res.render('allLoans', { //We render the page
            loans: loans,
            title: 'Loans'
        })
    }).catch(function() {
        res.sendStatus(500) //We got some error
    })
})

/*Get Overdue Loans page*/
router.get('/overdueLoans', function(req, res) {
    loans.findAll({ //We get all the nessesary information on the loans table
        include: [{
            model: books,
            as: 'book'
        }, {
            model: patrons,
            as: 'patron'
        }], //we also need information from books and patrons, so we include them here
        where: {
            return_by: {
                lte: new Date() //Less than today
            },
            returned_on: null
        },
        order: [
            ['loaned_on', 'DESC'], //We order by the loaned_on and return_by dates
            ['return_by', 'DESC']
        ]
    }).then(function(loans) {
        res.render('allLoans', { //Render the page
            loans: loans,
            title: 'Overdue Loans'
        })
    }).catch(function() {
        res.sendStatus(500) //Some error
    })
})

/*Get checked out Loans page*/
router.get('/checkedLoans', function(req, res) {
    loans.findAll({ //We get all the nessesary information on the loans table
        include: [{
            model: books,
            as: 'book'
        }, {
            model: patrons,
            as: 'patron'
        }], //we also need information from books and patrons, so we include them here
        where: {
            returned_on: null //The book has not returned
        },
        order: [
            ['loaned_on', 'DESC'],
            ['return_by', 'DESC']
        ]
    }).then(function(loans) {
        res.render('allLoans', { //Render the page
            loans: loans,
            title: 'Checked Out Books'
        })
    }).catch(function() {
        res.sendStatus(500) //some error
    })
})

//Gets the new loan page
router.get('/new', function(req, res) {
    //This is not the best way of getting data from the database
    books.findAll({ //First we get all books
        order: [
            ['title', 'ASC']
        ]
    }).then(function(books) {
        patrons.findAll({ //Then we get all teh patrons
            order: [
                ['last_name', 'ASC'],
                ['first_name', 'ASC']
            ]
        }).then(function(patrons) {
            var date = new Date()
            res.render('newLoan', {
                books: books, //Here we give the books for the selectboks
                patrons: patrons, //here we give the patrons for the selectboks
                today: date,
                tomorrow: new Date(new Date().setDate(date.getDate() + 7)), //The date 7 days from today
                errors: null
            })
        }).catch(function() {
            res.sendStatus(500)
        })
    }).catch(function() {
        res.sendStatus(500) //Some error
    })
})

//Gets the return book page
router.get('/return/:id', function(req, res) {
    loans.findById(req.params.id, {
        include: [{
            model: patrons, //we get the patrons of the loans
            as: 'patron'
        }, {
            model: books, //We also get the book again, so we can reuse the _loan partial
            as: 'book'
        }]
    }).then(function(loan) {
        if (loan) {
            res.render('returnBook', {
                book: loan.book,
                patron: loan.patron,
                loan: loan,
                loaned_on: new Date(loan.loaned_on).toDateString(),
                return_by: new Date(loan.return_by).toDateString(),
                returnBy: new Date().toDateString(),
                errors: null
            })
        } else {
            res.sendStatus(404)
        }
    }).catch(function() {
        res.sendStatus(500) //Some error
    })
})

//Updates a loan with a returned_on date
router.post('/:id', function(req, res) {
    loans.findById(req.params.id).then(function(loan) {
        return loan.update(req.body)
    }).then(function() {
        res.redirect('/loans/allLoans')
    }).catch(function(err) {
        if (err.name === 'SequelizeValidationError') {
            loans.findById(req.params.id, {
                include: [{
                    model: patrons, //we get the patrons of the loans
                    as: 'patron'
                }, {
                    model: books, //We also get the book again, so we can reuse the _loan partial
                    as: 'book'
                }]
            }).then(function(loan) {
                res.render('returnBook', {
                    book: loan.book,
                    patron: loan.patron,
                    loan: loan,
                    loaned_on: new Date(loan.loaned_on).toDateString(),
                    return_by: new Date(loan.return_by).toDateString(),
                    returnBy: req.body.returned_on,
                    errors: err.errors
                })
            })
        } else {
            throw err
        }
    }).catch(function() {
        res.sendStatus(500)
    })
})

//Creates a new loan
router.post('/', function(req, res) {
    loans.create(req.body).then(function() {
        res.redirect('../loans/allLoans') //If the loan is aokay we redirect back to the allLoans page
    }).catch(function(err) {
        if (err.name === 'SequelizeValidationError') { //Is it an error we can deal with
            //Here we get all books and all patrons
            books.findAll({
                order: [
                    ['title', 'ASC']
                ]
            }).then(function(books) {
                return patrons.findAll({
                    order: [
                        ['last_name', 'ASC'],
                        ['first_name', 'ASC']
                    ]
                }).then(function(patrons) {
                    //We have gotten allBooks and all the patrons
                    res.render('newLoan', {
                        books: books,
                        patrons: patrons,
                        today: req.body.loaned_on,
                        tomorrow: req.body.return_by,
                        errors: err.errors //We render the page with our errors
                    })
                }).catch(function() {
                    res.sendStatus(500)
                })
            }).catch(function() {
                res.sendStatus(500)
            })
        } else {
            throw err //We can't deal with the error so we throw it
        }
    }).catch(function() {
        res.sendStatus(500)
    })
})

module.exports = router
