const { query } = require("express");
const express = require("express");
// const { connectDB } = require("./loaders/db");

const app = express();

app.use("/public", express.static('public'));

// connectDB;





require('./routers/index')(app);



app.listen(3000, () => {
    console.log(`Server is running on port: 3000`);
    //route


});