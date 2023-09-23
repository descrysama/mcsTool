require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors')
const port = 5500;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: process.env.HOST_URL,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const db = require("./models");
db.sequelize.sync()
  .then(() => {
    console.log("Db bridge connected 😈 🛠️  ✅");
  })
  .catch((err) => {
    console.log("Failed to connect to db : " + err.message);
  });

const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/user', userRoutes);
app.use('/order', orderRoutes);


app.listen(port, () => console.log('Server opened on : ' + port))