


const testConnection = async () => {
    await sequelize.authenticate();
  };

const connectToDatabase = async (attempt = 0) => {
    try {
      await testConnection();
      console.log("Connected to database");
      await sequelize.sync();
      try {
        await runMigrations();
      }
      catch (err) {
        logError(err);
        console.log("Failed to run migrations: \n " + err);
      }
    }
    catch (err) {
      logError(err);
      if (attempt === DB_CONNECTION_RETRY_LIMIT) {
        console.log(`Connection to database failed after ${attempt} attempts`);
        return process.exit(1);
      }
      console.log(
        `Connection to database failed! Attempt ${attempt} of ${DB_CONNECTION_RETRY_LIMIT}`,
      );
      await sleep(5000);
      return connectToDatabase(attempt + 1);
    }
    return null;
  };