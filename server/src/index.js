import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import routes from './routes.js';

dotenv.config();
path.__dirname = path.resolve();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(path.__dirname, 'client/build')));
app.use(routes);

console.log('MongoDB starting...');
mongoose.connect(
  process.env.DB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      //connectedToMongoDB = false;
      console.error(`MongoDB error - ${err}`);
    }
  }
);

const { connection } = mongoose;

connection.once('open', () => {
  //connectedToMongoDB = true;
  console.log('MongoDB started');

  const APP_PORT = process.env.PORT || 3000;
  app.listen(APP_PORT, () => {
    console.log(`Server started on ${APP_PORT}`);
  });
});
