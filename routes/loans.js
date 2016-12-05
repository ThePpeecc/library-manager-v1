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

var router = express.Router()

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
            loans: loans,
            title: 'Loans'
        })
    })
})


router.get('/overdueLoans', function(req, res) {
    loans.findAll({ //We get all the nessesary information on the loans table
        include: [{
            model: books,
            as: "book"
        }, {
            model: patrons,
            as: "patron"
        }], //we also need information from books and patrons, so we include them here
        where: {
            return_by: {
                lte: new Date() //Less than today
            },
            returned_on: null
        },
        order: [
            ['loaned_on', 'DESC'],
            ['return_by', 'DESC']
        ]
    }).then(function(loans) {
        res.render('allLoans', {
            loans: loans,
            title: 'Overdue Loans'
        })
    })
})

router.get('/checkedLoans', function(req, res) {
    loans.findAll({ //We get all the nessesary information on the loans table
        include: [{
            model: books,
            as: "book"
        }, {
            model: patrons,
            as: "patron"
        }], //we also need information from books and patrons, so we include them here
        where: {
            returned_on: null
        },
        order: [
            ['loaned_on', 'DESC'],
            ['return_by', 'DESC']
        ]
    }).then(function(loans) {
        res.render('allLoans', {
            loans: loans,
            title: 'Checked Out Books'
        })
    })
})

router.get('/new', function(req, res) {
    books.findAll({
        order: [
            ['title', 'ASC']
        ]
    }).then(function(books) {
        patrons.findAll({
            order: [
                ['last_name', 'ASC'],
                ['first_name', 'ASC']
            ]
        }).then(function(patrons) {
          var date = new Date()
          res.render('newLoan', {
            books: books,
            patrons: patrons,
            today: date,
            tomorrow: new Date(new Date().setDate(date.getDate() + 7))
          })
        })
    })
})

router.get('/:id', function(req, res) {
  loans.findById(req.params.id).then(function(loan) {
      return loan.update({returned_on: new Date()})
  }).then(function() {
      res.redirect('back')
  })
})

router.post('/', function(req, res) {
  loans.create(req.body).then(function() {
    res.redirect('../loans/allLoans')
  })
})

module.exports = router
