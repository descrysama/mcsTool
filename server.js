require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors')
const port = 5000;

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
    console.log("Db bridge connected 😊 ✅");
  })
  .catch((err) => {
    console.log("Failed to connect to db : " + err.message);
  });



const productRoutes = require('./routes/productRoutes');

app.use('/products', productRoutes);


app.listen(port, () => console.log('Serveur ouvert sur le port : ' + port))