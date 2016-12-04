'use strict';
module.exports = function(sequelize, DataTypes) {
    var loans = sequelize.define('loans', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true // Automatically gets converted to SERIAL for postgres
        },
        book_id: DataTypes.INTEGER,
        patron_id: DataTypes.INTEGER,
        loaned_on: DataTypes.DATE,
        return_by: DataTypes.DATE,
        returned_on: DataTypes.DATE
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
                loans.belongsTo(models.patrons, {
                    foreignKey: 'patron_id'
                });
                loans.belongsTo(models.books, {
                    foreignKey: 'book_id'
                });
            }
        },
        timestamps: false
    });
    return loans;
};
