// const sequelize = require("../db");// this was auto created
// const { DataTypes } = require("sequelize/types");// this was auto created

module.exports = (sequelize, DataTypes) => {
    const Journal =sequelize.define('journal', 
    {
        title:
        {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: 
        {
            type: DataTypes.STRING,
            allowNull: false
        },
        entry:
        {
            type: DataTypes.STRING,
            allowNull: false
        },
        owner:
        {
            type: DataTypes.INTEGER
        }
    })
    return Journal;
};