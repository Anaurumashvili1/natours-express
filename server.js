const dotenv = require('dotenv');

const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {});

const app = require('./app');

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log('listening', port);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close();
  process.exit(1);
});
