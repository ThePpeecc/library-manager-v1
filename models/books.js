'use strict';
module.exports = function(sequelize, DataTypes) {
    var books = sequelize.define('books', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true // Automatically gets converted to SERIAL for postgres
        },
        title: DataTypes.STRING,
        author: DataTypes.STRING,
        genre: DataTypes.STRING,
        first_published: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
                books.hasMany(models.loans, {
                    foreignKey: 'book_id'
                })
            }
        },
        timestamps: false
    });
    return books;
};
