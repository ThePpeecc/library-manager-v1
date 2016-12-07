'use strict'
module.exports = function(sequelize, DataTypes) {
    var patrons = sequelize.define('patrons', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true // Automatically gets converted to SERIAL for postgres
        },
        first_name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: 'First name is required'
                }
            }
        },
        last_name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: 'Last name is required'
                }
            }
        },
        address: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: 'An address is required'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: 'An email is required'
                }
            }
        },
        library_id: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: 'The patron needs a library id'
                }
            }
        },
        zip_code: {
            type: DataTypes.INTEGER,
            validate: {
                notEmpty: {
                    msg: 'Zip code is required'
                },
                isInt: {
                    msg: 'The zip code needs to be a number like "6800"'
                }
            }
        }
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
                patrons.hasMany(models.loans, {
                    foreignKey: 'patron_id'
                })
            }
        },
        timestamps: false
    })
    return patrons
}
