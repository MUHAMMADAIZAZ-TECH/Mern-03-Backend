require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const routes = require('./routes/routes');

//database connection
connection();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cors());

//routes
app.use('/', routes);
const port = process.env.PORT || 8080;

app.listen(port,()=>console.log(`Listening on port ${port}...`))
