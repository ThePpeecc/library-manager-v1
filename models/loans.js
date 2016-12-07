'use strict'
module.exports = function(sequelize, DataTypes) {
    var loans = sequelize.define('loans', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true // Automatically gets converted to SERIAL for postgres
        },
        book_id: {
            type: DataTypes.INTEGER,
            validate: {
                notEmpty: {
                    msg: 'A loaned book is nessesary'
                }
            }
        },
        patron_id: {
            type: DataTypes.INTEGER,
            validate: {
                notEmpty: {
                    msg: 'A patron is required'
                }
            }
        },
        loaned_on: {
            type: DataTypes.DATE,
            validate: {
                notEmpty: {
                    msg: 'Loaned on Date is required'
                },
                isDate: {
                    msg: 'Valid Date is required in the loaned on date'
                }
            }
        },
        return_by: {
            type: DataTypes.DATE,
            validate: {
                notEmpty: {
                    msg: 'Retrun by Date is required'
                },
                isDate: {
                    msg: 'Valid Date is required in the return by date'
                }
            }
        },
        returned_on: {
            type: DataTypes.DATE,
            validate: {
                isDate: {
                    msg: 'Valid Date is required in the returned on date'
                }
            }
        }
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
                loans.belongsTo(models.patrons, {
                    foreignKey: 'patron_id'
                })
                loans.belongsTo(models.books, {
                    foreignKey: 'book_id'
                })
            }
        },
        timestamps: false
    })
    return loans
}
