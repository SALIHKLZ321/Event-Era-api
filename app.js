/* eslint-disable import/extensions */
/* eslint-disable semi  */
import dotenv from 'dotenv'
import express from 'express';
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import userRoute from './routes/user.js';
import vendorRoute from './routes/vendor.js';
import adminRoute from './routes/admin.js';

const app = express();
dotenv.config()
const database = process.env.DBL;
mongoose.set('strictQuery', false);
mongoose
  .connect(database)
  .then(() => {
    console.log('mongoose connected');
  })
  .catch((err) => {
    console.log('mongoose connection failed: ', err);
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  );
  next();
});

app.use('/user', userRoute);
app.use('/vendor', vendorRoute);
app.use('/admin', adminRoute)

app.listen(3000);
