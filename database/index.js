require("dotenv").config();
const Sequelize = require("sequelize");
const Umzug = require("umzug");
var sequelize;


sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

const Quote = require("./migrations/Quote")(sequelize, Sequelize.DataTypes);

const testConnection = async () => {
    await sequelize.authenticate();
};

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


const getTelegramQuote = async (id) => {
    var quote = await Quote.findOne({
        where: {
            id: id,
        },
    });
    return quote.quote;
};

const getQuoteAmount = async () => {
    return Quote.count();
}

const saveNewQuote = async (quoteToAdd) => {
    return await Quote.create({quote: quoteToAdd})
};


module.exports = {
  sequelize,
  connectToDatabase,
  saveNewQuote,
  getTelegramQuote,
  getQuoteAmount,
};