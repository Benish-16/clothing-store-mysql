const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectToMySQL, pool } = require('./db'); 

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
}));


app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.use('/api/auth', require('./routes/auth'));
app.use('/api/type',require('./routes/type'));
app.use("/api/contact", require("./routes/contact"))
app.use('/api/product',require('./routes/product'))
app.use('/api/cart',require('./routes/cart'))
app.use('/api/order',require('./routes/order'))
app.use("/api/subscribe", require("./routes/subscription"));


const startServer = async () => {
  await connectToMySQL(); 
  app.listen(port, () => {
    console.log(` Server running on port ${port}`);
  });
};

startServer();
