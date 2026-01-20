// db.js
require('dotenv').config(); // load .env variables first
const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
 
  } catch (error) {
    
    process.exit(1);
  }
};

module.exports = connectToMongo;
