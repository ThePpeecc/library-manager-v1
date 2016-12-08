/**
 * This file holds the server and route functionality for the books
 *
 * @summary   The module holds the books route and server functionality, it also is the place where we render the jade files
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

//Setup of router
var router = express.Router()

/* GET books page. */
router.get('/allBooks', function(req, res) {
    books.findAll({ //We get all the nessesary information on the books table
        order: [
            ['title', 'ASC'] //We order by the title
        ]
    }).then(function(books) {
        if (books) { //If we have books
            res.render('allBooks', { //We render the table with all the books
                books: books,
                title: 'Books'
            })
        } else {
            res.sendStatus(404) //Else we do not have book, so we send a 404
        }
    }).catch(function() {
        res.sendStatus(500) //Some error happende
    })
})


/* GET books overdue page */
router.get('/overdueBooks', function(req, res) {
    loans.findAll({ //We get all the nessesary information on the loans table
        include: [{
            model: books //We include the books
        }],
        where: {
            return_by: {
                lte: new Date() //Less than today. That means that the book is overdue
            },
            returned_on: null //And it must not have been returned
        },
        order: [
            [{
                model: books
            }, 'title', 'ASC'] //Sort by title
        ]
    }).then(function(loans) {
        var books = []
        loans.forEach(loan => {
            books.push(loan.book) //We take out the books and make a new array of the books
        })
        res.render('allBooks', { //We render the table with all the books
            books: books,
            title: 'Overdue Books'
        })
    }).catch(function() {
        res.sendStatus(500) //We got an error for some reason
    })
})

/* GET books overdue page. */
router.get('/checkedBooks', function(req, res) {
    loans.findAll({ //We get all the nessesary information on the loans table
        include: [{
            model: books //We include the books table
        }],
        where: {
            returned_on: null //The book must not have been returned yet
        },
        order: [
            [{
                model: books
            }, 'title', 'ASC'] //We order by title
        ]
    }).then(function(loans) {
        var books = []
        loans.forEach(loan => {
            books.push(loan.book) //We take the individual books out of the loan and put them in an array so our jade templates can display them
        })
        res.render('allBooks', { //We render the table with all the books
            books: books,
            title: 'Checked Out Books'
        })
    }).catch(function() {
        res.sendStatus(500) //We got an error for some reason
    })
})

//Gets the new book page
router.get('/new', function(req, res) {
    res.render('bookDetail', {
        book: books.build(), //We build an empty object
        title: 'New Book',
        buttonTitle: 'Create New Book',
        id: '',
        includeLoans: false, //We don't include loans
        errors: null //We don't have any errors by defualt
    })
})

/**
 * This function get the loan History aswell as the details of a book
 * @param  {Int} id     The id of the book
 * @return {promise}    We retrun a js promise
 */
var getBookInfo = function(id) {
    return books.findAll({
        include: [{
            model: loans, //We get the loans of the book
            include: [{
                model: patrons, //we get the patrons of the loans
                as: 'patron'
            }, {
                model: books, //We also get the book again, so we can reuse the _loan partial
                as: 'book'
            }]
        }],
        where: {
            id: id //We find the id of the book
        }
    })
}

//Get the details page of a book
router.get('/:id', function(req, res) {
    getBookInfo(req.params.id).then(function(books) {
        var book = books[0] //We take the book out of the array
        if (book) { //If there is a book
            res.render('bookDetail', { //We render the detail page with the loans
                book: book,
                title: book.title,
                buttonTitle: 'Save Edits',
                id: 'update/' + book.id,
                includeLoans: true,
                loans: book.loans,
                errors: null
            })
        } else {
            res.sendStatus(404) //No book means 404
        }
    }).catch(function() {
        res.sendStatus(500) //We got a server error for some reason
    })
})

//Creates a new book
router.post('/', function(req, res) {
    books.create(req.body).then(function() { //We create the book, and redirect to the allBooks page
        res.redirect('../books/allBooks')
    }).catch(function(err) { //In case of an error
        if (err.name === 'SequelizeValidationError') { //Is it an error we can deal with
            res.render('bookDetail', {
                book: books.build(req.body), //Send back the answers
                title: 'New Book',
                buttonTitle: 'Create New Book',
                id: '',
                includeLoans: false,
                errors: err.errors //Send the errors that needs fixing
            })
        } else {
            throw err //We cant deal with the error so we throw it
        }
    }).catch(function() {
        res.sendStatus(500) //Some error happende
    })
})

//Updates a book at a certain id
router.post('/update/:id', function(req, res) {
    books.findById(req.params.id).then(function(book) { //We find the book
        if (book) { //If we have the book
            return book.update(req.body) //We update it
        } else {
            res.sendStatus(404) //We send a 404 since we don't have a book
        }
    }).then(function() {
        res.redirect('../allBooks')
    }).catch(function(err) { //We got an error
        if (err.name === 'SequelizeValidationError') { //Is it an error we can deal with
            getBookInfo(req.params.id).then(function(bookList) {
                var book = bookList[0]
                if (book) {
                    res.render('bookDetail', {
                        book: books.build(req.body), //Send back the answers
                        title: book.title,
                        buttonTitle: 'Save Edits',
                        id: 'update/' + book.id,
                        includeLoans: true,
                        loans: book.loans,
                        errors: err.errors //Send back the errors that needs fixing
                    })
                } else {
                    res.sendStatus(404)
                }
            })
        } else {
            throw err
        }
    }).catch(function() {
        res.sendStatus(500)
    })
})

module.exports = router
