require('dotenv').config();
const connectTOMongo=require('./db');
const express=require('express');
const cors=require('cors');
const passport = require("passport");
const jwt = require("jsonwebtoken");
connectTOMongo();
const app=express();
const port=5000
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000' 
}));
app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.use('/api/auth',require('./routes/auth'))
app.use('/api/product',require('./routes/product'))
app.use('/api/cart',require('./routes/cart'))
app.use('/api/order',require('./routes/order'))
app.use('/api/type',require('./routes/type'))
app.use("/api/contact", require("./routes/contact"));
app.use("/api/subscribe", require("./routes/subscription"));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
