/**
 * This file holds the server and route functionality for the patrons
 *
 * @summary   The module holds the patrons route and server functionality, it also is the place where we render the jade files
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

/* GET patrons page. */
router.get('/allPatrons', function(req, res) {
    patrons.findAll({ //We get all the nessesary information on the patrons table
        order: [
            ['last_name', 'ASC'],
            ['first_name', 'ASC']
        ]
    }).then(function(patrons) {
        res.render('allPatrons', { //We render the page
            patrons: patrons
        })
    }).catch(function() {
        res.sendStatus(500) //If we get an error
    })
})

//Gets the new patron page
router.get('/new', function(req, res) {
    res.render('patronDetail', {
        patron: patrons.build(),
        title: 'New Patron',
        buttonTitle: 'Create New Patron',
        id: 'create',
        includeLoans: false
    })
})

/**
 * Gets the patrons promise with the patron information and thier loan story
 * @param  {Int} id     The id of the patron
 * @return {Promise}    Returns a javascript promise
 */
var patronDetail = function(id) {
    return patrons.findAll({
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
            id: id
        }
    })
}

//Gets the detail page
router.get('/:id', function(req, res) {
    patronDetail(req.params.id).then( //We get the patron details
        function(patrons) {
            var patron = patrons[0] //We take the patron out of the array
            if (patron) { //If he exist
                res.render('patronDetail', { //We render the patron detail page
                    patron: patron,
                    title: patron.first_name + ' ' + patron.last_name,
                    buttonTitle: 'Save Edits',
                    id: 'update/' + patron.id,
                    includeLoans: true,
                    loans: patron.loans,
                    errors: null
                })
            } else {
                res.sendStatus(404) //we send 404 if he dose not exist
            }
        }).catch(function() {
            res.sendStatus(500) //Incase of a server error
        })
})

//Updates the patron page
router.post('/update/:id', function(req, res) {
    patrons.findById(req.params.id).then(function(patron) { //We find the patron
        return patron.update(req.body) //We try to update the patron
    }).then(function() { //If the update goes well
        res.redirect('../' + req.params.id) //We redirect to their patron details page
    }).catch(function(err) { //We got an error
        if (err.name === 'SequelizeValidationError') { //Is it an error we can deal with
            patronDetail(req.params.id).then( //We get the patrons information (So we still can display thier loans)
                function(patronList) {
                    var patron = patronList[0]
                    if (patron) { //If the patron exist
                        res.render('patronDetail', { //We render the details page
                            patron: patrons.build(req.body), //We take the information they tried to update and display it
                            title: patron.first_name +' ' + patron.last_name,
                            buttonTitle: 'Save Edits',
                            id: 'update/' + patron.id,
                            includeLoans: true,
                            loans: patron.loans,
                            errors: err.errors //We also display the errors
                        })
                    } else {
                        res.sendStatus(404) //Incase the id dose not exist (highly unlikely)
                    }
                })
        } else {
            throw err //We cant deal with the error so we throw it
        }
    }).catch(function() {
        res.sendStatus(500)
    })
})

//Creates a new patron
router.post('/create', function(req, res) {
    patrons.create(req.body).then(function() {
        res.redirect('../patrons/allPatrons') //We try to create a patron
    }).catch(function(err) { //We got an error
        if (err.name === 'SequelizeValidationError') { //Can we deal with the error?
            res.render('patronDetail', { //Re render the create page with errors
                patron: patrons.build(req.body),
                title: 'New Patron',
                buttonTitle: 'Create New Patron',
                id: 'create',
                includeLoans: false,
                errors: err.errors
            })
        } else {
            throw err
        }
    }).catch(function() {
        res.sendStatus(500) //We get an error
    })
})

module.exports = router
