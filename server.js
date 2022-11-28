const dotenv = require('dotenv');

const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './.env' });

// const DB = process.env.DATABASE;

mongoose
  .connect(
    'mongodb+srv://Ana:448848@cluster0.5gynyhe.mongodb.net/Natours?retryWrites=true',
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      family: 4,
    }
  )
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
