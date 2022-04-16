//Model for Quote table "quotes"
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("quote", {
        quote: {
            type: DataTypes.TEXT,
            defaultValue: false,
            unique: false,
        }
    }, {
        freezeTableName: true,
        timestamps: true,
        updatedAt: false,
        tableName: "quotes",
    });
};