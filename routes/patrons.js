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

var router = express.Router()

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

router.get('/new', function(req, res) {
    res.render('patronDetail', {
        patron: patrons.build(),
        title: 'New Patron',
        buttonTitle: 'Create New Patron',
        id: 'create',
        includeLoans: false
    })
})

router.get('/:id', function(req, res) {
  patrons.findAll({
      include: [{
          model: loans, //We get the loans of the book
          include: [{
              model: patrons, //We get the patrons again, so we can reuse the _loan partial
              as: 'patron'
          }, {
              model: books, //We also get the book
              as: 'book'
          }]
      }],
      where: {
          id: req.params.id
      }
  }).then(function(patrons) {

    var patron = patrons[0]

    res.render('patronDetail', {
        patron: patron,
        title: patron.title,
        buttonTitle: 'Save Edits',
        id: 'update/' + patron.id,
        includeLoans: true,
        loans: patron.loans
    })
  })
})

router.post('/update/:id', function(req, res) {
    patrons.findById(req.params.id).then(function(patron) {
        return patron.update(req.body)
    }).then(function(patron) {
        res.redirect("../" + req.params.id)
    })
})

router.post('/create', function(req, res) {
    patrons.create(req.body).then(function(patron) {
        res.redirect('../patrons/allPatrons')
    })
})

module.exports = router
