require("dotenv").config();
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const Umzug = require("umzug");
var sequelize;

//Sequelize connection config
sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

//Quote model
const Quote = require("./migrations/Quote")(sequelize, Sequelize.DataTypes);

//Initial connection test, if fails bot shuts down
const testConnection = async () => {
    await sequelize.authenticate();
};

//Migration, atm unnecessary due to structure of heroku postgres
const runMigrations = async () => {
    const migrator = new Umzug({
        storage: "sequelize",
        storageOptions: {
            sequelize,
            tableName: "migrations",
        },
        migrations: {
            params: [sequelize.getQueryInterface()],
            path: `${process.cwd()}/database/migrations`,
            pattern: /\.js$/,
        },
    });
    const migrations = await migrator.up();
    console.log("Ran the following migrations: ", {
        files: migrations.map((mig) => mig.file),
    });
};

//Initial test of connection and sync
const connectToDatabase = async () => {
    try{
        await testConnection();
        console.log("Connected to database");
        await sequelize.sync();
    }
    catch(error){
        console.log("Database connection failed: \n" + error);
        return process.exit(1);
    }
};

//Returns telegram quote with id
const getTelegramQuote = async (id) => {
    var quote = await Quote.findOne({
        where: {
            id: id,
        },
    });
    return quote.quote;
};

//Returns the amount of saved telegram quotes
const getQuoteAmount = async () => {
    return Quote.count();
}

//Returns telegram quote that has given search term (simple search)
const getCategoryQuote = async (category) => {
    var quote = await Quote.find({
        where: {
            quote: {
                [Op.iLike]: '%' + category + '%'
            }
        }
    })
    if (quote) {
        return quote.quote;
    }
    return quote;
}

//Saves new quote
const saveNewQuote = async (quoteToAdd) => {
    return await Quote.create({quote: quoteToAdd})
};


module.exports = {
  sequelize,
  connectToDatabase,
  saveNewQuote,
  getTelegramQuote,
  getQuoteAmount,
  getCategoryQuote,
};