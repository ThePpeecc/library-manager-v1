'use strict';
module.exports = function(sequelize, DataTypes) {
    var patrons = sequelize.define('patrons', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true // Automatically gets converted to SERIAL for postgres
        },
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        address: DataTypes.STRING,
        email: DataTypes.STRING,
        library_id: DataTypes.STRING,
        zip_code: DataTypes.INTEGER
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
    });
    return patrons;
};
