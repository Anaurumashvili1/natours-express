const dotenv = require('dotenv');

const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './.env' });

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
    family: 4,
  })
  .then((res) => {
    console.log(res);
  })
  .catch((err) => console.log(err));

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

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED');
  server.close(() => {
    console.log('process terminated');
  });
});
